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

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Banner đầu trang', plural: 'Banner đầu trang' },
  fields: [
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
  labels: { singular: 'Phần có các thẻ', plural: 'Phần có các thẻ' },
  fields: [
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
  labels: { singular: 'Các bước / quy trình', plural: 'Các bước / quy trình' },
  fields: [
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
  labels: { singular: 'Đoạn văn tự do', plural: 'Đoạn văn tự do' },
  fields: [
    anchor,
    { name: 'index', type: 'text', label: 'Số thứ tự phần' },
    { name: 'title', type: 'text', label: 'Tiêu đề phần' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh (tùy chọn)' },
    { name: 'content', type: 'richText', label: 'Nội dung' },
  ],
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Form liên hệ', plural: 'Form liên hệ' },
  fields: [
    { ...anchor, defaultValue: 'contact' },
    { name: 'title', type: 'text', label: 'Tiêu đề' },
    { name: 'lead', type: 'textarea', label: 'Mô tả' },
    { name: 'consent', type: 'textarea', label: 'Câu đồng ý xử lý dữ liệu' },
    { name: 'button', type: 'text', label: 'Chữ trên nút gửi' },
    { name: 'privacy', type: 'textarea', label: 'Ghi chú dưới form' },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Dải kêu gọi liên hệ', plural: 'Dải kêu gọi liên hệ' },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề' },
    link('primary', 'Nút chính'),
    link('secondary', 'Liên kết phụ'),
  ],
}

export const PAGE_BLOCKS = [HeroBlock, CardsBlock, StepsBlock, TextBlock, ContactBlock, CtaBlock]
