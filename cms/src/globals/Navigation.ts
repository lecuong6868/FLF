import type { GlobalConfig } from 'payload'

import { admins } from '../access/roles'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu điều hướng',
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Mục menu',
      labels: {
        singular: 'Mục',
        plural: 'Mục menu',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn',
          localized: true,
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          label: 'Đường dẫn',
          required: true,
          admin: {
            description: 'Ví dụ: /vi/chuyen-muc hoặc https://...',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Mở tab mới',
          defaultValue: false,
        },
      ],
    },
  ],
}
