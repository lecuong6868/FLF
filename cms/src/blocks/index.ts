import type { Block, Field } from 'payload'

/** Các khối nội dung để dựng trang (Trang chủ, Giới thiệu…). Mỗi khối = 1 phần trên web. */

const link = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text', label: 'Chữ hiển thị' },
    {
      name: 'href',
      type: 'text',
      label: 'Đường dẫn',
      admin: { description: 'Ví dụ: #contact, /vi/gioi-thieu, https://…' },
    },
  ],
})

const anchor: Field = {
  name: 'anchor',
  type: 'text',
  label: 'Mã neo (id)',
  admin: { description: 'Dùng cho menu nhảy tới phần này, ví dụ: services, contact. Có thể để trống.' },
}

/** Màu & khoảng cách riêng cho từng phần (để trống = theo thiết kế). */
const appearance: Field = {
  name: 'appearance',
  type: 'group',
  label: 'Giao diện phần này',
  fields: [
    { name: 'bg', type: 'text', label: 'Màu nền', admin: { description: 'Mã màu, ví dụ #ffffff. Trống = mặc định.' } },
    { name: 'text', type: 'text', label: 'Màu chữ', admin: { description: 'Mã màu, ví dụ #102130. Trống = mặc định.' } },
    {
      name: 'spacing', type: 'select', label: 'Khoảng cách trên/dưới', defaultValue: 'normal',
      options: [{ label: 'Gọn', value: 'compact' }, { label: 'Vừa', value: 'normal' }, { label: 'Rộng', value: 'large' }],
    },
    { name: 'hidden', type: 'checkbox', label: 'Tạm ẩn phần này', defaultValue: false },
  ],
}

export const HeroBlock: Block = {
  slug: 'hero',
  admin: { disableBlockName: true },
  labels: { singular: 'Banner đầu trang', plural: 'Banner đầu trang' },
  fields: [
    appearance,
    { name: 'eyebrow', type: 'text', label: 'Dòng nhỏ phía trên' },
    { name: 'masthead', type: 'text', label: 'Dòng phụ' },
    { name: 'headline', type: 'textarea', label: 'Tiêu đề lớn', required: true },
    { name: 'sub', type: 'textarea', label: 'Đoạn mô tả' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh nền / ảnh minh họa',
      admin: { description: 'Để trống thì dùng logo FLF như bản mẫu.' },
    },
    link('primary', 'Nút chính'),
    link('secondary', 'Liên kết phụ'),
  ],
}

export const CardsBlock: Block = {
  slug: 'cards',
  admin: { disableBlockName: true },
  labels: { singular: 'Phần có các thẻ', plural: 'Phần có các thẻ' },
  fields: [
    appearance,
    anchor,
    {
      name: 'style',
      type: 'select',
      label: 'Kiểu hiển thị',
      defaultValue: 'about',
      options: [
        { label: 'Nền sáng – lưới 3 thẻ', value: 'about' },
        { label: 'Danh sách lĩnh vực (nền kem)', value: 'services' },
        { label: 'Lưới "Vì sao chọn"', value: 'why' },
        { label: 'Nền xanh navy', value: 'navy' },
      ],
    },
    {
      name: 'columns', type: 'select', label: 'Số cột thẻ', defaultValue: 'auto',
      options: [{ label: 'Tự động', value: 'auto' }, { label: '1 cột', value: '1' }, { label: '2 cột', value: '2' }, { label: '3 cột', value: '3' }, { label: '4 cột', value: '4' }],
    },
    { name: 'index', type: 'text', label: 'Số thứ tự phần (vd: 01 — Giới thiệu)' },
    { name: 'title', type: 'text', label: 'Tiêu đề phần' },
    { name: 'lead', type: 'textarea', label: 'Đoạn mở đầu (chữ lớn)' },
    { name: 'note', type: 'textarea', label: 'Ghi chú (chữ nhỏ)' },
    {
      name: 'items',
      type: 'array',
      label: 'Các thẻ',
      labels: { singular: 'Thẻ', plural: 'Các thẻ' },
      fields: [
        { name: 'title', type: 'text', label: 'Tiêu đề thẻ' },
        { name: 'text', type: 'textarea', label: 'Nội dung', admin: { description: 'Xuống dòng sẽ hiển thị xuống dòng.' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh (tùy chọn)' },
        link('link', 'Liên kết (tùy chọn)'),
      ],
    },
    link('more', 'Liên kết cuối phần (tùy chọn)'),
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  admin: { disableBlockName: true },
  labels: { singular: 'Các bước / quy trình', plural: 'Các bước / quy trình' },
  fields: [
    appearance,
    anchor,
    {
      name: 'style',
      type: 'select',
      label: 'Kiểu hiển thị',
      defaultValue: 'process',
      options: [
        { label: 'Nền tối (quy trình trang chủ)', value: 'process' },
        { label: 'Danh sách đánh số (nền kem)', value: 'intake' },
      ],
    },
    { name: 'index', type: 'text', label: 'Số thứ tự phần' },
    { name: 'title', type: 'text', label: 'Tiêu đề phần' },
    { name: 'note', type: 'textarea', label: 'Ghi chú' },
    {
      name: 'items',
      type: 'array',
      label: 'Các bước',
      labels: { singular: 'Bước', plural: 'Các bước' },
      fields: [
        { name: 'title', type: 'text', label: 'Tên bước' },
        { name: 'text', type: 'textarea', label: 'Mô tả' },
      ],
    },
  ],
}

export const TextBlock: Block = {
  slug: 'text',
  admin: { disableBlockName: true },
  labels: { singular: 'Đoạn văn tự do', plural: 'Đoạn văn tự do' },
  fields: [
    appearance,
    anchor,
    { name: 'index', type: 'text', label: 'Số thứ tự phần' },
    { name: 'title', type: 'text', label: 'Tiêu đề phần' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh (tùy chọn)' },
    { name: 'content', type: 'richText', label: 'Nội dung' },
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  admin: { disableBlockName: true },
  labels: { singular: 'Form liên hệ', plural: 'Form liên hệ' },
  fields: [
    appearance,
    { ...anchor, defaultValue: 'contact' },
    { name: 'eyebrow', type: 'text', label: 'Nhãn nhỏ phía trên (vd: LIÊN HỆ)' },
    { name: 'title', type: 'text', label: 'Tiêu đề' },
    { name: 'lead', type: 'textarea', label: 'Mô tả' },
    { name: 'consent', type: 'textarea', label: 'Câu đồng ý xử lý dữ liệu' },
    { name: 'button', type: 'text', label: 'Chữ trên nút gửi' },
    { name: 'privacy', type: 'textarea', label: 'Ghi chú dưới form' },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  admin: { disableBlockName: true },
  labels: { singular: 'Dải kêu gọi liên hệ', plural: 'Dải kêu gọi liên hệ' },
  fields: [
    appearance,
    { name: 'title', type: 'text', label: 'Tiêu đề' },
    link('primary', 'Nút chính'),
    link('secondary', 'Liên kết phụ'),
  ],
}

/* ============ Khối theo thiết kế phương án A (11/2026) ============ */

const eyebrow: Field = { name: 'eyebrow', type: 'text', label: 'Nhãn nhỏ phía trên (vd: DỊCH VỤ CHO DOANH NGHIỆP)' }
const title: Field = { name: 'title', type: 'text', label: 'Tiêu đề phần' }
const ICONS = [
  { label: 'Khiên (rủi ro)', value: 'shield' },
  { label: 'Bảng (quản lý)', value: 'board' },
  { label: 'Hồ sơ (giấy phép)', value: 'doc' },
  { label: 'Biểu đồ', value: 'chart' },
  { label: 'Bắt tay', value: 'deal' },
  { label: 'Chip (công nghệ)', value: 'chip' },
]
const ACCENTS = [
  { label: 'Navy', value: 'navy' },
  { label: 'Đỏ', value: 'red' },
  { label: 'Xanh lá', value: 'green' },
]
const B = (slug: string, singular: string, fields: Field[]): Block => ({
  slug,
  admin: { disableBlockName: true },
  labels: { singular, plural: singular },
  fields: [appearance, ...fields],
})

export const HeroAskBlock = B('heroAsk', 'Banner trang chủ + ô hỏi trợ lý', [
  { name: 'headline', type: 'textarea', label: 'Tiêu đề lớn', required: true },
  { name: 'sub', type: 'textarea', label: 'Đoạn mô tả' },
  link('primary', 'Nút chính'),
  link('secondary', 'Nút phụ'),
  { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh nền (tùy chọn)' },
  { name: 'askEyebrow', type: 'text', label: 'Nhãn khung hỏi (vd: HỎI NHANH TRỢ LÝ FLF)' },
  { name: 'askTitle', type: 'text', label: 'Câu hỏi lớn trong khung' },
  { name: 'suggestions', type: 'array', label: 'Câu hỏi gợi ý', labels: { singular: 'Gợi ý', plural: 'Gợi ý' }, fields: [{ name: 'text', type: 'text', label: 'Câu gợi ý' }] },
  { name: 'disclaimer', type: 'text', label: 'Dòng lưu ý dưới khung' },
])

export const PageHeroBlock = B('pageHero', 'Banner trang con', [
  { name: 'title', type: 'textarea', label: 'Tiêu đề lớn', required: true },
  { name: 'lead', type: 'textarea', label: 'Đoạn mô tả' },
  link('primary', 'Nút chính'),
  link('secondary', 'Nút phụ'),
])

export const ServicesBlock = B('services', 'Thẻ dịch vụ (có icon, gạch đầu dòng)', [
  anchor, eyebrow, title,
  link('more', 'Liên kết cạnh tiêu đề'),
  {
    name: 'items', type: 'array', label: 'Dịch vụ', labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
    fields: [
      { name: 'icon', type: 'select', label: 'Biểu tượng', defaultValue: 'shield', options: ICONS },
      { name: 'title', type: 'text', label: 'Tên dịch vụ' },
      { name: 'text', type: 'textarea', label: 'Mô tả' },
      { name: 'bullets', type: 'textarea', label: 'Gạch đầu dòng (mỗi dòng 1 ý)' },
      link('link', 'Liên kết "Xem chi tiết"'),
    ],
  },
])

export const SpecialBlock = B('special', 'Lưới tư vấn đặc biệt (nền navy, đánh số)', [
  anchor, eyebrow, title,
  { name: 'lead', type: 'textarea', label: 'Đoạn mô tả (tùy chọn)' },
  {
    name: 'items', type: 'array', label: 'Mục', labels: { singular: 'Mục', plural: 'Mục' },
    fields: [{ name: 'title', type: 'text', label: 'Tên' }, { name: 'text', type: 'textarea', label: 'Mô tả' }],
  },
])

export const ProjectsTeaserBlock = B('projectsTeaser', 'Dự án (lấy tự động từ mục Dự án)', [
  anchor, eyebrow, title,
  { name: 'count', type: 'number', label: 'Số dự án hiển thị', defaultValue: 3 },
  link('more', 'Liên kết "Xem tất cả"'),
])

export const ProjectsListBlock = B('projectsList', 'Danh sách dự án đầy đủ (có bộ lọc)', [
  anchor,
  { name: 'showFeatured', type: 'checkbox', label: 'Hiện khung "Dự án nổi bật"', defaultValue: true },
])

export const StepCardsBlock = B('stepCards', 'Quy trình (thẻ màu đánh số)', [
  anchor, eyebrow, title,
  {
    name: 'items', type: 'array', label: 'Bước', labels: { singular: 'Bước', plural: 'Các bước' },
    fields: [
      { name: 'title', type: 'text', label: 'Tên bước' },
      { name: 'text', type: 'textarea', label: 'Mô tả' },
      { name: 'accent', type: 'select', label: 'Màu', defaultValue: 'navy', options: ACCENTS },
    ],
  },
])

export const StepListBlock = B('stepList', 'Các bước (danh sách 2 cột)', [
  anchor, eyebrow, title,
  { name: 'note', type: 'textarea', label: 'Đoạn mô tả bên trái' },
  {
    name: 'items', type: 'array', label: 'Bước', labels: { singular: 'Bước', plural: 'Các bước' },
    fields: [{ name: 'title', type: 'text', label: 'Tên bước' }, { name: 'text', type: 'textarea', label: 'Mô tả' }],
  },
])

export const IntroBlock = B('intro', 'Giới thiệu 2 cột (tiêu đề trái, nội dung phải)', [
  anchor, eyebrow, title,
  { name: 'lead', type: 'textarea', label: 'Đoạn mở đầu (chữ lớn)' },
  { name: 'body', type: 'textarea', label: 'Các đoạn tiếp theo (cách nhau 1 dòng trống)' },
])

export const FeatureCardsBlock = B('featureCards', 'Thẻ có icon (nền nhạt)', [
  anchor, eyebrow, title,
  {
    name: 'items', type: 'array', label: 'Thẻ', labels: { singular: 'Thẻ', plural: 'Các thẻ' },
    fields: [
      { name: 'icon', type: 'select', label: 'Biểu tượng', defaultValue: 'shield', options: ICONS },
      { name: 'title', type: 'text', label: 'Tiêu đề' },
      { name: 'text', type: 'textarea', label: 'Nội dung' },
      { name: 'accent', type: 'select', label: 'Màu', defaultValue: 'navy', options: ACCENTS },
    ],
  },
  link('more', 'Liên kết cuối phần'),
])

export const NewsBlock = B('news', 'VBPL mới + Chuyên mục (lấy tự động bài viết)', [
  anchor, eyebrow, title,
  { name: 'count', type: 'number', label: 'Số văn bản hiển thị', defaultValue: 3 },
  { name: 'topicsTitle', type: 'text', label: 'Tiêu đề khung Chuyên mục' },
])

export const ServiceDetailBlock = B('serviceDetail', 'Chi tiết một dịch vụ', [
  anchor,
  { name: 'icon', type: 'select', label: 'Biểu tượng', defaultValue: 'shield', options: ICONS },
  { name: 'title', type: 'text', label: 'Tên dịch vụ' },
  { name: 'text', type: 'textarea', label: 'Mô tả' },
  { name: 'situation', type: 'textarea', label: 'Doanh nghiệp thường gặp' },
  { name: 'items', type: 'textarea', label: 'FLF làm gì (mỗi dòng 1 việc)' },
  { name: 'deliverables', type: 'textarea', label: 'Bạn nhận được' },
  link('cta', 'Nút liên hệ'),
])

export const FaqBlock = B('faq', 'Câu hỏi thường gặp', [
  anchor, eyebrow, title,
  {
    name: 'items', type: 'array', label: 'Câu hỏi', labels: { singular: 'Câu hỏi', plural: 'Câu hỏi' },
    fields: [{ name: 'q', type: 'text', label: 'Câu hỏi' }, { name: 'a', type: 'textarea', label: 'Trả lời' }],
  },
])

export const CtaBandBlock = B('ctaBand', 'Dải kêu gọi (tiêu đề + nút)', [
  title,
  { name: 'lead', type: 'textarea', label: 'Mô tả (tùy chọn)' },
  { name: 'dark', type: 'checkbox', label: 'Nền navy', defaultValue: false },
  link('primary', 'Nút chính'),
  link('secondary', 'Nút phụ'),
])

/** Khối mới đặt trước để dễ chọn; khối cũ vẫn giữ để không mất dữ liệu đã có. */
export const PAGE_BLOCKS = [
  HeroAskBlock, PageHeroBlock, IntroBlock, ServicesBlock, SpecialBlock, ProjectsTeaserBlock, ProjectsListBlock, StepCardsBlock, StepListBlock,
  FeatureCardsBlock, NewsBlock, ServiceDetailBlock, FaqBlock, CtaBandBlock, ContactBlock,
  HeroBlock, CardsBlock, StepsBlock, TextBlock, CtaBlock,
]
