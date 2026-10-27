# Sơ đồ trang ngắn (đề xuất giai đoạn 1)

Phạm vi tài liệu duyệt UI — chưa triển khai CMS ở lượt này.

```text
Trang chủ
├── Giới thiệu (FLF vs đối tác pháp lý)
├── Lĩnh vực tư vấn
│   ├── Tư vấn doanh nghiệp & quản trị
│   ├── Đầu tư & mở rộng hoạt động
│   ├── Tuân thủ & giấy phép          ← đề xuất, chờ xác nhận
│   └── Hợp tác pháp lý chuyên sâu    ← đề xuất, chờ xác nhận
├── Đối tác pháp lý (danh sách sau khi khách xác nhận — mockup chưa ghi tên)
├── Tin tức / bài viết
├── Liên hệ (+ đồng ý NĐ 13/2023)
└── Chính sách bảo mật
```

## Điều hướng đề xuất trên mockup trang chủ

1. Menu: Trang chủ · Giới thiệu · Lĩnh vực · Đối tác pháp lý · Liên hệ  
2. Hero: thông điệp thương hiệu + CTA liên hệ / xem lĩnh vực  
3. Phân định phạm vi FLF vs đối tác pháp lý  
4. Nhóm lĩnh vực đề xuất  
5. Quy trình tiếp nhận yêu cầu (4 bước)  
6. Cách phối hợp đối tác pháp lý  
7. CTA liên hệ + footer (Facebook / LinkedIn)

## Flow khách truy cập (minh họa)

```text
Trang chủ → Lĩnh vực → Chi tiết dịch vụ → Liên hệ → Xác nhận gửi
```

Trên preview hiện tại: chỉ có mockup trang chủ (A/B) và mô tả flow; form **chưa** gửi được.

## Flow nhân viên / admin (minh họa)

```text
Đăng nhập + 2FA
  → Tạo bản nháp
  → Gửi duyệt
  → Admin duyệt / yêu cầu sửa
  → (Nếu nội dung pháp lý) Luật sư đối tác duyệt
  → Xuất bản
```

Dashboard và 2FA **chưa** hoạt động trên preview — chỉ sơ đồ để duyệt quy trình.

## Ghi chú

- Song ngữ EN chưa làm ở lượt thiết kế này.  
- Redirect 301 từ URL cũ và Dashboard nằm ở giai đoạn phát triển sau khi chọn hướng UI.  
- AI tạo nội dung / đăng MXH: giai đoạn 2 — mọi bài vẫn qua bước duyệt (pháp lý qua luật sư đối tác).
