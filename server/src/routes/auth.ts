import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getPool } from '../db/index.js'
import { signToken, authMiddleware } from '../middleware/auth.js'

const router = Router() as ReturnType<typeof Router>

const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues })
      return
    }

    const { name, email, password } = parsed.data
    const pool = getPool()

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const password_hash = bcrypt.hashSync(password, 10)
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password_hash]
    )
    const user = result.rows[0]
    const token = signToken({ userId: user.id, email: user.email })
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.issues })
      return
    }

    const { email, password } = parsed.data
    const pool = getPool()

    const result = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!
    const pool = getPool()
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId])
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
