# Khảo sát nội dung site cũ FLF

Ngày khảo sát: **2026-10-27**

Nguồn: React SPA tĩnh đang chạy tại [flf.vn](https://flf.vn/) (bundle `main.97fda272.js`) + CMS Hygraph — **không phải WordPress**. Zip `flf.vn_*.zip` trong repo là bản phát hành tĩnh.

## Số liệu tóm tắt

| Hạng mục | Số lượng |
| --- | ---: |
| Trang tĩnh (route gốc) | 7 (`/`, `about`, `services`, `contact`, `casestudy`, `blog`, `new`) |
| Trang chi tiết dịch vụ | 6 (`/services/1`–`6`) |
| Bài blog (Hygraph, tham chiếu) | ~10 (API có thể không còn public) |
| Tin tức / new (Hygraph) | ~2 |
| Case study (Hygraph) | ~3 |
| Redirect 301 đã lập | 16 (xem `data/legacy-redirects.json`) |

## Dịch vụ cũ → slug mới

1. `/services/1` → `/vi/services/thanh-lap-doanh-nghiep-fdi`
2. `/services/2` → `/vi/services/dang-ky-quyen-tac-gia`
3. `/services/3` → `/vi/services/giay-phep-lao-dong`
4. `/services/4` → `/vi/services/tu-van-tech-blockchain`
5. `/services/5` → `/vi/services/tu-van-ma`
6. `/services/6` → `/vi/services/giay-phep-kinh-doanh-dau-tu`

## Liên hệ trên website cũ

- Điện thoại: **+84 96 444 7153**
- Email: **ruby.huynh@flf.vn**
- Địa chỉ hiển thị: **33 Tran Quy Khoach, D1, HCMC** → **chưa khớp** cổng ĐKD (xem `docs/COMPANY_VERIFICATION.md`)

## Kết luận chuyển nội dung

- Không import được qua WordPress REST (`/wp-json` trả SPA HTML).
- Nội dung lĩnh vực / giới thiệu mẫu đã seed trong `npm run seed` (không bịa số liệu/giải thưởng).
- Bài blog/news động: cần biên tập lại trên Dashboard Payload (Hygraph có thể không còn truy cập được).
- Redirect 301: middleware + `next.config.ts` + collection `redirects` (seed từ `data/legacy-redirects.json`).
