-- Driver terdekat ditugaskan otomatis untuk SEMUA order: Jago (dari titik jemput penumpang)
-- dan antar pesanan (dari lokasi toko = tempat barang diambil). Notifikasi hanya ke akun yang terlibat.

create or replace function public.jt_auto_assign(p_path text) returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare
  o jsonb; v_now bigint := public.jt_now_ms(); is_ride boolean; plat double precision; plng double precision;
  v_fee numeric; v_bwa text; v_swa text; v_bh text; cid text; cd jsonb; cdist double precision;
begin
  perform pg_advisory_xact_lock(hashtext('jt_ride_assign'));
  select data into o from public.docs where id = p_path and col in ('orders','rides') for update;
  if o is null or o->>'status' <> 'mencari_driver' then return false; end if;
  is_ride := coalesce(o->>'kind', '') = 'ride';
  if is_ride then plat := (o#>>'{pickup,lat}')::double precision; plng := (o#>>'{pickup,lng}')::double precision;
  else plat := (o#>>'{storeLoc,lat}')::double precision; plng := (o#>>'{storeLoc,lng}')::double precision; end if;
  if plat is null or plng is null then return false; end if;
  v_fee := public.jt_drv_fee(o);
  v_bwa := public.jt_wa(coalesce(o#>>'{rider,wa}', o#>>'{buyer,wa}'));
  v_swa := public.jt_wa(o->>'storeWa');
  select buyer_hash into v_bh from public.doc_keys where id = p_path;
  select substring(k.id from 9), k.data, public.jt_dist(plat, plng, (k.data->>'lat')::double precision, (k.data->>'lng')::double precision)
    into cid, cd, cdist
    from public.docs k
    join public.jt_drv_ping p on p.did = substring(k.id from 9) and p.at > now() - interval '45 seconds'
    left join public.doc_keys dk on dk.id = k.id
   where k.col = 'drivers'
     and k.data ? 'lat' and k.data ? 'lng'
     and coalesce((k.data->>'locAt')::bigint, 0) > v_now - 20 * 60 * 1000
     and not (coalesce(o->'declined', '[]'::jsonb) ? substring(k.id from 9))
     and not (v_bwa <> '' and public.jt_wa(k.data->>'wa') = v_bwa)
     and not (v_swa <> '' and public.jt_wa(k.data->>'wa') = v_swa)
     and not (v_bh is not null and dk.owner_hash = v_bh)
     and not (o ? 'storeId' and dk.owner_hash is not null and public.jt_owns(o->>'storeId', dk.owner_hash))
     and public.jt_driver_free(substring(k.id from 9), k.data)
     and public.jt_can_accept('drv:' || substring(k.id from 9), v_fee)
     and public.jt_dist(plat, plng, (k.data->>'lat')::double precision, (k.data->>'lng')::double precision) <= 5000
   order by 3
   limit 1;
  if cid is null then return false; end if;
  o := o || jsonb_build_object('status', case when is_ride then 'driver_jemput' else 'driver_ke_toko' end, 'driverId', cid, 'acceptedAt', v_now, 'updatedAt', v_now,
    'autoAssigned', true, 'assignDist', round(cdist::numeric),
    'driver', jsonb_build_object('name', cd->>'name', 'wa', cd->>'wa', 'vehicle', coalesce(cd->>'vehicle', ''), 'plate', coalesce(cd->>'plate', '')),
    'driverLoc', jsonb_build_object('lat', cd->'lat', 'lng', cd->'lng', 'at', v_now));
  if not is_ride then o := (o - 'handedAt' - 'pickTries') || jsonb_build_object('codeReq', true, 'pickCode', lpad((1000 + floor(random() * 9000))::int::text, 4, '0')); end if;
  update public.docs set data = o, updated_at = now() where id = p_path;
  return true;
end $$;
revoke all on function public.jt_auto_assign(text) from public, anon, authenticated;

create or replace function public.jt_ride_assign(p_id text) returns boolean
language sql security definer set search_path to 'public' as $$ select public.jt_auto_assign('rides/' || p_id) $$;
revoke all on function public.jt_ride_assign(text) from public, anon, authenticated;

-- driver yang aplikasinya terbuka langsung mendapat order terdekat (Jago & antar)
do $do$ declare d text; begin
  d := pg_get_functiondef('public.jt_driver_jobs(text)'::regprocedure);
  d := replace(d, $a$for r in select split_part(o.id, '/', 2) rid from public.docs o where o.col = 'rides' and o.data->>'status' = 'mencari_driver' order by o.created_at limit 20 loop
      perform public.jt_ride_assign(r.rid);$a$, $a$for r in select o.id rid from public.docs o where o.col in ('orders','rides') and o.data->>'status' = 'mencari_driver' order by o.created_at limit 30 loop
      perform public.jt_auto_assign(r.rid);$a$);
  if position('jt_auto_assign' in d) = 0 then raise exception 'patch jt_driver_jobs gagal'; end if;
  execute d;
end $do$;

-- push: order yang masih mencari driver hanya dikirim ke SATU driver terdekat (bukan semua driver)
do $do$ declare d text; begin
  d := pg_get_functiondef('public.jt_push_targets(text,text)'::regprocedure);
  d := replace(d, $a$       and (slat is null or (d.data ? 'lat' and coalesce((d.data->>'locAt')::bigint, 0) > v_now - 30 * 60 * 1000
            and public.jt_dist(slat, slng, (d.data->>'lat')::double precision, (d.data->>'lng')::double precision) <= 5000))), '[]'::jsonb);$a$,
  $a$       and slat is not null and d.data ? 'lat' and coalesce((d.data->>'locAt')::bigint, 0) > v_now - 30 * 60 * 1000
       and public.jt_dist(slat, slng, (d.data->>'lat')::double precision, (d.data->>'lng')::double precision) <= 5000
       and substring(d.id from 9) = (select substring(d2.id from 9) from public.docs d2
            where d2.col = 'drivers' and public.jt_driver_free(substring(d2.id from 9), d2.data)
              and not (coalesce(o->'declined', '[]'::jsonb) ? substring(d2.id from 9))
              and d2.data ? 'lat' and coalesce((d2.data->>'locAt')::bigint, 0) > v_now - 30 * 60 * 1000
            order by public.jt_dist(slat, slng, (d2.data->>'lat')::double precision, (d2.data->>'lng')::double precision) limit 1)), '[]'::jsonb);$a$);
  if position('limit 1)), ''[]''::jsonb)' in d) = 0 then raise exception 'patch jt_push_targets gagal'; end if;
  execute d;
end $do$;

-- jt_orders: tandai pesanan milik akun ini ('isMine') agar notifikasi pembeli hanya untuk pesanannya sendiri
do $do$ declare d text; begin
  d := pg_get_functiondef('public.jt_orders(text)'::regprocedure);
  d := replace(d, $a$then d.data - 'storeWa' - 'pickCode' - 'pickTries' #- '{driver,wa}'$a$, $a$then (d.data - 'storeWa' - 'pickCode' - 'pickTries' #- '{driver,wa}') || '{"isMine":true}'::jsonb$a$);
  if position('isMine' in d) = 0 then raise exception 'gagal'; end if;
  execute d;
end $do$;
