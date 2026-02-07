const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/land-leads - List all land leads
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status,
      zoning,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    const where = {}
    
    // Only add search filter if it's a valid non-empty string
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { address: { contains: search } },
        { city: { contains: search } },
        { ownerName: { contains: search } },
      ]
    }
    
    // Only add status filter if valid
    if (status && status !== 'undefined' && status.trim()) {
      where.status = status
    }
    
    // Only add zoning filter if valid
    if (zoning && zoning !== 'undefined' && zoning.trim()) {
      where.zoning = zoning
    }
    
    const [landLeads, total] = await Promise.all([
      prisma.landLead.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          project: { select: { id: true, name: true } },
        }
      }),
      prisma.landLead.count({ where }),
    ])
    
    res.json({
      data: landLeads,
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

// GET /api/land-leads/:id - Get single land lead
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const landLead = await prisma.landLead.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            createdBy: { select: { id: true, name: true } }
          }
        },
      },
    })
    
    if (!landLead) {
      return res.status(404).json({ error: 'Land lead not found' })
    }
    
    res.json(landLead)
  } catch (error) {
    next(error)
  }
})

// POST /api/land-leads - Create land lead
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      zip,
      parcelId,
      acreage,
      zoning,
      utilities,
      topography,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAddress,
      askingPrice,
      estimatedValue,
      pricePerAcre,
      source,
      status,
      projectId,
      notes,
    } = req.body
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }
    
    const landLead = await prisma.landLead.create({
      data: {
        address,
        city,
        state: state || 'OR',
        zip,
        parcelId,
        acreage: acreage ? parseFloat(acreage) : null,
        zoning,
        utilities,
        topography,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        askingPrice: askingPrice ? parseFloat(askingPrice) : null,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        pricePerAcre: pricePerAcre ? parseFloat(pricePerAcre) : null,
        source,
        status: status || 'NEW',
        projectId: projectId || null,
        notes,
      },
    })
    
    res.status(201).json(landLead)
  } catch (error) {
    next(error)
  }
})

// PUT /api/land-leads/:id - Update land lead
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      zip,
      parcelId,
      acreage,
      zoning,
      utilities,
      topography,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerAddress,
      askingPrice,
      estimatedValue,
      pricePerAcre,
      source,
      status,
      projectId,
      notes,
    } = req.body
    
    const landLead = await prisma.landLead.update({
      where: { id: req.params.id },
      data: {
        address,
        city,
        state,
        zip,
        parcelId,
        acreage: acreage ? parseFloat(acreage) : null,
        zoning,
        utilities,
        topography,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        askingPrice: askingPrice ? parseFloat(askingPrice) : null,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        pricePerAcre: pricePerAcre ? parseFloat(pricePerAcre) : null,
        source,
        status,
        projectId: projectId || null,
        notes,
      },
      include: {
        project: { select: { id: true, name: true } },
      }
    })
    
    res.json(landLead)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/land-leads/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.landLead.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Land lead deleted' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
