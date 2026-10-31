# Renew web FLF — khảo sát & đặc tả Preview

Repo này phục vụ dự án làm mới website **First Legal Force (flf.vn)**.  
Lượt hiện tại (**2026-10-31**): **khảo sát + lập đặc tả** sửa Preview offline (VI/EN) — **chưa** dựng lại toàn bộ website, **chưa** sửa/nghiệm thu Preview song ngữ.

Kiến trúc đích vẫn là **Next.js + Payload CMS + PostgreSQL** (giai đoạn 1 sau khi chốt Preview).

## Cài đặt / xem tài liệu

Không cần cài Node hay database để đọc kết quả khảo sát.

```bash
# Clone hoặc mở thư mục repo
cd renew-web-flf

# (Tuỳ chọn) chạy script tái hiện lỗi chuyển ngữ trên ZIP site cũ
python3 scripts/reproduce-lang-bug.py
```

Yêu cầu script: **Python 3.10+** (chỉ dùng thư viện chuẩn).

## Cấu trúc quan trọng

```text
README.md
docs/survey/
  00-TOM-TAT.md              ← bắt đầu đọc ở đây
  01-KIEM-KE-TRANG.md        (1) Kiểm kê trang & VI/EN
  02-LOI-CHUYEN-NGU.md       (2) Lỗi chuyển ngữ file://
  03-KHAO-SAT-DOI-THU.md     (3) Ba website đối thủ
  04-SITEMAP-MA-TRAN.md      (4) Sitemap + ma trận nội dung
  05-VIEC-TIEP-THEO.md       (5) Việc ~25 phút tiếp theo
  evidence/                  Bằng chứng (JSON, snippet JS, danh sách trang)
scripts/reproduce-lang-bug.py
deploy/                      Script VPS nginx (giữ nguyên — không đổi hosting trong lượt này)
flf.vn_*.zip                 Bản build site cũ (tham chiếu)
.aat/                        Task & tệp anh gửi (logo, screenshot Pages…)
```

## Preview mới nhất nằm ở đâu?

- **Không** lấy `main` (chỉ có `deploy/` + ZIP cũ).  
- Bản HTML offline: nhánh / **PR #11** (`aat/20261030-154651`, thư mục `FLF-preview/`).  
- PR #12–#14 chỉ liên quan **link tải ZIP**, không đổi nội dung Preview.

Cách xem Preview (khi đã có gói từ PR #11): giải nén `FLF-preview.zip` → mở `index.html` bằng trình duyệt (`file://`). Hiện Preview **chỉ tiếng Việt**.

## Tiêu chí bản Preview sắp sửa (chưa làm trong lượt này)

- HTML **VI và EN dựng sẵn**, tài nguyên **cục bộ**, liên kết **tương đối**  
- Chuyển ngôn ngữ **giữ đúng trang**, chạy **không mạng**  
- Kiểm tra menu / footer / CTA / form / metadata ở **390px** và **1440px**  
- Phân biệt URL triển khai `/vi` `/en` với đường dẫn HTML tương đối cho `file://`

## Việc anh cần làm tiếp

Xem chi tiết `docs/survey/05-VIEC-TIEP-THEO.md`. Tóm tắt:

1. Chốt địa chỉ / SĐT hiển thị (MST ≠ địa chỉ trên web cũ).  
2. Chọn hướng UI A / B / lai.  
3. Xác nhận danh sách lĩnh vực và đối tác pháp lý được nêu tên.  
4. Cấp quyền DNS / logo gốc / admin MXH khi sang giai đoạn triển khai & giai đoạn 2.

## Không nằm trong lượt này

- Git commit/push do agent (hệ thống AAT xử lý).  
- Đổi hosting / production.  
- Sửa lại link ZIP cũ.  
- AI đăng bài / chatbot.
