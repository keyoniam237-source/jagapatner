# Tes otomatis JAGA

| File | Isi | Cara menjalankan |
|---|---|---|
| `sql-tests.sql` | 34 tes database: otorisasi, komisi, saldo/ledger, audit, order Jago & penugasan driver | Tempel di SQL Editor Supabase lalu Run. Hasil tampil sebagai pesan `RESULT ...` (normal, itu cara membatalkan transaksi). Semua data uji dibatalkan. Semua baris harus `PASS`. |
| `smoke.py` | Muat halaman di HP/tablet/desktop tanpa error JS & overflow, hitungan komisi layar | `python3 tests/smoke.py` (butuh Playwright + Chrome) |

**Batasan yang jujur:** tes penugasan driver berjalan berurutan dalam satu transaksi. Ini membuktikan aturan status (order yang sudah diambil ditolak), sedangkan pengaman balapan sesungguhnya adalah kunci baris `FOR UPDATE` di `jt_driver_act`, yang dibaca dari kode tapi belum diuji dengan dua koneksi bersamaan. Belum ada tes: alur pesanan toko (`jt_order_create` dengan produk), pembayaran, refund, dan notifikasi push.
