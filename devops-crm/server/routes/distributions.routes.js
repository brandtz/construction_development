const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')
const notificationService = require('../services/notificationService')

const router = express.Router()

// GET /api/distributions - List all distributions with filters
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      investorId,
      projectId,
      type,
      startDate,
      endDate
    } = req.query
    
    const where = {}
    
    if (investorId && investorId !== 'undefined' && investorId.trim()) {
      where.investment = { investorId }
    }
    
    if (projectId && projectId !== 'undefined' && projectId.trim()) {
      where.investment = { ...where.investment, projectId }
    }
    
    if (type && type !== 'undefined' && type.trim()) {
      where.type = type
    }
    
    if (startDate && startDate !== 'undefined') {
      where.date = { ...where.date, gte: new Date(startDate) }
    }
    
    if (endDate && endDate !== 'undefined') {
      where.date = { ...where.date, lte: new Date(endDate) }
    }
    
    const [distributions, total] = await Promise.all([
      prisma.distribution.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          investment: {
            include: {
              investor: {
                select: { id: true, firstName: true, lastName: true, email: true }
              },
              project: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.distribution.count({ where })
    ])
    
    res.json({
      data: distributions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/distributions/summary - Get distribution summary stats
router.get('/summary', authMiddleware, async (req, res, next) => {
  try {
    const { projectId, investorId } = req.query
    
    const where = {}
    if (projectId) where.investment = { projectId }
    if (investorId) where.investment = { ...where.investment, investorId }
    
    const [byType, totals] = await Promise.all([
      prisma.distribution.groupBy({
        by: ['type'],
        where,
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.distribution.aggregate({
        where,
        _sum: { amount: true },
        _count: { id: true }
      })
    ])
    
    res.json({
      byType,
      total: {
        amount: totals._sum.amount || 0,
        count: totals._count.id
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/distributions - Create a distribution
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { investmentId, amount, type, date, notes, sendNotification = true } = req.body
    
    if (!investmentId || !amount || !type || !date) {
      return res.status(400).json({ 
        error: 'Investment ID, amount, type, and date are required' 
      })
    }
    
    // Verify investment exists
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: { 
        project: { select: { name: true } },
        investor: { select: { id: true, firstName: true, lastName: true } }
      }
    })
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' })
    }
    
    const distribution = await prisma.distribution.create({
      data: {
        investmentId,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        notes
      },
      include: {
        investment: {
          include: {
            investor: { select: { id: true, firstName: true, lastName: true } },
            project: { select: { id: true, name: true } }
          }
        }
      }
    })
    
    // Send notification to investor
    if (sendNotification) {
      await notificationService.notifyDistributionSent(distribution)
    }
    
    res.status(201).json({ distribution })
  } catch (error) {
    next(error)
  }
})

// POST /api/distributions/bulk - Create multiple distributions
router.post('/bulk', authMiddleware, async (req, res, next) => {
  try {
    const { distributions: distributionData, sendNotifications = true } = req.body
    
    if (!Array.isArray(distributionData) || distributionData.length === 0) {
      return res.status(400).json({ error: 'Distributions array is required' })
    }
    
    const results = []
    const errors = []
    
    for (const data of distributionData) {
      try {
        const distribution = await prisma.distribution.create({
          data: {
            investmentId: data.investmentId,
            amount: parseFloat(data.amount),
            type: data.type,
            date: new Date(data.date),
            notes: data.notes
          },
          include: {
            investment: {
              include: {
                investor: { select: { id: true, firstName: true, lastName: true } },
                project: { select: { id: true, name: true } }
              }
            }
          }
        })
        
        if (sendNotifications) {
          await notificationService.notifyDistributionSent(distribution)
        }
        
        results.push(distribution)
      } catch (error) {
        errors.push({
          data,
          error: error.message
        })
      }
    }
    
    res.status(201).json({
      created: results.length,
      failed: errors.length,
      distributions: results,
      errors
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/distributions/:id - Get single distribution
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const distribution = await prisma.distribution.findUnique({
      where: { id: req.params.id },
      include: {
        investment: {
          include: {
            investor: { select: { id: true, firstName: true, lastName: true, email: true } },
            project: true
          }
        }
      }
    })
    
    if (!distribution) {
      return res.status(404).json({ error: 'Distribution not found' })
    }
    
    res.json({ distribution })
  } catch (error) {
    next(error)
  }
})

// PUT /api/distributions/:id - Update a distribution
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { amount, type, date, notes } = req.body
    
    const distribution = await prisma.distribution.update({
      where: { id: req.params.id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        type,
        date: date ? new Date(date) : undefined,
        notes
      },
      include: {
        investment: {
          include: {
            investor: { select: { id: true, firstName: true, lastName: true } },
            project: { select: { id: true, name: true } }
          }
        }
      }
    })
    
    res.json({ distribution })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/distributions/:id - Delete a distribution
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.distribution.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Distribution deleted' })
  } catch (error) {
    next(error)
  }
})

// POST /api/distributions/project/:projectId/distribute - Distribute to all investors in a project
router.post('/project/:projectId/distribute', authMiddleware, async (req, res, next) => {
  try {
    const { type, date, notes, distributionType = 'PROPORTIONAL' } = req.body
    let { totalAmount, percentOfInvestment } = req.body
    
    // Get all investments for this project
    const investments = await prisma.investment.findMany({
      where: { 
        projectId: req.params.projectId,
        status: { in: ['FUNDED', 'ACTIVE', 'DISTRIBUTING'] }
      },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { name: true } }
      }
    })
    
    if (investments.length === 0) {
      return res.status(400).json({ error: 'No active investments found for this project' })
    }
    
    const totalProjectInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
    
    const distributions = []
    
    for (const investment of investments) {
      let amount
      
      if (distributionType === 'PROPORTIONAL' && totalAmount) {
        // Distribute proportionally based on investment amount
        amount = (investment.amount / totalProjectInvestment) * parseFloat(totalAmount)
      } else if (distributionType === 'PERCENTAGE' && percentOfInvestment) {
        // Distribute a percentage of each investment
        amount = investment.amount * (parseFloat(percentOfInvestment) / 100)
      } else if (distributionType === 'EQUAL' && totalAmount) {
        // Split equally among all investors
        amount = parseFloat(totalAmount) / investments.length
      } else {
        return res.status(400).json({ 
          error: 'Invalid distribution configuration. Provide totalAmount or percentOfInvestment.' 
        })
      }
      
      const distribution = await prisma.distribution.create({
        data: {
          investmentId: investment.id,
          amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
          type,
          date: new Date(date),
          notes
        }
      })
      
      // Send notification
      await notificationService.notifyDistributionSent({
        ...distribution,
        investment
      })
      
      distributions.push({
        distribution,
        investor: investment.investor,
        investmentAmount: investment.amount,
        distributionAmount: distribution.amount
      })
    }
    
    res.status(201).json({
      message: `Created ${distributions.length} distributions`,
      totalDistributed: distributions.reduce((sum, d) => sum + d.distributionAmount, 0),
      distributions
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
