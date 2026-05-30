# Pensil

Kumpulan blog random. Monorepo berisi **API backend** dan **web frontend**.

| Bagian   | Stack                                                        |
| -------- | ------------------------------------------------------------ |
| `server` | Express 5 · Sequelize 6 · PostgreSQL · TypeScript · JWT auth |
| `client` | Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui |
| Tooling  | pnpm workspaces · ESLint · Prettier · Husky + lint-staged    |

## Prasyarat

- Node.js **>= 20.9**
- pnpm **>= 10** (`npm i -g pnpm`)
- PostgreSQL berjalan secara lokal (atau via Docker)

## Setup cepat

```bash
# 1. Install semua dependensi (root + client + server)
pnpm install

# 2. Siapkan environment
#    server: salin .env.example -> .env, lalu sesuaikan DB_PASSWORD dll.
cp server/.env.example server/.env
#    client: sudah ada .env.local default (NEXT_PUBLIC_API_URL=http://localhost:4000/api)

# 3. Siapkan database (buat DB + migrate + seed data demo)
pnpm db:setup

# 4. Jalankan client & server bersamaan
pnpm dev
```

- Frontend: <http://localhost:3000>
- API: <http://localhost:4000/api> (health check: `/api/health`)

Akun demo setelah seed:

| Role   | Email             | Password    |
| ------ | ----------------- | ----------- |
| Admin  | admin@pensil.dev  | `admin123`  |
| Author | author@pensil.dev | `author123` |

Login lewat <http://localhost:3000/login>, lalu buka panel admin di `/admin`.

## Script penting (dijalankan dari root)

| Perintah          | Fungsi                                                |
| ----------------- | ----------------------------------------------------- |
| `pnpm dev`        | Jalankan client + server paralel                      |
| `pnpm dev:server` | Hanya server (tsx watch)                              |
| `pnpm dev:client` | Hanya client (next dev)                               |
| `pnpm build`      | Build kedua paket                                     |
| `pnpm lint`       | ESLint di kedua paket                                 |
| `pnpm format`     | Prettier --write seluruh repo                         |
| `pnpm db:setup`   | Buat DB + migrate + seed (sekali di awal)             |
| `pnpm db:migrate` | Jalankan migration                                    |
| `pnpm db:seed`    | Jalankan seeder                                       |
| `pnpm db:reset`   | Undo semua migration, migrate ulang, seed ulang       |

## Struktur

```
pensil/
├── server/                 # API Express + Sequelize
│   └── src/
│       ├── config/         # env (zod), koneksi Sequelize, config.cjs (CLI)
│       ├── models/         # User, Category, Post, Comment + asosiasi
│       ├── controllers/    # logika auth, post, category, comment
│       ├── routes/         # /api/auth, /posts, /categories, /comments
│       ├── middleware/     # authenticate/authorize, validate (zod), error
│       ├── migrations/     # skema tabel (sequelize-cli, .cjs)
│       ├── seeders/        # data demo
│       └── utils/          # ApiError, jwt, slugify, asyncHandler
└── client/                 # Next.js App Router
    └── src/
        ├── app/
        │   ├── (site)/     # publik: beranda + /blog/[slug]  (header/footer)
        │   ├── admin/      # panel admin (layout sidebar)
        │   └── login/      # halaman masuk
        ├── components/
        │   ├── ui/         # primitif shadcn (button, card, table, ...)
        │   └── admin/      # sidebar, header, guard, post-form
        └── lib/            # api client, types, auth (token), utils
```

## API singkat

| Method | Endpoint                  | Akses          |
| ------ | ------------------------- | -------------- |
| POST   | `/api/auth/register`      | publik         |
| POST   | `/api/auth/login`         | publik         |
| GET    | `/api/auth/me`            | login          |
| GET    | `/api/posts`              | publik         |
| GET    | `/api/posts/:slug`        | publik         |
| GET    | `/api/posts/id/:id`       | author/admin   |
| POST   | `/api/posts`              | author/admin   |
| PATCH  | `/api/posts/:id`          | pemilik/admin  |
| DELETE | `/api/posts/:id`          | pemilik/admin  |
| GET    | `/api/categories`         | publik         |
| POST   | `/api/categories`         | admin          |
| GET    | `/api/posts/:postId/comments` | publik     |
| POST   | `/api/posts/:postId/comments` | login      |

## Saran pengembangan lanjutan

Sudah disertakan: TypeScript penuh, JWT auth + role (admin/author/reader), shadcn/ui,
ESLint + Prettier + Husky, validasi Zod, error handler terpusat.

Yang bisa ditambahkan berikutnya:

1. **Docker Compose** untuk Postgres + adminer agar setup DB instan.
2. **Rich text / Markdown editor** (mis. TipTap atau react-markdown) menggantikan textarea polos.
3. **Upload gambar** (cover) ke S3/Cloudinary, bukan sekadar URL.
4. **Refresh token + httpOnly cookie** penuh (saat ini access token disimpan di localStorage untuk admin SPA).
5. **Testing**: Vitest/Jest + Supertest (server), Playwright (client).
6. **Pencarian & pagination** di UI publik (API sudah mendukung `?search=` & `?page=`).
7. **Rate limiting** (`express-rate-limit`) dan logging terstruktur (`pino`).
8. **CI** (GitHub Actions): lint + typecheck + build, dan **Turborepo** untuk caching bila repo membesar.
9. **SEO**: sitemap.ts, RSS feed, Open Graph image.
```
