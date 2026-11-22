-- JAGA: bonus 15rb, potongan 3% driver antar, poin harian, saldo pembeli (voucher), tujuan isi saldo banyak
alter table public.jt_wallet_tx drop constraint if exists jt_wallet_tx_kind_check;
alter table public.jt_wallet_tx add constraint jt_wallet_tx_kind_check check (kind in ('topup','fee','bonus','adjust','reward','voucher'));
create unique index if not exists jt_wallet_tx_voucher_once on public.jt_wallet_tx (store_id, order_id) where kind = 'voucher';

create table if not exists public.jt_done_log (party text not null, ref text not null, day date not null, at timestamptz not null default now(), primary key (party, ref));
create index if not exists jt_done_log_day on public.jt_done_log (party, day);
create table if not exists public.jt_points (id bigserial primary key, party text not null, pts int not null, kind text not null check (kind in ('earn','redeem')), ref text, note text, created_at timestamptz not null default now());
create unique index if not exists jt_points_earn_once on public.jt_points (party, ref) where kind = 'earn';
create index if not exists jt_points_party on public.jt_points (party, id desc);
alter table public.jt_done_log enable row level security;
alter table public.jt_points enable row level security;
revoke all on public.jt_done_log, public.jt_points from anon, authenticated;

create or replace function public.jt_today() returns date language sql stable set search_path to 'public' as $$ select (now() at time zone 'Asia/Jakarta')::date $$;

create or replace function public.jt_pt_cfg() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'target', greatest(1, coalesce((c->>'ptTarget')::int, 10)), 'earn', greatest(0, coalesce((c->>'ptEarn')::int, 5)),
    'redeem', greatest(1, coalesce((c->>'ptRedeem')::int, 5)), 'value', greatest(0, coalesce((c->>'ptValue')::numeric, 2000)))
  from (select public.jt_wallet_cfg() c) x $$;

create or replace function public.jt_drv_fee(o jsonb) returns numeric language sql immutable set search_path to 'public' as $$
  select round(coalesce((o->>'fareEst')::numeric, (o->>'ongkirEst')::numeric, 0) * 0.03) $$;

create or replace function public.jt_done_mark(p_party text, p_ref text) returns void language plpgsql security definer set search_path to 'public' as $$
declare t date := public.jt_today(); n int; c jsonb := public.jt_pt_cfg();
begin
  if coalesce(p_party, '') = '' or p_party in ('drv:', 'buy:') then return; end if;
  insert into public.jt_done_log (party, ref, day) values (p_party, p_ref, t) on conflict do nothing;
  if not found then return; end if;
  select count(*) into n from public.jt_done_log where party = p_party and day = t;
  if (c->>'earn')::int > 0 and n % (c->>'target')::int = 0 then
    insert into public.jt_points (party, pts, kind, ref, note)
      values (p_party, (c->>'earn')::int, 'earn', t::text || '#' || (n / (c->>'target')::int), 'Capai ' || n || ' transaksi selesai hari ini')
      on conflict do nothing;
  end if;
end $$;

-- saldo pembeli yang belum terpakai sebagai potongan di pesanan berjalan
create or replace function public.jt_buyer_avail(h text) returns numeric language sql stable security definer set search_path to 'public' as $$
  select public.jt_balance('buy:' || h) - coalesce((select sum((o.data->>'voucher')::numeric) from public.docs o join public.doc_keys k on k.id = o.id
     where o.col in ('orders','rides') and k.buyer_hash = h and o.data->>'status' not in ('selesai','dibatalkan') and jsonb_typeof(o.data->'voucher') = 'number'), 0) $$;

create or replace function public.jt_docs_done() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare bh text; v numeric; drv text := new.data->>'driverId';
begin
  select buyer_hash into bh from public.doc_keys where id = new.id;
  if new.col = 'orders' then perform public.jt_done_mark(new.data->>'storeId', new.id); end if;
  if coalesce(drv, '') <> '' then perform public.jt_done_mark('drv:' || drv, new.id); end if;
  if bh is not null then perform public.jt_done_mark('buy:' || bh, new.id); end if;
  v := coalesce((new.data->>'voucher')::numeric, 0);
  if v > 0 and bh is not null and coalesce(drv, '') <> '' then
    v := least(v, greatest(0, public.jt_balance('buy:' || bh)));
    if v > 0 then
      insert into public.jt_wallet_tx (store_id, kind, amount, order_id, note) values
        ('buy:' || bh, 'voucher', -v, new.id, 'Potongan ongkos ' || coalesce(new.data->>'code', '')),
        ('drv:' || drv, 'voucher', v, new.id, 'Ganti potongan pembeli ' || coalesce(new.data->>'code', '') || ' (dibayar JAGA)')
        on conflict do nothing;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists jt_docs_done on public.docs;
create trigger jt_docs_done after update on public.docs for each row
  when (new.col in ('orders','rides') and new.data->>'status' = 'selesai' and (old.data->>'status') is distinct from 'selesai')
  execute function public.jt_docs_done();

create or replace function public.jt_party(p_party text, h text) returns text language plpgsql stable security definer set search_path to 'public' as $$
declare did text;
begin
  if p_party = 'buyer' then return 'buy:' || h; end if;
  if p_party = 'driver' then
    did := public.jt_driver_id(h);
    if not exists (select 1 from public.docs where id = 'drivers/' || did) then raise exception 'Daftar sebagai driver dulu'; end if;
    return 'drv:' || did;
  end if;
  if not public.jt_owns(p_party, h) then raise exception 'Hanya pemilik toko'; end if;
  return p_party;
end $$;

create or replace function public.jt_points_info(p_party text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); w text; c jsonb := public.jt_pt_cfg(); r jsonb;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  w := public.jt_party(p_party, h);
  r := c || jsonb_build_object(
    'points', (select coalesce(sum(pts), 0) from public.jt_points where party = w),
    'today', (select count(*) from public.jt_done_log where party = w and day = public.jt_today()),
    'hist', coalesce((select jsonb_agg(jsonb_build_object('pts', pts, 'kind', kind, 'note', note, 'at', (extract(epoch from created_at) * 1000)::bigint) order by id desc)
       from (select * from public.jt_points where party = w order by id desc limit 30) x), '[]'::jsonb));
  if p_party = 'buyer' then
    r := r || jsonb_build_object('balance', public.jt_balance(w), 'avail', public.jt_buyer_avail(h),
      'txs', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) order by t.id desc) from (select * from public.jt_wallet_tx where store_id = w order by id desc limit 50) t), '[]'::jsonb));
  end if;
  return r;
end $$;

create or replace function public.jt_points_redeem(p_party text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); w text; c jsonb := public.jt_pt_cfg(); bal int; u int; rp numeric;
begin
  if p_key is null or length(p_key) < 20 then raise exception 'Kunci akses tidak valid'; end if;
  w := public.jt_party(p_party, h);
  perform pg_advisory_xact_lock(hashtext('pts:' || w));
  select coalesce(sum(pts), 0) into bal from public.jt_points where party = w;
  u := bal / (c->>'redeem')::int;
  if u < 1 then raise exception 'Poin belum cukup. Butuh % poin untuk ditukar', c->>'redeem'; end if;
  rp := u * (c->>'value')::numeric;
  insert into public.jt_points (party, pts, kind, note) values (w, -u * (c->>'redeem')::int, 'redeem', 'Tukar jadi saldo ' || to_char(rp, 'FM999G999G999'));
  insert into public.jt_wallet_tx (store_id, kind, amount, note) values (w, 'reward', rp, 'Tukar ' || (u * (c->>'redeem')::int) || ' poin');
  return jsonb_build_object('ok', true, 'pts', u * (c->>'redeem')::int, 'amount', rp);
end $$;

-- konfigurasi: daftar tujuan transfer + poin
create or replace function public.jt_owner_wallet_cfg(p_data jsonb, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare c jsonb := public.jt_wallet_cfg(); p jsonb := '{}'::jsonb; e jsonb; arr jsonb := '[]'::jsonb; k text;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  if p_data ? 'minBalance' then p := p || jsonb_build_object('minBalance', greatest(0, least(10000000, (p_data->>'minBalance')::numeric))); end if;
  if p_data ? 'bonus' then p := p || jsonb_build_object('bonus', greatest(0, least(1000000, (p_data->>'bonus')::numeric))); end if;
  foreach k in array array['ptTarget','ptEarn','ptRedeem'] loop
    if p_data ? k then p := p || jsonb_build_object(k, greatest(case when k = 'ptEarn' then 0 else 1 end, least(1000, (p_data->>k)::int))); end if;
  end loop;
  if p_data ? 'ptValue' then p := p || jsonb_build_object('ptValue', greatest(0, least(1000000, (p_data->>'ptValue')::numeric))); end if;
  if p_data ? 'bank' then p := p || jsonb_build_object('bank', jsonb_build_object('name', left(coalesce(p_data#>>'{bank,name}', ''), 60), 'no', left(coalesce(p_data#>>'{bank,no}', ''), 40), 'holder', left(coalesce(p_data#>>'{bank,holder}', ''), 80))); end if;
  if p_data ? 'pay' then
    if jsonb_typeof(p_data->'pay') <> 'array' or jsonb_array_length(p_data->'pay') > 12 then raise exception 'Maksimal 12 tujuan transfer'; end if;
    for e in select * from jsonb_array_elements(p_data->'pay') loop
      if coalesce(e->>'type', '') not in ('bank','ewallet','va') then raise exception 'Jenis tujuan tidak valid'; end if;
      if coalesce(trim(e->>'name'), '') = '' or coalesce(trim(e->>'no'), '') = '' then raise exception 'Isi nama bank/e-wallet dan nomornya'; end if;
      arr := arr || jsonb_build_array(jsonb_build_object('type', e->>'type', 'name', left(trim(e->>'name'), 40), 'no', left(trim(e->>'no'), 40), 'holder', left(coalesce(trim(e->>'holder'), ''), 80)));
    end loop;
    p := p || jsonb_build_object('pay', arr);
  end if;
  if p_data ? 'qris' then
    if coalesce(p_data->>'qris', '') <> '' and (p_data->>'qris' !~ '^data:image/' or length(p_data->>'qris') > 900000) then raise exception 'Gambar QRIS tidak valid'; end if;
    p := p || jsonb_build_object('qris', coalesce(p_data->>'qris', ''));
  end if;
  insert into public.jt_settings (key, value) values ('wallet', c || p) on conflict (key) do update set value = excluded.value;
  return c || p;
end $$;

create or replace function public.jt_wallet(p_store text, p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare c jsonb := public.jt_wallet_cfg();
begin
  if not public.jt_owns(p_store, public.jt_h(p_key)) then raise exception 'Hanya pemilik toko'; end if;
  return jsonb_build_object(
    'balance', public.jt_balance(p_store),
    'pending', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where store_id = p_store and status = 'pending'),
    'cfg', jsonb_build_object('minBalance', coalesce((c->>'minBalance')::numeric, 0), 'bank', coalesce(c->'bank', '{}'::jsonb), 'pay', coalesce(c->'pay', '[]'::jsonb), 'qris', coalesce(c->>'qris', '')),
    'txs', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) order by t.id desc) from (select * from public.jt_wallet_tx where store_id = p_store order by id desc limit 150) t), '[]'::jsonb));
end $$;

create or replace function public.jt_driver_wallet(p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare did text := public.jt_driver_id(public.jt_h(p_key)); w text := 'drv:' || did; c jsonb := public.jt_wallet_cfg();
begin
  if not exists (select 1 from public.docs where id = 'drivers/' || did) then raise exception 'Daftar sebagai driver dulu'; end if;
  perform public.jt_driver_bonus(did);
  return jsonb_build_object(
    'balance', public.jt_balance(w),
    'pending', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where store_id = w and status = 'pending'),
    'cfg', jsonb_build_object('minBalance', coalesce((c->>'minBalance')::numeric, 0), 'bank', coalesce(c->'bank', '{}'::jsonb), 'pay', coalesce(c->'pay', '[]'::jsonb), 'qris', coalesce(c->>'qris', '')),
    'txs', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) order by t.id desc) from (select * from public.jt_wallet_tx where store_id = w order by id desc limit 150) t), '[]'::jsonb));
end $$;

create or replace function public.jt_owner_wallet(p_key text) returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  return jsonb_build_object(
    'cfg', public.jt_wallet_cfg(),
    'pending', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) || jsonb_build_object('storeId', t.store_id, 'proof', t.proof) order by t.id) from public.jt_wallet_tx t where t.status = 'pending'), '[]'::jsonb),
    'balances', coalesce((select jsonb_object_agg(store_id, b) from (select store_id, sum(amount) b from public.jt_wallet_tx where status = 'ok' and store_id not like 'buy:%' group by store_id) x), '{}'::jsonb),
    'fees', coalesce((select jsonb_object_agg(store_id, f) from (select store_id, -sum(amount) f from public.jt_wallet_tx where kind = 'fee' group by store_id) x), '{}'::jsonb),
    'points', coalesce((select jsonb_object_agg(party, s) from (select party, sum(pts) s from public.jt_points where party not like 'buy:%' group by party) x), '{}'::jsonb),
    'totals', jsonb_build_object(
      'fee', (select coalesce(-sum(amount), 0) from public.jt_wallet_tx where kind = 'fee'),
      'feeMonth', (select coalesce(-sum(amount), 0) from public.jt_wallet_tx where kind = 'fee' and created_at >= date_trunc('month', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta'),
      'topup', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'topup' and status = 'ok'),
      'bonus', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'bonus'),
      'reward', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'reward'),
      'voucher', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where kind = 'voucher' and amount > 0),
      'buyerSaldo', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where status = 'ok' and store_id like 'buy:%'),
      'saldo', (select coalesce(sum(amount), 0) from public.jt_wallet_tx where status = 'ok' and store_id not like 'buy:%')),
    'recent', coalesce((select jsonb_agg(public.jt_wallet_txjson(t) || jsonb_build_object('storeId', t.store_id) order by t.id desc) from (select * from public.jt_wallet_tx where status <> 'pending' and store_id not like 'buy:%' order by id desc limit 60) t), '[]'::jsonb));
end $$;

-- penawaran: driver dengan saldo di bawah minimum tidak menerima order apa pun
create or replace function public.jt_driver_jobs(p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  h text := public.jt_h(p_key); did text := public.jt_driver_id(h);
  d jsonb; v_offers jsonb := '[]'::jsonb; v_mine jsonb; r record; dist double precision; c jsonb := public.jt_wallet_cfg();
begin
  select data into d from public.docs where id = 'drivers/' || did;
  if d is null then return jsonb_build_object('me', null, 'offers', '[]'::jsonb, 'mine', '[]'::jsonb); end if;
  select coalesce(jsonb_agg(x.data || jsonb_build_object('id', split_part(x.id, '/', 2)) order by x.created_at desc), '[]'::jsonb) into v_mine
    from (select * from public.docs o where o.col in ('orders','rides') and o.data->>'driverId' = did
           and (o.data->>'status' not in ('selesai','dibatalkan') or o.updated_at > now() - interval '30 days')
           order by o.created_at desc limit 200) x;
  if public.jt_driver_free(did, d) then
    for r in select o.id, o.data from public.docs o where o.col in ('orders','rides') and o.data->>'status' = 'mencari_driver' order by o.created_at limit 100 loop
      if public.jt_self_job(r.data, r.id, h, d) is null and public.jt_can_accept('drv:' || did, public.jt_drv_fee(r.data)) then
        dist := public.jt_offer_dist(r.data, did, d);
        if dist is not null then
          v_offers := v_offers || jsonb_build_array(((r.data #- '{buyer,wa}'::text[] #- '{rider,wa}'::text[]) - 'proof'::text - 'declined'::text)
            || jsonb_build_object('id', split_part(r.id, '/', 2), 'dist', case when dist < 0 then null else round(dist::numeric) end));
        end if;
      end if;
    end loop;
  end if;
  return jsonb_build_object('me', d || jsonb_build_object('id', did), 'offers', v_offers, 'mine', v_mine, 'now', public.jt_now_ms(),
    'wallet', jsonb_build_object('balance', public.jt_balance('drv:' || did), 'minBalance', coalesce((c->>'minBalance')::numeric, 0)));
end $$;

update public.jt_settings set value = value || jsonb_build_object('bonus', 15000, 'ptTarget', 10, 'ptEarn', 5, 'ptRedeem', 5, 'ptValue', 2000,
  'pay', case when coalesce(value#>>'{bank,no}', '') <> '' then jsonb_build_array(jsonb_build_object('type', 'bank', 'name', value#>>'{bank,name}', 'no', value#>>'{bank,no}', 'holder', coalesce(value#>>'{bank,holder}', ''))) else coalesce(value->'pay', '[]'::jsonb) end)
 where key = 'wallet';

-- tambal fungsi yang sudah ada (ganti potongan teks, gagal jika teks tidak ditemukan)
do $patch$
declare f text; o text; n text;

begin
  -- jt_driver_act: semua order butuh saldo minimum; ongkir antar dipotong 3%
  f := pg_get_functiondef('public.jt_driver_act(text,text,jsonb,text)'::regprocedure);
  o := $o$if v_ride and not public.jt_can_accept('drv:' || did, public.jt_ride_fee(o)) then raise exception 'Saldo driver kurang. Isi saldo dulu untuk menerima order Jago'; end if;$o$;
  n := $n$if not public.jt_can_accept('drv:' || did, public.jt_drv_fee(o)) then raise exception 'Saldo driver di bawah minimum. Isi saldo atau hubungi JAGA agar bisa menerima order lagi'; end if;$n$;
  if position(o in f) = 0 then raise exception 'patch1'; end if; f := replace(f, o, n);
  o := $o$o := o || jsonb_build_object('status', 'selesai', 'ongkirFinal', round(v_ongkir), 'doneAt'$o$;
  n := $n$v_fee := round(round(v_ongkir) * 0.03);
        o := o || jsonb_build_object('status', 'selesai', 'ongkirFinal', round(v_ongkir), 'drvFee', v_fee, 'doneAt'$n$;
  if position(o in f) = 0 then raise exception 'patch2'; end if; f := replace(f, o, n);
  o := $o$perform public.jt_charge_fee(p_id);$o$;
  n := $n$perform public.jt_charge_fee(p_id);
      if v_fee > 0 then
        insert into public.jt_wallet_tx (store_id, kind, amount, order_id, note)
          values ('drv:' || did, 'fee', -v_fee, 'dlv:' || p_id, 'Potongan 3% ongkir antar ' || coalesce(o->>'code', p_id) || ' (' || to_char(round(v_ongkir), 'FM999G999G999') || ')')
          on conflict do nothing;
      end if;$n$;
  if position(o in f) = 0 then raise exception 'patch3'; end if; f := replace(f, o, n);
  execute f;

  -- jt_order_create: potongan ongkir dari saldo pembeli
  f := pg_get_functiondef('public.jt_order_create(text,jsonb,text)'::regprocedure);
  o := $o$v_dist double precision; v_act int;$o$; n := $n$v_dist double precision; v_act int; v_v numeric;$n$;
  if position(o in f) = 0 then raise exception 'patch4'; end if; f := replace(f, o, n);
  o := $o$v_data := (p_data - 'driver'$o$; n := $n$v_data := (p_data - 'voucher' - 'useSaldo' - 'drvFee' - 'driver'$n$;
  if position(o in f) = 0 then raise exception 'patch5'; end if; f := replace(f, o, n);
  o := $o$insert into public.docs (id, col, data) values ('orders/' || p_id, 'orders', v_data);$o$;
  n := $n$if coalesce((p_data->>'useSaldo')::boolean, false) and jsonb_typeof(v_data->'ongkirEst') = 'number' then
    v_v := round(least(greatest(0, public.jt_buyer_avail(h)), (v_data->>'ongkirEst')::numeric));
    if v_v > 0 then v_data := v_data || jsonb_build_object('voucher', v_v); end if;
  end if;
  insert into public.docs (id, col, data) values ('orders/' || p_id, 'orders', v_data);$n$;
  if position(o in f) = 0 then raise exception 'patch6'; end if; f := replace(f, o, n);
  execute f;

  -- jt_ride_create: potongan tarif dari saldo pembeli
  f := pg_get_functiondef('public.jt_ride_create(text,jsonb,text)'::regprocedure);
  o := $o$v_d double precision; v jsonb;$o$; n := $n$v_d double precision; v jsonb; v_v numeric;$n$;
  if position(o in f) = 0 then raise exception 'patch7'; end if; f := replace(f, o, n);
  o := $o$insert into public.docs (id, col, data) values ('rides/' || p_id, 'rides', v);$o$;
  n := $n$if coalesce((p_data->>'useSaldo')::boolean, false) then
    v_v := round(least(greatest(0, public.jt_buyer_avail(h)), (v->>'fareEst')::numeric));
    if v_v > 0 then v := v || jsonb_build_object('voucher', v_v); end if;
  end if;
  insert into public.docs (id, col, data) values ('rides/' || p_id, 'rides', v);$n$;
  if position(o in f) = 0 then raise exception 'patch8'; end if; f := replace(f, o, n);
  execute f;
end $patch$;

revoke execute on function public.jt_done_mark(text,text), public.jt_docs_done(), public.jt_buyer_avail(text), public.jt_party(text,text) from public, anon, authenticated;
