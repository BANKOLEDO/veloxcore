import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { initDb } from './db/index.js'
import authRoutes from './routes/auth.js'
import reviewRoutes from './routes/reviews.js'
import recommendationRoutes from './routes/recommendations.js'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(cors())
app.use(express.json())

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — try again in a minute.' },
})

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts — try again in a minute.' },
})

app.get('/health', async (_req, res) => {
  try {
    await import('./db/index.js').then((m) => m.getPool().query('SELECT 1'))
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/reviews', apiLimiter, reviewRoutes)
app.use('/api/recommendations', apiLimiter, recommendationRoutes)

const server = app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT}`)
})
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`)
  } else {
    console.error('Server error:', err.message)
  }
  process.exit(1)
})

initDb().catch((err) => {
  console.error('db init failed:', err)
  process.exit(1)
})
