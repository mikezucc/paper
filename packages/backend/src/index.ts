import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

import { config } from './config'
import { errorHandler } from './middleware/error'
import { ssrMiddleware } from './middleware/ssr'
import { authRouter } from './routes/auth'
import { papersRouter } from './routes/papers'
import { healthRouter } from './routes/health'
import { ogImageRouter } from './routes/ogImage'
import aiRouter from './routes/ai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Configure helmet to allow OG images
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json())

// API routes
app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/papers', papersRouter)
app.use('/api/ai', aiRouter)
app.use('/api/og-image', ogImageRouter)

// SSR middleware for social media crawlers
app.use(ssrMiddleware)

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../../../packages/frontend/dist')
app.use(express.static(frontendPath))

// Catch all route - serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

app.use(errorHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})