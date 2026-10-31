# Bàn giao — Preview trang chủ VI/EN + URL tải ZIP

**Phạm vi:** chỉ trang chủ VI/EN và chuyển ngôn ngữ offline (PR #16). **Không** tuyên bố toàn bộ website đã song ngữ.

## Link tải ZIP công khai (đã GET thử, không đăng nhập)

| Mục | Giá trị |
|-----|---------|
| URL chính (theo **tên nhánh** đầy đủ) | [https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip](https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip) |
| URL dự phòng | [https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261031-112548/FLF-preview.zip](https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261031-112548/FLF-preview.zip) |
| HTTP | **200**, `Content-Type: application/zip` |
| Kích thước | **4 588 525 bytes** (~4,38 MB) |
| SHA-256 | `bf6a85d0f9e828e5e6963f3e253a880688e0f7ffcbc90a3f6b998a67ca6f4a10` |
| PR nguồn artifact | [#16](https://github.com/lecuong6868/FLF/pull/16) — nhánh `aat/20261031-112548` |

**Không dùng** ZIP cũ PR #11 (`aat/20261030-154651`, ~2 436 515 bytes).

Cùng gói đã đưa lên nhánh bàn giao hiện tại `aat/20261031-140556` (URL raw theo nhánh này dùng được sau khi hệ thống push):

[https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-140556/FLF-preview.zip](https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-140556/FLF-preview.zip)

## Kiểm tra thực tế sau khi tải (2026-10-31)

| Kiểm tra | Kết quả |
|----------|---------|
| Tải raw GitHub không Authorization | **PASS** (HTTP 200) |
| Tải jsDelivr không đăng nhập | **PASS** (HTTP 200, cùng SHA) |
| Giải nén có `FLF-preview/index.html` | **PASS** |
| Có `FLF-preview/vi/index.html` và `en/index.html` | **PASS** |
| Asset cục bộ (CSS/JS/logo/font) trong ZIP | **PASS** |
| VI→EN→VI bằng liên kết tương đối (`../en/index.html` ↔ `../vi/index.html`) | **PASS** |
| Không `fetch` / `localStorage` để đổi ngôn ngữ | **PASS** |
| `verify:home` (35/35) trên cây `FLF-preview/` | **PASS** |

Chi tiết: `docs/acceptance/XAC-MINH-TAI-ZIP-20261031.md`.

## Đường dẫn trang đã sửa (phạm vi trang chủ)

| Trang | Đường dẫn |
|-------|-----------|
| Điểm vào | `FLF-preview/index.html` |
| Trang chủ VI | `FLF-preview/vi/index.html` |
| Trang chủ EN | `FLF-preview/en/index.html` |
| CSS/JS | `FLF-preview/assets/styles.css`, `FLF-preview/assets/home.js` |

## Bằng chứng kiểm tra UI (từ PR #16)

- Biên bản: `docs/acceptance/NGHIEM-THU-TRANG-CHU-20261031.md`
- Ảnh 390/1440: `FLF-preview/screenshots/home-20261031/`

## Anh gửi khách

1. Link tải ZIP ở bảng trên (raw hoặc jsDelivr).
2. Hướng dẫn: giải nén → mở `FLF-preview/index.html` → thử **VI | EN**.
3. Nhắc rõ: **mới có trang chủ** song ngữ; các mục Tin tức / Quy định / Chuyên mục chưa có bản EN.
