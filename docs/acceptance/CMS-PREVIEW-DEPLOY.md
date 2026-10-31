# Nghiệm thu — Triển khai bản thử Dashboard CMS

**Thời điểm:** 2026-10-31  
**Nhánh làm việc:** `aat/20261031-214119`  
**Nguồn CMS:** tái sử dụng `cms/` từ PR #23 (`aat/20261031-192057`)

## Mục tiêu lần này

Đưa Payload CMS lên dịch vụ thử miễn phí/rẻ để khách (no-code) mở được `/admin`.

## Đã chuẩn bị trong repo

| Hạng mục | Trạng thái |
|----------|------------|
| `cms/Dockerfile` (standalone Next + seed lúc start) | Đã thêm |
| `render.yaml` (Blueprint Render free web) | Đã thêm |
| `cms/railway.toml`, `cms/fly.toml` | Đã thêm |
| `.github/workflows/cms-preview.yml` (build trên runner đủ RAM) | Đã thêm |
| `.env.example` (`DATABASE_URL` / `DATABASE_URI`, `PREVIEW_MODE`, seed) | Đã cập nhật |
| `scripts/generate-preview-secrets.sh` (mật khẩu ngẫu nhiên mạnh) | Đã thêm |
| `scripts/start-preview.sh` | Đã thêm |
| Noindex: `PREVIEW_MODE`, `public/robots.txt`, header `X-Robots-Tag`, metadata robots | Đã bật |
| `FLF-preview/` không bị sửa | Đúng |
| README tiếng Việt (root + `cms/`) + hướng dẫn VPS ~24 USD/tháng | Đã cập nhật |

## Kết quả triển khai live trên máy xưởng này

| Hạng mục | Kết quả |
|----------|---------|
| Build `/admin` local | **Không thể** — RAM ~1 GiB, OOM (đã biết từ bước 1) |
| Docker local | **Không có** Docker / docker.sock |
| Render / Railway / Fly / Neon / Vercel API | **Không có** API token / tài khoản gắn sẵn |
| GitHub CLI token ghi repo/Actions | **Không dùng được** trong session (`GH_TOKEN` trống) |
| Link công khai `/admin` đã kiểm chứng | **Chưa có** — **không gửi link chưa kiểm chứng** |

### Trích kiểm tra môi trường (2026-10-31)

```
Mem: ~961Mi total
Docker: not found
RENDER_API_KEY / RAILWAY_TOKEN / FLY_API_TOKEN / VERCEL_TOKEN / NEON_API_KEY: missing
```

## Quyền anh cần cấp (chỉ cấp quyền, không bắt thao tác kỹ thuật)

Để team (hoặc Blueprint một lần) mở được link thử:

1. **Render ↔ GitHub:** đăng nhập Render bằng GitHub, cho phép truy cập repo **`lecuong6868/FLF`** (hoặc org chứa quyền).
2. **Neon (Postgres miễn phí):** đăng nhập Neon bằng GitHub → tạo 1 project/database → gửi **connection string** cho team qua kênh an toàn (tin nhắn riêng / password manager).  
   *Lý do Neon:* Render Free Postgres đã ngừng; web free vẫn chạy được nếu tự gắn `DATABASE_URL`.
3. **Tuỳ chọn thay thế:** tài khoản Railway **hoặc** Fly.io + ủy quyền repo / cung cấp token cho team cấu hình giúp.

Sau khi có quyền + connection string, team sẽ:

- Apply `render.yaml` (hoặc Railway/Fly),
- Điền secret seed từ `cms/.preview-credentials` (sinh bằng `generate-preview-secrets.sh`),
- Chạy kiểm tra: `GET /admin` 200 → đăng nhập admin → tạo/sửa bài → xác nhận editor không đăng được,
- Lưu HTTP status / log / ảnh vào `docs/acceptance/evidence/` và cập nhật PR.

## Tiêu chí hoàn thành (chưa đạt đủ vì thiếu quyền cloud)

- [ ] Link công khai mở được `/admin`
- [ ] Đăng nhập admin thành công
- [ ] Tạo/sửa bài thử
- [ ] Phân quyền nhân viên/admin hoạt động trên bản thử
- [ ] Bằng chứng trong PR

Phần **cấu hình sẵn sàng** đã xong; phần **link live** chờ quyền ở trên.

## Chuyển VPS (~24 USD/tháng)

Xem `cms/README.md` mục “Chuyển sang VPS” và `deploy/README.md` (site tĩnh). CMS cần máy ≥4 GiB khi build; tắt `PREVIEW_MODE` trên production.
