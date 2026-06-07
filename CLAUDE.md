# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal navigation station (个人导航站) — a web app for managing bookmarks with categories, search, and role-based access control.

**Tech stack**: Next.js 14 + Express + MySQL 8.0 + Nginx, deployed via Docker Compose + Jenkins CI/CD.

---

## Quick Commands

### Local Development
```bash
# Backend (port 4000)
cd backend && npm install && npm run dev

# Frontend (port 3000) — requires backend running or NEXT_PUBLIC_API_URL set
cd frontend && npm install && npm run dev
```

### Build
```bash
# Frontend production build
cd frontend && npm run build

# Backend has no build step (Node.js runtime)
```

### Docker (Production)
```bash
# Full stack up
docker compose -f docker-compose.prod.yml up -d --build

# Rebuild specific service
docker compose -f docker-compose.prod.yml build frontend

# Tear down
docker compose -f docker-compose.prod.yml down --remove-orphans
```

### Jenkins
- Pipeline defined in `Jenkinsfile`
- Polls GitHub every 5 minutes for changes on `master`
- Stages: Checkout → Docker Compose Deploy → Health Check

---

## Architecture

### Service Topology
```
Browser:80 → Nginx → / → frontend:3000 (Next.js)
                     → /api/* → backend:4000 (Express) → MySQL:3306
```

4 Docker containers on a shared network. Only port 80 is exposed externally.

### Frontend (`frontend/`)
- **Next.js 14 App Router** — single page (`src/app/page.tsx`)
- **`next.config.js`** — rewrites `/api/:path*` to backend in dev mode; production uses Nginx proxy
- **`src/lib/api.ts`** — `apiUrl()` helper resolves API base from `NEXT_PUBLIC_API_URL` (empty in production)
- **`src/lib/AuthContext.tsx`** — React context for JWT auth, stores token+user in localStorage, decodes JWT to check expiry
- **Components**: `SearchBar`, `CategorySection`, `AdminPanel` (with inline `CategoryFormModal`/`BookmarkFormModal`), `LoginModal`, `AccountModal`

### Backend (`backend/`)
- **Express** with routes under `/api/auth`, `/api/categories`, `/api/bookmarks`
- **`src/middleware/auth.js`** — `auth` (verify JWT) and `adminOnly` (require admin role)
- **`src/middleware/cors.js`** — allows all origins in production, configurable in dev
- **`src/db.js`** — mysql2 connection pool with utf8mb4 charset
- **Controllers**: `authController.js` (login/register/change-password/user-management), `categoryController.js`, `bookmarkController.js`
- **Auth**: JWT (7-day expiry), bcrypt password hashing

### Database (`backend/sql/`)
- `init.sql` — categories + bookmarks tables + seed data (utf8mb4 charset)
- `02_users.sql` — users table + default admin (raokai / rk1110001237)
- Tables: `categories`, `bookmarks` (FK with CASCADE DELETE), `users`

### Key Design Decisions
- **Public read, admin write**: GET endpoints are public; POST/PUT/DELETE require `adminOnly` middleware
- **API URL resolution**: Dev uses `NEXT_PUBLIC_API_URL` + Next.js rewrites; production uses Nginx proxy (relative paths)
- **Nginx config**: Uses Docker `configs.content:` (inline) to avoid host path issues in Jenkins; all `$` variables escaped as `$$`
- **MySQL charset**: Server-level `--character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci` prevents Chinese character corruption
