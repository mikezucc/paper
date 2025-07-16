import speakeasy from 'speakeasy'
import { db } from '../utils/db'
import { AppError } from '../middleware/error'
import { emailService } from './email'

const VERIFICATION_CODE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export class AuthService {
  async requestCode(email: string, acceptedTerms?: boolean): Promise<void> {
    let user = await db.user.findUnique({ where: { email } })
    
    if (!user) {
      // New user must accept terms
      if (!acceptedTerms) {
        throw new AppError(400, 'Terms of service must be accepted')
      }
      
      user = await db.user.create({
        data: {
          email,
          totpSecret: speakeasy.generateSecret().base32,
          termsAcceptedAt: new Date(),
          lastVerificationCodeSentAt: new Date(),
        },
      })
    } else {
      // Check rate limiting
      if (user.lastVerificationCodeSentAt) {
        const timeSinceLastCode = Date.now() - user.lastVerificationCodeSentAt.getTime()
        if (timeSinceLastCode < VERIFICATION_CODE_COOLDOWN_MS) {
          const remainingMinutes = Math.ceil((VERIFICATION_CODE_COOLDOWN_MS - timeSinceLastCode) / 60000)
          throw new AppError(429, `Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before requesting a new verification code`)
        }
      }
      
      // Update user with new verification timestamp
      const updateData: any = {
        lastVerificationCodeSentAt: new Date(),
      }
      
      // If existing user hasn't accepted terms yet, require it
      if (!user.termsAcceptedAt && acceptedTerms) {
        updateData.termsAcceptedAt = new Date()
      } else if (!user.termsAcceptedAt) {
        throw new AppError(400, 'Terms of service must be accepted')
      }
      
      // Generate new secret if needed
      if (!user.totpSecret) {
        updateData.totpSecret = speakeasy.generateSecret().base32
      }
      
      user = await db.user.update({
        where: { email },
        data: updateData,
      })
    }

    const token = speakeasy.totp({
      secret: user.totpSecret!,
      encoding: 'base32',
    })

    // Send verification code via email
    await emailService.sendVerificationCode(email, token)
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