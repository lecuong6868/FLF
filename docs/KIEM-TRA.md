# Biên bản kiểm tra

Ngày: **2026-10-29** (lượt xác minh PR #7 + kiểm thử lại header/menu)

Commit nền: **`c8364c5`** ([PR #7](https://github.com/lecuong6868/FLF/pull/7) / `aat/20261029-132653`). Các cập nhật docs/script lượt này nằm trên nhánh AAT hiện tại (chưa merge).

## Phạm vi

Preview tĩnh — header/menu desktop & mobile phương án B. **Không** CMS/AI/MXH. **Không** nghiệm thu trang chủ hoàn chỉnh.

## Đã xác minh lại (không mặc định kết quả cũ)

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| Trạng thái PR #7 | GitHub API | **open** · head `c8364c5` · title tiếp nối kiểm thử menu / preview |
| Workflow Preview Pages | Actions run 40829931244 | **build success** · **deploy failure** (Pages chưa bật) |
| CI Browser menu test | Actions run 40829936322 trên cùng SHA | **success** |
| GitHub Pages URL | `curl` `https://lecuong6868.github.io/FLF/` | **HTTP 404** |
| Kiểm tra tĩnh local | `npm run check` | **PASS** |
| Kiểm thử trình duyệt local | `FLF_TEST_PORT=4177 npm run test:menu` | **PASS 37/37** — `docs/KIEM-TRA-TRINH-DUYET.json` |
| Desktop 1440 | Menu, dropdown Chuyên mục, 5 `chu-de`, Escape, overflow, JS | **PASS** |
| Mobile 390 | Mở/đóng, backdrop, Escape, Tab, focus trap, accordion 5 chủ đề | **PASS** |
| Kiểm thử trên URL HTTPS đã deploy | `FLF_BASE_URL=… npm run test:menu` | **Chưa chạy** — không có URL 200 |

## Tiêu chí lượt này

- [x] Đọc bàn giao + xác minh PR/commit/workflow/quyền (không mặc định kết quả cũ)
- [x] Kiểm tra kết nối triển khai; không lặp thử token enable Pages
- [x] Kiểm thử lại menu desktop/mobile trên source PR #7 (local + xác nhận CI)
- [x] Cập nhật docs: URL/commit/kết quả/giới hạn (chỉ header/menu)
- [ ] URL HTTPS công khai không cần đăng nhập — **chặn quyền Pages**
- [ ] Kiểm thử menu trên bản đã triển khai — **phụ thuộc URL trên**

## Giới hạn còn lại

- **Chưa xuất bản** preview HTTPS bền; **không** gửi link chưa xác minh.
- Cấu hình deploy để review: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).
- Trang chủ đầy đủ / Next.js + Payload → ngoài phạm vi.
