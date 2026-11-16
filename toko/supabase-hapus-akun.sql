-- Hapus akun sendiri (pembeli, toko, driver).
-- Syarat: tidak ada pesanan berjalan, tidak ada isi saldo yang masih menunggu,
-- dan tanggungan bagi hasil lunas (saldo tidak minus). Riwayat saldo & audit tetap tersimpan.

create or replace function public.jt_account_check(p_role text, p_id text, h text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare v_id text; v_w text; v_bal numeric := 0; v_pend numeric := 0; v_act int := 0; v_name text; v_why jsonb := '[]'::jsonb;
begin
  if p_role = 'buyer' then
    select count(*) into v_act from public.doc_keys k join public.docs d on d.id = k.id
      where k.buyer_hash = h and d.col in ('orders','rides') and d.data->>'status' not in ('selesai','dibatalkan');
    select name into v_name from public.jt_buyers where key_hash = h;
    v_id := h;
  elsif p_role = 'store' then
    if p_id is null or not public.jt_owns(p_id, h) then raise exception 'Hanya pemilik toko'; end if;
    v_id := p_id; v_w := p_id;
    select data->>'name' into v_name from public.docs where id = 'stores/' || v_id;
    if v_name is null then raise exception 'Toko tidak ditemukan'; end if;
    select count(*) into v_act from public.docs where col = 'orders' and data->>'storeId' = v_id and data->>'status' not in ('selesai','dibatalkan');
  elsif p_role = 'driver' then
    v_id := public.jt_driver_id(h); v_w := 'drv:' || v_id;
    select data->>'name' into v_name from public.docs where id = 'drivers/' || v_id;
    if v_name is null then raise exception 'Akun driver tidak ditemukan'; end if;
    select count(*) into v_act from public.docs where col in ('orders','rides') and data->>'driverId' = v_id and data->>'status' not in ('selesai','dibatalkan');
  else
    raise exception 'Permintaan tidak valid';
  end if;
  if v_w is not null then
    v_bal := public.jt_balance(v_w);
    select coalesce(sum(amount), 0) into v_pend from public.jt_wallet_tx where store_id = v_w and status = 'pending';
  end if;
  if v_act > 0 then v_why := v_why || to_jsonb('Masih ada ' || v_act || ' pesanan berjalan. Selesaikan atau batalkan dulu.'); end if;
  if v_bal < 0 then v_why := v_why || to_jsonb('Masih ada tanggungan bagi hasil Rp' || to_char(-v_bal, 'FM999G999G999') || '. Lunasi dulu lewat Isi saldo.'); end if;
  if v_pend > 0 then v_why := v_why || to_jsonb('Isi saldo Rp' || to_char(v_pend, 'FM999G999G999') || ' masih menunggu persetujuan JAGA. Tunggu sampai diproses.'); end if;
  return jsonb_build_object('id', v_id, 'wallet', v_w, 'name', coalesce(v_name, ''), 'balance', v_bal, 'due', greatest(-v_bal, 0),
    'pending', v_pend, 'active', v_act, 'ok', jsonb_array_length(v_why) = 0, 'why', v_why);
end $$;

create or replace function public.jt_account_status(p_role text, p_id text, p_key text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  return public.jt_account_check(p_role, p_id, public.jt_h(p_key)) - 'wallet';
end $$;

create or replace function public.jt_account_delete(p_role text, p_id text, p_key text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text; c jsonb; v_id text;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  h := public.jt_h(p_key);
  -- kunci baris akun supaya tidak ada pesanan baru yang masuk di tengah penghapusan
  if p_role = 'store' then perform 1 from public.docs where id = 'stores/' || p_id for update;
  elsif p_role = 'driver' then perform 1 from public.docs where id = 'drivers/' || public.jt_driver_id(h) for update; end if;
  c := public.jt_account_check(p_role, p_id, h);
  if not (c->>'ok')::boolean then raise exception '%', c->'why'->>0; end if;
  v_id := c->>'id';
  insert into public.jt_audit (actor, action, target, detail)
    values (p_role || ':self', 'account.delete', left(case when p_role = 'buyer' then 'buyer' else v_id end, 120),
      jsonb_build_object('role', p_role, 'name', c->>'name', 'balance', c->'balance'));
  if p_role = 'buyer' then
    delete from public.jt_buyers where key_hash = h;
    delete from public.jt_push_subs where key_hash = h and role = 'buyer';
  elsif p_role = 'store' then
    delete from public.docs where id = 'stores/' || v_id or col in ('stores/' || v_id || '/products', 'stores/' || v_id || '/stocklog');
    delete from public.doc_keys where id = 'stores/' || v_id;
    delete from public.jt_store_auth where store_id = v_id;
    delete from public.jt_store_devices where store_id = v_id;
    delete from public.jt_store_wa where store_id = v_id;
    delete from public.jt_promo where store_id = v_id;
    delete from public.jt_support where thread = 'store:' || v_id;
  else
    delete from public.docs where id = 'drivers/' || v_id;
    delete from public.doc_keys where id = 'drivers/' || v_id;
    delete from public.jt_driver_docs where driver_id = v_id;
    delete from public.jt_support where thread = 'drv:' || v_id;
    delete from public.jt_push_subs where key_hash = h and role = 'driver';
  end if;
  return jsonb_build_object('ok', true, 'balance', c->'balance');
end $$;

revoke all on function public.jt_account_check(text, text, text) from public, anon, authenticated;
grant execute on function public.jt_account_status(text, text, text) to anon, authenticated;
grant execute on function public.jt_account_delete(text, text, text) to anon, authenticated;
