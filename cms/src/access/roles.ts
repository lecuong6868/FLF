import type { Access, FieldAccess } from 'payload'

export type UserRole = 'admin' | 'editor' | 'reviewer'

type UserLike = {
  id?: string | number
  role?: UserRole | null
} | null | undefined

export const isAdmin = (user: UserLike): boolean => user?.role === 'admin'

export const isStaff = (user: UserLike): boolean =>
  Boolean(user && (user.role === 'admin' || user.role === 'editor' || user.role === 'reviewer'))

export const canPublish = (user: UserLike): boolean =>
  Boolean(user && (user.role === 'admin' || user.role === 'reviewer'))

/** Đăng nhập bất kỳ (nhân viên CMS). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Chỉ admin. */
export const admins: Access = ({ req: { user } }) => isAdmin(user)

/** Admin hoặc reviewer (duyệt / đăng). */
export const publishers: Access = ({ req: { user } }) => canPublish(user)

/** Nhân viên nội bộ đọc được. */
export const staff: Access = ({ req: { user } }) => isStaff(user)

export const anyone: Access = () => true

/** Field access: chỉ admin/reviewer được đổi trạng thái đăng. */
export const publishStatusField: FieldAccess = ({ req: { user } }) => canPublish(user)
