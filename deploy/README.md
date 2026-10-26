# Đưa FLF (www.flf.vn) lên VPS

Mọi code và dữ liệu của FLF nằm trong `~/FLF` trên VPS:

| Thư mục | Nội dung |
|---|---|
| `~/FLF/repo` | bản sao repo GitHub này |
| `~/FLF/releases/<thời điểm>` | các bản web đã giải nén (giữ 5 bản gần nhất) |
| `~/FLF/site` | trỏ tới bản đang chạy |
| `~/FLF/backups` | sao lưu cấu hình / bản trước |
| `~/FLF/setup.sh` | script cài, cập nhật, bật HTTPS |

Lệnh:
- Cài / cập nhật: `sudo bash ~/FLF/setup.sh`
- Bật HTTPS khi tên miền đã trỏ về VPS: `sudo bash ~/FLF/setup.sh ssl`
- Chỉ xem tình trạng: `sudo bash ~/FLF/setup.sh check`
- Quay lại bản trước: `ln -sfn ~/FLF/releases/<bản cũ> ~/FLF/site`

Script chỉ thêm một site nginx riêng (`/etc/nginx/sites-available/flf.vn`). Nó dừng nếu cổng web đang do phần mềm khác giữ hoặc tên miền đã nằm trong cấu hình khác.

`swap-2g.sh`: thêm 2 GB swap cho VPS (không làm gì nếu VPS đã có swap).
