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
  v_dist double precision;
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

  v_data := (p_data - 'driver' - 'driverId' - 'driverLoc' - 'searchAt' - 'declined' - 'ongkirFinal' - 'storeLoc' - 'acceptedAt' - 'pickedAt' - 'ongkirEst' - 'ongkirDist' - 'ongkirRate') || jsonb_build_object(
    'storeName', v_store->>'name', 'storeAddress', coalesce(v_store->>'address', ''), 'storeWa', coalesce(v_store->>'wa', ''),
    'items', v_items, 'subtotal', v_total, 'ongkir', 0, 'admin', 0, 'total', v_total,
    'ongkirPer500', 2000,
    'shareRate', 0.03, 'share', round(v_total * 0.03),
    'status', case when v_payk = 'cod' then 'menunggu_konfirmasi' else 'menunggu_pembayaran' end);
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

