# Nguyên nhân lỗi tải ZIP (PR #12)

Kiểm tra bằng phiên **không đăng nhập** (curl + Accept giống trình duyệt).

## Hiện tượng khách gặp

Link ZIP bàn giao từ PR #12 không dùng được (mở ra không phải file ZIP tải được, hoặc tải rỗng / trang đăng nhập / HTML).

## Tái hiện

### 1. Link dạng trang xem file (blob)

```
https://github.com/lecuong6868/FLF/blob/<sha>/FLF-preview.zip
```

- HTTP **200**
- `Content-Type: text/html`
- Nội dung: HTML giao diện GitHub
- **Không** phải ZIP

### 2. Link `github.com/.../raw/...` không follow redirect

```
https://github.com/lecuong6868/FLF/raw/<sha>/FLF-preview.zip
```

- HTTP **302** → `raw.githubusercontent.com/...`
- Nếu client **không** follow redirect: body **0 byte** → tải thất bại

### 3. `raw.githubusercontent.com` (URL chính PR #12)

- Trả ZIP hợp lệ khi follow đúng
- Có `Content-Security-Policy: … sandbox`
- Không có `Content-Disposition: attachment` → một số trình duyệt/proxy xử lý tệp nhị phân kém hơn CDN

## Cách sửa đã áp dụng

Đổi URL chính sang jsDelivr (CDN công khai, không đăng nhập, không hết hạn phiên):

```
https://cdn.jsdelivr.net/gh/lecuong6868/FLF@15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip
```

- HTTP 200 trực tiếp, 0 redirect  
- `application/zip`, đúng 2 436 515 byte  
- SHA-256: `5cf4cd68bace42e33465dc7a17d1c817b97e24c4be8117234326d72200be4036`

## Quyền còn thiếu (tuỳ chọn cải thiện UX)

Tạo **GitHub Release** gắn asset `FLF-preview.zip` sẽ có `Content-Disposition: attachment` (nút tải rõ ràng hơn). Phiên làm việc này **không có** token GitHub hợp lệ (`GH_TOKEN` rỗng / Bad credentials) nên không tự tạo Release được.
