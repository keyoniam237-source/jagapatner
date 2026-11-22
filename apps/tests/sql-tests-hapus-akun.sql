-- Tes hapus akun sendiri. Jalankan bersama supabase-hapus-akun.sql dalam satu "begin; ..." (otomatis dibatalkan).
do $$
declare ks text := 'kunci-toko-uji-000000000000000'; kd text := 'kunci-driver-uji-0000000000000'; kb text := 'kunci-pembeli-uji-000000000000'; kx text := 'kunci-orang-lain-00000000000000';
  hs text := public.jt_h('kunci-toko-uji-000000000000000'); hd text := public.jt_h('kunci-driver-uji-0000000000000'); hb text := public.jt_h('kunci-pembeli-uji-000000000000');
  did text; r jsonb; out text := ''; ok boolean; n int := 0; f int := 0;
begin
  did := public.jt_driver_id(hd);
  insert into public.docs (id, col, data) values ('stores/tuji1', 'stores', '{"name":"Toko Uji","wa":"081200000001"}'), ('stores/tuji1/products/p1', 'stores/tuji1/products', '{"name":"P"}'),
    ('drivers/' || did, 'drivers', '{"name":"Driver Uji"}');
  insert into public.doc_keys (id, owner_hash) values ('stores/tuji1', hs), ('drivers/' || did, hd);
  insert into public.jt_buyers (key_hash, name, wa, address, status) values (hb, 'Pembeli Uji', '081200000009', 'Jl Uji', 'approved');

  -- 1 orang lain ditolak
  begin perform public.jt_account_status('store', 'tuji1', kx); ok := false; exception when others then ok := sqlerrm = 'Hanya pemilik toko'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' orang lain tidak bisa melihat status toko' || E'\n';
  begin perform public.jt_account_delete('store', 'tuji1', kx); ok := false; exception when others then ok := sqlerrm = 'Hanya pemilik toko'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' orang lain tidak bisa menghapus toko' || E'\n';

  -- 2 tanggungan bagi hasil (saldo minus) menolak
  insert into public.jt_wallet_tx (store_id, kind, amount, status, order_id, note) values ('tuji1', 'fee', -4500, 'ok', 'ouji-fee1', 'uji');
  r := public.jt_account_status('store', 'tuji1', ks);
  ok := (r->>'due')::numeric = 4500 and not (r->>'ok')::boolean and r ? 'wallet' = false;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' status menampilkan tanggungan 4500' || E'\n';
  begin perform public.jt_account_delete('store', 'tuji1', ks); ok := false; exception when others then ok := sqlerrm like 'Masih ada tanggungan bagi hasil%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' hapus toko ditolak selama bagi hasil belum lunas' || E'\n';

  -- 3 isi saldo pending menolak
  insert into public.jt_wallet_tx (store_id, kind, amount, status, note) values ('tuji1', 'topup', 10000, 'ok', 'uji');
  insert into public.jt_wallet_tx (store_id, kind, amount, status, note) values ('tuji1', 'topup', 5000, 'pending', 'uji2');
  begin perform public.jt_account_delete('store', 'tuji1', ks); ok := false; exception when others then ok := sqlerrm like 'Isi saldo%menunggu%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' hapus toko ditolak selama isi saldo menunggu' || E'\n';
  update public.jt_wallet_tx set status = 'rejected' where store_id = 'tuji1' and status = 'pending';

  -- 4 pesanan berjalan menolak
  insert into public.docs (id, col, data) values ('orders/ouji1', 'orders', jsonb_build_object('storeId', 'tuji1', 'status', 'diproses', 'driverId', did));
  insert into public.doc_keys (id, buyer_hash, store_id) values ('orders/ouji1', hb, 'tuji1');
  begin perform public.jt_account_delete('store', 'tuji1', ks); ok := false; exception when others then ok := sqlerrm like 'Masih ada 1 pesanan berjalan%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' toko: pesanan berjalan menolak' || E'\n';
  begin perform public.jt_account_delete('driver', null, kd); ok := false; exception when others then ok := sqlerrm like 'Masih ada 1 pesanan berjalan%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' driver: pesanan berjalan menolak' || E'\n';
  begin perform public.jt_account_delete('buyer', null, kb); ok := false; exception when others then ok := sqlerrm like 'Masih ada 1 pesanan berjalan%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' pembeli: pesanan berjalan menolak' || E'\n';
  update public.docs set data = data || '{"status":"selesai"}' where id = 'orders/ouji1';

  -- 5 driver: tanggungan lalu lunas
  insert into public.jt_wallet_tx (store_id, kind, amount, status, order_id, note) values ('drv:' || did, 'fee', -300, 'ok', 'ouji-fee2', 'uji');
  begin perform public.jt_account_delete('driver', null, kd); ok := false; exception when others then ok := sqlerrm like 'Masih ada tanggungan bagi hasil Rp300%'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' driver: tanggungan 300 menolak' || E'\n';
  insert into public.jt_wallet_tx (store_id, kind, amount, status, note) values ('drv:' || did, 'topup', 300, 'ok', 'lunas');
  r := public.jt_account_delete('driver', null, kd);
  ok := (r->>'ok')::boolean and not exists (select 1 from public.docs where id = 'drivers/' || did) and not exists (select 1 from public.doc_keys where id = 'drivers/' || did)
    and exists (select 1 from public.jt_wallet_tx where store_id = 'drv:' || did);
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' driver: setelah lunas akun terhapus, riwayat saldo tetap ada' || E'\n';
  begin perform public.jt_account_delete('driver', null, kd); ok := false; exception when others then ok := sqlerrm = 'Akun driver tidak ditemukan'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' driver: hapus kedua kali ditolak' || E'\n';

  -- 6 toko: lunas -> terhapus bersih
  r := public.jt_account_status('store', 'tuji1', ks);
  ok := (r->>'ok')::boolean and (r->>'balance')::numeric = 5500;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' toko: status lunas, saldo 5500' || E'\n';
  r := public.jt_account_delete('store', 'tuji1', ks);
  ok := not exists (select 1 from public.docs where id like 'stores/tuji1%') and not exists (select 1 from public.doc_keys where id = 'stores/tuji1')
    and not exists (select 1 from public.jt_store_wa where store_id = 'tuji1') and exists (select 1 from public.docs where id = 'orders/ouji1')
    and exists (select 1 from public.jt_wallet_tx where store_id = 'tuji1');
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' toko: toko, produk, WA terhapus; pesanan lama & riwayat saldo tetap' || E'\n';

  -- 7 pembeli
  r := public.jt_account_delete('buyer', null, kb);
  ok := not exists (select 1 from public.jt_buyers where key_hash = hb) and exists (select 1 from public.docs where id = 'orders/ouji1');
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' pembeli: akun terhapus, riwayat pesanan tetap' || E'\n';

  -- 8 audit & validasi
  ok := (select count(*) from public.jt_audit where action = 'account.delete' and at > now() - interval '1 minute') = 3;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' tiga penghapusan tercatat di audit' || E'\n';
  begin perform public.jt_account_delete('owner', null, kb); ok := false; exception when others then ok := sqlerrm = 'Permintaan tidak valid'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' peran tidak dikenal ditolak' || E'\n';
  begin perform public.jt_account_delete('buyer', null, 'pendek'); ok := false; exception when others then ok := sqlerrm = 'Kunci akses tidak valid'; end;
  n := n + 1; if not ok then f := f + 1; end if; out := out || case when ok then 'PASS' else 'FAIL' end || ' kunci pendek ditolak' || E'\n';

  raise exception E'RESULT % tes, % gagal\n%', n, f, out;
end $$;
