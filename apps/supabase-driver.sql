-- Jaga Toko: driver & pencarian driver terdekat
create or replace function public.jt_now_ms() returns bigint language sql volatile as
$$ select (extract(epoch from clock_timestamp()) * 1000)::bigint $$;

create or replace function public.jt_dist(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
returns double precision language sql immutable as $$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)))
$$;

-- radius pencarian (meter) menurut lama pencarian (detik): 0-90s 1 km, lalu 2, 3, 5 km
create or replace function public.jt_radius(elapsed_s double precision) returns double precision language sql immutable as $$
  select case when elapsed_s < 90 then 1000 when elapsed_s < 150 then 2000 when elapsed_s < 210 then 3000 else 5000 end::double precision
$$;

create or replace function public.jt_driver_id(h text) returns text language sql immutable as $$ select 'd' || left(h, 20) $$;

-- driver siap menerima order: online, lokasi segar (<20 menit), tidak sedang membawa order
create or replace function public.jt_driver_free(did text, d jsonb) returns boolean language sql stable as $$
  select coalesce((d->>'online')::boolean, false)
     and not exists (select 1 from public.docs o where o.col = 'orders' and o.data->>'driverId' = did and o.data->>'status' in ('driver_ke_toko','diantar'))
$$;

-- apakah order (status mencari_driver) boleh ditawarkan ke driver ini; mengembalikan jarak (m), -1 bila lokasi tidak diketahui, null bila tidak boleh
create or replace function public.jt_offer_dist(o jsonb, did text, d jsonb) returns double precision language plpgsql stable as $$
declare
  v_now bigint := public.jt_now_ms();
  el double precision := (v_now - coalesce((o->>'searchAt')::bigint, v_now)) / 1000.0;
  slat double precision := (o#>>'{storeLoc,lat}')::double precision;
  slng double precision := (o#>>'{storeLoc,lng}')::double precision;
  dlat double precision := (d->>'lat')::double precision;
  dlng double precision := (d->>'lng')::double precision;
  fresh boolean := coalesce((d->>'locAt')::bigint, 0) > v_now - 20 * 60 * 1000;
  dist double precision;
  nearest text;
begin
  if coalesce(o->'declined', '[]'::jsonb) ? did then return null; end if;
  if slat is null or slng is null then return -1; end if;            -- toko belum set lokasi: tawarkan ke semua driver online
  if dlat is null or dlng is null or not fresh then return null; end if;
  dist := public.jt_dist(slat, slng, dlat, dlng);
  if dist > public.jt_radius(el) then return null; end if;
  if el < 30 then
    -- 30 detik pertama: hanya driver terdekat (dalam 1 km)
    select k.id into nearest
      from public.docs k
     where k.col = 'drivers'
       and coalesce((k.data->>'online')::boolean, false)
       and k.data ? 'lat' and coalesce((k.data->>'locAt')::bigint, 0) > v_now - 20 * 60 * 1000
       and not (coalesce(o->'declined', '[]'::jsonb) ? substring(k.id from 9))
       and public.jt_driver_free(substring(k.id from 9), k.data)
     order by public.jt_dist(slat, slng, (k.data->>'lat')::double precision, (k.data->>'lng')::double precision)
     limit 1;
    if nearest is distinct from 'drivers/' || did then return null; end if;
  end if;
  return dist;
end $$;

create or replace function public.jt_driver_save(p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  h text := public.jt_h(p_key);
  did text := public.jt_driver_id(h);
  v_old jsonb;
  v_patch jsonb;
  v_now bigint := public.jt_now_ms();
  v_new jsonb;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if pg_column_size(p_data) > 20000 then raise exception 'Data terlalu besar'; end if;
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into v_patch from jsonb_each(coalesce(p_data, '{}'::jsonb))
   where key in ('name','wa','vehicle','plate','area','online','lat','lng');
  if v_patch ? 'lat' then
    if jsonb_typeof(v_patch->'lat') <> 'number' or jsonb_typeof(v_patch->'lng') <> 'number' then raise exception 'Lokasi tidak valid'; end if;
    v_patch := v_patch || jsonb_build_object('locAt', v_now);
  end if;
  select data into v_old from public.docs where id = 'drivers/' || did for update;
  if v_old is null then
    if coalesce(v_patch->>'name', '') = '' or coalesce(v_patch->>'wa', '') = '' then raise exception 'Isi nama dan nomor WhatsApp'; end if;
    v_new := v_patch || jsonb_build_object('createdAt', v_now, 'online', coalesce(v_patch->'online', 'false'::jsonb));
    insert into public.docs (id, col, data) values ('drivers/' || did, 'drivers', v_new);
    insert into public.doc_keys (id, owner_hash) values ('drivers/' || did, h) on conflict (id) do nothing;
  else
    v_new := public.jt_merge(v_old, v_patch || jsonb_build_object('updatedAt', v_now));
    update public.docs set data = v_new, updated_at = now() where id = 'drivers/' || did;
  end if;
  if v_patch ? 'lat' then
    update public.docs set data = jsonb_set(data, '{driverLoc}', jsonb_build_object('lat', v_patch->'lat', 'lng', v_patch->'lng', 'at', v_now)), updated_at = now()
     where col = 'orders' and data->>'driverId' = did and data->>'status' in ('driver_ke_toko','diantar');
  end if;
  return v_new || jsonb_build_object('id', did);
end $$;

create or replace function public.jt_driver_jobs(p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  did text := public.jt_driver_id(public.jt_h(p_key));
  d jsonb;
  v_offers jsonb := '[]'::jsonb;
  v_mine jsonb;
  r record;
  dist double precision;
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then return jsonb_build_object('me', null, 'offers', '[]'::jsonb, 'mine', '[]'::jsonb); end if;
  select coalesce(jsonb_agg(x.data || jsonb_build_object('id', substring(x.id from 8)) order by x.created_at desc), '[]'::jsonb) into v_mine
    from (select * from public.docs o where o.col = 'orders' and o.data->>'driverId' = did
           and (o.data->>'status' not in ('selesai','dibatalkan') or o.updated_at > now() - interval '30 days')
           order by o.created_at desc limit 200) x;
  if public.jt_driver_free(did, d) then
    for r in select o.id, o.data from public.docs o where o.col = 'orders' and o.data->>'status' = 'mencari_driver' order by o.created_at limit 100 loop
      dist := public.jt_offer_dist(r.data, did, d);
      if dist is not null then
        v_offers := v_offers || jsonb_build_array(((r.data #- '{buyer,wa}'::text[]) - 'proof'::text - 'declined'::text) || jsonb_build_object('id', substring(r.id from 8), 'dist', case when dist < 0 then null else round(dist::numeric) end));
      end if;
    end loop;
  end if;
  return jsonb_build_object('me', d || jsonb_build_object('id', did), 'offers', v_offers, 'mine', v_mine, 'now', public.jt_now_ms());
end $$;

create or replace function public.jt_driver_act(p_id text, p_act text, p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  did text := public.jt_driver_id(public.jt_h(p_key));
  d jsonb;
  o jsonb;
  st text;
  v_now bigint := public.jt_now_ms();
  v_ongkir numeric;
  v_item jsonb;
  v_sid text;
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then raise exception 'Daftar sebagai driver dulu'; end if;
  select data into o from public.docs where id = 'orders/' || p_id and col = 'orders' for update;
  if o is null then raise exception 'Pesanan tidak ditemukan'; end if;
  st := o->>'status';
  v_sid := o->>'storeId';
  if p_act = 'accept' then
    if st <> 'mencari_driver' then raise exception 'Pesanan sudah diambil driver lain'; end if;
    if not public.jt_driver_free(did, d) then raise exception 'Selesaikan pesanan aktif Anda atau aktifkan status online'; end if;
    if public.jt_offer_dist(o, did, d) is null then raise exception 'Pesanan ini di luar jangkauan Anda'; end if;
    o := o || jsonb_build_object('status', 'driver_ke_toko', 'driverId', did, 'acceptedAt', v_now, 'updatedAt', v_now,
      'driver', jsonb_build_object('name', d->>'name', 'wa', d->>'wa', 'vehicle', coalesce(d->>'vehicle', ''), 'plate', coalesce(d->>'plate', '')));
    if d ? 'lat' then o := o || jsonb_build_object('driverLoc', jsonb_build_object('lat', d->'lat', 'lng', d->'lng', 'at', v_now)); end if;
  elsif p_act = 'decline' then
    if st <> 'mencari_driver' then return jsonb_build_object('ok', true); end if;
    o := jsonb_set(o, '{declined}', coalesce(o->'declined', '[]'::jsonb) || to_jsonb(did));
  else
    if o->>'driverId' is distinct from did then raise exception 'Bukan pesanan Anda'; end if;
    if p_act = 'pickup' then
      if st <> 'driver_ke_toko' then raise exception 'Status pesanan tidak sesuai'; end if;
      o := o || jsonb_build_object('status', 'diantar', 'pickedAt', v_now, 'updatedAt', v_now);
    elsif p_act = 'release' then
      if st <> 'driver_ke_toko' then raise exception 'Pesanan sudah diambil dari toko'; end if;
      o := (o - 'driver' - 'driverId' - 'driverLoc' - 'acceptedAt') || jsonb_build_object('status', 'mencari_driver', 'searchAt', v_now, 'updatedAt', v_now,
        'declined', coalesce(o->'declined', '[]'::jsonb) || to_jsonb(did));
    elsif p_act = 'done' then
      if st <> 'diantar' then raise exception 'Status pesanan tidak sesuai'; end if;
      v_ongkir := coalesce((p_data->>'ongkir')::numeric, (o->>'ongkirEst')::numeric, 0);
      if v_ongkir < 0 or v_ongkir > 10000000 then raise exception 'Ongkir tidak valid'; end if;
      o := o || jsonb_build_object('status', 'selesai', 'ongkirFinal', round(v_ongkir), 'doneAt', v_now, 'updatedAt', v_now);
      for v_item in select * from jsonb_array_elements(o->'items') loop
        update public.docs set data = jsonb_set(data, '{sold}', to_jsonb(coalesce((data->>'sold')::numeric, 0) + (v_item->>'qty')::numeric)), updated_at = now()
          where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid');
      end loop;
    else
      raise exception 'Aksi tidak valid';
    end if;
  end if;
  update public.docs set data = o, updated_at = now() where id = 'orders/' || p_id;
  return o || jsonb_build_object('id', p_id);
end $$;

create or replace function public.jt_order_create(p_id text, p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $function$
declare
  h text := public.jt_h(p_key);
  v_sid text := p_data->>'storeId';
  v_store jsonb;
  v_prod jsonb;
  v_item jsonb;
  v_items jsonb := '[]'::jsonb;
  v_total numeric := 0;
  v_qty int;
  v_price numeric;
  v_payk text := coalesce(p_data#>>'{pay,k}', '');
  v_data jsonb;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if p_id !~ '^[A-Za-z0-9_-]{4,64}$' then raise exception 'ID pesanan tidak valid'; end if;
  if exists (select 1 from public.docs where id = 'orders/' || p_id) then raise exception 'Pesanan sudah ada'; end if;
  select data into v_store from public.docs where id = 'stores/' || v_sid;
  if v_store is null or coalesce(v_store->>'active', 'true') = 'false' then raise exception 'Toko tidak ditemukan'; end if;
  if coalesce(v_store->>'open', 'true') = 'false' then raise exception 'Toko sedang tutup'; end if;
  if jsonb_array_length(coalesce(p_data->'items', '[]')) = 0 then raise exception 'Keranjang kosong'; end if;
  if coalesce(p_data#>>'{buyer,name}', '') = '' or coalesce(p_data#>>'{buyer,wa}', '') = '' or coalesce(p_data#>>'{buyer,address}', '') = '' then
    raise exception 'Lengkapi nama, WhatsApp, dan alamat';
  end if;

  for v_item in select * from jsonb_array_elements(p_data->'items') loop
    v_qty := greatest(1, least(999, coalesce((v_item->>'qty')::int, 1)));
    select data into v_prod from public.docs where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid') for update;
    if v_prod is null or coalesce(v_prod->>'active', 'true') = 'false' then
      raise exception '% sudah tidak tersedia', coalesce(v_item->>'name', 'Produk');
    end if;
    if jsonb_typeof(v_prod->'stock') = 'number' then
      if (v_prod->>'stock')::numeric < v_qty then raise exception 'Stok % tersisa %', v_prod->>'name', v_prod->>'stock'; end if;
      update public.docs set data = jsonb_set(data, '{stock}', to_jsonb((v_prod->>'stock')::numeric - v_qty)), updated_at = now()
        where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid');
    end if;
    v_price := coalesce((v_prod->>'price')::numeric, 0);
    v_total := v_total + v_price * v_qty;
    v_items := v_items || jsonb_build_array(jsonb_build_object('pid', v_item->>'pid', 'name', v_prod->>'name', 'price', v_price, 'qty', v_qty));
  end loop;

  v_data := (p_data - 'driver' - 'driverId' - 'driverLoc' - 'searchAt' - 'declined' - 'ongkirFinal' - 'storeLoc' - 'acceptedAt' - 'pickedAt') || jsonb_build_object(
    'storeName', v_store->>'name', 'storeAddress', coalesce(v_store->>'address', ''), 'storeWa', coalesce(v_store->>'wa', ''),
    'items', v_items, 'subtotal', v_total, 'ongkir', 0, 'admin', 0, 'total', v_total,
    'ongkirRate', 0.025, 'ongkirEst', ceil(v_total * 0.025 / 100) * 100,
    'shareRate', 0.03, 'share', round(v_total * 0.03),
    'status', case when v_payk = 'cod' then 'menunggu_konfirmasi' else 'menunggu_pembayaran' end);
  if jsonb_typeof(v_store->'lat') = 'number' and jsonb_typeof(v_store->'lng') = 'number' then
    v_data := v_data || jsonb_build_object('storeLoc', jsonb_build_object('lat', v_store->'lat', 'lng', v_store->'lng'));
  end if;
  insert into public.docs (id, col, data) values ('orders/' || p_id, 'orders', v_data);
  insert into public.doc_keys (id, buyer_hash, store_id) values ('orders/' || p_id, h, v_sid);
  return v_data;
end $function$;

create or replace function public.jt_order_update(p_id text, p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $function$
declare
  h text := public.jt_h(p_key);
  k record;
  v_owner text;
  is_buyer boolean;
  is_seller boolean;
  v_old jsonb;
  v_new text := p_data->>'status';
  v_cur text;
  v_patch jsonb := '{}'::jsonb;
  v_item jsonb;
  allowed text[];
  has_driver boolean;
begin
  select * into k from public.doc_keys where id = 'orders/' || p_id;
  if not found then raise exception 'Pesanan tidak ditemukan'; end if;
  select owner_hash into v_owner from public.doc_keys where id = 'stores/' || k.store_id;
  is_buyer := k.buyer_hash = h;
  is_seller := v_owner is not null and v_owner = h;
  if not is_buyer and not is_seller then raise exception 'Tidak diizinkan'; end if;
  select data into v_old from public.docs where id = 'orders/' || p_id for update;
  v_cur := v_old->>'status';
  has_driver := v_old ? 'driverId';

  if v_cur in ('selesai','dibatalkan') and v_new is not null then raise exception 'Pesanan sudah ditutup'; end if;
  if v_new is not null and (v_new <> v_cur or v_new = 'mencari_driver') then
    if is_seller then
      if v_new not in ('menunggu_pembayaran','menunggu_konfirmasi','diproses','mencari_driver','diantar','selesai','dibatalkan') then raise exception 'Status tidak valid'; end if;
      if has_driver and v_new <> 'dibatalkan' then raise exception 'Pesanan sudah dipegang driver'; end if;
      if v_new = 'mencari_driver' and v_cur not in ('menunggu_konfirmasi','diproses','mencari_driver') then raise exception 'Konfirmasi pesanan dulu'; end if;
    else
      if not ((v_cur = 'menunggu_pembayaran' and v_new in ('menunggu_konfirmasi','dibatalkan'))
           or (v_cur = 'menunggu_konfirmasi' and v_new = 'dibatalkan')
           or (v_cur = 'diantar' and v_new = 'selesai' and not has_driver)) then
        raise exception 'Perubahan status tidak diizinkan';
      end if;
    end if;
  end if;

  allowed := array['status','cancelBy','proof','doneAt','updatedAt','paidAt','selfDelivery'];
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into v_patch from jsonb_each(p_data) where key = any(allowed);
  if not is_seller then v_patch := v_patch - 'selfDelivery'; end if;
  if v_new = 'mencari_driver' then v_patch := v_patch || jsonb_build_object('searchAt', public.jt_now_ms(), 'declined', '[]'::jsonb); end if;
  if pg_column_size(v_patch) > 600000 then raise exception 'Data terlalu besar'; end if;

  update public.docs set data = public.jt_merge(data, v_patch), updated_at = now() where id = 'orders/' || p_id;

  if v_new = 'dibatalkan' and v_cur <> 'dibatalkan' then
    for v_item in select * from jsonb_array_elements(v_old->'items') loop
      update public.docs set data = jsonb_set(data, '{stock}', to_jsonb((data->>'stock')::numeric + (v_item->>'qty')::numeric)), updated_at = now()
        where id = 'stores/' || k.store_id || '/products/' || (v_item->>'pid') and jsonb_typeof(data->'stock') = 'number';
    end loop;
  end if;
  if v_new = 'selesai' and v_cur <> 'selesai' then
    for v_item in select * from jsonb_array_elements(v_old->'items') loop
      update public.docs set data = jsonb_set(data, '{sold}', to_jsonb(coalesce((data->>'sold')::numeric, 0) + (v_item->>'qty')::numeric)), updated_at = now()
        where id = 'stores/' || k.store_id || '/products/' || (v_item->>'pid');
    end loop;
  end if;
  return jsonb_build_object('ok', true);
end $function$;

revoke all on function public.jt_offer_dist(jsonb, text, jsonb) from public, anon, authenticated;
revoke all on function public.jt_driver_free(text, jsonb) from public, anon, authenticated;
grant execute on function public.jt_driver_save(jsonb, text), public.jt_driver_jobs(text), public.jt_driver_act(text, text, jsonb, text) to anon, authenticated;
