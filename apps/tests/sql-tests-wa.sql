-- JAGA: tes WhatsApp privat + akun pembeli. Jalankan SETELAH supabase-wa-privat-pembeli.sql
-- (atau gabungkan: begin; <migrasi>; <file ini>; -> semuanya dibatalkan). Hasil muncul sebagai "RESULT ..." (normal), semua baris harus PASS.
do $tests$
declare
  res text := '';
  ko text := 'TEST_owner_key_0123456789abcdef'; ks text := 'TEST_seller_key_0123456789abcdef'; kb text := 'TEST_buyer_key_0123456789abcd01'; kb2 text := 'TEST_buyer_key_0123456789abcd02'; kx text := 'TEST_bukan_siapa_0123456789abcdef';
  o jsonb; r jsonb; n int; t text;
  base jsonb := jsonb_build_object('storeId','zzs','items', jsonb_build_array(jsonb_build_object('pid','p1','qty',1)), 'pay', jsonb_build_object('k','cod'),
    'buyer', jsonb_build_object('name','Pembeli Uji','wa','081234500001','address','Jl Uji 1'));
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  insert into public.jt_owner_auth (login, pass_hash) values ('zz_test_owner', 'x') on conflict (login) do nothing;
  insert into public.jt_owner_devices (login, key_hash) values ('zz_test_owner', public.jt_h(ko));
  insert into public.docs (id, col, data) values ('stores/zzs', 'stores', '{"name":"Toko Uji","active":true,"open":true,"wa":"081200000099","address":"Uji"}');
  insert into public.docs (id, col, data) values ('stores/zzs/products/p1', 'products', '{"name":"Barang","price":100000,"active":true}');
  insert into public.doc_keys (id, owner_hash, store_id) values ('stores/zzs', public.jt_h(ks), 'zzs');
  delete from public.jt_settings where key = 'exempt';
  update public.jt_settings set value = '{"on":false}' where key = 'buyer_gate';

  -- A. WA toko privat
  insert into _t values ('A1 dokumen toko publik tanpa WA', not (select data ? 'wa' from public.docs where id = 'stores/zzs'), '');
  insert into _t values ('A2 penanda hasWa = true', (select data->>'hasWa' from public.docs where id = 'stores/zzs') = 'true', '');
  insert into _t values ('A3 WA tersimpan di tabel privat', exists (select 1 from public.jt_store_wa where store_id = 'zzs' and wa = '081200000099'), '');
  begin set local role anon; select count(*) into n from public.jt_store_wa; reset role; insert into _t values ('A4 anon tidak bisa baca tabel WA', n = 0, n::text); exception when others then reset role; insert into _t values ('A4 anon tidak bisa baca tabel WA', true, sqlerrm); end;
  insert into _t values ('A5 pemilik toko bisa ambil WA-nya', public.jt_store_wa_get('zzs', ks) = '081200000099', '');
  insert into _t values ('A6 owner JAGA bisa ambil WA toko', public.jt_store_wa_get('zzs', ko) = '081200000099', '');
  begin perform public.jt_store_wa_get('zzs', kx); insert into _t values ('A7 orang asing ditolak', false, 'lolos!'); exception when others then insert into _t values ('A7 orang asing ditolak', true, sqlerrm); end;
  perform public.jt_write('update', 'stores/zzs', '{"name":"Toko Uji 2"}'::jsonb, ks);
  insert into _t values ('A8 ubah toko tanpa WA tidak menghapus WA', exists (select 1 from public.jt_store_wa where store_id = 'zzs'), '');
  perform public.jt_write('update', 'stores/zzs', '{"wa":"081200000077"}'::jsonb, ks);
  insert into _t values ('A9 ganti WA lewat jt_write masuk tabel privat', (select wa from public.jt_store_wa where store_id = 'zzs') = '081200000077' and not (select data ? 'wa' from public.docs where id = 'stores/zzs'), '');
  perform public.jt_write('update', 'stores/zzs', '{"wa":"081200000099"}'::jsonb, ks);

  -- B. pesanan: tiap pihak hanya menerima yang berhak
  perform public.jt_order_create('zzo1', base, kb);
  insert into _t values ('B1 WA toko tersimpan di pesanan untuk sistem', (select data->>'storeWa' from public.docs where id = 'orders/zzo1') = '081200000099', '');
  select data into o from public.jt_orders(kb) where id = 'orders/zzo1';
  insert into _t values ('B2 pembeli tidak menerima WA toko', o is not null and not (o ? 'storeWa'), '');
  insert into _t values ('B3 pembeli tetap melihat datanya sendiri', o#>>'{buyer,wa}' = '081234500001', '');
  select data into o from public.jt_orders(ks) where id = 'orders/zzo1';
  insert into _t values ('B4 toko tidak menerima WA pembeli', o is not null and not (o#>'{buyer}' ? 'wa') and o#>>'{buyer,name}' = 'Pembeli Uji', '');
  begin perform public.jt_order_create('zzo2', jsonb_set(base, '{buyer,wa}', '"081200000099"'), kb2); insert into _t values ('B5 pesan ke toko sendiri (WA sama) tetap ditolak', false, 'lolos!'); exception when others then insert into _t values ('B5 pesan ke toko sendiri (WA sama) tetap ditolak', true, sqlerrm); end;
  insert into _t values ('B6 pembaca pesanan driver menyaring WA', pg_get_functiondef('public.jt_driver_jobs(text)'::regprocedure) like '%#- ''{buyer,wa}''%', '');

  -- C. akun pembeli
  insert into _t values ('C1 gerbang mati: pembeli baru boleh pesan', exists (select 1 from public.docs where id = 'orders/zzo1'), '');
  perform public.jt_owner_buyer_gate(true, ko);
  begin perform public.jt_order_create('zzo3', base, kb2); insert into _t values ('C2 gerbang nyala: belum daftar ditolak', false, 'lolos!'); exception when others then insert into _t values ('C2 gerbang nyala: belum daftar ditolak', true, sqlerrm); end;
  r := public.jt_buyer_register('{"name":"Budi","wa":"081299900001","address":"Jl Mawar 5"}'::jsonb, kb2);
  insert into _t values ('C3 daftar -> status pending', r#>>'{me,status}' = 'pending', r::text);
  begin perform public.jt_order_create('zzo3', base, kb2); insert into _t values ('C4 pending tetap ditolak', false, 'lolos!'); exception when others then insert into _t values ('C4 pending tetap ditolak', sqlerrm like '%menunggu%', sqlerrm); end;
  begin perform public.jt_buyer_register('{"name":"Orang Lain","wa":"0812-9990-0001","address":"Jl Lain 9"}'::jsonb, kx); insert into _t values ('C5 WA ganda ditolak', false, 'lolos!'); exception when others then insert into _t values ('C5 WA ganda ditolak', sqlerrm like '%sudah terdaftar%', sqlerrm); end;
  begin perform public.jt_buyer_register('{"name":"B","wa":"123","address":"x"}'::jsonb, kx); insert into _t values ('C6 data tak lengkap/WA salah ditolak', false, 'lolos!'); exception when others then insert into _t values ('C6 data tak lengkap/WA salah ditolak', true, sqlerrm); end;
  r := public.jt_owner_buyers(ko);
  insert into _t values ('C7 owner melihat pendaftar pending dengan WA', exists (select 1 from jsonb_array_elements(r->'list') e where e->>'name' = 'Budi' and e->>'status' = 'pending' and e->>'wa' = '081299900001'), '');
  begin perform public.jt_owner_buyers(ks); insert into _t values ('C8 non-owner tidak bisa lihat daftar', false, 'lolos!'); exception when others then insert into _t values ('C8 non-owner tidak bisa lihat daftar', true, sqlerrm); end;
  begin perform public.jt_owner_buyer_decide(public.jt_h(kb2), true, null, kb2); insert into _t values ('C9 pendaftar tak bisa menyetujui diri sendiri', false, 'lolos!'); exception when others then insert into _t values ('C9 pendaftar tak bisa menyetujui diri sendiri', true, sqlerrm); end;
  perform public.jt_owner_buyer_decide(public.jt_h(kb2), true, null, ko);
  perform public.jt_order_create('zzo3', jsonb_set(base, '{buyer,wa}', '"081299900001"'), kb2);
  insert into _t values ('C10 disetujui -> bisa memesan', exists (select 1 from public.docs where id = 'orders/zzo3'), '');
  insert into _t values ('C11 keputusan tercatat di audit', exists (select 1 from public.jt_audit where action = 'buyer.decide'), '');
  perform public.jt_owner_buyer_decide(public.jt_h(kb2), false, 'tes', ko);
  begin perform public.jt_order_create('zzo4', base, kb2); insert into _t values ('C12 ditolak -> tidak bisa memesan', false, 'lolos!'); exception when others then insert into _t values ('C12 ditolak -> tidak bisa memesan', true, sqlerrm); end;
  r := public.jt_buyer_register('{"name":"Budi B","wa":"081299900001","address":"Jl Mawar 6"}'::jsonb, kb2);
  insert into _t values ('C13 ditolak boleh daftar ulang -> pending', r#>>'{me,status}' = 'pending', r::text);
  perform public.jt_owner_buyer_gate(false, ko);
  insert into _t values ('C14 gerbang bisa dimatikan owner', not (public.jt_buyer_me(kb)->>'gate')::boolean, '');
  begin perform public.jt_owner_buyer_gate(true, kx); insert into _t values ('C15 non-owner tak bisa ubah gerbang', false, 'lolos!'); exception when others then insert into _t values ('C15 non-owner tak bisa ubah gerbang', true, sqlerrm); end;

  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || coalesce(' [' || left(info, 70) || ']', ''), E'\n' order by tn) into res from _t;
  raise exception 'RESULT %', E'\n' || res;
end $tests$;
