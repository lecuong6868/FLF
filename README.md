# First Legal Force — Mockup UI/UX tĩnh

Bản xem giao diện website FLF (thay WordPress cũ) bằng **HTML/CSS thuần**, song ngữ **VI/EN**, không cần backend / đăng nhập / CMS. Dùng để khách duyệt layout trước khi làm giai đoạn 1 (Next.js + Payload).

## Cấu trúc chính

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Chuyển tới `vi/index.html` |
| `vi/` | Trang tiếng Việt (`/vi/...`) |
| `en/` | Trang tiếng Anh (`/en/...`) |
| `assets/` | CSS, JS, font local, logo |
| `deploy/` | Script VPS nginx (có sẵn từ trước) |

**Trang có trong mockup:** trang chủ · danh sách dịch vụ · chi tiết M&A mẫu · giới thiệu · liên hệ (đồng ý ND 13/2023) · tin tức + bài mẫu · dashboard minh họa.

## Xem nhanh (không cần cài gì)

### 1) Mở offline (`file://`)

1. Giải nén `flf-mockup-offline.zip` (nếu dùng bản ZIP).
2. Mở file `vi/index.html` bằng trình duyệt.
3. Chuyển ngôn ngữ bằng nút **VI / EN** trên menu (giữ đúng trang tương ứng).

Font và CSS nằm local trong `assets/` — không phụ thuộc API ngoài.

### 2) Chạy máy local bằng HTTP

```bash
cd /đường/dẫn/tới/repo
python3 -m http.server 8080
```

Mở:

- http://127.0.0.1:8080/vi/index.html
- http://127.0.0.1:8080/en/index.html

### 3) Xem qua jsDelivr (sau khi code đã lên GitHub)

Thay `<commit-sha>` bằng SHA commit thật:

```text
https://cdn.jsdelivr.net/gh/lecuong6868/FLF@<commit-sha>/vi/index.html
https://cdn.jsdelivr.net/gh/lecuong6868/FLF@<commit-sha>/en/index.html
```

GitHub Pages (`lecuong6868.github.io/FLF`) hiện 404. Repo đã chọn nguồn **GitHub Actions**; workflow mẫu nằm ở `.github/workflows/pages.yml`. Cần bật Actions và chạy workflow một lần (hoặc merge vào `main`) nếu muốn dùng Pages.

## Logo & thông tin công ty

- Logo lấy từ file khách gửi: `assets/img/logo-text.png`, `assets/img/logo-shield.png`.
- Thông tin đã đối chiếu công khai (flf.vn): điện thoại `+84 96 444 7153`, email `ruby.huynh@flf.vn`, địa chỉ `33 Trần Quý Khoách, Quận 1, TP.HCM`.
- Mục chưa xác minh được ghi rõ **chưa xác minh** / **not verified** (không đưa vào quảng cáo).

## Responsive & accessibility

- Kiểm tra quanh **390px** (mobile) và **1440px** (desktop).
- Có skip-link, `:focus-visible`, `lang`, `alt` cho logo, tương phản chữ trên nền navy/crimson.

## Kiểm tra đã chạy (local)

Máy local `python3 -m http.server 8080`:

| Kiểm tra | Kết quả |
|----------|---------|
| `GET /vi/index.html`, `/en/index.html` và toàn bộ trang mockup | **200** |
| Asset CSS/JS/logo | **200** |
| Chuyển ngôn ngữ VI↔EN giữ đúng trang (home, dịch vụ, M&A, giới thiệu, liên hệ, tin, bài mẫu) | **200**, không 404 |
| Chuỗi placeholder lỗi (`lorem`, `TODO`, `FIXME`…) | Không có |

Link xem công khai sau khi hệ thống đẩy commit: dùng jsDelivr với SHA commit (xem mục 3 ở trên). Pages cần chạy workflow `.github/workflows/pages.yml` nếu muốn `lecuong6868.github.io/FLF`.

## Ghi chú sản phẩm

- Mockup **không** gửi form, **không** có CMS / AI / MXH thật.
- Nội dung dịch vụ diễn đạt thận trọng; hợp tác công ty luật chỉ nhắc ngắn trong phần giới thiệu.
- Giai đoạn sau (theo TASK): Payload CMS, SEO/redirect 301, MXH, chatbot AI.
