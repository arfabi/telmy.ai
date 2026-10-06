# 🧭 GMT — Guide Me To
### Your AI Browser Co-Pilot & Automation Assistant

**GMT (Guide Me To)** adalah Chrome Extension modern (Manifest V3) yang memandu atau membantu Anda menyelesaikan berbagai tugas di web browser langkah demi langkah menggunakan kekuatan AI (**Sumopod DeepSeek Flash** & **Google Gemini 2.5/1.5 Flash**).

Mulai dari mengisi formulir panjang, menavigasi website berbahasa asing (China, Jepang, dsb.), mencari informasi, hingga otomatisasi tugas rutin — GMT hadir sebagai asisten cerdas yang mendampingi Anda di setiap halaman web.

---

## ✨ Fitur Utama (Features)

### 1. 🧭 Dual Mode: Guide Me ⇄ ⚡ Help Me (Autopilot)
- **Mode Guide Me (Default):**
  - **Spotlight & Pulse Ring:** Fokus visual presisi dengan sorotan lampu (*cutout*) dan 3 lapis animasi cincin radar (*pulse ring*) pada tombol atau kolom target.
  - **Smart Tooltip:** Menampilkan nomor langkah dan instruksi yang melayang dinamis di dekat elemen sasaran.
  - **Auto-Advance:** Mendeteksi klik pengguna secara otomatis untuk berpindah ke langkah selanjutnya.
- **Mode Help Me (Autopilot & Automation):**
  - **Visual Robot Cursor:** Kursor virtual neon bergerak mulus menuju elemen sasaran dengan jeda manusiawi (*human-like pacing ~1 detik*) agar pengguna dapat mengamati aksi dengan nyaman.
  - **Auto-Click & Auto-Fill:** AI mengklik tombol dan mengisi kolom formulir secara otomatis, dilengkapi animasi *click ripple*.
  - **Safety Confirmation (Human-in-the-Loop):** Apabila aksi tergolong kritis atau berisiko tinggi (`is_sensitive: true`, misalnya: mengirim email, bayar/checkout, hapus data, submit formulir akhir), GMT akan memunculkan dialog konfirmasi persetujuan sebelum mengeksekusi.

---

### 2. 👁️ Jayu Visual Bounding Box Grounding (Vision Fallback)
- Diadopsi langsung dari arsitektur agen browser **Jayu** (`find_and_click_element`).
- Jika CSS Selector DOM gagal (pada elemen Canvas, Shadow DOM, iframe, atau class yang diacak oleh bundler React, Vue, Flutter Web):
  1. GMT otomatis mengambil screenshot layar secara instan via `chrome.tabs.captureVisibleTab`.
  2. Screenshot dikirimkan ke model **Gemini Vision** / **Sumopod Vision** untuk mendeteksi koordinat *bounding box* `[ymin, xmin, ymax, xmax]`.
  3. GMT menampilkan **Vision Reticle** (target bidik visual) dan mengarahkan kursor robot langsung ke titik tengah koordinat tersebut untuk dieksekusi!

---

### 3. 🔍 Smart Watch Mode (Pemandu Proaktif Otomatis)
- Mengadopsi prinsip *debounced screen watching* (jeda 1.2 detik setelah aktivitas DOM tenang).
- Memantau perubahan halaman web atau tahapan wizard secara otomatis menggunakan `MutationObserver`.
- Mengekstrak judul halaman, URL, serta struktur heading terbaru, lalu memberikan ringkasan suara & teks proaktif tanpa pengguna harus membuka chat atau mengetik perintah.

---

### 4. 🧠 Otak & Kamus Pintar GMT (Personal Brain & Glossary)
- **Penyimpanan Permanen Personalisasi:** Setiap pengguna memiliki kamus glosarium personal sendiri yang tersimpan permanen di `chrome.storage.local`.
- **Perintah Suara / Teks Natural:**
  - *"Tolong simpan link facebook kanwil https://facebook.com/kemenkumjogja"* ➔ GMT otomatis menyimpannya ke memori otak.
  - *"Tolong cek facebook kanwil"* ➔ GMT langsung mengenali URL yang tersimpan di kamus dan membuka/memandu ke halaman tersebut!
- **Manajemen Visual Apple-Style:**
  - Tombol **🧠** di header panel membuka drawer kamus personal dengan indikator jumlah item.
  - Form tambah cepat (*Quick Add*) dengan tombol *Pakai Link Tab Ini*.
  - Kotak pencarian (*Search Filter*) untuk mencari item simpanan dengan cepat.
  - Tombol aksi: **Buka ↗** (langsung pandu ke link) dan **🗑️ Hapus**.
- **Sinkronisasi Hub & In-Page:** Glosarium otak yang disimpan dapat diakses dari in-page sidebar maupun dari Launchpad Hub (`hub/index.html`).

---

### 5. 🎙️ Hands-Free Wake Word ("Halo GMT" / "Hey GMT")
- Pengenalan suara berkelanjutan (*continuous speech recognition* melalui Web Speech API).
- Cukup ucapkan *"Halo GMT"* atau *"Hey GMT"* langsung dari mikrofon ruangan tanpa menyentuh mouse/keyboard:
  - Ucapkan *"Halo GMT carikan video tutorial memasak di YouTube"* ➔ GMT langsung memproses perintah.
  - Ucapkan hanya *"Halo GMT"* ➔ GMT merespons suara *"Iya, saya mendengarkan..."* dan membuka mikrofon untuk mendengarkan perintah Anda.

---

### 6. 🖐️ Hands-Free Hand Gesture Control (Webcam Lokal)
- Kendalikan navigasi peramban dan kursor mouse secara *hands-free* di depan webcam Anda:
  1. 🖐️ **5 Jari (Telapak Terbuka):** Gerakkan tangan ke atas / ke bawah untuk melakukan scroll halaman.
  2. ✊ **Menggenggam (Fist):** Menghentikan (*stop*) laju scroll seketika.
  3. ☝️ **1 Jari (Pointing):** Menggeser kursor virtual di layar seperti *mouse* dengan pelacakan halus.
  4. 👆 **1 Jari Klik (Tap Jari):** Melakukan aksi **Klik Kiri** pada tombol/elemen yang ditunjuk kursor.
  5. ✌️ **2 Jari Klik (Dua Jari):** Melakukan aksi **Klik Kanan** (Context Menu) pada posisi kursor.
- **100% Aman & Privasi:** Video dianalisis secara lokal menggunakan pemrosesan pengenalan jari (*radial peak contour & skin segmentation*) tanpa mengirim gambar ke server atau internet.
- Dilengkapi *Floating Gesture Indicator* dengan status gestur terkini, kursor pointer interaktif, dan tombol matikan cepat (✕).

---

### 7. 🚀 GMT Launchpad & Hub (Dukungan New Tab & Halaman Kosong)
- **Bisa Dibuka dari New Tab:** Ketika pengguna berada di *New Tab* (`chrome://newtab`), tab kosong (`about:blank`), atau belum membuka website apapun, mengeklik ikon ekstensi di toolbar browser akan **langsung membuka GMT Launchpad & Co-Pilot Hub** di tab tersebut.
- **Dynamic Script Injection:** Jika pengguna mengeklik ikon pada tab website yang sudah terbuka sebelum ekstensi dimuat/diperbarui, GMT otomatis menginjeksi stylesheet & skrip tanpa mewajibkan pengguna me-refresh halaman web secara manual.
- **Pusat Komando Terintegrasi di Hub:**
  - Input suara & teks super responsif untuk langsung menuju tugas (*Gmail, Google, YouTube, Google Form, Situs Asing, atau URL Bebas*).
  - Countdown auto-launch & persistensi sesi: Saat pengguna memilih tugas di Hub, AI merencanakan langkah-langkahnya, menyimpan sesi panduan, lalu otomatis mengalihkan tab ke website tujuan dengan panel panduan GMT langsung aktif dan membacakan instruksi!
  - Tombol cepat **🚀 Launchpad** di header panel samping untuk membuka Hub kapan saja dari website manapun.

---

### 8. 📱 Modern UI & Page-Push Layout
- **Sleek Right-Edge Dock Tab:** Menggantikan tombol bubble mengambang lama dengan tab ramping vertikal di tepi kanan layar (`#gmt-dock-tab`) dengan indikator status denyut (*Idle*, *Listening*, *Guiding*).
- **Page-Push (Web View Shrink):** Ketika panel samping GMT dibuka, margin website otomatis digeser dan disusutkan 390px ke kiri. Panel GMT berada di samping tampilan web sehingga **tidak pernah menutupi konten, formulir, atau tombol penting di website**.
- **Checklist Tahapan Interaktif:**
  - Progress bar persentase penyelesaian langkah (0% - 100%).
  - Daftar langkah dengan badge status (*Selesai*, *Aktif*, *Antre*).
  - *Click-to-jump*: Klik langkah mana saja dalam daftar untuk langsung berpindah fokus ke langkah tersebut.
- **🧹 Clear Chat:** Tombol sekali klik untuk membersihkan riwayat percakapan dan mereset sesi panduan.

---

### 9. 🌐 Panduan Halaman Bahasa Asing & Fitur Jelaskan Halaman
- **Tombol Cepat "Jelaskan Halaman Ini (Explain Page)":**
  - Menganalisis situs berbahasa asing (China, Jepang, Korea, Jerman, dsb.) dan menjelaskannya dalam Bahasa Indonesia yang ramah (fungsi website, menu penting, dan apa saja yang bisa dilakukan).
- **Instruksi Dwibahasa (Bilingual Guidance):**
  - Pada halaman asing, GMT memberikan petunjuk dwibahasa (arti Bahasa Indonesia + teks asli tombol bahasa asing, misal: *Klik tombol Daftar (立即注册)*).
- **Tombol Cepat Bawaan Lainnya:**
  - ✉️ *Guide me to write email* (Panduan Gmail)
  - 🔍 *Guide me to search on Google*
  - 🎥 *Guide me to watch YouTube*

---

### 10. ⚡ Multi-AI Provider & Uninterrupted Voice
- **AI Provider:**
  - **Sumopod (DeepSeek Flash)** *(Rekomendasi)*: Sangat responsif, pemahaman instruksi tajam, dan hemat biaya via OpenAI-compatible endpoint.
  - **Google Gemini (2.5-Flash / 1.5-Flash)**: Mendukung multimodal vision dan fallback otomatis jika koneksi provider utama terganggu.
- **Voice Engine:**
  - **ElevenLabs API**: Suara AI ultra-realistis dan natural.
  - **Chrome Background TTS (`chrome.tts`)**: Suara instruksi dijalankan di proses *service worker background*, sehingga saat AI mengarahkan navigasi URL (berpindah halaman/domain), suara AI **tidak pernah terputus**.

---

### 11. 💾 Sesi Persisten (Multi-Page Persistence)
- Status panel, riwayat chat, daftar tahapan, checklist progres, dan variabel memori tersimpan aman di `chrome.storage.local`.
- Ketika halaman berpindah alamat URL atau di-*refresh*, sesi panduan otomatis dipulihkan tanpa kehilangan jejak.
- Sesi otomatis dibersihkan secara aman jika tidak aktif lebih dari 2 jam.

---

## 🎛️ Pusat Kontrol (Control Center Panel)

Panel GMT dilengkapi **Control Center** yang dapat diakses langsung dari header:

| Kontrol | Ikon | Deskripsi |
| :--- | :---: | :--- |
| **Guide Me** | 🧭 | Mode panduan sorotan visual; pengguna yang mengklik sendiri |
| **Help Me** | ⚡ | Mode autopilot; AI mengklik dan mengisi halaman secara otomatis |
| **Gestur** | 🖐️ | Toggle aktivasi scroll halaman via lambaian tangan di webcam |
| **Mikrofon** | 🎙️ | Toggle wake word hands-free (*"Halo GMT"*) |
| **Audio** | 🔊 | Toggle aktif / senyapkan suara instruksi AI |
| **Watch** | 👁️ | Toggle Smart Watch Mode untuk pemandu proaktif otomatis |
| **Memori** | 🧠 | Drawer catatan variabel kontekstual antar halaman web |

---

## 🚀 Instalasi (Developer Mode)

1. Buka Google Chrome atau Microsoft Edge.
2. Masuk ke halaman ekstensi: ketik `chrome://extensions/` di bilah alamat (*address bar*).
3. Aktifkan **Developer Mode** (toggle di pojok kanan atas).
4. Klik tombol **"Load unpacked"** (Muat yang belum dibongkar).
5. Pilih folder:
   ```text
   gmt-extension/
   ```
6. Ekstensi **GMT — Guide Me To 🧭** siap digunakan! Buka tab website baru mana saja untuk mulai mencoba.

---

## ⚙️ Pengaturan API Key Pertama Kali

1. Buka halaman web mana saja (misal `google.com` atau `wikipedia.org`).
2. Klik tab dok **GMT** di tepi kanan layar (atau klik ikon ekstensi di toolbar browser).
3. Klik tombol **⚙️ Settings** di bagian header panel GMT.
4. Masukkan konfigurasi API Key:
   - **AI Provider**:
     - **Sumopod (Direkomendasikan)**: Masukkan API Key dari [ai.sumopod.com](https://ai.sumopod.com) (Model: `deepseek-flash`).
     - **Google Gemini**: Masukkan API Key dari [Google AI Studio](https://aistudio.google.com) (Model: `gemini-2.5-flash` / `gemini-1.5-flash`).
   - *(Opsional)* **ElevenLabs API Key & Voice ID**: Untuk output suara AI yang sangat manusiawi.
5. Klik **Simpan / Save**.

---

## 🏗️ Arsitektur & Struktur Direktori

```text
gmt-extension/
├── manifest.json              # Konfigurasi Chrome Extension Manifest V3
├── background/
│   └── service-worker.js      # Background worker:
│                              # - Multi-provider AI (Sumopod & Gemini)
│                              # - Jayu Vision Bounding Box Grounding
│                              # - Uninterrupted Background TTS (chrome.tts)
│                              # - Tab navigation coordinator & tab screenshot
├── content/
│   ├── content-script.js      # Core logic di halaman:
│   │                          # - Sleek Dock Tab & Side Panel Drawer
│   │                          # - Autopilot Engine (Robot Cursor, Ripple, Auto-fill)
│   │                          # - Safety Confirmation Modal (Human-in-the-Loop)
│   │                          # - Spotlight Cutout & Animated Pulse Rings
│   │                          # - Interactive Step Checklist & Progress Bar
│   │                          # - Hands-free Wake Word ("Halo GMT")
│   │                          # - Hands-free Webcam Optical Flow Gesture Scroll
│   │                          # - Smart Watch Mode & Context Memory Drawer
│   │                          # - Page-push web view shrinker
│   └── overlay.css            # Stylesheet:
│                              # - Page-push responsive layout
│                              # - Dark glassmorphism UI & neon glow
│                              # - Pulse rings, robot cursor, & reticle styling
├── ai/
│   └── gemini.js              # Modul helper Gemini client & prompt formatting
├── voice/
│   └── voice.js               # Modul helper ElevenLabs TTS & Web Speech API
├── assets/
│   └── icons/                 # Ikon resmi ekstensi (16, 32, 48, 128 px)
└── README.md                  # Dokumentasi resmi proyek GMT
```

---

## 🛡️ Keamanan & Privasi Pengguna

- **Penyimpanan Lokal Eksklusif:** API Key, riwayat percakapan, dan data memori sesi hanya disimpan di penyimpanan lokal browser Anda (`chrome.storage.local`).
- **Kamera 100% Privat:** Deteksi gestur tangan webcam diproses secara real-time di RAM browser peramban melalui Canvas API. Gambar atau video dari kamera **tidak pernah disimpan atau dikirim ke server mana pun**.
- **Human-in-the-Loop (Safety Modal):** Pada mode *Help Me (Autopilot)*, setiap aksi sensitif (pembayaran, hapus akun/data, submit akhir formulir) selalu meminta konfirmasi pengguna secara eksplisit sebelum dieksekusi.
- **Tanpa Server Perantara:** Panggilan API dilakukan langsung dari browser Anda ke endpoint AI resmi (Sumopod / Google Gemini / ElevenLabs).
