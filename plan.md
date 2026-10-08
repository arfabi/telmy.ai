# Implementation Plan: Telmy.ai (Google Hackathon & Chrome Web Store Roadmap)
> **Dokumen Strategi, Rencana Prioritas Kerja & Pelacak Kemajuan**  
> **Target Kompetisi:** Google AI Hackathon (Kepatuhan 100% Ekosistem Google)  
> **Target Rilis:** Chrome Web Store (Jalur Kilat < 10 Hari) & Live Prototype Firebase (`telmy.id` / `telmyai.com`)  
> **Terakhir Diperbarui:** 7 Oktober 2026  

---

## 🎯 Ringkasan Eksekutif & Kepatuhan Arsitektur

1. **Stack Resmi Firebase (Google Cloud Native):**
   * **Firebase Hosting:** Menyajikan Landing Page, Kebijakan Privasi, Demo, dan Download dari folder `/backend/public` via Global CDN + SSL otomatis di `telmy.id`.
   * **Firebase Functions (2nd Gen):** Backend API serverless Express.js di region `asia-southeast2` (Jakarta) dengan kuota gratis 2 juta request/bulan.
   * **Cloud Firestore:** Database penyimpanan kamus istilah resmi birokrasi, prompt cache, dan umpan balik pengguna.
   * **Firebase Storage:** Object storage penyimpanan foto profil pengguna (5 GB free tier, kompresi otomatis WebP).
   * **Firebase Authentication:** Login 1-klik dengan Google Sign-In & Email/Password.
2. **API Eksternal (Google AI & Voice Engine):**
   * **Gemini 3.5 Flash-Lite:** Model Gemini **paling murah & efisien** ($0.30 input / $2.50 output per 1M token) untuk analisis form instan dan chat co-pilot dengan latensi kilat (<800ms).
   * **Google Cloud TTS (WaveNet):** Sintesis suara berkualitas tinggi dengan jatah **Free Tier 4.000.000 (4 Juta) Karakter/Bulan GRATIS** yang mencakup 11 bahasa area JAPAC.
   * **Estimasi Biaya Operasional (< 50 Pengguna/Hari):** Hanya **~$0.30 – $1.20 / bulan** (~Rp 5.000 – Rp 20.000 / bulan), karena TTS, Functions, Storage, Firestore, dan Hosting 100% berada dalam kuota gratis.
3. **Strategi Dual-Build Ekstensi:**
   * **Build Lite (Chrome Web Store):** Izin minimal (`activeTab`, `scripting`, `sidePanel`, `storage`), host permission sempit ke domain sendiri, tanpa otomasi klik berbahaya, submit di Hari ke-4 dengan mode *Unlisted*.
   * **Build Full (Hackathon Demo & Juri):** Disediakan via file `.zip` (Load Unpacked) di `telmy.id/download` dan didemokan di video 3 menit jika review CWS belum selesai pada hari H.

---

## 🏆 Matriks Prioritas Kerja (Urutan Eksekusi Baru)

```
[Prioritas 1: Aktivasi On-Demand & Onboarding] ──► [Prioritas 2: Interactive Talking Avatar]
                       │                                                    │
                       ▼                                                    ▼
[Prioritas 3: Translate Full Page (Feature)]  ──► [Prioritas 4: Domain Glossary & Dashboard]
                       │                                                    │
                       ▼                                                    ▼
[Prioritas 5: Final Packaging CWS & Submit]   ──► [Prioritas 6: Materi Hackathon & Demo]
```

---

### 🥇 PRIORITAS 1: Perbaikan Lifecycle Aktivasi (On-Demand Only) & Onboarding Ekstensi
*Target: Ekstensi HANYA aktif saat sengaja dibuka oleh pengguna (bebas dari floating liar di background) dan memiliki layar penyambutan (onboarding).*

- [x] **1.1. Perilaku Aktivasi On-Demand (Bebas Floating Liar):**
  - **Prinsip Utama:** Ekstensi HANYA aktif ketika ikon ekstensi di toolbar diklik (atau shortcut `Alt + G`).
  - Hapus/cegah skrip content menyuntikkan badge atau floating bar secara otomatis saat halaman baru dibuka.
  - Saat mode NONAKTIF (user klik tombol [X] / Close di side panel atau klik ikon ekstensi lagi):
    * Hapus semua badge penomoran di DOM.
    * Nonaktifkan MutationObserver halaman.
    * Bersihkan seluruh visual overlay.
  - Saat mode AKTIF: Buka side panel secara eksklusif dan mulai pemindaian formulir.
- [x] **1.2. Onboarding Flow Saat Pertama Kali Install:**
  - Layar sambutan (*Welcome Wizard*) yang muncul pertama kali side panel dibuka setelah instalasi.
  - Memandu pengguna untuk:
    1. Memilih bahasa utama preferensi bawaan (English default atau salah satu dari 11 bahasa JAPAC).
    2. Login / Daftar akun melalui **Firebase Authentication** (Google 1-Click Sign-In atau Email).
    3. Memuat data profil secara otomatis: Nama, Email, Foto Profil (dari Firebase Storage / Google Auth), dan status *"Connected"*.
  - Tombol *"Mulai Jelajah Form"* untuk menyelesaikan onboarding.

---

### 🥈 PRIORITAS 2: Interactive Talking Avatar Companion (Master SVG + WaveNet Lip-Sync)
*Target: Menghadirkan asisten visual beranimasi mulut natural yang tersinkronisasi audio TTS secara real-time.*

- [ ] **2.1. Master SVG Asset & Viseme Layer Architecture:**
  - 1 File Master SVG murni (ringan, performa tinggi, scalable) dengan layer/group terpisah:
    * `<g id="mouth-idle">` : Mulut tertutup santai (saat hening/jeda).
    * `<g id="mouth-aei">` : Terbuka lebar (vokal A, E, I / amplitudo tinggi).
    * `<g id="mouth-ou">` : Membulat ke depan (vokal O, U / amplitudo menengah).
    * `<g id="mouth-mbp">` : Terkatup rapat (konsonan M, B, P).
    * `<g id="mouth-fv">` : Sedikit terbuka ke bibir bawah (konsonan F, V).
    * `<g id="eyes-blink">` : Kedipan mata independen dengan timer acak (tiap 3–6 detik).
- [ ] **2.2. Audio-Driven Lip-Sync via Web Audio API:**
  - Menerima audio stream MP3 dari endpoint Google Cloud TTS WaveNet.
  - Menggunakan `AudioContext` dan `AnalyserNode` (FFT) di frontend untuk membaca data frekuensi & amplitudo audio per frame (`requestAnimationFrame`).
  - Memetakan amplitudo langsung ke viseme layer SVG secara dinamis dan mulus.
- [ ] **2.3. Avatar State Machine & Tampilan UX:**
  - Tiga Status Avatar:
    * **Idle:** Ekspresi ramah netral, mata berkedip santai.
    * **Thinking:** Gestur berpikir + gelembung pemrosesan (*loading bubble*) saat Gemini memproses respons.
    * **Speaking:** Animasi viseme mulut aktif mengikuti audio WaveNet.
  - Mode Tampilan:
    * **Active Mode:** Menampilkan avatar interaktif secara utuh di header Side Panel atau companion widget.
    * **Compact Mode:** Mode hemat ruang berupa micro-avatar / indikator waveform animasi.

---

### 🥉 PRIORITAS 3: Fitur Ekstra "Context-Aware Full Page Translation" di Chatbot
*Target: Melengkapi kemampuan core Form Explainer dengan fitur terjemahan halaman utuh berbasis konteks UI/UX profesional.*

- [ ] **3.1. Penegasan Core vs Fitur Tambahan:**
  - **Fungsi Utama Tetap:** AI Form Explainer per kolom (deteksi field, panduan step-by-step, contoh isian fiktif realistis, tips untuk WNA).
  - **Fitur Tambahan di Chatbot:** Terdapat tombol/penawaran aksi *"Translate Full Page (Context-Aware)"*.
- [ ] **3.2. Efficient DOM Batch Extraction & JSON Payload:**
  - Mengumpulkan seluruh teks label UI, navigasi, dan tombol ke dalam 1 struktur JSON ringkas (*key-value pairs*) untuk efisiensi token ekstrem.
- [ ] **3.3. Hierarki Prompt Engineering Gemini (Context & UI/UX Preservation):**
  - Mengirim prompt dengan 4 lapis aturan ke `gemini-3.5-flash-lite`:
    1. *Context Statement:* Analisis domain dan topik utama halaman.
    2. *Glossary Rules Injection:* Terapkan kata `DO_NOT_TRANSLATE` dan `FORCE_TRANSLATE`.
    3. *UI/UX Standard Enforcement:* Pastikan elemen tombol/navigasi diterjemahkan sesuai standar industri (*"Daftar"* $\rightarrow$ *"Sign Up"*, bukan *"List"*).
    4. *Structured Output:* Mengembalikan JSON berpasangan untuk penggantian teks DOM langsung di halaman secara mulus.

---

### 🎖️ PRIORITAS 4: Domain-Based Glossary System (Firestore & Role Management)
*Target: Database glosarium per domain untuk mencegah kesalahan istilah birokrasi baku.*

- [ ] **4.1. Skema Dokumen Firestore `glossaries/{domain}`:**
  - `domain`: Nama domain web target (misal: `layanan.kemenkumham.go.id`).
  - `glossary_items`: Array aturan istilah (`term`, `action`: `DO_NOT_TRANSLATE` | `FORCE_TRANSLATE`, `target_term`).
  - `user_suggestions`: Array masukan istilah dari pengguna (`user_id`, `suggested_term`, `status`: `PENDING`).
- [ ] **4.2. Pengelolaan Hak Akses (Role Management):**
  - **Admin:** Verifikasi & pengesahan istilah glosarium resmi dari dashboard.
  - **User:** Tombol *"Ajukan Glosarium"* langsung dari panel ekstensi saat menemukan istilah lokal/khusus.

---

### 🏅 PRIORITAS 5: User Dashboard & Firebase Web Platform
*Target: Web platform terintegrasi di `telmy.id` dengan akun pengguna dan manajemen aset.*

- [ ] **5.1. Firebase Authentication & Storage:**
  - Login 1-klik dengan Google Sign-In & Email.
  - Upload & kompresi foto profil pengguna ke Firebase Storage.
- [ ] **5.2. Web Dashboard (`/dashboard`):**
  - Mengelola preferensi bahasa bawaan, riwayat form, dan daftar glosarium yang disarankan.
  - Tombol *"Connect to Extension"* via `externally_connectable`.

---

### 🏁 PRIORITAS 6: Final Packaging & Submission (Chrome Web Store & Hackathon)
*Target: Lolos review Chrome Web Store dan materi presentasi juri lengkap.*

- [ ] **6.1. Pembersihan Manifest V3 (Minimal Permissions):**
  - Hanya menggunakan `["storage", "activeTab", "scripting", "sidePanel"]`.
  - Hapus file mock, konsolidasi resource.
- [ ] **6.2. Video Demonstrasi (3 Menit) & Pitch Deck:**
  - Menampilkan live form explaining, talking avatar SVG audio-driven, dan translate full page context-aware.

---

## 📅 Jadwal Pelaksanaan (Timeline 10 Hari Menuju Submission)

| Hari | Fokus Utama | Target Luaran |
| :---: | :--- | :--- |
| **Hari 1** | Perbaikan Lifecycle Aktivasi (On-Demand Only, No Floating Liar) | Ekstensi bersih, hanya aktif saat ikon diklik |
| **Hari 2** | Onboarding Flow Ekstensi + Firebase Auth (Login, Profil & Connect) | Welcome wizard, Google login, load avatar foto & bahasa |
| **Hari 3** | Rancang Master SVG Talking Avatar + Layer Viseme Mulut | File SVG ringan dengan kontrol layer viseme & kedip |
| **Hari 4** | Web Audio API Lip-Sync (Sinkronisasi Audio WaveNet TTS Real-time) | Mulut avatar bergerak natural mengikuti frekuensi suara |
| **Hari 5** | Fitur Tambahan di Chatbot: "Translate Full Page (Context-Aware)" | Batch JSON payload ke Gemini 3.5 Flash-Lite & DOM swap |
| **Hari 6** | Domain-Based Glossary System di Firestore + Saran Pengguna | Koleksi Firestore `glossaries/{domain}` & role admin/user |
| **Hari 7** | Deploy Firebase Platform (Hosting Landing Page, Functions, Storage) | `telmy.id` aktif online dengan SSL dan backend API |
| **Hari 8** | **SUBMIT KE CHROME WEB STORE (UNLISTED)** | Paket Manifest V3 Lite masuk antrean review Google |
| **Hari 9** | Perekaman Video Demo 3 Menit & Pitch Deck Presentasi | Video MP4 siap tayang & slide PDF kriteria juri siap |
| **Hari 10** | **FINAL SUBMISSION HACKATHON** | Submit link live Firebase, CWS/ZIP, video, dan pitch deck |

---

## 📝 Catatan Teknis & Parameter Konfigurasi
 
 ### Model Gemini & Suara
 * **Chat / Form Explainer:** `gemini-3.5-flash-lite` (Paling hemat biaya & latency terendah)
   * Input: $0.30 per 1M token
   * Output: $2.50 per 1M token
 * **Text-to-Speech:** `Google Cloud TTS (WaveNet)`
   * Kuota Gratis: 4.000.000 karakter / bulan GRATIS
   * Tarif overage: $4.00 per 1M karakter
   * Voice Engine Fallback: Web Speech API Browser (Client-side 100% Free)
 
 ### Layanan Firebase
 * **Hosting:** Firebase Hosting (`backend/public/`)
 * **Backend API:** Firebase Functions 2nd Gen (Express.js wrapper, region `asia-southeast2`)
 * **Database:** Cloud Firestore (`asia-southeast2`)
 * **Object Storage:** Firebase Storage (Foto profil & attachment)
 * **Auth:** Firebase Authentication (Google 1-Click + Email/Password)
 
 ### Domain & Endpoints
 * **Website:** `https://telmy.id` atau `https://telmyai.com`
 * **API Gateway:** Firebase Functions HTTPS endpoint (`/api/**`)
 * **Privacy Policy URL:** `https://telmy.id/privacy`
 * **Live Demo URL:** `https://telmy.id/demo`
