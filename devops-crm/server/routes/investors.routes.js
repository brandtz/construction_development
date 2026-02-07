const express = require('express')
const bcrypt = require('bcryptjs')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')
const notificationService = require('../services/notificationService')

const router = express.Router()

// GET /api/investors - List all investors with filters and pagination
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status, 
      accredited,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    const where = {}
    
    // Only add search filter if it's a valid non-empty string
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ]
    }
    
    // Only add status filter if it's a valid enum value
    if (status && status !== 'undefined' && status.trim()) {
      where.status = status
    }
    
    // Only add accredited filter if valid
    if (accredited && accredited !== 'undefined' && accredited.trim()) {
      where.accreditedStatus = accredited
    }
    
    const [investors, total] = await Promise.all([
      prisma.investor.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { investments: true, activities: true }
          }
        }
      }),
      prisma.investor.count({ where }),
    ])
    
    res.json({
      data: investors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/investors/stats - Get investor pipeline stats
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const stats = await prisma.investor.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { committedAmount: true },
    })
    
    const totalPipeline = await prisma.investor.aggregate({
      _sum: { committedAmount: true },
      _count: { id: true },
    })
    
    res.json({
      byStatus: stats,
      total: {
        count: totalPipeline._count.id,
        committedAmount: totalPipeline._sum.committedAmount || 0,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/investors/:id - Get single investor
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: req.params.id },
      include: {
        investments: {
          include: {
            project: true,
            distributions: true,
          }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            createdBy: {
              select: { id: true, name: true }
            }
          }
        },
        auth: {
          select: {
            id: true,
            emailVerified: true,
            lastLogin: true,
            loginCount: true,
            createdAt: true
          }
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
    })
    
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' })
    }
    
    res.json(investor)
  } catch (error) {
    next(error)
  }
})

// POST /api/investors - Create investor
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      accreditedStatus,
      investmentCapacity,
      preferredStructure,
      status,
      source,
      notes,
    } = req.body
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' })
    }
    
    const investor = await prisma.investor.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        accreditedStatus: accreditedStatus || 'UNKNOWN',
        investmentCapacity,
        preferredStructure,
        status: status || 'LEAD',
        source,
        notes,
      },
    })
    
    res.status(201).json(investor)
  } catch (error) {
    next(error)
  }
})

// PUT /api/investors/:id - Update investor
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      accreditedStatus,
      investmentCapacity,
      preferredStructure,
      status,
      source,
      committedAmount,
      committedDate,
      notes,
    } = req.body
    
    const investor = await prisma.investor.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        accreditedStatus,
        investmentCapacity,
        preferredStructure,
        status,
        source,
        committedAmount: committedAmount ? parseFloat(committedAmount) : null,
        committedDate: committedDate ? new Date(committedDate) : null,
        notes,
      },
    })
    
    res.json(investor)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/investors/:id - Delete investor
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.investor.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Investor deleted' })
  } catch (error) {
    next(error)
  }
})

// GET /api/investors/:id/activities - Get investor activities
router.get('/:id/activities', authMiddleware, async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { investorId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    res.json(activities)
  } catch (error) {
    next(error)
  }
})

// POST /api/investors/:id/activities - Add activity to investor
router.post('/:id/activities', authMiddleware, async (req, res, next) => {
  try {
    const { type, subject, description, dueDate } = req.body
    
    if (!type || !subject) {
      return res.status(400).json({ error: 'Type and subject are required' })
    }
    
    const activity = await prisma.activity.create({
      data: {
        entityType: 'INVESTOR',
        entityId: req.params.id,
        investorId: req.params.id,
        type,
        subject,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: req.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    res.status(201).json(activity)
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// INVESTOR PORTAL MANAGEMENT (from CRM)
// ============================================================================

// POST /api/investors/:id/portal-access - Grant portal access to investor
router.post('/:id/portal-access', authMiddleware, async (req, res, next) => {
  try {
    const { temporaryPassword } = req.body
    
    const investor = await prisma.investor.findUnique({
      where: { id: req.params.id },
      include: { auth: true }
    })
    
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' })
    }
    
    if (investor.auth) {
      return res.status(400).json({ error: 'Investor already has portal access' })
    }
    
    const password = temporaryPassword || Math.random().toString(36).slice(-8)
    const passwordHash = await bcrypt.hash(password, 10)
    
    const auth = await prisma.investorAuth.create({
      data: {
        investorId: investor.id,
        passwordHash,
        emailVerified: true // Admin-created, so verified
      }
    })
    
    // Create welcome notification
    await notificationService.notify(investor.id, {
      type: 'WELCOME',
      title: 'Welcome to the Investor Portal',
      message: 'Your portal access has been activated. You can now view your investments, documents, and distributions.'
    })
    
    res.status(201).json({ 
      message: 'Portal access granted',
      temporaryPassword: password,
      note: 'Please share this password securely with the investor'
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/investors/:id/portal-access - Revoke portal access
router.delete('/:id/portal-access', authMiddleware, async (req, res, next) => {
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: req.params.id },
      include: { auth: true }
    })
    
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' })
    }
    
    if (!investor.auth) {
      return res.status(400).json({ error: 'Investor does not have portal access' })
    }
    
    await prisma.investorAuth.delete({
      where: { id: investor.auth.id }
    })
    
    res.json({ message: 'Portal access revoked' })
  } catch (error) {
    next(error)
  }
})

// POST /api/investors/:id/reset-portal-password - Reset investor portal password
router.post('/:id/reset-portal-password', authMiddleware, async (req, res, next) => {
  try {
    const investor = await prisma.investor.findUnique({
      where: { id: req.params.id },
      include: { auth: true }
    })
    
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' })
    }
    
    if (!investor.auth) {
      return res.status(400).json({ error: 'Investor does not have portal access' })
    }
    
    const newPassword = Math.random().toString(36).slice(-8)
    const passwordHash = await bcrypt.hash(newPassword, 10)
    
    await prisma.investorAuth.update({
      where: { id: investor.auth.id },
      data: { passwordHash }
    })
    
    res.json({ 
      message: 'Password reset successfully',
      temporaryPassword: newPassword,
      note: 'Please share this password securely with the investor'
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/investors/:id/send-notification - Send notification to investor
router.post('/:id/send-notification', authMiddleware, async (req, res, next) => {
  try {
    const { type, title, message, link } = req.body
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' })
    }
    
    const notification = await notificationService.notify(req.params.id, {
      type: type || 'GENERAL',
      title,
      message,
      link
    })
    
    res.status(201).json({ notification })
  } catch (error) {
    next(error)
  }
})

// GET /api/investors/:id/messages - Get investor messages
router.get('/:id/messages', authMiddleware, async (req, res, next) => {
  try {
    const messages = await prisma.investorMessage.findMany({
      where: { investorId: req.params.id },
      include: {
        respondedBy: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json({ messages })
  } catch (error) {
    next(error)
  }
})

// POST /api/investors/:id/messages/:messageId/respond - Respond to investor message
router.post('/:id/messages/:messageId/respond', authMiddleware, async (req, res, next) => {
  try {
    const { response } = req.body
    
    if (!response) {
      return res.status(400).json({ error: 'Response is required' })
    }
    
    const message = await prisma.investorMessage.update({
      where: { id: req.params.messageId },
      data: {
        response,
        respondedById: req.user.id,
        respondedAt: new Date(),
        status: 'RESPONDED'
      },
      include: {
        respondedBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    // Notify investor of response
    await notificationService.notify(req.params.id, {
      type: 'GENERAL',
      title: 'Message Response',
      message: `You have a new response to your message: "${message.subject}"`
    })
    
    res.json({ message })
  } catch (error) {
    next(error)
  }
})

module.exports = router
