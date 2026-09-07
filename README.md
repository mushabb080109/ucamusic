# ucamusic

Pemutar musik streaming premium — dibangun dengan **Next.js 14 (App Router)**, **React**, dan **Tailwind CSS**. Didesain khusus untuk berjalan di **Vercel**, tanpa ketergantungan Netlify sama sekali.

## ✨ Fitur

- Pencarian lagu, album, artis, dan playlist secara real-time (sumber: YouTube Music)
- Pemutar audio penuh dengan mini-player + full-screen player bergaya aplikasi musik besar
- Lirik sinkron otomatis (LRCLIB → fallback transkripsi AI via AssemblyAI) lengkap dengan terjemahan
- **Reels** — feed vertikal preview lagu ala Shorts/TikTok, lengkap dengan like, share, dan tambah ke playlist
- **Login & Register** — akun tersimpan di database, lagu disukai & playlist otomatis tersinkron ke semua perangkat
- Halaman Artis & Album/Playlist
- Lagu Disukai, Playlist buatan sendiri, dan Riwayat putar — tersimpan lokal (dan di server jika login)
- UI gelap metalik premium dengan aksen gradient, glassmorphism, splash screen, dan animasi halus (Framer Motion)

## 🧱 Struktur Teknis

- `app/api/*` — seluruh backend (search, artist, album, lyrics, transcribe, translate, auth, library) berjalan sebagai **Vercel Serverless Functions (Node runtime)**
- `app/api/ytplay`, `app/api/proxy-audio`, `app/api/proxy-image` — berjalan sebagai **Vercel Edge Functions** untuk resolusi & streaming audio yang cepat
- `store/*` — state management global (Zustand) untuk player, koleksi lokal, autentikasi, dan UI (toast/sheet)
- `components/*` — komponen UI (player, kartu lagu, navigasi, sheet)

## 🚀 Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 🔐 Mengaktifkan Login & Register (opsional tapi direkomendasikan)

Tanpa langkah ini, seluruh fitur streaming musik tetap berjalan normal — hanya fitur Login/Register yang butuh setup berikut:

1. Daftar gratis di **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**, buat cluster gratis (M0)
2. Di cluster, klik **"Connect"** → **"Drivers"** → salin connection string-nya (bentuknya seperti `mongodb+srv://user:pass@cluster.mongodb.net/...`)
3. Salin file `.env.example` menjadi `.env.local`, isi:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=terserah-teks-rahasia-apa-saja
   ```
4. Di **Vercel** → buka project → **Settings → Environment Variables** → tambahkan `MONGODB_URI` dan `JWT_SECRET` yang sama, lalu **redeploy**

## ☁️ Deploy ke Vercel

1. Push folder ini ke repository GitHub/GitLab/Bitbucket kamu.
2. Buka [vercel.com/new](https://vercel.com/new) dan import repository tersebut.
3. Vercel akan otomatis mendeteksi framework **Next.js** — tidak perlu konfigurasi tambahan.
4. Klik **Deploy**. Selesai — API routes, edge functions, dan halaman akan otomatis ter-deploy.

> Tidak ada environment variable wajib. Semua endpoint pihak ketiga yang dipakai (YouTube Music internal API, LRCLIB, AssemblyAI, dll.) sudah dikonfigurasi langsung di kode.

## ⚠️ Catatan

Aplikasi ini mengambil data dari endpoint internal YouTube Music untuk kebutuhan pencarian & streaming. Gunakan secara bijak dan sesuai kebutuhan pribadi.
