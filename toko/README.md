# Jaga Toko

Marketplace semua toko — gratis ongkir, tanpa biaya admin, pembayaran langsung ke akun toko.

| Halaman | Alamat |
|---|---|
| Pembeli / pengunjung | https://jagapatner.my.id/toko/ |
| Portal penjual (mitra) | https://jagapatner.my.id/toko/#mitra |

Kategori: Makanan, Minuman, Sembako, Sayur & Buah, Rumah Tangga, Fashion, Handphone, Laptop, Game.

## Isi folder
| File | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi (pembeli + portal mitra) |
| `config.js` | Alamat & kunci publik database Supabase |
| `supabase.sql` | Skema database — dijalankan sekali di Supabase |

## Menghubungkan database (gratis)
Tanpa database, aplikasi berjalan dalam **mode demo**: data hanya tersimpan di browser masing-masing.

1. Daftar di https://supabase.com → **New project** (pilih region Singapore).
2. Buka **SQL Editor** → tempel isi `supabase.sql` → **Run**.
3. Buka **Project Settings → API**, salin **Project URL** dan **anon public key**.
4. Isi keduanya di `toko/config.js`, simpan, lalu commit.

Setelah itu toko, produk, dan pesanan tersimpan di satu database dan tampil untuk semua orang.

## Catatan tahap 1
- Keamanan masih terbuka (siapa pun bisa menulis) — khusus uji coba. Tahap berikutnya: login penjual & kurir, persetujuan toko oleh admin JAGA, aturan per pemilik toko.
- Foto dikompres di browser lalu disimpan di database; nanti dipindah ke Supabase Storage.
- Paket gratis Supabase berhenti sementara jika 7 hari tidak ada aktivitas (data tetap aman).
