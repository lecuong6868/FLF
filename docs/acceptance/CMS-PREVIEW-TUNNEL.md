# Nghiệm thu — CMS Preview qua GitHub Actions + Cloudflare Quick Tunnel

**Mục tiêu:** khách (no-code) mở được `/admin` qua link tạm, **không** cần token Render/Railway/Fly và **không** cần máy xưởng đủ RAM.

## Cách hoạt động

1. Anh (hoặc team) vào GitHub → **Actions** → workflow **CMS Preview** → **Run workflow**.
2. Runner `ubuntu-latest` (~7 GiB RAM) dựng Postgres (service), `npm ci` + `npm run build` trong `cms/`.
3. Sinh mật khẩu seed ngẫu nhiên mạnh mỗi lần chạy (mask trong log).
4. Seed admin/editor → khởi động Payload → mở **Cloudflare Quick Tunnel** (`*.trycloudflare.com`, không cần tài khoản Cloudflare).
5. Tự kiểm tra:
   - `GET /admin` → 200/3xx
   - `POST /api/users/login` (admin) → có token
   - Editor tạo nháp / chờ duyệt, **không** đăng được; admin đăng được (`http-accept` + `test:access`)
6. In **URL `/admin`** vào **Job Summary**; upload artifact `cms-preview-acceptance-<run_id>`.
7. Job giữ tunnel ~60–90 phút (mặc định 75; chỉnh khi Run workflow). Hết giờ hoặc Cancel → tắt.

## Mật khẩu (repo đang public)

Repo `lecuong6868/FLF` đang **public** → workflow **không** in mật khẩu vào Summary/log công khai.

Cách nhận mật khẩu an toàn (chọn 1):

1. **Khuyến nghị:** Settings → Secrets → Actions → thêm `PREVIEW_CREDENTIALS_WEBHOOK` (Discord/Slack incoming webhook). Mỗi lần chạy, mật khẩu được POST tới webhook riêng.
2. Tạm đặt repo **Private** → chạy lại → mật khẩu hiện trong Job Summary (chỉ collaborator thấy).
3. Nhắn team kênh riêng kèm Run ID trong lúc job còn sống.

## Việc anh cần làm (không thao tác kỹ thuật sâu)

1. Vào [Actions / CMS Preview](https://github.com/lecuong6868/FLF/actions/workflows/cms-preview.yml) → **Run workflow** (nhánh có `cms/`).
2. Đợi job xanh / xem Summary lấy link `https://….trycloudflare.com/admin`.
3. Nhận mật khẩu theo một trong các cách trên → đăng nhập thử.
4. Khi hết tunnel: bấm **Run workflow** lại.

**Không cần** cấp token Render/Railway/Fly cho phương án tunnel này.

## Giới hạn bản thử

- Chỉ để **xem / dùng thử** Dashboard.
- `PREVIEW_MODE=true` → noindex (`robots.txt`, `X-Robots-Tag`).
- Dữ liệu Postgres trên runner **mất** khi job kết thúc.
- Không phải môi trường production.

## Chuyển VPS (~24 USD/tháng)

Khi đồng ý chạy chính thức: máy ≥4 GiB RAM, Postgres bền, `PREVIEW_MODE=false`, DNS `flf.vn`. Xem `README.md` / `cms/README.md` / `deploy/README.md`.

## Bằng chứng

| File / artifact | Nội dung |
|-----------------|----------|
| Job Summary | URL tunnel, email seed, (mật khẩu nếu private) |
| Artifact `cms-preview-acceptance-*` | `http-accept-*.log`, `test-access.log`, `seed.log` |
| `docs/acceptance/CMS-PREVIEW-TUNNEL-RUN.md` | Biên bản lần chạy (sinh trên runner, trong artifact) |

## Trạng thái trên máy xưởng AAT

Máy xưởng ~1 GiB RAM / không Docker / không `gh` token ghi Actions → **không** tự kích hoạt workflow từ đây. Sau khi hệ thống push nhánh/PR, anh hoặc team bấm **Run workflow** để có link và log thật.
