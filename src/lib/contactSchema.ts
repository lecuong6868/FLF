import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
  consentNd13: z.literal(true),
  website: z.string().optional(),
  locale: z.enum(['vi', 'en']).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
