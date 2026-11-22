-- JAGA: semua komunikasi lewat pesan di aplikasi (tanya toko sebelum pesan + chat perjalanan Jago)
create table if not exists public.jt_ask (id bigserial primary key, store_id text not null, th text not null, buyer_hash text not null, buyer_name text, role text not null check (role in ('pembeli','toko')), body text not null, created_at timestamptz not null default now());
create index if not exists jt_ask_th on public.jt_ask (th, id);
create index if not exists jt_ask_store on public.jt_ask (store_id, id desc);
create index if not exists jt_ask_buyer on public.jt_ask (buyer_hash, id desc);
alter table public.jt_ask enable row level security;
revoke all on public.jt_ask from anon, authenticated;

create or replace function public.jt_ask_th(p_store text, h text) returns text language sql immutable set search_path to 'public' as $$ select md5('ask:' || p_store || ':' || h) $$;

create or replace function public.jt_ask_send(p_store text, p_th text, p_body text, p_name text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); v_body text := left(trim(coalesce(p_body, '')), 800); v_th text; v_bh text; v_role text; s jsonb; v_id bigint;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  if v_body = '' then raise exception 'Pesan kosong'; end if;
  select data into s from public.docs where id = 'stores/' || p_store;
  if s is null then raise exception 'Toko tidak ditemukan'; end if;
  if coalesce(p_th, '') = '' then
    if public.jt_owns(p_store, h) then raise exception 'Tidak bisa mengirim pesan ke toko sendiri'; end if;
    v_th := public.jt_ask_th(p_store, h); v_bh := h; v_role := 'pembeli';
  else
    if not public.jt_owns(p_store, h) then raise exception 'Tidak diizinkan'; end if;
    select buyer_hash into v_bh from public.jt_ask where th = p_th and store_id = p_store limit 1;
    if v_bh is null then raise exception 'Percakapan tidak ditemukan'; end if;
    v_th := p_th; v_role := 'toko';
  end if;
  if (select count(*) from public.jt_ask where th = v_th and created_at > now() - interval '1 minute') > 30 then raise exception 'Terlalu banyak pesan, tunggu sebentar'; end if;
  insert into public.jt_ask (store_id, th, buyer_hash, buyer_name, role, body)
    values (p_store, v_th, v_bh, case when v_role = 'pembeli' then left(coalesce(nullif(trim(p_name), ''), 'Pembeli'), 60) else null end, v_role, v_body) returning id into v_id;
  return jsonb_build_object('ok', true, 'id', v_id, 'th', v_th);
end $$;

create or replace function public.jt_ask_get(p_store text, p_th text, p_after bigint, p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); v_th text;
begin
  if coalesce(p_th, '') = '' then v_th := public.jt_ask_th(p_store, h);
  else
    if not public.jt_owns(p_store, h) then raise exception 'Tidak diizinkan'; end if;
    v_th := p_th;
  end if;
  return jsonb_build_object('th', v_th, 'msgs', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'role', role, 'name', coalesce(buyer_name, ''), 'body', body, 'at', (extract(epoch from created_at) * 1000)::bigint) order by id)
    from (select * from public.jt_ask where th = v_th and store_id = p_store and id > coalesce(p_after, 0) order by id limit 300) x), '[]'::jsonb));
end $$;

-- daftar percakapan: untuk toko (semua pembeli yang bertanya) atau untuk pembeli (semua toko yang ditanya)
create or replace function public.jt_ask_threads(p_store text, p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key);
begin
  if coalesce(p_store, '') <> '' then
    if not public.jt_owns(p_store, h) then raise exception 'Tidak diizinkan'; end if;
    return coalesce((select jsonb_agg(t order by (t->>'last')::bigint desc) from (
      select jsonb_build_object('th', th, 'storeId', store_id, 'name', (array_agg(buyer_name order by id desc) filter (where buyer_name is not null))[1],
        'last', max(id), 'role', (array_agg(role order by id desc))[1], 'body', left((array_agg(body order by id desc))[1], 90),
        'at', (extract(epoch from max(created_at)) * 1000)::bigint, 'n', count(*)) t
      from public.jt_ask where store_id = p_store and created_at > now() - interval '60 days' group by th, store_id order by max(id) desc limit 100) x), '[]'::jsonb);
  end if;
  return coalesce((select jsonb_agg(t order by (t->>'last')::bigint desc) from (
    select jsonb_build_object('th', a.th, 'storeId', a.store_id, 'name', coalesce(d.data->>'name', 'Toko'),
      'last', max(a.id), 'role', (array_agg(a.role order by a.id desc))[1], 'body', left((array_agg(a.body order by a.id desc))[1], 90),
      'at', (extract(epoch from max(a.created_at)) * 1000)::bigint, 'n', count(*)) t
    from public.jt_ask a left join public.docs d on d.id = 'stores/' || a.store_id
    where a.buyer_hash = h and a.created_at > now() - interval '60 days' group by a.th, a.store_id, d.data->>'name' order by max(a.id) desc limit 100) x), '[]'::jsonb);
end $$;

-- chat pesanan juga untuk perjalanan Jago (penumpang <-> driver)
create or replace function public.jt_chat_roles(p_order text, h text) returns text[] language plpgsql stable security definer set search_path to 'public' as $$
declare k record; o jsonb; r text[] := '{}';
begin
  select * into k from public.doc_keys where id = 'orders/' || p_order;
  if found then
    select data into o from public.docs where id = 'orders/' || p_order;
    if k.buyer_hash = h then r := array_append(r, 'pembeli'); end if;
    if public.jt_owns(k.store_id, h) then r := array_append(r, 'toko'); end if;
    if o->>'driverId' = public.jt_driver_id(h) then r := array_append(r, 'driver'); end if;
    return r;
  end if;
  select * into k from public.doc_keys where id = 'rides/' || p_order;
  if not found then return r; end if;
  select data into o from public.docs where id = 'rides/' || p_order;
  if k.buyer_hash = h then r := array_append(r, 'pembeli'); end if;
  if o->>'driverId' = public.jt_driver_id(h) then r := array_append(r, 'driver'); end if;
  return r;
end $$;

do $patch$
declare f text; o text; n text;
begin
  f := pg_get_functiondef('public.jt_chat_send(text,text,text,text,text)'::regprocedure);
  o := $o$select data into o from public.docs where id = 'orders/' || p_order;$o$;
  n := $n$select data into o from public.docs where id in ('orders/' || p_order, 'rides/' || p_order) limit 1;$n$;
  if position(o in f) = 0 then raise exception 'chat1'; end if; f := replace(f, o, n); execute f;
  f := pg_get_functiondef('public.jt_chat_counts(text)'::regprocedure);
  o := $o$join public.doc_keys k on k.id = 'orders/' || c.order_id$o$;
  n := $n$join public.doc_keys k on k.id in ('orders/' || c.order_id, 'rides/' || c.order_id)$n$;
  if position(o in f) = 0 then raise exception 'chat2'; end if; f := replace(f, o, n); execute f;
end $patch$;
revoke execute on function public.jt_ask_th(text,text) from public, anon, authenticated;
