# ucamusic v6

Web streaming musik gratis berbasis YouTube Music — cepat, elegan, dan **tanpa akun/login**.

## Yang berubah di v6
- ❌ Dihapus total: sistem login/register, admin panel, halaman Reels, dan ketergantungan ke MongoDB.
- ✅ Lagu disukai, playlist, dan riwayat putar sekarang tersimpan langsung di browser (localStorage) — tidak butuh database, tidak ada resiko error koneksi database lagi.
- ✅ Homepage dirombak total: hero lagu trending, banyak baris genre (Pop, Hip-Hop, Dangdut, R&B, dst), chart global, artis populer, nostalgia, dan grid jelajah genre.
- ✅ Tampilan desktop baru: sidebar navigasi ala Spotify (muncul otomatis di layar lebar), bukan cuma tampilan mobile yang di-stretch.

## Menjalankan
```
npm install
npm run build
```
Tidak ada environment variable yang wajib diisi.

## Deploy ke Vercel
```
vercel --prod --force
```
