import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors, anyone } from '@/access/roles'

export const LegalPartners: CollectionConfig = {
  slug: 'legal-partners',
  labels: {
    singular: { vi: 'Đối tác pháp lý', en: 'Legal partner' },
    plural: { vi: 'Đối tác pháp lý', en: 'Legal partners' },
  },
  admin: {
    useAsTitle: 'name',
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
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      label: { vi: 'Tên đơn vị', en: 'Name' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { vi: 'Mô tả', en: 'Description' },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'specialties',
      type: 'text',
      localized: true,
      hasMany: true,
      label: { vi: 'Chuyên môn', en: 'Specialties' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
