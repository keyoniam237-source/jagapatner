-- JAGA: tes otomatis database. Aman dijalankan kapan saja di SQL Editor Supabase:
-- seluruh data uji dibuat di dalam satu transaksi lalu DIBATALKAN (rollback) di akhir.
-- Hasil muncul sebagai pesan error "RESULT ..." (itu normal: cara membatalkan transaksi).
-- Semua baris harus berawalan PASS. Baris FAIL berarti ada yang rusak.
do $tests$
declare
  res text := '';
  ko text := 'TEST_owner_key_0123456789abcdef';   -- kunci owner uji
  kd1 text := 'TEST_driver1_key_0123456789abcdef';
  kd2 text := 'TEST_driver2_key_0123456789abcdef';
  kx  text := 'TEST_bukan_owner_0123456789abcdef';
  now_ms bigint := public.jt_now_ms();
  d1 text; d2 text; sid text; n int; v numeric; e text; o jsonb; tx_id bigint;
begin
  create temp table if not exists _t(tn text, ok boolean, info text) on commit drop;
  -- fixture owner
  insert into public.jt_owner_auth (login, pass_hash) values ('zz_test_owner', 'x') on conflict (login) do nothing;
  insert into public.jt_owner_devices (login, key_hash) values ('zz_test_owner', public.jt_h(ko));
  select substring(id from 8) into sid from public.docs where id like 'stores/%' and id not like 'stores/%/%' limit 1;

  -- ===== A. OTORISASI =====
  begin perform public.jt_owner_wallet_adjust(sid, 1000, 'x', kx); insert into _t values ('A1 non-owner tidak bisa adjust saldo', false, 'lolos!'); exception when others then insert into _t values ('A1 non-owner tidak bisa adjust saldo', true, sqlerrm); end;
  begin perform public.jt_owner_store_delete(sid, kx); insert into _t values ('A2 non-owner tidak bisa hapus toko', false, 'lolos!'); exception when others then insert into _t values ('A2 non-owner tidak bisa hapus toko', true, sqlerrm); end;
  begin perform public.jt_owner_wallet_cfg('{"storePct":0}'::jsonb, kx); insert into _t values ('A3 non-owner tidak bisa ubah komisi', false, 'lolos!'); exception when others then insert into _t values ('A3 non-owner tidak bisa ubah komisi', true, sqlerrm); end;
  begin perform public.jt_owner_audit(kx, 5); insert into _t values ('A4 non-owner tidak bisa baca audit', false, 'lolos!'); exception when others then insert into _t values ('A4 non-owner tidak bisa baca audit', true, sqlerrm); end;
  begin perform public.jt_owner_topup_decide(1, true, kx); insert into _t values ('A5 non-owner tidak bisa setujui isi saldo', false, 'lolos!'); exception when others then insert into _t values ('A5 non-owner tidak bisa setujui isi saldo', true, sqlerrm); end;
  insert into _t values ('A6 non-owner hanya dapat ok:false tanpa data owner', public.jt_owner_data(kx) = '{"ok": false}'::jsonb, left(public.jt_owner_data(kx)::text, 60));
  begin perform public.jt_write('set', 'stores/' || sid, '{"name":"diretas"}'::jsonb, kx); insert into _t values ('A7 non-pemilik tidak bisa ubah toko orang lain', false, 'lolos!'); exception when others then insert into _t values ('A7 non-pemilik tidak bisa ubah toko orang lain', true, sqlerrm); end;
  begin perform public.jt_write('set', 'orders/x', '{}'::jsonb, ko); insert into _t values ('A8 jt_write menolak koleksi selain toko/produk', false, 'lolos!'); exception when others then insert into _t values ('A8 jt_write menolak koleksi selain toko/produk', true, sqlerrm); end;
  insert into _t select 'A9 tabel sensitif tertutup untuk anon/authenticated', not (has_table_privilege('anon', 'public.jt_wallet_tx', 'select') or has_table_privilege('authenticated', 'public.jt_wallet_tx', 'select') or has_table_privilege('anon', 'public.jt_owner_auth', 'select') or has_table_privilege('anon', 'public.jt_audit', 'select')), '';

  -- ===== B. KOMISI =====
  update public.jt_settings set value = value - 'storePct' - 'drvPct' - 'minTx' - 'round' where key = 'wallet';
  insert into _t values ('B1 default 3% (Rp100.000 -> 3.000)', public.jt_comm_calc(100000, 'store') = 3000 and public.jt_comm_calc(100000, 'drv') = 3000, public.jt_comm_calc(100000, 'store')::text);
  update public.jt_settings set value = value || '{"storePct":5,"drvPct":2,"minTx":20000,"round":100}'::jsonb where key = 'wallet';
  insert into _t values ('B2 komisi 5% toko, pembulatan 100', public.jt_comm_calc(100000, 'store') = 5000 and public.jt_comm_calc(33333, 'store') = 1700, public.jt_comm_calc(33333, 'store')::text);
  insert into _t values ('B3 di bawah minimum transaksi = tanpa komisi', public.jt_comm_calc(12345, 'store') = 0 and public.jt_comm_calc(10000, 'drv') = 0, '');
  insert into _t values ('B4 hasil selalu bilangan bulat', public.jt_comm_calc(33333, 'store') = round(public.jt_comm_calc(33333, 'store')) and public.jt_comm_calc(77777, 'drv') = round(public.jt_comm_calc(77777, 'drv')), '');
  insert into _t values ('B5 komisi nol / negatif / null aman', public.jt_comm_calc(0, 'store') = 0 and public.jt_comm_calc(-5, 'store') = 0 and public.jt_comm_calc(null, 'drv') = 0, '');
  begin perform public.jt_owner_wallet_cfg('{"round":7}'::jsonb, ko); insert into _t values ('B6 pembulatan tidak valid ditolak', false, 'lolos!'); exception when others then insert into _t values ('B6 pembulatan tidak valid ditolak', true, sqlerrm); end;
  perform public.jt_owner_wallet_cfg('{"storePct":99,"drvPct":-4}'::jsonb, ko);
  insert into _t values ('B7 komisi dibatasi 0-30%', (public.jt_comm_cfg()->>'storePct')::numeric = 30 and (public.jt_comm_cfg()->>'drvPct')::numeric = 0, public.jt_comm_cfg()::text);
  update public.jt_settings set value = value - 'storePct' - 'drvPct' - 'minTx' - 'round' where key = 'wallet';

  -- ===== C. SALDO / LEDGER =====
  insert into public.jt_wallet_tx (store_id, kind, amount, status, note, proof) values (sid, 'topup', 50000, 'pending', 'uji', 'data:image/png;base64,AA') returning id into tx_id;
  perform public.jt_owner_topup_decide(tx_id, true, ko);
  begin perform public.jt_owner_topup_decide(tx_id, true, ko); insert into _t values ('C1 isi saldo tidak bisa disetujui dua kali', false, 'lolos!'); exception when others then insert into _t values ('C1 isi saldo tidak bisa disetujui dua kali', true, sqlerrm); end;
  select count(*) into n from public.jt_wallet_tx where id = tx_id and status = 'ok';
  insert into _t values ('C2 isi saldo disetujui tepat sekali', n = 1, '');
  begin perform public.jt_owner_wallet_adjust(sid, 0, 'x', ko); insert into _t values ('C3 adjust 0 ditolak', false, 'lolos!'); exception when others then insert into _t values ('C3 adjust 0 ditolak', true, sqlerrm); end;
  begin perform public.jt_owner_wallet_adjust(sid, 99999999, 'x', ko); insert into _t values ('C4 adjust di atas batas ditolak', false, 'lolos!'); exception when others then insert into _t values ('C4 adjust di atas batas ditolak', true, sqlerrm); end;
  insert into _t select 'C5 semua nominal ledger bilangan bulat', not exists (select 1 from public.jt_wallet_tx where amount <> round(amount)), '';

  -- ===== D. AUDIT =====
  perform public.jt_owner_wallet_adjust(sid, 1000, 'uji audit', ko);
  select count(*) into n from public.jt_audit where action = 'wallet.adjust' and actor = 'zz_test_owner';
  insert into _t values ('D1 tindakan owner tercatat di audit', n >= 1, n::text);
  begin update public.jt_audit set action = 'x'; insert into _t values ('D2 audit tidak bisa diubah', false, 'lolos!'); exception when others then insert into _t values ('D2 audit tidak bisa diubah', true, sqlerrm); end;
  begin delete from public.jt_audit; insert into _t values ('D3 audit tidak bisa dihapus', false, 'lolos!'); exception when others then insert into _t values ('D3 audit tidak bisa dihapus', true, sqlerrm); end;

  -- ===== E. ORDER JAGO & PENUGASAN DRIVER =====
  d1 := public.jt_driver_id(public.jt_h(kd1)); d2 := public.jt_driver_id(public.jt_h(kd2));
  insert into public.docs (id, col, data) values
    ('drivers/' || d1, 'drivers', jsonb_build_object('name', 'Driver Uji 1', 'wa', '0811000001', 'online', true, 'verify', 'verified', 'lat', 0.9, 'lng', 100.5, 'locAt', now_ms, 'vehicle', 'Motor', 'plate', 'BM 1 UJ')),
    ('drivers/' || d2, 'drivers', jsonb_build_object('name', 'Driver Uji 2', 'wa', '0811000002', 'online', true, 'verify', 'verified', 'lat', 0.9005, 'lng', 100.5, 'locAt', now_ms, 'vehicle', 'Motor', 'plate', 'BM 2 UJ'));
  insert into public.jt_wallet_tx (store_id, kind, amount, note) values ('drv:' || d1, 'bonus', 15000, 'uji'), ('drv:' || d2, 'bonus', 15000, 'uji');
  insert into public.docs (id, col, data) values ('rides/TSTR1', 'rides', jsonb_build_object('kind', 'ride', 'status', 'mencari_driver', 'code', 'TSTR1', 'pickup', jsonb_build_object('lat', 0.9, 'lng', 100.5), 'dest', jsonb_build_object('lat', 0.91, 'lng', 100.51), 'fareEst', 20000, 'searchAt', now_ms, 'rider', jsonb_build_object('wa', '0899999999')));
  begin
    o := public.jt_driver_act('TSTR1', 'accept', '{}'::jsonb, kd1);
    insert into _t values ('E1 driver terdekat bisa mengambil order', o->>'status' = 'driver_jemput' and o->>'driverId' = d1, o->>'status');
  exception when others then insert into _t values ('E1 driver terdekat bisa mengambil order', false, sqlerrm); end;
  begin perform public.jt_driver_act('TSTR1', 'accept', '{}'::jsonb, kd2); insert into _t values ('E2 order yang sama tidak bisa diambil dua driver', false, 'lolos!'); exception when others then insert into _t values ('E2 order yang sama tidak bisa diambil dua driver', sqlerrm like '%sudah diambil%', sqlerrm); end;
  begin perform public.jt_driver_act('TSTR1', 'done', '{}'::jsonb, kd2); insert into _t values ('E3 driver lain tidak bisa menyelesaikan order orang', false, 'lolos!'); exception when others then insert into _t values ('E3 driver lain tidak bisa menyelesaikan order orang', sqlerrm like '%Bukan pesanan Anda%', sqlerrm); end;
  begin perform public.jt_driver_act('TSTR1', 'done', '{}'::jsonb, kd1); insert into _t values ('E4 tidak bisa lompat status (jemput -> selesai)', false, 'lolos!'); exception when others then insert into _t values ('E4 tidak bisa lompat status (jemput -> selesai)', sqlerrm like '%Status pesanan tidak sesuai%', sqlerrm); end;
  perform public.jt_driver_act('TSTR1', 'pickup', '{}'::jsonb, kd1);
  o := public.jt_driver_act('TSTR1', 'done', '{"ongkir":20000}'::jsonb, kd1);
  select coalesce(sum(amount), 0) into v from public.jt_wallet_tx where store_id = 'drv:' || d1 and kind = 'fee' and order_id = 'ride:TSTR1';
  insert into _t values ('E5 komisi driver dipotong tepat sekali (3% x 20.000 = 600)', v = -600 and o->>'status' = 'selesai', v::text);
  begin perform public.jt_driver_act('TSTR1', 'done', '{"ongkir":20000}'::jsonb, kd1); insert into _t values ('E6 order selesai tidak bisa diselesaikan lagi', false, 'lolos!'); exception when others then insert into _t values ('E6 order selesai tidak bisa diselesaikan lagi', true, sqlerrm); end;
  select count(*) into n from public.jt_wallet_tx where order_id = 'ride:TSTR1' and kind = 'fee';
  insert into _t values ('E7 tidak ada potongan ganda di ledger', n = 1, n::text);
  begin perform public.jt_driver_act('TSTR1', 'accept', '{}'::jsonb, kx); insert into _t values ('E8 akun non-driver tidak bisa ambil order', false, 'lolos!'); exception when others then insert into _t values ('E8 akun non-driver tidak bisa ambil order', true, sqlerrm); end;
  insert into public.docs (id, col, data) values ('rides/TSTR2', 'rides', jsonb_build_object('kind', 'ride', 'status', 'mencari_driver', 'code', 'TSTR2', 'pickup', jsonb_build_object('lat', 0.9, 'lng', 100.5), 'dest', jsonb_build_object('lat', 0.91, 'lng', 100.51), 'fareEst', 20000, 'searchAt', now_ms, 'rider', jsonb_build_object('wa', '0899999998')));
  insert into public.jt_wallet_tx (store_id, kind, amount, note) values ('drv:' || d2, 'adjust', -14000, 'uji saldo rendah');  -- saldo d2 = 1.000 < minimum 10.000
  begin perform public.jt_driver_act('TSTR2', 'accept', '{}'::jsonb, kd2); insert into _t values ('E9 driver saldo di bawah minimum tidak bisa ambil order', false, 'lolos!'); exception when others then insert into _t values ('E9 driver saldo di bawah minimum tidak bisa ambil order', sqlerrm like '%Saldo%' or sqlerrm like '%jangkauan%', sqlerrm); end;

  select count(*) into n from public.jt_wallet_tx where order_id = 'ride:TSTR1' and kind = 'fee' and note like 'Komisi Jago %';
  insert into _t values ('E10 catatan komisi Jago tidak lagi menulis angka 3% mati', n = 1, n::text);

  select string_agg(case when ok then 'PASS ' else 'FAIL ' end || tn || case when ok then '' else ' [' || coalesce(info, '') || ']' end, E'\n' order by tn) into res from _t;
  select count(*) filter (where not ok) into n from _t;
  raise exception E'RESULT\n%\n== % tes, % gagal ==', res, (select count(*) from _t), n;
end $tests$;
