import { z } from 'zod'

import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
console.log('Loading .env from:', path.resolve(__dirname, '../.env'))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
})

export const config = envSchema.parse(process.env)