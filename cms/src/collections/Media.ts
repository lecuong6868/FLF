import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Nội dung',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      localized: true,
      required: true,
    },
  ],
  upload: true,
}
