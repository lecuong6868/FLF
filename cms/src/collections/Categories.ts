import type { CollectionConfig } from 'payload'

import { admins, authenticated } from '../access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Chuyên mục',
    plural: 'Chuyên mục',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Nội dung',
  },
  access: {
    create: authenticated,
    delete: admins,
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên chuyên mục',
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả ngắn',
      localized: true,
    },
  ],
}
