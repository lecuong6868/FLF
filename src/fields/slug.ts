import type { Field } from 'payload'

export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ data, value, operation }) => {
        if (typeof value === 'string' && value.length > 0) {
          return slugify(value)
        }
        if (operation === 'create' || !value) {
          const source = data?.[fieldToUse]
          if (typeof source === 'string') return slugify(source)
        }
        return value
      },
    ],
  },
})

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
}
