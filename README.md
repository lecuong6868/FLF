# Renew web FLF (www.flf.vn)

Dự án làm mới website First Legal Force. Kiến trúc sản phẩm chính đã chốt: **Next.js + Payload CMS + PostgreSQL** (giai đoạn sau). Hiện tại repo bàn giao **Preview HTML offline** — đã có **trang chủ** và **Giới thiệu / About** song ngữ VI/EN.

## Cách mở Preview (không cần cài đặt)

1. Dùng thư mục `FLF-preview/` trong repo, hoặc giải nén `FLF-preview.zip`.
2. Mở `FLF-preview/index.html` bằng Chrome / Edge / Firefox.
3. Chọn **Tiếng Việt** hoặc **English**, hoặc bấm **VI | EN** trên header/footer.
4. Hoạt động qua `file://` (offline): asset cục bộ, đường dẫn tương đối — không cần API / mạng để đổi ngôn ngữ.

| File | Mô tả |
|------|--------|
| `FLF-preview/index.html` | Điểm vào |
| `FLF-preview/vi/index.html` | Trang chủ tiếng Việt |
| `FLF-preview/en/index.html` | Trang chủ tiếng Anh |
| `FLF-preview/vi/gioi-thieu/index.html` | Giới thiệu (VI) |
| `FLF-preview/en/about/index.html` | About (EN) |
| `docs/acceptance/` | Biên bản nghiệm thu |
| `docs/survey/` | Khảo sát (PR #15) |

## Cài & chạy kiểm thử (tùy chọn, cần Node)

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"   # nếu dùng nvm
npm install
npm run verify           # trang chủ + Giới thiệu VI/EN
npm run pack:offline     # tạo lại FLF-preview.zip
npm run capture:home     # chụp trang chủ 390/1440 (cần Playwright)
npm run capture:about    # chụp Giới thiệu 390/1440 (cần Playwright)
```

Máy chủ tĩnh tạm (không bắt buộc):

```bash
python3 -m http.server 4173
# rồi mở http://127.0.0.1:4173/FLF-preview/
```

## Phạm vi đã xong / chưa xong

- **Đã làm:** trang chủ VI + EN; trang Giới thiệu / About VI + EN; chuyển VI→EN→VI offline (giữ đúng trang); form liên hệ minh họa trên trang chủ (không báo gửi thành công giả).
- **Chưa làm:** song ngữ Tin tức / Quy định / Chuyên mục / trang lĩnh vực riêng; CMS; AI; MXH. **Chưa** tuyên bố toàn site song ngữ hay sẵn sàng production.

## URL tải ZIP công khai

Sau khi hệ thống push nhánh hiện tại, dùng URL theo **tên nhánh** (không dùng ZIP cũ PR #11 ~2,4 MB):

- Raw: `https://raw.githubusercontent.com/lecuong6868/FLF/<tên-nhánh>/FLF-preview.zip`
- jsDelivr: `https://cdn.jsdelivr.net/gh/lecuong6868/FLF@<tên-nhánh>/FLF-preview.zip`

Gói workspace hiện tại (trang chủ + Giới thiệu): xem `docs/acceptance/ZIP-INFO-GIOI-THIEU.json` và `BAN-GIAO-GIOI-THIEU.md` — **4 599 098 bytes**, SHA-256 `84b4d8b7a5d61902432d1ac7cff258cb266a669d4aa8e7710f825ddf0ad8424f`. Gói chỉ trang chủ đã xác minh trước: PR #16 / nhánh `aat/20261031-112548`.

## Thông tin công ty đã xác minh

Xem `docs/COMPANY_VERIFICATION.md` — giữ logo; MST `0314193708`; địa chỉ hiển thị công khai chờ khách xác nhận.

## Triển khai VPS (giai đoạn sau)

Xem `deploy/README.md`.
