import speakeasy from 'speakeasy'
import { db } from '../utils/db'
import { AppError } from '../middleware/error'

export class AuthService {
  async requestCode(email: string): Promise<void> {
    let user = await db.user.findUnique({ where: { email } })
    
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          totpSecret: speakeasy.generateSecret().base32,
        },
      })
    } else if (!user.totpSecret) {
      user = await db.user.update({
        where: { email },
        data: {
          totpSecret: speakeasy.generateSecret().base32,
        },
      })
    }

    const token = speakeasy.totp({
      secret: user.totpSecret,
      encoding: 'base32',
      window: 2,
    })

    // In production, send this via email
    console.log(`MFA Code for ${email}: ${token}`)
  }

  async verifyCode(email: string, code: string): Promise<string> {
    const user = await db.user.findUnique({ where: { email } })
    
    if (!user || !user.totpSecret) {
      throw new AppError(401, 'Invalid credentials')
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    })

    if (!verified) {
      throw new AppError(401, 'Invalid code')
    }

    // Create session
    const session = await db.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return session.id
  }

  async logout(sessionId: string): Promise<void> {
    await db.session.delete({
      where: { id: sessionId },
    })
  }
}

export const authService = new AuthService()