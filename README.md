# Pin Pop — Jasa Desain Logo Pin Siap Cetak

Website statis (HTML + CSS + vanila JS). Tanpa build, tanpa database.
Form pemesanan meneruskan order ke WhatsApp admin (`WA_ADMIN` di `script.js`).

## Struktur

- `index.html` — seluruh halaman
- `style.css` — tema + responsive
- `script.js` — interaksi (nav, filter, lightbox, form → WA)
- `logo.png` — logo (dari proposal)
- `pin/` — foto contoh pin (crop dari katalog)

## Deploy ke GitHub Pages

1. Buat repo baru di GitHub, lalu dari folder ini:
   ```
   git add -A
   git commit -m "Rilis awal Pin Pop"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. Di repo: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.
3. Web live di `https://<user>.github.io/<repo>/`.

## Ubah tampilan

Edit file → `git add -A && git commit -m "..." && git push` →
Pages update otomatis (±1–2 menit). Contoh cepat:

| Mau ganti | File |
|---|---|
| Nomor WA admin | `WA_ADMIN` di `script.js` |
| Harga / paket | blok `#harga` di `index.html` |
| Foto pin rekomendasi | tambah ke `pin/`, ganti `src` di kartu `#galeri` |
| Warna tema | `:root` di `style.css` |
