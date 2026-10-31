# Renew web FLF

Tái dựng website **First Legal Force (FLF)** — `www.flf.vn` — trên nền hiện đại.

## Cấu trúc repo

| Thư mục / file | Mục đích |
|----------------|----------|
| `cms/` | Dashboard — Next.js + Payload CMS + PostgreSQL |
| `FLF-preview/` | Bản HTML xem trước (giữ nguyên) |
| `deploy/` | Script VPS/nginx cho site tĩnh (giai đoạn sau) |
| `render.yaml` | Blueprint Render — bản thử CMS |
| `.github/workflows/cms-preview.yml` | CI build image + bằng chứng |
| `docs/acceptance/` | Biên bản nghiệm thu |

## Chạy CMS local

```bash
cd cms
cp .env.example .env   # hoặc: bash scripts/generate-preview-secrets.sh
npm install
docker compose up -d postgres   # hoặc npm run pg:embedded
npm run dev
npm run seed
```

Chi tiết: [cms/README.md](cms/README.md). Admin: http://localhost:3000/admin

## Bản thử công khai (khách no-code)

Máy xưởng không đủ RAM/Docker/tài khoản cloud để **tự** mở link `/admin` đã kiểm chứng tại đây.

**Anh chỉ cần cấp quyền (không thao tác kỹ thuật):**

1. Đăng nhập **GitHub** → cho phép **Render** truy cập repo `lecuong6868/FLF`.
2. Đăng nhập **Neon** (GitHub) → tạo 1 database → gửi **connection string** cho team (kênh an toàn).
3. (Tuỳ chọn thay Neon+Render) Tài khoản **Railway** hoặc **Fly.io** + token tương ứng.

Sau khi cấp quyền, team bấm Blueprint / Deploy; mật khẩu admin seed gửi riêng (không để trong PR công khai). Bản thử bật **noindex**.

Xem: [docs/acceptance/CMS-PREVIEW-DEPLOY.md](docs/acceptance/CMS-PREVIEW-DEPLOY.md).

## Chuyển VPS (~24 USD/tháng)

Khi đồng ý VPS (≥4 GiB RAM khuyến nghị cho build CMS):

- Site tĩnh (FLF-preview / zip): `sudo bash deploy/setup.sh` rồi `ssl` khi DNS đã trỏ.
- CMS: build image `cms/Dockerfile` hoặc `npm run build && npm start` + Postgres; nginx proxy `/admin` và API tới cổng Node; đặt `PREVIEW_MODE=false`.

## Việc anh cần làm tiếp

- Cấp quyền Render (GitHub) + Neon connection string (hoặc Railway/Fly) để có link `/admin` thử.
- Xác nhận địa chỉ hiển thị công khai + SĐT footer.
- Đồng ý VPS / DNS khi rời Preview.
- Giai đoạn sau: 2FA, nối Preview → CMS, MXH, AI/chatbot.
