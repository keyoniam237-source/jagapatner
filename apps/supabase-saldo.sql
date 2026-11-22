create table if not exists public.jt_wallet_tx (
  id bigserial primary key,
  store_id text not null,
  kind text not null check (kind in ('topup','fee','bonus','adjust')),
  amount numeric not null,
  status text not null default 'ok' check (status in ('pending','ok','rejected')),
  order_id text,
  note text not null default '',
  proof text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create index if not exists jt_wallet_tx_store_idx on public.jt_wallet_tx (store_id, id desc);
create unique index if not exists jt_wallet_tx_fee_once on public.jt_wallet_tx (order_id) where kind = 'fee';
create table if not exists public.jt_settings (key text primary key, value jsonb not null default '{}'::jsonb);
alter table public.jt_wallet_tx enable row level security;
alter table public.jt_settings enable row level security;
revoke all on public.jt_wallet_tx, public.jt_settings from anon, authenticated;
insert into public.jt_settings (key, value) values ('wallet', '{"minBalance":10000,"bonus":20000,"bank":{"name":"","no":"","holder":""},"qris":""}'::jsonb)
  on conflict (key) do nothing;

create or replace function public.jt_wallet_cfg() returns jsonb language sql stable security definer set search_path = public as
$$ select coalesce((select value from public.jt_settings where key = 'wallet'), '{}'::jsonb) $$;
create or replace function public.jt_balance(p_sid text) returns numeric language sql stable security definer set search_path = public as
$$ select coalesce(sum(amount), 0) from public.jt_wallet_tx where store_id = p_sid and status = 'ok' $$;
create or replace function public.jt_can_accept(p_sid text, p_share numeric) returns boolean language sql stable security definer set search_path = public as
$$ select public.jt_balance(p_sid) >= greatest(coalesce((public.jt_wallet_cfg()->>'minBalance')::numeric, 0), coalesce(p_share, 0)) $$;
create or replace function public.jt_charge_fee(p_order text) returns void language plpgsql security definer set search_path = public as $$
declare o jsonb;
begin
  select data into o from public.docs where id = 'orders/' || p_order;
  if o is null or coalesce((o->>'share')::numeric, 0) <= 0 then return; end if;
  insert into public.jt_wallet_tx (store_id, kind, amount, order_id, note)
    values (o->>'storeId', 'fee', -round((o->>'share')::numeric), p_order, 'Bagi hasil 3% pesanan ' || coalesce(o->>'code', p_order) || ' (' || to_char(coalesce((o->>'total')::numeric, 0), 'FM999G999G999') || ')')
    on conflict do nothing;
end $$;
create or replace function public.jt_give_bonus(p_sid text) returns void language plpgsql security definer set search_path = public as $$
declare b numeric := coalesce((public.jt_wallet_cfg()->>'bonus')::numeric, 0);
begin
  if b > 0 and not exists (select 1 from public.jt_wallet_tx where store_id = p_sid and kind = 'bonus') then
    insert into public.jt_wallet_tx (store_id, kind, amount, note) values (p_sid, 'bonus', b, 'Saldo gratis toko baru');
  end if;
end $$;
revoke all on function public.jt_wallet_cfg(), public.jt_balance(text), public.jt_can_accept(text, numeric), public.jt_charge_fee(text), public.jt_give_bonus(text) from public, anon, authenticated;

create or replace function public.jt_wallet_txjson(t public.jt_wallet_tx) returns jsonb language sql immutable as $$
  select jsonb_build_object('id', t.id, 'kind', t.kind, 'amount', t.amount, 'status', t.status, 'orderId', t.order_id, 'note', t.note,
    'at', (extract(epoch from t.created_at) * 1000)::bigint, 'hasProof', t.proof is not null)
$$;

-- toko: saldo, mutasi, info rekening Jaga Toko
create or replace function public.jt_wallet(p_store text, p_key text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare c jsonb := public.jt_wallet_cfg();
begin
  if not public.jt_owns(p_store, public.jt_h(p_key)) then raise exception 'Hanya pemilik toko'; end if;
  return jsonb_build_object(
    'balance', public.jt_balance(p_store),
    'pending', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where store_id = p_store and status = 'pending'),
    'cfg', jsonb_build_object('minBalance', coalesce((c->>'minBalance')::numeric, 0), 'bank', coalesce(c->'bank', '{}'::jsonb), 'qris', coalesce(c->>'qris', '')),
    'txs', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) order by t.id desc) from (select * from public.jt_wallet_tx where store_id = p_store order by id desc limit 150) t), '[]'::jsonb));
end $$;

create or replace function public.jt_wallet_topup(p_store text, p_amount numeric, p_proof text, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.jt_owns(p_store, public.jt_h(p_key)) then raise exception 'Hanya pemilik toko'; end if;
  if p_amount is null or p_amount < 10000 or p_amount > 10000000 then raise exception 'Jumlah isi saldo Rp10.000 – Rp10.000.000'; end if;
  if coalesce(p_proof, '') !~ '^data:image/' or length(p_proof) > 900000 then raise exception 'Unggah foto bukti transfer'; end if;
  if (select count(*) from public.jt_wallet_tx where store_id = p_store and status = 'pending') >= 3 then raise exception 'Masih ada 3 pengisian menunggu dicek'; end if;
  insert into public.jt_wallet_tx (store_id, kind, amount, status, note, proof) values (p_store, 'topup', round(p_amount), 'pending', 'Isi saldo', p_proof);
  return jsonb_build_object('ok', true);
end $$;

-- owner
create or replace function public.jt_owner_wallet(p_key text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return jsonb_build_object(
    'cfg', public.jt_wallet_cfg(),
    'pending', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) || jsonb_build_object('storeId', t.store_id, 'proof', t.proof) order by t.id) from public.jt_wallet_tx t where t.status = 'pending'), '[]'::jsonb),
    'balances', coalesce((select jsonb_object_agg(store_id, b) from (select store_id, sum(amount) b from public.jt_wallet_tx where status = 'ok' group by store_id) x), '{}'::jsonb),
    'fees', coalesce((select jsonb_object_agg(store_id, f) from (select store_id, -sum(amount) f from public.jt_wallet_tx where kind = 'fee' group by store_id) x), '{}'::jsonb),
    'totals', jsonb_build_object(
      'fee', (select coalesce(-sum(amount), 0) from public.jt_wallet_tx where kind = 'fee'),
      'feeMonth', (select coalesce(-sum(amount), 0) from public.jt_wallet_tx where kind = 'fee' and created_at >= date_trunc('month', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta'),
      'topup', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'topup' and status = 'ok'),
      'bonus', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'bonus'),
      'saldo', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where status = 'ok')),
    'recent', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) || jsonb_build_object('storeId', t.store_id) order by t.id desc) from (select * from public.jt_wallet_tx where status <> 'pending' order by id desc limit 60) t), '[]'::jsonb));
end $$;

create or replace function public.jt_owner_topup_decide(p_id bigint, p_ok boolean, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  update public.jt_wallet_tx set status = case when p_ok then 'ok' else 'rejected' end, decided_at = now(),
    note = case when p_ok then 'Isi saldo (disetujui)' else 'Isi saldo ditolak — hubungi Jaga Toko' end
   where id = p_id and kind = 'topup' and status = 'pending';
  if not found then raise exception 'Pengisian tidak ditemukan atau sudah diproses'; end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.jt_owner_wallet_cfg(p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c jsonb := public.jt_wallet_cfg(); p jsonb := '{}'::jsonb;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if p_data ? 'minBalance' then p := p || jsonb_build_object('minBalance', greatest(0, least(10000000, (p_data->>'minBalance')::numeric))); end if;
  if p_data ? 'bonus' then p := p || jsonb_build_object('bonus', greatest(0, least(1000000, (p_data->>'bonus')::numeric))); end if;
  if p_data ? 'bank' then p := p || jsonb_build_object('bank', jsonb_build_object('name', left(coalesce(p_data#>>'{bank,name}', ''), 60), 'no', left(coalesce(p_data#>>'{bank,no}', ''), 40), 'holder', left(coalesce(p_data#>>'{bank,holder}', ''), 80))); end if;
  if p_data ? 'qris' then
    if coalesce(p_data->>'qris', '') <> '' and (p_data->>'qris' !~ '^data:image/' or length(p_data->>'qris') > 900000) then raise exception 'Gambar QRIS tidak valid'; end if;
    p := p || jsonb_build_object('qris', coalesce(p_data->>'qris', ''));
  end if;
  insert into public.jt_settings (key, value) values ('wallet', c || p) on conflict (key) do update set value = excluded.value;
  return c || p;
end $$;

create or replace function public.jt_owner_wallet_adjust(p_store text, p_amount numeric, p_note text, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if p_amount is null or p_amount = 0 or abs(p_amount) > 10000000 then raise exception 'Jumlah tidak valid'; end if;
  if not exists (select 1 from public.docs where id = 'stores/' || p_store) then raise exception 'Toko tidak ditemukan'; end if;
  insert into public.jt_wallet_tx (store_id, kind, amount, note) values (p_store, 'adjust', round(p_amount), left(coalesce(nullif(trim(p_note), ''), 'Penyesuaian oleh Jaga Toko'), 120));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.jt_owner_topup_proof(p_id bigint, p_key text) returns text
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return (select proof from public.jt_wallet_tx where id = p_id);
end $$;

grant execute on function public.jt_wallet(text, text), public.jt_wallet_topup(text, numeric, text, text), public.jt_owner_wallet(text),
  public.jt_owner_topup_decide(bigint, boolean, text), public.jt_owner_wallet_cfg(jsonb, text), public.jt_owner_wallet_adjust(text, numeric, text, text),
  public.jt_owner_topup_proof(bigint, text) to anon, authenticated;
create or replace function public.jt_order_update(p_id text, p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $function$
declare
  h text := public.jt_h(p_key);
  k record;
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
  is_buyer := k.buyer_hash = h;
  is_seller := public.jt_owns(k.store_id, h);
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

  if is_seller and v_new in ('diproses','mencari_driver','diantar','selesai') and v_cur in ('menunggu_pembayaran','menunggu_konfirmasi')
     and not public.jt_can_accept(k.store_id, coalesce((v_old->>'share')::numeric, 0)) then
    raise exception 'Saldo toko kurang (minimal %). Isi saldo dulu di menu Saldo untuk menerima pesanan.', 'Rp' || replace(to_char(greatest(coalesce((public.jt_wallet_cfg()->>'minBalance')::numeric, 0), coalesce((v_old->>'share')::numeric, 0)), 'FM999,999,999'), ',', '.');
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
    perform public.jt_charge_fee(p_id);
    for v_item in select * from jsonb_array_elements(v_old->'items') loop
      update public.docs set data = jsonb_set(data, '{sold}', to_jsonb(coalesce((data->>'sold')::numeric, 0) + (v_item->>'qty')::numeric)), updated_at = now()
        where id = 'stores/' || k.store_id || '/products/' || (v_item->>'pid');
    end loop;
  end if;
  return jsonb_build_object('ok', true);
end $function$;

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
  if p_act = 'done' then perform public.jt_charge_fee(p_id); end if;
  return o || jsonb_build_object('id', p_id);
end $$;

create or replace function public.jt_write(p_op text, p_path text, p_data jsonb, p_key text) returns jsonb
language plpgsql security definer set search_path = public as $function$
declare
  parts text[] := string_to_array(p_path, '/');
  n int := coalesce(array_length(parts, 1), 0);
  h text := public.jt_h(p_key);
  v_col text;
  v_found boolean;
  v_new boolean := false;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if n not in (2, 4) or p_op not in ('set', 'update', 'delete') then raise exception 'Permintaan tidak valid'; end if;
  if p_data is not null and pg_column_size(p_data) > 600000 then raise exception 'Data terlalu besar'; end if;
  v_col := array_to_string(parts[1:n-1], '/');
  if n = 2 and parts[1] = 'stores' then
    select true into v_found from public.doc_keys where id = p_path;
    if v_found then
      if not public.jt_owns(parts[2], h) then raise exception 'Hanya pemilik toko yang bisa mengubah toko ini'; end if;
    elsif p_op = 'set' then
      insert into public.doc_keys (id, owner_hash) values (p_path, h);
      v_new := true;
    else
      raise exception 'Toko tidak ditemukan';
    end if;
  elsif n = 4 and parts[1] = 'stores' and parts[3] = 'products' then
    if not public.jt_owns(parts[2], h) then raise exception 'Hanya pemilik toko yang bisa mengubah produk'; end if;
  else
    raise exception 'Tidak diizinkan';
  end if;
  if p_op = 'set' then
    insert into public.docs (id, col, data) values (p_path, v_col, p_data)
      on conflict (id) do update set data = excluded.data, updated_at = now();
    if v_new then perform public.jt_give_bonus(parts[2]); end if;
  elsif p_op = 'update' then
    update public.docs set data = public.jt_merge(data, p_data), updated_at = now() where id = p_path;
    if not found then raise exception 'Data tidak ditemukan'; end if;
  else
    delete from public.docs where id = p_path or (n = 2 and col = p_path || '/products');
    if n = 2 then
      delete from public.doc_keys where id = p_path;
      delete from public.jt_store_auth where store_id = parts[2];
      delete from public.jt_store_devices where store_id = parts[2];
    end if;
  end if;
  return jsonb_build_object('ok', true);
end $function$;

select public.jt_give_bonus(substring(id from 8)) from public.docs where col = 'stores';
