# First Legal Force — Mockup UI/UX tĩnh

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend / đăng nhập / CMS. Dùng để anh duyệt layout trước giai đoạn 1 (Next.js + Payload).

## Link xem công khai

| Kênh | URL | Trạng thái kiểm tra |
|------|-----|---------------------|
| **jsDelivr (xem ngay)** | https://cdn.jsdelivr.net/gh/lecuong6868/FLF@5ad9e44ad8246753ffe97a987df58feefb294d05/vi/index.html | **HTTP 200** (commit PR #27) |
| jsDelivr EN | https://cdn.jsdelivr.net/gh/lecuong6868/FLF@5ad9e44ad8246753ffe97a987df58feefb294d05/en/index.html | **HTTP 200** |
| GitHub Pages | https://lecuong6868.github.io/FLF/ | **HTTP 404** (chưa xuất bản — cần merge vào `main` + chạy workflow Pages) |
| Pages VI | https://lecuong6868.github.io/FLF/vi/ | **HTTP 404** (cùng lý do) |
| Pages EN | https://lecuong6868.github.io/FLF/en/ | **HTTP 404** (cùng lý do) |

> Sau khi hệ thống gộp code vào `main` và workflow `Deploy static mockup to GitHub Pages` chạy thành công, URL Pages kỳ vọng:
> - https://lecuong6868.github.io/FLF/
> - https://lecuong6868.github.io/FLF/vi/
> - https://lecuong6868.github.io/FLF/en/
>
> Mọi liên kết trong mockup dùng **đường dẫn tương đối** nên chạy đúng dưới tiền tố `/FLF/`.

## Cài đặt & chạy (máy local)

Không cần Node/npm. Chỉ cần Python 3 (có sẵn trên hầu hết máy).

```bash
cd /đường/dẫn/tới/repo
python3 -m http.server 8080
```

Mở trình duyệt:

- http://127.0.0.1:8080/vi/index.html
- http://127.0.0.1:8080/en/index.html

### Mở offline (`file://`) — không cần server

1. Giải nén `flf-mockup-offline.zip` (phương án dự phòng).
2. Mở `vi/index.html` bằng trình duyệt.
3. Chuyển ngôn ngữ bằng nút **VI / EN** trên menu (giữ đúng trang tương ứng).

Font, CSS, logo nằm local trong `assets/` — không phụ thuộc API ngoài.

## Cấu trúc chính

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Chuyển tới `vi/index.html` |
| `vi/` | Trang tiếng Việt |
| `en/` | Trang tiếng Anh |
| `assets/` | CSS, JS, font local, logo |
| `.github/workflows/pages.yml` | Deploy GitHub Pages (chỉ đóng gói mockup) |
| `flf-mockup-offline.zip` | Gói offline dự phòng |
| `deploy/` | Script VPS nginx (giai đoạn sau) |

**Trang trong mockup:** trang chủ · danh sách dịch vụ · chi tiết M&A mẫu · giới thiệu · liên hệ (checkbox ND 13/2023) · tin tức + bài mẫu · dashboard minh họa (không đăng nhập).

## GitHub Pages — việc cần làm để hết 404

Repo đã chọn **Settings → Pages → Source = GitHub Actions** (đúng). Workflow nằm tại `.github/workflows/pages.yml` (trigger: `push` vào `main` hoặc `workflow_dispatch`).

1. **Gộp PR #27** (hoặc gộp nhánh chứa mockup này) vào `main`.
2. Vào **Actions** → workflow **Deploy static mockup to GitHub Pages** → xác nhận run **success**.
3. Nếu workflow **không chạy** hoặc lỗi quyền, kiểm tra (không đoán — chỉ khi thấy lỗi thật):
   - **Settings → Actions → General → Actions permissions:** Allow all actions and reusable workflows
   - **Workflow permissions:** Read and write permissions
   - Tick **Allow GitHub Actions to create and approve pull requests** nếu GitHub yêu cầu
4. Đợi 1–2 phút rồi mở lại https://lecuong6868.github.io/FLF/vi/

## Logo & thông tin công ty

- Logo từ file khách gửi: `assets/img/logo-text.png`, `assets/img/logo-shield.png`.
- Đã đối chiếu công khai (flf.vn): điện thoại `+84 96 444 7153`, email `ruby.huynh@flf.vn`, địa chỉ `33 Trần Quý Khoách, Quận 1, TP.HCM`.
- Mục chưa rõ ghi **chưa xác minh** / **not verified**.

## Kiểm tra đã chạy

### 1) Local HTTP (`python3 -m http.server 8765`) — 2026-11-01

| Kiểm tra | Kết quả |
|----------|---------|
| `GET` toàn bộ trang mockup VI/EN (home, dịch vụ, M&A, giới thiệu, liên hệ, tin, bài mẫu, dashboard) | **200** |
| Asset CSS / JS / logo / font `.woff2` | **200** |
| Chuyển ngôn ngữ VI↔EN giữ đúng trang | **200**, không 404 |
| Chuỗi placeholder lỗi (`lorem ipsum`, `TODO`, `FIXME`) | Không có |

### 2) Mô phỏng tiền tố GitHub Pages `/FLF/` (server local)

| Kiểm tra | Kết quả |
|----------|---------|
| `/FLF/`, `/FLF/vi/`, `/FLF/en/` và trang con | **200** |
| CSS/logo resolve qua đường dẫn tương đối dưới `/FLF/` | **200** |
| Nút EN từ trang VI | **200** → `/FLF/en/index.html` |

### 3) HTTP thật trên internet

| URL | Mã |
|-----|----|
| jsDelivr `@5ad9e44…/vi/index.html` | **200** |
| jsDelivr `@5ad9e44…/en/index.html` | **200** |
| jsDelivr CSS + trang M&A + contact | **200** |
| `https://lecuong6868.github.io/FLF/` (và `/vi/`, `/en/`) | **404** — chờ merge `main` + workflow Pages |

## Ghi chú sản phẩm

- Mockup **không** gửi form, **không** có CMS / AI / MXH thật. Dashboard chỉ minh họa.
- Nội dung dịch vụ diễn đạt thận trọng; hợp tác công ty luật chỉ nhắc ngắn trong phần giới thiệu.
- Giai đoạn sau: Payload CMS, SEO/redirect 301, MXH, chatbot AI.
