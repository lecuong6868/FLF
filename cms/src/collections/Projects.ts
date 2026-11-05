import type { CollectionConfig } from 'payload'

import { admins, publishers, staff } from '../access/roles'

export const PROJECT_FIELDS_OPTIONS = [
  { label: 'Blockchain', value: 'blockchain' },
  { label: 'Trí tuệ nhân tạo (AI)', value: 'ai' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Thương mại điện tử', value: 'ecommerce' },
  { label: 'Bất động sản', value: 'real-estate' },
  { label: 'Khác', value: 'other' },
]

export const PROJECT_ROLE_OPTIONS = [
  { label: 'FLF đầu tư', value: 'dau-tu' },
  { label: 'FLF hỗ trợ', value: 'ho-tro' },
  { label: 'FLF tư vấn', value: 'tu-van' },
]

/** Dự án / startup FLF đầu tư, hỗ trợ, tư vấn — hiện ở trang Dự án và trang chủ. */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'field', 'role', 'status', 'order'],
    group: 'Nội dung',
    description: 'Startup FLF đầu tư / hỗ trợ / tư vấn. Nút "Xem chi tiết" trên web dẫn tới Website dự án.',
  },
  defaultSort: 'order',
  access: {
    create: publishers,
    update: publishers,
    delete: admins,
    read: ({ req: { user } }) => {
      if (staff({ req: { user } } as never)) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'name', type: 'text', label: 'Tên dự án', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Ảnh sản phẩm (cho dự án nổi bật)' },
    { name: 'field', type: 'select', label: 'Lĩnh vực', defaultValue: 'other', options: PROJECT_FIELDS_OPTIONS },
    { name: 'fieldLabel', type: 'text', label: 'Tên lĩnh vực hiển thị (nếu chọn "Khác")', localized: true },
    { name: 'role', type: 'select', label: 'Vai trò của FLF', defaultValue: 'tu-van', options: PROJECT_ROLE_OPTIONS },
    { name: 'summary', type: 'textarea', label: 'Giới thiệu ngắn (1–3 câu)', localized: true },
    { name: 'stage', type: 'text', label: 'Giai đoạn (vd: Seed, Series A)', localized: true },
    { name: 'support', type: 'text', label: 'FLF đồng hành ở việc gì', localized: true },
    {
      name: 'url',
      type: 'text',
      label: 'Website dự án',
      admin: { description: 'Nút "Xem chi tiết dự án" mở link này ở tab mới. Ví dụ: https://…' },
      validate: (v: unknown) => !v || /^https?:\/\/\S+$/.test(String(v)) || 'Link phải bắt đầu bằng http:// hoặc https://',
    },
    { name: 'featured', type: 'checkbox', label: 'Dự án nổi bật (khung lớn đầu trang Dự án)', defaultValue: false },
    { name: 'order', type: 'number', label: 'Thứ tự hiển thị (nhỏ đứng trước)', defaultValue: 100 },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      defaultValue: 'published',
      options: [
        { label: 'Nháp (khách không thấy)', value: 'draft' },
        { label: 'Hiển thị', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
