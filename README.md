# Node.js REST API Single Page Application (SPA) Frontend

Frontend Client testing berarsitektur modern dan berstandar best practice untuk mengonsumsi dan menguji seluruh endpoint REST API dari backend Node.js Clean Architecture (`C:\Test Project\Node\test-node-project`). Dibangun menggunakan **React 19**, **Vite**, **Tailwind CSS v4**, **React Router v7**, **Lucide React**, dan **Axios**.

---

## 🌟 Fitur Utama

- **100% Endpoint Coverage (26 Endpoints)**: Mengonsumsi dan menguji seluruh endpoint Backend Node.js:
  - **Health**: `GET /health` (Status service & koneksi database MySQL)
  - **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` (Revoke token)
  - **Profile**: `GET /api/profile`, `PATCH /api/profile`
  - **Categories**: `GET /api/category`, `POST /api/category`, `GET /api/category/:id`, `PATCH /api/category/:id`, `DELETE /api/category/:id`, `GET /api/category/deleted`, `PATCH /api/category/:id/restore`, `DELETE /api/category/:id/permanent`
  - **Todos**: `GET /api/todo`, `POST /api/todo`, `GET /api/todo/:id`, `PATCH /api/todo/:id`, `DELETE /api/todo/:id`, `GET /api/todo/deleted`, `PATCH /api/todo/:id/restore`, `DELETE /api/todo/:id/permanent`
  - **Users (Admin)**: `GET /api/user`, `POST /api/user`, `GET /api/user/:id`, `PATCH /api/user/:id`, `DELETE /api/user/:id`, `GET /api/user/deleted`, `PATCH /api/user/:id/restore`, `DELETE /api/user/:id/permanent`
- **Interactive API Explorer & Live Runner**:
  - Halaman pengujian API interaktif untuk mengeksekusi request method (`GET`, `POST`, `PATCH`, `DELETE`).
  - Edit path parameters (`:id`), query parameters table (`page`, `limit`, `search`, `is_completed`, `category_id`), dan custom JSON request body.
  - Inspeksi real-time: HTTP status code, latency (ms), response headers, dan formatted JSON response dengan tombol 1-klik salin ke clipboard.
- **Dark Mode Penuh (Light & Dark)**:
  - Toggle 1-klik di header dan halaman login.
  - Deteksi preferensi OS (`prefers-color-scheme: dark`) dan persistensi `localStorage`.
- **Modern UI & Responsive Design (Tailwind CSS v4)**:
  - Menggunakan Tailwind CSS v4 (`@tailwindcss/vite`) dengan utility styling clean dan elegan.
  - Responsif untuk layar mobile, tablet, hingga desktop.
- **State Management & Context Terpusat**:
  - `AuthContext`: Manajemen JWT token, auto-attach Bearer header via Axios interceptor, auto-logout saat 401 Unauthorized, penyimpanan session di `localStorage`.
  - `ToastContext`: Stack notifikasi interaktif (Success, Error, Warning, Info) dengan parsing rincian validasi field Zod dari backend.
  - `ThemeContext`: Pengaturan tema terang/gelap.
  - `HealthContext`: Monitoring status server Node.js dan database MySQL secara live dengan indikator latency round-trip.
- **Routing & Navigation Guards**:
  - Guard `ProtectedRoute` untuk membatasi akses pengguna yang belum login.
  - Guard `GuestRoute` untuk rute autentikasi (Login/Register).
  - Role-based guard (`requiresAdmin`) untuk memproteksi halaman User Management.
  - Code-splitting berbasis `React.lazy` dan `Suspense` untuk performa bundle optimal.
- **Zero-CORS Dev Setup**:
  - Vite dev server proxy terkonfigurasi otomatis mengarahkan `/api` dan `/health` ke backend target (`http://127.0.0.1:5000`).
- **Internal Frontend Error Logging**:
  - Menangkap error runtime frontend (`window.onerror` dan `unhandledrejection`) dan mencatatnya ke `logs/fe-YYYY-MM-DD.log` via silent beacon tanpa mengganggu UI.

---

## 📁 Struktur Direktori

```text
src/
├── api/                        # HTTP API Service Layer (Axios)
│   ├── client.js               # Axios instance, Bearer token interceptor, 401 handling
│   ├── health.js               # GET /health
│   ├── auth.js                 # POST /api/auth/{login, register, logout}
│   ├── profile.js              # GET & PATCH /api/profile
│   ├── categories.js           # Full CRUD /api/category (termasuk deleted, restore, permanent)
│   ├── todos.js                # Full CRUD /api/todo (termasuk status toggle, trash)
│   └── users.js                # Full CRUD /api/user (khusus role Admin)
├── context/                    # React Context State Providers
│   ├── AuthContext.jsx         # User session, JWT auth & profile updates
│   ├── HealthContext.jsx       # Server health & DB ping
│   ├── ThemeContext.jsx        # Light / Dark mode state & persistence
│   └── ToastContext.jsx        # Global toast notifications & validation parser
├── routes/
│   ├── index.jsx               # React Router v7 routes & lazy load definitions
│   ├── ProtectedRoute.jsx      # Auth & Admin role guards
│   └── GuestRoute.jsx          # Guest-only guard
├── components/
│   ├── common/
│   │   ├── AppHeader.jsx       # Header dengan status live API, theme toggle, profile & logout
│   │   ├── AppSidebar.jsx      # Sidebar menu navigasi responsif & backend status card
│   │   ├── ThemeToggle.jsx     # Tombol switch Light / Dark mode
│   │   ├── ToastContainer.jsx  # Floating toast notifications
│   │   ├── ModalDialog.jsx     # Reusable modal dialog with ESC & backdrop
│   │   ├── ConfirmDialog.jsx   # Dialog konfirmasi (soft delete, restore, permanent delete)
│   │   ├── PaginationBar.jsx   # Navigasi halaman & limit selector
│   │   ├── LoadingSpinner.jsx  # State loading spinner & inline indicator
│   │   ├── EmptyState.jsx      # Tampilan data kosong dengan CTA
│   │   └── StatusBadge.jsx     # Badges warna method HTTP, status todo, & user role
│   ├── todo/
│   │   └── TodoModal.jsx       # Form modal tambah/edit todo
│   ├── category/
│   │   └── CategoryModal.jsx   # Form modal tambah/edit kategori
│   └── user/
│       └── UserModal.jsx       # Form modal tambah/edit user (Admin)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx       # Sign In + Demo accounts quick-fill
│   │   └── RegisterPage.jsx    # Pendaftaran akun baru
│   ├── dashboard/
│   │   └── DashboardPage.jsx   # Overview metrik, status server & ringkasan aktivitas
│   ├── todos/
│   │   └── TodosPage.jsx       # Manajemen Todo lengkap dengan filter kategori & status
│   ├── categories/
│   │   └── CategoriesPage.jsx  # Manajemen Kategori
│   ├── users/
│   │   └── UsersPage.jsx       # Manajemen Pengguna (Khusus Admin)
│   ├── trash/
│   │   └── TrashPage.jsx       # Tempat Sampah terpadu (Restore & Purge permanen)
│   ├── profile/
│   │   └── ProfilePage.jsx     # Edit profil & ganti password akun aktif
│   ├── api-explorer/
│   │   └── ApiExplorerPage.jsx # Interactive Live REST API Runner untuk 26 endpoints
│   └── NotFoundPage.jsx        # 404 handler
├── layouts/
│   ├── MainLayout.jsx          # Layout dashboard dengan sidebar & header
│   └── AuthLayout.jsx          # Layout autentikasi dengan theme toggle
├── utils/
│   ├── cn.js                   # ClassNames merger (clsx + tailwind-merge)
│   ├── formatters.js           # Formatter tanggal & string
│   └── logger.js               # Frontend error logger
├── App.jsx                     # Root application provider hierarchy
├── main.jsx                    # Application entry point & global error handlers
└── index.css                   # Tailwind CSS v4 styling & dark theme definitions
```

---

## 🔑 Akun Demo Siap Uji (Database Seeder)

Untuk mempermudah pengujian, terdapat tombol pintas 1-klik di halaman Login:

| Akun | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `password` | Admin (Akses penuh + User Management) |
| **Shin** | `shin@example.com` | `password` | Admin (Akses penuh + User Management) |
| **Test User** | `user@example.com` | `password` | Regular User (Creator Scoped) |
| **Nao** | `nao@example.com` | `password` | Regular User (Creator Scoped) |

---

## ⚙️ Konfigurasi Environment Dinamis (.env)

Port server Frontend dan domain/URL Backend dapat dikonfigurasi secara dinamis melalui file `.env`:

```env
# Port Server Frontend (Vite)
VITE_PORT=5174

# Port Server Production (Nginx) jika menggunakan Docker Compose profile 'prod'
VITE_PROD_PORT=80

# Domain / Target URL Backend (Node.js REST API)
# Node.js backend secara default berjalan di port 5000
VITE_BACKEND_URL=http://127.0.0.1:5000

# Opsional: Direct base URL jika tidak ingin menggunakan Vite Dev Proxy
VITE_API_BASE_URL=

# Judul Aplikasi
VITE_APP_TITLE=Node.js REST API Frontend Tester
```

---

## 🐳 Menjalankan dengan Docker Desktop

Project telah dilengkapi `Dockerfile` multi-stage dan `compose.yaml` yang siap dijalankan langsung di Docker Desktop.

### 1. Mode Development / Testing (Rekomendasi)
Menjalankan Vite dev server di dalam container dengan fitur **Hot-Module Replacement (HMR)** dan volume mount ke folder `logs/` di host:

```bash
# Build dan jalankan container di background
docker compose up -d --build

# Cek status container
docker compose ps

# Cek live logs container
docker compose logs -f frontend

# Hentikan container
docker compose down
```
Akses aplikasi melalui browser di `http://localhost:5174`.

> [!TIP]
> **Koneksi ke Backend Node.js di Docker Desktop**:
> Container Frontend menggunakan `host.docker.internal:5000` sehingga dapat terhubung secara otomatis ke backend Node.js di host Windows.

### 2. Mode Production (Nginx Multi-Stage)
Jika ingin menguji build statis production yang disajikan oleh web server Nginx:

```bash
# Jalankan container production (Nginx di port 80)
docker compose --profile prod up -d --build frontend-prod

# Hentikan container production
docker compose --profile prod down
```
Akses aplikasi melalui browser di `http://localhost:80`.

---

## 🚀 Cara Menjalankan Secara Lokal (Tanpa Docker)

### 1. Jalankan Backend Node.js Terlebih Dahulu
Pastikan database MySQL aktif dan backend Node.js dijalankan di port 5000:
```bash
cd "C:\Test Project\Node\test-node-project"
npm run dev
```

### 2. Jalankan Frontend React SPA
Buka terminal di folder project ini (`C:\Test Project\React\test-react-project`):
```bash
# Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5174`. Buka browser dan login menggunakan salah satu akun demo di atas!
