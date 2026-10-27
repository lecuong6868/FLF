import type { CollectionConfig } from 'payload'

import { admins, adminsAndEditors } from '@/access/roles'
import { defaultPostStatus, enforcePostWorkflow } from '@/hooks/postsWorkflow'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { vi: 'Bài viết', en: 'Post' },
    plural: { vi: 'Bài viết', en: 'Posts' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'isLegalContent', 'lawyerApproved', 'updatedAt'],
    group: { vi: 'Nội dung', en: 'Content' },
  },
  versions: {
    drafts: false,
  },
  access: {
    create: adminsAndEditors,
    delete: admins,
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: adminsAndEditors,
  },
  hooks: {
    beforeValidate: [defaultPostStatus],
    beforeChange: [enforcePostWorkflow],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: { vi: 'Tiêu đề', en: 'Title' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: { vi: 'Tóm tắt', en: 'Excerpt' },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: { vi: 'Nội dung', en: 'Content' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh bìa', en: 'Cover image' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: { vi: 'Nháp', en: 'Draft' }, value: 'draft' },
        { label: { vi: 'Chờ duyệt', en: 'Pending review' }, value: 'pending_review' },
        { label: { vi: 'Đã xuất bản', en: 'Published' }, value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'isLegalContent',
      type: 'checkbox',
      defaultValue: false,
      label: { vi: 'Nội dung pháp lý', en: 'Legal content' },
      admin: {
        position: 'sidebar',
        description: {
          vi: 'Bật nếu bài thuộc lĩnh vực pháp lý — bắt buộc luật sư duyệt trước khi xuất bản.',
          en: 'Enable for legal-topic posts — lawyer approval required before publish.',
        },
      },
    },
    {
      name: 'lawyerApproved',
      type: 'checkbox',
      defaultValue: false,
      label: { vi: 'Đã được luật sư duyệt', en: 'Lawyer approved' },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
        description: {
          vi: 'Chỉ Admin đánh dấu sau khi luật sư đối tác xác nhận.',
          en: 'Only Admin marks this after partner lawyer confirmation.',
        },
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: { vi: 'Danh mục', en: 'Categories' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: { vi: 'Thẻ', en: 'Tags' },
    },
    {
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
      label: { vi: 'Lĩnh vực liên quan', en: 'Related practice area' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: { vi: 'Tác giả', en: 'Author' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { vi: 'Ngày xuất bản', en: 'Published at' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
