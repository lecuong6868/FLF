import type { CollectionConfig } from 'payload'

import { PAGE_BLOCKS } from '../blocks'
import { admins, canPublish, publishers, staff } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Trang',
    plural: 'Trang',
  },
  admin: {
    useAsTitle: 'title',
    // Nút "Preview" trong CMS: mở đúng trang trên web theo ngôn ngữ đang sửa
    preview: (doc, { locale }) =>
      `/${locale || 'vi'}${doc?.slug && doc.slug !== 'trang-chu' ? '/' + doc.slug : ''}`,
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Nội dung',
    description: 'Trang chủ (slug: trang-chu) và Giới thiệu (slug: gioi-thieu) hiển thị trên web.',
  },
  access: {
    create: publishers, // sửa trang: admin hoặc reviewer
    delete: admins,
    read: ({ req: { user } }) => {
      if (staff({ req: { user } } as never)) return true
      return { status: { equals: 'published' } }
    },
    update: publishers,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        if (!data) return data
        if (operation === 'create' && data.status === 'published' && !canPublish(req.user)) {
          throw new Error('Editor không được đăng trang. Chỉ admin/reviewer.')
        }
        if (
          operation === 'update' &&
          data.status &&
          data.status !== originalDoc?.status &&
          data.status === 'published' &&
          !canPublish(req.user)
        ) {
          throw new Error('Editor không được duyệt/đăng trang.')
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Các phần của trang',
      localized: true,
      blocks: PAGE_BLOCKS,
      admin: {
        description:
          'Mỗi khối là một phần trên web, theo thứ tự từ trên xuống. Kéo thả để đổi thứ tự. Đổi ngôn ngữ VI/EN ở góc trên để sửa bản tiếng Anh.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung thêm (cuối trang, tùy chọn)',
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
  ],
}
