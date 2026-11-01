# First Legal Force — Mockup UI/UX tĩnh (VI/EN)

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend / đăng nhập / CMS. Dùng để duyệt layout trước giai đoạn 1 (Next.js + Payload).

## Link xem cho khách (bấm là ra giao diện)

**Mở trang chủ tiếng Việt (khuyến nghị):**  
https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/index.html

| Trang | URL đầy đủ |
|-------|------------|
| Gốc (chuyển sang VI) | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/index.html |
| Trang chủ VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/index.html |
| Trang chủ EN | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/en/index.html |
| Dịch vụ VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/dich-vu/index.html |
| Giới thiệu VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/gioi-thieu/index.html |
| Liên hệ VI (checkbox ND 13/2023) | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/lien-he/index.html |
| Tin tức VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/tin-tuc/index.html |
| Dashboard minh họa VI | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/vi/dashboard/index.html |
| Services EN | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/en/services/index.html |
| Contact EN | https://rawcdn.githack.com/lecuong6868/FLF/936c5d94de75507e0840824ba89ccd3aad09df53/en/contact/index.html |

> CDN **rawcdn.githack.com** phục vụ HTML với `Content-Type: text/html` (render giao diện). Nguồn = commit `936c5d94de75507e0840824ba89ccd3aad09df53` trên repo `lecuong6868/FLF`.

### Lưu ý khi mở link

Lần đầu trình duyệt có thể hiện trang **External Content Notice** của githack (không phải đăng nhập). Bấm nút bên cạnh ô URL một lần — sau đó giao diện FLF (logo, CSS, font, menu VI/EN) hiện bình thường. Các lần sau trong cùng phiên thường không hỏi lại.

### Dự phòng offline

1. Tải **`flf-mockup-offline.zip`** trong repo này.
2. Giải nén → mở `vi/index.html` bằng trình duyệt (hoặc chạy server local bên dưới).
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
| `.github/workflows/pages.yml` | Workflow deploy GitHub Pages (khi có quyền push/merge vào `main`) |
| `flf-mockup-offline.zip` | Gói offline dự phòng |
| `docs/evidence/` | Ảnh chụp trình duyệt + `VERIFY.json` |
| `deploy/` | Script VPS nginx (giai đoạn sau) |

**Trang trong mockup:** trang chủ · danh sách dịch vụ · chi tiết M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức + bài mẫu · dashboard minh họa (không đăng nhập).

Mọi liên kết dùng **đường dẫn tương đối** — chạy đúng dưới tiền tố `/FLF/` trên GitHub Pages.

## Logo & thông tin công ty

- Logo khách gửi: `assets/img/logo-text.png`, `assets/img/logo-shield.png` (đối chiếu `.aat/files/`).
- Đối chiếu công khai (flf.vn): `+84 96 444 7153`, `ruby.huynh@flf.vn`, `33 Trần Quý Khoách, Quận 1, TP.HCM`.

## Kết quả kiểm tra (2026-11-01 12:17 +07 / 05:17 UTC)

### 1) Link công khai — rawcdn.githack (commit `936c5d94…`)

| Kiểm tra | HTTP | Content-Type |
|----------|------|--------------|
| `/vi/index.html` | **200** | `text/html` |
| `/en/index.html` | **200** | `text/html` |
| `/assets/css/styles.css` | **200** | `text/css` |
| `/assets/js/main.js` | **200** | `application/javascript` |
| `/assets/img/logo-shield.png` | **200** | `image/png` |
| `/assets/fonts/source-sans-3-400.woff2` | **200** | `application/font-woff2` |

Trình duyệt (Chromium headless): sau Continue trên notice → title VI/EN đúng, font **Source Sans 3**, logo tải được. Ảnh bằng chứng: `docs/evidence/vi-home-1440.png`, `vi-home-390.png`, `en-home-1440.png`, `en-home-390.png` (và bản `local-*` tương ứng).

Nút **VI ↔ EN** trong HTML giữ đúng trang tương ứng (ví dụ Liên hệ VI ↔ Contact EN).

### 2) Local (`python3 -m http.server`)

Toàn bộ trang VI/EN đã kiểm thử smoke (200): trang chủ, dịch vụ, liên hệ, dashboard, CSS, logo, font.

### 3) GitHub Pages chính thức

| URL | Kết quả |
|-----|---------|
| https://lecuong6868.github.io/FLF/ | **404** (chưa deploy) |
| Token GitHub trên xưởng AAT (`GH_TOKEN`) | **rỗng / 401** — không push, không gộp PR, không bật Pages qua API |

Settings → Pages: Source = **GitHub Actions** (đúng với workflow trong repo). Workflow sẵn nhưng **chưa chạy được** vì thiếu quyền ghi vào `main` / token hợp lệ.

### 4) Hosting dự phòng đã thử trong phiên này

- **Netlify CLI:** chưa đăng nhập (không có `NETLIFY_AUTH_TOKEN`).
- **Surge:** chưa đăng nhập (không có `SURGE_TOKEN`).
- **jsDelivr:** file về được nhưng `text/plain` → không dùng làm link xem giao diện.

## Việc anh cần làm tiếp (để có URL Pages “sạch”, không qua notice githack)

Không gửi token trong chat. Chỉ cần cấp **một** trong các quyền sau cho môi trường triển khai (GitHub App / fine-grained PAT với quyền repo, hoặc mời tài khoản triển khai làm collaborator **write** trên `lecuong6868/FLF`):

1. Quyền **push/merge vào `main`** (hoặc bật workflow `Deploy static mockup to GitHub Pages` + quyền `pages: write`), **hoặc**
2. Đăng nhập sẵn **Netlify** / **Surge** trên máy triển khai (`NETLIFY_AUTH_TOKEN` hoặc `SURGE_TOKEN` trong secret CI), **hoặc**
3. Trỏ DNS + quyền SSH lên VPS và chạy `deploy/setup.sh` (khi đã đồng ý VPS).

Khi đó URL ổn định kỳ vọng: `https://lecuong6868.github.io/FLF/vi/` (không phụ thuộc rawcdn).
