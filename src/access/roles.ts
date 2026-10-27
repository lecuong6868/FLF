import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor'

export type AuthUser = {
  id: number | string
  role?: UserRole
  twoFactorEnabled?: boolean | null
}

export const isAdmin = (user?: { role?: string | null } | null): boolean =>
  user?.role === 'admin'

export const isEditorOrAdmin = (user?: { role?: string | null } | null): boolean =>
  user?.role === 'admin' || user?.role === 'editor'

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const admins: Access = ({ req: { user } }) => isAdmin(user as AuthUser)

export const adminsAndEditors: Access = ({ req: { user } }) =>
  isEditorOrAdmin(user as AuthUser)

export const adminsField: FieldAccess = ({ req: { user } }) => isAdmin(user as AuthUser)

export const adminsAndSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user as AuthUser)) return true
  return {
    id: {
      equals: user.id,
    },
  }
}
