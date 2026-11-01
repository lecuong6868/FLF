# First Legal Force — Mockup UI/UX tĩnh (VI/EN)

## Kết quả lần này: CHƯA HOÀN TẤT (chưa xuất bản được URL công khai đạt tiêu chí)

Phiên Cursor mới **đã kiểm tra xác thực một lần** — vẫn **không** nhận được credential GitHub ghi hợp lệ, nên **không** triển khai lại GitHub Pages (theo yêu cầu: không lặp deploy khi auth thất bại).

| | URL | Kết quả (2026-11-01 ~16:58 +07) |
|---|-----|----------------------------------|
| **VI (kỳ vọng Pages)** | https://lecuong6868.github.io/FLF/vi/ | **404** — chưa có site Pages |
| **EN (kỳ vọng Pages)** | https://lecuong6868.github.io/FLF/en/ | **404** |
| Gốc Pages | https://lecuong6868.github.io/FLF/ | **404** Site not found |
| Bằng chứng 404 | `docs/evidence/pages-vi-404-1440.png` | Octocat / Site not found |

### Lỗi nằm ở bước truyền credential vào môi trường chạy (đã che bí mật)

| Kiểm tra | Kết quả |
|----------|---------|
| Biến môi trường `GH_TOKEN` | **có mặt nhưng rỗng** (`len=0`) |
| `GITHUB_TOKEN` / `NETLIFY_AUTH_TOKEN` / `SURGE_TOKEN` / `VERCEL_TOKEN` | **không có** |
| CLI `gh` | **không cài** |
| `~/.ssh`, `~/.git-credentials`, `~/.config/gh` | **không có** |
| `GET https://api.github.com/user` (không Bearer) | **401** Unauthorized |
| `git push --dry-run origin HEAD` | **fatal:** could not read Username (prompts disabled) |
| Repo public đọc được | `git ls-remote` / API repo **OK** (chỉ đọc) |

Đây là bằng chứng **phiên chạy chưa được inject credential ghi**, **không** phải bằng chứng tài khoản khách thiếu quyền trên GitHub. Đã đọc PR #29–#32 (đặc biệt #32 + `docs/evidence/VERIFY.json`); không đổi DNS / flf.vn.

Khi credential ghi + quyền Pages hoạt động, URL ổn định kỳ vọng (Settings → Pages source = **GitHub Actions**, xem ảnh khách trong `.aat/files/`):

- https://lecuong6868.github.io/FLF/vi/
- https://lecuong6868.github.io/FLF/en/

Workflow sẵn có: `.github/workflows/pages.yml` (trigger `push` lên `main` hoặc `workflow_dispatch`).

---

## Mockup trong repo (đã khôi phục, không thiết kế lại)

Nguồn: nhánh PR #32 (`aat/20261101-161434`) ← mockup commit `936c5d94…` / PR #29–#31. Logo khách khớp hash `.aat/files/Logo_color.png` và `First_Legal_Force.png`.

### Cài đặt & chạy trên máy

Không cần Node/npm. Chỉ cần Python 3:

```bash
cd /đường/dẫn/tới/repo
python3 -m http.server 8080
```

Mở:

- http://127.0.0.1:8080/vi/index.html
- http://127.0.0.1:8080/en/index.html

Hoặc giải nén `flf-mockup-offline.zip` rồi mở `vi/index.html` (liên kết tương đối, chạy được offline / `file://`).

### Cấu trúc chính

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Chuyển tới `vi/index.html` |
| `vi/` | Trang tiếng Việt |
| `en/` | Trang tiếng Anh |
| `assets/` | CSS, JS, font local, logo |
| `.nojekyll` | Tắt Jekyll trên GitHub Pages |
| `.github/workflows/pages.yml` | Deploy Pages khi push `main` |
| `docs/evidence/` | Ảnh chụp + `VERIFY.json` |
| `deploy/` | Script VPS nginx (giai đoạn sau) |

**Trang:** trang chủ · dịch vụ · M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức · dashboard minh họa.

Nút **VI ↔ EN** giữ đúng trang tương ứng (ví dụ Liên hệ ↔ Contact, Dịch vụ ↔ Services).

### Kiểm thử local (phiên này)

Server `python3 -m http.server 8765`: VI/EN, CSS, JS, logo, font trả **200**. Chuyển ngữ HTML đúng cặp trang. Ảnh Chromium 390px / 1440px:

- `docs/evidence/local-vi-home-1440.png`
- `docs/evidence/local-vi-home-390.png`
- `docs/evidence/local-en-home-1440.png`
- `docs/evidence/local-en-home-390.png`

Chi tiết máy kiểm: `docs/evidence/VERIFY.json`.

### Logo & thông tin công ty

- Logo: `assets/img/logo-text.png`, `assets/img/logo-shield.png`
- Đối chiếu công khai (flf.vn): `+84 96 444 7153`, `ruby.huynh@flf.vn`, `33 Trần Quý Khoách, Quận 1, TP.HCM`

## Việc anh cần làm tiếp

1. **Sửa bước truyền credential vào phiên Cursor/AAT** để `GH_TOKEN` (hoặc git credential helper / GitHub App) không còn rỗng — **không** gửi token trong chat. Sau đó hệ thống mới push được workflow lên `main` và Pages mới lên.
2. Khi Pages đã live: nghiệm thu lại VI/EN ở 390px và 1440px trên `lecuong6868.github.io/FLF/…` (không qua rawcdn/githack; không chỉ dựa HTTP 200).
3. Các hạng mục sản phẩm còn mở (DNS flf.vn, VPS, MXH giai đoạn 2…) giữ nguyên theo bộ nhớ dự án — **không** làm trong lần này.
