# PRD: AI Form Explainer

Status: Draf v0.1 untuk hackathon | Platform: Ekstensi Chrome + Cloud Run + Firebase + Gemini API

## 1. Ringkasan

AI Form Explainer adalah ekstensi Chrome gratis yang memindai form di situs layanan pemerintah, lalu menyorot tiap field dan menampilkan penjelasan dalam bahasa pengguna: arti field, cara mengisi, contoh isian fiktif, dan kesalahan umum. Penjelasan diambil dari **kamus terverifikasi** di Firestore. Gemini API dipakai untuk menerjemahkan, menyederhanakan bahasa, dan membuat draf penjelasan untuk field yang belum ada di kamus.

## 2. Latar belakang dan masalah

Riset awal menunjukkan layanan digital pemerintah di kawasan ini masih menyulitkan penggunanya:

- Indonesia berada di peringkat 64 dari 193 pada UN E-Government Survey 2024 (naik dari 77), sementara Jepang 13 dan China 35.
- Survei Deloitte/VMware 2022 di 7 negara Asia Pasifik menemukan 41% warga kesulitan mengakses layanan digital sendiri.
- Di Indonesia, pelaku usaha daerah butuh pendampingan untuk OSS-RBA (studi KPPOD 2021), dan Coretax menuai keluhan sejak peluncuran awal 2025.
- Literatur UX form (sumber industri, bukan akademik ketat) menyebut label ambigu dan aturan input yang tidak jelas sebagai pemicu kebingungan dan abandonment.

**Hipotesis yang harus divalidasi:** sebagian kesulitan pengguna baru (terutama WNA dan pengguna pertama kali) berasal dari arti, bahasa, atau format field, bukan dari error sistem atau keputusan perizinan. Hipotesis ini diuji di bagian 10.

## 3. Tujuan dan bukan tujuan

**Tujuan (MVP hackathon)**

1. Pengguna bisa memahami dan mengisi satu form target dengan lebih sedikit kesalahan dan henti.
2. Penjelasan tersedia dalam minimal 3 bahasa.
3. Isi penjelasan dapat dipercaya: ada status verifikasi dan jalur koreksi.
4. Data isian pengguna tidak pernah meninggalkan browser.

**Bukan tujuan**

- Mengisi form otomatis atau mengeklik atas nama pengguna.
- Memperbaiki server error atau lambatnya situs pemerintah.
- Memberi nasihat hukum, pajak, atau imigrasi.
- Mendukung ponsel (Chrome Android umumnya tidak mendukung ekstensi desktop).
- Memonetisasi (donasi sukarela saja).

## 4. Pengguna

| Persona | Kebutuhan | Prioritas |
| --- | --- | --- |
| WNA yang mengurus izin atau pajak di Indonesia | Memahami istilah dan format form dalam bahasanya | Utama |
| Warga atau pelaku usaha yang baru pertama kali mengisi form | Penjelasan istilah dan contoh isian | Utama |
| Peninjau kamus (relawan atau admin) | Memverifikasi draf dan memproses saran | Pendukung |

## 5. Lingkup MVP

- **Satu form target** dengan 15 sampai 25 field. Pilihan: pendaftaran NIB di OSS atau form lain yang sering dihadapi WNA (keputusan di bagian 12).
- **Bahasa:** Indonesia, Inggris, dan satu bahasa Asia (usulan: Mandarin atau Jepang). Bahasa lain disebut sebagai arah pengembangan.
- **Browser:** Chrome desktop.

## 6. Kebutuhan fungsional

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-1 | Pengguna mengaktifkan ekstensi secara manual; ekstensi tidak memindai halaman sebelum diaktifkan. | Wajib |
| FR-2 | Ekstensi memindai DOM dan mengambil label, tipe input, placeholder, atribut validasi, dan judul seksi tiap field. **Tidak membaca nilai yang diisi pengguna.** | Wajib |
| FR-3 | Setiap field disorot dan memiliki ikon penjelasan; klik membuka panel berisi arti, cara mengisi, contoh fiktif, dan kesalahan umum. | Wajib |
| FR-4 | Pengguna memilih bahasa; penjelasan tampil dalam bahasa itu. | Wajib |
| FR-5 | Backend mengecek kamus Firestore lebih dulu; jika belum ada, Gemini membuat draf. | Wajib |
| FR-6 | Setiap penjelasan menampilkan lencana status: "Terverifikasi (tanggal)" atau "Dibuat AI, belum diverifikasi". | Wajib |
| FR-7 | Hasil terjemahan di-cache per kombinasi field dan bahasa. | Wajib |
| FR-8 | Tombol "Sarankan perbaikan" mengirim saran ke antrean peninjauan, tidak langsung mengubah kamus. | Wajib |
| FR-9 | Dashboard peninjau (login) untuk memverifikasi draf, mengedit, dan memproses saran. | Wajib |
| FR-10 | Pencocokan field memakai kombinasi domain, label ternormalisasi, tipe input, dan konteks seksi; kegagalan cocok dicatat. | Wajib |
| FR-11 | Rating "membantu / tidak membantu" per penjelasan. | Sebaiknya |
| FR-12 | Rujukan sumber resmi di penjelasan (tautan atau judul dokumen). | Sebaiknya |
| FR-13 | Penjelas pesan error situs: pengguna menyorot teks error, ekstensi menjelaskan maknanya. | Opsional |
| FR-14 | Mode screenshot untuk form di iframe, PDF, atau canvas. | Opsional |
| FR-15 | Pemantau perubahan form (Cloud Scheduler + job pemindai). | Opsional |

## 7. Kebutuhan non-fungsional

**Privasi dan keamanan**

- Hanya metadata field yang dikirim ke backend; redaksi lokal (NIK, NPWP, email, nomor telepon) sebelum kirim sebagai lapis kedua.
- API key Gemini hanya di Cloud Run (disarankan Secret Manager), tidak pernah di ekstensi.
- Firebase App Check dan pembatasan laju per pengguna untuk mencegah penyalahgunaan.
- Izin ekstensi seminimal mungkin; kebijakan privasi publik.
- Tidak menyimpan log isi halaman; log hanya identitas field dan status.

**Kinerja (target awal, perlu divalidasi)**

- Penjelasan dari cache tampil di bawah 1 detik; dari Gemini di bawah 5 detik.
- Jika backend atau Gemini gagal, tampilkan penjelasan kamus yang ada atau pesan jelas, tanpa memblokir form.

**Biaya**

- Cache terjemahan, pilihan model yang hemat, budget alert di Google Cloud, kuota harian per pengguna. Cek harga dan kuota Gemini terbaru sebelum menetapkan batas.

**Aksesibilitas dan lokalisasi**

- Panel penjelasan dapat dinavigasi keyboard dan terbaca pembaca layar; mendukung teks arah kanan-ke-kiri jika bahasa tersebut ditambahkan.

## 8. Arsitektur ringkas

Ekstensi Chrome → Cloud Run API → Firestore (kamus, cache, antrean saran) dan Gemini API. Dashboard peninjau di Firebase Hosting dengan Firebase Auth.

**Alur satu permintaan:** ekstensi mengirim metadata field + bahasa → Cloud Run mereduksi data dan memvalidasi App Check → cek Firestore → bila ada, kembalikan; bila tidak, panggil Gemini, simpan draf berstatus "belum diverifikasi", kembalikan.

**Endpoint (usulan)**

- `POST /explain` : daftar field + bahasa, mengembalikan penjelasan.
- `POST /feedback` : saran perbaikan atau rating.
- `GET /health`.

**Koleksi Firestore (usulan)**

- `entries`: kunci pencocokan, label asli, penjelasan (id/en), contoh, aturan validasi, sumber, status, tanggal verifikasi, versi form.
- `translations`: entri + bahasa, teks, asal (Gemini/manusia), tanggal.
- `suggestions`: entri, jenis, teks, status, waktu.
- `unmatched`: field yang tidak cocok kamus, hitungan, terakhir terlihat.

## 9. Desain penggunaan Gemini

- **Keluaran terstruktur (JSON):** arti, cara mengisi, contoh fiktif, kesalahan umum, catatan untuk WNA, tingkat keyakinan.
- **Grounding:** prompt menyertakan entri kamus atau dokumen resmi sebagai konteks; model dilarang menambah aturan di luar konteks. Jika konteks tidak ada, model wajib menandai "tidak yakin".
- **Peran Gemini:** menerjemahkan, menyederhanakan, dan membuat draf. Bukan sumber kebenaran.
- **Contoh isian** harus jelas fiktif dan diberi label "contoh".
- **Pemilihan model:** pilih model Gemini yang cukup ringan untuk penjelasan field; verifikasi nama dan batas terbaru di dokumentasi sebelum implementasi.

## 10. Rencana validasi dan metrik

**Uji sebelum membangun (1 sampai 2 hari):** 5 orang yang belum pernah mengisi form target diamati saat mengisinya; catat titik berhenti dan penyebabnya (arti, bahasa, format, keputusan, error sistem). **Kriteria lanjut:** minimal separuh hambatan adalah arti, bahasa, atau format. Jika mayoritas berupa keputusan atau error sistem, ubah arah ke pendamping persiapan dokumen atau penjelas error.

**Uji setelah MVP:** 5 sampai 10 orang mengisi form yang sama, setengahnya dengan ekstensi.

| Metrik | Cara ukur |
| --- | --- |
| Waktu penyelesaian | Pengamatan langsung |
| Jumlah kesalahan atau field ditinggalkan | Pengamatan langsung |
| Persentase penjelasan "membantu" | Rating per field |
| Cakupan kamus untuk form target | Field terverifikasi / total field |
| Biaya per sesi | Billing Google Cloud |

Catatan: sampel kecil bukan bukti statistik; laporkan sebagai uji awal.

## 11. Risiko

| Risiko | Mitigasi |
| --- | --- |
| Penjelasan salah menyebabkan salah isi | Kamus terverifikasi, lencana status, rujukan sumber, disclaimer bukan nasihat hukum |
| Situs mengubah form sehingga pencocokan gagal | Pencocokan fuzzy multi-sinyal, log unmatched, pemantau perubahan (opsional) |
| Kompetitor bawaan (Gemini in Chrome) | Nilai pada kamus lokal terverifikasi dan privasi |
| Biaya API membengkak | Cache, kuota, budget alert |
| Penyalahgunaan endpoint | App Check, rate limit, validasi input |
| Kekhawatiran privasi pengguna | Kirim metadata saja, kebijakan privasi, kode atau arsitektur yang transparan |
| Kualitas terjemahan tidak merata | Uji tiap bahasa demo dengan penutur asli |
| Ditolak review Chrome Web Store | Izin minimal, kirim lebih awal |
| Proyek berhenti karena satu pemelihara | Open source, antrean kontributor, rencana donasi |

## 12. Pertanyaan terbuka

1. Form target mana yang dipilih untuk MVP (OSS/NIB atau form lain untuk WNA)?
2. Tenggat hackathon dan ukuran tim?
3. Bahasa ketiga yang didemokan?
4. Siapa yang memverifikasi kamus selama hackathon?
5. Apakah akan menghubungi instansi terkait untuk sumber resmi?
6. Kebijakan Chrome Web Store terkait donasi dan tautan eksternal (perlu dicek).

## 13. Rencana kerja (usulan, sesuaikan tenggat)

1. **Validasi:** uji 5 pengguna, pilih form target.
2. **Fondasi:** Cloud Run + Firestore + panggilan Gemini dengan JSON terstruktur.
3. **Ekstensi:** pemindaian, sorotan, panel penjelasan, pilihan bahasa.
4. **Kualitas:** kamus untuk field target, lencana status, tombol saran, dashboard peninjau.
5. **Uji dan demo:** uji 5 sampai 10 pengguna, siapkan demo 3 menit, kirim ke Chrome Web Store.
6. **Bonus bila sempat:** penjelas error, mode screenshot, pemantau perubahan.

## 14. Arah pengembangan

Cakupan form dan bahasa lebih luas, rujukan dokumen resmi otomatis, dashboard "field paling membingungkan" untuk instansi, bantuan suara, dan dukungan peramban lain.