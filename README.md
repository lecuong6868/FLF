# First Legal Force (FLF) — Website giai đoạn 1

Website công ty tư vấn đa lĩnh vực **First Legal Force** (`www.flf.vn`), xây bằng **Next.js (App Router) + Payload CMS + PostgreSQL**, song ngữ **Tiếng Việt / English**.

## Tính năng giai đoạn 1

- Trang công khai: Trang chủ, Giới thiệu, Lĩnh vực tư vấn, Đối tác pháp lý, Tin tức, Liên hệ, Chính sách bảo mật (`/vi`, `/en`)
- Dashboard Payload: vai trò **Admin** / **Nhân viên (Editor)**; workflow nháp → chờ duyệt → xuất bản
- Bài pháp lý chỉ xuất bản khi có checkbox **Đã được luật sư duyệt**
- Đăng nhập 2 lớp TOTP (bật qua API), mật khẩu mạnh, rate limit form, CSP / security headers
- SEO: metadata, sitemap, robots, JSON-LD, redirect 301 từ site SPA cũ
- Form liên hệ có đồng ý **NĐ 13/2023**, honeypot + rate limit, lưu DB, gửi email SMTP (nếu cấu hình)
- Khung collection **social-posts** cho giai đoạn 2 (chưa gọi API MXH / chatbot)

## Yêu cầu

- Node.js `22.23.4+`
- PostgreSQL 16 (Docker Compose hoặc `npm run dev:pg` dùng PostgreSQL nhúng)
- **RAM ≥ 2 GB** khi `npm run build` (máy 1 GB dễ bị OOM; VPS nên chạy `deploy/swap-2g.sh`)
- Máy xưởng/CI nhỏ: ưu tiên `npm run test` / seed; full `next dev`/`build` chạy trên VPS hoặc runner ≥2–4GB
- Docker + Docker Compose (khuyến nghị trên VPS)

## Cài đặt local (dev)

```bash
cp .env.example .env
# Sửa PAYLOAD_SECRET, DATABASE_URL, SEED_ADMIN_*

# Cách A — chỉ DB bằng Docker
docker compose up -d db

# Cách B — không có Docker: PostgreSQL nhúng (port 54329, thư mục .pgdata/)
npm run dev:pg
# Đảm bảo DATABASE_URL trong .env trỏ đúng port (mặc định 54329)

npm install
npm run seed          # tạo admin + nội dung mẫu + redirects
npm run dev
```

Mở:

- Website: http://localhost:3000/vi
- Admin: http://localhost:3000/admin

## Chạy full stack bằng Docker Compose

```bash
cp .env.example .env
# Đặt mật khẩu Postgres, PAYLOAD_SECRET, SITE_ADDRESS=flf.vn,www.flf.vn

docker compose up -d --build
```

Hoặc trên VPS: `sudo bash deploy/setup-docker.sh` (xem [`deploy/README.md`](deploy/README.md)).

Seed lần đầu (Postgres chỉ trong mạng Docker — dùng SSH tunnel hoặc `docker compose exec` khi image có đủ tool; xem [`deploy/README.md`](deploy/README.md)).

## Scripts hữu ích

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Dev server |
| `npm run dev:pg` | PostgreSQL nhúng cho máy không có Docker |
| `npm run build` / `npm start` | Production local (cần ≥2GB RAM) |
| `npm run seed` | Tạo admin + nội dung mẫu + redirects |
| `npm run survey:legacy` | Báo cáo khảo sát site cũ |
| `npm run import:legacy` | Import redirect vào collection Payload |
| `npm run test` | Unit + integration DB (workflow duyệt bài, form NĐ 13, redirect, 2FA, rate limit) |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run lint` | ESLint |
| `npm run audit:prod` | `npm audit` mức high (prod deps) |
| `npm run generate:types` | Sinh `payload-types.ts` |
| `npm run generate:importmap` | Sinh `importMap.js` cho admin |

## 2FA (TOTP)

1. Đăng nhập admin/editor lần đầu (chưa bật 2FA).
2. `POST /api/users/me/2fa/setup` (kèm cookie/JWT) → nhận `otpauthUrl` / secret.
3. Quét bằng Authenticator.
4. `POST /api/users/me/2fa/enable` body `{ "totp": "123456" }`.
5. Các lần đăng nhập sau gửi thêm `"totp"` trong body login Payload.

## Biến môi trường

Xem [`.env.example`](.env.example). **Không commit** `.env` hay mật khẩu thật.

API MXH / AI (giai đoạn 2–3) để trống.

## Tài liệu thêm

- [`docs/COMPANY_VERIFICATION.md`](docs/COMPANY_VERIFICATION.md) — đối chiếu MST / địa chỉ
- [`docs/MIGRATION_REPORT.md`](docs/MIGRATION_REPORT.md) — khảo sát site cũ & redirect
- [`deploy/README.md`](deploy/README.md) — triển khai VPS, HTTPS, backup

## Logo

Giữ nguyên file trong `public/brand/` (từ tài nguyên khách). Không chỉnh sửa họa tiết logo.

## Ghi chú kỹ thuật

- Site cũ là **React SPA**, không còn WordPress REST — redirect 301 nằm ở `data/legacy-redirects.json`.
- Thông tin công ty seed theo cổng MST; địa chỉ website cũ (33 Trần Quý Khoách) để trống `displayAddress` cho đến khi khách xác nhận.


## Kết quả kiểm thử (máy dev)

- `npm run test` — **15/15 đạt** (workflow duyệt bài, chặn bài pháp lý, form NĐ 13, redirect, TOTP, rate limit, mật khẩu mạnh, integration Payload DB)
- `npm run typecheck` — sạch
- `npm run lint` — sạch (0 error)
- `npm run audit:prod` — không còn lỗ hổng mức **high** (còn moderate từ `drizzle-kit` transitive của Payload)
- Smoke `next dev`: `/api/health`, `/vi`, `/en`, các trang chính **200**; redirect `/about` & `/services/1` **301**; form liên hệ **200**; `/admin` cần máy ≥2 GB (compile nặng trên ~1 GB dễ timeout)
- `npm run build` trên máy **~1 GB RAM** dễ OOM — chạy build trên VPS/CI (≥2–4 GB) hoặc GitHub Actions trong `.github/workflows/ci.yml`
