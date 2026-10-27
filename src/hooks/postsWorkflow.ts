import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'

import { isAdmin, type AuthUser } from '@/access/roles'

/**
 * Workflow: draft → pending_review → published
 * - Editor có thể tạo/sửa nháp và gửi duyệt (pending_review)
 * - Chỉ Admin được xuất bản (published) hoặc từ chối về draft
 * - Bài lĩnh vực pháp lý bắt buộc lawyerApproved = true trước khi publish
 */
export const enforcePostWorkflow: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  if (!data) return data

  const user = req.user as AuthUser | undefined
  const nextStatus = data.status ?? originalDoc?.status ?? 'draft'
  const prevStatus = originalDoc?.status ?? 'draft'
  const isLegal = Boolean(data.isLegalContent ?? originalDoc?.isLegalContent)
  const lawyerApproved = Boolean(data.lawyerApproved ?? originalDoc?.lawyerApproved)

  if (nextStatus === 'published') {
    if (!isAdmin(user)) {
      throw new Error('Chỉ Admin được xuất bản bài viết.')
    }
    if (isLegal && !lawyerApproved) {
      throw new Error(
        'Bài thuộc lĩnh vực pháp lý chưa được luật sư đối tác duyệt — không thể xuất bản.',
      )
    }
  }

  if (
    operation === 'update' &&
    prevStatus === 'published' &&
    nextStatus !== 'published' &&
    !isAdmin(user)
  ) {
    throw new Error('Chỉ Admin được hủy xuất bản.')
  }

  if (nextStatus === 'pending_review' && !user) {
    throw new Error('Cần đăng nhập để gửi duyệt.')
  }

  // Editor không tự gắn lawyerApproved
  if (!isAdmin(user) && typeof data.lawyerApproved !== 'undefined') {
    if (operation === 'create') {
      data.lawyerApproved = false
    } else {
      data.lawyerApproved = originalDoc?.lawyerApproved ?? false
    }
  }

  if (nextStatus === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  return data
}

export const defaultPostStatus: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'create' && data && !data.status) {
    data.status = 'draft'
  }
  return data
}

/** Pure helpers — dùng cho unit test không cần DB */
export function canPublishLegalPost(input: {
  role?: string | null
  isLegalContent?: boolean | null
  lawyerApproved?: boolean | null
  status?: string | null
}): { ok: boolean; reason?: string } {
  if (input.status !== 'published') return { ok: true }
  if (input.role !== 'admin') {
    return { ok: false, reason: 'Chỉ Admin được xuất bản bài viết.' }
  }
  if (input.isLegalContent && !input.lawyerApproved) {
    return {
      ok: false,
      reason: 'Bài thuộc lĩnh vực pháp lý chưa được luật sư đối tác duyệt — không thể xuất bản.',
    }
  }
  return { ok: true }
}

export function canTransitionStatus(input: {
  role?: string | null
  from: string
  to: string
}): { ok: boolean; reason?: string } {
  const { role, from, to } = input
  if (from === to) return { ok: true }
  if (to === 'published' && role !== 'admin') {
    return { ok: false, reason: 'Chỉ Admin được xuất bản bài viết.' }
  }
  if (from === 'published' && to !== 'published' && role !== 'admin') {
    return { ok: false, reason: 'Chỉ Admin được hủy xuất bản.' }
  }
  if (role === 'editor' && !['draft', 'pending_review'].includes(to) && to !== from) {
    if (to === 'published') {
      return { ok: false, reason: 'Chỉ Admin được xuất bản bài viết.' }
    }
  }
  return { ok: true }
}
