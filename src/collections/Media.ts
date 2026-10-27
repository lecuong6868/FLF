import type { CollectionConfig } from 'payload'

import { adminsAndEditors, anyone } from '@/access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { vi: 'Media', en: 'Media' },
    plural: { vi: 'Media', en: 'Media' },
  },
  access: {
    create: adminsAndEditors,
    delete: adminsAndEditors,
    read: anyone,
    update: adminsAndEditors,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { vi: 'Alt text', en: 'Alt text' },
    },
  ],
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
}
