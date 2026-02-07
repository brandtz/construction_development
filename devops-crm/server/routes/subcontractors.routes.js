const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/subcontractors - List all subcontractors with filters
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      trade, 
      status,
      sortBy = 'companyName',
      sortOrder = 'asc'
    } = req.query
    
    const where = {}
    
    // Only add search filter if it's a valid non-empty string
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { companyName: { contains: search } },
        { contactName: { contains: search } },
        { email: { contains: search } },
      ]
    }
    
    // Only add trade filter if valid
    if (trade && trade !== 'undefined' && trade.trim()) {
      where.trade = trade
    }
    
    // Only add status filter if valid
    if (status && status !== 'undefined' && status.trim()) {
      where.status = status
    }
    
    const [subcontractors, total] = await Promise.all([
      prisma.subcontractor.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { bids: true }
          }
        }
      }),
      prisma.subcontractor.count({ where }),
    ])
    
    res.json({
      data: subcontractors,
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

// GET /api/subcontractors/expiring - Get subs with expiring licenses/COIs
router.get('/expiring', authMiddleware, async (req, res, next) => {
  try {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const expiring = await prisma.subcontractor.findMany({
      where: {
        OR: [
          { licenseExpiry: { lte: thirtyDaysFromNow } },
          { insuranceExpiry: { lte: thirtyDaysFromNow } },
        ],
        status: { not: 'BLACKLISTED' },
      },
      orderBy: [
        { licenseExpiry: 'asc' },
        { insuranceExpiry: 'asc' },
      ],
    })
    
    res.json(expiring)
  } catch (error) {
    next(error)
  }
})

// GET /api/subcontractors/by-trade - Get subs grouped by trade
router.get('/by-trade', authMiddleware, async (req, res, next) => {
  try {
    const byTrade = await prisma.subcontractor.groupBy({
      by: ['trade'],
      _count: { id: true },
      where: { status: { in: ['ACTIVE', 'PREFERRED'] } },
    })
    
    res.json(byTrade)
  } catch (error) {
    next(error)
  }
})

// GET /api/subcontractors/:id - Get single subcontractor
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const subcontractor = await prisma.subcontractor.findUnique({
      where: { id: req.params.id },
      include: {
        bids: {
          include: {
            project: true,
          },
          orderBy: { submittedAt: 'desc' },
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
      },
    })
    
    if (!subcontractor) {
      return res.status(404).json({ error: 'Subcontractor not found' })
    }
    
    res.json(subcontractor)
  } catch (error) {
    next(error)
  }
})

// POST /api/subcontractors - Create subcontractor
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      trade,
      email,
      phone,
      address,
      city,
      state,
      licenseNumber,
      licenseExpiry,
      insuranceExpiry,
      coiDocumentUrl,
      bondAmount,
      hourlyRate,
      dayRate,
      preferredPayment,
      status,
      rating,
      notes,
      tags,
    } = req.body
    
    if (!companyName || !contactName || !trade || !phone) {
      return res.status(400).json({ error: 'Company name, contact name, trade, and phone are required' })
    }
    
    const subcontractor = await prisma.subcontractor.create({
      data: {
        companyName,
        contactName,
        trade,
        email,
        phone,
        address,
        city,
        state: state || 'OR',
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        coiDocumentUrl,
        bondAmount: bondAmount ? parseFloat(bondAmount) : null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dayRate: dayRate ? parseFloat(dayRate) : null,
        preferredPayment,
        status: status || 'ACTIVE',
        rating: rating ? parseInt(rating) : null,
        notes,
        tags,
      },
    })
    
    res.status(201).json(subcontractor)
  } catch (error) {
    next(error)
  }
})

// PUT /api/subcontractors/:id - Update subcontractor
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      trade,
      email,
      phone,
      address,
      city,
      state,
      licenseNumber,
      licenseExpiry,
      insuranceExpiry,
      coiDocumentUrl,
      bondAmount,
      hourlyRate,
      dayRate,
      preferredPayment,
      status,
      rating,
      reliabilityScore,
      notes,
      tags,
    } = req.body
    
    const subcontractor = await prisma.subcontractor.update({
      where: { id: req.params.id },
      data: {
        companyName,
        contactName,
        trade,
        email,
        phone,
        address,
        city,
        state,
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        coiDocumentUrl,
        bondAmount: bondAmount ? parseFloat(bondAmount) : null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        dayRate: dayRate ? parseFloat(dayRate) : null,
        preferredPayment,
        status,
        rating: rating ? parseInt(rating) : null,
        reliabilityScore: reliabilityScore ? parseInt(reliabilityScore) : null,
        notes,
        tags,
      },
    })
    
    res.json(subcontractor)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/subcontractors/:id - Delete subcontractor
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.subcontractor.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Subcontractor deleted' })
  } catch (error) {
    next(error)
  }
})

// POST /api/subcontractors/:id/activities - Add activity
router.post('/:id/activities', authMiddleware, async (req, res, next) => {
  try {
    const { type, subject, description, dueDate } = req.body
    
    if (!type || !subject) {
      return res.status(400).json({ error: 'Type and subject are required' })
    }
    
    const activity = await prisma.activity.create({
      data: {
        entityType: 'SUBCONTRACTOR',
        entityId: req.params.id,
        subcontractorId: req.params.id,
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

// GET /api/subcontractors/:id/projects - Get projects this subcontractor is assigned to
router.get('/:id/projects', authMiddleware, async (req, res, next) => {
  try {
    // Get projects where this subcontractor has a bid (assigned)
    const bids = await prisma.bid.findMany({
      where: { subcontractorId: req.params.id },
      include: {
        project: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Extract unique projects
    const projects = bids.map(bid => bid.project).filter((p, i, arr) => 
      arr.findIndex(x => x.id === p.id) === i
    )
    
    res.json(projects)
  } catch (error) {
    next(error)
  }
})

// POST /api/subcontractors/:id/projects - Add subcontractor to a project
router.post('/:id/projects', authMiddleware, async (req, res, next) => {
  try {
    const { projectId } = req.body
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' })
    }
    
    // Check if already assigned
    const existingBid = await prisma.bid.findFirst({
      where: {
        subcontractorId: req.params.id,
        projectId: projectId
      }
    })
    
    if (existingBid) {
      return res.status(400).json({ error: 'Subcontractor already assigned to this project' })
    }
    
    // Get subcontractor trade
    const sub = await prisma.subcontractor.findUnique({
      where: { id: req.params.id }
    })
    
    if (!sub) {
      return res.status(404).json({ error: 'Subcontractor not found' })
    }
    
    // Create a bid entry to link subcontractor to project
    const bid = await prisma.bid.create({
      data: {
        subcontractorId: req.params.id,
        projectId: projectId,
        scope: `${sub.trade} work - Direct assignment`,
        amount: 0, // Direct assignment, no bid amount
        status: 'AWARDED', // Direct assignment is auto-awarded
        submittedAt: new Date(),
      },
      include: {
        project: true
      }
    })
    
    res.status(201).json(bid.project)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/subcontractors/:id/projects/:projectId - Remove subcontractor from project
router.delete('/:id/projects/:projectId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.bid.deleteMany({
      where: {
        subcontractorId: req.params.id,
        projectId: req.params.projectId
      }
    })
    
    res.json({ message: 'Subcontractor removed from project' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
