# Đầu việc tiếp theo — Dashboard quản trị thật

Khách đã yêu cầu bước tiếp theo là **Dashboard thật** theo kiến trúc đã chốt: **Next.js + Payload CMS + PostgreSQL**.

## Không làm / không chấp nhận như “xong quản trị”

- Dashboard giả bằng `localStorage` / JSON tĩnh trên trình duyệt rồi coi là hoàn thành quản trị.
- AI viết/đăng bài tự động, kết nối MXH, chatbot (giai đoạn 2–3 — sau CMS).

## Phạm vi Dashboard (giai đoạn 1)

| Nhóm | Việc cụ thể |
|------|-------------|
| Nội dung | Quản lý trang, dịch vụ/lĩnh vực, bài viết, **quy định**, **chuyên mục**, media |
| Cấu trúc site | Menu / footer, thông tin công ty (MST đã có; địa chỉ chờ khách chốt), SEO metadata VI/EN |
| Quy trình | Nhân viên soạn bài → admin duyệt / xuất bản; lịch sử sửa đổi |
| Bảo mật | Đăng nhập 2 lớp (2FA); phân quyền nhân viên / admin |
| Xuất bản web | API/CMS nuôi site công khai VI/EN (thay Preview tĩnh dần) |
| Quy định | Chỉ xuất bản khi có số hiệu, cơ quan, ngày, trạng thái, nguồn chính thức đã đối chiếu — không cho AI tự “khẳng định hiệu lực” |
| Form liên hệ | Backend thật + đồng ý NĐ 13/2023; chính sách bảo mật |

## Việc chuẩn bị trước khi code CMS

1. Khách xác nhận **địa chỉ hiển thị công khai** và số điện thoại footer.  
2. Khách đồng ý VPS / hạ tầng (PostgreSQL + Node) và cấp DNS khi chuyển khỏi Preview.  
3. Cấp logo gốc (đã có PNG trong `.aat/files/` / `public/brand/`).  
4. Danh sách đối tác pháp lý được phép công bố (nếu có).  
5. Merge Preview hiện tại vào `main` (Pages) chỉ khi cần xem HTTPS — tách biệt với khởi tạo app Next/Payload.

## Gợi ý khởi tạo kỹ thuật (lượt sau)

- Repo/app: Next.js (App Router) + Payload 3 + PostgreSQL.  
- Collections tối thiểu: `users`, `pages`, `posts`, `regulations`, `topics`, `media`, `site-settings`.  
- Workflow: `draft` → `in_review` → `published`; regulations mặc định không public nếu thiếu nguồn chính thức.  
- i18n: locale `vi` / `en` trong CMS, map URL `/vi/...` · `/en/...`.  
- Auth: Payload auth + 2FA (TOTP hoặc email OTP) cho admin.

## Tiêu chí “xong Dashboard” (để nghiệm thu sau)

- Đăng nhập 2 lớp hoạt động trên môi trường staging.  
- Nhân viên tạo bài chuyên mục / quy định nháp; admin duyệt mới thấy trên site.  
- Lịch sử sửa đổi xem được theo bản ghi.  
- Không còn phụ thuộc `FLF-preview` tĩnh cho các mục đã nối CMS.
