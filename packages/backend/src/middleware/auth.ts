import { Request, Response, NextFunction } from 'express'
import { AppError } from './error'
import { db } from '../utils/db'

export interface AuthRequest extends Request {
  userId?: string
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers.authorization?.replace('Bearer ', '')
    
    if (!sessionId) {
      throw new AppError(401, 'No session token provided')
    }

    const session = await db.session.findFirst({
      where: {
        id: sessionId,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!session) {
      throw new AppError(401, 'Invalid or expired session')
    }

    req.userId = session.userId
    next()
  } catch (error) {
    next(error)
  }
}