# 🚀 TELMY.AI — PLAN V4: CHROME WEB STORE FAST-TRACK SUBMISSION BLUEPRINT

> **Fokus & Tujuan Plan V4:**  
> Mempersiapkan seluruh kebutuhan administratif, aset visual, kepatuhan kebijakan (*policy compliance*), audit keamanan kode, dan paket rilis final agar ekstensi **Telmy.ai** dapat disubmit ke **Chrome Web Store (CWS)** dengan persetujuan cepat (**< 7 hari**) tanpa memicu penolakan (*rejection*) maupun investigasi manual review yang berkepanjangan.

---

## 📑 DAFTAR ISI
1. [Pilar 1: Kebutuhan Aset & Metadata Listing Toko (CWS Submission Kit)](#-pilar-1-kebutuhan-aset--metadata-listing-toko-cws-submission-kit)
2. [Pilar 2: Audit Fitur Ekstensi, Kepatuhan Kebijakan CWS & Notasi Khusus](#-pilar-2-audit-fitur-ekstensi-kepatuhan-kebijakan-cws--notasi-khusus)
3. [Pilar 3: Strategi Review Cepat (< 7 Hari) & Mitigasi Manual Review Trigger](#-pilar-3-strategi-review-cepat--7-hari--mitigasi-manual-review-trigger)
4. [Pilar 4: Arsitektur Folder Siap Upload (`cws-submission/`)](#-pilar-4-arsitektur-folder-siap-upload-cws-submission)
5. [Roadmap & Urutan Tahapan Pengerjaan (Execution Checklist)](#-roadmap--urutan-tahapan-pengerjaan-execution-checklist)

---

## 🎨 PILAR 1: KEBUTUHAN ASET & METADATA LISTING TOKO (CWS SUBMISSION KIT)

Dokumen dan aset yang wajib disiapkan sebelum mengisi formulir di Chrome Web Store Developer Dashboard:

### 1.1. Informasi Identitas Ekstensi (Listing Basics)
- [x] **Nama Ekstensi (Item Name):**
  - *Batas Karakter:* Maksimal 75 karakter.
  - *Rekomendasi:* `Telmy.ai: Form Filling Assistant & Smart Auditor` (48 karakter).
- [x] **Ringkasan / Deskripsi Singkat (Short Description):**
  - *Batas Karakter:* Maksimal 132 karakter.
  - *Rekomendasi:* `Your AI companion to understand, safely autofill with Zero-Knowledge encryption, and audit complex web forms with ease.` (120 karakter).
- [x] **Kategori Utama (Category):**
  - *Pilihan:* **Productivity** (primer) atau **Workflow & Planning**.
- [x] **Bahasa Utama (Default Language):**
  - English (`en`) sebagai bahasa dasar listing global, dengan copy terjemahan untuk pasar JAPAC jika diperlukan.

---

### 1.2. Deskripsi Lengkap Ekstensi (Detailed Description)
*Batas Karakter: Maksimal 16.000 karakter (Mendukung pemformatan teks terstruktur).*

- [x] **Struktur & Poin-Poin Deskripsi Lengkap:**
  1. **Hook & Problem Statement:** Mengapa formulir visa, beasiswa, pendaftaran izin, dan portal publik terasa menakutkan, membingungkan, dan rawan salah isi bagi masyarakat awam.
  2. **Solusi Telmy.ai:** Sahabat AI ramah yang duduk berdampingan di panel samping Chrome (`Side Panel`), menjelaskan setiap pertanyaan dalam bahasa sederhana satu demi satu.
  3. **6 Fitur Utama:**
     - 🎙️ **Push-to-Talk Multilingual Voicebot:** Bimbingan suara alami Google WaveNet dalam 11 bahasa ibu JAPAC.
     - 🛡️ **Zero-Knowledge Client-Side Encryption (CSE):** Profil disimpan terenkripsi dengan AES-GCM 256 + PBKDF2 (100.000 iterasi) menggunakan Master Password atau 12 Seed Words. Server Telmy tidak dapat melihat data Anda.
     - ⚡ **1-Click Safe AutoFill:** Pengisian formulir instan dengan pencocokan alias cerdas, dengan proteksi otomatis melewati kolom password dan CVV.
     - 🚦 **Pre-Submission Auditor:** Audit kelengkapan dan format data sebelum submit dengan indikator Traffic Light (Hijau/Kuning/Merah).
     - 📤 **Smart Document Ingestion:** Ekstraksi data dari foto KTP/Paspor secara lokal/ephemeral memory tanpa penyimpanan file fisik (*Zero Document Retention*).
     - 📑 **Certified PDF Exporter:** Cetak bukti rekam jejak audit pengisian form berstandar resmi.
  4. **Panduan Cara Menggunakan (3 Langkah Cepat):**
     - Buka halaman web berformulir.
     - Klik ikon Telmy di toolbar atau tekan `Alt+G` untuk membuka Side Panel.
     - Telmy otomatis mendeteksi kolom dan siap memandu Anda lewat teks maupun suara.
  5. **Komitmen Privasi & Keamanan:** Tanpa wake-word selalu aktif (*no always-listening*), tanpa penjualan data pihak ketiga, tanpa pelacakan browsing history.

---

### 1.3. Aset Grafis & Visual Toko (Store Media Assets)
*Sesuai spesifikasi resmi Chrome Web Store Image Requirements:*

- [x] **Ikon Toko (Store Icon):**
  - *Ukuran:* Tepat `128 x 128` px (format PNG transparan / latar kontras tinggi).
  - *Status:* Disimpan di `cws-submission/store-assets/icon-128x128.png`.
- [x] **Small Promotional Tile (Wajib untuk Visibilitas Toko):**
  - *Ukuran:* Tepat `440 x 280` px (format PNG/JPEG, rasio ~11:7).
  - *Status:* Disimpan di `cws-submission/store-assets/promo-small-440x280.png`.
- [x] **Marquee Promotional Tile (Opsional tapi Direkomendasikan untuk Featured):**
  - *Ukuran:* Tepat `1400 x 560` px (format PNG/JPEG).
  - *Status:* Disimpan di `cws-submission/store-assets/promo-marquee-1400x560.png`.
- [x] **Screenshot Ekstensi (Minimal 1, Sangat Direkomendasikan 4–5):**
  - *Ukuran:* `1280 x 800` px, rasio 16:10.
  - *Daftar 5 Screenshot Naratif (Selesai):*
    1. `screenshot-1-sidepanel-guidance.png` (Core Experience: Sidepanel form guidance).
    2. `screenshot-2-multilingual-voice.png` (Multilingual Voice Guidance: WaveNet 11 Languages).
    3. `screenshot-3-dual-lock-vault.png` (Zero-Knowledge Dual-Lock Vault: Password / 12 Seed Words).
    4. `screenshot-4-autofill-auditor.png` (Smart AutoFill & Pre-Submission Traffic Light Auditor).
    5. `screenshot-5-document-pdf-intelligence.png` (Document Ingestion & Certified PDF Export).

---

### 1.4. Informasi Legalitas, Privasi & Kontak Dukungan
- [x] **Privacy Policy URL (Wajib & Aktif):**
  - *URL:* `https://telmy-ai.cloud.run/privacy`
  - *Status Dokumen:* Halaman `backend/public/privacy.html` sudah memuat pasal Zero-Knowledge CSE, Push-to-Talk, dan Zero Document Retention.
- [x] **Website Resmi:**
  - *URL:* `https://telmy-ai.cloud.run`
- [x] **Support URL / Email Pengembang:**
  - *URL:* `https://telmy-ai.cloud.run#faq` (email: `support@telmy-ai.cloud.run`).

---

## 🔍 PILAR 2: AUDIT FITUR EKSTENSI, KEPATUHAN KEBIJAKAN CWS & NOTASI KHUSUS

Pengecekan teknis mendalam terhadap seluruh fitur, permission, dan baris kode ekstensi untuk mencegah penolakan (*Immediate Policy Rejection*):

| Komponen / Kebijakan | Status Saat Ini | Analisis Kepatuhan CWS | Tindakan / Notasi Khusus |
| :--- | :--- | :--- | :--- |
| **Manifest Version** | Manifest V3 | 100% Sesuai standardisasi terbaru Google | Pertahankan MV3. |
| **Larangan Remote Code** | Tidak ada `eval()`, tidak ada `<script src="http">` | 100% Aman. Semua script di-bundle lokal | `pdf-lib.min.js` adalah library open-source ter-bundle lokal. Berikan catatan atribusi jika reviewer bertanya. |
| **Permission: `storage`** | Digunakan di SW & Sidepanel | Sesuai. Hanya simpan token, cached cipher, dan preference | Justifikasi: *"Stores local user preferences and encrypted vault envelopes on-device."* |
| **Permission: `activeTab`** | Digunakan untuk interaksi tab | Sangat disukai reviewer karena ramah privasi | Justifikasi: *"Allows reading form schema on the currently active tab when invoked by the user."* |
| **Permission: `scripting`** | Digunakan untuk injeksi scanner | Diperbolehkan jika dibatasi pada tab aktif | Justifikasi: *"Injects lightweight form element inspection scripts to highlight input fields."* |
| **Permission: `sidePanel`** | Antarmuka native Chrome | Menggunakan API resmi Google Chrome 114+ | Justifikasi: *"Hosts the companion conversational UI alongside user web forms."* |
| **`host_permissions`** | `https://telmy-ai.cloud.run/*` | Sangat bersih! Sempit & spesifik ke backend sendiri | Pertahankan! Jangan gunakan wildcard `https://*/*` di `host_permissions` agar tidak memicu manual review level tinggi. |
| **`externally_connectable`** | Berisi Cloud Run, Firebase, dan `http://localhost:*` | ⚠️ **NOTASI KHUSUS: RISIKO TINGGI REVIEW REJECTION** | **Wajib Dihapus sebelum build CWS**: Hapus semua entri `http://localhost:*` dan `http://127.0.0.1:*` pada manifest produksi CWS. Hanya izinkan domain HTTPS resmi (`telmy.web.app`, `cloud.run`, `telmy.id`). |
| **`content_scripts` matches** | `["https://*/*", "http://*/*"]` | ⚠️ **NOTASI KHUSUS: BUTUH JUSTIFIKASI SINGLE PURPOSE** | Google akan menanyakan mengapa butuh injeksi di semua situs. Siapkan argumen baku: *"Telmy is a universal form assistant designed to guide users on public services, registration portals, and visa forms across any legitimate domain."* |
| **Mikrofon / Voice** | `permission/request-mic.html` | Sesuai kebijakan "Explicit User Consent" & Push-to-Talk | Pastikan mikrofon mati otomatis saat selesai berbicara dan tidak ada background listening. |
| **Sensitive Data (Password/CVV)** | Difilter di `sidepanel.js` & `scanner.js` | 100% Sesuai Google Sensitive Data Policy | Poin positif kuat: Telmy secara eksplisit mem-bypass field password dan kartu kredit dari AutoFill. |
| **Mock Data / Test Files** | Folder `extension/mock/` (`apostille-ahu.json`, dll.) | ⚠️ **NOTASI KHUSUS** | Periksa apakah `extension/mock/` perlu masuk dalam zip rilis. Jika hanya untuk unit test dev, sebaiknya dikecualikan dari zip agar ukuran kecil dan kode bersih. |

---

## ⚡ PILAR 3: STRATEGI REVIEW CEPAT (< 7 HARI) & MITIGASI MANUAL REVIEW TRIGGER

Penyebab umum review Chrome Web Store tertahan 2 hingga 4 minggu adalah **kurangnya kejelasan cara kerja bagi reviewer**, **izin yang terlalu luas**, atau **reviewer gagal melakukan login/testing**. Berikut strategi mitigasi terpadu:

### 3.1. Pengurangan Pemicu Manual Review (Anti-Trigger Principles)
1. **Pembersihan Manifest Produksi (Zero Development Artifacts):**
   - Menghapus semua URL `http://` dan port localhost dari `externally_connectable`.
   - Memastikan tidak ada sisa script debug atau console logging data sensitif.
2. **Kesesuaian Single Purpose (Single Purpose Policy):**
   - Fokus hanya pada satu tugas: *Membantu memahami dan mengisi formulir web*.
   - Tidak mencampur fitur ad-blocking, tab management, atau scraping data tak relevan.
3. **Penyusunan Formulir "Privacy Practices" yang Konsisten:**
   - Menyatakan secara transparan data apa yang dikumpulkan: *Personal identification information* (hanya disimpan terenkripsi secara lokal untuk fitur autofill profil), *Authentication information*.
   - Mencentang garansi:
     - *"Do not sell user data"* ✅
     - *"Do not use or transfer data for unrelated purposes"* ✅
     - *"Comply with Limited Use policy"* ✅

### 3.2. Fasilitas Pengujian untuk Reviewer (Reviewer Testing Kit — Wajib di "Notes for Reviewer")
> **Fakta Review CWS:** Reviewer manusia memiliki SLA waktu pengujian singkat. Jika mereka memasang ekstensi dan melihat layar login yang terkunci tanpa petunjuk, pengajuan akan langsung **ditolak** dengan alasan *"We were unable to test your item. Please provide valid login credentials and testing instructions."*

- [ ] **Akun Uji Coba Khusus Reviewer (Test Credentials):**
  - Email: `cws-reviewer@telmy.id` (atau akun uji coba terdaftar di Firebase).
  - Password: `PasswordReviewer123!`
  - Master PIN Vault (Zero-Knowledge): `123456`
  - Data Vault Dummy yang Sudah Terisi: Nama: *John Doe*, Paspor: *A12345678*, Tanggal Lahir: *1990-01-01*, Email: *john.doe@example.com*.
- [ ] **Halaman Demo Pengujian Interaktif (Dedicated Test Page):**
  - URL Form Demo Publik: `https://telmy-ai.cloud.run/demo`
  - Halaman ini berisi form resmi lengkap (Nama, Paspor, Kontak, Alamat) agar reviewer bisa langsung menekan tombol *AutoFill* dan *Audit* dalam 30 detik tanpa mencari situs web lain.
- [ ] **Video Demo Reviewer Tanpa Suara / Demo Walkthrough (Unlisted YouTube Link):**
  - Durasi: 60–90 detik.
  - Alur: Buka halaman demo -> Klik ikon Telmy -> Sidepanel terbuka -> Masukkan PIN `123456` -> Klik AutoFill -> Form terisi -> Klik Audit -> Muncul status hijau -> Tekan Mic (Push-to-Talk) bertanya satu hal -> Telmy menjawab.
  - Link video ini ditempelkan pada kolom *"Notes for Reviewer"*.

---

## 📦 PILAR 4: ARSITEKTUR FOLDER SIAP UPLOAD (`cws-submission/`)

Kita akan mempersiapkan sebuah direktori terisolasi bernama **`cws-submission/`** yang berisi seluruh berkas siap pakai untuk proses upload dan pengisian dashboard tanpa perlu mencari-cari lagi:

```text
telmy/
├── cws-submission/
│   │
│   ├── zip/
│   │   └── telmy-extension-v1.0.0.zip      <-- File zip steril (hanya file manifest, content, background, sidepanel, assets)
│   │
│   ├── store-assets/
│   │   ├── icon-128x128.png                <-- Ikon listing toko resolusi tepat 128x128 px
│   │   ├── promo-small-440x280.png         <-- Small Promotional Tile (440x280 px)
│   │   ├── promo-marquee-1400x560.png      <-- Marquee Banner (1400x560 px)
│   │   ├── screenshot-1-sidepanel.png      <-- Screenshot 1 (1280x800 px)
│   │   ├── screenshot-2-voicebot.png       <-- Screenshot 2 (1280x800 px)
│   │   ├── screenshot-3-vault-pin.png      <-- Screenshot 3 (1280x800 px)
│   │   ├── screenshot-4-autofill-audit.png <-- Screenshot 4 (1280x800 px)
│   │   └── screenshot-5-document-export.png<-- Screenshot 5 (1280x800 px)
│   │
│   ├── metadata/
│   │   └── cws_submission_metadata.txt     <-- File teks berisi copy-paste lengkap untuk seluruh field dashboard CWS
│   │
│   └── README_SUBMISSION.md                <-- Panduan langkah demi langkah saat login ke Chrome Developer Dashboard
```

### 4.1. Spesifikasi Isi `cws_submission_metadata.txt`:
File ini akan mencakup format siap copy-paste:
1. `ITEM_NAME` (Judul)
2. `SHORT_DESCRIPTION` (132 chars)
3. `DETAILED_DESCRIPTION` (Format markdown/plain)
4. `CATEGORY` & `PRIMARY_LANGUAGE`
5. `PRIVACY_POLICY_URL` & `SUPPORT_URL`
6. `SINGLE_PURPOSE_JUSTIFICATION` (Penjelasan tujuan tunggal ekstensi)
7. `PERMISSIONS_JUSTIFICATIONS`:
   - `storage`: Alasan pemakaian
   - `activeTab`: Alasan pemakaian
   - `scripting`: Alasan pemakaian
   - `sidePanel`: Alasan pemakaian
   - `host_permissions` (`https://telmy-ai.cloud.run/*`): Alasan pemakaian
8. `DATA_USAGE_DISCLOSURES` (Daftar centang jenis data & sertifikasi kepatuhan)
9. `NOTES_FOR_REVIEWER` (Instruksi testing reviewer, akun demo dummy, PIN demo, link halaman demo, dan link video demo).

### 4.2. Spesifikasi Script/Prosedur Packaging `telmy-extension-v1.0.0.zip`:
- **File yang Diikutsertakan:**
  - `manifest.json` (versi produksi bersih, tanpa localhost)
  - `background/service-worker.js`
  - `content/` (`content-main.js`, `scanner.js`, `highlighter.js`, `translator.js`, `overlay.css`, `panel.js`, `voice-manager.js`)
  - `sidepanel/` (`sidepanel.html`, `sidepanel.js`, `sidepanel.css`, `avatar-controller.js`, `crypto-vault.js`, `pdf-lib.min.js`)
  - `permission/` (`request-mic.html`, `request-mic.js`)
  - `assets/` (ikon `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`, `telmy-avatar.svg`, `telmy_icon.png`, `telmy_text.png`)
- **File/Folder yang Wajib Diabaikan (Excluded):**
  - `.git`, `.gitignore`, `.firebase`, `.dockerignore`
  - `node_modules`
  - `backend/`
  - `docs/`
  - `test-page/`
  - `plan*.md`, `README.md`, file `.DS_Store`, file `.zip` lama
  - `extension/mock/` (file mock testing internal)

---

## 📋 ROADMAP & URUTAN TAHAPAN PENGERJAAN (EXECUTION CHECKLIST)

Berikut urutan kerja sistematis yang akan kita eksekusi pada langkah berikutnya (tahap demi tahap, tanpa melompati pengujian):

### 🔹 TAHAP 1: Audit Kode & Penyiapan Manifest Produksi
- [x] **1.1.** Audit sanitasi manifest: Bersihkan `http://localhost:*` dan `http://127.0.0.1:*` dari `manifest.json` untuk versi rilis.
- [x] **1.2.** Verifikasi tidak ada panggilan API ke domain yang belum terdaftar di `host_permissions` (hanya `https://telmy-ai.cloud.run/*`).
- [x] **1.3.** Pengecekan file eksternal/remote: Pastikan tidak ada skrip yang memanggil CDN eksternal di seluruh file HTML ekstensi (semua bundle lokal).
- [x] **1.4.** Pengecekan fungsi offline/fallback: Pastikan saat API backend tidak merespons, ekstensi tetap menampilkan notifikasi ramah tanpa crashing.

### 🔹 TAHAP 2: Pembuatan Copywriting & File Teks Submisi
- [x] **2.1.** Finalisasi naskah `ITEM_NAME` (48 chars) dan `SHORT_DESCRIPTION` (120 chars) dengan batas karakter tervalidasi.
- [x] **2.2.** Finalisasi naskah `DETAILED_DESCRIPTION` berbahasa Inggris yang profesional dan memukau.
- [x] **2.3.** Penyusunan teks justifikasi teknis per permission (`storage`, `activeTab`, `scripting`, `sidePanel`, `host_permissions`).
- [x] **2.4.** Penyusunan teks instruksi pengujian reviewer (*Reviewer Testing Notes*) lengkap dengan kredensial dummy dan langkah navigasi.
- [x] **2.5.** Kompilasi seluruh teks ke dalam `cws-submission/metadata/cws_submission_metadata.txt`.

### 🔹 TAHAP 3: Pembuatan & Standardisasi Aset Visual
- [x] **3.1.** Validasi dan export ikon toko `icon-128x128.png` (tepat 128x128 px) berkualitas tinggi dari aset logo Telmy.
- [x] **3.2.** Pembuatan Promotional Tile `promo-small-440x280.png` (tepat 440x280 px) sesuai panduan Google Web Store.
- [x] **3.3.** Pembuatan Marquee Banner `promo-marquee-1400x560.png` (tepat 1400x560 px).
- [x] **3.4.** Penyusunan 5 Screenshot beresolusi tepat `1280x800` px yang menangkap alur kerja nyata:
  - Slide 1: `screenshot-1-sidepanel-guidance.png` (Sidepanel form guidance).
  - Slide 2: `screenshot-2-multilingual-voice.png` (Push-to-Talk Voicebot WaveNet 11 Languages).
  - Slide 3: `screenshot-3-dual-lock-vault.png` (Zero-Knowledge Dual-Lock Vault: Password / 12 Seed Words).
  - Slide 4: `screenshot-4-autofill-auditor.png` (Safe 1-Click AutoFill & Pre-Submission Auditor).
  - Slide 5: `screenshot-5-document-pdf-intelligence.png` (Document Ingestion & Certified PDF Export).

### 🔹 TAHAP 4: Packaging File ZIP Bersih & Validasi
- [x] **4.1.** Pembuatan skrip pemaket otomatis untuk menghasilkan `cws-submission/zip/telmy-extension-v1.0.0.zip` steril tanpa file sampah / hidden files / mock.
- [x] **4.2.** Pengujian unpacking zip dan verifikasi seluruh resource manifest (24 file produksi bersih terverifikasi).

### 🔹 TAHAP 5: Final Review & Checklist Sebelum Klik Submit
- [ ] **5.1.** Verifikasi kelengkapan akun Google Chrome Web Store Developer ($5 fee verified).
- [x] **5.2.** Verifikasi URL Kebijakan Privasi (`privacy.html`) dapat diakses secara publik lewat HTTPS (`https://telmy-ai.cloud.run/privacy`).
- [x] **5.3.** Verifikasi akun reviewer demo aktif di backend Firebase / Cloud Run (`reviewer@telmy-ai.cloud.run`).
- [ ] **5.4.** Cross-check checklist CWS di Developer Dashboard: Upload ZIP -> Upload Grafis -> Isi Metadata -> Isi Privacy Practices -> Masukkan Reviewer Notes -> Submit for Review.
