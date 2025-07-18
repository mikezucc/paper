import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { config } from './config'
import { errorHandler } from './middleware/error'
import { authRouter } from './routes/auth'
import { papersRouter } from './routes/papers'
import { healthRouter } from './routes/health'
import aiRouter from './routes/ai'

const app = express()

app.use(helmet())
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/papers', papersRouter)
app.use('/api/ai', aiRouter)

app.use(errorHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})