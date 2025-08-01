import sgMail from '@sendgrid/mail'
import { AppError } from '../middleware/error'
import { config } from '../config'

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export class EmailService {
  private isConfigured: boolean = false

  constructor() {
    const apiKey = config.SENDGRID_API_KEY
    if (apiKey) {
      sgMail.setApiKey(apiKey)
      this.isConfigured = true
    } else {
      console.warn('SendGrid API key not configured. Emails will be logged to console.')
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Your Paper verification code',
      text: `Your verification code for Paper is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3d3a34;">Paper Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f3f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #8b7355; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #5c5449;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #d4c5b0; margin: 30px 0;">
          <p style="color: #8b8075; font-size: 12px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    }

    await this.send(emailOptions)
  }

  async sendNewPaperNotification(email: string, paperTitle: string, paperExcerpt: string, paperUrl: string, authorEmail: string): Promise<void> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: `New paper published on Paper: "${paperTitle}"`,
      text: `A new paper has been published on Paper:\n\n"${paperTitle}" by ${authorEmail}\n\n${paperExcerpt}\n\nRead the full paper: ${paperUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3d3a34;">New Paper Published</h2>
          <div style="background-color: #f5f3f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8b7355; margin: 0 0 10px 0;">${paperTitle}</h3>
            <p style="color: #6d5a44; margin: 0;">by ${authorEmail}</p>
          </div>
          <div style="padding: 20px 0;">
            <p style="color: #5c5449; line-height: 1.6;">${paperExcerpt}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paperUrl}" style="background-color: #8b7355; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Read Full Paper
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #d4c5b0; margin: 30px 0;">
          <p style="color: #8b8075; font-size: 12px; text-align: center;">
            You're receiving this because you're subscribed to new paper notifications on Paper.
          </p>
        </div>
      `
    }

    await this.send(emailOptions)
  }

  private async send(options: EmailOptions): Promise<void> {
    const msg: any = {
      to: options.to,
      from: config.SENDGRID_FROM_EMAIL,
      subject: options.subject,
    }

    // SendGrid requires either text or html content
    if (options.text) {
      msg.text = options.text
    }
    if (options.html) {
      msg.html = options.html
    }

    if (this.isConfigured) {
      try {
        await sgMail.send(msg)
        console.log(`Email sent to ${options.to}: ${options.subject}`)
      } catch (error: any) {
        console.error('SendGrid error:', error.response?.body || error.message)
        throw new AppError(500, 'Failed to send email')
      }
    } else {
      // Fallback to console logging in development
      console.log('📧 Email (not sent - SendGrid not configured):')
      console.log('To:', options.to)
      console.log('Subject:', options.subject)
      console.log('Text:', options.text)
      console.log('---')
    }
  }
}

export const emailService = new EmailService()