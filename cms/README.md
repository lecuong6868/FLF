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
npm run test:access          # editor không đăng được; admin đăng được
npm run accept:http          # GET /admin + login REST (server đang chạy)
npm run build && npm start
```

## Bản thử công khai `/admin` (không cần token cloud)

**Khuyến nghị:** GitHub Actions + Cloudflare Quick Tunnel.

1. Trên GitHub: **Actions** → **CMS Preview** → **Run workflow**.
2. Runner đủ RAM build `cms/`, seed, mở tunnel `*.trycloudflare.com`.
3. Lấy URL trong **Job Summary**; đăng nhập tài khoản seed.
4. Bản thử **noindex**; dữ liệu mất khi job hết (~75 phút, chỉnh được).
5. Repo **public**: không in mật khẩu ra Summary — dùng secret `PREVIEW_CREDENTIALS_WEBHOOK`, hoặc tạm private, hoặc nhắn team.

Chi tiết: [docs/acceptance/CMS-PREVIEW-TUNNEL.md](../docs/acceptance/CMS-PREVIEW-TUNNEL.md).

Script trên runner: `scripts/run-gha-preview.sh` (gọi từ workflow).

### Phương án phụ: Render + Neon (bản thử lâu hơn)

Nếu cần URL sống nhiều giờ/ngày (không phụ thuộc job Actions):

1. Anh cấp quyền Render (đăng nhập GitHub) + Neon connection string (kênh an toàn).
2. Team apply `render.yaml` / điền secret seed.
3. Xem [docs/acceptance/CMS-PREVIEW-DEPLOY.md](../docs/acceptance/CMS-PREVIEW-DEPLOY.md).

| Nền tảng | File | Cần cấp |
|----------|------|---------|
| GitHub Actions + cloudflared | `.github/workflows/cms-preview.yml` | Chỉ quyền chạy Actions (mặc định có) |
| Render + Neon | `render.yaml` | Quyền Render + connection string Neon |
| Railway / Fly | `railway.toml` / `fly.toml` | Token / tài khoản tương ứng |

Sinh mật khẩu thử local (không commit):

```bash
bash cms/scripts/generate-preview-secrets.sh
```

## Chuyển sang VPS (~24 USD/tháng)

Khi khách đồng ý VPS đủ RAM (≥4 GiB khuyến nghị):

```bash
cd cms
cp .env.example .env   # PREVIEW_MODE=false, URL thật, secret mạnh
docker compose up -d postgres
docker build -t flf-cms .
docker run -d --env-file .env -p 3000:3000 --network host flf-cms
```

Hoặc: `npm ci && npm run build && npm start`. Nginx proxy + HTTPS; DNS `flf.vn`.

## Vai trò & workflow bài viết

| Vai trò | Quyền chính |
|---------|-------------|
| `admin` | Toàn quyền; duyệt / đăng bài |
| `editor` | Viết nháp, gửi chờ duyệt — **không** đặt Đã đăng |
| `reviewer` | Duyệt / đăng |

Trạng thái: **Nháp** → **Chờ duyệt** → **Đã đăng**.

## Collections / Globals

Users, Media, Categories, Posts, Pages · SiteSettings, Navigation · locale `vi` / `en`.
