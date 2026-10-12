# 📋 MASTER PLAN V8: Integrasi Menu Aksesibilitas (A11y Hub) & Redesain Onboarding Telmy.id

---

## 🎯 1. Ringkasan & Filosofi Desain

### A. Prinsip Utama: *"Simpel, 1-Klik Langsung Aktif, Zero Kerumitan"*
Sesuai arahan, pengguna telmy.id (termasuk lansia dan penyandang disabilitas) membutuhkan antarmuka yang sangat mudah dipahami tanpa kontrol atau slider konfigurasi yang rumit. 
* **Sistem Onboarding Simetris**: Grid tepat **3 Baris x 2 Kolom** (total 6 tombol praktis).
* **Fitur Aksesibilitas Ala UserWay (Single-Click Cycle)**: Setiap kartu aksesibilitas bekerja secara **siklus 1-klik** (misal: *Klik 1: +25% ➔ Klik 2: +50% ➔ Klik 3: +75% ➔ Klik 4: +100% ➔ Klik 5: Normal kembali*), atau toggle ON/OFF instan tanpa popup slider yang menyulitkan.
* **Toolbar 3 Baris Lama Dihapus**: Toolbar di sub-header panel (`Spotlight`, `Baca Teks`, `Tampilan`) dihapus sepenuhnya dan dilebur ke dalam A11y Hub.

---

## 📱 2. Desain Layout Onboarding (Tepat 3 Baris x 2 Kolom)

Halaman utama / Welcome Hero di chat stream diubah menjadi layout **3 baris x 2 kolom yang presisi dan simetris**:

| Baris | Kolom Kiri | Kolom Kanan |
|:---:|:---|:---|
| **Baris 1** | 🔍 **1. Analyze This Form** | 🌐 **2. Translate This Page** *(AI Powered)* |
| **Baris 2** | ⚡ **3. 1-Click Auto Fill** | 📄 **4. Upload Local PDF Forms** |
| **Baris 3** | 👆 **5. Tunjukkan / Cari di Layar** *(Show Me)* | ♿ **6. Aksesibilitas** *(Accessibility Hub)* |

> Ketika tombol **♿ 6. Aksesibilitas** di baris ke-3 diklik, panel akan membuka tampilan **Menu Aksesibilitas Lengkap (A11y Hub)**.

---

## ♿ 3. Menu Aksesibilitas Lengkap (A11y Hub) Ala UserWay

### A. Navigasi & Kontrol Header
* **Tombol Kembali**: `← Kembali` (langsung kembali ke tampilan utama onboarding/chat).
* **Judul**: `Menu Aksesibilitas (CTRL+U / Alt+A)`
* **Tombol Reset Cepat**: `🔄 Reset Normal` (satu klik untuk mematikan semua modifikasi web ke kondisi semula).

### B. Mekanisme Interaksi Kartu (Single-Click Cycle System)
Setiap kartu menampilkan **Ikon**, **Nama Fitur**, dan **Badge Level Status** (misal: `Mati`, `25%`, `50%`, `75%`, `100%`, atau `Aktif`). Pengguna cukup mengklik kartunya:

| No | Kartu Fitur | Ikon | Mekanisme Klik (Siklus 1-Klik) | Efek Langsung pada Halaman Web |
|:---:|:---|:---:|:---|:---|
| **1** | **Form Spotlight** | 🔦 | **Toggle (Mati ⇄ Aktif)** | Meredupkan web & fokus hanya menyorot kolom formulir aktif (*Fitur Utama Telmy*). |
| **2** | **Baca Teks** | 🔊 | **Toggle (Mati ⇄ Aktif)** | Mode Click-to-Speak: klik teks/label apa pun di web langsung dibacakan suara (*Fitur Telmy*). |
| **3** | **Kontras +** | 🌓 | **4 Siklus**: Normal ➔ Kontras Tinggi (+25%) ➔ Ekstra (+50%) ➔ Kuning-Hitam (AAA) ➔ Normal | Menaikkan kontras warna teks dan latar belakang web secara drastis. |
| **4** | **Sorot Tautan** | 🔗 | **Toggle (Mati ⇄ Aktif)** | Memberikan garis bawah tebal & highlight visual mencolok pada semua link. |
| **5** | **Teks Lebih Besar** | 🔠 | **5 Siklus**: Normal ➔ +25% ➔ +50% ➔ +75% ➔ +100% ➔ Normal | Memperbesar ukuran huruf seluruh website secara bertahap tanpa merusak layout. |
| **6** | **Spasi Teks** | ↔️ | **4 Siklus**: Normal ➔ Ringan (+25%) ➔ Sedang (+50%) ➔ Lebar (+75%) ➔ Normal | Menambah jarak huruf (*letter-spacing*) dan kata (*word-spacing*). |
| **7** | **Animasi Dijeda** | ⏸️ | **Toggle (Mati ⇄ Aktif)** | Menghentikan semua animasi CSS, video/gif bergerak, dan ticker/marquee. |
| **8** | **Sembunyikan Gambar** | 🖼️❌ | **Toggle (Mati ⇄ Aktif)** | Menyembunyikan gambar dekoratif & banner agar mata fokus ke formulir. |
| **9** | **Ramah Disleksia** | 🔤 | **Toggle (Mati ⇄ Aktif)** | Mengganti seluruh jenis huruf website dengan font ramah disleksia (*OpenDyslexic*). |
| **10** | **Kursor** | 🖱️ | **3 Siklus**: Normal ➔ Kursor Besar Putih ➔ Kursor Besar Hitam/Kontras ➔ Normal | Memperbesar ukuran kursor mouse agar mudah dilihat dan tidak hilang di layar. |
| **11** | **Keterangan Alat** | 💬 | **Toggle (Mati ⇄ Aktif)** | Menampilkan tooltip/keterangan bantu permanen pada kolom dan tombol. |
| **12** | **Tinggi Garis** | ↕️ | **4 Siklus**: Normal ➔ +25% ➔ +50% ➔ +75% ➔ Normal | Merenggangkan jarak antar-baris kalimat (*line-height*). |
| **13** | **Perataan Teks** | 📄 | **3 Siklus**: Default ➔ Rata Kiri (Left) ➔ Rata Kanan (Right) ➔ Default | Memaksa perataan teks halaman web agar nyaman dibaca. |
| **14** | **Kejenuhan** | 💧 | **4 Siklus**: Normal ➔ Rendah (-50%) ➔ Monokrom (Grayscale 100%) ➔ Tinggi (+50%) ➔ Normal | Mengatur kejenuhan warna untuk mata sensitif cahaya atau silau. |

---

## 🛠️ 4. Spesifikasi Perubahan Teknis (Files to Modify)

### 1. `extension/sidepanel/sidepanel.html`
* **Hapus** toolbar lama `#sp-a11y-toolbar` dan drawer `#a11y-drawer-popover` dari sub-header.
* **Tambahkan** View/Layar `#pane-a11y-hub` (default disembunyikan):
  * Header A11y dengan tombol `#btn-a11y-back` dan `#btn-a11y-reset`.
  * Grid 2 kolom kartu interaktif untuk 14 fitur di atas.

### 2. `extension/sidepanel/sidepanel.css`
* **Onboarding Grid**: Ubah `.welcome-chips-grid` menjadi CSS Grid `grid-template-columns: repeat(2, 1fr)` dengan 3 baris simetris.
* **A11y Hub Tiles**: Desain kartu bergaya modern:
  * Bentuk kartu kotak sudut membulat, padding nyaman, ikon proporsional di atas/kiri.
  * Indikator status / badge pill kecil di pojok kartu (misal: `+50%`, `ON`, `OFF`).
  * Efek visual aktif (garis tepi biru cerah + background lembut).

### 3. `extension/sidepanel/sidepanel.js`
* Update pembuatan tombol onboarding agar merender 6 tombol dalam grid 2 kolom.
* Handler klik untuk tombol ke-6: membuka view `#pane-a11y-hub`.
* Handler tombol `#btn-a11y-back`: menutup A11y Hub dan kembali ke Chat/Onboarding.
* State cycle manager untuk ke-14 fitur:
  * Menyimpan state di `chrome.storage.local`.
  * Mengirim pesan `A11Y_UPDATE_STATE` ke `content.js` pada tab aktif.
  * Tombol Reset: reset semua nilai ke default/0 dalam 1 klik.

### 4. `extension/content/content.js` & `extension/content/content.css`
* Menangani class modifier dan style dinamis pada halaman web sesuai state yang dikirim:
  * Font sizing: CSS variable `--telmy-text-scale` atau class `.telmy-text-scale-1..4`.
  * Spasi teks & tinggi baris: class `.telmy-spacing-1..3`, `.telmy-lineheight-1..3`.
  * Kontras & Desaturasi: filter dan class CSS kontras tinggi / grayscale.
  * Dyslexia font: font-family injection OpenDyslexic.
  * Big cursor: class custom cursor SVG high-contrast.
  * Pause animation: `* { animation-play-state: paused !important; transition: none !important; }`.
  * Hide images: `img, svg:not(.telmy-keep), video { opacity: 0.05 !important; }`.
  * Pertahankan handler Spotlight dan Click-to-Speak eksisting.

---

## 🚀 5. Tahapan Eksekusi Bertahap

- [x] **Langkah 1: Pembersihan Toolbar Lama**
  * Hapus elemen `#sp-a11y-toolbar` di `sidepanel.html`.
  * Rapikan layout header sidepanel agar bersih dan tidak berdesakan.
- [x] **Langkah 2: Redesain Onboarding 3 Baris x 2 Kolom**
  * Ubah grid hero di `sidepanel.js` & `sidepanel.css` menjadi 6 tombol (Show Me & Aksesibilitas di baris ke-3).
- [x] **Langkah 3: Pembuatan View A11y Hub & 14 Kartu Ala UserWay**
  * Buat template HTML untuk A11y Hub dengan tombol Kembali, Reset, dan 14 kartu.
  * Berikan styling CSS UserWay-style dengan state cycle & badge visual.
- [x] **Langkah 4: Integrasi Fitur Eksisting (Spotlight & Baca Teks)**
  * Sambungkan logika Spotlight dan Click-to-Speak langsung ke dalam kartu A11y Hub.
- [x] **Langkah 5: Implementasi Engine Siklus 1-Klik di Content Script**
  * Buat stylesheet & script injector untuk Kontras, Teks Besar, Spasi, Animasi, Gambar, Disleksia, Kursor, Tinggi Garis, Perataan, dan Kejenuhan.
- [x] **Langkah 6: Pengujian Lengkap & Verifikasi**
  * Verifikasi klik onboarding, transisi buka/tutup A11y Hub, tombol reset, dan keaktifan efek pada tab browser.
