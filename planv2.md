# 🚀 Telmy.ai — Master Execution Blueprint V2 (`planv2.md`)

Dokumen ini adalah rencana kerja komprehensif, terstruktur, dan berurutan berdasarkan seluruh keputusan arsitektur, kebutuhan fungsional, dan perbaikan UI/UX terbaru. Setiap prioritas dirancang agar dapat dieksekusi secara bertahap (*step-by-step*) tanpa ada detail yang terlewat.

---

## 📊 Matriks Urutan Prioritas Eksekusi

| Prioritas | Kategori | Fokus Utama | Dampak & Urgensi |
| :---: | :--- | :--- | :--- |
| **P1** | **Jaringan & Manifest** | Migrasi 100% Cloud Run & Izin Host MV3 (Hapus Localhost & Mock) | 🔴 **Kritis** — Membuka akses jaringan agar API backend dapat ditembus |
| **P2** | **Izin & Hardware** | Solusi Akses Mikrofon Chrome Sidepanel (One-Click Tab Prompt CWS) | 🔴 **Kritis** — Mengaktifkan mode suara tanpa diblokir oleh Chrome |
| **P3** | **Branding & Copywriting** | Pembersihan Teks "Firebase" & Default Bahasa Inggris | 🟡 **Tinggi** — Tampilan profesional dan netral bagi pengguna akhir |
| **P4** | **Internasionalisasi (i18n)** | Kamus 11 Bahasa Lengkap & Sinkronisasi 2 Sisi (UI + AI/TTS) | 🟡 **Tinggi** — Memperbaiki bug teks bahasa India, Thailand, Jepang, dll. |
| **P5** | **UI/UX Polishing** | Bendera SVG Super Ringan & Mode Selector Auto-Compact | 🟢 **Sedang** — Mengatasi glitch "GB EN" / "ID ID" & menghemat ruang vertikal |
| **P6** | **Arsitektur Antarmuka** | Reorganisasi Tab Navigasi & Relokasi Pilar Utama dari Atas Chatbox | 🟡 **Tinggi** — Chatbox lega; AutoFill & PDF Guide naik kelas jadi pilar utama |
| **P7** | **Keamanan & Kriptografi** | Zero-Knowledge Client-Side Encryption (CSE via Web Crypto API) | 🟣 **Arsitektural** — Keamanan setara standar Bitcoin/Perbankan |
| **P8** | **Fitur Baru (OCR Vault)** | Multi-Document Ingestion (KTP, Ijazah, Paspor) & AutoFill Engine | 🟣 **Arsitektural** — Sumber data kaya untuk 1-Click AutoFill cerdas |
| **P9** | **Kepatuhan & Regulasi** | Pembaruan Halaman Privacy Policy & Security Awareness Banner | 🟢 **Dokumentasi** — Kepatuhan GDPR & Chrome Web Store Policy |

---

## 🛠️ Rincian Komprehensif per Prioritas

---

### 🔴 PRIORITAS 1: Migrasi Total ke Cloud Run & Eliminasi Ketergantungan Lokal
> **Tujuan:** Memastikan seluruh fitur ekstensi menembus endpoint backend resmi di Cloud Run, tanpa ada fallback ke `localhost` dan tanpa membaca dictionary statis lokal.

- [ ] **1.1. Penambahan `host_permissions` di Manifest V3 (`extension/manifest.json`)**:
  - Tambahkan array izin domain resmi:
    ```json
    "host_permissions": [
      "https://telmy-ai.cloud.run/*"
    ]
    ```
  - Ini mencegah Chrome Extension melempar error CORS / `TypeError: Failed to fetch` pada background service worker.

- [ ] **1.2. Standarisasi URL Tunggal ke Cloud Run (`extension/background/service-worker.js`)**:
  - Tetapkan konstanta `DEFAULT_SETTINGS.apiUrl = 'https://telmy-ai.cloud.run/api'` secara permanen.
  - Bersihkan seluruh logika pengalihan/fallback ke `localhost:8080`, `localhost`, atau `127.0.0.1` di dalam `fetchWithTimeout()` maupun modul lainnya.

- [ ] **1.3. Hapus Mekanisme `LOAD_MOCK_DICTIONARY`**:
  - Hapus penanganan pesan `LOAD_MOCK_DICTIONARY` di `service-worker.js`.
  - Di `extension/content/content-main.js`: Hentikan pembacaan file statis `mock/apostille-ahu.json`.
  - Alihkan alur pemindaian (*form scan workflow*) agar langsung mengambil data panduan/analisis secara live dari API backend (`https://telmy-ai.cloud.run/api`).

- [ ] **1.4. Pemeliharaan Loading State (Animasi Gemini)**:
  - Pastikan saat request ke Cloud Run sedang berjalan, UI mempertahankan kartu animasi loading yang sudah ada (*flash animation* dengan status `"Sedang menganalisis..."` / skeleton shimmer) hingga data respons selesai diterima.

---

### 🔴 PRIORITAS 2: Solusi Akses Mikrofon di Chrome Native Side Panel (CWS Compliant)
> **Tujuan:** Mengatasi error *"Microphone access is not permitted. Please allow microphone permissions in your browser settings"* dengan alur resmi yang 100% lolos verifikasi Chrome Web Store.

- [ ] **2.1. Alur Izin Mikrofon Satu Kali Klik (*One-Time Permission Grant Flow*)**:
  - Karena Chrome Side Panel (`chrome-extension://`) memblokir pop-up izin browser `getUserMedia`, buat satu halaman tab ringan: `extension/permission/request-mic.html` (beserta skripnya).
  - Saat pengguna mengklik tombol Mic di Sidepanel dan terdeteksi izin belum aktif:
    1. Ekstensi membuka tab izin tersebut secara otomatis via `chrome.tabs.create`.
    2. Halaman tab memanggil `navigator.mediaDevices.getUserMedia({ audio: true })`, memicu pop-up resmi Chrome: `[ Allow ] [ Block ]`.
    3. Setelah pengguna mengklik **Allow**, tab menampilkan status sukses dan otomatis tertutup dalam 1.5 detik.
    4. Karena berada dalam satu *origin* ekstensi yang sama, Side Panel langsung mendapatkan izin mikrofon secara permanen tanpa perlu reload.

- [ ] **2.2. Validasi Kepatuhan Kebijakan CWS**:
  - Alur ini hanya dipicu saat pengguna secara sadar mengklik tombol mikrofon (*explicit user gesture*).
  - Tambahkan penjelasan ramah pada UI Sidepanel jika pengguna membatalkan izin.

---

### 🟡 PRIORITAS 3: Pembersihan Branding "Firebase" & Standarisasi Default Bahasa Inggris
> **Tujuan:** Menghilangkan penyebutan nama teknologi infrastruktur internal ke pengguna dan menetapkan Bahasa Inggris sebagai default bahasa internasional.

- [ ] **3.1. Hapus Teks "Firebase"**:
  - Di `extension/sidepanel/sidepanel.js` (L558):
    - Ubah `'✓ Firebase Connected'` $\rightarrow$ `'✓ Connected'`.
  - Di `extension/sidepanel/sidepanel.html` (L446):
    - Ubah `'2. Connect Your Account (Firebase)'` $\rightarrow$ `'2. Connect Your Account'`.
  - Pastikan tidak ada teks terlihat oleh pengguna yang mencantumkan nama "Firebase".

- [ ] **3.2. Standarisasi Teks Default HTML ke Bahasa Inggris**:
  - Di `extension/sidepanel/sidepanel.html`:
    - Card Chatbot: Judul `"Chatbot Mode"`, deskripsi `"Fast & silent text (Muted)"`, status badge `"✓ Active"`.
    - Card Voicebot: Judul `"Voicebot Mode"`, deskripsi `"Google WaveNet Voice & Interactive Avatar"`, status badge `"○ Switch Mode"`.
    - Voicebot Hero Stage: Judul `"Hello, I'm Telmy!"`, deskripsi `"Click the microphone button below to speak directly"`, caption tombol `"Click to Speak"`.
    - Chat input placeholder: `"Ask Telmy about this form..."`.

---

### 🟡 PRIORITAS 4: Lokalisasi Penuh 11 Bahasa & Sinkronisasi 2 Sisi (UI + AI/TTS)
> **Tujuan:** Memperbaiki bug di mana memilih bahasa India (`hi`), Thailand (`th`), atau Jepang (`ja`) masih memunculkan teks bahasa Inggris/Indonesia akibat logika ternary hardcode.

- [ ] **4.1. Hapus Logika Ternary Hardcode di `extension/sidepanel/sidepanel.js`**:
  - Hapus seluruh pengecekan `currentLanguage === 'id' ? '...' : '...'` di `updateVoicebotStageLabels()`, `setBotMode()`, dan fungsi-fungsi lainnya.
  - Alihkan seluruh pembacaan teks ke helper terjemahan `t(key)`.

- [ ] **4.2. Lengkapi Kamus Objek `I18N` untuk Seluruh 11 Bahasa**:
  - Dukungan lengkap untuk:
    1. 🇬🇧 English (`en`)
    2. 🇮🇩 Indonesia (`id`)
    3. 🇯🇵 Japanese (`ja`)
    4. 🇰🇷 Korean (`ko`)
    5. 🇨🇳 Simplified Chinese (`zh`)
    6. 🇹🇼 Traditional Chinese (`zh-TW`)
    7. 🇻🇳 Vietnamese (`vi`)
    8. 🇹🇭 Thai (`th`)
    9. 🇮🇳 Hindi (`hi`)
    10. 🇵🇭 Filipino (`fil`)
    11. 🇲🇾 Malay (`ms`)
  - Masukkan semua string yang sebelumnya belum diterjemahkan:
    - Mode selector (judul, deskripsi, badge aktif/beralih)
    - Voicebot hero stage (status mendengarkan, berbicara, idle, prompt klik mic)
    - Pesan welcome onboarding dan chip aksinya
    - Action buttons dan modal paywall/kuota

- [ ] **4.3. Sinkronisasi 2 Sisi (UI Aplikasi & AI Backend)**:
  - Sisi 1 (UI): Setiap perubahan dropdown bahasa seketika mengubah seluruh teks antarmuka ke bahasa yang dipilih.
  - Sisi 2 (AI & TTS): Parameter bahasa aktif dikirimkan ke Cloud Run API, memastikan Gemini membalas narasi dalam bahasa tersebut dan Google Cloud TTS WaveNet melafalkannya dengan aksen penutur asli (*native speaker*).

---

### 🟢 PRIORITAS 5: UI/UX Polishing — Bendera SVG Ringan & Mode Selector Auto-Compact
> **Tujuan:** Menghilangkan glitch visual teks "GB EN" / "ID ID" di Windows serta menghemat ruang vertikal Sidepanel.

- [ ] **5.1. Custom Dropdown Selector Bahasa dengan Bendera SVG Super Ringan**:
  - Ganti elemen bawaan `<select>` yang tidak mendukung rendering emoji di Windows dengan **Custom Mini Dropdown Menu**.
  - Buat kumpulan icon bendera negara dalam format vector **inline SVG lingkaran (16×16 px)** yang sangat ringan (~150-200 bytes per icon).
  - Tampilan rapi, konsisten di Windows, Mac, dan Linux, menampilkan icon bendera yang tajam disertai kode bahasa (misal: `[SVG ID] ID`, `[SVG GB] EN`, `[SVG IN] HI`, `[SVG JP] JA`).

- [ ] **5.2. Auto-Compact Mode Selector & Expand on Hover**:
  - **Kondisi Terpilih (Compact):** Setelah mode dipilih (Chatbot atau Voicebot), container `#sp-mode-cards-container` otomatis menyusut menjadi bar ramping horizontal (*slim pill status*) yang hanya menampilkan mode aktif secara minimalis. Ini menghemat ruang vertikal secara signifikan.
  - **Kondisi Hover (Expanded):** Ketika mouse pengguna mengarah (*hover*) ke area tersebut, container membesar kembali secara halus (*smooth CSS transition*) menampilkan kedua kartu mode lengkap untuk memudahkan pergantian mode.

- [ ] **5.3. Sembunyikan Welcome Onboarding Card di Mode Voicebot**:
  - Di `sidepanel.js` (`renderWelcome()`): Kartu hero *"Hello! I am Telmy 👋"* hanya ditampilkan saat berada di **Mode Chatbot**.
  - Saat beralih ke **Mode Voicebot**, elemen tersebut disembunyikan agar tidak bertumpuk dengan avatar robot besar di panggung Voicebot.

---

### 🟡 PRIORITAS 6: Reorganisasi Navigasi Utama & Relokasi Fitur Pilar
> **Tujuan:** Membersihkan ruang chatbox dari tombol-tombol chip yang mempersempit ruang dan menaikkan derajat fitur AutoFill & PDF Guide menjadi Pilar Utama.

- [ ] **6.1. Hapus Tombol Chip Redundan**:
  - Hapus tombol chip `[🤖 Telmy Bot]` di atas chat input bar (`#sp-quick-chips`). Persona Telmy sudah melekat pada asisten itu sendiri.
  - Hapus tombol chip `[📄 Guide PDF Form]` dan `[⚡ 1-Click AutoFill]` dari atas chatbox, sehingga area percakapan chat lega dari atas hingga bawah.

- [ ] **6.2. Struktur Tab Navigasi Baru yang Terorganisir**:
  - Tata ulang navigasi Sidepanel menjadi 4 pilar utama yang jelas:
    1. **Tab `[ 💬 Assistant ]`**: Fokus murni pada percakapan interaktif (Mode Chatbot atau Voicebot). Chatbox bersih dan luas.
    2. **Tab `[ ⚡ AutoFill & Vault ]`**: Pusat data identitas pengguna. Tempat mengunggah dokumen pribadi (KTP, Ijazah, dll.), melihat status enkripsi CSE, dan tombol utama `[ ⚡ 1-Click AutoFill Form ]`.
    3. **Tab `[ 📄 PDF Form ]`**: Fasilitas analisis dokumen formulir PDF resmi (kedutaan/beasiswa), dropzone pengunggahan form, panduan pengisian, dan ekspor.
    4. **Tab `[ 📋 Fields & Audit ]`**: Daftar kolom terdeteksi di halaman web yang sedang aktif beserta tombol *Pre-Submission Form Auditor*.

---

### 🟣 PRIORITAS 7: Arsitektur Keamanan Zero-Knowledge Client-Side Encryption (CSE)
> **Tujuan:** Menjamin data profil dan dokumen pengguna diacak di browser sebelum dikirim ke cloud, sehingga admin/database tidak dapat melihat data sensitif pengguna (*zero-knowledge*).

- [ ] **7.1. Modul Kriptografi Web Crypto API (`extension/content/crypto-vault.js` / helper)**:
  - Implementasikan standar kriptografi menggunakan `window.crypto.subtle`:
    * Derivasi Kunci: **PBKDF2** (100.000 iterasi, SHA-256) menggunakan passphrase/kunci rahasia milik pengguna.
    * Algoritma Enkripsi: **AES-GCM 256-bit** dengan Initialization Vector (IV) unik per enkripsi.
  - Fungsi Enkripsi: `encryptVaultData(plainObject, userKey) -> { ciphertext, iv, salt }`.
  - Fungsi Dekripsi: `decryptVaultData({ ciphertext, iv, salt }, userKey) -> plainObject`.

- [ ] **7.2. Zero-Knowledge Cloud Storage di Firebase Firestore**:
  - Saat data profil disinkronkan ke Cloud Firestore (`users/{uid}/profile_vault`), data yang dikirim murni berupa *ciphertext* acak.
  - Server backend maupun database administrator sama sekali tidak memiliki kunci untuk mendekripsi data tersebut (*mathematically zero-knowledge*).
  - Hanya pengguna yang dapat membaca (*decrypt*), mengupdate, dan menghapus datanya.

---

### 🟣 PRIORITAS 8: Smart Document Ingestion (OCR KTP, Ijazah, dll.) & AutoFill Engine
> **Tujuan:** Memungkinkan pengguna mengunggah dokumen identitas fisik untuk di-OCR dan disimpan ke Vault terenkripsi sebagai sumber data pengisian formulir otomatis.

- [ ] **8.1. Multi-Document Ingestion Interface di Tab AutoFill**:
  - Dropzone pengunggahan dokumen pendukung: KTP / National ID, Ijazah / Transkrip Akademik, Paspor, Kartu Keluarga, Dokumen Sertifikat.
  - Dukungan format: PDF, PNG, JPG.

- [ ] **8.2. Kebijakan Non-Retensi File Fisik (*Zero Physical Document Retention*)**:
  - File dokumen fisik yang diunggah diproses sementara di memori untuk proses OCR / ekstraksi teks entitas via Gemini multimodal di Cloud Run.
  - **File fisik langsung dibuang permanen dari memori** setelah ekstraksi selesai. Tidak ada penyimpanan file di Cloud Storage.
  - Hanya teks hasil ekstraksi (nama, nomor dokumen, tanggal lahir, nama kampus, IPK, dll.) yang dikembalikan ke browser pengguna.

- [ ] **8.3. Penyimpanan Data Terenkripsi ke Vault & Integrasi AutoFill**:
  - Begitu data teks diterima di browser, data langsung dienkripsi dengan CSE (Web Crypto API) sebelum disimpan ke Vault.
  - Data ini memperluas kamus *dynamic key-value* di AutoFill engine, sehingga saat tombol `[ ⚡ 1-Click AutoFill ]` ditekan di formulir pendaftaran apapun, sistem dapat mencocokkan field secara otomatis dan akurat.

---

### 🟢 PRIORITAS 9: Penyesuaian Kebijakan Privasi, Security Awareness, & Compliance
> **Tujuan:** Mengedukasi pengguna secara transparan mengenai keamanan tingkat tinggi dan memastikan kepatuhan penuh terhadap Chrome Web Store Policy dan GDPR.

- [ ] **9.1. Hapus Bar Lama di Sidepanel**:
  - Hapus elemen `#sp-privacy-bar` dan label `#lbl-privacy-text` (*"Privacy Shield: PII Masked Locally"*) dari `sidepanel.html`, `sidepanel.js`, dan `sidepanel.css`, karena telah digantikan oleh standar yang jauh lebih mutakhir (Zero-Knowledge CSE).

- [ ] **9.2. Banner Edukasi Keamanan Saat Upload Dokumen**:
  - Di modal/dropzone pengunggahan dokumen KTP/Ijazah, tampilkan notifikasi transparansi keamanan yang jelas:
    > 🛡️ **Zero-Knowledge Privacy Guarantee**  
    > Dokumen fisik Anda tidak disimpan di server. Data hasil ekstraksi otomatis dienkripsi dengan *Client-Side Encryption (CSE)* menggunakan kunci perangkat Anda. Hanya Anda yang dapat membaca dan mendekripsi data ini.

- [ ] **9.3. Pembaruan Halaman Kebijakan Privasi (`backend/public/privacy.html` & Landing Page)**:
  - Tuliskan penjelasan keamanan dengan bahasa awam dan analogi yang meyakinkan:
    * **Setara Kriptografi Bitcoin / Perbankan Global:** Menggunakan standar enkripsi matematika modern (AES-256) yang tidak dapat ditembus.
    * **Zero-Knowledge Architecture:** Data digembok di perangkat pengguna sebelum pernah disentuh oleh jaringan internet.
    * **Admin Tidak Bisa Mengintip:** Bahkan developer, tim teknis, maupun administrator database tidak memiliki akses teknis untuk membaca data sensitif pengguna.
    * **Zero Document Retention:** Dokumen fisik yang diunggah segera dihapus setelah proses ekstraksi selesai.

---

## 🚦 Rencana Alur Kerja Eksekusi Bertahap

Saat kita mulai mengeksekusi, langkah-langkah di atas akan dijalankan berurutan:
1. **Fase Jaringan & Izin (P1 & P2):** Menyiapkan koneksi lancar ke Cloud Run dan perbaikan izin mikrofon.
2. **Fase Tampilan & Bahasa (P3, P4, & P5):** Membersihkan branding, memperbaiki kamus 11 bahasa, dan menyempurnakan visual SVG & mode selector.
3. **Fase Tata Letak & UX (P6):** Mereorganisasi tab navigasi utama agar chatbox lega dan fitur pilar terstruktur rapi.
4. **Fase Vault Kriptografi & Dokumen (P7 & P8):** Menerapkan Web Crypto API CSE, upload KTP/Ijazah OCR, dan integrasi AutoFill.
5. **Fase Kepatuhan & Transparansi (P9):** Memperbarui halaman kebijakan privasi dan banner keamanan.
