# Sơ đồ trang & flow (preview duyệt UI)

Phạm vi tài liệu duyệt UI — chưa triển khai CMS / AI / API MXH ở lượt này.

## Phân biệt ba mục nội dung

| Mục | Vai trò | Ví dụ trên preview |
|-----|---------|-------------------|
| **Tin tức** | Hoạt động / thông báo của FLF | `option-a/tin-tuc/`, `option-b/tin-tuc/` |
| **Quy định mới** | Cập nhật văn bản / chính sách + metadata hiệu lực | `…/quy-dinh-moi/` |
| **Chuyên mục** | Bài phân tích theo chủ đề (bộ lọc) | `…/chuyen-muc/` |

## Sơ đồ trang (đề xuất giai đoạn 1 + mục nội dung preview)

```text
Trang chủ
├── Giới thiệu (FLF vs đối tác pháp lý)
├── Lĩnh vực tư vấn
│   ├── Tư vấn doanh nghiệp & quản trị
│   ├── Đầu tư & mở rộng hoạt động
│   ├── Tuân thủ & giấy phép          ← đề xuất, chờ xác nhận
│   └── Hợp tác pháp lý chuyên sâu    ← đề xuất, chờ xác nhận
├── Đối tác pháp lý (danh sách sau khi khách xác nhận — mockup chưa ghi tên)
├── Tin tức                    ← hoạt động FLF
├── Quy định mới               ← văn bản / chính sách
│   └── Bài chi tiết (+ số hiệu, cơ quan, hiệu lực, nguồn, người duyệt)
├── Chuyên mục                 ← phân tích theo chủ đề
│   ├── Đầu tư
│   ├── Thuế
│   ├── Quản trị doanh nghiệp
│   ├── Quản trị rủi ro
│   ├── Giấy phép
│   ├── Lao động & nhân sự          ← đề xuất thêm
│   ├── Hợp đồng & giao dịch        ← đề xuất thêm
│   └── Tuân thủ & bảo vệ dữ liệu   ← đề xuất thêm
├── Liên hệ (+ đồng ý NĐ 13/2023)
└── Chính sách bảo mật
```

## Điều hướng trên mockup

Menu desktop/mobile: Trang chủ · Giới thiệu · Lĩnh vực · Đối tác pháp lý · **Tin tức** · **Quy định mới** · **Chuyên mục** · Liên hệ

## Flow khách truy cập (minh họa)

```text
Trang chủ → Lĩnh vực / Tin tức / Quy định mới / Chuyên mục
  → Chi tiết → Liên hệ → Xác nhận gửi
```

Form liên hệ **chưa** gửi được trên preview.

## Flow xuất bản web + MXH (minh họa — giai đoạn 2)

AI **không** được tự vượt bước duyệt. Đăng MXH lỗi **không** làm mất bài web đã xuất bản.

```text
1. Chọn nguồn chính thức / chủ đề
2. AI tạo bản nháp
3. Biên tập kiểm tra nguồn và nội dung
4. Duyệt (admin / biên tập)
5. [Nếu nội dung pháp lý] Luật sư đối tác duyệt  ← bắt buộc
6. Lên lịch (tuỳ chọn) hoặc xuất bản ngay
7. Xuất bản web
8. Tạo bản phù hợp từng kênh từ phiên bản ĐÃ DUYỆT
9. Nếu bản MXH đổi nội dung đáng kể → duyệt lại trước khi đăng
10. Đăng Facebook / LinkedIn (Zalo: chuẩn bị)
```

### Trạng thái kênh MXH (Dashboard — chưa có trên preview)

| Khả năng | Ghi chú |
|----------|---------|
| Trạng thái lỗi từng kênh | Hiển thị riêng FB / LinkedIn / Zalo |
| Thử lại có giới hạn | Không retry vô hạn |
| Chống đăng trùng | Idempotency / khóa lịch |
| Nhật ký | Ai duyệt, lúc nào, kênh nào |
| Tạm dừng lịch | Pause schedule toàn cục hoặc theo kênh |
| Lỗi MXH ≠ gỡ bài web | Bài web giữ nguyên |

## Flow nhân viên / admin (rút gọn)

```text
Đăng nhập + 2FA
  → Tạo nháp (thủ công hoặc AI)
  → Biên tập kiểm nguồn
  → Gửi duyệt
  → Admin duyệt / yêu cầu sửa
  → (Pháp lý) Luật sư đối tác duyệt
  → Lên lịch / Xuất bản web
  → (Giai đoạn 2) Biến thể MXH từ bản đã duyệt → đăng kênh
```

## Ghi chú

- Song ngữ EN chưa làm ở lượt thiết kế này.
- Redirect 301 từ URL cũ: giai đoạn phát triển sau khi chọn hướng UI.
- Trên preview: bộ lọc / tìm kiếm Chuyên mục và lọc trạng thái Quy định mới **chỉ minh họa**.
