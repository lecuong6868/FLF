import type { CollectionConfig } from 'payload'

import { admins, anyone } from '@/access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Redirect 301',
    plural: 'Redirects 301',
  },
  admin: {
    useAsTitle: 'fromPath',
    group: { vi: 'SEO', en: 'SEO' },
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'fromPath',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'From (path cũ)',
      admin: {
        description: 'Ví dụ: /services/1 hoặc /about',
      },
    },
    {
      name: 'toPath',
      type: 'text',
      required: true,
      label: 'To (path mới)',
      admin: {
        description: 'Ví dụ: /vi/services/thanh-lap-dn-fdi',
      },
    },
    {
      name: 'permanent',
      type: 'checkbox',
      defaultValue: true,
      label: '301 Permanent',
    },
    {
      name: 'note',
      type: 'text',
      label: 'Ghi chú',
    },
  ],
}
