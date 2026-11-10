# JAGA — Management & Operations

Website resmi JAGA: cleaning service & manajemen operasional di Bali, Lombok, dan Yogyakarta.

- Live: https://jagapatner.my.id
- Hosting: GitHub Pages (branch `main`, folder root)
- Domain: dikelola di Helipod (DNS A → GitHub Pages, CNAME `www`)

## Isi repository
| File | Fungsi |
|---|---|
| `index.html` | Seluruh website + portal VIP (satu file) |
| `jaga-logo.svg` | Logo JAGA (vektor) |
| `media.json` | Daftar video latar & foto galeri — dikelola dari Portal → Media |
| `videos/`, `images/` | File video & foto yang diunggah dari Portal → Media |
| `toko/` | **Jaga Toko** — marketplace semua toko (`/toko/` pembeli, `/toko/#mitra` penjual). Lihat `toko/README.md` |
| `CNAME` | Domain kustom untuk GitHub Pages — jangan dihapus |
| `Dockerfile` | Opsional, hanya untuk hosting container (tidak dipakai GitHub Pages) |
