# Kết quả kiểm thử

Ngày: **2026-10-27** (xưởng renew-web-flf)

| Lệnh | Kết quả |
|------|---------|
| `npm run test` | **15/15 đạt** (unit workflow/form/redirect/2FA/rate-limit + integration Payload DB: chặn xuất bản pháp lý, publish hợp lệ, contact NĐ 13) |
| `npm run typecheck` | sạch |
| `npm run lint` | 0 error |
| `npm run audit:prod` | không lỗi mức **high** (còn moderate transitive `drizzle-kit`/`esbuild` từ `@payloadcms/db-postgres`) |
| `npm run seed` | OK — admin + 7 lĩnh vực + redirects + bài mẫu |
| Smoke `next dev` | `/api/health` 200; `/vi`,`/en`, about/services/partners/news/contact/privacy **200**; `/about` & `/services/1` **301**; `POST /api/contact` **ok**; `/admin` compile timeout trên VM ~1 GB |
| `npm run build` / Docker Compose | Docker **không có sẵn** trên máy xưởng; cấu hình `docker-compose.yml` + `Dockerfile` + Caddy đã sẵn để team chạy trên VPS (≥2–4 GB, `deploy/swap-2g.sh`) |

## Ghi chú

- Embedded Postgres (`npm run dev:pg`, port `54329`) dùng được cho seed/test khi không có Docker.
- Logo giữ nguyên từ `.aat/files/` → `public/brand/`.
- Redirect 301 xử lý ở `src/middleware.ts` (không dùng `next.config` redirects vì Next trả 308).
