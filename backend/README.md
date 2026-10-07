# GuideMe.To (GMT) Backend API

Backend service untuk ekstensi Chrome **GuideMe.To (GMT) — AI Form Explainer**, siap dijalankan di lokal dengan Node.js dan siap di-deploy langsung ke **Google Cloud Run**.

---

## 🛠️ Persiapan & Menjalankan di Lokal

### 1. Masuk ke folder backend & pastikan dependensi terinstal
```bash
cd backend
npm install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel berikut:
```env
PORT=8080
GEMINI_API_KEY=AIzaSy... # Dapatkan gratis di https://aistudio.google.com/
```

### 3. Setup Firebase Firestore (Opsi A)
1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru (atau gunakan yang sudah ada).
2. Aktifkan **Cloud Firestore** di menu Build -> Firestore Database (pilih mode Test atau Production).
3. Buka **Project Settings** (ikon gerigi) -> tab **Service accounts**.
4. Klik **Generate new private key** (akan terunduh file `.json`).
5. Ubah nama file tersebut menjadi `serviceAccountKey.json` dan letakkan di dalam folder `backend/`:
   ```text
   backend/
   ├── serviceAccountKey.json   <-- Letakkan di sini (sudah masuk .gitignore)
   ├── src/
   ├── package.json
   └── ...
   ```

### 4. Seed Kamus Awal ke Firestore (Opsional tapi Direkomendasikan)
Untuk mengunggah seluruh data formulir Apostille AHU (5 bahasa) ke Firestore secara otomatis:
```bash
npm run seed
```

### 5. Jalankan Server di Lokal
```bash
npm run dev
```
Server akan aktif di: `http://localhost:8080`  
Cek kesehatan server di: `http://localhost:8080/health`

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Health check server, status Firestore, dan Gemini API |
| `POST` | `/api/explain` | Menjelaskan kolom form (cek Firestore dulu, jika belum ada panggil Gemini AI) |
| `POST` | `/api/feedback/suggestion` | Pengguna mengirimkan saran perbaikan / koreksi |
| `POST` | `/api/feedback/rating` | Pengguna memberikan rating (membantu / tidak) |
| `GET` | `/api/feedback/suggestions` | Daftar saran untuk Dashboard Peninjau |
| `GET` | `/api/dictionary` | Mengambil seluruh entri kamus terverifikasi |
| `PUT` | `/api/dictionary/:id/verify` | Menyetujui draf AI menjadi kamus terverifikasi |

---

## 🚀 Deployment ke Google Cloud Run

Karena backend ini sudah memiliki [Dockerfile](Dockerfile) standar:

1. Pastikan gcloud CLI terpasang dan login:
   ```bash
   gcloud auth login
   gcloud config set project [PROJECT_ID_ANDA]
   ```
2. Deploy langsung dari folder `backend/`:
   ```bash
   gcloud run deploy guidemeto-api \
     --source . \
     --region asia-southeast2 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="[API_KEY_ANDA]"
   ```
3. Cloud Run secara otomatis menggunakan **Application Default Credentials (ADC)** untuk Firestore, sehingga file `serviceAccountKey.json` tidak perlu diunggah ke image production.
