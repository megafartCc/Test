import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { ZodError } from 'zod'
import {
  clearAuthCookie,
  findUserById,
  loginUser,
  readToken,
  registerUser,
  setAuthCookie,
  signToken,
  verifyToken,
} from './auth.js'
import { ensureDatabase } from './db.js'

const app = express()
const PORT = Number(process.env.PORT || 4000)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
)
app.use(helmet())
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const user = await registerUser(req.body)
    setAuthCookie(res, signToken(user))

    res.status(201).json({
      message: 'Account created successfully.',
      user,
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const user = await loginUser(req.body)
    setAuthCookie(res, user.token)

    res.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res)
  res.status(204).send()
})

app.get('/api/auth/me', async (req, res, next) => {
  try {
    const token = readToken(req)

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const payload = verifyToken(token)
    const user = await findUserById(payload.sub)

    if (!user) {
      clearAuthCookie(res)
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    return res.json({ user })
  } catch (error) {
    clearAuthCookie(res)
    return next(error)
  }
})

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Please check the submitted fields.',
      issues: error.issues.map((issue) => issue.message),
    })
  }

  const status = error.status || 500
  const message = status >= 500 ? 'Something went wrong on the server.' : error.message

  return res.status(status).json({ message })
})

async function startServer() {
  await ensureDatabase()

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
