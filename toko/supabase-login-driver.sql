-- Login ulang driver dari HP lain: nama + plat nomor + password.
-- Akun driver tetap satu; perangkat baru ditautkan ke akun lama lewat jt_driver_devices.
create table if not exists public.jt_driver_auth (driver_id text primary key, pass_hash text not null, fails int not null default 0, locked_until timestamptz, updated_at timestamptz not null default now());
create table if not exists public.jt_driver_devices (key_hash text primary key, driver_id text not null, created_at timestamptz not null default now());
create index if not exists jt_driver_devices_drv on public.jt_driver_devices (driver_id);
alter table public.jt_driver_auth enable row level security;
alter table public.jt_driver_devices enable row level security;

create or replace function public.jt_driver_id(h text)
returns text language sql stable security definer set search_path to 'public' as $$
  select coalesce((select dd.driver_id from public.jt_driver_devices dd where dd.key_hash = h
                    and exists (select 1 from public.docs where id = 'drivers/' || dd.driver_id)), 'd' || left(h, 20)) $$;

create or replace function public.jt_driver_setpass(p_pass text, p_key text)
returns jsonb language plpgsql security definer set search_path to 'public', 'extensions' as $$
declare did text;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  did := public.jt_driver_id(public.jt_h(p_key));
  if not exists (select 1 from public.docs where id = 'drivers/' || did) then raise exception 'Daftar sebagai driver dulu'; end if;
  if length(coalesce(p_pass, '')) < 4 then raise exception 'Password minimal 4 karakter'; end if;
  if length(p_pass) > 72 then raise exception 'Password terlalu panjang'; end if;
  insert into public.jt_driver_auth (driver_id, pass_hash) values (did, crypt(p_pass, gen_salt('bf', 8)))
    on conflict (driver_id) do update set pass_hash = excluded.pass_hash, fails = 0, locked_until = null, updated_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.jt_driver_haspass(p_key text)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from public.jt_driver_auth where driver_id = public.jt_driver_id(public.jt_h(p_key))) $$;

create or replace function public.jt_driver_login(p_name text, p_plate text, p_pass text, p_key text)
returns jsonb language plpgsql security definer set search_path to 'public', 'extensions' as $$
declare h text; did text; a record; v_plate text := public.jt_plate(p_plate); v_bad text := 'Nama, plat nomor, atau password salah';
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  h := public.jt_h(p_key);
  if length(v_plate) >= 3 then
    select substring(id from 9) into did from public.docs where col = 'drivers' and public.jt_plate(data->>'plate') = v_plate
      and lower(trim(data->>'name')) = lower(trim(coalesce(p_name, ''))) limit 1;
  end if;
  if did is not null then select * into a from public.jt_driver_auth where driver_id = did for update; end if;
  if did is null or a.driver_id is null then perform pg_sleep(0.6); return jsonb_build_object('ok', false, 'error', v_bad); end if;
  if a.locked_until is not null and a.locked_until > now() then
    raise exception 'Terlalu banyak percobaan salah. Coba lagi dalam % menit', ceil(extract(epoch from a.locked_until - now()) / 60);
  end if;
  if crypt(coalesce(p_pass, ''), a.pass_hash) <> a.pass_hash then
    update public.jt_driver_auth set fails = a.fails + 1, locked_until = case when a.fails + 1 >= 5 then now() + interval '15 minutes' else null end where driver_id = did;
    perform pg_sleep(0.6);
    return jsonb_build_object('ok', false, 'error', v_bad);
  end if;
  update public.jt_driver_auth set fails = 0, locked_until = null where driver_id = did;
  delete from public.jt_driver_devices where key_hash = h;
  if did <> 'd' || left(h, 20) then insert into public.jt_driver_devices (key_hash, driver_id) values (h, did); end if;
  return jsonb_build_object('ok', true, 'driverId', did);
end $$;

create or replace function public.jt_driver_logout(p_key text)
returns jsonb language sql security definer set search_path to 'public' as $$
  with d as (delete from public.jt_driver_devices where key_hash = public.jt_h(p_key) returning 1)
  select jsonb_build_object('ok', true, 'linked', exists (select 1 from d)) $$;

-- notifikasi order ke semua HP yang masuk ke akun driver itu
do $$ declare s text; n text;
begin
  select pg_get_functiondef('public.jt_push_targets(text,text)'::regprocedure) into s;
  n := replace(s, $a$join public.jt_push_subs s on s.key_hash = dk.owner_hash and s.role = 'driver'$a$,
    $b$join public.jt_push_subs s on s.role = 'driver' and (s.key_hash = dk.owner_hash or exists (select 1 from public.jt_driver_devices dd where dd.key_hash = s.key_hash and dd.driver_id = substring(d.id from 9)))$b$);
  if n = s and s not like '%jt_driver_devices%' then raise exception 'patch jt_push_targets gagal'; end if;
  execute n;
  -- bersihkan login saat akun driver dihapus
  select pg_get_functiondef('public.jt_account_delete(text,text,text)'::regprocedure) into s;
  if s not like '%jt_driver_auth%' then
    n := replace(s, $a$delete from public.jt_driver_docs where driver_id = v_id;$a$, $b$delete from public.jt_driver_docs where driver_id = v_id;
    delete from public.jt_driver_auth where driver_id = v_id;
    delete from public.jt_driver_devices where driver_id = v_id;$b$);
    if n = s then raise exception 'patch jt_account_delete gagal'; end if; execute n;
  end if;
  select pg_get_functiondef('public.jt_owner_driver_delete(text,text)'::regprocedure) into s;
  if s not like '%jt_driver_auth%' then
    n := replace(s, $a$delete from public.doc_keys where id = 'drivers/' || p_driver;$a$, $b$delete from public.doc_keys where id = 'drivers/' || p_driver;
  delete from public.jt_driver_auth where driver_id = p_driver;
  delete from public.jt_driver_devices where driver_id = p_driver;$b$);
    if n = s then raise exception 'patch jt_owner_driver_delete gagal'; end if; execute n;
  end if;
end $$;

revoke all on function public.jt_driver_id(text) from public, anon, authenticated;
grant execute on function public.jt_driver_setpass(text, text), public.jt_driver_haspass(text), public.jt_driver_login(text, text, text, text), public.jt_driver_logout(text) to anon, authenticated;

-- Perbaikan: jt_driver_jobs gagal (operator #- / - tanpa kurung) sejak migrasi WA privat.
-- Diterapkan sebagai migrasi fix_driver_jobs_operator: ((x.data #- '{buyer,wa}') #- '{rider,wa}') - 'storeWa'

-- Angka aturan publik untuk halaman daftar driver (tanpa rekening/QRIS). Diterapkan sebagai migrasi aturan_publik_untuk_halaman_daftar.
create or replace function public.jt_public_rules()
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'storePct', (public.jt_comm_cfg()->>'storePct')::numeric, 'drvPct', (public.jt_comm_cfg()->>'drvPct')::numeric, 'minTx', (public.jt_comm_cfg()->>'minTx')::numeric,
    'minBalance', coalesce((w->>'minBalance')::numeric, 0), 'bonus', coalesce((w->>'bonus')::numeric, 0),
    'ptTarget', coalesce((w->>'ptTarget')::numeric, 10), 'ptEarn', coalesce((w->>'ptEarn')::numeric, 5),
    'ptRedeem', coalesce((w->>'ptRedeem')::numeric, 5), 'ptValue', coalesce((w->>'ptValue')::numeric, 2000))
  from (select public.jt_wallet_cfg() w) x $$;
grant execute on function public.jt_public_rules() to anon, authenticated;
