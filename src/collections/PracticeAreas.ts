import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors, anyone } from '@/access/roles'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  labels: {
    singular: { vi: 'Lĩnh vực tư vấn', en: 'Practice area' },
    plural: { vi: 'Lĩnh vực tư vấn', en: 'Practice areas' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
    group: { vi: 'Nội dung', en: 'Content' },
  },
  access: {
    create: adminsAndEditors,
    delete: admins,
    read: anyone,
    update: adminsAndEditors,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: { vi: 'Tên lĩnh vực', en: 'Title' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: { vi: 'Tóm tắt', en: 'Summary' },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: { vi: 'Nội dung chi tiết', en: 'Body' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Tên icon tùy chọn (ví dụ: building, scale, globe).',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'requiresLawyerReview',
      type: 'checkbox',
      defaultValue: true,
      label: {
        vi: 'Nội dung đăng liên quan cần luật sư duyệt',
        en: 'Related posts need lawyer review',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}
