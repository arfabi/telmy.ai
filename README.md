# 🌐 Telmy.ai: Your AI Form Filling Assistant & Conversational Co-pilot

<p align="center">
  <img src="logo.png" alt="Telmy.ai Brand Logo" width="280" />
</p>

<p align="center">
  <strong>Membimbing siapa pun memahami dan menyelesaikan formulir birokrasi, visa, perizinan, dan dokumen digital yang rumit secara intuitif, percaya diri, dan multibahasa.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-3.5%20Flash--Lite-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Google%20Cloud-WaveNet%20TTS-34A853?logo=googlecloud&logoColor=white" alt="Google TTS WaveNet" />
  <img src="https://img.shields.io/badge/Firebase-Firestore%20%7C%20Storage%20%7C%20Hosting-FFCA28?logo=firebase&logoColor=black" alt="Firebase Platform" />
  <img src="https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3%20Native-0071e3?logo=googlechrome&logoColor=white" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/Design-Apple%20Human%20Interface-000000?logo=apple&logoColor=white" alt="Apple HIG" />
  <img src="https://img.shields.io/badge/JAPAC%20Languages-11%20Regions-FF6F00" alt="11 JAPAC Languages" />
</p>

---

## 📌 1. Masalah Nyata (The Real-World Problem)

Mengisi formulir pelayanan publik dan administrasi digital di Asia Pasifik sering kali menjadi pengalaman yang membingungkan dan membuat frustrasi:

* 📉 **Tingkat Kegagalan & Penolakan Berkas yang Tinggi:** Berdasarkan studi administrasi publik, lebih dari **67% formulir digital mengalami pengabaian (*form abandonment*)** atau penolakan berkas akibat kesalahan tafsir istilah hukum baku (contoh: membedakan *Legalisasi Kemenkumham* vs *Apostille*, salah mengartikan *NIK* vs *Nomor KK*, atau kebingungan mengisi klausul *Surat Kuasa Substitusi*).
* 🌍 **Hambatan Bahasa di Kawasan JAPAC:** Lebih dari **50 juta ekspatriat, pelajar internasional, dan wisatawan** di Asia Pasifik kesulitan mengakses portal imigrasi (e-Visa, e-VoA), pendaftaran izin usaha, dan formulir pajak lokal karena istilah birokrasi tidak diterjemahkan dengan benar oleh mesin penerjemah standar.
* ❌ **Penerjemah Mesin Standar yang Menyesatkan:** Mesin penerjemah umum kerap merusak singkatan identitas penting (misal: *NIK* diterjemahkan sembarangan, tombol *"Daftar"* diterjemahkan menjadi *"List"* alih-alih *"Register / Sign Up"*), sehingga membingungkan pemohon dan menyebabkan data tertolak oleh sistem verifikasi instansi.
* 👵 **Kesenjangan Digital bagi Pengguna Non-Teknis & Lansia:** Formulir pemerintah yang panjang sering kali tidak menyediakan panduan per kolom (*field-level guidance*), tidak ada contoh isian realistis, dan tidak ada bantuan suara bagi pengguna dengan keterbatasan penglihatan.

---

## 💡 2. Solusi & Siapa Penggunanya

### Solusi: Telmy.ai
**Telmy.ai** hadir sebagai **AI Form Filling Assistant & Conversational Co-pilot** yang hidup di panel samping native browser (*Chrome Side Panel*). Telmy bekerja secara **on-demand** (hanya aktif saat dibutuhkan) untuk:
1. Menganalisis dan menomori kolom formulir secara visual tanpa merusak tata letak halaman asli.
2. Memberikan penjelasan bahasa manusia yang ramah, analogi praktis, contoh isian fiktif yang realistis, dan peringatan kesalahan umum per kolom.
3. Menghadirkan **maskot avatar robot interaktif** dengan sinkronisasi gerak bibir (*lip-sync*) alami mengikuti suara penjelasan Google Cloud WaveNet TTS secara real-time.
4. Menerjemahkan seluruh antarmuka formulir secara sadar konteks (*Context-Aware*) ke dalam **11 bahasa kawasan Asia Pasifik (JAPAC)** dengan menjaga integritas singkatan resmi.

### Siapa Penggunanya?
* **Warga Awam & Lansia:** Membutuhkan bimbingan santai langkah demi langkah untuk mengisi formulir administrasi tanpa rasa takut salah.
* **Ekspatriat, Turis, & Pelajar Asing:** Mengisi portal visa, imigrasi, dan perizinan lokal dalam bahasa ibu mereka dengan istilah yang tetap akurat.
* **Pelaku UMKM & Pengusaha:** Mengurus perizinan berusaha (NIB, OSS, perpajakan) yang sarat akan istilah birokrasi legal.
* **Pengguna Disabilitas / Low-Vision:** Terbantu dengan fitur pembacaan suara alami (*voice guidance*) dan visual ring spotlight yang menuntun fokus pandangan.

---

## ⚡ 3. Fitur Lengkap Telmy.ai

### 🎯 A. Step-by-Step Form Explainer Universal
* **Deteksi Form Universal:** Memindai formulir HTML5 standar, Google Forms, sistem perizinan instansi, hingga komponen berbasis ARIA (`role="radiogroup"`, `role="textbox"`, `role="combobox"`).
* **Badge Nomor & Spotlight Ring:** Menempatkan penomoran panduan non-destruktif di setiap kolom dan memberikan highlight outline biru elegan saat kolom sedang aktif.
* **Penjelasan Multi-Lapis per Kolom:**
  - *Maksud Kolom:* Penjelasan lugas tanpa jargon birokrasi.
  - *Contoh Realistis:* Format data fiktif yang benar (contoh: format 16 digit NIK, format tanggal paspor).
  - *Peringatan Kesalahan:* Hal-hal yang sering memicu penolakan berkas.
  - *Catatan WNA:* Panduan khusus jika pemohon adalah pemegang paspor asing / KITAS.

### 🤖 B. Interactive Talking Avatar Companion (Master SVG + WaveNet Lip-Sync)
* **Master Vector SVG Maskot:** Berbasis karakter robot Telmy dengan layer viseme mulut independen (`idle`, `aei`, `ou`, `mbp`, `wide`) dan mekanisme kedip mata acak (*natural blinking*).
* **Audio-Driven Lip-Sync via Web Audio API:** Memanfaatkan `AudioContext` dan `AnalyserNode` (FFT) di frontend untuk memetakan frekuensi audio MP3 Google Cloud WaveNet TTS secara langsung ke layer viseme mulut per frame (`requestAnimationFrame`).
* **Micro-Interaction Menyenangkan:** Pengguna dapat mengklik avatar untuk memicu animasi memantul (*gentle bounce*), gelembung tips ramah, dan sapaan suara interaktif.

### 🌐 C. Context-Aware Full Page Translation
* **Hierarki Prompt 4 Lapis Gemini 3.5 Flash-Lite:**
  1. *Context Statement:* Menganalisis domain web dan subjek formulir (misal: Portal Legalisasi Dokumen Kemenkumham).
  2. *Glossary Preservation:* Menjaga singkatan baku dan nama dokumen resmi (KTP, NIK, NPWP, SKCK, Apostille).
  3. *UI/UX Standard Enforcement:* Menjaga konvensi tombol aksi (*"Daftar"* $\rightarrow$ *"Register"*, *"Kirim Permohonan"* $\rightarrow$ *"Submit Application"*).
  4. *Structured In-Place DOM Swap:* Mengganti teks label secara instan dan menyediakan tombol 1-klik *"Show Original"* untuk mengembalikan teks asli kapan saja.

### 🎙️ D. Voice Companion & Push-to-Talk Ramah Privasi
* **Google Cloud TTS WaveNet:** Suara narasi yang jernih, terdengar manusiawi, dan mendukung berbagai aksen wilayah JAPAC.
* **Murni Push-to-Talk:** Mikrofon hanya aktif saat tombol mic ditekan secara sadar oleh pengguna. Tidak ada perekaman latar belakang (*no always-listening*), menjamin keamanan privasi 100%.

### 🍎 E. User Dashboard & Web Platform (Filosofi Desain Apple)
* **Cupertino Bento Grid Layout:** Dashboard web terintegrasi di `http://localhost:8080/dashboard` (atau `telmy.id`) dengan estetika bersih, material kaca buram (*frosted glass* `backdrop-filter: blur(20px)`), dan ambient radial lighting.
* **Matriks 11 Bahasa JAPAC:** Dilengkapi badge bendera vektor SVG circular yang tajam di seluruh sistem operasi (tanpa bug emoji Windows).
* **Kompresi Foto Profil WebP Otomatis:** Mengunggah foto profil yang langsung dikompresi ke format WebP ringan via HTML5 Canvas sebelum disimpan ke Firebase Storage.
* **1-Click Sync to Extension:** Sinkronisasi preferensi profil dan bahasa ke ekstensi Chrome secara instan melalui `externally_connectable` dan API backend.

### 🔒 F. Arsitektur Privasi & Kepatuhan Chrome Web Store
* **Abaikan Kolom Sensitif Secara Mutlak:** Skrip pemindai secara ketat mengabaikan `input[type="password"]`, nomor kartu kredit, kode CVV, OTP, dan token keamanan.
* **Zero Host Permissions:** Menghapus `<all_urls>` dari `host_permissions` untuk mencegah penahanan pengajuan (*manual review*) di Chrome Web Store.
* **Zero Remote Code:** Seluruh kode JavaScript dibundel 100% lokal tanpa dependensi CDN luar atau pemanggilan `eval()`.

---

## 🛠️ 4. Tech Stack (Google AI & Firebase Ecosystem)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             TEKNOLOGI UTAMA                                 │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 🤖 AI Reasoning & Copilot   │ Google Gemini LLM API (gemini-3.5-flash-lite)│
│ 🔊 Voice Synthesis Engine    │ Google Cloud Text-to-Speech (WaveNet MP3)    │
│ 🗄️ Cloud Database           │ Firebase Firestore (User Prefs & Glossary)   │
│ 🪣 Cloud Storage             │ Firebase Storage (WebP User Avatars)         │
│ 🚀 Serverless & Hosting      │ Firebase Hosting & Google Cloud Run          │
│ 🧩 Frontend Browser Client   │ Chrome Extension Manifest V3 Native SidePanel│
│ 🎨 Desain Antarmuka         │ Apple Human Interface Guidelines (Cupertino) │
│ 🎵 Audio DSP & Lip-Sync      │ Web Audio API (AudioContext Analyser FFT)    │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### Rincian Pemanfaatan Teknologi:
1. **Google Gemini LLM API (`gemini-3.5-flash-lite`):**
   Model AI Google Cloud native berlatensi ultra-rendah (<800ms) dengan efisiensi token ekstrem ($0.30 per 1M input tokens). Digunakan untuk pemahaman semantik formulir, penjelasan cerdas per kolom, chatbot interaktif, dan terjemahan halaman sadar konteks.
2. **Google Cloud TTS WaveNet:**
   Menyediakan sintesis suara berkualitas tinggi dengan intonasi natural untuk membacakan panduan formulir dan sapaan maskot avatar.
3. **Firebase Firestore:**
   Database NoSQL cloud berkecepatan tinggi untuk menyimpan profil pengguna, riwayat sesi formulir, dan basis data glosarium istilah birokrasi terverifikasi.
4. **Firebase Storage:**
   Menyimpan aset gambar profil pengguna yang telah dioptimasi secara otomatis ke format WebP.
5. **Firebase Hosting & Cloud Run:**
   Menjalankan web platform `telmy.id` (Landing Page, Privacy Policy, User Dashboard, dan Simulator Form) serta backend gateway API Express.js.
6. **Chrome Extension (Manifest V3):**
   Memanfaatkan `chrome.sidePanel` native, `chrome.storage.local`, dan `chrome.activeTab` yang ringan, aman, dan tanpa konsumsi memori berlebih saat tidak digunakan.

---

## 📂 5. Struktur Direktori Proyek

```text
telmy/
├── logo.png                     # Logo utama Telmy.ai
├── telmy_icon.png               # Ikon maskot robot Telmy
├── telmy_text.png               # Logotype teks Telmy.ai
├── telmy-cws-clean.zip          # Paket ZIP bersih siap submit ke Chrome Web Store
├── plan.md                      # Lembar kerja roadmap & checklist kepatuhan
├── PRD_ AI Form Explainer.md    # Product Requirement Document (PRD)
├── README.md                    # Dokumentasi lengkap proyek (berkas ini)
│
├── extension/                   # Ekstensi Chrome Manifest V3
│   ├── manifest.json            # Konfigurasi MV3 (Least Privilege, 0 host_permissions)
│   ├── background/
│   │   └── service-worker.js    # Background service worker & sinkronisasi tab
│   ├── content/
│   │   ├── content-main.js      # Inisialisasi pemindai halaman & listener
│   │   ├── scanner.js           # DOM scanner (dengan proteksi ketat kolom sensitif)
│   │   ├── highlighter.js       # Injeksi badge nomor & sorotan visual
│   │   ├── translator.js        # Engine penggantian teks DOM in-place & restore
│   │   └── overlay.css          # Desain badge numerik dan outline spotlight
│   ├── sidepanel/
│   │   ├── sidepanel.html       # Antarmuka panel samping (Apple Cupertino style)
│   │   ├── sidepanel.css        # Desain frosted glass, segmented tabs, iMessage bubble
│   │   ├── sidepanel.js         # Orkestrator chat, form stepper, dan i18n
│   │   └── avatar-controller.js # Lip-sync Web Audio API FFT & kontrol viseme SVG
│   └── assets/
│       ├── icons/               # Ikon standar CWS (16x16, 32x32, 48x48, 128x128 px)
│       └── telmy-avatar.svg     # Master Vector SVG Talking Mascot (5 layer viseme)
│
├── backend/                     # Layanan Backend API (Google AI & Firebase)
│   ├── src/
│   │   ├── index.js             # Express API entry point & routing web static
│   │   ├── config/              # Inisialisasi Firebase Admin SDK & Storage
│   │   ├── routes/              # /api/explain, /api/chat, /api/translate-page, /api/user
│   │   └── services/            # geminiService.js, voiceService.js, translateService.js
│   ├── public/                  # Web Platform Telmy (Firebase Hosting)
│   │   ├── index.html           # Landing page multibahasa
│   │   ├── dashboard.html       # Apple-style Cupertino User Dashboard
│   │   ├── connect.html         # Google 1-Click login & connection bridge
│   │   ├── demo.html            # Simulator arena uji coba interaktif
│   │   └── privacy.html         # Dokumen Kebijakan Privasi resmi CWS
│   └── package.json             # Dependensi backend Node.js
│
└── test-page/
    └── demo_apostille.html      # Halaman pengujian autentik Portal Apostille Kemenkumham
```

---

## 🚀 6. Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat Sistem
* **Node.js**: Versi `20.0.0` atau lebih baru
* **Browser**: Google Chrome versi `114+` (Mendukung Chrome Native Side Panel)
* **Kunci API**: Google Gemini API Key dari [Google AI Studio](https://aistudio.google.com/)

---

### Langkah 1: Menjalankan Backend Gateway
1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Buat atau periksa berkas `.env` di dalam folder `backend/`:
   ```env
   PORT=8080
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   GEMINI_MODEL=gemini-3.5-flash-lite
   GOOGLE_TTS_API_KEY=AIzaSyYourGeminiApiKeyHere
   ```
3. Jalankan server backend:
   ```bash
   npm run dev
   # Atau: node src/index.js
   ```
4. Verifikasi bahwa server telah berjalan dengan baik di browser:
   * **Dashboard Pengguna:** `http://localhost:8080/dashboard`
   * **Health Check API:** `http://localhost:8080/health`
   * **Landing Page:** `http://localhost:8080/`

---

### Langkah 2: Memasang Ekstensi di Google Chrome
1. Buka browser Google Chrome dan buka alamat:
   ```text
   chrome://extensions/
   ```
2. Aktifkan **Developer mode** melalui sakelar di pojok kanan atas.
3. Klik tombol **Load unpacked** di pojok kiri atas.
4. Pilih folder **`extension`** dari repositori ini (atau ekstrak berkas `telmy-cws-clean.zip`).
5. Ekstensi **Telmy.ai: Form Filling Assistant** akan langsung muncul di bilah alat (*toolbar*) Chrome Anda.

---

### Langkah 3: Menggunakan Telmy.ai di Formulir Web
1. Buka halaman simulasi formulir pengujian di browser:
   * Akses URL lokal: `http://localhost:8080/demo`
   * Atau buka file langsung: [`test-page/demo_apostille.html`](file:///d:/webdev/laragon/www/telmy/test-page/demo_apostille.html)
2. Buka panel samping Telmy dengan menekan shortcut **`Alt + G`** atau mengklik ikon Telmy di toolbar Chrome.
3. **Eksplorasi Fitur:**
   * **Lencana Nomor:** Klik salah satu badge nomor di samping kolom formulir. Telmy akan langsung menampilkan panduan terperinci, contoh isian realistis, dan membacakannya lewat suara.
   * **Talking Avatar:** Perhatikan mulut robot Telmy yang bergerak secara alami mengikuti ketukan frekuensi suara penjelasan.
   * **Translate Page:** Klik tombol *"Translate Page"* di banner atas Side Panel untuk menerjemahkan seluruh halaman formulir ke bahasa pilihan Anda (misalnya English, 日本語, atau 한국어) tanpa merusak singkatan penting.
   * **Chat Interaktif:** Tanyakan pertanyaan apa pun terkait formulir melalui kolom chat atau tekan tombol mic (*Push-to-Talk*).
   * **User Dashboard:** Buka `http://localhost:8080/dashboard` untuk mengatur bahasa utama, mengunggah foto profil, dan menyinkronkannya kembali ke ekstensi dengan 1 klik.

---

## 🛡️ 7. Kepatuhan Kebijakan Chrome Web Store (CWS Ready)

Telmy.ai dirancang dengan mematuhi prinsip **Least Privilege** dan pedoman peninjauan otomatis Chrome Web Store 2026:

| Parameter Evaluasi | Implementasi Telmy.ai | Manfaat untuk Review CWS |
| :--- | :--- | :--- |
| **Hak Akses Host** | **0 `host_permissions`** (Dikosongkan total) | Mencegah bot CWS menandai ekstensi sebagai *High Risk* |
| **Izin Ekstensi** | `activeTab`, `scripting`, `storage`, `sidePanel` | Izin minimal, hanya aktif saat tab dibuka pengguna |
| **Perlindungan Data** | Mengecualikan sandi, kartu kredit, CVV, OTP | Memenuhi standar kepatuhan privasi data pemakai |
| **Penyimpanan Lokal** | 100% berkas JS, CSS, dan aset visual lokal | Lolos uji larangan *Remote Code Execution* |
| **Format Berkas Unggah** | [`telmy-cws-clean.zip`](file:///d:/webdev/laragon/www/telmy/telmy-cws-clean.zip) (2.12 MB) | `manifest.json` terletak di root ZIP tanpa berkas temporary |

---

## 🌐 8. Dukungan 11 Bahasa Kawasan Asia Pasifik (JAPAC)

Telmy.ai mendukung antarmuka dan pemahaman konteks lintas negara:
* 🇬🇧 **English (Global Default)**
* 🇮🇩 **Bahasa Indonesia**
* 🇯🇵 **日本語 (Japanese)**
* 🇰🇷 **한국어 (Korean)**
* 🇨🇳 **简体中文 (Simplified Chinese)**
* 🇹🇼 **繁體中文 (Traditional Chinese)**
* 🇻🇳 **Tiếng Việt (Vietnamese)**
* 🇹🇭 **ไทย (Thai)**
* 🇮🇳 **हिन्दी (Hindi)**
* 🇵🇭 **Filipino**
* 🇲🇾 **Bahasa Melayu**

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **Telmy.ai Team**.  
Dikembangkan untuk **Google AI Hackathon 2026**. Seluruh hak cipta dilindungi undang-undang.
