import { z } from 'zod'

export const createPaperSchema = z.object({
  title: z.string().min(1).max(200),
  abstract: z.string().max(500),
  content: z.string(),
  tags: z.array(z.string()).max(10),
  font: z.string().optional(),
})

export const updatePaperSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  abstract: z.string().max(500).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().optional(),
  font: z.string().optional(),
})

export type CreatePaperInput = z.infer<typeof createPaperSchema>
export type UpdatePaperInput = z.infer<typeof updatePaperSchema>