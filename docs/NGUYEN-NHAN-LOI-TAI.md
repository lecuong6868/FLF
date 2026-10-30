# Nguyên nhân lỗi tải ZIP (PR #12 → #13 → lần này)

Kiểm tra bằng phiên **không đăng nhập** (curl / fetch, `Accept: */*`, follow redirect).

## Hiện tượng khách gặp

Sau PR #12 và #13, khách vẫn không mở được link dạng:

`https://cdn.jsdelivr.net/gh/lecuong6868/FLF@[đã ẩn].zip`

Tệp đính kèm `.aat/files/https_cdn.jsdelivr.net_gh_lecuong6868_FLF_đã.md` cũng chỉ còn URL cụt (HTTP 400 khi máy đọc thử).

## `[đã ẩn]` là gì? (đã đối chiếu, không suy đoán)

| Nguồn | Nội dung URL |
|-------|----------------|
| File trong repo PR #13 (`README.md`, `docs/BAN-GIAO-TAI.md`) | **Đủ** — có chuỗi commit hex đầy đủ trước `/FLF-preview.zip` |
| Body/tóm tắt PR #12, #13 khi hệ thống bàn giao / scrap | **Bị che** thành `[đã ẩn]` ngay giữa URL |
| Link khách nhận / tệp `.aat/files/…đã.md` | **URL cụt** — không tải được |

**Kết luận:** `[đã ẩn]` là **lớp che hiển thị / bàn giao** (chuỗi hex dài kiểu commit SHA / SHA-256), **không** phải CDN jsDelivr tự hỏng và **không** nằm trong URL gốc đã ghi trong repo. Khi bị che, URL gửi khách mất phần định vị commit → tải thất bại.

Vì vậy lần này **không đổi CDN thêm lần nữa** làm URL chính. Đổi sang **raw GitHub theo tên nhánh** (không chứa chuỗi hex) để đường dẫn sống sót qua khâu bàn giao.

## Các lỗi URL khác đã tái hiện (vẫn đúng)

### 1. Link dạng trang xem file (blob)

`https://github.com/lecuong6868/FLF/blob/…/FLF-preview.zip`

- HTTP **200**, `Content-Type: text/html` → trang GitHub, **không** phải ZIP.

### 2. Link `github.com/.../raw/...` không follow redirect

- HTTP **302**, body **0 byte** nếu client không follow.

### 3. URL có commit SHA trong chuỗi (PR #12 raw / PR #13 jsDelivr)

- Bản thân endpoint **tải được** khi URL còn đủ SHA.
- Khi hệ thống bàn giao che SHA → khách nhận URL hỏng (đúng hiện tượng lần này).

## Cách sửa lần này

**URL chính (GitHub trực tiếp, theo nhánh PR #11 — không hex):**

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-154651/FLF-preview.zip
```

- HTTP 200, 0 redirect, `application/zip`
- Đúng **2 436 515** byte, magic `PK\x03\x04`
- Không cần đăng nhập

**Dự phòng** (cùng byte / cùng SHA-256): raw nhánh PR #13; jsDelivr theo nhánh (không dùng làm URL chính).

## Quyền còn thiếu

`GH_TOKEN` / `GITHUB_TOKEN` trong phiên = **Bad credentials (401)** → **chưa tạo được GitHub Release** asset (URL dạng `/releases/download/...` sẽ còn sạch hơn). Cần token `repo`/`contents:write` nếu muốn Release.
