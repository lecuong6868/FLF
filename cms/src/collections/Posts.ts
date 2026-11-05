import type { CollectionConfig } from 'payload'

import { admins, authenticated, canPublish, publishStatusField, staff } from '../access/roles'

const PUBLISHED = 'published'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Bài viết',
    plural: 'Bài viết',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Chọn Chuyên mục: Tin tức / Quy định mới / Chuyên mục — bài "Đã đăng" sẽ hiện ở mục tương ứng trên web.',
    defaultColumns: ['title', 'status', 'category', 'updatedAt'],
    group: 'Nội dung',
  },
  versions: {
    drafts: false,
  },
  access: {
    create: authenticated,
    delete: admins,
    read: ({ req: { user } }) => {
      if (staff({ req: { user } } as never)) return true
      return { status: { equals: 'published' } }
    },
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        if (!data) return data
        const prevStatus = originalDoc?.status as string | undefined
        const nextStatus = (data.status ?? prevStatus) as string | undefined

        if (operation === 'create' && data.status === PUBLISHED && !canPublish(req.user)) {
          throw new Error('Editor không được đăng bài. Chỉ admin/reviewer được đặt trạng thái Đã đăng.')
        }

        if (operation === 'update' && data.status && data.status !== prevStatus) {
          if (data.status === PUBLISHED && !canPublish(req.user)) {
            throw new Error('Editor không được duyệt/đăng bài. Chỉ admin/reviewer.')
          }
          if (prevStatus === PUBLISHED && nextStatus !== PUBLISHED && !canPublish(req.user)) {
            throw new Error('Editor không được gỡ bài đã đăng. Chỉ admin/reviewer.')
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Chờ duyệt', value: 'pending_review' },
        { label: 'Đã đăng', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Nháp → Chờ duyệt → Đã đăng. Chỉ admin/reviewer được đặt Đã đăng (hook + test).',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Chuyên mục',
      admin: { position: 'sidebar' },
    },
    {
      name: 'layoutStyle',
      type: 'select',
      label: 'Bố cục bài viết',
      defaultValue: 'standard',
      options: [
        { label: 'Chuẩn (cột đọc giữa trang)', value: 'standard' },
        { label: 'Rộng (ảnh lớn tràn khung)', value: 'wide' },
        { label: 'Ảnh bên trái, chữ bên phải', value: 'image-left' },
        { label: 'Ảnh bìa nền tối (kiểu tạp chí)', value: 'cover' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'topic',
      type: 'select',
      label: 'Chủ đề (cho Chuyên mục)',
      options: [
        { label: 'Đầu tư', value: 'dau-tu' },
        { label: 'Thuế', value: 'thue' },
        { label: 'Quản trị doanh nghiệp', value: 'quan-tri-dn' },
        { label: 'Quản trị rủi ro', value: 'rui-ro' },
        { label: 'Giấy phép', value: 'giay-phep' },
        { label: 'Lao động & nhân sự', value: 'lao-dong' },
        { label: 'Hợp đồng & giao dịch', value: 'hop-dong' },
        { label: 'Tuân thủ & bảo vệ dữ liệu', value: 'tuan-thu' },
        { label: 'M&A', value: 'm-a' },
        { label: 'Startup', value: 'startup' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'Trí tuệ nhân tạo (AI)', value: 'ai' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Thông tin văn bản (chỉ cho mục VBPL)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'docStatus',
          type: 'select',
          label: 'Tình trạng hiệu lực',
          options: [
            { label: 'Sắp hiệu lực', value: 'sap-hieu-luc' },
            { label: 'Đã hiệu lực', value: 'da-hieu-luc' },
            { label: 'Dự thảo', value: 'du-thao' },
          ],
        },
        {
          name: 'docField',
          type: 'select',
          label: 'Lĩnh vực văn bản',
          options: [
            { label: 'Doanh nghiệp', value: 'doanh-nghiep' },
            { label: 'Đầu tư', value: 'dau-tu' },
            { label: 'Thuế', value: 'thue' },
            { label: 'Lao động', value: 'lao-dong' },
            { label: 'Đất đai', value: 'dat-dai' },
            { label: 'Công nghệ', value: 'cong-nghe' },
          ],
        },
        { name: 'docNumber', type: 'text', label: 'Số hiệu văn bản (vd: 18/2026/NĐ-CP)' },
        { name: 'issuedAt', type: 'date', label: 'Ngày ban hành' },
        { name: 'effectiveAt', type: 'date', label: 'Ngày hiệu lực' },
        { name: 'sourceUrl', type: 'text', label: 'Link văn bản gốc (nguồn chính thức)' },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Tóm tắt',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      localized: true,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO title',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO description',
          localized: true,
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày đăng',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      access: {
        update: publishStatusField,
      },
    },
  ],
}

