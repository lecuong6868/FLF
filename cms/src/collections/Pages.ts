import type { CollectionConfig } from 'payload'

import { admins, authenticated, canPublish, staff } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Trang',
    plural: 'Trang',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Nội dung',
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
  ],
}
