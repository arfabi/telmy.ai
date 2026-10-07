# Implementation Plan: Telmy.ai (Google Hackathon & Chrome Web Store Roadmap)
> **Dokumen Strategi, Rencana Prioritas Kerja & Pelacak Kemajuan**  
> **Target Kompetisi:** Google AI Hackathon (Kepatuhan 100% Ekosistem Google)  
> **Target Rilis:** Chrome Web Store (Jalur Kilat < 10 Hari) & Live Prototype Firebase (`telmy.id` / `telmyai.com`)  
> **Terakhir Diperbarui:** 7 Oktober 2026  

---

## 🎯 Ringkasan Eksekutif & Kepatuhan Aturan Hackathon

1. **100% Google AI Native (Menghindari Diskualifikasi):**
   * **LLM Engine:** 100% Google Gemini (Gemini 1.5 / 2.0 Flash) untuk form scanning, penalaran field, kamus cerdas, dan Copilot Chat. Tidak menggunakan GLM atau pihak ketiga lain.
   * **Voice TTS Pipeline:** Migrasi penuh dari ElevenLabs ke **Gemini Flash-Lite TTS (Pratinjau)** / Google Cloud TTS.
     * *SKU Input Teks:* `6D6B-51EE-87C4` ($0,50 / 1 juta token)
     * *SKU Output Audio:* `676E-5101-0A30` ($6,00 / 1 juta token audio)
     * *Fallback Klien:* Native Browser SpeechSynthesis (Web Speech API).
2. **Infrastruktur Produksi:**
   * **Hosting & Backend:** Firebase Hosting + Cloud Run / Firebase Functions + Firestore.
   * **Domain Produksi:** `telmy.id` (primer) atau `telmyai.com`.
3. **Strategi Dual-Build Ekstensi:**
   * **Build Lite (Chrome Web Store):** Izin minimal (`activeTab`, `scripting`, `sidePanel`, `storage`), host permission sempit ke domain sendiri, tanpa otomasi klik berbahaya, submit di Hari ke-4 dengan mode *Unlisted*.
   * **Build Full (Hackathon Demo & Juri):** Disediakan via file `.zip` (Load Unpacked) di `telmy.id/download` dan didemokan di video 3 menit jika review CWS belum selesai pada hari H.

---

## 🏆 Matriks Prioritas Kerja (Urutan Eksekusi)

```
[Prioritas 1: Web MVP Firebase] ───► [Prioritas 2: Dashboard & Auth Connect]
               │                                       │
               ▼                                       ▼
[Prioritas 3: Ekstensi Lite & CWS] ──► [Prioritas 4: Materi Submission Hackathon]
```

---

### 🥇 PRIORITAS 1: Web MVP Live di Firebase (`telmy.id` / `telmyai.com`)
*Target: Aplikasi web aktif, dapat diakses juri/publik, memiliki landing page memukau, playground form interaktif, dan privacy policy resmi.*

- [ ] **1.1. Inisialisasi & Setup Firebase Project:**
  - Setup Firebase Hosting & Firestore di region terdekat (misal `asia-southeast2` / Jakarta).
  - Hubungkan domain kustom `telmy.id` / `telmyai.com`.
- [ ] **1.2. Landing Page Modern & Konversi Tinggi:**
  - Hero section dengan value proposition jelas: *"Your AI Form Guide for Public & Web Forms"*.
  - Video Demo Embed (frame mockup video 3 menit).
  - Penjelasan 4 Pilar Fitur (Visual Highlight, Suara Interaktif Gemini, Panduan Kontekstual, Multi-bahasa).
  - Bagian "Sebelum vs Sesudah" untuk skor *Problem Alignment & Impact* (pengurangan waktu pengisian dari 25 menit menjadi 5 menit).
- [ ] **1.3. Live Demo Playground Terintegrasi (`/demo`):**
  - Halaman formulir simulasi (e.g., Simulasi Apostille / Paspor / Layanan Publik) langsung di website agar juri bisa mencoba ekstensi dalam 1 kali klik tanpa perlu mencari form eksternal.
- [ ] **1.4. Halaman Panduan Unduh & Instalasi (`/install` atau `/download`):**
  - Tombol langsung ke tautan Chrome Web Store (jika sudah submit/live).
  - Tombol download file `.zip` versi pra-rilis + panduan 3 langkah *Load Unpacked* untuk juri hackathon.
- [ ] **1.5. Halaman Kebijakan Privasi (`/privacy`):**
  - Syarat mutlak Chrome Web Store & Google Hackathon: menegaskan data isian pengguna (NIK, paspor, dsb.) **tidak disimpan**, hanya metadata struktur formulir yang diproses.

---

### 🥈 PRIORITAS 2: User Dashboard & Extension Connect Flow
*Target: Pengguna bisa login dengan Google, membatasi rate limit API, dan menghubungkan ekstensi secara mulus.*

- [ ] **2.1. Firebase Authentication (Google 1-Click Login):**
  - Login dengan akun Google di `telmy.id` tanpa ribet form pendaftaran manual.
- [ ] **2.2. User Dashboard Sederhana (`/dashboard`):**
  - Statistik pemakaian pengguna (jumlah field yang dipandu, form yang diselesaikan).
  - Pengaturan profil bahasa default (ID, EN, ZH, JA, KO).
  - Riwayat saran / feedback yang pernah dikirimkan ke kamus.
- [ ] **2.3. Extension Connect Seamless (via `externally_connectable`):**
  - Tombol *"Hubungkan ke Ekstensi"* di dashboard.
  - Web mengirimkan token/session ke ekstensi via `chrome.runtime.sendMessage(extensionId, ...)` tanpa perlu meminta izin berat `identity` di ekstensi.

---

### 🥉 PRIORITAS 3: Ekstensi Chrome Build "Lite" & Submit Web Store
*Target: Ekstensi bersih, bebas dari izin berbahaya, migrasi ke Chrome Side Panel API, dan disubmit ke CWS pada Hari ke-4.*

- [ ] **3.1. Migrasi ke Gemini Flash-Lite TTS (Audio Pipeline):**
  - Buat gateway TTS di backend `/api/voice/tts` menggunakan Gemini Flash-Lite TTS / Google Cloud TTS.
  - Gantikan integrasi ElevenLabs agar dependensi 100% menggunakan teknologi Google.
- [ ] **3.2. Migrasi ke Chrome Native Side Panel (`chrome.sidePanel`):**
  - Gantikan inject container DOM overlay `panel.js` dengan file native `sidepanel/sidepanel.html`.
  - Halaman otomatis menyusut (*responsive push*) tanpa merusak CSS situs web target.
  - Izin mikrofon (STT) berjalan di origin ekstensi sendiri, tidak lagi bentrok dengan CSP situs target.
- [ ] **3.3. Pembersihan Manifest V3 (Minimal Permission Policy):**
  - Hapus `<all_urls>` dan *content script* permanen.
  - Gunakan `activeTab` + `scripting` (skrip scanner disuntikkan secara on-demand saat user menekan ikon Telmy atau shortcut `Alt+G`).
  - Permissions: `["storage", "activeTab", "scripting", "sidePanel"]`.
  - Host permissions: `["https://api.telmy.id/*", "https://telmyai.com/*"]`.
  - Hapus folder `mock/` dari bundling produksi.
- [ ] **3.4. Tahan Fitur Berisiko untuk CWS v1 (Privasi & Kecepatan Review):**
  - **Sistem Suara: Murni Push-to-Talk (Klik Ikon Mikrofon):** Hapus/tunda fitur wake-word atau mikrofon *always-listening*. Mikrofon hanya aktif saat pengguna menekan tombol mikrofon di side panel (mengeliminasi risiko privasi berat dan penolakan reviewer).
  - Tahan fitur otomatisasi klik formulir (*auto-click*) dan isi otomatis (*auto-fill*) ke website pihak ketiga.
  - Pertahankan visual highlight ring, badge angka, auto-scroll, dan asisten suara/chat.
- [ ] **3.5. Pengajuan ke Chrome Web Store (Hari ke-4):**
  - Siapkan aset listing: Ikon 128px, Screenshot 1280x800, Promo Tile, deskripsi *Single Purpose*: *"AI Form Guide: Understand any web form in your own language"*.
  - Masukkan kredensial akun uji untuk tim reviewer Google.
  - Pilih visibilitas **Unlisted** (atau Public) agar proses review lebih cepat.

---

### 🏅 PRIORITAS 4: Materi Submission Hackathon (Safety Net & Penilaian Juri)
*Target: Semua syarat penilaian Google Hackathon (Technical Merit 40%, Problem Alignment 25%, Execution 20%, Innovation 15%) terpenuhi maksimal.*

- [ ] **4.1. Video Demonstrasi (Maksimal 3 Menit):**
  - *Detik 0 - 45:* Masalah riil warga/WNA kesulitan mengisi portal rumit pemerintah (Apostille/Imigrasi/Pajak).
  - *Detik 45 - 120:* Live demo Telmy.ai: deteksi otomatis form, highlight visual dengan nomor badge, interaksi suara Gemini Flash-Lite TTS, dan Copilot Chat di Side Panel.
  - *Detik 120 - 180:* Arsitektur teknologi Google (Gemini, Firebase), dashboard dampak sosial, dan penutup.
- [ ] **4.2. Pitch Deck & Presentasi (Slide PDF):**
  - Latar belakang masalah, arsitektur Google Cloud & Firebase, analisis dampak aksesibilitas, dan roadmap masa depan.
- [ ] **4.3. Repositori & Dokumentasi Terbuka:**
  - README informatif dengan diagram arsitektur.
  - Panduan instalasi manual (*Load Unpacked ZIP*) beserta tautan live demo di `telmy.id`.

---

## 📅 Jadwal Pelaksanaan (Timeline 10 Hari Menuju Submission)

| Hari | Fokus Utama | Target Luaran |
| :---: | :--- | :--- |
| **Hari 1** | Migrasi Voice ke Gemini Flash-Lite TTS + Rancang Side Panel | Backend suara Google siap & struktur `sidepanel/` terbentuk |
| **Hari 2** | Bersihkan Manifest V3 (Lite) & Injeksi On-Demand | Ekstensi Lite bebas dari `<all_urls>`, lolos uji lokal |
| **Hari 3** | Persiapan Aset Chrome Web Store & Akun Developer | Screenshot 1280x800, deskripsi single purpose, akun CWS |
| **Hari 4** | **SUBMIT KE CHROME WEB STORE (UNLISTED)** | Ekstensi masuk antrean review CWS |
| **Hari 5** | Deploy Firebase MVP: Landing Page & Live Demo | `telmy.id` / `telmyai.com` aktif online dengan SSL |
| **Hari 6** | Firebase Auth (Google Login) + Dashboard Pengguna | Alur connect web dashboard ke ekstensi selesai |
| **Hari 7** | Pembuatan Avatar Ringan SVG + Polish UI | Visual side panel lebih hidup & interaktif |
| **Hari 8** | Perekaman Video Demo 3 Menit & Editing | Video MP4 siap upload YouTube (Unlisted) |
| **Hari 9** | Pembuatan Pitch Deck / Slide Presentasi | PDF slide selesai sesuai kriteria penilaian juri |
| **Hari 10** | **FINAL SUBMISSION HACKATHON** | Submit form lomba: link Firebase live, video, deck, & zip/CWS |

---

## 📝 Catatan Teknis & Parameter Konfigurasi

### Model Gemini & Suara
* **Chat / Form Explainer:** `gemini-1.5-flash` / `gemini-2.0-flash`
* **Text-to-Speech:** `Gemini 3.8 Flash-Lite TTS (Preview)`
  * Input SKU: `6D6B-51EE-87C4` ($0.50 / 1M token)
  * Audio Output SKU: `676E-5101-0A30` ($6.00 / 1M token audio)
  * Voice Engine Fallback: Web Speech API Browser

### Domain & Endpoints
* **Website:** `https://telmy.id` atau `https://telmyai.com`
* **API Gateway:** `https://api.telmy.id` atau Firebase Cloud Functions
* **Privacy Policy URL:** `https://telmy.id/privacy`
* **Live Demo URL:** `https://telmy.id/demo`
