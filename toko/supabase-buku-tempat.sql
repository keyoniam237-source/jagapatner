-- JAGA: buku tempat lokal (pengganti Google Maps). Diterapkan sebagai migrasi jaga_buku_tempat.
-- Tempat disimpan sukarela oleh pengguna (opt-in) lalu bisa dicari semua orang; owner bisa menghapus.
create table if not exists public.jt_places (
  id uuid primary key default gen_random_uuid(), name text not null, addr text not null default '',
  lat double precision not null, lng double precision not null, uses int not null default 1,
  by_hash text, created_at timestamptz not null default now());
create index if not exists jt_places_name on public.jt_places (lower(name));
alter table public.jt_places enable row level security;
revoke all on public.jt_places from anon, authenticated;

-- cari: buku tempat + toko aktif (publik). Pencocokan mengabaikan spasi/titik/urutan kata ("sd 010" = "SD N. 010", "ujung batu" = "Ujungbatu")
create or replace function public.jt_place_search(p_q text, p_lat double precision default null, p_lng double precision default null) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare toks text[];
begin
  select coalesce(array_agg(t), '{}') into toks from (
    select regexp_replace(x, '[^a-z0-9]', '', 'g') t from unnest(regexp_split_to_array(lower(trim(coalesce(p_q, ''))), '\s+')) x) s where t <> '';
  if coalesce(array_length(toks, 1), 0) = 0 or length(array_to_string(toks, '')) < 2 then return '[]'::jsonb; end if;
  return coalesce((select jsonb_agg(x) from (
    select * from (
      select name, addr as address, lat, lng, 'jaga' as src, uses as w from public.jt_places p
       where not exists (select 1 from unnest(toks) k where regexp_replace(lower(p.name || ' ' || p.addr), '[^a-z0-9]', '', 'g') not like '%' || k || '%')
      union all
      select data->>'name', coalesce(data->>'address', ''), (data->>'lat')::double precision, (data->>'lng')::double precision, 'toko', 0
        from public.docs d where id ~ '^stores/[^/]+$' and coalesce(data->>'active', 'true') <> 'false'
         and jsonb_typeof(data->'lat') = 'number' and jsonb_typeof(data->'lng') = 'number'
         and not exists (select 1 from unnest(toks) k where regexp_replace(lower(data->>'name'), '[^a-z0-9]', '', 'g') not like '%' || k || '%')
    ) u order by (case when p_lat is null then 0 else (u.lat - p_lat)^2 + (u.lng - p_lng)^2 end), w desc limit 8) x), '[]'::jsonb);
end $$;
grant execute on function public.jt_place_search(text, double precision, double precision) to anon, authenticated;

-- simpan (opt-in oleh pengguna): validasi nama, wilayah, batas harian, dan hindari duplikat <150 m
create or replace function public.jt_place_save(p_name text, p_addr text, p_lat double precision, p_lng double precision, p_key text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); nm text := trim(coalesce(p_name, '')); n int; ex uuid;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if length(nm) < 3 or length(nm) > 60 then raise exception 'Nama tempat 3-60 huruf'; end if;
  if nm ~ '[0-9]{8,}' or nm ~* 'https?:' then raise exception 'Nama tempat tidak boleh berisi nomor telepon atau tautan'; end if;
  if not public.jt_in_area(p_lat, p_lng) then raise exception 'Titik di luar wilayah layanan'; end if;
  select count(*) into n from public.jt_places where by_hash = h and created_at > now() - interval '1 day';
  if n >= 10 then raise exception 'Batas simpan tempat hari ini tercapai'; end if;
  select id into ex from public.jt_places where lower(name) = lower(nm) and public.jt_dist(lat, lng, p_lat, p_lng) < 150 limit 1;
  if ex is not null then update public.jt_places set uses = uses + 1 where id = ex; return jsonb_build_object('ok', true, 'dup', true); end if;
  insert into public.jt_places (name, addr, lat, lng, by_hash) values (nm, left(coalesce(p_addr, ''), 140), p_lat, p_lng, h);
  return jsonb_build_object('ok', true);
end $$;
grant execute on function public.jt_place_save(text, text, double precision, double precision, text) to anon, authenticated;

create or replace function public.jt_owner_places(p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return coalesce((select jsonb_agg(to_jsonb(x)) from (select id, name, addr, lat, lng, uses, created_at from public.jt_places order by created_at desc limit 300) x), '[]'::jsonb);
end $$;
grant execute on function public.jt_owner_places(text) to anon, authenticated;

create or replace function public.jt_owner_place_del(p_id uuid, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare r public.jt_places;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  delete from public.jt_places where id = p_id returning * into r;
  if r.id is not null then perform public.jt_audit_log(p_key, 'place.delete', left(r.name, 60), jsonb_build_object('addr', r.addr)); end if;
  return jsonb_build_object('ok', true);
end $$;
grant execute on function public.jt_owner_place_del(uuid, text) to anon, authenticated;

-- Data awal (dari tautan Google Maps yang diberikan owner, 15 Nov 2026)
insert into public.jt_places (name, addr, lat, lng, uses) select * from (values
  ('SD N. 010 Ujungbatu', 'Ujungbatu, Rokan Hulu', 0.70786, 100.54544, 1),
  ('SMK Negeri 1 Ujungbatu', 'Ujungbatu, Rokan Hulu', 0.7178906, 100.5594241, 1),
  ('Pasar Baru Ujung Batu', 'Ujungbatu, Rokan Hulu', 0.7077657, 100.5272828, 1),
  ('Indomaret Sudirman 2 Ujungbatu', 'Jl. Sudirman, Ujungbatu, Rokan Hulu', 0.7035258, 100.544647, 1),
  ('Pondok Pesantren Riyadhul Ulum Ujung Batu (LDII)', 'Ujungbatu, Rokan Hulu', 0.7117148, 100.5505075, 1)) v(n, a, la, lo, u)
where not exists (select 1 from public.jt_places p where lower(p.name) = lower(v.n));
