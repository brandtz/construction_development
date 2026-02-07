const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/activities - Get all activities (global feed)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      entityType,
      type,
    } = req.query
    
    const where = {}
    
    if (entityType) {
      where.entityType = entityType
    }
    
    if (type) {
      where.type = type
    }
    
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
          investor: { select: { id: true, firstName: true, lastName: true } },
          project: { select: { id: true, name: true } },
          subcontractor: { select: { id: true, companyName: true } },
          buyer: { select: { id: true, firstName: true, lastName: true } },
          vendor: { select: { id: true, companyName: true } },
        },
      }),
      prisma.activity.count({ where }),
    ])
    
    res.json({
      data: activities,
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

// PUT /api/activities/:id - Update activity
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { subject, description, dueDate, completed } = req.body
    
    const updateData = {}
    if (subject !== undefined) updateData.subject = subject
    if (description !== undefined) updateData.description = description
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (completed !== undefined) {
      updateData.completed = completed
      updateData.completedAt = completed ? new Date() : null
    }
    
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    })
    
    res.json(activity)
  } catch (error) {
    next(error)
  }
})

// PUT /api/activities/:id/complete - Mark task complete
router.put('/:id/complete', authMiddleware, async (req, res, next) => {
  try {
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })
    
    res.json(activity)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.activity.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Activity deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
