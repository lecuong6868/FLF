# Báo cáo chuyển nội dung FLF (giai đoạn 1)

Xem chi tiết khảo sát: [`docs/migration/SURVEY.md`](./migration/SURVEY.md).

## Tóm tắt

| Hạng mục | Kết quả |
|----------|---------|
| Công nghệ site cũ | React SPA + Hygraph (không phải WordPress) |
| Trang tĩnh khảo sát | 7 route gốc + 6 trang dịch vụ |
| Bài động chuyển được tự động | 0 (Hygraph không đảm bảo public; không bịa nội dung) |
| Redirect 301 đã lập | 16 path trong `data/legacy-redirects.json` |
| Nội dung mẫu đã seed | 7 lĩnh vực tư vấn (VI/EN) + globals công ty/nav |

## Việc còn lại

- Biên tập lại bài tin/blog trên Dashboard.
- Khách xác nhận địa chỉ/SĐT hiển thị công khai.
- Sau DNS: bật HTTPS (`deploy/`), kiểm tra Search Console / sitemap.
