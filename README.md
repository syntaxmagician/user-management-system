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

```bash
# Clone repo
git clone <repo-url>
cd user-management-system

# Copy env
cp .env.example .env
# Edit .env jika perlu (default docker-compose sudah sesuai)

# Jalankan PostgreSQL + Redis + Backend
docker-compose up -d

# API: http://localhost:4000
```

## Setup Manual (tanpa Docker)

### 1. Database & Redis

- Pasang PostgreSQL dan Redis, buat database `user_management`.
- Copy `.env.example` ke `.env` dan sesuaikan `DATABASE_URL` dan `REDIS_URL`.

### 2. Backend

```bash
cd backend
npm install
npm run db:migrate   # atau jalankan SQL di docs/schema.sql
npm run dev
```

API berjalan di **http://localhost:4000**.

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

## Dokumentasi API Singkat

| Method | Endpoint              | Auth | Deskripsi                    |
| ------ | --------------------- | ---- | ---------------------------- |
| POST   | `/api/v1/auth/register` | -    | Registrasi (email, password) |
| POST   | `/api/v1/auth/login`    | -    | Login (email, password)      |
| POST   | `/api/v1/auth/refresh`  | -    | Refresh token (body: refreshToken) |
| GET    | `/api/v1/users`         | Yes  | List user (paginated, search) |
| POST   | `/api/v1/users`         | Yes  | Create user                  |
| PUT    | `/api/v1/users/:id`     | Yes  | Update user                  |
| DELETE | `/api/v1/users/:id`     | Yes  | Delete user (hard delete)    |

**Query params untuk GET /users:**

- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `search` (optional): cari nama/email

**Auth:** Header `Authorization: Bearer <access_token>`.

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

## Commit Strategy (Push Bertahap)

Lihat [COMMIT_STRATEGY.md](./COMMIT_STRATEGY.md) untuk urutan commit yang disarankan agar history GitHub terlihat rapi dan profesional.

## License

MIT
