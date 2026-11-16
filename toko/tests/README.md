# Tes otomatis JAGA

| File | Isi | Cara menjalankan |
|---|---|---|
| `sql-tests.sql` | 34 tes database: otorisasi, komisi, saldo/ledger, audit, order Jago & penugasan driver | Tempel di SQL Editor Supabase lalu Run. Hasil tampil sebagai pesan `RESULT ...` (normal, itu cara membatalkan transaksi). Semua data uji dibatalkan. Semua baris harus `PASS`. |
| `sql-tests-bukti.sql` | 19 tes foto bukti & deteksi kecurangan (akses foto, validasi, aturan pemindai, audit) | Sama seperti di atas. |
| `sql-tests-promo.sql` | 23 tes kode promo (validasi, kuota, pembatalan mengembalikan kuota, komisi dari total setelah diskon) dan bebas komisi toko/driver | Sama seperti di atas. |
| `sql-tests-tempat.sql` | 15 tes buku tempat (pencarian, validasi nama/wilayah, batas harian, hak owner, audit) | Sama seperti di atas. |
| `sql-tests-bersih.sql` | 10 tes pembersihan riwayat batal setelah 30 menit (pesanan, order Jago, chat, foto, jejak anti-kecurangan) | Sama seperti di atas. |
| `smoke.py` | Muat halaman di HP/tablet/desktop tanpa error JS & overflow, hitungan komisi layar | `python3 tests/smoke.py` (butuh Playwright + Chrome) |

**Batasan yang jujur:** tes penugasan driver berjalan berurutan dalam satu transaksi. Ini membuktikan aturan status (order yang sudah diambil ditolak), sedangkan pengaman balapan sesungguhnya adalah kunci baris `FOR UPDATE` di `jt_driver_act`, yang dibaca dari kode tapi belum diuji dengan dua koneksi bersamaan. Alur `jt_order_create` kini diuji lewat tes promo. Belum ada tes: pembayaran, refund, notifikasi push, dan unggah foto dari kamera HP asli.

## Berkas aplikasi
`index.html` hanya kerangka kecil. Gaya ada di `app.css`, logika di `app.js`. **Saat deploy, naikkan angka versi bersama-sama:** `CACHE` di `sw.js`, `?v=` pada `app.css`/`app.js` di `index.html`, dan `?v=` pada daftar `SHELL` di `sw.js`.

- `sql-tests-wa.sql` (30 tes): WhatsApp privat + akun pembeli. Jalankan bersama `supabase-wa-privat-pembeli.sql` dalam satu `begin; ...` (otomatis dibatalkan).
- `sql-tests-hapus-akun.sql` (17 tes): hapus akun sendiri (pembeli/toko/driver) hanya bila tanpa pesanan berjalan, bagi hasil lunas, dan tanpa isi saldo menunggu. Jalankan bersama `supabase-hapus-akun.sql` dalam satu `begin; ...`.
- Login driver (nama + plat + password, `supabase-login-driver.sql`): 16 tes dijalankan langsung dalam blok rollback saat pemasangan (tautan HP baru, kunci 15 menit setelah 5 salah, keluar, hapus akun membersihkan tautan).
