-- JAGA Step 5b: tes promo & bebas komisi. Aman dijalankan kapan saja (semua dibatalkan / rollback).
-- Hasil muncul sebagai pesan error "RESULT ..." (normal). Semua baris harus berawalan PASS.
do $tests$
declare
  res text := '';
  ko text := 'TEST_owner_key_0123456789abcdef'; ks text := 'TEST_seller_key_0123456789abcdef'; kb text := 'TEST_buyer_key_0123456789abcd01'; kb2 text := 'TEST_buyer_key_0123456789abcd02'; kx text := 'TEST_bukan_siapa_0123456789abcdef';
  o jsonb; r jsonb; n int; u int;
  base jsonb := jsonb_build_object('storeId','zzs','items', jsonb_build_array(jsonb_build_object('pid','p1','qty',1)), 'pay', jsonb_build_object('k','cod'),
    'buyer', jsonb_build_object('name','Pembeli Uji','wa','081234500001','address','Jl Uji 1'));
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  insert into public.jt_owner_auth (login, pass_hash) values ('zz_test_owner', 'x') on conflict (login) do nothing;
  insert into public.jt_owner_devices (login, key_hash) values ('zz_test_owner', public.jt_h(ko));
  insert into public.docs (id, col, data) values ('stores/zzs', 'stores', '{"name":"Toko Uji","active":true,"open":true,"wa":"081200000099","address":"Uji"}');
  insert into public.docs (id, col, data) values ('stores/zzs/products/p1', 'products', '{"name":"Barang","price":100000,"active":true}');
  insert into public.doc_keys (id, owner_hash, store_id) values ('stores/zzs', public.jt_h(ks), 'zzs');
  update public.jt_settings set value = value - 'storePct' - 'drvPct' - 'minTx' - 'round' where key = 'wallet';
  delete from public.jt_settings where key = 'exempt';

  -- G. promo
  begin perform public.jt_promo_save('zzs', '{"code":"HEMAT10","kind":"pct","value":10}'::jsonb, kx); insert into _t values ('G1 orang asing tidak bisa buat promo', false, 'lolos!'); exception when others then insert into _t values ('G1 orang asing tidak bisa buat promo', true, sqlerrm); end;
  begin perform public.jt_promo_save('zzs', '{"code":"a b","kind":"pct","value":10}'::jsonb, ks); insert into _t values ('G2 kode tidak valid ditolak', false, 'lolos!'); exception when others then insert into _t values ('G2 kode tidak valid ditolak', true, sqlerrm); end;
  begin perform public.jt_promo_save('zzs', '{"code":"BESAR","kind":"pct","value":95}'::jsonb, ks); insert into _t values ('G3 diskon >90% ditolak', false, 'lolos!'); exception when others then insert into _t values ('G3 diskon >90% ditolak', true, sqlerrm); end;
  perform public.jt_promo_save('zzs', '{"code":"hemat10","kind":"pct","value":10,"quota":1,"min_sub":50000}'::jsonb, ks);
  r := public.jt_promo_check('zzs', 'HEMAT10', 100000);
  insert into _t values ('G4 cek promo 10% dari 100.000 = 10.000', (r->>'ok')::boolean and (r->>'disc')::numeric = 10000, r::text);
  insert into _t values ('G5 di bawah minimal belanja ditolak', not (public.jt_promo_check('zzs', 'HEMAT10', 30000)->>'ok')::boolean, '');
  insert into _t values ('G6 kode salah ditolak', not (public.jt_promo_check('zzs', 'NGAWUR', 100000)->>'ok')::boolean, '');
  perform public.jt_promo_save('zzs', '{"code":"POTONG","kind":"flat","value":500000}'::jsonb, ks);
  insert into _t values ('G7 potongan tetap dibatasi 90% belanja', (public.jt_promo_check('zzs', 'POTONG', 100000)->>'disc')::numeric = 90000, '');

  o := public.jt_order_create('zzord1', base || '{"promo":"HEMAT10"}'::jsonb, kb);
  insert into _t values ('G8 pesanan: subtotal penuh, total dipotong', (o->>'subtotal')::numeric = 100000 and (o->>'total')::numeric = 90000, o->>'total');
  insert into _t values ('G9 komisi dihitung dari total setelah promo (3% x 90.000 = 2.700)', (o->>'share')::numeric = 2700, o->>'share');
  insert into _t values ('G10 promo tercatat di pesanan', o #>> '{promo,code}' = 'HEMAT10' and (o #>> '{promo,disc}')::numeric = 10000, '');
  select used into u from public.jt_promo where store_id = 'zzs' and code = 'HEMAT10';
  insert into _t values ('G11 kuota terpakai bertambah', u = 1, u::text);
  begin perform public.jt_order_create('zzord2', base || '{"promo":"HEMAT10"}'::jsonb, kb2); insert into _t values ('G12 kuota habis ditolak', false, 'lolos!'); exception when others then insert into _t values ('G12 kuota habis ditolak', true, sqlerrm); end;
  perform public.jt_order_update('zzord1', '{"status":"dibatalkan"}'::jsonb, kb);
  select used into u from public.jt_promo where store_id = 'zzs' and code = 'HEMAT10';
  insert into _t values ('G13 batal pesanan mengembalikan kuota', u = 0, u::text);
  o := public.jt_order_create('zzord3', base, kb2);
  insert into _t values ('G14 pesanan tanpa promo tetap normal (total 100.000, komisi 3.000)', (o->>'total')::numeric = 100000 and (o->>'share')::numeric = 3000 and not (o ? 'promo'), o->>'share');
  perform public.jt_promo_toggle('zzs', 'HEMAT10', false, ks);
  insert into _t values ('G15 promo dinonaktifkan tidak berlaku', not (public.jt_promo_check('zzs', 'HEMAT10', 100000)->>'ok')::boolean, '');
  insert into _t select 'G16 tabel promo tertutup untuk anon/authenticated', not (has_table_privilege('anon', 'public.jt_promo', 'select') or has_table_privilege('authenticated', 'public.jt_promo', 'select')), '';

  -- H. bebas komisi
  begin perform public.jt_owner_exempt('s', 'zzs', 30, kx); insert into _t values ('H1 non-owner tidak bisa atur bebas komisi', false, 'lolos!'); exception when others then insert into _t values ('H1 non-owner tidak bisa atur bebas komisi', true, sqlerrm); end;
  begin perform public.jt_owner_exempt('s', 'zzs', 999, ko); insert into _t values ('H2 durasi >365 hari ditolak', false, 'lolos!'); exception when others then insert into _t values ('H2 durasi >365 hari ditolak', true, sqlerrm); end;
  perform public.jt_owner_exempt('s', 'zzs', 30, ko);
  insert into _t values ('H3 toko bebas komisi aktif', public.jt_exempt('s', 'zzs'), '');
  perform public.jt_owner_exempt('s', 'zzs', 0, ko);
  insert into _t values ('H4 durasi 0 mencabut bebas komisi', not public.jt_exempt('s', 'zzs'), '');
  perform public.jt_owner_exempt('s', 'zzs', 30, ko);
  perform public.jt_order_update('zzord3', '{"status":"dibatalkan"}'::jsonb, kb2);
  o := public.jt_order_create('zzord4', base, kb2);
  insert into _t values ('H5 pesanan toko bebas komisi: share = 0', (o->>'share')::numeric = 0 and (o->>'total')::numeric = 100000, o->>'share');
  select count(*) into n from public.jt_audit where action = 'comm.exempt' and actor = 'zz_test_owner';
  insert into _t values ('H6 pengaturan bebas komisi tercatat di audit', n >= 3, n::text);
  insert into _t values ('H7 driver tidak bebas bila tidak diatur', not public.jt_exempt('d', 'zzdrv'), '');

  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || coalesce(' [' || left(info, 80) || ']', ''), E'\n' order by tn) into res from _t;
  raise exception 'RESULT %', E'\n' || res;
end $tests$;
