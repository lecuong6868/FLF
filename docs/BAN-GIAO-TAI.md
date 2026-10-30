# Bàn giao tải — FLF-preview.zip

Ngày xác minh: **2026-10-30** (sửa lỗi link tải PR #12 / việc jc1a8afbce472).

## Báo cáo thực tế PR #11 / #12

| Hạng mục | Thực tế |
|----------|---------|
| PR #11 | https://github.com/lecuong6868/FLF/pull/11 — **open** · nhánh `aat/20261030-154651` @ `15ed82c2bff89c9a3635dfd53568d2cdf83147f2` |
| PR #12 | https://github.com/lecuong6868/FLF/pull/12 — **open** · đã bàn giao URL `raw.githubusercontent.com` theo SHA trên; khách báo link lỗi |
| Gói | `FLF-preview.zip` phương án B · **2 436 515 byte** · không dựng lại website |

## Nguyên nhân lỗi tải (đã tái hiện, phiên không đăng nhập)

1. **`…/blob/…/FLF-preview.zip`** → HTTP 200 nhưng `Content-Type: text/html` (trang GitHub), **không phải file ZIP**.
2. **`github.com/…/raw/…` không follow redirect** → HTTP **302**, body **0 byte** → tải thất bại.
3. URL PR #12 dùng `raw.githubusercontent.com` (ZIP thật) nhưng kèm CSP `sandbox`; URL dự phòng dạng `github.com/…/raw/…` dễ gãy nếu client không follow 302.

**Cách sửa:** chuyển URL chính sang **jsDelivr CDN** trỏ đúng commit SHA chứa gói — HTTP 200 trực tiếp, `application/zip`, không đăng nhập, không hết hạn theo phiên, cache dài.

## Link tải ổn định (đã tải thử lại)

**Chính (gửi khách):**

```
https://cdn.jsdelivr.net/gh/lecuong6868/FLF@15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip
```

**Dự phòng (cùng SHA-256):**

```
https://raw.githubusercontent.com/lecuong6868/FLF/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip
```

## Bằng chứng tải HTTP (đúng URL sẽ gửi)

| Kiểm tra | Kết quả |
|----------|---------|
| HTTP status | **200** |
| Redirect | **0** |
| `Content-Type` | `application/zip` |
| Bytes tải | **2436515** |
| Magic header | `50 4B 03 04` (`PK\x03\x04`) |
| **SHA-256** | `5cf4cd68bace42e33465dc7a17d1c817b97e24c4be8117234326d72200be4036` |
| MD5 | `b9075516a277363aa2d82dde487d45d6` |
| Giải nén | OK — 27 entry; `FLF-preview/index.html`, `option-b/`, logo, font Noto |
| So với raw GitHub | Byte-identical |

## Kiểm thử sau giải nén (`file://`)

Nguồn: ZIP vừa tải từ **URL chính jsDelivr** → giải nén → `npm run verify:offline`.

**17/17 PASS**, gồm:

- Logo / CSS header / nav desktop  
- Dropdown Chuyên mục 5 chủ đề  
- Link Tin tức dùng `…/index.html`  
- Mobile 390: mở menu, backdrop, Escape đóng  
- Liên hệ: *«Minh họa giao diện — chưa có backend. Yêu cầu liên hệ chưa được gửi. Không có thông báo gửi thành công giả.»*  
- Không lỗi console  

Ảnh: `mockups/offline/B-*-file.png`, `FLF-preview/screenshots/`.

## Anh cần làm tiếp

1. Gửi khách **URL jsDelivr** ở trên (kèm SHA-256 để đối chiếu).  
2. Nhờ khách giải nén → mở `FLF-preview/index.html` để duyệt phương án B.  
3. Sau khi chốt UI: merge PR #11 (hoặc tương đương) vào `main`; tùy chọn tạo **GitHub Release** asset để có `Content-Disposition: attachment` (cần quyền write trên repo — phiên này không có token GitHub hợp lệ để tự tạo Release).  
4. Giai đoạn sau: CMS, MXH, AI — ngoài phạm vi gói offline.
