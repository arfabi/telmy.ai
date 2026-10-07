<p align="center">
  <img src="logo.png" alt="Telmy.ai Logo" width="220" />
</p>

# 🌐 Telmy.ai: Your AI Form Filling Assistant

> **Telmy.ai** adalah **Your AI Form Filling Assistant** yang memandu siapa pun dalam memahami dan mengisi formulir digital pelayanan publik, administrasi, visa/imigrasi, hingga Google Forms secara mudah, aman, bebas bingung, dan multibahasa.
> 
> *Tersedia sebagai Chrome Extension (Manifest V3) siap pakai di Chrome Web Store dan live di [telmy.id](https://telmy.id) / [telmyai.com](https://telmyai.com).*

---

## 🌟 Fitur Unggulan

### 1. 🧭 Chrome Native Side Panel Assistant (`chrome.sidePanel`)
- Tersemat rapi di panel samping native browser Chrome tanpa merusak struktur CSS website target.
- **Ringkasan Formulir:** Menampilkan tujuan formulir, estimasi durasi, dan daftar dokumen persiapan yang wajib disiapkan.
- **Pelacak Kemajuan (Progress Tracker):** Menghitung persentase kolom yang telah terisi secara real-time.
- **Stepper Navigasi:** Memandu pengisian formulir langkah demi langkah secara terstruktur.
- **Shortcut Cepat:** Dapat dibuka seketika dengan shortcut **`Alt + G`** atau klik ikon toolbar.

### 2. 🤖 100% Google AI Engine (Gemini Flash & Flash-Lite TTS)
- **Gemini 1.5 / 2.0 Flash:** Menganalisis konteks kolom, label tersembunyi, contoh isian fiktif yang realistis, peringatan kesalahan umum (*common mistakes*), dan catatan khusus pemegang paspor asing (*notes for foreigners*).
- **Gemini 3.8 Flash-Lite TTS (Preview):** Membacakan panduan secara interaktif dalam suara natural berbahasa Indonesia dan multibahasa dengan latensi ultra-rendah.
- **Kamus Resmi Firestore:** Terintegrasi dengan database istilah terverifikasi di Firebase Firestore untuk istilah birokrasi baku (Apostille, NIK, NIB, Paspor, NPWP/Coretax).

### 3. 🎙️ Push-to-Talk & Interaksi Suara Ramah Privasi
- **Murni Push-to-Talk:** Mikrofon hanya aktif saat pengguna secara sadar mengklik ikon mikrofon di panel samping. Tidak menggunakan wake-word atau mikrofon *always-listening*, menjamin kepatuhan privasi 100% bagi pengguna dan reviewer Chrome Web Store.
- **Transkrip Obrolan Real-Time:** Suara pengguna langsung ditranskripsikan ke dalam chat stream dengan tombol aksi interaktif (*action chips*).
- **Audio Fallback:** Didukung fallback cerdas ke browser Web Speech API.

### 4. ⚡ Deteksi Formulir Universal & Sorotan Visual
- **Dukungan Google Forms & Web Form Modern:** Memindai input teks, select, textarea, radio group, checkbox, hingga komponen ARIA (`[role="radiogroup"]`, `[role="textbox"]`, `[role="combobox"]`).
- **Badge Nomor Neon:** Menempelkan nomor urut pemandu di samping setiap pertanyaan.
- **Highlight Ring & Smooth Scroll:** Menyorot kolom aktif dengan spotlight neon dan auto-scroll ke posisi kolom tersebut.

### 5. 🌐 Bahasa Utama English & Cakupan Lengkap 11 Bahasa Area JAPAC
Secara bawaan (*default*), seluruh antarmuka dan landing page menggunakan **Bahasa Inggris (English)** standar internasional. Pengguna dapat beralih bahasa seketika melalui selektor bahasa ke seluruh negara area JAPAC:
- 🇬🇧 **English (EN - Default Global)**
- 🇮🇩 **Bahasa Indonesia (ID)**
- 🇯🇵 **日本語 (JA - Jepang)**
- 🇰🇷 **한국어 (KO - Korea)**
- 🇨🇳 **简体中文 (ZH - Tiongkok/Singapura)**
- 🇹🇼 **繁體中文 (ZH-TW - Taiwan/Hong Kong)**
- 🇻🇳 **Tiếng Việt (VI - Vietnam)**
- 🇹🇭 **ไทย (TH - Thailand)**
- 🇮🇳 **हिन्दी (HI - India)**
- 🇵🇭 **Filipino (FIL - Filipina)**
- 🇲🇾 **Bahasa Melayu (MS - Malaysia)**

### 6. 🔒 Privasi Mutlak (Privacy-First Architecture)
- Telmy **hanya membaca metadata kolom** (label pertanyaan, tipe input, placeholder, opsi pilihan).
- Telmy **tidak pernah membaca, menyimpan, atau mengirim data isian sensitif** (NIK, paspor, password, nomor rekening) ke server.
- Otomatis mengecualikan captcha, token CSRF, dan bidang verifikasi keamanan.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                       PENGGUNA                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐   ┌──────────────────────────┐
│  Chrome Extension (MV3 Lite) │   │ Web Platform (Firebase)  │
│  - sidepanel/sidepanel.html  │   │ - Landing Page telmy.id  │
│  - content/scanner.js        │   │ - Google Auth Login      │
│  - content/highlighter.js    │   │ - User Dashboard         │
│  - Push-to-Talk Mic          │   │ - Live Demo Playground   │
└──────────────┬───────────────┘   └──────────┬───────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND GATEWAY (Cloud Run)                 │
│  - Express.js / Firebase Functions                          │
│  - Google Gemini 1.5/2.0 Flash (Reasoning & Copilot)        │
│  - Gemini 3.8 Flash-Lite TTS (Audio Voice Engine)           │
│  - Firebase Firestore (Kamus Resmi Terverifikasi)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Struktur Direktori

```text
telmy/
├── logo.png                    # Logo resmi Telmy.ai
├── extension/                  # Ekstensi Chrome Manifest V3
│   ├── manifest.json           # Konfigurasi ekstensi MV3 (Lite & Minimal Permission)
│   ├── background/
│   │   └── service-worker.js   # Background service worker & Side Panel handler
│   ├── content/
│   │   ├── content-main.js     # Orkestrator pemindaian halaman & MutationObserver
│   │   ├── scanner.js          # DOM scanner universal (Google Forms, ARIA, dsb)
│   │   ├── highlighter.js      # Lencana nomor, visual highlight, & scroll
│   │   ├── panel.js            # Komponen Co-Pilot panel (chat, multilingual)
│   │   ├── voice-manager.js    # Pengelola STT (Push-to-Talk) & Audio Playback
│   │   └── overlay.css         # Desain overlay, lencana neon, & styling panel
│   ├── popup/                  # Popup ringkas toolbar browser
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── assets/                 # Ikon resmi ekstensi (16, 32, 48, 128px)
├── backend/                    # Node.js Backend Service (Google AI Native)
│   ├── src/
│   │   ├── index.js            # Entry point server Express
│   │   ├── config/             # Konfigurasi Firebase Firestore & Gemini SDK
│   │   ├── routes/             # Endpoint /api/explain, /api/chat, /api/voice/tts
│   │   └── services/           # geminiService.js, voiceService.js, dictionaryService.js
│   └── .env                    # Variabel konfigurasi lingkungan
├── test-page/                  # Halaman web simulasi pengujian formulir
│   └── demo_apostille.html
├── plan.md                     # Roadmap eksekusi & prioritas Google Hackathon
├── PRD_ AI Form Explainer.md   # Product Requirement Document (PRD v2.1)
└── README.md                   # Dokumentasi resmi repositori
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Jalankan Backend Server (Gemini Engine)
1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Pastikan file `.env` telah memuat kredensial Google AI:
   ```env
   PORT=8080
   GEMINI_API_KEY=your-gemini-api-key
   EXPLAIN_STRATEGY=AI_FIRST
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   *Server akan aktif di `http://localhost:8080`.*

---

### 2. Pasang Ekstensi di Google Chrome
1. Buka browser Chrome dan akses: `chrome://extensions/`.
2. Aktifkan **Developer mode** di pojok kanan atas.
3. Klik tombol **Load unpacked** di pojok kiri atas.
4. Pilih folder **`extension`** dari repositori ini.
5. Ekstensi **Telmy.ai** kini terpasang dan siap digunakan!

---

### 3. Menggunakan Telmy.ai
1. Buka formulir online apa saja (misalnya Google Forms atau simulasi [`test-page/demo_apostille.html`](file:///d:/webdev/laragon/www/telmy/test-page/demo_apostille.html)).
2. Telmy akan otomatis memindai struktur pertanyaan dan memasang lencana nomor panduan.
3. Klik tombol mikrofon di panel samping untuk berbicara (*Push-to-Talk*) atau ketik pertanyaan langsung di kolom obrolan.
4. Gunakan shortcut **`Alt + G`** untuk membuka atau menutup panel samping kapan saja.

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **Telmy.ai Team**. Dikembangkan untuk Google AI Hackathon.
