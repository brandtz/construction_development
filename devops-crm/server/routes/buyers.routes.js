const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/buyers - List all buyers
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status,
      projectId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    const where = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    }
    
    if (status) {
      where.status = status
    }
    
    if (projectId) {
      where.interestedProjectId = projectId
    }
    
    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          interestedProject: { select: { id: true, name: true } },
          _count: { select: { showings: true, activities: true } }
        }
      }),
      prisma.buyer.count({ where }),
    ])
    
    res.json({
      data: buyers,
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

// GET /api/buyers/:id - Get single buyer
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: req.params.id },
      include: {
        interestedProject: true,
        showings: { orderBy: { scheduledAt: 'desc' } },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            createdBy: { select: { id: true, name: true } }
          }
        },
      },
    })
    
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' })
    }
    
    res.json(buyer)
  } catch (error) {
    next(error)
  }
})

// POST /api/buyers - Create buyer
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      prequalAmount,
      lenderName,
      lenderContact,
      source,
      status,
      projectId,
      notes,
    } = req.body
    
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' })
    }
    
    const buyer = await prisma.buyer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        prequalAmount: prequalAmount ? parseFloat(prequalAmount) : null,
        lenderName,
        lenderContact,
        source,
        status: status || 'INQUIRY',
        projectId,
        notes,
      },
    })
    
    res.status(201).json(buyer)
  } catch (error) {
    next(error)
  }
})

// PUT /api/buyers/:id - Update buyer
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      prequalAmount,
      lenderName,
      lenderContact,
      source,
      status,
      projectId,
      offerAmount,
      offerDate,
      underContractDate,
      closedDate,
      notes,
    } = req.body
    
    const buyer = await prisma.buyer.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        prequalAmount: prequalAmount ? parseFloat(prequalAmount) : null,
        lenderName,
        lenderContact,
        source,
        status,
        projectId,
        offerAmount: offerAmount ? parseFloat(offerAmount) : null,
        offerDate: offerDate ? new Date(offerDate) : null,
        underContractDate: underContractDate ? new Date(underContractDate) : null,
        closedDate: closedDate ? new Date(closedDate) : null,
        notes,
      },
    })
    
    res.json(buyer)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/buyers/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.buyer.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Buyer deleted' })
  } catch (error) {
    next(error)
  }
})

// POST /api/buyers/:id/showings - Create showing
router.post('/:id/showings', authMiddleware, async (req, res, next) => {
  try {
    const { scheduledAt, feedback, rating } = req.body
    
    if (!scheduledAt) {
      return res.status(400).json({ error: 'Scheduled date is required' })
    }
    
    const showing = await prisma.showing.create({
      data: {
        buyerId: req.params.id,
        scheduledAt: new Date(scheduledAt),
        feedback,
        rating: rating ? parseInt(rating) : null,
      },
    })
    
    res.status(201).json(showing)
  } catch (error) {
    next(error)
  }
})

module.exports = router
