import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import pool from './db.js'

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(72)
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/[0-9]/, 'Password must include a number.'),
})

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
})

export function signToken(user) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is required.')
  }

  return jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '1d' })
}

export function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function registerUser(payload) {
  const data = registerSchema.parse(payload)
  const email = data.email.toLowerCase()

  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email])

  if (existing.length > 0) {
    const error = new Error('An account with this email already exists.')
    error.status = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(data.password, 12)
  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
    [email, passwordHash, data.fullName],
  )

  return {
    id: result.insertId,
    email,
    fullName: data.fullName,
  }
}

export async function loginUser(payload) {
  const data = loginSchema.parse(payload)
  const email = data.email.toLowerCase()

  const [rows] = await pool.execute(
    'SELECT id, email, full_name, password_hash FROM users WHERE email = ? LIMIT 1',
    [email],
  )

  const user = rows[0]

  if (!user) {
    const error = new Error('Invalid email or password.')
    error.status = 401
    throw error
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password_hash)

  if (!isValidPassword) {
    const error = new Error('Invalid email or password.')
    error.status = 401
    throw error
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    token: signToken(user),
  }
}

export function readToken(req) {
  return req.cookies.token
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export async function findUserById(userId) {
  const [rows] = await pool.execute(
    'SELECT id, email, full_name, created_at FROM users WHERE id = ? LIMIT 1',
    [userId],
  )

  if (rows.length === 0) {
    return null
  }

  const user = rows[0]

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    createdAt: user.created_at,
  }
}
