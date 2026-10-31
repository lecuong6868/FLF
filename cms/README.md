# FLF CMS (Dashboard bước 1)

Nền quản trị **Next.js + Payload CMS 3 + PostgreSQL** cho website FLF (`www.flf.vn`).

Phạm vi bước này: khung admin, phân quyền, collections tối thiểu, seed — **chưa** nối giao diện FLF-preview, MXH, chatbot hay AI.

## Yêu cầu

- Node.js `^22.23.4` hoặc `>=24.22.1`
- PostgreSQL 16+ (Docker Compose **hoặc** Postgres nhúng qua `npm run pg:embedded`)
- **RAM khuyến nghị ≥ 4 GiB** để biên dịch trang `/admin` và `next build` (máy ~1 GiB sẽ OOM khi compile admin)

## Cài đặt nhanh

```bash
cd cms
cp .env.example .env
# Sửa PAYLOAD_SECRET, SEED_ADMIN_PASSWORD, SEED_EDITOR_PASSWORD trong .env

npm install
```

### Cách A — Docker Compose (khuyến nghị khi có Docker)

```bash
docker compose up -d postgres
# DATABASE_URL trong .env trỏ tới 127.0.0.1:5432 (xem .env.example)

npm run dev
# terminal khác:
npm run seed
```

### Cách B — Postgres nhúng (không cần Docker)

```bash
# Terminal 1 — giữ tiến trình Postgres
npm run pg:embedded
# Log sẽ in DATABASE_URL (mặc định cổng 54329)

# Cập nhật .env:
# DATABASE_URL=postgresql://flf:flf_local_only@127.0.0.1:54329/flf

# Terminal 2
npm run dev
npm run seed
```

Mở Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — đăng nhập bằng `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

## Kiểm tra

```bash
npm run typecheck
npm run build
npm run test:access   # editor không được đăng bài; admin đăng được
```

## Vai trò & workflow bài viết

| Vai trò | Quyền chính |
|---------|-------------|
| `admin` | Toàn quyền; duyệt / đăng bài |
| `editor` | Viết nháp, gửi chờ duyệt — **không** đặt trạng thái Đã đăng |
| `reviewer` | Duyệt / đăng (giống quyền publish của admin) |

Trạng thái bài: **Nháp** → **Chờ duyệt** → **Đã đăng**.

## Collections / Globals

- Collections: `users`, `media`, `categories`, `posts`, `pages`
- Globals: `site-settings`, `navigation`
- Localization: `vi` (mặc định), `en`

Seed tạo 2 chuyên mục từ FLF-preview: **Quy định mới**, **Chuyên mục** (không bịa nội dung pháp lý).

## Biến môi trường

Xem `.env.example`. Không commit file `.env`.

## Ngoài phạm vi bước 1

Kết nối MXH, chatbot AI, AI đăng bài, nối UI Preview vào CMS, triển khai VPS, đăng nhập 2 lớp.
