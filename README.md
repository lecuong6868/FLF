# Renew web FLF

Tái dựng website **First Legal Force (FLF)** — `www.flf.vn` — trên nền hiện đại.

## Cấu trúc repo

| Thư mục | Mục đích |
|---------|----------|
| `cms/` | **Dashboard bước 1** — Next.js + Payload CMS + PostgreSQL |
| `FLF-preview/` | Bản HTML xem trước (giữ nguyên, không sửa trong bước này) |
| `deploy/` | Script VPS/nginx (giai đoạn sau) |
| `docs/acceptance/` | Biên bản nghiệm thu |

## Chạy Dashboard (bước 1)

```bash
cd cms
cp .env.example .env   # điền PAYLOAD_SECRET và mật khẩu seed
npm install

# Postgres: docker compose up -d   HOẶC   npm run pg:embedded
npm run dev
npm run seed
```

Chi tiết: [cms/README.md](cms/README.md).

Admin: http://localhost:3000/admin

## Việc anh cần làm tiếp

- Xác nhận địa chỉ hiển thị công khai và số điện thoại footer.
- Cấp logo gốc (đã có PNG trong `.aat/files/` / `FLF-preview/public/brand/`).
- Đồng ý VPS / DNS khi chuyển khỏi Preview.
- Giai đoạn sau: 2FA, nối Preview → CMS, MXH, AI/chatbot.
