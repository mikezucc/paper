import { Router } from 'express'
import { requestCodeSchema, verifyCodeSchema } from '@paper/shared'
import { authService } from '../services/auth'
import { authenticate, AuthRequest } from '../middleware/auth'
import { db } from '../utils/db'

export const authRouter = Router()

authRouter.post('/request-code', async (req, res, next) => {
  try {
    const { email, acceptedTerms } = req.body
    const parsedData = requestCodeSchema.parse({ email })
    await authService.requestCode(parsedData.email, acceptedTerms)
    res.json({ message: 'Code sent to email' })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/verify-code', async (req, res, next) => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body)
    const sessionId = await authService.verifyCode(email, code)
    res.json({ sessionId })
  } catch (error) {
    next(error)
  }
})

authRouter.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '')
    if (sessionId) {
      await authService.logout(sessionId)
    }
    res.json({ message: 'Logged out' })
  } catch (error) {
    next(error)
  }
})

authRouter.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true },
    })
    res.json({ user })
  } catch (error) {
    next(error)
  }
})