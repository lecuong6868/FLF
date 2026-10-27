export const vi = {
  brand: 'First Legal Force',
  nav: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    services: 'Lĩnh vực tư vấn',
    partners: 'Đối tác pháp lý',
    news: 'Tin tức',
    contact: 'Liên hệ',
    privacy: 'Chính sách bảo mật',
  },
  cta: {
    contact: 'Liên hệ tư vấn',
    learnMore: 'Tìm hiểu thêm',
    viewAll: 'Xem tất cả',
    send: 'Gửi liên hệ',
    sending: 'Đang gửi…',
  },
  home: {
    eyebrow: 'Tư vấn đa lĩnh vực · Đồng hành doanh nghiệp',
    headline: 'Giải pháp tư vấn vững chắc cho doanh nghiệp phát triển bền vững',
    sub:
      'First Legal Force kết nối chuyên gia tư vấn và đối tác hành nghề luật sư, hỗ trợ doanh nghiệp phòng tránh, giảm thiểu và chuyển giao rủi ro trong hoạt động kinh doanh.',
  },
  about: {
    title: 'Về chúng tôi',
    lead:
      'FLF là tổ hợp tư vấn đa lĩnh vực, hợp tác chặt chẽ với các đơn vị hành nghề luật sư và chuyên gia quản trị, tài chính, đầu tư.',
  },
  services: {
    title: 'Lĩnh vực tư vấn',
    lead: 'Các lĩnh vực chúng tôi đồng hành cùng doanh nghiệp — nội dung mang tính giới thiệu, không thay thế tư vấn cá thể hóa.',
  },
  partners: {
    title: 'Đối tác pháp lý',
    lead: 'Mạng lưới công ty luật và tổ chức hành nghề luật sư hợp tác thực hiện một số lĩnh vực đặc thù.',
  },
  news: {
    title: 'Tin tức & bài viết',
    lead: 'Cập nhật góc nhìn và thông tin hữu ích cho doanh nghiệp.',
    empty: 'Chưa có bài viết công khai.',
    readMore: 'Đọc tiếp',
  },
  contact: {
    title: 'Liên hệ',
    lead: 'Để lại thông tin — đội ngũ FLF sẽ phản hồi trong giờ làm việc.',
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Điện thoại',
    subject: 'Chủ đề',
    message: 'Nội dung',
    consent:
      'Tôi đồng ý để First Legal Force thu thập và xử lý dữ liệu cá nhân của tôi nhằm mục đích phản hồi liên hệ, theo Nghị định 13/2023/NĐ-CP và Chính sách bảo mật.',
    success: 'Đã gửi liên hệ. Cảm ơn bạn.',
    error: 'Không gửi được. Vui lòng thử lại sau.',
    honeypot: 'Để trống',
  },
  privacy: {
    title: 'Chính sách bảo mật',
  },
  footer: {
    rights: 'Bảo lưu mọi quyền.',
    follow: 'Kết nối',
  },
  a11y: {
    skip: 'Bỏ qua đến nội dung chính',
    lang: 'Chuyển ngôn ngữ',
  },
}

export type Dictionary = {
  [K in keyof typeof vi]: (typeof vi)[K] extends string
    ? string
    : { [P in keyof (typeof vi)[K]]: string }
}
