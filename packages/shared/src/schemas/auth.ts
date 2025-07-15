import { z } from 'zod'

export const requestCodeSchema = z.object({
  email: z.string().email(),
})

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export type RequestCodeInput = z.infer<typeof requestCodeSchema>
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>