const bcrypt = require('bcryptjs')

// Simple session store (in production, use Redis or database sessions)
const sessions = new Map()

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const authMiddleware = (req, res, next) => {
  const sessionId = req.cookies?.sessionId
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const session = sessions.get(sessionId)
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired' })
  }
  
  // Check session expiry (24 hours)
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(sessionId)
    return res.status(401).json({ error: 'Session expired' })
  }
  
  req.user = session.user
  next()
}

const optionalAuth = (req, res, next) => {
  const sessionId = req.cookies?.sessionId
  
  if (sessionId) {
    const session = sessions.get(sessionId)
    if (session && Date.now() - session.createdAt < 24 * 60 * 60 * 1000) {
      req.user = session.user
    }
  }
  
  next()
}

const createSession = (user) => {
  const sessionId = generateSessionId()
  sessions.set(sessionId, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    createdAt: Date.now(),
  })
  return sessionId
}

const destroySession = (sessionId) => {
  sessions.delete(sessionId)
}

const getSession = (sessionId) => {
  const session = sessions.get(sessionId)
  if (!session) return null
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(sessionId)
    return null
  }
  return session
}

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10)
}

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

module.exports = {
  authMiddleware,
  optionalAuth,
  createSession,
  destroySession,
  getSession,
  hashPassword,
  verifyPassword,
}
