# (4) Đề xuất sitemap & ma trận nội dung song ngữ

**Định hướng đã chốt:** FLF = tư vấn doanh nghiệp đa lĩnh vực; trọng tâm nhu cầu khách / phạm vi / đầu ra; hợp tác công ty luật chỉ 1–2 câu trong giới thiệu.  
**Không** đưa thành tích, số liệu, chứng nhận, khách hàng chưa xác minh.  
**Giữ logo.** Địa chỉ: chờ khách chốt (MST ≠ web cũ).

## A. Sitemap đề xuất (giai đoạn 1 + Preview offline)

Ký hiệu: `vi/` và `en/` là **cây HTML offline** (và sau này map sang URL triển khai `/vi/...`, `/en/...`).

```text
index.html                    → chuyển hướng / chọn ngôn ngữ (hoặc mặc định vi)
vi/
  index.html                  Trang chủ
  gioi-thieu.html             Giới thiệu (+ 1–2 câu đối tác pháp lý)
  linh-vuc/
    index.html                Danh sách lĩnh vực
    tu-van-doanh-nghiep.html
    dau-tu-mo-rong.html
    tuan-thu-giay-phep.html   ← đề xuất, cần khách xác nhận
  doi-tac-phap-ly.html        Danh sách chỉ hiện khi khách duyệt tên
  tin-tuc/
    index.html
    [slug].html
  quy-dinh-moi/
    index.html
    [slug].html               Metadata: số hiệu, cơ quan, hiệu lực, nguồn, người duyệt
  chuyen-muc/
    index.html                Bộ lọc chủ đề
    [slug].html
  lien-he.html                Form + đồng ý NĐ 13/2023
  chinh-sach-bao-mat.html
en/
  … (cùng cấu trúc, slug tiếng Anh ổn định)
```

Menu đề xuất: Trang chủ · Giới thiệu · Lĩnh vực · Đối tác pháp lý · Tin tức · Quy định mới · Chuyên mục · Liên hệ · **VI | EN** (giữ đúng trang tương ứng).

## B. Ma trận nội dung song ngữ — từng lĩnh vực

Trạng thái: **Đề xuất chờ xác minh** — chưa phải copy production.

### 1) Tư vấn doanh nghiệp & quản trị

| Ô | VI (hướng viết) | EN (hướng viết) | Cần xác minh |
|---|-----------------|-----------------|--------------|
| Khách mục tiêu | SME / DN đang mở rộng vận hành, cần làm rõ bài toán trước khi thuê đơn vị chuyên sâu | Same ICP in EN | ICP khách thật |
| Vấn đề | Chưa rõ cần tư vấn quản trị nào; quy trình phụ thuộc cá nhân; thiếu đầu mối điều phối | … | Case thật (không bịa) |
| Phạm vi FLF | Làm rõ nhu cầu, khung việc, điều phối đa lĩnh vực | … | Ranh giới với luật sư |
| Ngoài phạm vi | Hành nghề luật sư / đại diện tố tụng → đối tác pháp lý | … | Hợp đồng khung đối tác |
| Đầu ra | Bản tóm tắt nhu cầu, đề xuất lộ trình, đầu mối phụ trách | … | Mẫu deliverable |
| CTA | “Trao đổi về bài toán vận hành” → Liên hệ | “Discuss your operating challenge” | Copy cuối |
| VI/EN Preview | Thiếu trang riêng; chỉ section home VI | **Thiếu** | Sinh cặp HTML |

### 2) Đầu tư & mở rộng hoạt động

| Ô | VI | EN | Cần xác minh |
|---|----|----|--------------|
| Khách mục tiêu | DN / nhà đầu tư cân nhắc mở rộng, hợp tác, cấu trúc hoạt động tại VN | Foreign/local investors exploring expansion | Có nhận FDI không |
| Vấn đề | Chưa biết thứ tự việc tư vấn vs thủ tục pháp lý | … | |
| Phạm vi FLF | Định hướng bước, checklist nhu cầu, phối hợp đối tác khi cần | … | |
| Ngoài phạm vi | Soạn thảo/đăng ký thuộc hành nghề luật / đại diện ủy quyền pháp lý | … | |
| Đầu ra | Lộ trình bước, danh mục việc cần đối tác pháp lý | … | |
| CTA | “Đặt lịch trao đổi đầu tư / mở rộng” | “Book an expansion discussion” | |
| Xác minh | Dịch vụ `/services/*` cũ nghiêng giấy phép FDI — **không** copy nguyên xi thành “thế mạnh đã chứng minh” | | Khách chọn giữ/bỏ |

### 3) Tuân thủ & giấy phép *(đề xuất — chờ khách)*

| Ô | VI | EN | Cần xác minh |
|---|----|----|--------------|
| Khách mục tiêu | DN cần rà soát nghĩa vụ / giấy phép định hướng | … | Có làm thật không |
| Vấn đề | Không rõ giấy phép nào là bắt buộc; sợ làm sai trình tự | … | |
| Phạm vi FLF | Rà soát nhu cầu ở mức tư vấn định hướng, lập danh mục việc | … | |
| Ngoài phạm vi | Nộp hồ sơ / hành nghề thuộc đối tác pháp lý | … | |
| Đầu ra | Danh mục giấy phép/việc liên quan + phân công FLF vs đối tác | … | |
| CTA | “Yêu cầu rà soát định hướng” | “Request a scoping review” | |
| Cảnh báo | Không hứa “cam kết ra giấy” nếu chưa có quy trình đã xác minh | | Pháp lý |

### 4) Hợp tác pháp lý chuyên sâu *(trang / mục — không phải dịch vụ “FLF tự làm luật”)*

| Ô | Nội dung |
|---|----------|
| Thông điệp | 1–2 câu: khi việc thuộc hành nghề luật sư, FLF phối hợp đối tác |
| Danh sách tên | **Chỉ** sau khi khách duyệt công bố |
| CTA | Liên hệ để được nối đúng đầu mối |
| Cần xác minh | Tên, logo, văn bản cho phép nêu tên đối tác |

## C. Trang dùng chung (VI/EN)

| Trang | Yêu cầu nội dung | VI Preview | EN Preview |
|-------|------------------|------------|------------|
| Trang chủ | Brand hero, 1 headline, 1 câu phụ, CTA, neo lĩnh vực | Có (B) | Thiếu |
| Giới thiệu | Nhu cầu–phạm vi; 1–2 câu đối tác luật | Section | Thiếu |
| Tin tức / Quy định / Chuyên mục | Phân biệt 3 mục (đã có trên Preview B) | Có mẫu | Thiếu |
| Liên hệ | Form + checkbox NĐ 13/2023 | Minh họa | Thiếu |
| Chính sách bảo mật | Bắt buộc giai đoạn 1 | Thiếu | Thiếu |
| Metadata | `title`, `description`, `lang`, (hreflang khi deploy) | Một phần VI | Thiếu |

## D. Quy ước chuyển ngữ Preview (đặc tả sửa)

| Triển khai sau này | Preview `file://` |
|--------------------|-------------------|
| `/vi/linh-vuc/dau-tu-mo-rong` | `vi/linh-vuc/dau-tu-mo-rong.html` |
| `/en/services/investment-expansion` | `en/linh-vuc/dau-tu-mo-rong.html` (cùng slug hoặc bảng map cố định) |
| Switch ngôn ngữ | `<a href="../../en/.../cung-ten.html">EN</a>` tương đối — **không** `localStorage`, **không** API |

Kiểm tra tay: 390px & 1440px cho menu, footer, CTA, form, metadata trên **cả hai** ngôn ngữ.
