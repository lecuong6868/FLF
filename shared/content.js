/** Nội dung tiếng Việt mẫu dùng chung cho cả hai phương án mockup (đề xuất duyệt). */
window.FLF_CONTENT = {
  brand: "First Legal Force",
  brandShort: "FLF",
  tagline: "FLF — Đồng hành cùng doanh nghiệp trong các vấn đề tư vấn đa lĩnh vực",
  demoNote:
    "Nội dung minh họa trên preview — không phải văn bản pháp lý đã ban hành, không thay thế tư vấn chuyên môn.",
  nav: [
    { label: "Trang chủ", href: "#top" },
    { label: "Giới thiệu", href: "#about" },
    { label: "Lĩnh vực", href: "#services" },
    { label: "Đối tác pháp lý", href: "#partners" },
    { label: "Tin tức", href: "tin-tuc/" },
    { label: "Quy định mới", href: "quy-dinh-moi/" },
    {
      label: "Chuyên mục",
      href: "chuyen-muc/",
      children: [
        { label: "Đầu tư", href: "chuyen-muc/?chu-de=dau-tu" },
        { label: "Thuế", href: "chuyen-muc/?chu-de=thue" },
        { label: "Quản trị doanh nghiệp", href: "chuyen-muc/?chu-de=quan-tri-dn" },
        { label: "Quản trị rủi ro", href: "chuyen-muc/?chu-de=rui-ro" },
        { label: "Giấy phép", href: "chuyen-muc/?chu-de=giay-phep" },
      ],
    },
    { label: "Liên hệ", href: "#contact" },
  ],
  sectionMeta: {
    news: {
      title: "Tin tức",
      lead: "Hoạt động, thông báo và cập nhật từ FLF. Khác với Quy định mới (văn bản/chính sách) và Chuyên mục (bài phân tích theo chủ đề).",
      empty: "Chưa có tin phù hợp bộ lọc minh họa.",
    },
    regulations: {
      title: "Quy định mới",
      lead: "Cập nhật văn bản / chính sách liên quan doanh nghiệp — có metadata số hiệu, cơ quan, hiệu lực và nguồn chính thức. Nội dung dưới đây mang nhãn minh họa.",
      empty: "Không có quy định khớp bộ lọc minh họa.",
    },
    topics: {
      title: "Chuyên mục",
      lead: "Bài phân tích theo chủ đề. Bộ lọc và ô tìm kiếm bên dưới chỉ là minh họa giao diện (chưa nối CMS).",
      empty: "Không có bài trong chủ đề đã chọn (trạng thái rỗng — minh họa).",
    },
  },
  topicFilters: [
    { id: "all", label: "Tất cả" },
    { id: "dau-tu", label: "Đầu tư" },
    { id: "thue", label: "Thuế" },
    { id: "quan-tri-dn", label: "Quản trị doanh nghiệp" },
    { id: "rui-ro", label: "Quản trị rủi ro" },
    { id: "giay-phep", label: "Giấy phép" },
    { id: "lao-dong", label: "Lao động & nhân sự" },
    { id: "hop-dong", label: "Hợp đồng & giao dịch" },
    { id: "tuan-thu", label: "Tuân thủ & bảo vệ dữ liệu" },
  ],
  news: [
    {
      slug: "bai-mau",
      title: "FLF tổ chức buổi trao đổi nội bộ về quy trình tiếp nhận yêu cầu tư vấn",
      date: "2026-10-20",
      excerpt:
        "Tin hoạt động nội bộ (minh họa): làm rõ bước tiếp nhận, phân định phạm vi FLF và phần cần đối tác hành nghề luật sư.",
      body: [
        "Đây là bài Tin tức mẫu trên preview — phản ánh hoạt động / thông báo của FLF, không phải cập nhật văn bản pháp lý.",
        "Khi triển khai thật, nhân viên soạn bài trên Dashboard, gửi duyệt; nội dung pháp lý (nếu có) cần luật sư đối tác xác nhận trước khi xuất bản.",
        "Nhãn «Minh họa» trên trang này nhắc khách rằng ngày tháng và sự kiện mang tính trình diễn giao diện.",
      ],
    },
    {
      slug: "thong-bao-preview",
      title: "Thông báo: bản thiết kế website đang chờ duyệt",
      date: "2026-10-15",
      excerpt:
        "FLF đang hoàn thiện hướng UI/UX mới. Preview tĩnh không thay thế website chính thức flf.vn.",
      body: [
        "Bài minh họa thứ hai trong danh sách Tin tức để kiểm tra bố cục thẻ bài và liên kết chi tiết.",
        "Không có đăng nhập, CMS hay lịch đăng MXH trên bản preview này.",
      ],
    },
  ],
  regulations: [
    {
      slug: "bai-mau",
      title: "Mẫu hiển thị quy định — trạng thái đang có hiệu lực (minh họa)",
      status: "effective",
      statusLabel: "Đang có hiệu lực",
      docNumber: "[Minh họa] Số hiệu — chờ cập nhật từ nguồn chính thức",
      issuer: "[Minh họa] Cơ quan ban hành — không ghi tên văn bản thật",
      issuedDate: "[Minh họa] Ngày ban hành — chưa xác minh",
      effectiveDate: "[Minh họa] Ngày hiệu lực — chưa xác minh",
      officialSource: "Nguồn chính thức: sẽ gắn link cổng công báo / cơ quan ban hành sau khi biên tập xác nhận",
      updatedAt: "[Minh họa] Ngày cập nhật trên web",
      approvedBy: "[Minh họa] Người duyệt nội dung trên Dashboard",
      excerpt:
        "Bài Quy định mới mẫu để duyệt bố cục metadata. Không tự bịa số hiệu, ngày hiệu lực hay nội dung pháp lý có thật.",
      body: [
        "Phần nội dung chỉ mô tả cách trang sẽ trình bày thông tin sau khi biên tập lấy từ nguồn chính thức và hoàn tất quy trình duyệt.",
        "AI có thể tạo bản nháp, nhưng không được bỏ qua bước biên tập kiểm tra nguồn và bước duyệt (pháp lý: luật sư đối tác).",
        "Khách nên đối chiếu mọi số liệu pháp lý với nguồn chính thức — không dùng dữ liệu trên preview để quyết định kinh doanh.",
      ],
    },
    {
      slug: "du-thao",
      title: "Mẫu hiển thị — dự thảo / chưa ban hành (minh họa)",
      status: "draft",
      statusLabel: "Dự thảo",
      docNumber: "[Minh họa] Mã dự thảo — không phải văn bản đã ban hành",
      issuer: "[Minh họa] Cơ quan soạn thảo (chờ xác nhận)",
      issuedDate: "—",
      effectiveDate: "Chưa có hiệu lực",
      officialSource: "Chưa gắn nguồn chính thức — bài ở trạng thái dự thảo trên Dashboard",
      updatedAt: "[Minh họa] Ngày cập nhật nháp",
      approvedBy: "Chưa duyệt xuất bản",
      excerpt: "Minh họa nhãn trạng thái «Dự thảo» trên danh sách và trang chi tiết.",
      body: [
        "Trạng thái dự thảo giúp phân biệt rõ với văn bản đang có hiệu lực hoặc chưa tới ngày hiệu lực.",
        "Trên production, bài dự thảo mặc định không công khai trừ khi admin cấu hình khác.",
      ],
    },
    {
      slug: "chua-hieu-luc",
      title: "Mẫu hiển thị — đã ban hành, chưa tới ngày hiệu lực (minh họa)",
      status: "pending",
      statusLabel: "Chưa có hiệu lực",
      docNumber: "[Minh họa] Số hiệu — chờ xác minh",
      issuer: "[Minh họa] Cơ quan ban hành",
      issuedDate: "[Minh họa] Đã ban hành",
      effectiveDate: "[Minh họa] Ngày hiệu lực trong tương lai — chưa xác minh",
      officialSource: "Nguồn chính thức sẽ được gắn sau khi biên tập đối chiếu",
      updatedAt: "[Minh họa] Ngày cập nhật",
      approvedBy: "[Minh họa] Đã duyệt web — chờ ngày hiệu lực",
      excerpt: "Minh họa nhãn «Chưa có hiệu lực» để phân biệt với đang áp dụng.",
      body: [
        "Metadata ngày hiệu lực giúp doanh nghiệp biết văn bản đã ban hành nhưng chưa áp dụng.",
        "Mọi giá trị ngày trên preview đều mang nhãn minh họa — không dùng làm căn cứ pháp lý.",
      ],
    },
  ],
  topics: [
    {
      slug: "bai-mau",
      title: "Góc nhìn minh họa: làm rõ nhu cầu trước khi mở rộng đầu tư",
      topic: "dau-tu",
      topicLabel: "Đầu tư",
      date: "2026-10-18",
      excerpt:
        "Bài Chuyên mục mẫu (phân tích theo chủ đề). Không phải Tin tức hoạt động FLF và không thay thế cập nhật quy định.",
      body: [
        "Chuyên mục tập trung phân tích / góc nhìn theo chủ đề đã chọn trên bộ lọc.",
        "Nội dung pháp lý chi tiết (nếu có) vẫn phải qua biên tập và luật sư đối tác trước khi xuất bản.",
        "Ô tìm kiếm và bộ lọc trên trang danh sách chỉ minh họa UX — chưa truy vấn database.",
      ],
    },
    {
      slug: "thue-minh-hoa",
      title: "Góc nhìn minh họa: checklist chuẩn bị hồ sơ thuế định kỳ",
      topic: "thue",
      topicLabel: "Thuế",
      date: "2026-10-12",
      excerpt: "Bài mẫu chủ đề Thuế để kiểm tra bộ lọc chuyên mục.",
      body: [
        "Đây là nội dung minh họa giọng văn chuyên mục — không phải hướng dẫn thuế có hiệu lực pháp lý.",
        "Khi nối CMS, mỗi bài gắn một hoặc nhiều chủ đề trong danh sách đã chốt với khách.",
      ],
    },
    {
      slug: "tuan-thu-minh-hoa",
      title: "Góc nhìn minh họa: bảo vệ dữ liệu cá nhân trong form liên hệ",
      topic: "tuan-thu",
      topicLabel: "Tuân thủ & bảo vệ dữ liệu",
      date: "2026-10-08",
      excerpt: "Bài mẫu chủ đề Tuân thủ & bảo vệ dữ liệu (NĐ 13/2023 — nhắc nhở quy trình, không phải tư vấn cá thể).",
      body: [
        "Form liên hệ production sẽ có ô đồng ý xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.",
        "Bài này chỉ minh họa chuyên mục và liên kết quay lại danh sách có bộ lọc.",
      ],
    },
  ],
  hero: {
    eyebrow: "Tư vấn đa lĩnh vực · Hợp tác đối tác hành nghề luật sư",
    headline: "Phân định rõ phạm vi tư vấn FLF và phần do đối tác hành nghề luật sư thực hiện",
    sub: "First Legal Force (FLF) hỗ trợ doanh nghiệp làm rõ nhu cầu, lập phương án tư vấn và phối hợp với đối tác hành nghề luật sư khi vấn đề thuộc lĩnh vực pháp lý đặc thù. Nội dung trên trang mang tính giới thiệu — không thay thế tư vấn cá thể hóa.",
    ctaPrimary: "Liên hệ tư vấn",
    ctaSecondary: "Xem lĩnh vực đề xuất",
  },
  about: {
    title: "FLF làm gì — và phần nào do đối tác pháp lý thực hiện",
    lead: "FLF là đơn vị tư vấn đa lĩnh vực. Khi cần hành nghề luật sư hoặc dịch vụ pháp lý thuộc phạm vi luật định, FLF kết nối và phối hợp với công ty luật / tổ chức hành nghề luật sư đối tác — không thay thế vai trò của họ.",
    points: [
      {
        title: "Phạm vi FLF",
        text: "Tiếp nhận yêu cầu, làm rõ bài toán kinh doanh, đề xuất hướng tư vấn đa lĩnh vực và điều phối quy trình làm việc với doanh nghiệp.",
      },
      {
        title: "Phạm vi đối tác pháp lý",
        text: "Thực hiện các công việc thuộc hành nghề luật sư và lĩnh vực pháp lý đặc thù theo thỏa thuận với khách hàng và quy định pháp luật.",
      },
    ],
  },
  services: {
    title: "Nhóm lĩnh vực đề xuất",
    note: "Nội dung đề xuất trong tài liệu duyệt — chưa xác minh đầy đủ từ hiện trạng site cũ / hồ sơ khách. Khách sẽ chọn và chỉnh trước khi phát triển tiếp.",
    items: [
      {
        title: "Tư vấn doanh nghiệp & quản trị",
        text: "Hỗ trợ làm rõ cấu trúc vận hành, quy trình nội bộ và nhu cầu tư vấn liên quan hoạt động doanh nghiệp.",
      },
      {
        title: "Đầu tư & mở rộng hoạt động",
        text: "Đồng hành khi doanh nghiệp cân nhắc bước đầu tư, hợp tác hoặc mở rộng — phân định phần tư vấn FLF và phần cần đối tác pháp lý.",
      },
      {
        title: "Tuân thủ & giấy phép (đề xuất)",
        text: "Hỗ trợ rà soát nhu cầu tuân thủ / giấy phép ở mức tư vấn định hướng; phần pháp lý chuyên sâu do đối tác hành nghề luật sư thực hiện khi được chỉ định.",
      },
      {
        title: "Hợp tác pháp lý chuyên sâu (đề xuất)",
        text: "Khi yêu cầu thuộc lĩnh vực đặc thù, FLF phối hợp quy trình với công ty luật đối tác — không công bố tên đối tác cho đến khi khách xác nhận.",
      },
    ],
  },
  process: {
    title: "Quy trình tiếp nhận yêu cầu",
    steps: [
      { n: "01", title: "Tiếp nhận", text: "Doanh nghiệp gửi thông tin qua form hoặc kênh liên hệ." },
      { n: "02", title: "Làm rõ nhu cầu", text: "FLF trao đổi để xác định phạm vi tư vấn và phần cần đối tác pháp lý." },
      { n: "03", title: "Đề xuất hướng xử lý", text: "Thống nhất phương án làm việc, đầu mối và thứ tự ưu tiên." },
      { n: "04", title: "Triển khai & phản hồi", text: "Thực hiện trong phạm vi đã thống nhất; cập nhật tiến độ với khách hàng." },
    ],
  },
  partners: {
    title: "Cách phối hợp với đối tác pháp lý",
    lead: "FLF không liệt kê tên công ty luật trên mockup này để tránh thông tin chưa được khách xác nhận. Khi triển khai thật, danh sách đối tác sẽ cập nhật từ Dashboard sau khi được duyệt.",
    items: [
      "FLF tiếp nhận và phân loại yêu cầu.",
      "Nếu thuộc lĩnh vực pháp lý đặc thù → phối hợp đối tác hành nghề luật sư.",
      "Khách hàng được thông báo rõ phạm vi từng bên trước khi triển khai.",
    ],
  },
  contact: {
    title: "Sẵn sàng trao đổi với FLF",
    lead: "Để lại nhu cầu tư vấn. Đội ngũ sẽ phản hồi trong giờ làm việc. Địa chỉ trụ sở hiển thị công khai sẽ cập nhật sau khi khách xác nhận (xem tài liệu xác minh công ty).",
    cta: "Gửi yêu cầu liên hệ",
    privacy: "Form liên hệ sẽ có ô đồng ý xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.",
  },
  footer: {
    legalName: "CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM",
    mst: "MST: 0314193708",
    note: "Địa chỉ hiển thị công khai: chờ khách xác nhận (đăng ký MST và địa chỉ website cũ chưa khớp).",
    facebook: "https://www.facebook.com/firstlegalforce",
    linkedin: "https://www.linkedin.com/company/firstlegalforce/home/",
  },
};
