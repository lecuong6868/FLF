# Renew web FLF (www.flf.vn)

Dự án làm mới website First Legal Force. Kiến trúc triển khai đã chốt: **Next.js + Payload CMS + PostgreSQL** (giai đoạn sau). Hiện tại repo bàn giao **Preview HTML offline** — **chỉ trang chủ** đã song ngữ VI/EN.

## Tải gói ZIP công khai (đã kiểm tra, không cần đăng nhập)

| | |
|--|--|
| **URL tải (nhánh PR #16)** | [https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip](https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip) |
| **URL dự phòng (jsDelivr)** | [https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261031-112548/FLF-preview.zip](https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261031-112548/FLF-preview.zip) |
| **Kích thước** | **4 588 525 bytes** (~4,38 MB) |
| **SHA-256** | `bf6a85d0f9e828e5e6963f3e253a880688e0f7ffcbc90a3f6b998a67ca6f4a10` |
| **PR** | [https://github.com/lecuong6868/FLF/pull/16](https://github.com/lecuong6868/FLF/pull/16) |

> Đây là gói trang chủ VI/EN (PR #16), **không** dùng ZIP cũ ~2,4 MB của PR #11.

Sau khi hệ thống push nhánh hiện tại `aat/20261031-140556`, cùng một file cũng có tại:

[https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-140556/FLF-preview.zip](https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-140556/FLF-preview.zip)

## Cách mở Preview (không cần cài đặt)

1. Tải và giải nén `FLF-preview.zip`, hoặc dùng thư mục `FLF-preview/` trong repo.
2. Mở `FLF-preview/index.html` bằng Chrome / Edge / Firefox.
3. Chọn **Tiếng Việt** hoặc **English**, hoặc bấm **VI | EN** trên header/footer.
4. Hoạt động qua `file://` (offline): asset cục bộ, đường dẫn tương đối — không cần API / mạng để đổi ngôn ngữ.

| File | Mô tả |
|------|--------|
| `FLF-preview/index.html` | Điểm vào |
| `FLF-preview/vi/index.html` | Trang chủ tiếng Việt |
| `FLF-preview/en/index.html` | Trang chủ tiếng Anh |
| `docs/acceptance/` | Biên bản nghiệm thu + xác minh tải ZIP |
| `docs/survey/` | Khảo sát (PR #15) |

## Phạm vi đã xong / chưa xong

- **Đã làm:** trang chủ VI + EN; chuyển VI→EN→VI offline; form liên hệ minh họa (không báo gửi thành công giả).
- **Chưa làm:** song ngữ Tin tức / Quy định / Chuyên mục / trang lĩnh vực riêng; CMS; AI; MXH.

## Chạy kiểm thử / đóng gói (tùy chọn, cần Node)

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"   # nếu dùng nvm
npm install
npm run verify:home      # kiểm tra cấu trúc trang chủ VI/EN
npm run pack:offline    # tạo lại FLF-preview.zip
npm run capture:home    # chụp 390px & 1440px (cần Playwright)
```

Máy chủ tĩnh tạm (không bắt buộc):

```bash
python3 -m http.server 4173
# rồi mở http://127.0.0.1:4173/FLF-preview/
```

## Thông tin công ty đã xác minh

Xem `docs/COMPANY_VERIFICATION.md` — giữ logo; MST `0314193708`; địa chỉ hiển thị công khai chờ khách xác nhận.

## Triển khai VPS (giai đoạn sau)

Xem `deploy/README.md`.
