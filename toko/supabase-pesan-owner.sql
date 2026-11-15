-- ===== Tanya jawab toko/driver <-> tim JAGA =====
create table if not exists public.jt_support (
  id bigserial primary key, thread text not null, sender text not null check (sender in ('owner','store','driver')),
  body text not null, at timestamptz not null default now(), read_owner boolean not null default false, read_party boolean not null default false);
create index if not exists jt_support_thread_idx on public.jt_support (thread, id);
alter table public.jt_support enable row level security;
revoke all on public.jt_support from anon, authenticated;
revoke all on sequence public.jt_support_id_seq from anon, authenticated;

create or replace function public.jt_support_party(p_thread text, h text) returns text language sql stable security definer set search_path to 'public' as $$
  select case
    when p_thread ~ '^store:[A-Za-z0-9_-]{1,64}$' and public.jt_owns(substr(p_thread, 7), h) then 'store'
    when p_thread ~ '^drv:[A-Za-z0-9_-]{1,64}$' and substr(p_thread, 5) = public.jt_driver_id(h) then 'driver'
  end $$;
create or replace function public.jt_support_target(p_thread text) returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case
    when p_thread like 'store:%' then (select jsonb_build_object('kind','store','name', data->>'name','wa', data->>'wa','active', coalesce((data->>'active')::boolean, true)) from public.docs where id = 'stores/' || substr(p_thread, 7))
    when p_thread like 'drv:%' then (select jsonb_build_object('kind','driver','name', data->>'name','wa', data->>'wa','active', not coalesce((data->>'suspended')::boolean, false)) from public.docs where id = 'drivers/' || substr(p_thread, 5))
  end $$;

create or replace function public.jt_support_send(p_thread text, p_body text, p_as text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare h text := public.jt_h(p_key); v_role text; v_body text := left(trim(coalesce(p_body, '')), 1000); r public.jt_support;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if v_body = '' then raise exception 'Tulis pesan dulu'; end if;
  if public.jt_support_target(p_thread) is null then raise exception 'Toko atau driver tidak ditemukan'; end if;
  if p_as = 'owner' then
    if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if; v_role := 'owner';
  else
    v_role := public.jt_support_party(p_thread, h);
    if v_role is null then raise exception 'Tidak diizinkan'; end if;
    if (select count(*) from public.jt_support where thread = p_thread and sender <> 'owner' and at > now() - interval '1 hour') >= 40 then raise exception 'Terlalu banyak pesan. Coba lagi nanti'; end if;
  end if;
  insert into public.jt_support (thread, sender, body, read_owner, read_party) values (p_thread, v_role, v_body, v_role = 'owner', v_role <> 'owner') returning * into r;
  return jsonb_build_object('id', r.id, 'sender', r.sender, 'body', r.body, 'at', (extract(epoch from r.at) * 1000)::bigint);
end $function$;

create or replace function public.jt_support_get(p_thread text, p_as text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare h text := public.jt_h(p_key);
begin
  if p_as = 'owner' then
    if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
    update public.jt_support set read_owner = true where thread = p_thread and sender <> 'owner' and not read_owner;
  else
    if public.jt_support_party(p_thread, h) is null then raise exception 'Tidak diizinkan'; end if;
    update public.jt_support set read_party = true where thread = p_thread and sender = 'owner' and not read_party;
  end if;
  return jsonb_build_object('target', public.jt_support_target(p_thread), 'msgs', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'sender', sender, 'body', body, 'at', (extract(epoch from at) * 1000)::bigint) order by id)
    from (select * from public.jt_support where thread = p_thread order by id desc limit 200) x), '[]'::jsonb));
end $function$;

create or replace function public.jt_support_threads(p_key text)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return coalesce((select jsonb_agg(t order by (t->>'at')::bigint desc) from (
    select jsonb_build_object('thread', s.thread, 'body', l.body, 'sender', l.sender, 'at', (extract(epoch from l.at) * 1000)::bigint,
      'unread', s.unread, 'target', public.jt_support_target(s.thread)) t
    from (select thread, max(id) mid, count(*) filter (where sender <> 'owner' and not read_owner) unread from public.jt_support group by thread) s
    join public.jt_support l on l.id = s.mid) q), '[]'::jsonb);
end $function$;

create or replace function public.jt_support_unread(p_key text)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
declare h text := public.jt_h(p_key);
begin
  if p_key is null or length(p_key) < 20 then return '{}'::jsonb; end if;
  return coalesce((select jsonb_object_agg(thread, n) from (
    select thread, count(*) n from public.jt_support
    where sender = 'owner' and not read_party and (thread = 'drv:' || public.jt_driver_id(h) or (thread like 'store:%' and substr(thread, 7) in (select public.jt_my_stores(p_key))))
    group by thread) x), '{}'::jsonb);
end $function$;

-- ===== Tindakan owner terhadap toko & driver =====
create or replace function public.jt_owner_store_delete(p_store text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if not exists (select 1 from public.docs where id = 'stores/' || p_store) then raise exception 'Toko tidak ditemukan'; end if;
  if exists (select 1 from public.docs where col = 'orders' and data->>'storeId' = p_store and data->>'status' not in ('selesai','dibatalkan')) then
    raise exception 'Toko masih punya pesanan berjalan. Selesaikan atau tutup pesanan itu dulu';
  end if;
  delete from public.docs where id = 'stores/' || p_store or col in ('stores/' || p_store || '/products', 'stores/' || p_store || '/stocklog');
  delete from public.doc_keys where id = 'stores/' || p_store;
  delete from public.jt_store_auth where store_id = p_store;
  delete from public.jt_store_devices where store_id = p_store;
  delete from public.jt_support where thread = 'store:' || p_store;
  return jsonb_build_object('ok', true);
end $function$;

create or replace function public.jt_owner_driver_active(p_driver text, p_active boolean, p_note text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if not p_active and exists (select 1 from public.docs where col in ('orders','rides') and data->>'driverId' = p_driver and data->>'status' in ('driver_ke_toko','diantar','driver_jemput','dalam_perjalanan')) then
    raise exception 'Driver sedang membawa pesanan. Tunggu selesai dulu';
  end if;
  update public.docs set data = data || jsonb_build_object('suspended', not p_active, 'suspendNote', case when p_active then '' else left(coalesce(p_note, ''), 200) end)
    || case when p_active then '{}'::jsonb else '{"online":false}'::jsonb end, updated_at = now()
   where id = 'drivers/' || p_driver;
  if not found then raise exception 'Driver tidak ditemukan'; end if;
  return jsonb_build_object('ok', true);
end $function$;

create or replace function public.jt_owner_driver_delete(p_driver text, p_key text)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if exists (select 1 from public.docs where col in ('orders','rides') and data->>'driverId' = p_driver and data->>'status' in ('driver_ke_toko','diantar','driver_jemput','dalam_perjalanan')) then
    raise exception 'Driver sedang membawa pesanan. Tunggu selesai dulu';
  end if;
  delete from public.docs where id = 'drivers/' || p_driver;
  if not found then raise exception 'Driver tidak ditemukan'; end if;
  delete from public.doc_keys where id = 'drivers/' || p_driver;
  delete from public.jt_support where thread = 'drv:' || p_driver;
  return jsonb_build_object('ok', true);
end $function$;

-- driver yang dinonaktifkan tidak bisa online / menerima order
create or replace function public.jt_driver_free(did text, d jsonb) returns boolean language sql stable set search_path to 'public' as $$
  select coalesce((d->>'online')::boolean, false)
     and coalesce(d->>'verify', 'verified') = 'verified'
     and not coalesce((d->>'suspended')::boolean, false)
     and not exists (select 1 from public.docs o where o.col in ('orders','rides') and o.data->>'driverId' = did
                     and o.data->>'status' in ('driver_ke_toko','diantar','driver_jemput','dalam_perjalanan'))
$$;
revoke execute on function public.jt_support_party(text, text) from public, anon, authenticated;
revoke execute on function public.jt_support_target(text) from public, anon, authenticated;
do $p$ declare d text; begin
  d := pg_get_functiondef('public.jt_driver_save(jsonb,text)'::regprocedure);
  if position('suspended' in d) = 0 then
    d := replace(d, '    if v_old->>''verify'' = ''rejected''', '    if coalesce((v_old->>''suspended'')::boolean, false) and coalesce((v_patch->>''online'')::boolean, false) then raise exception ''Akun driver dinonaktifkan tim JAGA. Hubungi tim JAGA lewat menu Tanya JAGA''; end if;' || chr(10) || '    if v_old->>''verify'' = ''rejected''');
    if position('suspended' in d) = 0 then raise exception 'patch jt_driver_save gagal'; end if;
    execute d;
  end if;
end $p$;
