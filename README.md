# First Legal Force — Mockup UI/UX tĩnh

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend / đăng nhập / CMS. Dùng để duyệt layout trước giai đoạn 1 (Next.js + Payload).

## Link xem cho khách (không cần đăng nhập)

### Cách A — tải gói offline (khuyến nghị ngay bây giờ)

1. Tải file **`flf-mockup-offline.zip`** từ repo (sau khi nhánh này lên GitHub: mở file → nút Download).
2. Giải nén trên máy.
3. Mở file `vi/index.html` bằng trình duyệt (Chrome/Edge/Safari).
4. Bấm **VI / EN** trên menu để đổi ngôn ngữ (giữ đúng trang tương ứng).

Gói gồm sẵn CSS, font, logo — mở bằng `file://` vẫn chạy, không cần cài đặt gì thêm.

### Cách B — GitHub Pages (URL đẹp, cần chủ repo gộp PR)

| URL kỳ vọng | Trạng thái hiện tại |
|-------------|---------------------|
| https://lecuong6868.github.io/FLF/ | **404** |
| https://lecuong6868.github.io/FLF/vi/ | **404** |
| https://lecuong6868.github.io/FLF/en/ | **404** |

**Vì sao 404:** `main` chưa có workflow Pages; PR **#27** / **#28** chưa gộp. Settings → Pages → Source = **GitHub Actions** đã đúng. Token GitHub của xưởng AAT gọi API repo này bị **`401 Bad credentials`** → xưởng **không gộp PR / không chạy workflow** được.

**Việc chỉ tài khoản `lecuong6868` làm được (giao diện GitHub, không cần Terminal):**

1. Mở https://github.com/lecuong6868/FLF/pull/28 → bấm **Merge pull request** → **Confirm merge**.
2. Vào tab **Actions** → workflow **Deploy static mockup to GitHub Pages** → chờ dấu ✓ xanh (nếu chưa chạy: **Run workflow**).
3. Nếu workflow báo lỗi quyền: **Settings → Actions → General** → Allow all actions; **Workflow permissions = Read and write**.
4. Sau 1–2 phút mở lại https://lecuong6868.github.io/FLF/vi/ (kỳ vọng **200**).

### Xác minh file công khai (HTTP 200 — commit PR #28)

Các URL sau trả **200** (dùng để chứng minh file đã trên GitHub). CDN thường trả HTML với `Content-Type: text/plain` nên trình duyệt có thể hiện mã nguồn thay vì giao diện — **xem UI bằng Cách A hoặc Cách B**.

| Tài nguyên | URL | Mã |
|------------|-----|----|
| VI home | https://cdn.jsdelivr.net/gh/lecuong6868/FLF@58b27d3c87eb1ef470fc838db87b975b9055c7eb/vi/index.html | **200** |
| EN home | https://cdn.jsdelivr.net/gh/lecuong6868/FLF@58b27d3c87eb1ef470fc838db87b975b9055c7eb/en/index.html | **200** |
| CSS / logo / font / trang con | cùng tiền tố `@58b27d3…` | **200** (đã quét đủ) |

## Cài đặt & chạy (máy dev)

Không cần Node/npm. Chỉ cần Python 3.

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
| `assets/` | CSS, JS, font local, logo |
| `.github/workflows/pages.yml` | Deploy GitHub Pages — trigger `push` vào `main` + `workflow_dispatch`; quyền `pages:write`, `id-token:write`; chỉ đóng gói mockup (`index.html`, `assets`, `vi`, `en`) |
| `flf-mockup-offline.zip` | Gói offline dự phòng |
| `deploy/` | Script VPS nginx (giai đoạn sau) |

**Trang trong mockup:** trang chủ · danh sách dịch vụ · chi tiết M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức + bài mẫu · dashboard minh họa (không đăng nhập).

Mọi liên kết dùng **đường dẫn tương đối** — chạy đúng dưới tiền tố `/FLF/` trên GitHub Pages.

## Logo & thông tin công ty

- Logo khách gửi: `assets/img/logo-text.png`, `assets/img/logo-shield.png`.
- Đối chiếu công khai (flf.vn): `+84 96 444 7153`, `ruby.huynh@flf.vn`, `33 Trần Quý Khoách, Quận 1, TP.HCM`.
- Mục chưa rõ ghi **chưa xác minh** / **not verified**.

## Kiểm tra đã chạy (2026-11-01)

### 1) Local HTTP

| Kiểm tra | Kết quả |
|----------|---------|
| Toàn bộ trang VI/EN + CSS/JS/logo/font | **200** |
| Chuyển VI↔EN (home, liên hệ, M&A, giới thiệu) | **200** |

### 2) Mô phỏng tiền tố `/FLF/`

| Kiểm tra | Kết quả |
|----------|---------|
| `/FLF/`, `/FLF/vi/`, `/FLF/en/`, trang con, CSS, logo | **200** |
| EN từ trang Giới thiệu VI | **200** → `/FLF/en/about/index.html` |

### 3) Internet

| Kiểm tra | Kết quả |
|----------|---------|
| jsDelivr `@58b27d3…` (PR #28) — trang + asset | **200** |
| `https://lecuong6868.github.io/FLF/` · `/vi/` · `/en/` | **404** — chờ merge PR #28 |
| Gộp PR qua API bằng token xưởng | **401 Bad credentials** |

## Ghi chú sản phẩm

- Mockup **không** gửi form, **không** có CMS / AI / MXH thật. Dashboard chỉ minh họa.
- Hợp tác công ty luật chỉ nhắc ngắn trong phần giới thiệu.
- Giai đoạn sau: Payload CMS, SEO/redirect 301, MXH, chatbot AI.
