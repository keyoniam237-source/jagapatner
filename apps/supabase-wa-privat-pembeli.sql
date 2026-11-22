-- JAGA: (a) WhatsApp hanya diketahui sistem + owner, (b) pendaftaran pembeli dengan persetujuan owner.
-- Terapkan BERSAMAAN dengan deploy frontend jt-v35. Gerbang pembeli menyala lewat jt_settings 'buyer_gate'.

-- ============ (a) WhatsApp toko dipindah ke tabel privat ============
create table if not exists public.jt_store_wa (store_id text primary key, wa text not null, updated_at timestamptz default now());
alter table public.jt_store_wa enable row level security;   -- tanpa policy = tak terbaca klien

create or replace function public.jt_docs_strip_wa() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare sid text;
begin
  if new.col = 'stores' and new.data ? 'wa' then
    sid := substring(new.id from 8);
    if length(public.jt_wa(new.data->>'wa')) >= 9 then
      insert into public.jt_store_wa (store_id, wa) values (sid, trim(new.data->>'wa'))
        on conflict (store_id) do update set wa = excluded.wa, updated_at = now();
    elsif coalesce(trim(new.data->>'wa'), '') = '' then
      delete from public.jt_store_wa where store_id = sid;
    end if;
    new.data := new.data - 'wa';
  end if;
  if new.col = 'stores' then
    new.data := new.data || jsonb_build_object('hasWa', exists (select 1 from public.jt_store_wa where store_id = substring(new.id from 8)));
  end if;
  return new;
end $$;
drop trigger if exists jt_docs_strip_wa on public.docs;
create trigger jt_docs_strip_wa before insert or update on public.docs for each row execute function public.jt_docs_strip_wa();
update public.docs set data = data where col = 'stores';   -- pindahkan WA yang sudah ada

create or replace function public.jt_store_wa_get(p_store text, p_key text) returns text language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not (public.jt_owns(p_store, public.jt_h(p_key)) or public.jt_is_owner(p_key)) then raise exception 'Akses ditolak'; end if;
  return coalesce((select wa from public.jt_store_wa where store_id = p_store), '');
end $$;
grant execute on function public.jt_store_wa_get(text, text) to anon, authenticated;

-- jt_order_create membaca WA toko dari tabel privat (cek "toko sendiri" + disimpan di pesanan untuk sistem/owner)
do $$ declare d text; n text; begin
  d := pg_get_functiondef('public.jt_order_create(text,jsonb,text)'::regprocedure);
  n := replace(d, E'select data into v_store from public.docs where id = ''stores/'' || v_sid;',
    E'select data into v_store from public.docs where id = ''stores/'' || v_sid;\n  v_store := v_store || jsonb_build_object(''wa'', coalesce((select wa from public.jt_store_wa where store_id = v_sid), ''''));');
  if n = d then raise exception 'patch jt_order_create (wa) gagal'; end if;
  execute n;
end $$;

-- pembaca pesanan: tiap pihak hanya menerima data yang berhak
create or replace function public.jt_orders(p_key text) returns table(id text, data jsonb) language sql stable security definer set search_path to 'public' as $$
  select d.id,
    case when k.buyer_hash = public.jt_h(p_key) then d.data - 'storeWa' #- '{driver,wa}'
         else d.data #- '{buyer,wa}' #- '{driver,wa}' end
  from public.docs d join public.doc_keys k on k.id = d.id
  where d.col = 'orders' and (k.buyer_hash = public.jt_h(p_key) or k.store_id in (select public.jt_my_stores(p_key)))
  order by d.created_at desc limit 500
$$;

create or replace function public.jt_rides(p_key text) returns jsonb language sql stable security definer set search_path to 'public' as $$
  select coalesce(jsonb_agg((x.data #- '{driver,wa}') || jsonb_build_object('id', split_part(x.id, '/', 2)) order by x.created_at desc), '[]'::jsonb)
    from (select d.* from public.docs d join public.doc_keys k on k.id = d.id
           where d.col = 'rides' and k.buyer_hash = public.jt_h(p_key)
             and (d.data->>'status' in ('mencari_driver','driver_jemput','dalam_perjalanan') or d.created_at > now() - interval '60 days')
           order by d.created_at desc limit 50) x
$$;

do $$ declare d text; n text; begin
  d := pg_get_functiondef('public.jt_driver_jobs(text)'::regprocedure);
  n := replace(d, E'select coalesce(jsonb_agg(x.data || jsonb_build_object(''id'', split_part(x.id, ''/'', 2))',
                  E'select coalesce(jsonb_agg((x.data #- ''{buyer,wa}'' #- ''{rider,wa}'' - ''storeWa'') || jsonb_build_object(''id'', split_part(x.id, ''/'', 2))');
  if n = d then raise exception 'patch jt_driver_jobs gagal'; end if;
  execute n;
end $$;

-- ============ (b) Akun pembeli ============
create table if not exists public.jt_buyers (
  key_hash text primary key, name text not null, wa text not null, address text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  note text, created_at timestamptz default now(), decided_at timestamptz);
alter table public.jt_buyers enable row level security;

-- pembeli lama (sudah pernah memesan) otomatis disetujui
insert into public.jt_buyers (key_hash, name, wa, address, status, decided_at)
select distinct on (k.buyer_hash) k.buyer_hash,
  left(coalesce(nullif(d.data#>>'{buyer,name}',''), d.data#>>'{rider,name}', 'Pembeli'), 60),
  left(coalesce(nullif(d.data#>>'{buyer,wa}',''), d.data#>>'{rider,wa}', '-'), 20),
  left(coalesce(nullif(d.data#>>'{buyer,address}',''), '-'), 200), 'approved', now()
from public.doc_keys k join public.docs d on d.id = k.id
where k.buyer_hash is not null and d.col in ('orders','rides')
order by k.buyer_hash, d.created_at desc
on conflict do nothing;

insert into public.jt_settings (key, value) values ('buyer_gate', '{"on":false}') on conflict (key) do nothing;

create or replace function public.jt_buyer_gate(h text, p_key text) returns void language plpgsql stable security definer set search_path to 'public' as $$
declare st text;
begin
  if coalesce((select (value->>'on')::boolean from public.jt_settings where key = 'buyer_gate'), false) is not true then return; end if;
  if public.jt_is_owner(p_key) then return; end if;
  select status into st from public.jt_buyers where key_hash = h;
  if st is null then raise exception 'Daftar akun pembeli dulu untuk memesan'; end if;
  if st = 'pending' then raise exception 'Akun Anda menunggu persetujuan owner'; end if;
  if st = 'rejected' then raise exception 'Pendaftaran akun ditolak. Hubungi bantuan JAGA'; end if;
end $$;

do $$ declare f text; d text; n text; begin
  foreach f in array array['public.jt_order_create(text,jsonb,text)','public.jt_ride_create(text,jsonb,text)'] loop
    d := pg_get_functiondef(f::regprocedure);
    n := replace(d, E'if p_key is null or length(p_key) < 20 then raise exception ''Kunci akses tidak valid''; end if;',
      E'if p_key is null or length(p_key) < 20 then raise exception ''Kunci akses tidak valid''; end if;\n  perform public.jt_buyer_gate(public.jt_h(p_key), p_key);');
    if n = d then raise exception 'patch gerbang % gagal', f; end if;
    execute n;
  end loop;
end $$;

create or replace function public.jt_buyer_me(p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare r public.jt_buyers;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  select * into r from public.jt_buyers where key_hash = public.jt_h(p_key);
  return jsonb_build_object(
    'gate', coalesce((select (value->>'on')::boolean from public.jt_settings where key = 'buyer_gate'), false),
    'me', case when r.key_hash is null then null else jsonb_build_object('name', r.name, 'wa', r.wa, 'address', r.address, 'status', r.status, 'note', r.note) end);
end $$;

create or replace function public.jt_buyer_register(p_data jsonb, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); v_name text := left(trim(coalesce(p_data->>'name','')), 60); v_wa text := left(trim(coalesce(p_data->>'wa','')), 20); v_adr text := left(trim(coalesce(p_data->>'address','')), 200); r public.jt_buyers;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if length(v_name) < 2 or length(v_adr) < 5 then raise exception 'Lengkapi nama dan alamat'; end if;
  if not public.jt_wa_ok(v_wa) then raise exception 'Nomor WhatsApp tidak valid. Contoh: 081234567890'; end if;
  if exists (select 1 from public.jt_buyers where key_hash <> h and status <> 'rejected' and public.jt_wa(wa) = public.jt_wa(v_wa)) then raise exception 'Nomor WhatsApp ini sudah terdaftar'; end if;
  select * into r from public.jt_buyers where key_hash = h;
  if r.key_hash is null then
    insert into public.jt_buyers (key_hash, name, wa, address) values (h, v_name, v_wa, v_adr);
  elsif r.status = 'approved' then
    update public.jt_buyers set name = v_name, address = v_adr where key_hash = h;   -- WA tidak bisa diganti sendiri
  else
    update public.jt_buyers set name = v_name, wa = v_wa, address = v_adr, status = 'pending', note = null, created_at = now(), decided_at = null where key_hash = h;
  end if;
  return public.jt_buyer_me(p_key);
end $$;

create or replace function public.jt_owner_buyers(p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Akses ditolak'; end if;
  return jsonb_build_object(
    'gate', coalesce((select (value->>'on')::boolean from public.jt_settings where key = 'buyer_gate'), false),
    'list', coalesce((select jsonb_agg(jsonb_build_object('id', key_hash, 'name', name, 'wa', wa, 'address', address, 'status', status, 'note', note, 'at', (extract(epoch from created_at)*1000)::bigint)
      order by (status = 'pending') desc, created_at desc) from (select * from public.jt_buyers order by (status = 'pending') desc, created_at desc limit 300) b), '[]'::jsonb));
end $$;

create or replace function public.jt_owner_buyer_decide(p_id text, p_ok boolean, p_note text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare r public.jt_buyers;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Akses ditolak'; end if;
  update public.jt_buyers set status = case when p_ok then 'approved' else 'rejected' end, note = left(nullif(trim(coalesce(p_note,'')),''), 200), decided_at = now() where key_hash = p_id returning * into r;
  if r.key_hash is null then raise exception 'Pendaftar tidak ditemukan'; end if;
  perform public.jt_audit_log(p_key, 'buyer.decide', r.name, jsonb_build_object('ok', p_ok, 'wa', r.wa));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.jt_owner_buyer_gate(p_on boolean, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Akses ditolak'; end if;
  insert into public.jt_settings (key, value) values ('buyer_gate', jsonb_build_object('on', p_on)) on conflict (key) do update set value = excluded.value;
  perform public.jt_audit_log(p_key, 'buyer.gate', 'gerbang pembeli', jsonb_build_object('on', p_on));
  return jsonb_build_object('ok', true);
end $$;

grant execute on function public.jt_buyer_me(text), public.jt_buyer_register(jsonb, text), public.jt_owner_buyers(text),
  public.jt_owner_buyer_decide(text, boolean, text, text), public.jt_owner_buyer_gate(boolean, text) to anon, authenticated;
