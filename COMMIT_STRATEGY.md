# Strategi Commit Bertahap (GitHub)

Gunakan urutan commit berikut agar history terlihat profesional dan mudah di-review.

---

## 1. Initial project setup & DevOps

**Commit message:** `chore: initial project setup, docker-compose, and env template`

**Files to include:**
- `.gitignore`
- `.env.example`
- `docker-compose.yaml`
- `README.md`
- `COMMIT_STRATEGY.md` (this file)

```bash
git init
git add .gitignore .env.example docker-compose.yaml README.md COMMIT_STRATEGY.md
git commit -m "chore: initial project setup, docker-compose, and env template"
```

---

## 2. Backend – project scaffolding & dependencies

**Commit message:** `feat(backend): add Node.js project with clean architecture layout`

**Directory:** `backend/`
- `package.json`, `tsconfig.json`
- Folder structure: `src/domain`, `src/application`, `src/infrastructure`, `src/delivery`, `src/shared`

```bash
git add backend/
git commit -m "feat(backend): add Node.js project with clean architecture layout"
```

---

## 3. Backend – database layer & user model

**Commit message:** `feat(backend): add PostgreSQL connection and user entity`

**Include:** DB config, User model/entity, migration or schema SQL.

```bash
git add backend/
git commit -m "feat(backend): add PostgreSQL connection and user entity"
```

---

## 4. Backend – Redis & refresh token store

**Commit message:** `feat(backend): add Redis client and refresh token storage`

**Include:** Redis connection, refresh token repository.

```bash
git add backend/
git commit -m "feat(backend): add Redis client and refresh token storage"
```

---

## 5. Backend – authentication (JWT, Bcrypt)

**Commit message:** `feat(backend): implement auth with JWT and Bcrypt`

**Include:** Register, Login, JWT access + refresh, Bcrypt hashing.

```bash
git add backend/
git commit -m "feat(backend): implement auth with JWT and Bcrypt"
```

---

## 6. Backend – middleware (auth, logger, error handling)

**Commit message:** `feat(backend): add auth middleware, logger, and central error handling`

**Include:** Auth middleware, request logger, global error handler.

```bash
git add backend/
git commit -m "feat(backend): add auth middleware, logger, and central error handling"
```

---

## 7. Backend – user CRUD API

**Commit message:** `feat(backend): add user CRUD with pagination and search`

**Include:** GET /users (paginated, search), POST, PUT, DELETE.

```bash
git add backend/
git commit -m "feat(backend): add user CRUD with pagination and search"
```

---

## 8. Backend – API response standard & Dockerfile

**Commit message:** `docs(backend): standardize API response format and add Dockerfile`

**Include:** Response helpers, API doc in README (or separate file), `backend/Dockerfile`.

```bash
git add backend/ README.md
git commit -m "docs(backend): standardize API response format and add Dockerfile"
```

---

## 9. Frontend – Next.js setup & Tailwind

**Commit message:** `feat(frontend): add Next.js app with Tailwind and Zustand`

**Directory:** `frontend/`
- Next.js 14, TypeScript, Tailwind, Zustand, folder structure.

```bash
git add frontend/
git commit -m "feat(frontend): add Next.js app with Tailwind and Zustand"
```

---

## 10. Frontend – auth pages (login & register)

**Commit message:** `feat(frontend): add login and register pages with validation`

**Include:** Auth forms, client-side validation, API integration.

```bash
git add frontend/
git commit -m "feat(frontend): add login and register pages with validation"
```

---

## 11. Frontend – dashboard & user table

**Commit message:** `feat(frontend): add dashboard with user table, pagination, and search`

**Include:** User table, pagination, search, create/edit modal.

```bash
git add frontend/
git commit -m "feat(frontend): add dashboard with user table, pagination, and search"
```

---

## 12. Frontend – loading, error, and empty states

**Commit message:** `feat(frontend): add loading skeletons, error alerts, and empty state`

**Include:** Skeleton/spinner, error messages, empty state UI.

```bash
git add frontend/
git commit -m "feat(frontend): add loading skeletons, error alerts, and empty state"
```

---

## 13. Mobile – Expo project & navigation

**Commit message:** `feat(mobile): add Expo app with React Navigation`

**Directory:** `mobile/`
- Expo, React Navigation, basic stack.

```bash
git add mobile/
git commit -m "feat(mobile): add Expo app with React Navigation"
```

---

## 14. Mobile – API client & login

**Commit message:** `feat(mobile): add API client with interceptors and login screen`

**Include:** Axios/fetch + interceptor (token refresh), login screen.

```bash
git add mobile/
git commit -m "feat(mobile): add API client with interceptors and login screen"
```

---

## 15. Mobile – user list, detail, delete

**Commit message:** `feat(mobile): add user list with FlatList, detail screen, and delete`

**Include:** User list (FlatList), detail screen, delete action, pull-to-refresh.

```bash
git add mobile/
git commit -m "feat(mobile): add user list with FlatList, detail screen, and delete"
```

---

## 16. Mobile – offline handling & responsive layout

**Commit message:** `feat(mobile): add offline detection and responsive layout`

**Include:** Network listener, offline message, responsive styles.

```bash
git add mobile/
git commit -m "feat(mobile): add offline detection and responsive layout"
```

---

## 17. Documentation & final README

**Commit message:** `docs: update README with full setup and mobile run instructions`

**Include:** README update (backend, frontend, mobile, Docker, env), cara run mobile (Expo Go / run-android).

```bash
git add README.md
git commit -m "docs: update README with full setup and mobile run instructions"
```

---

## Push ke GitHub

```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

Setelah itu Anda bisa push commit baru dengan `git push` seperti biasa.

---

**Catatan:** Untuk tes backend, jalankan PostgreSQL & Redis (atau `docker-compose up -d postgres redis`), lalu dari folder `backend`: `npm run db:migrate` dan `npm run dev`. Untuk frontend: dari `frontend` jalankan `npm run dev`. Untuk mobile: dari `mobile` jalankan `npx expo start` dan buka dengan Expo Go atau emulator.
