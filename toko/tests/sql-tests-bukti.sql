-- JAGA Step 5: tes foto bukti + deteksi kecurangan. Aman dijalankan kapan saja (semua dibatalkan / rollback).
-- Hasil muncul sebagai pesan error "RESULT ..." (normal). Semua baris harus berawalan PASS.
do $tests$
declare
  res text := '';
  ko text := 'TEST_owner_key_0123456789abcdef'; kx text := 'TEST_bukan_owner_0123456789abcdef'; kb text := 'TEST_buyer_key_0123456789abcdef';
  now_ms bigint := public.jt_now_ms(); sid text; n int; r jsonb; ph text := 'data:image/jpeg;base64,/9j/AAAA';
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  insert into public.jt_owner_auth (login, pass_hash) values ('zz_test_owner', 'x') on conflict (login) do nothing;
  insert into public.jt_owner_devices (login, key_hash) values ('zz_test_owner', public.jt_h(ko));
  select substring(id from 8) into sid from public.docs where id like 'stores/%' and id not like 'stores/%/%' limit 1;
  delete from public.jt_settings where key = 'fraud';

  insert into _t values ('F1 default: foto tidak wajib', not (public.jt_fraud_cfg()->>'proofReq')::boolean, public.jt_fraud_cfg()::text);
  begin perform public.jt_owner_fraud_scan(kx); insert into _t values ('F2 non-owner tidak bisa pindai', false, 'lolos!'); exception when others then insert into _t values ('F2 non-owner tidak bisa pindai', true, sqlerrm); end;
  begin perform public.jt_owner_fraud_cfg('{"proofReq":true}'::jsonb, kx); insert into _t values ('F3 non-owner tidak bisa ubah aturan', false, 'lolos!'); exception when others then insert into _t values ('F3 non-owner tidak bisa ubah aturan', true, sqlerrm); end;
  perform public.jt_owner_fraud_cfg('{"fastSec":1,"ongkirX":999,"pairN":0,"cancelN":0}'::jsonb, ko);
  insert into _t values ('F4 batas aturan dijaga', (public.jt_fraud_cfg()->>'fastSec')::numeric = 10 and (public.jt_fraud_cfg()->>'ongkirX')::numeric = 20 and (public.jt_fraud_cfg()->>'pairN')::numeric = 2, public.jt_fraud_cfg()::text);
  select count(*) into n from public.jt_audit where action = 'fraud.cfg' and actor = 'zz_test_owner';
  insert into _t values ('F5 ubah aturan tercatat di audit', n = 1, n::text);

  insert into _t values ('F6 foto valid tersimpan', public.jt_proof_save('ZZ1', 'pick', jsonb_build_object('photo', ph), 'd1', false), '');
  begin perform public.jt_proof_save('ZZ1', 'done', '{"photo":"http://evil/x.png"}'::jsonb, 'd1', false); insert into _t values ('F7 format foto palsu ditolak', false, 'lolos!'); exception when others then insert into _t values ('F7 format foto palsu ditolak', true, sqlerrm); end;
  begin perform public.jt_proof_save('ZZ1', 'done', jsonb_build_object('photo', 'data:image/jpeg;base64,' || repeat('A', 460000)), 'd1', false); insert into _t values ('F8 foto terlalu besar ditolak', false, 'lolos!'); exception when others then insert into _t values ('F8 foto terlalu besar ditolak', true, sqlerrm); end;
  insert into _t values ('F9 tanpa foto lolos bila tidak wajib', not public.jt_proof_save('ZZ2', 'pick', '{}'::jsonb, 'd1', false), '');
  perform public.jt_owner_fraud_cfg('{"proofReq":true}'::jsonb, ko);
  begin perform public.jt_proof_save('ZZ2', 'pick', '{}'::jsonb, 'd1', false); insert into _t values ('F10 tanpa foto ditolak bila wajib', false, 'lolos!'); exception when others then insert into _t values ('F10 tanpa foto ditolak bila wajib', true, sqlerrm); end;
  insert into _t values ('F11 order Jago (ride) tidak butuh foto', not public.jt_proof_save('ZZ3', 'pick', '{}'::jsonb, 'd1', true), '');

  -- fixture pesanan untuk pemindai & akses
  insert into public.docs (id, col, data) values ('orders/ZZ1', 'orders', jsonb_build_object('code','ZZ1','status','selesai','storeId',sid,'buyerId','buyerA','driverId','dZ','driver',jsonb_build_object('name','Driver Uji'),
    'ongkirEst',5000,'ongkirFinal',50000,'pickedAt',now_ms-20000,'doneAt',now_ms,'updatedAt',now_ms,'hasPickPhoto',true));
  insert into public.doc_keys (id, store_id, buyer_hash) values ('orders/ZZ1', sid, public.jt_h(kb));
  r := public.jt_owner_fraud_scan(ko);
  insert into _t values ('F12 pemindai menandai selesai terlalu cepat', exists (select 1 from jsonb_array_elements(r->'flags') x where x->>'rule' = 'fast_done' and x->>'ref' = 'ZZ1'), '');
  insert into _t values ('F13 pemindai menandai ongkir jauh di atas estimasi', exists (select 1 from jsonb_array_elements(r->'flags') x where x->>'rule' = 'ongkir_high' and x->>'ref' = 'ZZ1'), '');
  insert into _t values ('F14 pemindai menandai tanpa foto saat wajib', exists (select 1 from jsonb_array_elements(r->'flags') x where x->>'rule' = 'no_photo' and x->>'ref' = 'ZZ1'), '');
  insert into public.docs (id, col, data) select 'orders/ZP' || g, 'orders', jsonb_build_object('code','ZP'||g,'status','selesai','storeId',sid,'buyerId','buyerP','driverId','dP','driver',jsonb_build_object('name','Driver Pair'),'doneAt',now_ms-1000*g,'updatedAt',now_ms) from generate_series(1,3) g;
  r := public.jt_owner_fraud_scan(ko);
  insert into _t values ('F15 pemindai menandai driver-pembeli berulang', exists (select 1 from jsonb_array_elements(r->'flags') x where x->>'rule' = 'pair_repeat'), '');

  -- akses foto
  insert into public.jt_proofs (order_id, kind, photo) values ('ZZ1', 'pick', ph) on conflict do nothing;
  begin perform public.jt_proof_get('ZZ1', kx); insert into _t values ('F16 orang asing tidak bisa lihat foto', false, 'lolos!'); exception when others then insert into _t values ('F16 orang asing tidak bisa lihat foto', true, sqlerrm); end;
  insert into _t values ('F17 pembeli pesanan bisa lihat foto', public.jt_proof_get('ZZ1', kb) ? 'pick', '');
  insert into _t values ('F18 owner bisa lihat foto', public.jt_proof_get('ZZ1', ko) ? 'pick', '');
  insert into _t select 'F19 tabel foto tertutup untuk anon/authenticated', not (has_table_privilege('anon', 'public.jt_proofs', 'select') or has_table_privilege('authenticated', 'public.jt_proofs', 'select')), '';

  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || coalesce(' [' || left(info, 80) || ']', ''), E'\n' order by tn) into res from _t;
  raise exception 'RESULT %', E'\n' || res;
end $tests$;
