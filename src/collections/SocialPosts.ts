import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors } from '@/access/roles'

/**
 * Khung giai đoạn 2 — lưu lịch đăng MXH, chưa gọi API Facebook/LinkedIn/Zalo.
 */
export const SocialPosts: CollectionConfig = {
  slug: 'social-posts',
  labels: {
    singular: { vi: 'Bài MXH', en: 'Social post' },
    plural: { vi: 'Bài MXH', en: 'Social posts' },
  },
  admin: {
    useAsTitle: 'title',
    description: {
      vi: 'Khung chuẩn bị giai đoạn 2. Chưa kết nối API MXH.',
      en: 'Phase 2 scaffold. Social APIs not connected yet.',
    },
    group: { vi: 'Mạng xã hội (giai đoạn 2)', en: 'Social (phase 2)' },
  },
  access: {
    create: adminsAndEditors,
    delete: admins,
    read: adminsAndEditors,
    update: adminsAndEditors,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { vi: 'Tiêu đề nội bộ', en: 'Internal title' },
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      label: { vi: 'Nội dung đăng', en: 'Post body' },
    },
    {
      name: 'platforms',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Zalo', value: 'zalo' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: { vi: 'Nháp', en: 'Draft' }, value: 'draft' },
        { label: { vi: 'Chờ duyệt', en: 'Pending approval' }, value: 'pending_approval' },
        { label: { vi: 'Đã duyệt', en: 'Approved' }, value: 'approved' },
        { label: { vi: 'Đã lên lịch', en: 'Scheduled' }, value: 'scheduled' },
        { label: { vi: 'Đã đăng', en: 'Published' }, value: 'published' },
        { label: { vi: 'Lỗi', en: 'Failed' }, value: 'failed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'scheduledAt',
      type: 'date',
      label: { vi: 'Lịch đăng', en: 'Schedule at' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'relatedPost',
      type: 'relationship',
      relationTo: 'posts',
      label: { vi: 'Bài web liên quan', en: 'Related web post' },
    },
    {
      name: 'approvalNote',
      type: 'textarea',
      label: { vi: 'Ghi chú duyệt', en: 'Approval note' },
    },
    {
      name: 'externalIds',
      type: 'json',
      label: { vi: 'ID bài trên MXH (giai đoạn 2)', en: 'External post IDs (phase 2)' },
      admin: {
        description: 'Sẽ lưu id trả về từ API khi tích hợp.',
      },
    },
  ],
}
