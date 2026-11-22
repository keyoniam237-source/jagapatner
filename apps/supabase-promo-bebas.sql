-- JAGA Step 5b: kode promo (dibiayai toko) + bebas komisi per toko/driver (owner). Diterapkan sebagai migrasi jaga_promo_bebas_komisi.
-- Layanan "service fee" sengaja belum dibuat: butuh keputusan alur uang (siapa menagih & menyetor).

create table if not exists public.jt_promo (
  store_id text not null, code text not null, kind text not null check (kind in ('pct','flat')),
  value numeric not null check (value > 0), max_disc numeric, min_sub numeric not null default 0,
  quota int, used int not null default 0, expires bigint, active boolean not null default true,
  created_at timestamptz not null default now(), primary key (store_id, code));
alter table public.jt_promo enable row level security;
revoke all on public.jt_promo from anon, authenticated;

create or replace function public.jt_promo_calc(p_sid text, p_code text, p_sub numeric) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare r public.jt_promo; d numeric;
begin
  select * into r from public.jt_promo where store_id = p_sid and code = upper(coalesce(p_code, ''));
  if not found or not r.active then return jsonb_build_object('ok', false, 'msg', 'Kode promo tidak ditemukan'); end if;
  if r.expires is not null and r.expires < public.jt_now_ms() then return jsonb_build_object('ok', false, 'msg', 'Kode promo sudah kedaluwarsa'); end if;
  if r.quota is not null and r.used >= r.quota then return jsonb_build_object('ok', false, 'msg', 'Kuota promo sudah habis'); end if;
  if p_sub < r.min_sub then return jsonb_build_object('ok', false, 'msg', 'Belanja minimal Rp' || replace(to_char(r.min_sub, 'FM999,999,999'), ',', '.') || ' untuk kode ini'); end if;
  d := case when r.kind = 'pct' then round(p_sub * r.value / 100) else r.value end;
  if r.max_disc is not null then d := least(d, r.max_disc); end if;
  d := least(d, floor(p_sub * 0.9));
  if d <= 0 then return jsonb_build_object('ok', false, 'msg', 'Kode promo tidak berlaku'); end if;
  return jsonb_build_object('ok', true, 'disc', d, 'code', r.code);
end $$;
revoke all on function public.jt_promo_calc(text, text, numeric) from anon, authenticated, public;

create or replace function public.jt_promo_check(p_sid text, p_code text, p_sub numeric) returns jsonb language sql stable security definer set search_path to 'public' as $$
  select public.jt_promo_calc(p_sid, p_code, p_sub) $$;
grant execute on function public.jt_promo_check(text, text, numeric) to anon, authenticated;

create or replace function public.jt_promo_list(p_sid text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_owns(p_sid, public.jt_h(p_key)) then raise exception 'Tidak diizinkan'; end if;
  return coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from (select code, kind, value, max_disc, min_sub, quota, used, expires, active, created_at from public.jt_promo where store_id = p_sid) x), '[]'::jsonb);
end $$;
grant execute on function public.jt_promo_list(text, text) to anon, authenticated;

create or replace function public.jt_promo_save(p_sid text, p_data jsonb, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare c text := upper(trim(coalesce(p_data->>'code', ''))); k text := coalesce(p_data->>'kind', 'pct'); v numeric := (p_data->>'value')::numeric;
begin
  if not public.jt_owns(p_sid, public.jt_h(p_key)) then raise exception 'Tidak diizinkan'; end if;
  if c !~ '^[A-Z0-9]{3,20}$' then raise exception 'Kode 3-20 huruf/angka tanpa spasi'; end if;
  if k not in ('pct', 'flat') then raise exception 'Jenis promo tidak valid'; end if;
  if v is null or (k = 'pct' and (v < 1 or v > 90)) or (k = 'flat' and (v < 500 or v > 1000000)) then raise exception 'Nilai promo tidak valid'; end if;
  insert into public.jt_promo (store_id, code, kind, value, max_disc, min_sub, quota, expires, active)
  values (p_sid, c, k, v, nullif((p_data->>'max_disc')::numeric, 0), greatest(0, coalesce((p_data->>'min_sub')::numeric, 0)),
          nullif(least(100000, (p_data->>'quota')::int), 0), nullif((p_data->>'expires')::bigint, 0), true)
  on conflict (store_id, code) do update set kind = excluded.kind, value = excluded.value, max_disc = excluded.max_disc, min_sub = excluded.min_sub,
    quota = excluded.quota, expires = excluded.expires, active = true;
  return jsonb_build_object('ok', true, 'code', c);
end $$;
grant execute on function public.jt_promo_save(text, jsonb, text) to anon, authenticated;

create or replace function public.jt_promo_toggle(p_sid text, p_code text, p_active boolean, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_owns(p_sid, public.jt_h(p_key)) then raise exception 'Tidak diizinkan'; end if;
  update public.jt_promo set active = p_active where store_id = p_sid and code = upper(p_code);
  return jsonb_build_object('ok', true);
end $$;
grant execute on function public.jt_promo_toggle(text, text, boolean, text) to anon, authenticated;

-- bebas komisi
create or replace function public.jt_exempt(p_kind text, p_id text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select (value->>(p_kind || ':' || p_id))::bigint from public.jt_settings where key = 'exempt'), 0) > public.jt_now_ms() $$;
revoke all on function public.jt_exempt(text, text) from anon, authenticated, public;

create or replace function public.jt_owner_exempt(p_kind text, p_id text, p_days int, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare cur jsonb; kk text := p_kind || ':' || p_id; until bigint;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if p_kind not in ('s', 'd') then raise exception 'Jenis tidak valid'; end if;
  if p_days is null or p_days < 0 or p_days > 365 then raise exception 'Durasi 0-365 hari'; end if;
  select coalesce(value, '{}'::jsonb) into cur from public.jt_settings where key = 'exempt';
  cur := coalesce(cur, '{}'::jsonb);
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into cur from jsonb_each(cur) where (value #>> '{}')::bigint > public.jt_now_ms() and key <> kk;
  if p_days > 0 then until := public.jt_now_ms() + p_days * 86400000::bigint; cur := cur || jsonb_build_object(kk, until); end if;
  insert into public.jt_settings (key, value) values ('exempt', cur) on conflict (key) do update set value = excluded.value;
  perform public.jt_audit_log(p_key, 'comm.exempt', kk, jsonb_build_object('days', p_days, 'until', until));
  return cur;
end $$;
grant execute on function public.jt_owner_exempt(text, text, int, text) to anon, authenticated;

create or replace function public.jt_owner_exempt_list(p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return coalesce((select value from public.jt_settings where key = 'exempt'), '{}'::jsonb);
end $$;
grant execute on function public.jt_owner_exempt_list(text) to anon, authenticated;

do $patch$
declare f text; o text; n text;
begin
  -- pembuatan pesanan: promo + bebas komisi toko
  f := pg_get_functiondef('public.jt_order_create(text,jsonb,text)'::regprocedure);
  o := E'declare\n  h text := public.jt_h(p_key);'; n := E'declare\n  v_code text; v_pr jsonb; v_disc numeric := 0;\n  h text := public.jt_h(p_key);';
  if position(o in f) = 0 then raise exception 'patch-decl'; end if; f := replace(f, o, n);
  o := E'  v_data := (p_data - ''voucher''';
  n := E'  v_code := upper(coalesce(p_data->>''promo'', ''''));\n  if v_code <> '''' then\n    v_pr := public.jt_promo_calc(v_sid, v_code, v_total);\n    if not (v_pr->>''ok'')::boolean then raise exception ''%'', v_pr->>''msg''; end if;\n    update public.jt_promo set used = used + 1 where store_id = v_sid and code = v_code and (quota is null or used < quota);\n    if not found then raise exception ''Kuota promo sudah habis''; end if;\n    v_disc := (v_pr->>''disc'')::numeric;\n  end if;\n' || o;
  if position(o in f) = 0 then raise exception 'patch-promo'; end if; f := replace(f, o, n);
  o := E'(p_data - ''voucher''';  n := E'(p_data - ''promo'' - ''voucher''';
  f := replace(f, o, n);
  o := $o$'total', v_total, 'ongkirPer500'$o$; n := $n$'total', v_total - v_disc, 'ongkirPer500'$n$;
  if position(o in f) = 0 then raise exception 'patch-total'; end if; f := replace(f, o, n);
  o := $o$'share', public.jt_comm_calc(v_total, 'store')$o$; n := $n$'share', case when public.jt_exempt('s', v_sid) then 0 else public.jt_comm_calc(v_total - v_disc, 'store') end$n$;
  if position(o in f) = 0 then raise exception 'patch-share'; end if; f := replace(f, o, n);
  o := E'  insert into public.docs (id, col, data) values (''orders/'' || p_id';
  n := E'  if v_disc > 0 then v_data := v_data || jsonb_build_object(''promo'', jsonb_build_object(''code'', v_code, ''disc'', v_disc)); end if;\n' || o;
  if position(o in f) = 0 then raise exception 'patch-ins'; end if; f := replace(f, o, n);
  execute f;

  -- pembatalan mengembalikan kuota promo
  f := pg_get_functiondef('public.jt_order_update(text,jsonb,text)'::regprocedure);
  o := E'    for v_item in select * from jsonb_array_elements(v_old->''items'') loop\n      update public.docs set data = jsonb_set(data, ''{stock}''';
  n := E'    if v_old #>> ''{promo,code}'' is not null then update public.jt_promo set used = greatest(0, used - 1) where store_id = k.store_id and code = v_old #>> ''{promo,code}''; end if;\n' || o;
  if position(o in f) = 0 then raise exception 'patch-cancel'; end if; f := replace(f, o, n);
  execute f;

  -- bebas komisi driver (antar & Jago)
  f := pg_get_functiondef('public.jt_driver_act(text,text,jsonb,text)'::regprocedure);
  o := $o$public.jt_comm_calc(round(v_ongkir), 'drv')$o$; n := $n$(case when public.jt_exempt('d', did) then 0 else public.jt_comm_calc(round(v_ongkir), 'drv') end)$n$;
  if position(o in f) = 0 then raise exception 'patch-drv'; end if; f := replace(f, o, n);
  execute f;
end $patch$;
