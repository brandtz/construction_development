const express = require('express')
const bcrypt = require('bcryptjs')
const prisma = require('../config/database')
const crypto = require('crypto')

const router = express.Router()

// ============================================================================
// INVESTOR SESSION MANAGEMENT (Cookie-based)
// ============================================================================

// Investor session store (separate from admin sessions)
const investorSessions = new Map()

const generateInvestorSessionId = () => {
  return 'inv_' + crypto.randomBytes(16).toString('hex') + Date.now().toString(36)
}

const createInvestorSession = (investor) => {
  const sessionId = generateInvestorSessionId()
  investorSessions.set(sessionId, {
    investorId: investor.id,
    investor: {
      id: investor.id,
      firstName: investor.firstName,
      lastName: investor.lastName,
      email: investor.email,
      company: investor.company,
      status: investor.status
    },
    createdAt: Date.now()
  })
  return sessionId
}

const getInvestorSession = (sessionId) => {
  if (!sessionId) return null
  const session = investorSessions.get(sessionId)
  if (!session) return null
  // 24 hour expiry
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    investorSessions.delete(sessionId)
    return null
  }
  return session
}

const destroyInvestorSession = (sessionId) => {
  investorSessions.delete(sessionId)
}

// ============================================================================
// INVESTOR AUTHENTICATION
// ============================================================================

// Middleware to protect investor portal routes
const investorAuthMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.investorSessionId
    const session = getInvestorSession(sessionId)
    
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    const investor = await prisma.investor.findUnique({
      where: { id: session.investorId },
      include: { auth: true }
    })
    
    if (!investor || !investor.auth) {
      return res.status(401).json({ error: 'Invalid session' })
    }
    
    req.investor = investor
    req.investorSession = session
    next()
  } catch (error) {
    next(error)
  }
}

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// POST /api/investor/interest - Submit interest form (creates LEAD in CRM)
router.post('/interest', async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      company,
      accreditedStatus,
      investmentCapacity,
      source,
      notes
    } = req.body
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name and email are required' })
    }
    
    // Check if investor already exists
    const existingInvestor = await prisma.investor.findUnique({
      where: { email }
    })
    
    if (existingInvestor) {
      // If they exist, append to their notes (Activity requires a createdById user)
      const resubmitNote = `\n\n--- Re-submitted Interest Form (${new Date().toISOString()}) ---\nInvestment Capacity: ${investmentCapacity || 'Not specified'}\nSource: ${source || 'Not specified'}\nMessage: ${notes || 'None'}`
      
      await prisma.investor.update({
        where: { id: existingInvestor.id },
        data: {
          notes: existingInvestor.notes ? existingInvestor.notes + resubmitNote : resubmitNote
        }
      })
      
      // Create notification for existing investor if they have portal access
      if (existingInvestor.status === 'FUNDED' || existingInvestor.status === 'COMMITTED') {
        await prisma.notification.create({
          data: {
            investorId: existingInvestor.id,
            type: 'GENERAL',
            title: 'Interest Form Received',
            message: 'We received your interest form submission. Our team will be in touch shortly.'
          }
        })
      }
      
      return res.status(200).json({ 
        message: 'Thank you! We have your information on file and will be in touch soon.'
      })
    }
    
    // Create new investor as LEAD
    // Note: We append the submission details to the notes field since Activity requires a createdById (user)
    const submissionNote = `--- Submitted via Investor Portal ---\nInvestment Capacity: ${investmentCapacity || 'Not specified'}\nAccreditation: ${accreditedStatus || 'Unknown'}\nSource: ${source || 'Website'}${notes ? `\n\nMessage: ${notes}` : ''}\nSubmitted: ${new Date().toISOString()}`
    
    const investor = await prisma.investor.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        accreditedStatus: accreditedStatus || 'UNKNOWN',
        investmentCapacity: investmentCapacity || null,
        source: source || 'WEBSITE',
        notes: submissionNote,
        status: 'LEAD'
      }
    })
    
    res.status(201).json({ 
      message: 'Thank you for your interest! Our investor relations team will contact you within 24 hours.'
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/register - Register for portal access
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    // Find the investor by email
    const investor = await prisma.investor.findUnique({
      where: { email },
      include: { auth: true }
    })
    
    if (!investor) {
      return res.status(404).json({ 
        error: 'No investor account found with this email. If you recently submitted an inquiry, please try again shortly.' 
      })
    }
    
    if (investor.auth) {
      return res.status(400).json({ 
        error: 'Portal access already registered. Please login instead.' 
      })
    }
    
    // Allow any investor in the system to register (removed FUNDED/COMMITTED restriction)
    // This lets prospective investors view documents and messages during the review process
    
    const passwordHash = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    
    const auth = await prisma.investorAuth.create({
      data: {
        investorId: investor.id,
        passwordHash,
        verifyToken,
        emailVerified: false
      }
    })
    
    // Create welcome notification
    await prisma.notification.create({
      data: {
        investorId: investor.id,
        type: 'WELCOME',
        title: 'Welcome to the Investor Portal',
        message: 'Thank you for registering! You can now view documents and messages from our team as we work together.',
      }
    })
    
    // In production, send verification email here
    // await sendVerificationEmail(investor.email, verifyToken)
    
    res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      // In dev, auto-verify
      verified: true
    })
    
    // Auto-verify in development
    await prisma.investorAuth.update({
      where: { id: auth.id },
      data: { emailVerified: true }
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/login - Investor portal login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    const investor = await prisma.investor.findUnique({
      where: { email },
      include: { auth: true }
    })
    
    if (!investor || !investor.auth) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Check if locked
    if (investor.auth.lockedUntil && new Date() < investor.auth.lockedUntil) {
      return res.status(423).json({ 
        error: 'Account temporarily locked. Please try again later.' 
      })
    }
    
    const validPassword = await bcrypt.compare(password, investor.auth.passwordHash)
    
    if (!validPassword) {
      // Increment failed attempts
      const failedAttempts = investor.auth.failedAttempts + 1
      const updates = { failedAttempts }
      
      // Lock after 5 failed attempts
      if (failedAttempts >= 5) {
        updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        updates.failedAttempts = 0
      }
      
      await prisma.investorAuth.update({
        where: { id: investor.auth.id },
        data: updates
      })
      
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Clear failed attempts and update login info
    await prisma.investorAuth.update({
      where: { id: investor.auth.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
        loginCount: { increment: 1 }
      }
    })
    
    // Create session and set cookie
    const sessionId = createInvestorSession(investor)
    res.cookie('investorSessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
    
    res.json({
      investor: {
        id: investor.id,
        firstName: investor.firstName,
        lastName: investor.lastName,
        email: investor.email,
        company: investor.company,
        status: investor.status
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/logout - Logout
router.post('/logout', (req, res) => {
  const sessionId = req.cookies?.investorSessionId
  if (sessionId) {
    destroyInvestorSession(sessionId)
  }
  res.clearCookie('investorSessionId')
  res.json({ message: 'Logged out successfully' })
})

// GET /api/investor/me - Get current investor
router.get('/me', investorAuthMiddleware, async (req, res, next) => {
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: req.investor.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        accreditedStatus: true,
        status: true,
        committedAmount: true,
        committedDate: true,
        createdAt: true
      }
    })
    
    res.json({ investor })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/forgot-password - Request password reset
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    
    const investor = await prisma.investor.findUnique({
      where: { email },
      include: { auth: true }
    })
    
    // Always return success to prevent email enumeration
    if (!investor || !investor.auth) {
      return res.json({ message: 'If an account exists, a reset link has been sent.' })
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    
    await prisma.investorAuth.update({
      where: { id: investor.auth.id },
      data: { resetToken, resetTokenExpiry }
    })
    
    // In production, send reset email here
    // await sendPasswordResetEmail(investor.email, resetToken)
    
    res.json({ 
      message: 'If an account exists, a reset link has been sent.',
      // In dev, return token for testing
      devToken: resetToken
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/reset-password - Reset password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body
    
    const auth = await prisma.investorAuth.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    })
    
    if (!auth) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    
    await prisma.investorAuth.update({
      where: { id: auth.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    
    res.json({ message: 'Password reset successful. Please login.' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR PROFILE MANAGEMENT
// ============================================================================

// GET /api/investor/profile - Get full profile
router.get('/profile', investorAuthMiddleware, async (req, res, next) => {
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: req.investor.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        accreditedStatus: true,
        investmentCapacity: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' })
    }
    
    res.json(investor)
  } catch (error) {
    next(error)
  }
})

// PUT /api/investor/profile - Update profile
router.put('/profile', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      company,
      address,
      city,
      state,
      zipCode 
    } = req.body
    
    const investor = await prisma.investor.update({
      where: { id: req.investor.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        accreditedStatus: true,
        status: true,
      }
    })
    
    res.json(investor)
  } catch (error) {
    next(error)
  }
})

// PUT /api/investor/password - Change password
router.put('/password', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }
    
    const auth = await prisma.investorAuth.findUnique({
      where: { investorId: req.investor.id }
    })
    
    if (!auth) {
      return res.status(404).json({ error: 'Auth record not found' })
    }
    
    const isValid = await bcrypt.compare(currentPassword, auth.passwordHash)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    
    await prisma.investorAuth.update({
      where: { investorId: req.investor.id },
      data: { passwordHash: newPasswordHash }
    })
    
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR DASHBOARD
// ============================================================================

// GET /api/investor/dashboard - Get investor dashboard data
router.get('/dashboard', investorAuthMiddleware, async (req, res, next) => {
  try {
    const investorId = req.investor.id
    
    // Get investments with project details
    const investments = await prisma.investment.findMany({
      where: { investorId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            status: true,
            targetSalePrice: true
          }
        },
        distributions: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const totalDistributions = investments.reduce((sum, inv) => 
      sum + inv.distributions.reduce((dSum, d) => dSum + d.amount, 0), 0
    )
    
    // Get recent notifications
    const notifications = await prisma.notification.findMany({
      where: { investorId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    const unreadCount = await prisma.notification.count({
      where: { investorId, read: false }
    })
    
    // Get recent documents
    const documents = await prisma.document.findMany({
      where: { investorId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    res.json({
      summary: {
        totalInvested,
        totalDistributions,
        netPosition: totalDistributions - totalInvested,
        activeInvestments: investments.filter(i => ['FUNDED', 'ACTIVE'].includes(i.status)).length,
        totalInvestments: investments.length
      },
      investments,
      notifications,
      unreadNotifications: unreadCount,
      recentDocuments: documents
    })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR INVESTMENTS
// ============================================================================

// GET /api/investor/investments - List investor's investments
router.get('/investments', investorAuthMiddleware, async (req, res, next) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { investorId: req.investor.id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            status: true,
            landCost: true,
            buildBudget: true,
            targetSalePrice: true,
            actualSalePrice: true,
            startDate: true,
            targetEndDate: true
          }
        },
        distributions: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ investments })
  } catch (error) {
    next(error)
  }
})

// GET /api/investor/investments/:id - Get specific investment details
router.get('/investments/:id', investorAuthMiddleware, async (req, res, next) => {
  try {
    const investment = await prisma.investment.findFirst({
      where: {
        id: req.params.id,
        investorId: req.investor.id
      },
      include: {
        project: true,
        distributions: {
          orderBy: { date: 'desc' }
        },
        investmentDocuments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' })
    }
    
    res.json({ investment })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR DOCUMENTS
// ============================================================================

// GET /api/investor/documents - List investor's documents
router.get('/documents', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { category } = req.query
    
    const where = {
      OR: [
        { investorId: req.investor.id },
        { 
          investment: { investorId: req.investor.id }
        },
        {
          project: {
            investments: { some: { investorId: req.investor.id } }
          },
          isPublic: true
        }
      ]
    }
    
    if (category && category !== 'undefined' && category.trim()) {
      where.category = category
    }
    
    const documents = await prisma.document.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        investment: { select: { id: true, amount: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ documents })
  } catch (error) {
    next(error)
  }
})

// GET /api/investor/documents/:id/download - Download a document
router.get('/documents/:id/download', investorAuthMiddleware, async (req, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { investorId: req.investor.id },
          { investment: { investorId: req.investor.id } },
          {
            project: {
              investments: { some: { investorId: req.investor.id } }
            },
            isPublic: true
          }
        ]
      }
    })
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
    
    // In production, serve file or generate signed URL
    res.json({ 
      downloadUrl: `/uploads/${document.path}`,
      filename: document.originalName
    })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR NOTIFICATIONS
// ============================================================================

// GET /api/investor/notifications - List notifications
router.get('/notifications', investorAuthMiddleware, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { investorId: req.investor.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    res.json({ notifications })
  } catch (error) {
    next(error)
  }
})

// PUT /api/investor/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', investorAuthMiddleware, async (req, res, next) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        investorId: req.investor.id
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// PUT /api/investor/notifications/read-all - Mark all notifications as read
router.put('/notifications/read-all', investorAuthMiddleware, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: {
        investorId: req.investor.id,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR MESSAGES
// ============================================================================

// GET /api/investor/messages - List messages
router.get('/messages', investorAuthMiddleware, async (req, res, next) => {
  try {
    const messages = await prisma.investorMessage.findMany({
      where: { investorId: req.investor.id },
      include: {
        respondedBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ messages })
  } catch (error) {
    next(error)
  }
})

// POST /api/investor/messages - Send a message
router.post('/messages', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { subject, message } = req.body
    
    const newMessage = await prisma.investorMessage.create({
      data: {
        investorId: req.investor.id,
        subject,
        message,
        direction: 'INVESTOR_TO_ADMIN',
        status: 'PENDING'
      }
    })
    
    res.status(201).json({ message: newMessage })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR PROFILE
// ============================================================================

// PUT /api/investor/profile - Update investor profile
router.put('/profile', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { phone, company } = req.body
    
    const investor = await prisma.investor.update({
      where: { id: req.investor.id },
      data: { phone, company },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        accreditedStatus: true,
        status: true
      }
    })
    
    res.json({ investor })
  } catch (error) {
    next(error)
  }
})

// PUT /api/investor/change-password - Change password
router.put('/change-password', investorAuthMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    const validPassword = await bcrypt.compare(currentPassword, req.investor.auth.passwordHash)
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    await prisma.investorAuth.update({
      where: { id: req.investor.auth.id },
      data: { passwordHash }
    })
    
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
