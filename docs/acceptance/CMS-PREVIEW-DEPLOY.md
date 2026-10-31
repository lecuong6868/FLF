# Nghiệm thu — Triển khai bản thử Dashboard CMS

**Cập nhật:** 2026-10-31 — ưu tiên **GitHub Actions + Cloudflare Quick Tunnel** (không cần token cloud).

## Phương án chính (đã hiện thực)

Xem **[CMS-PREVIEW-TUNNEL.md](./CMS-PREVIEW-TUNNEL.md)**.

| Hạng mục | Trạng thái |
|----------|------------|
| Workflow `cms-preview.yml` (workflow_dispatch) | Postgres service + build + seed + cloudflared + accept |
| Mật khẩu seed ngẫu nhiên mỗi lần | Có (mask log; Summary chỉ khi private / webhook) |
| Tự kiểm `GET /admin`, login API, phân quyền | `http-accept.ts` + `test:access` |
| Bằng chứng | Artifact + `docs/acceptance/evidence/` trên runner |
| `FLF-preview/` không sửa | Đúng |
| Noindex (`PREVIEW_MODE`) | Đúng |

### Trên máy xưởng AAT (~1 GiB)

Không build/chạy được `/admin` tại đây (OOM đã biết). Không có `gh` để tự bấm Run workflow. Sau khi hệ thống đẩy code lên GitHub, **anh bấm Run workflow** để có URL và log thật.

## Phương án phụ — Render / Railway / Fly

Vẫn giữ `render.yaml`, `cms/railway.toml`, `cms/fly.toml`, `cms/Dockerfile` nếu cần bản thử **lâu hơn 90 phút**.

**Anh chỉ cần cấp quyền (không thao tác kỹ thuật):**

1. Render ↔ GitHub: cho phép truy cập repo `lecuong6868/FLF`.
2. Neon: connection string (kênh an toàn).
3. Hoặc Railway / Fly + token tương ứng.

## Chuyển VPS (~24 USD/tháng)

Xem `cms/README.md` và `deploy/README.md`. Tắt `PREVIEW_MODE` trên production.
