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

