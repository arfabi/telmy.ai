# 🌐 Telmy.ai: Your AI form-filling assistant

> **Telmy.ai** adalah asisten cerdas (*your AI form-filling assistant*) berbasis Chrome Extension (Manifest V3) dan Backend AI yang memandu masyarakat umum maupun warga negara asing (WNA) dalam memahami dan mengisi formulir pelayanan publik, portal administrasi pemerintah, perizinan, hingga Google Forms secara mudah, aman, dan multibahasa.

---

## 🌟 Fitur Unggulan

### 1. 🧭 Side Panel Assistant (Tampilan Panel Samping 380px)
- Tersemat rapi di sisi kanan layar browser tanpa menutupi kolom isian formulir.
- **Ringkasan Formulir:** Menampilkan nama layanan/formulir, tujuan, serta daftar dokumen persyaratan yang perlu disiapkan sebelum mengisi.
- **Pelacak Kemajuan (Progress Tracker):** Menghitung persentase kolom yang telah terisi secara real-time.
- **Stepper Navigasi:** Tombol *Sebelumnya* dan *Berikutnya* untuk memandu pengisian formulir langkah demi langkah.
- **Mode Ringkas:** Dapat diminimalkan ke pill *Telmy.ai* di pojok kanan bawah atau dibuka/tutup menggunakan shortcut **`Alt + G`**.

### 2. ⚡ Dukungan Penuh Google Forms & Layout Modern
- **Deteksi Label di Atas Input:** Menganalisis judul pertanyaan yang terletak di atas bidang isian (Google Forms `.M7eMe`, `[role="heading"]`, `aria-labelledby`, dan kontainer card).
- **Mendukung Pilihan Ganda (Radio Group) & Kotak Centang:** Mampu memindai `div[role="radiogroup"]` (seperti *Jenjang Pendidikan: D3, S1, S2*) serta mengekstrak daftar opsi untuk dijelaskan oleh AI.
- **Badge Nomor Interaktif:** Menempelkan nomor urut yang rapi di samping judul pertanyaan dan langsung mengarahkan instruksi saat diklik.

### 3. 🌐 Dukungan Penuh 5 Bahasa (Multilingual)
Tersedia pengalihan bahasa instan langsung dari header panel tanpa mencampuradukkan bahasa:
- 🇮🇩 **Bahasa Indonesia (ID)**
- 🇬🇧 **English (EN)**
- 🇨🇳 **中文 (ZH - Mandarin)**
- 🇯🇵 **日本語 (JA - Japanese)**
- 🇰🇷 **한국어 (KO - Korean)**

### 4. 🤖 Mesin AI Ganda (GLM-5.3-Flash & Google Gemini)
- **OpenAI-Compatible Endpoint:** Terhubung ke model penalaran mutakhir **GLM-5.3-Flash** (via endpoint Sumopod) untuk memberikan penjelasan kontekstual, contoh isian fiktif yang realistis, peringatan kesalahan umum (*common mistakes*), dan tips khusus bagi pemegang paspor internasional (*tips for foreigners*).
- **Google Gemini Fallback:** Cadangan otomatis menggunakan Gemini 1.5/2.5 Flash apabila koneksi utama terkendala.
- **Mode `AI_FIRST` & `DB_FIRST`:** Konfigurasi strategi fleksibel via `.env`:
  - `AI_FIRST`: 100% penjelasan dihasilkan segar oleh AI penalaran.
  - `DB_FIRST`: Memprioritaskan kamus resmi terverifikasi dari database Firebase Firestore terlebih dahulu.

### 5. 🔒 Privasi Terjamin (Privacy-First)
- Telmy **hanya membaca metadata kolom** (label pertanyaan, tipe input, placeholder, dan opsi pilihan).
- Telmy **tidak pernah membaca atau mengirim teks sensitif/pribadi** yang sedang diketik pengguna ke server.
- Otomatis mengabaikan kolom keamanan, captcha, token CSRF, dan bot verifier.

---

## 📁 Struktur Direktori

```text
guidemeto/ (Telmy)
├── extension/                  # Ekstensi Chrome Manifest V3
│   ├── manifest.json           # Konfigurasi ekstensi Telmy
│   ├── background/
│   │   └── service-worker.js   # Background service worker & sinkronisasi API
│   ├── content/
│   │   ├── content-main.js     # Orkestrator pemindaian halaman
│   │   ├── scanner.js          # DOM scanner (Google Forms, ARIA, & input fields)
│   │   ├── highlighter.js      # Injector badge nomor & event fokus/klik
│   │   ├── panel.js            # Komponen Side Panel Co-Pilot & multibahasa
│   │   └── overlay.css         # Styling modern, animasi, & spinner
│   ├── popup/                  # Menu popup toolbar browser
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── mock/                   # Mock dictionary data lokal
├── backend/                    # Node.js Express Backend Service
│   ├── src/
│   │   ├── index.js            # Entry point Express server
│   │   ├── config/             # Konfigurasi Firebase Firestore
│   │   ├── routes/             # Endpoint /api/explain, /api/feedback
│   │   └── services/           # aiService.js (GLM & Gemini), dictionaryService.js
│   ├── scripts/                # Script seeder dictionary Firestore
│   └── .env                    # Variabel konfigurasi lingkungan
├── test-page/                  # Halaman web simulasi pengujian formulir
│   └── demo_apostille.html
└── README.md                   # Dokumentasi resmi Telmy
```

---

## 🚀 Panduan Instalasi & Menjalankan

### Langkah 1: Jalankan Backend Server
1. Buka terminal dan masuk ke direktori `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Pastikan file `.env` telah terkonfigurasi:
   ```env
   PORT=8080
   EXPLAIN_STRATEGY=AI_FIRST
   AI_PROVIDER=openai
   OPENAI_BASE_URL=https://ai.sumopod.com
   OPENAI_KEY=your-openai-or-sumopod-api-key
   OPENAI_MODEL=glm-5.3-flash
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Jalankan server:
   ```bash
   npm run dev
   # Atau: node src/index.js
   ```
   *Server akan berjalan di `http://localhost:8080` dan siap menerima permintaan analisis kolom.*

---

### Langkah 2: Pasang Ekstensi di Google Chrome
1. Buka browser Chrome dan akses URL: `chrome://extensions/`.
2. Aktifkan **Developer mode** di pojok kanan atas.
3. Klik tombol **Load unpacked** di pojok kiri atas.
4. Pilih folder **`extension`** dari repositori ini (`d:\webdev\laragon\www\guidemeto\extension`).
5. Ekstensi **Telmy.ai: Your AI form-filling assistant** kini aktif!

---

### Langkah 3: Menggunakan Telmy.ai
1. Buka formulir online mana saja (misalnya formulir pendaftaran Google Forms, portal layanan publik, atau buka file simulasi [`test-page/demo_apostille.html`](file:///d:/webdev/laragon/www/guidemeto/test-page/demo_apostille.html)).
2. Telmy.ai akan otomatis memindai formulir dan memunculkan panel panduan di sisi kanan layar beserta badge nomor di samping setiap pertanyaan.
3. Klik salah satu badge nomor atau klik kolom isian di sebelah kiri untuk melihat arti kolom, petunjuk cara mengisi, contoh isian realistis, dan catatan khusus.
4. Gunakan dropdown di bagian atas panel untuk beralih bahasa seketika (🇮🇩 ID, 🇬🇧 EN, 🇨🇳 中文, 🇯🇵 日本語, 🇰🇷 한국어).
5. Tekan tombol **`Alt + G`** kapan saja untuk menyembunyikan atau menampilkan kembali panel panduan.

---

## 📄 Lisensi
Hak Cipta © 2026 **Telmy Team**. Seluruh hak cipta dilindungi undang-undang.
