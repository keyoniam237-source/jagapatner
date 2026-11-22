-- JAGA: komisi yang bisa diatur owner (storePct, drvPct, minTx, round). Default 3%. Sudah diterapkan sebagai migrasi jaga_komisi_konfigurasi.
create or replace function public.jt_comm_cfg() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'storePct', greatest(0, least(30, coalesce((c->>'storePct')::numeric, 3))),
    'drvPct',   greatest(0, least(30, coalesce((c->>'drvPct')::numeric, 3))),
    'minTx',    greatest(0, coalesce((c->>'minTx')::numeric, 0)),
    'round',    greatest(1, coalesce((c->>'round')::numeric, 1)))
  from (select public.jt_wallet_cfg() c) x $$;
grant execute on function public.jt_comm_cfg() to anon, authenticated;

-- hitung komisi dalam rupiah bulat: kind 'store' (penjualan toko) atau 'drv' (ongkir/tarif Jago)
create or replace function public.jt_comm_calc(p_base numeric, p_kind text) returns numeric language plpgsql stable security definer set search_path to 'public' as $$
declare c jsonb := public.jt_comm_cfg(); pct numeric; stp numeric := (c->>'round')::numeric;
begin
  if p_base is null or p_base <= 0 or p_base < (c->>'minTx')::numeric then return 0; end if;
  pct := case when p_kind = 'store' then (c->>'storePct')::numeric else (c->>'drvPct')::numeric end;
  return round(round(p_base * pct / 100 / stp) * stp);
end $$;

create or replace function public.jt_drv_fee(o jsonb) returns numeric language sql stable set search_path to 'public' as $$
  select public.jt_comm_calc(coalesce((o->>'fareEst')::numeric, (o->>'ongkirEst')::numeric, 0), 'drv') $$;
create or replace function public.jt_ride_fee(o jsonb) returns numeric language sql stable set search_path to 'public' as $$
  select public.jt_comm_calc(coalesce((o->>'fareEst')::numeric, 0), 'drv') $$;

do $patch$
declare f text; o text; n text;
begin
  f := pg_get_functiondef('public.jt_driver_act(text,text,jsonb,text)'::regprocedure);
  o := 'round(round(v_ongkir) * 0.03)'; n := $n$public.jt_comm_calc(round(v_ongkir), 'drv')$n$;
  if position(o in f) = 0 then raise exception 'patch-act'; end if; f := replace(f, o, n);
  o := $o$'Potongan 3% ongkir antar '$o$; n := $n$'Potongan ongkir antar '$n$;
  if position(o in f) > 0 then f := replace(f, o, n); end if;
  execute f;

  f := pg_get_functiondef('public.jt_order_create(text,jsonb,text)'::regprocedure);
  o := $o$'shareRate', 0.03, 'share', round(v_total * 0.03)$o$;
  n := $n$'shareRate', (public.jt_comm_cfg()->>'storePct')::numeric / 100, 'share', public.jt_comm_calc(v_total, 'store')$n$;
  if position(o in f) = 0 then raise exception 'patch-create'; end if; f := replace(f, o, n);
  execute f;

  f := pg_get_functiondef('public.jt_charge_fee(text)'::regprocedure);
  o := $o$'Bagi hasil 3% pesanan '$o$; n := $n$'Bagi hasil ' || trim(trailing '.' from trim(trailing '0' from to_char(coalesce((o->>'shareRate')::numeric, 0.03) * 100, 'FM990.99'))) || '% pesanan '$n$;
  if position(o in f) = 0 then raise exception 'patch-charge'; end if; f := replace(f, o, n);
  execute f;

  f := pg_get_functiondef('public.jt_owner_wallet_cfg(jsonb,text)'::regprocedure);
  o := $o$  if p_data ? 'bank' then$o$;
  n := $n$  if p_data ? 'storePct' then p := p || jsonb_build_object('storePct', greatest(0, least(30, (p_data->>'storePct')::numeric))); end if;
  if p_data ? 'drvPct' then p := p || jsonb_build_object('drvPct', greatest(0, least(30, (p_data->>'drvPct')::numeric))); end if;
  if p_data ? 'minTx' then p := p || jsonb_build_object('minTx', greatest(0, least(10000000, (p_data->>'minTx')::numeric))); end if;
  if p_data ? 'round' then
    if (p_data->>'round')::numeric not in (1, 10, 100, 500, 1000) then raise exception 'Pembulatan harus 1, 10, 100, 500, atau 1000'; end if;
    p := p || jsonb_build_object('round', (p_data->>'round')::numeric);
  end if;
  if p_data ? 'bank' then$n$;
  if position(o in f) = 0 then raise exception 'patch-cfg'; end if; f := replace(f, o, n);
  execute f;
end $patch$;
