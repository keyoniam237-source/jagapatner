-- JAGA Step 5: foto bukti jemput/antar + aturan anti-kecurangan dasar (hanya menandai, tidak menghukum otomatis).
-- Diterapkan sebagai migrasi jaga_bukti_foto_fraud.

-- 1) Foto bukti disimpan terpisah dari dokumen pesanan (agar daftar pesanan tidak membengkak)
create table if not exists public.jt_proofs (
  order_id text not null, kind text not null check (kind in ('pick','done')),
  photo text not null, at timestamptz not null default now(), driver_id text,
  primary key (order_id, kind));
alter table public.jt_proofs enable row level security;
revoke all on public.jt_proofs from anon, authenticated;

-- 2) Pengaturan fraud (jt_settings key 'fraud')
create or replace function public.jt_fraud_cfg() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'proofReq', coalesce((c->>'proofReq')::boolean, false),
    'fastSec',  greatest(10, coalesce((c->>'fastSec')::numeric, 60)),
    'ongkirX',  greatest(1.2, coalesce((c->>'ongkirX')::numeric, 3)),
    'pairN',    greatest(2, coalesce((c->>'pairN')::numeric, 3)),
    'cancelN',  greatest(2, coalesce((c->>'cancelN')::numeric, 3)))
  from (select coalesce((select value from public.jt_settings where key = 'fraud'), '{}'::jsonb) c) x $$;
grant execute on function public.jt_fraud_cfg() to anon, authenticated;

-- 3) Validasi foto dari driver -> kembalikan teks foto ('' bila tidak ada); wajib bila proofReq aktif
create or replace function public.jt_proof_save(p_order text, p_kind text, p_data jsonb, p_driver text, p_ride boolean) returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare ph text := coalesce(p_data->>'photo', '');
begin
  if p_ride then return false; end if;
  if ph = '' then
    if (public.jt_fraud_cfg()->>'proofReq')::boolean then raise exception 'Foto bukti wajib diunggah'; end if;
    return false;
  end if;
  if ph !~ '^data:image/(jpeg|png|webp);base64,' then raise exception 'Format foto tidak valid'; end if;
  if length(ph) > 450000 then raise exception 'Foto terlalu besar'; end if;
  insert into public.jt_proofs (order_id, kind, photo, driver_id) values (p_order, p_kind, ph, p_driver)
    on conflict (order_id, kind) do nothing;
  return true;
end $$;
revoke all on function public.jt_proof_save(text, text, jsonb, text, boolean) from anon, authenticated, public;

-- 4) Patch jt_driver_act: simpan foto saat pickup & done
do $patch$
declare f text; o text; n text;
begin
  f := pg_get_functiondef('public.jt_driver_act(text,text,jsonb,text)'::regprocedure);
  o := $o$o := o || jsonb_build_object('status', case when v_ride then 'dalam_perjalanan' else 'diantar' end, 'pickedAt', v_now, 'updatedAt', v_now);$o$;
  n := o || $n$
      if public.jt_proof_save(p_id, 'pick', p_data, did, v_ride) then o := o || jsonb_build_object('hasPickPhoto', true); end if;$n$;
  if position(o in f) = 0 then raise exception 'patch-pickup'; end if; f := replace(f, o, n);
  o := $o$if v_ongkir < 0 or v_ongkir > 10000000 then raise exception 'Tarif tidak valid'; end if;$o$;
  n := o || $n$
      if public.jt_proof_save(p_id, 'done', p_data, did, v_ride) then o := o || jsonb_build_object('hasDonePhoto', true); end if;$n$;
  if position(o in f) = 0 then raise exception 'patch-done'; end if; f := replace(f, o, n);
  execute f;
end $patch$;

-- 5) Ambil foto bukti: pembeli, toko pemilik, driver pesanan, atau owner
create or replace function public.jt_proof_get(p_order text, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare h text := public.jt_h(p_key); k record; o jsonb; ok boolean := false;
begin
  select * into k from public.doc_keys where id = 'orders/' || p_order;
  select data into o from public.docs where id = 'orders/' || p_order;
  if o is null then raise exception 'Pesanan tidak ditemukan'; end if;
  ok := public.jt_is_owner(p_key) or k.buyer_hash = h or public.jt_owns(k.store_id, h) or (o->>'driverId') is not distinct from public.jt_driver_id(h);
  if not ok then raise exception 'Tidak diizinkan'; end if;
  return coalesce((select jsonb_object_agg(kind, jsonb_build_object('photo', photo, 'at', (extract(epoch from at) * 1000)::bigint)) from public.jt_proofs where order_id = p_order), '{}'::jsonb);
end $$;
grant execute on function public.jt_proof_get(text, text) to anon, authenticated;

-- 6) Simpan pengaturan fraud (owner) + audit
create or replace function public.jt_owner_fraud_cfg(p_data jsonb, p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare c jsonb;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  c := jsonb_build_object('proofReq', coalesce((p_data->>'proofReq')::boolean, false),
    'fastSec', greatest(10, least(3600, coalesce((p_data->>'fastSec')::numeric, 60))),
    'ongkirX', greatest(1.2, least(20, coalesce((p_data->>'ongkirX')::numeric, 3))),
    'pairN', greatest(2, least(50, coalesce((p_data->>'pairN')::numeric, 3))),
    'cancelN', greatest(2, least(50, coalesce((p_data->>'cancelN')::numeric, 3))));
  insert into public.jt_settings (key, value) values ('fraud', c)
    on conflict (key) do update set value = excluded.value;
  perform public.jt_audit_log(p_key, 'fraud.cfg', 'settings/fraud', c);
  return public.jt_fraud_cfg();
end $$;
grant execute on function public.jt_owner_fraud_cfg(jsonb, text) to anon, authenticated;

-- 7) Pemindai: hanya MENANDAI untuk ditinjau owner (14 hari terakhir)
create or replace function public.jt_owner_fraud_scan(p_key text) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare c jsonb := public.jt_fraud_cfg(); out jsonb := '[]'::jsonb; r record; since bigint := public.jt_now_ms() - 14*86400000::bigint;
begin
  if not public.jt_is_owner(p_key) then raise exception 'Khusus owner'; end if;
  -- a) pesanan antar selesai terlalu cepat setelah diambil
  for r in select id, data from public.docs where col = 'orders' and data->>'status' = 'selesai' and (data->>'doneAt')::bigint >= since
      and (data->>'pickedAt') is not null and ((data->>'doneAt')::bigint - (data->>'pickedAt')::bigint) < (c->>'fastSec')::numeric * 1000 loop
    out := out || jsonb_build_object('rule','fast_done','sev','med','ref',r.data->>'code','id',split_part(r.id,'/',2),'who',coalesce(r.data#>>'{driver,name}','-'),
      'detail','Selesai '||round(((r.data->>'doneAt')::bigint - (r.data->>'pickedAt')::bigint)/1000.0)||' dtk setelah diambil','at',(r.data->>'doneAt')::bigint);
  end loop;
  -- b) ongkir akhir jauh di atas estimasi
  for r in select id, data from public.docs where col = 'orders' and data->>'status' = 'selesai' and (data->>'doneAt')::bigint >= since
      and coalesce((data->>'ongkirEst')::numeric, 0) > 0 and (data->>'ongkirFinal')::numeric > (data->>'ongkirEst')::numeric * (c->>'ongkirX')::numeric loop
    out := out || jsonb_build_object('rule','ongkir_high','sev','high','ref',r.data->>'code','id',split_part(r.id,'/',2),'who',coalesce(r.data#>>'{driver,name}','-'),
      'detail','Ongkir akhir Rp'||(r.data->>'ongkirFinal')||' vs estimasi Rp'||(r.data->>'ongkirEst'),'at',(r.data->>'doneAt')::bigint);
  end loop;
  -- c) driver & pembeli yang sama berulang (potensi poin/transaksi palsu)
  for r in select data->>'driverId' d, data->>'buyerId' b, count(*) n, max((data->>'doneAt')::bigint) t, max(data#>>'{driver,name}') dn
      from public.docs where col = 'orders' and data->>'status' = 'selesai' and (data->>'doneAt')::bigint >= public.jt_now_ms() - 86400000::bigint and data ? 'driverId'
      group by 1, 2 having count(*) >= (c->>'pairN')::numeric loop
    out := out || jsonb_build_object('rule','pair_repeat','sev','high','ref',left(r.b,8),'id','','who',coalesce(r.dn,'-'),
      'detail',r.n||' pesanan selesai dalam 24 jam antara driver dan pembeli yang sama','at',r.t);
  end loop;
  -- d) pembeli sering membatalkan
  for r in select data->>'buyerId' b, count(*) n, max((data->>'updatedAt')::bigint) t
      from public.docs where col = 'orders' and data->>'status' = 'dibatalkan' and (data->>'updatedAt')::bigint >= public.jt_now_ms() - 86400000::bigint
      and data->>'cancelBy' = 'buyer' group by 1 having count(*) >= (c->>'cancelN')::numeric loop
    out := out || jsonb_build_object('rule','cancel_many','sev','low','ref',left(r.b,8),'id','','who','pembeli',
      'detail',r.n||' pesanan dibatalkan pembeli dalam 24 jam','at',r.t);
  end loop;
  -- e) selesai tanpa foto saat wajib
  if (c->>'proofReq')::boolean then
    for r in select id, data from public.docs where col = 'orders' and data->>'status' = 'selesai' and (data->>'doneAt')::bigint >= since
        and data ? 'driverId' and not coalesce((data->>'hasDonePhoto')::boolean, false) loop
      out := out || jsonb_build_object('rule','no_photo','sev','low','ref',r.data->>'code','id',split_part(r.id,'/',2),'who',coalesce(r.data#>>'{driver,name}','-'),
        'detail','Selesai tanpa foto bukti','at',(r.data->>'doneAt')::bigint);
    end loop;
  end if;
  return jsonb_build_object('cfg', c, 'flags', (select coalesce(jsonb_agg(x order by (x->>'at')::bigint desc), '[]'::jsonb) from jsonb_array_elements(out) x));
end $$;
grant execute on function public.jt_owner_fraud_scan(text) to anon, authenticated;
