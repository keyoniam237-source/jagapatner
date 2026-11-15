-- JAGA: hapus otomatis riwayat pesanan/order Jago yang batal (gagal) 30 menit setelah dibatalkan, agar database tidak penuh.
-- Diterapkan sebagai migrasi jaga_bersih_riwayat_gagal. Dijadwalkan lewat pg_cron tiap 5 menit.
create extension if not exists pg_cron;

-- jejak ringkas pembatalan oleh pembeli (hanya hash + waktu) supaya aturan "sering batal" tetap bekerja walau riwayat dihapus
create table if not exists public.jt_cancel_log (buyer_hash text not null, at timestamptz not null default now());
create index if not exists jt_cancel_log_at on public.jt_cancel_log (at);
alter table public.jt_cancel_log enable row level security;
revoke all on public.jt_cancel_log from anon, authenticated;

create or replace function public.jt_cleanup_failed(p_minutes int default 30) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare cutoff bigint := public.jt_now_ms() - greatest(5, p_minutes) * 60000::bigint; ids text[]; no int := 0; nr int := 0;
begin
  -- pesanan toko yang batal
  select coalesce(array_agg(substring(id from 8)), '{}') into ids from public.docs
   where col = 'orders' and data->>'status' = 'dibatalkan' and coalesce((data->>'updatedAt')::bigint, (data->>'createdAt')::bigint, 0) < cutoff;
  no := coalesce(array_length(ids, 1), 0);
  if no > 0 then
    insert into public.jt_cancel_log (buyer_hash) select k.buyer_hash from public.docs d join public.doc_keys k on k.id = d.id
      where d.id = any (select 'orders/' || x from unnest(ids) x) and d.data->>'cancelBy' = 'buyer' and k.buyer_hash is not null;
    delete from public.jt_chat where order_id = any (ids);
    delete from public.jt_proofs where order_id = any (ids);
    delete from public.doc_keys where id = any (select 'orders/' || x from unnest(ids) x);
    delete from public.docs where id = any (select 'orders/' || x from unnest(ids) x);
  end if;
  -- order Jago yang batal / tidak dapat driver
  select coalesce(array_agg(substring(id from 7)), '{}') into ids from public.docs
   where col = 'rides' and data->>'status' = 'dibatalkan' and coalesce((data->>'updatedAt')::bigint, (data->>'createdAt')::bigint, 0) < cutoff;
  nr := coalesce(array_length(ids, 1), 0);
  if nr > 0 then
    delete from public.jt_chat where order_id = any (ids);
    delete from public.doc_keys where id = any (select 'rides/' || x from unnest(ids) x);
    delete from public.docs where id = any (select 'rides/' || x from unnest(ids) x);
  end if;
  delete from public.jt_cancel_log where at < now() - interval '1 day';
  if no + nr > 0 then
    insert into public.jt_audit (actor, action, target, detail) values ('sistem', 'cleanup.failed', 'riwayat gagal', jsonb_build_object('orders', no, 'rides', nr, 'menit', p_minutes));
  end if;
  return jsonb_build_object('orders', no, 'rides', nr);
end $$;
revoke all on function public.jt_cleanup_failed(int) from anon, authenticated, public;

-- pemindai kecurangan: hitung pembatalan dari riwayat yang masih ada + jejak ringkas
do $patch$
declare f text; o text; n text;
begin
  f := pg_get_functiondef('public.jt_owner_fraud_scan(text)'::regprocedure);
  o := $o$for r in select data->>'buyerId' b, count(*) n, max((data->>'updatedAt')::bigint) t
      from public.docs where col = 'orders' and data->>'status' = 'dibatalkan' and (data->>'updatedAt')::bigint >= public.jt_now_ms() - 86400000::bigint
      and data->>'cancelBy' = 'buyer' group by 1 having count(*) >= (c->>'cancelN')::numeric loop$o$;
  n := $n$for r in select b, sum(n) n, max(t) t from (
        select left(k.buyer_hash, 8) b, count(*) n, max((d.data->>'updatedAt')::bigint) t
          from public.docs d join public.doc_keys k on k.id = d.id where d.col = 'orders' and d.data->>'status' = 'dibatalkan' and (d.data->>'updatedAt')::bigint >= public.jt_now_ms() - 86400000::bigint and d.data->>'cancelBy' = 'buyer' group by 1
        union all
        select left(buyer_hash, 8), count(*), (extract(epoch from max(at)) * 1000)::bigint from public.jt_cancel_log where at > now() - interval '1 day' group by 1) u
      group by b having sum(n) >= (c->>'cancelN')::numeric loop$n$;
  if position(o in f) = 0 then raise exception 'patch-fraud'; end if;
  execute replace(f, o, n);
end $patch$;

-- jadwal (sudah dibuat di database): setiap 5 menit
-- select cron.schedule('jaga-bersih-riwayat-gagal', '*/5 * * * *', 'select public.jt_cleanup_failed(30)');
