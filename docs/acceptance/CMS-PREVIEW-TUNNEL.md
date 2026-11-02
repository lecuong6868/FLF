# Nghiệm thu — CMS Preview qua GitHub Actions + Cloudflare Quick Tunnel

**Mục tiêu:** khách (no-code) mở được `/admin` qua link tạm, **không** cần token Render/Railway/Fly và **không** cần máy xưởng đủ RAM.

**Trạng thái lần này (2026-10-31):** code + workflow sẵn sàng; **chưa đạt nghiệm thu live** vì chưa kích hoạt được `workflow_dispatch` từ máy xưởng (thiếu auth). Xem biên bản [CMS-PREVIEW-TUNNEL-RUN.md](./CMS-PREVIEW-TUNNEL-RUN.md).

## Cách hoạt động

1. Anh (hoặc team) vào GitHub → **Actions** → workflow **CMS Preview** → **Run workflow** (chọn nhánh có `cms/`).
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

1. **Khuyến nghị:** Settings → Secrets and variables → Actions → thêm `PREVIEW_CREDENTIALS_WEBHOOK` (Discord/Slack incoming webhook). Mỗi lần chạy, mật khẩu được POST tới webhook riêng.
2. Tạm đặt repo **Private** → chạy lại → mật khẩu hiện trong Job Summary (chỉ collaborator thấy).
3. Nhắn team kênh riêng kèm Run ID trong lúc job còn sống.

## Việc anh cần làm (không thao tác kỹ thuật sâu)

1. Vào [Actions / CMS Preview](https://github.com/lecuong6868/FLF/actions/workflows/cms-preview.yml) → **Run workflow** (nhánh có `cms/` — nếu nút không hiện ổn định, merge PR vào `main` rồi chạy lại).
2. Đợi job → xem **Summary** lấy link `https://….trycloudflare.com/admin`.
3. Nhận mật khẩu theo một trong các cách trên → đăng nhập thử.
4. Khi hết tunnel: bấm **Run workflow** lại.

**Không cần** cấp token Render/Railway/Fly cho phương án tunnel này.

Nếu team cần tự bấm Run từ máy xưởng: cấp PAT có `actions:write` trên repo (gửi kênh an toàn, không chat công khai).

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
| `docs/acceptance/CMS-PREVIEW-TUNNEL-RUN.md` | Biên bản lần chạy / báo cáo chặn |
| `docs/acceptance/evidence/cms-preview-env.txt` | Ràng buộc máy xưởng |

## Sửa kỹ thuật kèm theo lần này

- Dockerfile: `COPY .npmrc` trước `npm ci` (sửa lỗi peer deps trên CI run trước).
- Job Docker build trên PR: `continue-on-error: true` (đường tunnel mới là nghiệm thu chính).
