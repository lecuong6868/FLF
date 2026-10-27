import type { CollectionConfig } from 'payload'

import { admins, adminsAndSelf, adminsField, isAdmin, type AuthUser } from '@/access/roles'
import { validateStrongPassword } from '@/lib/auth/password'

import { twoFactorEnableEndpoint, twoFactorSetupEndpoint } from './endpoints/twoFactor'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { vi: 'Người dùng', en: 'User' },
    plural: { vi: 'Người dùng', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'twoFactorEnabled'],
    group: { vi: 'Hệ thống', en: 'System' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    loginWithUsername: false,
  },
  endpoints: [twoFactorSetupEndpoint, twoFactorEnableEndpoint],
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: admins,
    delete: admins,
    read: adminsAndSelf,
    update: adminsAndSelf,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (!data) return data
        if (data.password) {
          const result = validateStrongPassword(String(data.password))
          if (!result.ok) {
            throw new Error(result.message)
          }
        }
        // Chỉ admin được đổi role; tài khoản đầu tiên seed sẽ là admin
        if (operation === 'update' && data.role && !isAdmin(req.user as AuthUser | null)) {
          delete data.role
        }
        return data
      },
    ],
    beforeLogin: [
      async ({ user, req }) => {
        if (!user?.twoFactorEnabled) return
        const data = (req.data || {}) as Record<string, unknown>
        const totp =
          (typeof data.totp === 'string' && data.totp) ||
          (typeof data.twoFactorCode === 'string' && data.twoFactorCode) ||
          (typeof req.headers?.get === 'function' ? req.headers.get('x-totp-code') : null)

        if (!totp) {
          throw new Error('Yêu cầu mã xác thực 2FA (TOTP). Gửi kèm trường totp.')
        }

        const { verifyTotp } = await import('@/lib/auth/totp')
        const secret = user.twoFactorSecret
        if (!secret || !verifyTotp(String(secret), String(totp))) {
          throw new Error('Mã 2FA không hợp lệ.')
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { vi: 'Họ tên', en: 'Full name' },
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: { vi: 'Vai trò', en: 'Role' },
      required: true,
      defaultValue: 'editor',
      options: [
        { label: { vi: 'Quản trị viên', en: 'Admin' }, value: 'admin' },
        { label: { vi: 'Nhân viên (Editor)', en: 'Editor' }, value: 'editor' },
      ],
      access: {
        create: adminsField,
        update: adminsField,
      },
      saveToJWT: true,
    },
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      label: { vi: 'Bật 2FA (TOTP)', en: 'Enable 2FA (TOTP)' },
      defaultValue: false,
      saveToJWT: true,
      admin: {
        description: {
          vi: 'Khi bật, đăng nhập phải kèm mã TOTP từ ứng dụng Authenticator.',
          en: 'When enabled, login requires a TOTP code from an authenticator app.',
        },
      },
    },
    {
      name: 'twoFactorSecret',
      type: 'text',
      label: { vi: 'Bí mật 2FA', en: '2FA secret' },
      access: {
        read: adminsField,
        update: adminsField,
        create: adminsField,
      },
      admin: {
        readOnly: true,
        description: {
          vi: 'Được tạo qua API /api/users/me/2fa/setup — không chỉnh tay.',
          en: 'Generated via /api/users/me/2fa/setup — do not edit manually.',
        },
      },
    },
  ],
}
