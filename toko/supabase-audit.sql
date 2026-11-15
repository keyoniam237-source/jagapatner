-- JAGA: jejak audit owner (append-only). Sudah diterapkan sebagai migrasi jaga_jejak_audit_owner. Catatan: pada migrasi live, detail wallet.cfg dibungkus jsonb_strip_nulls.
create table if not exists public.jt_audit (
  id bigserial primary key, at timestamptz not null default now(),
  actor text not null default 'owner', action text not null, target text, detail jsonb not null default '{}'::jsonb);
create index if not exists jt_audit_at on public.jt_audit (at desc);
alter table public.jt_audit enable row level security;
revoke all on public.jt_audit from anon, authenticated;
revoke all on sequence public.jt_audit_id_seq from anon, authenticated;

-- append-only: tidak bisa diubah atau dihapus lewat SQL biasa
create or replace function public.jt_audit_immutable() returns trigger language plpgsql as $$ begin raise exception 'Jejak audit tidak boleh diubah atau dihapus'; end $$;
drop trigger if exists jt_audit_no_change on public.jt_audit;
create trigger jt_audit_no_change before update or delete on public.jt_audit for each row execute function public.jt_audit_immutable();
drop trigger if exists jt_audit_no_truncate on public.jt_audit;
create trigger jt_audit_no_truncate before truncate on public.jt_audit for each statement execute function public.jt_audit_immutable();

create or replace function public.jt_audit_log(p_key text, p_action text, p_target text, p_detail jsonb) returns void language plpgsql security definer set search_path to 'public' as $$
begin
  insert into public.jt_audit (actor, action, target, detail)
  values (coalesce((select login from public.jt_owner_devices where key_hash = public.jt_h(p_key) limit 1), 'owner'), p_action, left(coalesce(p_target, ''), 120), coalesce(p_detail, '{}'::jsonb));
end $$;
revoke all on function public.jt_audit_log(text, text, text, jsonb) from anon, authenticated, public;

create or replace function public.jt_owner_audit(p_key text, p_limit int default 200) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return coalesce((select jsonb_agg(to_jsonb(x)) from (select id, at, actor, action, target, detail from public.jt_audit order by id desc limit greatest(1, least(500, coalesce(p_limit, 200)))) x), '[]'::jsonb);
end $$;
grant execute on function public.jt_owner_audit(text, int) to anon, authenticated;

do $patch$
declare r record; f text; o text; n text;
  chk text := 'if not public.jt_is_owner(p_key) then raise exception ''Khusus owner''; end if;';
begin
  for r in select * from (values
    ('public.jt_owner_areas_save(jsonb,text)', 'areas.save', $$'areas'$$, $$jsonb_build_object('count', jsonb_array_length(p_areas))$$),
    ('public.jt_owner_driver_active(text,boolean,text,text)', 'driver.active', 'p_driver', $$jsonb_build_object('active', p_active, 'note', left(coalesce(p_note, ''), 200))$$),
    ('public.jt_owner_driver_delete(text,text)', 'driver.delete', 'p_driver', $$jsonb_build_object('driver', p_driver)$$),
    ('public.jt_owner_driver_verify(text,boolean,text,text)', 'driver.verify', 'p_driver', $$jsonb_build_object('ok', p_ok, 'note', left(coalesce(p_note, ''), 200))$$),
    ('public.jt_owner_order_set(text,text,text,text,text)', 'order.set', $$p_kind || '/' || p_id$$, $$jsonb_build_object('status', p_status, 'note', left(coalesce(p_note, ''), 200))$$),
    ('public.jt_owner_report_set(bigint,text,text,text)', 'report.set', $$p_id::text$$, $$jsonb_build_object('status', p_status, 'note', left(coalesce(p_note, ''), 200))$$),
    ('public.jt_owner_store_active(text,boolean,text)', 'store.active', 'p_store', $$jsonb_build_object('active', p_active)$$),
    ('public.jt_owner_store_delete(text,text)', 'store.delete', 'p_store', $$jsonb_build_object('store', p_store)$$),
    ('public.jt_owner_topup_decide(bigint,boolean,text)', 'topup.decide', $$p_id::text$$, $$jsonb_build_object('ok', p_ok)$$),
    ('public.jt_owner_wallet_adjust(text,numeric,text,text)', 'wallet.adjust', 'p_store', $$jsonb_build_object('amount', round(p_amount), 'note', left(coalesce(p_note, ''), 200))$$),
    ('public.jt_owner_wallet_cfg(jsonb,text)', 'wallet.cfg', $$'wallet'$$, $$jsonb_build_object('keys', (select coalesce(jsonb_agg(kk.kname), '[]'::jsonb) from jsonb_object_keys(p_data) as kk(kname) where kk.kname not in ('qris', 'bank', 'pay')), 'storePct', p_data->'storePct', 'drvPct', p_data->'drvPct', 'minTx', p_data->'minTx', 'round', p_data->'round', 'minBalance', p_data->'minBalance', 'bonus', p_data->'bonus', 'payCount', case when p_data ? 'pay' then jsonb_array_length(p_data->'pay') end)$$)
  ) v(sig, act, tgt, det) loop
    f := pg_get_functiondef(r.sig::regprocedure);
    if position('jt_audit_log' in f) > 0 then continue; end if;
    if position(chk in f) = 0 then raise exception 'audit-patch % tidak menemukan pemeriksaan owner', r.sig; end if;
    n := chk || E'\n  perform public.jt_audit_log(p_key, ' || quote_literal(r.act) || ', ' || r.tgt || ', ' || r.det || ');';
    f := replace(f, chk, n);
    execute f;
  end loop;

  -- ganti password owner
  f := pg_get_functiondef('public.jt_owner_setpass(text,text)'::regprocedure);
  if position('jt_audit_log' in f) = 0 then
    o := 'update public.jt_owner_auth set pass_hash';
    if position(o in f) = 0 then raise exception 'audit-patch setpass'; end if;
    f := replace(f, o, E'perform public.jt_audit_log(p_key, ''owner.setpass'', v_login, ''{}''::jsonb);\n  ' || o);
    execute f;
  end if;
end $patch$;
