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

## Database
Sudah terhubung ke Supabase proyek **jaga-toko** (Singapura, paket gratis) — lihat `config.js` dan `supabase.sql`.

- Toko & produk tampil untuk semua orang dan berubah langsung (realtime).
- Pesanan hanya bisa dilihat pembeli dan pemilik toko yang bersangkutan.
- Harga, stok, dan bagi hasil 3% dihitung di server.
- Penjual bisa membuka dashboard di perangkat lain lewat **Pengaturan → Kode akses toko**.

Catatan: paket gratis Supabase berhenti sementara bila 7 hari tanpa aktivitas (data tetap aman, bisa diaktifkan lagi dari dashboard Supabase).

## Ikon
Ikon 3D di `emoji/` dari Fluent Emoji (Microsoft, lisensi MIT) — lihat `emoji/LICENSE.md`.
