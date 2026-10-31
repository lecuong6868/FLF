# FLF CMS (Dashboard)

Nền quản trị **Next.js + Payload CMS 3 + PostgreSQL** cho website FLF (`www.flf.vn`).

`FLF-preview/` (HTML xem trước) **giữ nguyên** — không sửa khi làm việc với CMS.

## Yêu cầu

- Node.js `^22.23.4` hoặc `>=24.22.1`
- PostgreSQL 16+ (Docker Compose, Postgres nhúng, Neon, hoặc Postgres trên VPS)
- **RAM ≥ 4 GiB** để `next build` / biên dịch `/admin` (máy ~1 GiB sẽ OOM)

## Cài đặt local

```bash
cd cms
cp .env.example .env
# Hoặc sinh secret + mật khẩu mạnh:
bash scripts/generate-preview-secrets.sh
# rồi chép các dòng từ .preview-credentials vào .env

npm install
docker compose up -d postgres   # hoặc: npm run pg:embedded
npm run dev
npm run seed
```

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Kiểm tra

```bash
npm run typecheck
npm run test:access   # editor không đăng được; admin đăng được
npm run build && npm start
```

## Triển khai bản thử (cho khách no-code xem `/admin`)

Máy xưởng (~1 GiB RAM, không Docker, không tài khoản Render/Railway/Fly/Neon) **không build/chạy được** toàn bộ `/admin`. Dùng dịch vụ ngoài:

### Phương án khuyến nghị: Render (free web) + Neon Postgres (free)

1. **Anh cấp quyền** (không cần thao tác kỹ thuật sâu):
   - Đăng nhập [Render](https://dashboard.render.com) bằng GitHub → cho phép Render truy cập repo `lecuong6868/FLF`.
   - Tạo project [Neon](https://console.neon.tech) (đăng nhập GitHub) → tạo database → copy **connection string**.
2. Team (hoặc anh bấm Blueprint sau khi cấp quyền):
   - Render → **New → Blueprint** → chọn repo → file `render.yaml`.
   - Dán `DATABASE_URL` (Neon), `SEED_ADMIN_PASSWORD`, `SEED_EDITOR_PASSWORD` (từ `cms/.preview-credentials`, gửi qua kênh an toàn).
   - `PAYLOAD_SECRET` có thể để Render tự sinh.
3. Khi Deploy live: mở `https://<tên-service>.onrender.com/admin`, đăng nhập admin seed.
4. Bản thử bật **noindex** (`PREVIEW_MODE=true`, `robots.txt` Disallow, header `X-Robots-Tag`).

Chi tiết quyền còn thiếu / bằng chứng: [docs/acceptance/CMS-PREVIEW-DEPLOY.md](../docs/acceptance/CMS-PREVIEW-DEPLOY.md).

### Phương án khác

| Nền tảng | File cấu hình | Cần cấp |
|----------|---------------|---------|
| Railway | `cms/railway.toml` + Dockerfile | Tài khoản Railway + quyền GitHub repo + add Postgres |
| Fly.io | `cms/fly.toml` + Dockerfile | `FLY_API_TOKEN` + Postgres/Neon |
| GitHub Actions | `.github/workflows/cms-preview.yml` | Tự chạy khi push; deploy Render khi có `vars.RENDER_DEPLOY_HOOK` |

Sinh mật khẩu thử (không commit):

```bash
bash cms/scripts/generate-preview-secrets.sh
# → cms/.preview-credentials (gitignore). Gửi khách qua kênh an toàn; yêu cầu đổi khi dùng thật.
```

## Chuyển sang VPS (~24 USD/tháng)

Khi khách đồng ý VPS đủ RAM (≥4 GiB khuyến nghị):

```bash
# Trên VPS (Docker)
cd cms
cp .env.example .env   # điền PAYLOAD_SECRET, DATABASE_URL, URL thật, PREVIEW_MODE=false
docker compose up -d postgres
docker build -t flf-cms .
docker run -d --env-file .env -p 3000:3000 --network host flf-cms
# Đặt nginx reverse proxy + HTTPS (xem deploy/setup.sh cho site tĩnh;
# CMS cần location proxy_pass tới cổng 3000 — cấu hình riêng khi lên production).
```

Hoặc chạy Node trực tiếp: `npm ci && npm run build && npm start` với Postgres systemd/Docker.

Đổi DNS `flf.vn` / `www` về VPS khi đã nghiệm thu; giữ redirect 301 từ URL WordPress cũ.

## Vai trò & workflow bài viết

| Vai trò | Quyền chính |
|---------|-------------|
| `admin` | Toàn quyền; duyệt / đăng bài |
| `editor` | Viết nháp, gửi chờ duyệt — **không** đặt Đã đăng |
| `reviewer` | Duyệt / đăng |

Trạng thái: **Nháp** → **Chờ duyệt** → **Đã đăng**.

## Collections / Globals

- Collections: `users`, `media`, `categories`, `posts`, `pages`
- Globals: `site-settings`, `navigation`
- Localization: `vi` (mặc định), `en`

## Biến môi trường

Xem `.env.example`. Hỗ trợ `DATABASE_URL` và `DATABASE_URI`. Không commit `.env` / `.preview-credentials`.
