import type { GlobalConfig } from 'payload'

import { admins, anyone } from '@/access/roles'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: { vi: 'Menu điều hướng', en: 'Navigation' },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'main',
      type: 'array',
      label: { vi: 'Menu chính', en: 'Main menu' },
      labels: {
        singular: { vi: 'Mục', en: 'Item' },
        plural: { vi: 'Mục', en: 'Items' },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'Đường dẫn tương đối không gồm locale, ví dụ /about hoặc /services',
          },
        },
      ],
    },
    {
      name: 'footerExtra',
      type: 'array',
      label: { vi: 'Link footer thêm', en: 'Extra footer links' },
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
