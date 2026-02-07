const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/projects - List all projects
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    const where = {}
    
    // Only add search filter if it's a valid non-empty string
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
      ]
    }
    
    // Only add status filter if valid
    if (status && status !== 'undefined' && status.trim()) {
      where.status = status
    }
    
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { investments: true, bids: true, buyers: true }
          }
        }
      }),
      prisma.project.count({ where }),
    ])
    
    res.json({
      data: projects,
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

// GET /api/projects/:id - Get single project
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        investments: {
          include: {
            investor: true,
          }
        },
        bids: {
          include: {
            subcontractor: true,
          }
        },
        buyers: true,
        landLeads: true,
        documents: true,
        vendors: {
          include: {
            vendor: true
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
      },
    })
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(project)
  } catch (error) {
    next(error)
  }
})

// POST /api/projects - Create project
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zip,
      landCost,
      buildBudget,
      targetSalePrice,
      status,
      startDate,
      targetEndDate,
      notes,
    } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' })
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        address,
        city,
        state: state || 'OR',
        zip,
        landCost: landCost ? parseFloat(landCost) : null,
        buildBudget: buildBudget ? parseFloat(buildBudget) : null,
        targetSalePrice: targetSalePrice ? parseFloat(targetSalePrice) : null,
        status: status || 'PLANNING',
        startDate: startDate ? new Date(startDate) : null,
        targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
        notes,
      },
    })
    
    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})

// PUT /api/projects/:id - Update project
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zip,
      landCost,
      buildBudget,
      targetSalePrice,
      actualSalePrice,
      status,
      startDate,
      targetEndDate,
      actualEndDate,
      notes,
    } = req.body
    
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        address,
        city,
        state,
        zip,
        landCost: landCost ? parseFloat(landCost) : null,
        buildBudget: buildBudget ? parseFloat(buildBudget) : null,
        targetSalePrice: targetSalePrice ? parseFloat(targetSalePrice) : null,
        actualSalePrice: actualSalePrice ? parseFloat(actualSalePrice) : null,
        status,
        startDate: startDate ? new Date(startDate) : null,
        targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
        actualEndDate: actualEndDate ? new Date(actualEndDate) : null,
        notes,
      },
    })
    
    res.json(project)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Project deleted' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// PROJECT VENDORS MANAGEMENT
// ============================================================================

// GET /api/projects/:id/vendors - Get vendors for a project
router.get('/:id/vendors', authMiddleware, async (req, res, next) => {
  try {
    const projectVendors = await prisma.projectVendor.findMany({
      where: { projectId: req.params.id },
      include: { vendor: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(projectVendors.map(pv => ({ ...pv.vendor, role: pv.role, projectVendorId: pv.id })))
  } catch (error) {
    next(error)
  }
})

// POST /api/projects/:id/vendors - Add vendor to project
router.post('/:id/vendors', authMiddleware, async (req, res, next) => {
  try {
    const { vendorId, role } = req.body
    if (!vendorId) {
      return res.status(400).json({ error: 'Vendor ID is required' })
    }
    
    const projectVendor = await prisma.projectVendor.create({
      data: {
        projectId: req.params.id,
        vendorId,
        role
      },
      include: { vendor: true }
    })
    
    res.status(201).json(projectVendor)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Vendor already assigned to this project' })
    }
    next(error)
  }
})

// DELETE /api/projects/:id/vendors/:vendorId - Remove vendor from project
router.delete('/:id/vendors/:vendorId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.projectVendor.deleteMany({
      where: {
        projectId: req.params.id,
        vendorId: req.params.vendorId
      }
    })
    res.json({ message: 'Vendor removed from project' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// PROJECT SUBCONTRACTORS MANAGEMENT
// ============================================================================

// GET /api/projects/:id/subcontractors - Get subcontractors for a project
router.get('/:id/subcontractors', authMiddleware, async (req, res, next) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { projectId: req.params.id },
      include: { subcontractor: true },
      orderBy: { createdAt: 'desc' }
    })
    // Return unique subcontractors with their bid info
    const subs = bids.map(bid => ({
      ...bid.subcontractor,
      bidId: bid.id,
      bidAmount: bid.amount,
      bidStatus: bid.status,
      bidScope: bid.scope
    }))
    res.json(subs)
  } catch (error) {
    next(error)
  }
})

// POST /api/projects/:id/subcontractors - Add subcontractor to project
router.post('/:id/subcontractors', authMiddleware, async (req, res, next) => {
  try {
    const { subcontractorId, scope } = req.body
    if (!subcontractorId) {
      return res.status(400).json({ error: 'Subcontractor ID is required' })
    }
    
    // Check if already assigned
    const existing = await prisma.bid.findFirst({
      where: { projectId: req.params.id, subcontractorId }
    })
    if (existing) {
      return res.status(400).json({ error: 'Subcontractor already assigned to this project' })
    }
    
    const sub = await prisma.subcontractor.findUnique({ where: { id: subcontractorId } })
    
    const bid = await prisma.bid.create({
      data: {
        projectId: req.params.id,
        subcontractorId,
        scope: scope || `${sub?.trade || 'General'} work - Direct assignment`,
        amount: 0,
        status: 'AWARDED'
      },
      include: { subcontractor: true }
    })
    
    res.status(201).json(bid)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/projects/:id/subcontractors/:subId - Remove subcontractor from project
router.delete('/:id/subcontractors/:subId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.bid.deleteMany({
      where: {
        projectId: req.params.id,
        subcontractorId: req.params.subId
      }
    })
    res.json({ message: 'Subcontractor removed from project' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// PROJECT BUYERS MANAGEMENT
// ============================================================================

// GET /api/projects/:id/buyers - Get buyers interested in project
router.get('/:id/buyers', authMiddleware, async (req, res, next) => {
  try {
    const buyers = await prisma.buyer.findMany({
      where: { interestedProjectId: req.params.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json(buyers)
  } catch (error) {
    next(error)
  }
})

// POST /api/projects/:id/buyers - Assign buyer to project
router.post('/:id/buyers', authMiddleware, async (req, res, next) => {
  try {
    const { buyerId } = req.body
    if (!buyerId) {
      return res.status(400).json({ error: 'Buyer ID is required' })
    }
    
    const buyer = await prisma.buyer.update({
      where: { id: buyerId },
      data: { interestedProjectId: req.params.id }
    })
    
    res.status(201).json(buyer)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/projects/:id/buyers/:buyerId - Remove buyer from project
router.delete('/:id/buyers/:buyerId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.buyer.update({
      where: { id: req.params.buyerId },
      data: { interestedProjectId: null }
    })
    res.json({ message: 'Buyer removed from project' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// PROJECT DOCUMENTS MANAGEMENT
// ============================================================================

// GET /api/projects/:id/documents - Get documents for project
router.get('/:id/documents', authMiddleware, async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { projectId: req.params.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json(documents)
  } catch (error) {
    next(error)
  }
})

// POST /api/projects/:id/documents - Assign existing document to project
router.post('/:id/documents', authMiddleware, async (req, res, next) => {
  try {
    const { documentId } = req.body
    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' })
    }
    
    const document = await prisma.document.update({
      where: { id: documentId },
      data: { projectId: req.params.id }
    })
    
    res.status(201).json(document)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/projects/:id/documents/:docId - Remove document from project
router.delete('/:id/documents/:docId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.document.update({
      where: { id: req.params.docId },
      data: { projectId: null }
    })
    res.json({ message: 'Document removed from project' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
