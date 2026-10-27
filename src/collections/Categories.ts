import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors, anyone } from '@/access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { vi: 'Danh mục', en: 'Category' },
    plural: { vi: 'Danh mục', en: 'Categories' },
  },
  admin: {
    useAsTitle: 'title',
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
