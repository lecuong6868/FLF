# First Legal Force — Mockup UI/UX tĩnh (VI/EN)

## Kết quả lần này: CHƯA HOÀN TẤT (chưa có URL công khai đạt tiêu chí)

Không có link HTTPS công khai nào mở được **ngay** (không đăng nhập, không cảnh báo Continue) và hiển thị đủ giao diện FLF. Các URL VI/EN bên dưới là trạng thái đã kiểm tra thực tế — **không** dùng làm nghiệm thu giao diện.

| | URL | Kết quả kiểm tra (2026-11-01 ~16:18 +07) |
|---|-----|------------------------------------------|
| **VI (kỳ vọng Pages)** | https://lecuong6868.github.io/FLF/vi/ | **404** — GitHub Pages chưa triển khai |
| **EN (kỳ vọng Pages)** | https://lecuong6868.github.io/FLF/en/ | **404** — cùng nguyên nhân |
| Gốc Pages | https://lecuong6868.github.io/FLF/ | **404** Site not found |
| CDN tạm (không đạt tiêu chí) | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/index.html | HTML `200` / `text/html`, nhưng trình duyệt mới hiện **External Content Notice** (phải bấm Continue) — **không đạt** yêu cầu mở trực tiếp |
| CDN tạm EN | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/en/index.html | Cùng hạn chế interstitial githack |
| jsDelivr | `cdn.jsdelivr.net/gh/lecuong6868/FLF@936c5d94…/vi/index.html` | `200` nhưng `Content-Type: text/plain` — **không dùng** |

### Quyền / kết nối đã xác minh thiếu (không lặp thao tác ghi sau 401)

| Kiểm tra | Kết quả |
|----------|---------|
| Biến `GH_TOKEN` trên môi trường AAT | **rỗng** (`len=0`) |
| `GET /repos/lecuong6868/FLF/pages` kèm Bearer | **401** Bad credentials |
| `git push --dry-run` lên `origin` | **fatal:** không đọc được Username (terminal prompts disabled) |
| `NETLIFY_AUTH_TOKEN` / `SURGE_TOKEN` / `VERCEL_TOKEN` | **không có** |
| Settings → Pages (ảnh khách trong `.aat/files/`) | Source = **GitHub Actions**; chưa có workflow chạy trên `main` |

Repo đã có `.github/workflows/pages.yml` (deploy mockup tĩnh). Khi có quyền **write/merge vào `main`** (hoặc token CI hợp lệ với `pages: write`), URL ổn định kỳ vọng:

- https://lecuong6868.github.io/FLF/vi/
- https://lecuong6868.github.io/FLF/en/

**Không** gửi token trong chat; cấp quyền qua GitHub App / collaborator write / secret CI trên môi trường triển khai.

---

## Mockup trong repo (đã khôi phục)

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend. Nguồn: commit `936c5d94de75507e0840824ba89ccd3aad09df53` / nhánh PR #31 (`aat/20261101-120818`). Logo khách giữ nguyên (khớp `.aat/files/Logo_color.png`, `First_Legal_Force.png`).

### Cài đặt & chạy trên máy

Không cần Node/npm. Chỉ cần Python 3:

```bash
cd /đường/dẫn/tới/repo
python3 -m http.server 8080
```

Mở:

- http://127.0.0.1:8080/vi/index.html
- http://127.0.0.1:8080/en/index.html

Hoặc giải nén `flf-mockup-offline.zip` rồi mở `vi/index.html`.

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

**Trang:** trang chủ · dịch vụ · M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức · dashboard minh họa. Liên kết **tương đối** — chạy đúng dưới tiền tố `/FLF/` trên Pages.

Nút **VI ↔ EN** giữ đúng trang (ví dụ Liên hệ ↔ Contact).

### Kiểm thử local (phiên này)

Server `python3 -m http.server 8765`: các trang VI/EN, CSS, logo, font, JS trả **200**. Chuyển ngữ trong HTML đúng cặp trang. Ảnh bằng chứng Chromium (390px / 1440px): `docs/evidence/local-*-home-*.png`. Ảnh mở rawcdn lần đầu: `docs/evidence/rawcdn-vi-attempt-1440.png` (trang notice, không phải mockup).

### Logo & thông tin công ty

- Logo: `assets/img/logo-text.png`, `assets/img/logo-shield.png`
- Đối chiếu công khai (flf.vn): `+84 96 444 7153`, `ruby.huynh@flf.vn`, `33 Trần Quý Khoách, Quận 1, TP.HCM`

## Việc anh cần làm tiếp

1. Cấp **một** quyền triển khai sạch cho máy/CI (không gửi token trong hội thoại):
   - Collaborator **write** trên `lecuong6868/FLF` + merge workflow Pages vào `main`, **hoặc**
   - Secret `NETLIFY_AUTH_TOKEN` / `SURGE_TOKEN` đã login, **hoặc**
   - VPS + DNS khi đã đồng ý hosting (`deploy/setup.sh`).
2. Sau khi Pages lên: nghiệm thu lại VI/EN ở 390px và 1440px trên URL `lecuong6868.github.io/FLF/…` (không qua githack).
