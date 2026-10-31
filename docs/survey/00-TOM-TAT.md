# Tóm tắt khảo sát Preview FLF (2026-10-31)

**Phạm vi lượt này:** khảo sát + lập đặc tả sửa Preview offline — **chưa sửa giao diện, chưa nghiệm thu, chưa triển khai production.**

## Nhánh / PR chứa Preview mới nhất

| Hạng mục | Giá trị |
|----------|---------|
| **Preview HTML đóng gói** | Nhánh `aat/20261030-154651` — **PR #11** (`FLF-preview/`, `FLF-preview.zip`) |
| Nhánh AAT mới nhất (tính tới lúc khảo sát) | `aat/20261030-200152` — **PR #14** (chỉ sửa URL tải ZIP / bàn giao, không đổi nội dung Preview) |
| PR #10 | `aat/20261030-114200` — thử Pages/HTTPS; source option-a/b chưa đóng gói offline |
| PR #12–#13 | Bàn giao / sửa link tải ZIP từ PR #11 |
| **`main`** | Chỉ `deploy/` + `flf.vn_*.zip` — **không** chứa Preview mới |

**Kết luận:** Không lấy `main` làm nguồn Preview. Bản xem thử offline mới nhất = **PR #11**; PR #14 là bản bàn giao tải ZIP mới nhất.

## Năm đầu ra (trong `docs/survey/`)

1. `01-KIEM-KE-TRANG.md` — kiểm kê trang (site cũ + Preview) và mức VI/EN  
2. `02-LOI-CHUYEN-NGU.md` — bằng chứng + nguyên nhân lỗi chuyển ngữ `file://`  
3. `03-KHAO-SAT-DOI-THU.md` — 3 website tư vấn tương đương  
4. `04-SITEMAP-MA-TRAN.md` — sitemap đề xuất + ma trận nội dung song ngữ  
5. `05-VIEC-TIEP-THEO.md` — việc tiếp theo (~25 phút/việc)

Bằng chứng kỹ thuật: `evidence/`.

## Phân biệt URL triển khai vs HTML offline

| | Website triển khai (giai đoạn 1) | Preview offline (`file://`) |
|--|----------------------------------|-----------------------------|
| Ngôn ngữ | Đường dẫn `/vi/...` và `/en/...` | Cây thư mục tương đối `vi/...` và `en/...` (HTML dựng sẵn) |
| Tài nguyên | CDN/CMS được phép (sau này) | Chỉ local, liên kết tương đối |
| Chuyển ngữ | Giữ đúng trang tương ứng | `../en/cung-trang.html` ↔ `../vi/...` — **không** phụ thuộc API |

## Mục chưa truy cập / chưa kiểm chứng

- Facebook Page `firstlegalforce`: chỉ thấy màn đăng nhập (chưa đọc được nội dung Page).  
- LinkedIn Company Page: HTTP 403 khi đọc tự động.  
- CDN jsDelivr link trong `.aat/files/`: 400 Bad Request.  
- Một số site đối thủ (Advisewise, Viettonkin, WellRosetta lúc fetch): 500/503 — WellRosetta dùng nội dung từ chỉ mục tìm kiếm, ghi rõ trong `03-…`.  
- Số liệu “40+ / 50+ / 25+” trên flf.vn **chưa** đối chiếu hồ sơ — **không** đưa vào sitemap/ma trận như thành tích đã xác minh.  
- Địa chỉ hiển thị: MST ≠ địa chỉ trên web cũ — xem `COMPANY_VERIFICATION` kế thừa; **không** tự thay địa chỉ.
