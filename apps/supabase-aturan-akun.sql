-- ===== Aturan akun JAGA =====
create or replace function public.jt_wa(t text) returns text language sql immutable set search_path to 'public' as $$
  select case when d like '0%' then '62' || substr(d, 2) when d like '8%' then '62' || d else d end
  from (select regexp_replace(coalesce(t, ''), '\D', '', 'g') d) x $$;
create or replace function public.jt_wa_ok(t text) returns boolean language sql immutable set search_path to 'public' as $$
  select public.jt_wa(t) ~ '^628[0-9]{7,11}$' $$;
create or replace function public.jt_plate(t text) returns text language sql immutable set search_path to 'public' as $$
  select upper(regexp_replace(coalesce(t, ''), '[^A-Za-z0-9]', '', 'g')) $$;

create table if not exists public.jt_bonus_wa (k text primary key, at timestamptz not null default now());
alter table public.jt_bonus_wa enable row level security;
revoke all on public.jt_bonus_wa from anon, authenticated;
-- tandai nomor yang sudah pernah dapat bonus
insert into public.jt_bonus_wa (k)
  select distinct case when t.store_id like 'drv:%' then 'drv:' else 'store:' end || public.jt_wa(d.data->>'wa')
  from public.jt_wallet_tx t join public.docs d on d.id = case when t.store_id like 'drv:%' then 'drivers/' || substr(t.store_id, 5) else 'stores/' || t.store_id end
  where t.kind = 'bonus' and public.jt_wa(d.data->>'wa') <> ''
on conflict do nothing;

create or replace function public.jt_give_bonus(p_sid text) returns void language plpgsql security definer set search_path to 'public' as $function$
declare b numeric := coalesce((public.jt_wallet_cfg()->>'bonus')::numeric, 0); w text;
begin
  select public.jt_wa(data->>'wa') into w from public.docs where id = 'stores/' || p_sid;
  if b > 0 and coalesce(w, '') <> '' and not exists (select 1 from public.jt_wallet_tx where store_id = p_sid and kind = 'bonus') then
    insert into public.jt_bonus_wa (k) values ('store:' || w) on conflict do nothing;
    if found then insert into public.jt_wallet_tx (store_id, kind, amount, note) values (p_sid, 'bonus', b, 'Saldo gratis toko baru'); end if;
  end if;
end $function$;

create or replace function public.jt_driver_bonus(did text) returns void language plpgsql security definer set search_path to 'public' as $function$
declare b numeric := coalesce((public.jt_wallet_cfg()->>'bonus')::numeric, 0); w text;
begin
  select public.jt_wa(data->>'wa') into w from public.docs where id = 'drivers/' || did;
  if b > 0 and coalesce(w, '') <> '' and not exists (select 1 from public.jt_wallet_tx where store_id = 'drv:' || did and kind = 'bonus') then
    insert into public.jt_bonus_wa (k) values ('drv:' || w) on conflict do nothing;
    if found then insert into public.jt_wallet_tx (store_id, kind, amount, note) values ('drv:' || did, 'bonus', b, 'Saldo gratis driver baru'); end if;
  end if;
end $function$;

-- alasan driver tidak boleh mengambil pesanan (null = boleh)
create or replace function public.jt_self_job(o jsonb, p_path text, h text, d jsonb) returns text language sql stable security definer set search_path to 'public' as $$
  select case
    when exists (select 1 from public.doc_keys k where k.id = p_path and k.buyer_hash = h)
      or (public.jt_wa(coalesce(o#>>'{buyer,wa}', o#>>'{rider,wa}')) <> '' and public.jt_wa(coalesce(o#>>'{buyer,wa}', o#>>'{rider,wa}')) = public.jt_wa(d->>'wa'))
      then 'Tidak bisa mengambil pesanan milik sendiri'
    when o ? 'storeId' and (public.jt_owns(o->>'storeId', h) or (public.jt_wa(o->>'storeWa') <> '' and public.jt_wa(o->>'storeWa') = public.jt_wa(d->>'wa')))
      then 'Tidak bisa mengantar pesanan dari toko sendiri'
  end $$;

-- ===== Driver: 1 WA & 1 plat = 1 akun =====
create or replace function public.jt_driver_save(p_data jsonb, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  h text := public.jt_h(p_key); did text := public.jt_driver_id(h); v_old jsonb; v_patch jsonb; v_now bigint := public.jt_now_ms(); v_new jsonb; v_ident boolean;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if pg_column_size(p_data) > 20000 then raise exception 'Data terlalu besar'; end if;
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into v_patch from jsonb_each(coalesce(p_data, '{}'::jsonb))
   where key in ('name','wa','vehicle','plate','address','area','online','lat','lng');
  if v_patch ? 'address' then v_patch := v_patch || jsonb_build_object('address', left(v_patch->>'address', 200)); end if;
  if v_patch ? 'name' then v_patch := v_patch || jsonb_build_object('name', left(trim(v_patch->>'name'), 60)); end if;
  if v_patch ? 'plate' then v_patch := v_patch || jsonb_build_object('plate', upper(left(trim(v_patch->>'plate'), 15))); end if;
  if v_patch ? 'lat' then
    if jsonb_typeof(v_patch->'lat') <> 'number' or jsonb_typeof(v_patch->'lng') <> 'number' then raise exception 'Lokasi tidak valid'; end if;
    v_patch := v_patch || jsonb_build_object('locAt', v_now);
  end if;
  if v_patch ? 'wa' and not public.jt_wa_ok(v_patch->>'wa') then raise exception 'Nomor WhatsApp tidak valid. Contoh: 081234567890'; end if;
  if v_patch ? 'plate' and length(public.jt_plate(v_patch->>'plate')) < 3 then raise exception 'Isi plat nomor dan alamat rumah'; end if;
  if v_patch ? 'wa' and exists (select 1 from public.docs where col = 'drivers' and id <> 'drivers/' || did and public.jt_wa(data->>'wa') = public.jt_wa(v_patch->>'wa')) then
    raise exception 'Nomor WhatsApp ini sudah terdaftar sebagai driver. 1 nomor hanya untuk 1 akun driver';
  end if;
  if v_patch ? 'plate' and exists (select 1 from public.docs where col = 'drivers' and id <> 'drivers/' || did and public.jt_plate(data->>'plate') = public.jt_plate(v_patch->>'plate')) then
    raise exception 'Plat nomor ini sudah terdaftar di akun driver lain. 1 kendaraan hanya untuk 1 akun driver';
  end if;
  select data into v_old from public.docs where id = 'drivers/' || did for update;
  if v_old is null then
    if coalesce(v_patch->>'name', '') = '' or coalesce(v_patch->>'wa', '') = '' then raise exception 'Isi nama dan nomor WhatsApp'; end if;
    if length(trim(coalesce(v_patch->>'plate', ''))) < 3 or length(trim(coalesce(v_patch->>'address', ''))) < 5 then raise exception 'Isi plat nomor dan alamat rumah'; end if;
    v_new := v_patch || jsonb_build_object('createdAt', v_now, 'online', false, 'verify', 'pending');
    insert into public.docs (id, col, data) values ('drivers/' || did, 'drivers', v_new);
    insert into public.doc_keys (id, owner_hash) values ('drivers/' || did, h) on conflict (id) do nothing;
  else
    v_ident := (v_patch ? 'wa' and public.jt_wa(v_patch->>'wa') <> public.jt_wa(v_old->>'wa'))
            or (v_patch ? 'plate' and public.jt_plate(v_patch->>'plate') <> public.jt_plate(v_old->>'plate'));
    if v_ident and public.jt_driver_free(did, v_old || '{"online":true}'::jsonb) is false and coalesce(v_old->>'verify','verified') = 'verified' then
      raise exception 'Selesaikan pesanan aktif dulu sebelum mengganti nomor WA atau plat';
    end if;
    if coalesce(v_old->>'verify', 'verified') <> 'verified' and coalesce((v_patch->>'online')::boolean, false) then
      raise exception 'Akun driver belum diverifikasi tim JAGA';
    end if;
    if v_old->>'verify' = 'rejected' and (v_patch ? 'name' or v_patch ? 'plate' or v_patch ? 'address') then
      v_patch := v_patch || jsonb_build_object('verify', 'pending', 'verifyNote', '');
    elsif v_ident and coalesce(v_old->>'verify', 'verified') = 'verified' then
      v_patch := v_patch || jsonb_build_object('verify', 'pending', 'verifyNote', 'Nomor WA / plat diganti, menunggu verifikasi ulang', 'online', false);
    end if;
    v_new := public.jt_merge(v_old, v_patch || jsonb_build_object('updatedAt', v_now));
    update public.docs set data = v_new, updated_at = now() where id = 'drivers/' || did;
  end if;
  if v_patch ? 'lat' then
    update public.docs set data = jsonb_set(data, '{driverLoc}', jsonb_build_object('lat', v_patch->'lat', 'lng', v_patch->'lng', 'at', v_now)), updated_at = now()
     where col in ('orders','rides') and data->>'driverId' = did and data->>'status' in ('driver_ke_toko','diantar','driver_jemput','dalam_perjalanan');
  end if;
  return v_new || jsonb_build_object('id', did);
end $function$;

-- ===== Driver: tolak pesanan sendiri / toko sendiri =====
create or replace function public.jt_driver_act(p_id text, p_act text, p_data jsonb, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  h text := public.jt_h(p_key); did text := public.jt_driver_id(h); d jsonb; o jsonb; st text; v_now bigint := public.jt_now_ms();
  v_ongkir numeric; v_item jsonb; v_sid text; v_path text := 'orders/' || p_id; v_ride boolean := false; v_fee numeric; v_why text;
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then raise exception 'Daftar sebagai driver dulu'; end if;
  select data into o from public.docs where id = v_path and col = 'orders' for update;
  if o is null then
    v_path := 'rides/' || p_id; v_ride := true;
    select data into o from public.docs where id = v_path and col = 'rides' for update;
  end if;
  if o is null then raise exception 'Pesanan tidak ditemukan'; end if;
  st := o->>'status'; v_sid := o->>'storeId';
  if p_act = 'accept' then
    if st <> 'mencari_driver' then raise exception '%', case when v_ride then 'Order Jago sudah diambil driver lain' else 'Pesanan sudah diambil driver lain' end; end if;
    v_why := public.jt_self_job(o, v_path, h, d);
    if v_why is not null then raise exception '%', v_why; end if;
    if not public.jt_driver_free(did, d) then raise exception 'Selesaikan pesanan aktif Anda atau aktifkan status online. 1 driver hanya bisa membawa 1 pesanan sekaligus'; end if;
    if v_ride and not public.jt_can_accept('drv:' || did, public.jt_ride_fee(o)) then raise exception 'Saldo driver kurang. Isi saldo dulu untuk menerima order Jago'; end if;
    if public.jt_offer_dist(o, did, d) is null then raise exception 'Pesanan ini di luar jangkauan Anda'; end if;
    o := o || jsonb_build_object('status', case when v_ride then 'driver_jemput' else 'driver_ke_toko' end, 'driverId', did, 'acceptedAt', v_now, 'updatedAt', v_now,
      'driver', jsonb_build_object('name', d->>'name', 'wa', d->>'wa', 'vehicle', coalesce(d->>'vehicle', ''), 'plate', coalesce(d->>'plate', '')));
    if d ? 'lat' then o := o || jsonb_build_object('driverLoc', jsonb_build_object('lat', d->'lat', 'lng', d->'lng', 'at', v_now)); end if;
  elsif p_act = 'decline' then
    if st <> 'mencari_driver' then return jsonb_build_object('ok', true); end if;
    o := jsonb_set(o, '{declined}', coalesce(o->'declined', '[]'::jsonb) || to_jsonb(did));
  else
    if o->>'driverId' is distinct from did then raise exception 'Bukan pesanan Anda'; end if;
    if p_act = 'pickup' then
      if st <> (case when v_ride then 'driver_jemput' else 'driver_ke_toko' end) then raise exception 'Status pesanan tidak sesuai'; end if;
      o := o || jsonb_build_object('status', case when v_ride then 'dalam_perjalanan' else 'diantar' end, 'pickedAt', v_now, 'updatedAt', v_now);
    elsif p_act = 'release' then
      if st <> (case when v_ride then 'driver_jemput' else 'driver_ke_toko' end) then raise exception '%', case when v_ride then 'Penumpang sudah naik' else 'Pesanan sudah diambil dari toko' end; end if;
      o := (o - 'driver' - 'driverId' - 'driverLoc' - 'acceptedAt') || jsonb_build_object('status', 'mencari_driver', 'searchAt', v_now, 'updatedAt', v_now,
        'declined', coalesce(o->'declined', '[]'::jsonb) || to_jsonb(did));
    elsif p_act = 'done' then
      if st <> (case when v_ride then 'dalam_perjalanan' else 'diantar' end) then raise exception 'Status pesanan tidak sesuai'; end if;
      v_ongkir := coalesce((p_data->>'ongkir')::numeric, (o->>case when v_ride then 'fareEst' else 'ongkirEst' end)::numeric, 0);
      if v_ongkir < 0 or v_ongkir > 10000000 then raise exception 'Tarif tidak valid'; end if;
      if v_ride then
        v_fee := round(round(v_ongkir) * 0.03);
        o := o || jsonb_build_object('status', 'selesai', 'fareFinal', round(v_ongkir), 'fee', v_fee, 'doneAt', v_now, 'updatedAt', v_now);
      else
        o := o || jsonb_build_object('status', 'selesai', 'ongkirFinal', round(v_ongkir), 'doneAt', v_now, 'updatedAt', v_now);
        for v_item in select * from jsonb_array_elements(o->'items') loop
          update public.docs set data = jsonb_set(data, '{sold}', to_jsonb(coalesce((data->>'sold')::numeric, 0) + (v_item->>'qty')::numeric)), updated_at = now()
            where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid');
        end loop;
      end if;
    else
      raise exception 'Aksi tidak valid';
    end if;
  end if;
  update public.docs set data = o, updated_at = now() where id = v_path;
  if p_act = 'done' then
    if v_ride then
      if v_fee > 0 then
        insert into public.jt_wallet_tx (store_id, kind, amount, order_id, note)
          values ('drv:' || did, 'fee', -v_fee, 'ride:' || p_id, 'Komisi 3% Jago ' || coalesce(o->>'code', p_id) || ' (' || to_char(round(v_ongkir), 'FM999G999G999') || ')')
          on conflict do nothing;
      end if;
    else
      perform public.jt_charge_fee(p_id);
    end if;
  end if;
  return o || jsonb_build_object('id', p_id);
end $function$;

create or replace function public.jt_driver_jobs(p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  h text := public.jt_h(p_key); did text := public.jt_driver_id(h);
  d jsonb; v_offers jsonb := '[]'::jsonb; v_mine jsonb; r record; dist double precision; c jsonb := public.jt_wallet_cfg();
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then return jsonb_build_object('me', null, 'offers', '[]'::jsonb, 'mine', '[]'::jsonb); end if;
  select coalesce(jsonb_agg(x.data || jsonb_build_object('id', split_part(x.id, '/', 2)) order by x.created_at desc), '[]'::jsonb) into v_mine
    from (select * from public.docs o where o.col in ('orders','rides') and o.data->>'driverId' = did
           and (o.data->>'status' not in ('selesai','dibatalkan') or o.updated_at > now() - interval '30 days')
           order by o.created_at desc limit 200) x;
  if public.jt_driver_free(did, d) then
    for r in select o.id, o.data from public.docs o where o.col in ('orders','rides') and o.data->>'status' = 'mencari_driver' order by o.created_at limit 100 loop
      if public.jt_self_job(r.data, r.id, h, d) is null then
        dist := public.jt_offer_dist(r.data, did, d);
        if dist is not null then
          v_offers := v_offers || jsonb_build_array(((r.data #- '{buyer,wa}'::text[] #- '{rider,wa}'::text[]) - 'proof'::text - 'declined'::text)
            || jsonb_build_object('id', split_part(r.id, '/', 2), 'dist', case when dist < 0 then null else round(dist::numeric) end));
        end if;
      end if;
    end loop;
  end if;
  return jsonb_build_object('me', d || jsonb_build_object('id', did), 'offers', v_offers, 'mine', v_mine, 'now', public.jt_now_ms(),
    'wallet', jsonb_build_object('balance', public.jt_balance('drv:' || did), 'minBalance', coalesce((c->>'minBalance')::numeric, 0)));
end $function$;

-- ===== Pembeli: WA valid, maks 3 pesanan berjalan, tidak beli dari toko sendiri =====
create or replace function public.jt_order_create(p_id text, p_data jsonb, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  h text := public.jt_h(p_key); v_sid text := p_data->>'storeId'; v_store jsonb; v_prod jsonb; v_item jsonb; v_items jsonb := '[]'::jsonb;
  v_total numeric := 0; v_qty int; v_price numeric; v_payk text := coalesce(p_data#>>'{pay,k}', ''); v_data jsonb; v_dist double precision; v_act int;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if p_id !~ '^[A-Za-z0-9_-]{4,64}$' then raise exception 'ID pesanan tidak valid'; end if;
  if exists (select 1 from public.docs where id = 'orders/' || p_id) then raise exception 'Pesanan sudah ada'; end if;
  select data into v_store from public.docs where id = 'stores/' || v_sid;
  if v_store is null or coalesce(v_store->>'active', 'true') = 'false' then raise exception 'Toko tidak ditemukan'; end if;
  if coalesce(v_store->>'open', 'true') = 'false' then raise exception 'Toko sedang tutup'; end if;
  if jsonb_array_length(coalesce(p_data->'items', '[]')) = 0 then raise exception 'Keranjang kosong'; end if;
  if coalesce(p_data#>>'{buyer,name}', '') = '' or coalesce(p_data#>>'{buyer,wa}', '') = '' or coalesce(p_data#>>'{buyer,address}', '') = '' then raise exception 'Lengkapi nama, WhatsApp, dan alamat'; end if;
  if not public.jt_wa_ok(p_data#>>'{buyer,wa}') then raise exception 'Nomor WhatsApp tidak valid. Contoh: 081234567890'; end if;
  if public.jt_owns(v_sid, h) or public.jt_wa(v_store->>'wa') = public.jt_wa(p_data#>>'{buyer,wa}') then
    raise exception 'Tidak bisa memesan dari toko sendiri';
  end if;
  select count(*) into v_act from public.docs o join public.doc_keys k on k.id = o.id
   where o.col = 'orders' and k.buyer_hash = h and o.data->>'status' not in ('selesai','dibatalkan');
  if v_act >= 3 then raise exception 'Maksimal 3 pesanan berjalan sekaligus. Tunggu selesai atau batalkan pesanan sebelumnya'; end if;
  if exists (select 1 from public.docs o join public.doc_keys k on k.id = o.id
             where o.col = 'orders' and k.buyer_hash = h and o.data->>'storeId' = v_sid and o.data->>'status' in ('menunggu_pembayaran','menunggu_konfirmasi')) then
    raise exception 'Masih ada pesanan di toko ini yang belum dikonfirmasi. Tunggu atau batalkan dulu';
  end if;
  for v_item in select * from jsonb_array_elements(p_data->'items') loop
    v_qty := greatest(1, least(999, coalesce((v_item->>'qty')::int, 1)));
    select data into v_prod from public.docs where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid') for update;
    if v_prod is null or coalesce(v_prod->>'active', 'true') = 'false' then raise exception '% sudah tidak tersedia', coalesce(v_item->>'name', 'Produk'); end if;
    if jsonb_typeof(v_prod->'stock') = 'number' then
      if (v_prod->>'stock')::numeric < v_qty then raise exception 'Stok % tersisa %', v_prod->>'name', v_prod->>'stock'; end if;
      update public.docs set data = jsonb_set(data, '{stock}', to_jsonb((v_prod->>'stock')::numeric - v_qty)), updated_at = now() where id = 'stores/' || v_sid || '/products/' || (v_item->>'pid');
    end if;
    v_price := coalesce((v_prod->>'price')::numeric, 0); v_total := v_total + v_price * v_qty;
    v_items := v_items || jsonb_build_array(jsonb_build_object('pid', v_item->>'pid', 'name', v_prod->>'name', 'price', v_price, 'qty', v_qty));
  end loop;
  v_data := (p_data - 'driver' - 'driverId' - 'driverLoc' - 'searchAt' - 'declined' - 'ongkirFinal' - 'storeLoc' - 'acceptedAt' - 'pickedAt' - 'ongkirEst' - 'ongkirDist' - 'ongkirRate') || jsonb_build_object(
    'storeName', v_store->>'name', 'storeAddress', coalesce(v_store->>'address', ''), 'storeWa', coalesce(v_store->>'wa', ''),
    'items', v_items, 'subtotal', v_total, 'ongkir', 0, 'admin', 0, 'total', v_total, 'ongkirPer500', 2000,
    'shareRate', 0.03, 'share', round(v_total * 0.03), 'status', case when v_payk = 'cod' then 'menunggu_konfirmasi' else 'menunggu_pembayaran' end);
  if jsonb_typeof(v_store->'lat') = 'number' and jsonb_typeof(v_store->'lng') = 'number' then
    v_data := v_data || jsonb_build_object('storeLoc', jsonb_build_object('lat', v_store->'lat', 'lng', v_store->'lng'));
    if jsonb_typeof(p_data#>'{buyer,lat}') = 'number' and jsonb_typeof(p_data#>'{buyer,lng}') = 'number' then
      v_dist := public.jt_dist((v_store->>'lat')::double precision, (v_store->>'lng')::double precision, (p_data#>>'{buyer,lat}')::double precision, (p_data#>>'{buyer,lng}')::double precision);
      v_data := v_data || jsonb_build_object('ongkirDist', round(v_dist::numeric), 'ongkirEst', greatest(1, ceil(v_dist / 500)) * 2000);
    end if;
  end if;
  insert into public.docs (id, col, data) values ('orders/' || p_id, 'orders', v_data);
  insert into public.doc_keys (id, buyer_hash, store_id) values ('orders/' || p_id, h, v_sid);
  return v_data;
end $function$;

-- ===== Penjual: 1 WA = 1 toko, 1 akun = 1 toko, nama unik per daerah =====
create or replace function public.jt_store_rules(p_sid text, d jsonb, h text, p_key text, p_new boolean) returns void
 language plpgsql stable security definer set search_path to 'public' as $function$
begin
  if d ? 'wa' or p_new then
    if not public.jt_wa_ok(d->>'wa') then raise exception 'Nomor WhatsApp toko tidak valid. Contoh: 081234567890'; end if;
    if exists (select 1 from public.docs where col = 'stores' and id <> 'stores/' || p_sid and public.jt_wa(data->>'wa') = public.jt_wa(d->>'wa')) then
      raise exception 'Nomor WhatsApp ini sudah dipakai toko lain. 1 nomor hanya untuk 1 toko';
    end if;
  end if;
  if (d ? 'name' or p_new) then
    if length(trim(coalesce(d->>'name', ''))) < 3 then raise exception 'Nama toko minimal 3 huruf'; end if;
    if exists (select 1 from public.docs where col = 'stores' and id <> 'stores/' || p_sid
               and lower(regexp_replace(data->>'name', '\s+', ' ', 'g')) = lower(regexp_replace(trim(d->>'name'), '\s+', ' ', 'g'))
               and lower(trim(coalesce(data->>'area', ''))) = lower(trim(coalesce(d->>'area', (select data->>'area' from public.docs where id = 'stores/' || p_sid), '')))) then
      raise exception 'Nama toko ini sudah dipakai toko lain di daerah yang sama';
    end if;
  end if;
  if p_new and not public.jt_is_owner(p_key) and exists (
      select 1 from public.doc_keys k join public.docs s on s.id = k.id
      where k.owner_hash = h and k.id ~ '^stores/[^/]+$') then
    raise exception 'Akun ini sudah punya toko. 1 akun hanya untuk 1 toko';
  end if;
end $function$;

create or replace function public.jt_write(p_op text, p_path text, p_data jsonb, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  parts text[] := string_to_array(p_path, '/'); n int := coalesce(array_length(parts, 1), 0); h text := public.jt_h(p_key);
  v_col text; v_found boolean; v_new boolean := false;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if n not in (2, 4) or p_op not in ('set', 'update', 'delete') then raise exception 'Permintaan tidak valid'; end if;
  if p_data is not null and pg_column_size(p_data) > 600000 then raise exception 'Data terlalu besar'; end if;
  v_col := array_to_string(parts[1:n-1], '/');
  if n = 2 and parts[1] = 'stores' then
    select true into v_found from public.doc_keys where id = p_path;
    if v_found then
      if not public.jt_owns(parts[2], h) then raise exception 'Hanya pemilik toko yang bisa mengubah toko ini'; end if;
      if p_op in ('set', 'update') then perform public.jt_store_rules(parts[2], p_data, h, p_key, false); end if;
    elsif p_op = 'set' then
      perform public.jt_store_rules(parts[2], p_data, h, p_key, true);
      insert into public.doc_keys (id, owner_hash) values (p_path, h); v_new := true;
    else
      raise exception 'Toko tidak ditemukan';
    end if;
  elsif n = 4 and parts[1] = 'stores' and parts[3] = 'products' then
    if not public.jt_owns(parts[2], h) then raise exception 'Hanya pemilik toko yang bisa mengubah produk'; end if;
  else
    raise exception 'Tidak diizinkan';
  end if;
  if p_op = 'set' then
    insert into public.docs (id, col, data) values (p_path, v_col, p_data) on conflict (id) do update set data = excluded.data, updated_at = now();
    if v_new then perform public.jt_give_bonus(parts[2]); end if;
  elsif p_op = 'update' then
    update public.docs set data = public.jt_merge(data, p_data), updated_at = now() where id = p_path;
    if not found then raise exception 'Data tidak ditemukan'; end if;
  else
    delete from public.docs where id = p_path or (n = 2 and col = p_path || '/products');
    if n = 2 then
      delete from public.doc_keys where id = p_path; delete from public.jt_store_auth where store_id = parts[2]; delete from public.jt_store_devices where store_id = parts[2];
    end if;
  end if;
  return jsonb_build_object('ok', true);
end $function$;

revoke execute on function public.jt_self_job(jsonb, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.jt_store_rules(text, jsonb, text, text, boolean) from public, anon, authenticated;
