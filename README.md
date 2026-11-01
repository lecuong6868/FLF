# First Legal Force — Mockup UI/UX tĩnh (VI/EN)

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend / đăng nhập / CMS. Dùng để duyệt layout trước giai đoạn 1 (Next.js + Payload).

## Link xem cho khách (bấm là ra giao diện)

**Mở trang chủ tiếng Việt (khuyến nghị):**  
https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/index.html

| Trang | URL |
|-------|-----|
| Gốc (chuyển sang VI) | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/index.html |
| Trang chủ VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/index.html |
| Trang chủ EN | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/en/index.html |
| Dịch vụ VI | …/vi/dich-vu/index.html |
| Liên hệ VI (checkbox ND 13/2023) | …/vi/lien-he/index.html |
| Tin tức VI | …/vi/tin-tuc/index.html |
| Dashboard minh họa VI | …/vi/dashboard/index.html |

> Link dùng CDN **rawcdn.githack.com** phục vụ file HTML với `Content-Type: text/html` (render giao diện, không hiện mã nguồn). Nguồn file = commit mockup PR #29 trên repo `lecuong6868/FLF`.

### Dự phòng offline

1. Tải **`flf-mockup-offline.zip`** trong repo này.
2. Giải nén → mở `vi/index.html` bằng trình duyệt.
3. Đổi ngôn ngữ bằng nút **VI / EN** trên menu (giữ đúng trang tương ứng).

## Cài đặt & chạy trên máy

Không cần Node/npm. Chỉ cần Python 3:

```bash
cd /đường/dẫn/tới/repo
python3 -m http.server 8080
```

Mở:

- http://127.0.0.1:8080/vi/index.html
- http://127.0.0.1:8080/en/index.html

## Cấu trúc chính

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Chuyển tới `vi/index.html` |
| `vi/` | Trang tiếng Việt |
| `en/` | Trang tiếng Anh |
| `assets/` | CSS, JS, font local, logo khách |
| `.nojekyll` | Tắt xử lý Jekyll trên GitHub Pages |
| `.github/workflows/pages.yml` | Workflow deploy GitHub Pages (khi có quyền push/merge) |
| `flf-mockup-offline.zip` | Gói offline dự phòng |
| `deploy/` | Script VPS nginx (giai đoạn sau) |

**Trang trong mockup:** trang chủ · danh sách dịch vụ · chi tiết M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức + bài mẫu · dashboard minh họa (không đăng nhập).

Mọi liên kết dùng **đường dẫn tương đối** — chạy đúng dưới tiền tố `/FLF/` trên GitHub Pages.

## Logo & thông tin công ty

- Logo khách gửi: `assets/img/logo-text.png`, `assets/img/logo-shield.png`.
- Đối chiếu công khai (flf.vn): `+84 96 444 7153`, `ruby.huynh@flf.vn`, `33 Trần Quý Khoách, Quận 1, TP.HCM`.

## Kết quả kiểm tra HTTP (2026-11-01)

### 1) Link công khai — rawcdn.githack (commit `936c5d94…`)

| Kiểm tra | HTTP | Content-Type |
|----------|------|--------------|
| `/index.html` | **200** | `text/html; charset=utf-8` |
| `/vi/index.html` | **200** | `text/html; charset=utf-8` |
| `/en/index.html` | **200** | `text/html; charset=utf-8` |
| `/vi/dich-vu/index.html` | **200** | `text/html; charset=utf-8` |
| `/vi/lien-he/index.html` | **200** | `text/html; charset=utf-8` |
| `/vi/tin-tuc/index.html` | **200** | `text/html; charset=utf-8` |
| `/vi/dashboard/index.html` | **200** | `text/html; charset=utf-8` |
| `/en/services/index.html` | **200** | `text/html; charset=utf-8` |
| `/en/contact/index.html` | **200** | `text/html; charset=utf-8` |
| `/en/news/index.html` | **200** | `text/html; charset=utf-8` |
| `/en/dashboard/index.html` | **200** | `text/html; charset=utf-8` |
| `/assets/css/styles.css` | **200** | `text/css; charset=utf-8` |
| `/assets/js/main.js` | **200** | `application/javascript; charset=utf-8` |
| `/assets/img/logo-shield.png` | **200** | `image/png` |
| `/assets/fonts/source-sans-3-400.woff2` | **200** | `application/font-woff2` |

Nút **VI ↔ EN** giữ đúng trang tương ứng (ví dụ Liên hệ VI → Contact EN), không 404.

### 2) Local + mô phỏng tiền tố `/FLF/`

Toàn bộ trang VI/EN, CSS/JS/logo/font: **200**. Đường dẫn `/FLF/vi/`, `/FLF/en/`, `/FLF/assets/...`: **200**.

### 3) GitHub Pages chính thức (`lecuong6868.github.io/FLF`)

| URL | Kết quả |
|-----|---------|
| https://lecuong6868.github.io/FLF/ | **404** (chưa deploy) |
| Token GitHub xưởng AAT (`gh auth` / `GH_TOKEN`) | **401 Bad credentials** — không push nhánh `gh-pages`, không gộp PR, không bật Pages qua API được |

Settings → Pages hiện **Source = GitHub Actions**; workflow đã có trong repo mockup nhưng chưa chạy được vì thiếu quyền ghi.

## Việc anh (chủ repo) cần làm — đúng một việc

Tạo **Personal Access Token** GitHub (classic hoặc fine-grained) của tài khoản **`lecuong6868`** với quyền **`repo`** + **`pages`** (hoặc Contents + Pages write), rồi dán vào phần kết nối GitHub AAT / cấp lại token cho xưởng.

Sau đó xưởng sẽ: gộp PR mockup → chạy workflow Pages → URL đẹp ổn định `https://lecuong6868.github.io/FLF/vi/`.

*(Trong lúc chờ token: dùng link rawcdn.githack ở đầu README — đã render đúng.)*

## Ghi chú sản phẩm

- Mockup **không** gửi form, **không** có CMS / AI / MXH thật. Dashboard chỉ minh họa.
- Hợp tác công ty luật chỉ nhắc ngắn trong phần giới thiệu.
- Giai đoạn sau: Payload CMS, SEO/redirect 301, MXH, chatbot AI.
