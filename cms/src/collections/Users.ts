import type { CollectionConfig } from 'payload'

import { admins, authenticated, isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: admins,
    delete: admins,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return user.id === id
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Họ tên',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor (nhân viên viết bài)', value: 'editor' },
        { label: 'Reviewer (duyệt bài)', value: 'reviewer' },
      ],
      access: {
        create: ({ req: { user } }) => isAdmin(user),
        update: ({ req: { user } }) => isAdmin(user),
      },
      admin: {
        description: 'Chỉ admin được đổi vai trò. Editor không được duyệt/đăng bài.',
      },
    },
  ],
}
