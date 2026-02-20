# User Management System

Aplikasi manajemen user dengan **Backend API (Node.js)**, **Dashboard (Next.js)**, dan **Aplikasi Mobile (React Native / Expo)**.

## Tech Stack

| Layer    | Teknologi                          |
| -------- | ---------------------------------- |
| Backend  | Node.js (TypeScript), Express      |
| Database | PostgreSQL                         |
| Cache    | Redis (session / refresh token)    |
| Frontend | Next.js 14, TypeScript, Tailwind   |
| State    | Zustand                            |
| Mobile   | React Native (Expo)                |

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- (Optional) Docker & Docker Compose

## Quick Start dengan Docker

### Langkah 1: Clone dan Setup Environment

```bash
# Clone repo
git clone <repo-url>
cd user-management-system

# Copy env
cp .env.example .env
# Edit .env jika perlu (default docker-compose sudah sesuai)
```

### Langkah 2: Start Docker Services

```bash
# Jalankan PostgreSQL + Redis + Backend
docker-compose up -d

# Tunggu beberapa detik hingga semua service ready
# Cek status dengan:
docker-compose ps
```

### Langkah 3: Setup Database (Migration)

```bash
# Masuk ke container backend
docker exec -it ums-backend sh

# Atau jika menggunakan setup manual, jalankan dari folder backend:
cd backend
npm install
npm run db:migrate
```

**Jika menggunakan Docker:**
```bash
# Pastikan dependencies terinstall terlebih dahulu
docker exec -it ums-backend sh -c "cd /app && npm install"

# Dari dalam container backend
npm run db:migrate
```

**Jika menggunakan setup manual:**
```bash
# Dari folder backend
npm run db:migrate
# atau jalankan SQL manual di docs/schema.sql
```

### Langkah 4: Import Seed Data (Admin + 10 Dummy Users)

**Cara 1: Menggunakan Script TypeScript (DISARANKAN)**

```bash
# Jika menggunakan Docker, masuk ke container backend
docker exec -it ums-backend sh

# Jalankan seed script
npm run db:seed
```

**Jika menggunakan setup manual:**
```bash
# Dari folder backend
cd backend
npm run db:seed
```

**Cara 2: Import SQL Langsung (Alternatif)**

```bash
# Dari host machine (jika menggunakan Docker)
docker exec -i ums-postgres psql -U postgres -d user_management < docs/seed.sql

# Atau jika setup manual, jalankan:
psql -U postgres -d user_management < docs/seed.sql
```

> **Catatan:** Script TypeScript (`npm run db:seed`) lebih disarankan karena password hash di-generate dengan bcrypt secara dinamis dan lebih aman.

### Langkah 5: Verifikasi Setup

Setelah seed selesai, Anda akan melihat output seperti:
```
✓ Admin user created: admin@example.com
✓ User created: john.doe@example.com
✓ User created: jane.smith@example.com
...
✅ Seed data completed successfully!

📝 Login credentials:
   Email: admin@example.com
   Password: password123
```

**API sudah siap digunakan di:** http://localhost:4000

**📚 API Documentation (Swagger):** http://localhost:4000/api-docs

**Login dengan:**
- Email: `admin@example.com`
- Password: `password123`

**Daftar semua user yang dibuat:**
1. `admin@example.com` - Admin User
2. `john.doe@example.com` - John Doe
3. `jane.smith@example.com` - Jane Smith
4. `bob.johnson@example.com` - Bob Johnson
5. `alice.williams@example.com` - Alice Williams
6. `charlie.brown@example.com` - Charlie Brown
7. `diana.davis@example.com` - Diana Davis
8. `edward.miller@example.com` - Edward Miller
9. `fiona.wilson@example.com` - Fiona Wilson
10. `george.moore@example.com` - George Moore
11. `helen.taylor@example.com` - Helen Taylor

*(Semua user menggunakan password yang sama: `password123`)*

## Setup Manual (tanpa Docker)

### 1. Database & Redis

- Pasang PostgreSQL dan Redis, buat database `user_management`.
- Copy `.env.example` ke `.env` dan sesuaikan `DATABASE_URL` dan `REDIS_URL`.

### 2. Backend

```bash
cd backend
npm install

# Setup database schema
npm run db:migrate   # atau jalankan SQL di docs/schema.sql

# Import seed data (admin + 10 dummy users)
npm run db:seed      # atau import SQL di docs/seed.sql

npm run dev
```

API berjalan di **http://localhost:4000**.

**📚 API Documentation (Swagger):** http://localhost:4000/api-docs

**Login credentials setelah seed:**
- Email: `admin@example.com`
- Password: `password123`

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Dashboard: **http://localhost:3000**.

### 4. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

- **Expo Go:** Scan QR code dengan aplikasi Expo Go (Android/iOS) untuk menjalankan di perangkat fisik.
- **Android emulator:** Tekan `a` di terminal setelah `npx expo start`.
- **iOS simulator (mac only):** Tekan `i` di terminal.

Jika menggunakan perangkat fisik, pastikan backend bisa diakses dari HP. Set `EXPO_PUBLIC_API_URL` di `.env` (atau `mobile/.env`) ke URL mesin Anda, misalnya `http://192.168.1.x:4000/api/v1`.

## Standar Response API

Semua endpoint mengikuti format berikut.

**Sukses (single resource):**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Sukses (list dengan pagination):**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": []
  }
}
```

## Dokumentasi API

### Swagger UI (Interactive Documentation)

Setelah backend berjalan, akses dokumentasi API interaktif di:

**http://localhost:4000/api-docs**

Swagger UI menyediakan:
- 📖 Dokumentasi lengkap semua endpoint
- 🧪 Try it out - test API langsung dari browser
- 🔐 Authorization - masukkan token untuk test protected endpoints
- 📋 Request/Response examples

### Quick Reference

| Method | Endpoint              | Auth | Deskripsi                    |
| ------ | --------------------- | ---- | ---------------------------- |
| POST   | `/api/v1/auth/register` | -    | Registrasi (email, password) |
| POST   | `/api/v1/auth/login`    | -    | Login (email, password)      |
| POST   | `/api/v1/auth/refresh`  | -    | Refresh token (body: refreshToken) |
| GET    | `/api/v1/users`         | Yes  | List user (paginated, search) |
| POST   | `/api/v1/users`         | Yes  | Create user                  |
| PUT    | `/api/v1/users/:id`     | Yes  | Update user                  |
| DELETE | `/api/v1/users/:id`     | Yes  | Delete user (soft delete)    |

**Query params untuk GET /users:**

- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `search` (optional): cari nama/email

**Auth:** Header `Authorization: Bearer <access_token>`.

> 💡 **Tip:** Gunakan Swagger UI untuk dokumentasi lengkap dan testing API secara interaktif!

## Struktur Proyek

```
user-management-system/
├── backend/          # Node.js API
├── frontend/         # Next.js Dashboard
├── mobile/           # Expo app
├── docker-compose.yaml
├── .env.example
└── README.md
```

