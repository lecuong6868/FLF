# Nghiệm thu Dashboard bước 1 — FLF CMS

**Thời điểm:** 2026-10-31  
**Nhánh làm việc:** `aat/20261031-192057`  
**Môi trường thử:** Node v22.23.4, Payload 3.92.1, Next.js 15.4.11, PostgreSQL 17.6 (embedded), RAM máy ~961 MiB + swap 2 GiB.

## Phạm vi đã làm

- Thư mục `cms/`: Next.js + Payload CMS + PostgreSQL
- `docker-compose.yml` (Postgres) + script `npm run pg:embedded` (khi không có Docker)
- Vai trò: `admin`, `editor`, `reviewer`
- Workflow bài: `draft` → `pending_review` → `published` (chỉ admin/reviewer được đặt `published`)
- Collections: Users, Media, Categories, Posts, Pages
- Globals: SiteSettings, Navigation
- Localization: `vi` / `en`
- Seed: admin (+ editor) từ biến môi trường; chuyên mục **Quy định mới**, **Chuyên mục**
- `.env.example`, README tiếng Việt
- Giữ nguyên `FLF-preview/` (không sửa nội dung preview)

## Kết quả kiểm tra

| Tiêu chí | Kết quả | Ghi chú / log |
|----------|---------|----------------|
| `npm install` | **Đạt** | 632 packages |
| `npm run typecheck` | **Đạt** | `tsc --noEmit` exit 0 |
| `npm run seed` | **Đạt** | Tạo `admin@flf.local`, `editor@flf.local`; chuyên mục `quy-dinh-moi`, `chuyen-muc` |
| Phân quyền editor không duyệt/đăng | **Đạt** | `npm run test:access` → `PASS` (editor bị chặn khi `status=published`; admin đăng được) |
| `GET /` | **Đạt** | HTTP **200** (~44 s lần compile đầu) |
| `GET /api/users` (chưa login) | **Đạt** | HTTP **403** (đúng kỳ vọng) |
| `GET /admin` HTTP 200 | **Chưa xác minh** | Compile admin panel OOM trên máy ~1 GiB RAM (`FATAL ERROR: JavaScript heap out of memory`). Cần máy ≥4 GiB RAM (hoặc build trên CI/VPS) rồi chạy lại `npm run dev` / `npm run build && npm start`. |
| `npm run build` | **Chưa xác minh** | `next build` không hoàn tất trên máy 1 GiB (thiếu bộ nhớ). |

### Trích log phân quyền (đạt)

```
[test-access] editor tạo nháp OK
[test-access] editor chuyển Chờ duyệt OK
[test-access] editor KHÔNG đăng được (đúng kỳ vọng): Editor không được duyệt/đăng bài. Chỉ admin/reviewer.
[test-access] admin đăng bài OK status=published
[test-access] PASS
```

### Trích lỗi /admin (chưa xác minh)

```
○ Compiling /admin/[[...segments]] ...
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

## Cách chạy lại trên máy đủ RAM

```bash
cd cms
cp .env.example .env   # điền secret + mật khẩu seed
npm install
docker compose up -d postgres   # hoặc: npm run pg:embedded
npm run dev
npm run seed
npm run test:access
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/admin
npm run build && npm start
```

## Ngoài phạm vi bước 1 (chưa làm)

MXH, chatbot AI, AI đăng bài, nối UI Preview vào CMS, 2FA, triển khai VPS.

## Việc anh (khách) cần làm tiếp

1. Xác nhận địa chỉ hiển thị công khai + SĐT footer.
2. Cấp logo gốc (đã có PNG trong `.aat/files/` / `FLF-preview/public/brand/`).
3. Đồng ý VPS (~24 USD/tháng) + DNS khi chuyển khỏi Preview.
4. Chạy CMS trên máy/VPS đủ RAM để xác minh `/admin` và `next build`.
