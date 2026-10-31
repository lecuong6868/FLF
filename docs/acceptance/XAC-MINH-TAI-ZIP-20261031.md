# Xác minh tải ZIP công khai — 2026-10-31 (bàn giao)

**Mục tiêu việc này:** chỉ bàn giao / xác minh artifact PR #16; không thiết kế lại website.

## Bối cảnh

- PR [#16](https://github.com/lecuong6868/FLF/pull/16) báo hoàn thành trang chủ VI/EN + `FLF-preview.zip`, nhưng biên bản trước ghi **URL tải công khai chưa xác minh** (raw nhánh từng 404 vì báo cáo trước lúc chưa push).
- Việc này: kiểm tra file **thực tế trên nhánh PR**, tải thử **không đăng nhập**, giải nén và kiểm tra `file://` (cấu trúc + chuyển ngữ).

## Artifact trên GitHub (đã xác minh, không suy đoán)

Nhánh: `aat/20261031-112548` (head khớp PR #16).

| File trên nhánh | Có trên API contents? | Ghi chú |
|-----------------|----------------------|---------|
| `FLF-preview.zip` | Có — size API **4 588 525** | Gói bàn giao |
| `FLF-preview/` | Có (thư mục) | Source Preview |
| `docs/acceptance/` | Có | Biên bản |

## HTTP GET công khai (không header Authorization)

| URL theo tên nhánh (không dùng SHA) | HTTP | Bytes | SHA-256 khớp workspace? |
|-------------------------------------|------|-------|-------------------------|
| [raw…/aat/20261031-112548/FLF-preview.zip](https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip) | **200** | 4 588 525 | Có (`bf6a85d0…4a10`) |
| [jsDelivr @aat/20261031-112548/…](https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261031-112548/FLF-preview.zip) | **200** | 4 588 525 | Có (cùng hash) |

Đối chiếu ZIP cũ PR #11 (`aat/20261030-154651`): **2 436 515 bytes** — **không** dùng cho bàn giao lần này.

## Giải nén & kiểm tra nội dung

Sau khi tải raw → giải nén:

- `FLF-preview/index.html` — có
- `FLF-preview/vi/index.html` — có
- `FLF-preview/en/index.html` — có
- Asset cục bộ: `assets/styles.css`, `assets/home.js`, `public/brand/logo-color.png`, fonts — có
- Chuyển ngữ: VI có `href="../en/index.html"`; EN có `href="../vi/index.html"` → roundtrip VI→EN→VI trên `file://` khả thi
- Không dùng `fetch` / `localStorage` để hiển thị nội dung hay đổi ngôn ngữ trên trang chủ

`verify:home` mirror: **35/35 PASS**.

## Kết luận bàn giao

- Artifact PR #16 **đã lên GitHub** và **tải được công khai**.
- Gói đúng (~4,38 MB) đã đồng bộ vào nhánh workspace `aat/20261031-140556` để hệ thống push/PR bàn giao.
- Phạm vi vẫn chỉ là **trang chủ** VI/EN.
