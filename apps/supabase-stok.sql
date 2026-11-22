create or replace function public.jt_stock_add(p_store text, p_pid text, p_type text, p_qty numeric, p_note text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare h text := public.jt_h(p_key); v_path text := 'stores/' || p_store || '/products/' || p_pid; p jsonb; v_old numeric; v_new numeric; v_q numeric := round(coalesce(p_qty, 0)); e jsonb; v_now bigint := public.jt_now_ms();
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if not public.jt_owns(p_store, h) then raise exception 'Hanya pemilik toko yang bisa mencatat stok'; end if;
  if p_type not in ('masuk','keluar','opname') then raise exception 'Jenis catatan tidak valid'; end if;
  if v_q < 0 or v_q > 1000000 or (p_type <> 'opname' and v_q < 1) then raise exception 'Jumlah tidak valid'; end if;
  select data into p from public.docs where id = v_path for update;
  if p is null then raise exception 'Barang tidak ditemukan'; end if;
  v_old := case when jsonb_typeof(p->'stock') = 'number' then (p->>'stock')::numeric else null end;
  if p_type = 'masuk' then v_new := coalesce(v_old, 0) + v_q;
  elsif p_type = 'keluar' then
    if coalesce(v_old, 0) < v_q then raise exception 'Stok tidak cukup (sisa %)', coalesce(v_old, 0); end if;
    v_new := coalesce(v_old, 0) - v_q;
  else v_new := v_q; end if;
  update public.docs set data = jsonb_set(data, '{stock}', to_jsonb(v_new)), updated_at = now() where id = v_path;
  e := jsonb_build_object('t', v_now, 'pid', p_pid, 'name', p->>'name', 'type', p_type, 'qty', v_q, 'before', v_old, 'after', v_new, 'note', left(coalesce(trim(p_note), ''), 120));
  insert into public.docs (id, col, data) values ('stores/' || p_store || '/stocklog/' || v_now || substr(md5(random()::text), 1, 6), 'stores/' || p_store || '/stocklog', e);
  return e;
end $function$;
create or replace function public.jt_stock_log(p_store text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
begin
  if p_key is null or length(p_key) < 20 or not public.jt_owns(p_store, public.jt_h(p_key)) then raise exception 'Hanya pemilik toko yang bisa melihat catatan stok'; end if;
  return coalesce((select jsonb_agg(x.data order by x.created_at desc) from (select data, created_at from public.docs where col = 'stores/' || p_store || '/stocklog' order by created_at desc limit 300) x), '[]'::jsonb);
end $function$;
