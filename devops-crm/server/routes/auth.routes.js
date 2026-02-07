const express = require('express')
const prisma = require('../config/database')
const { createSession, destroySession, hashPassword, verifyPassword, getSession } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body
    
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, name, and password are required' })
    }
    
    const passwordHash = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'ADMIN', // First user is admin
      },
    })
    
    const sessionId = createSession(user)
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValid = await verifyPassword(password, user.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const sessionId = createSession(user)
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const sessionId = req.cookies?.sessionId
  
  if (sessionId) {
    destroySession(sessionId)
  }
  
  res.clearCookie('sessionId')
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: 'Session expired' })
    }
    
    res.json({ user: session.user })
  } catch (error) {
    next(error)
  }
})

// GET /api/auth/profile - Get full profile
router.get('/profile', async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: 'Session expired' })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// PUT /api/auth/profile - Update profile
router.put('/profile', async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: 'Session expired' })
    }
    
    const { name, phone } = req.body
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      }
    })
    
    // Update session with new user data
    session.user = user
    
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// PUT /api/auth/password - Change password
router.put('/password', async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    const session = getSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: 'Session expired' })
    }
    
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })
    
    const isValid = await verifyPassword(currentPassword, user.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    
    const newPasswordHash = await hashPassword(newPassword)
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newPasswordHash }
    })
    
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
