-- Jago: driver terdekat DITUGASKAN OTOMATIS dari titik jemput PENUMPANG (bukan lokasi toko).
-- Driver dianggap siap bila: online, terverifikasi, tidak sedang membawa order, saldo cukup,
-- lokasi GPS segar (<= 20 menit), aplikasi driver terbuka (ping <= 45 detik), dan berada <= 5 km
-- dari titik jemput. Yang paling dekat langsung dapat order (status driver_jemput).
-- Bila driver menekan "Batal ambil", ia masuk daftar "declined" dan driver terdekat berikutnya
-- langsung ditugaskan pada pengecekan berikutnya (tiap 5 detik).

create table if not exists public.jt_drv_ping (did text primary key, at timestamptz not null default now());
alter table public.jt_drv_ping enable row level security;
revoke all on public.jt_drv_ping from anon, authenticated;

create or replace function public.jt_ride_assign(p_id text) returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare
  o jsonb; v_now bigint := public.jt_now_ms(); plat double precision; plng double precision;
  v_fee numeric; v_rwa text; cid text; cd jsonb; cdist double precision;
begin
  perform pg_advisory_xact_lock(hashtext('jt_ride_assign'));
  select data into o from public.docs where id = 'rides/' || p_id and col = 'rides' for update;
  if o is null or o->>'status' <> 'mencari_driver' then return false; end if;
  plat := (o#>>'{pickup,lat}')::double precision; plng := (o#>>'{pickup,lng}')::double precision;
  if plat is null or plng is null then return false; end if;
  v_fee := public.jt_ride_fee(o);
  v_rwa := public.jt_wa(o#>>'{rider,wa}');
  select substring(k.id from 9), k.data, public.jt_dist(plat, plng, (k.data->>'lat')::double precision, (k.data->>'lng')::double precision)
    into cid, cd, cdist
    from public.docs k
    join public.jt_drv_ping p on p.did = substring(k.id from 9) and p.at > now() - interval '45 seconds'
   where k.col = 'drivers'
     and k.data ? 'lat' and k.data ? 'lng'
     and coalesce((k.data->>'locAt')::bigint, 0) > v_now - 20 * 60 * 1000
     and not (coalesce(o->'declined', '[]'::jsonb) ? substring(k.id from 9))
     and not (v_rwa <> '' and public.jt_wa(k.data->>'wa') = v_rwa)
     and public.jt_driver_free(substring(k.id from 9), k.data)
     and public.jt_can_accept('drv:' || substring(k.id from 9), v_fee)
     and public.jt_dist(plat, plng, (k.data->>'lat')::double precision, (k.data->>'lng')::double precision) <= 5000
   order by 3
   limit 1;
  if cid is null then return false; end if;
  o := o || jsonb_build_object('status', 'driver_jemput', 'driverId', cid, 'acceptedAt', v_now, 'updatedAt', v_now,
    'autoAssigned', true, 'assignDist', round(cdist::numeric),
    'driver', jsonb_build_object('name', cd->>'name', 'wa', cd->>'wa', 'vehicle', coalesce(cd->>'vehicle', ''), 'plate', coalesce(cd->>'plate', '')),
    'driverLoc', jsonb_build_object('lat', cd->'lat', 'lng', cd->'lng', 'at', v_now));
  update public.docs set data = o, updated_at = now() where id = 'rides/' || p_id;
  return true;
end $$;
revoke all on function public.jt_ride_assign(text) from public, anon, authenticated;

-- penumpang: tiap kali daftar perjalanan dimuat (tiap 5 detik saat mencari), coba tugaskan driver terdekat
create or replace function public.jt_rides(p_key text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare r record; v jsonb;
begin
  for r in select split_part(d.id, '/', 2) rid from public.docs d join public.doc_keys k on k.id = d.id
            where d.col = 'rides' and k.buyer_hash = public.jt_h(p_key) and d.data->>'status' = 'mencari_driver' limit 3 loop
    perform public.jt_ride_assign(r.rid);
  end loop;
  select coalesce(jsonb_agg((x.data #- '{driver,wa}') || jsonb_build_object('id', split_part(x.id, '/', 2)) order by x.created_at desc), '[]'::jsonb) into v
    from (select d.* from public.docs d join public.doc_keys k on k.id = d.id
           where d.col = 'rides' and k.buyer_hash = public.jt_h(p_key)
             and (d.data->>'status' in ('mencari_driver','driver_jemput','dalam_perjalanan') or d.created_at > now() - interval '60 days')
           order by d.created_at desc limit 50) x;
  return v;
end $$;

-- cari ulang: langsung tugaskan driver terdekat
create or replace function public.jt_ride_act(p_id text, p_act text, p_key text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare o jsonb; v_now bigint := public.jt_now_ms(); st text;
begin
  if not exists (select 1 from public.doc_keys where id = 'rides/' || p_id and buyer_hash = public.jt_h(p_key)) then raise exception 'Perjalanan tidak ditemukan'; end if;
  select data into o from public.docs where id = 'rides/' || p_id for update;
  st := o->>'status';
  if p_act = 'cancel' then
    if st not in ('mencari_driver','driver_jemput') then raise exception 'Perjalanan tidak bisa dibatalkan lagi'; end if;
    o := o || jsonb_build_object('status', 'dibatalkan', 'cancelBy', 'penumpang', 'cancelAt', v_now, 'updatedAt', v_now);
  elsif p_act = 'retry' then
    if st <> 'mencari_driver' then raise exception 'Driver sudah ditemukan'; end if;
    o := o || jsonb_build_object('searchAt', v_now, 'declined', '[]'::jsonb, 'updatedAt', v_now);
  else
    raise exception 'Aksi tidak valid';
  end if;
  update public.docs set data = o, updated_at = now() where id = 'rides/' || p_id;
  if p_act = 'retry' then
    perform public.jt_ride_assign(p_id);
    select data into o from public.docs where id = 'rides/' || p_id;
  end if;
  return (o #- '{driver,wa}') || jsonb_build_object('id', p_id);
end $$;

-- driver: catat "aplikasi terbuka" (ping) lalu tugaskan order Jago yang menunggu ke driver terdekat
create or replace function public.jt_driver_jobs(p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  h text := public.jt_h(p_key); did text := public.jt_driver_id(h);
  d jsonb; v_offers jsonb := '[]'::jsonb; v_blocked jsonb := '[]'::jsonb; v_why text; v_mine jsonb; r record; dist double precision; c jsonb := public.jt_wallet_cfg();
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then return jsonb_build_object('me', null, 'offers', '[]'::jsonb, 'mine', '[]'::jsonb); end if;
  insert into public.jt_drv_ping (did, at) values (did, now()) on conflict (did) do update set at = now();
  if public.jt_driver_free(did, d) then
    for r in select split_part(o.id, '/', 2) rid from public.docs o where o.col = 'rides' and o.data->>'status' = 'mencari_driver' order by o.created_at limit 20 loop
      perform public.jt_ride_assign(r.rid);
    end loop;
  end if;
  select coalesce(jsonb_agg((((x.data #- '{buyer,wa}') #- '{rider,wa}') - 'storeWa') || jsonb_build_object('id', split_part(x.id, '/', 2)) order by x.created_at desc), '[]'::jsonb) into v_mine
    from (select * from public.docs o where o.col in ('orders','rides') and o.data->>'driverId' = did
           and (o.data->>'status' not in ('selesai','dibatalkan') or o.updated_at > now() - interval '30 days')
           order by o.created_at desc limit 200) x;
  if public.jt_driver_free(did, d) then
    for r in select o.id, o.data from public.docs o where o.col in ('orders','rides') and o.data->>'status' = 'mencari_driver' order by o.created_at limit 100 loop
      v_why := public.jt_self_job(r.data, r.id, h, d);
      dist := case when v_why is null then public.jt_offer_dist(r.data, did, d) end;
      if v_why is null and dist is not null and not public.jt_can_accept('drv:' || did, public.jt_drv_fee(r.data)) then
        v_why := 'Saldo kamu di bawah minimum ' || coalesce((c->>'minBalance'), '0') || '. Isi saldo agar bisa menerima order.'; dist := null;
      end if;
      if v_why is not null and coalesce((r.data->>'searchAt')::bigint, 0) > public.jt_now_ms() - 30*60*1000 then
        v_blocked := v_blocked || jsonb_build_array(jsonb_build_object('id', split_part(r.id, '/', 2), 'code', r.data->>'code', 'storeName', coalesce(r.data->>'storeName', 'Jago'), 'why', v_why));
      end if;
      if dist is not null then
        v_offers := v_offers || jsonb_build_array(((r.data #- '{buyer,wa}'::text[] #- '{rider,wa}'::text[]) - 'proof'::text - 'declined'::text)
          || jsonb_build_object('id', split_part(r.id, '/', 2), 'dist', case when dist < 0 then null else round(dist::numeric) end));
      end if;
    end loop;
  end if;
  return jsonb_build_object('me', d || jsonb_build_object('id', did), 'offers', v_offers, 'blocked', v_blocked, 'locFresh', coalesce((d->>'locAt')::bigint, 0) > public.jt_now_ms() - 20*60*1000, 'mine', v_mine, 'now', public.jt_now_ms(),
    'wallet', jsonb_build_object('balance', public.jt_balance('drv:' || did), 'minBalance', coalesce((c->>'minBalance')::numeric, 0)));
end $function$;
