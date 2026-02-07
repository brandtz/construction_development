const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/vendors - List all vendors
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category,
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
        { accountNumber: { contains: search } },
      ]
    }
    
    // Only add category filter if valid
    if (category && category !== 'undefined' && category.trim()) {
      where.category = category
    }
    
    // Only add status filter if valid
    if (status && status !== 'undefined' && status.trim()) {
      where.status = status
    }
    
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { projects: true } }
        }
      }),
      prisma.vendor.count({ where }),
    ])
    
    res.json({
      data: vendors,
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

// GET /api/vendors/:id - Get single vendor with projects
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: {
        projects: {
          include: {
            project: true
          },
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            createdBy: { select: { id: true, name: true } }
          }
        },
      },
    })
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' })
    }
    
    res.json(vendor)
  } catch (error) {
    next(error)
  }
})

// POST /api/vendors - Create vendor
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      category,
      email,
      phone,
      website,
      address,
      city,
      state,
      zip,
      accountNumber,
      creditLimit,
      currentBalance,
      paymentTerms,
      taxExempt,
      taxId,
      portalUrl,
      portalUsername,
      status,
      notes,
    } = req.body
    
    if (!companyName || !category) {
      return res.status(400).json({ error: 'Company name and category are required' })
    }
    
    const vendor = await prisma.vendor.create({
      data: {
        companyName,
        contactName,
        category,
        email,
        phone,
        website,
        address,
        city,
        state: state || 'OR',
        zip,
        accountNumber,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        currentBalance: currentBalance ? parseFloat(currentBalance) : null,
        paymentTerms,
        taxExempt: taxExempt || false,
        taxId,
        portalUrl,
        portalUsername,
        status: status || 'ACTIVE',
        notes,
      },
    })
    
    res.status(201).json(vendor)
  } catch (error) {
    next(error)
  }
})

// PUT /api/vendors/:id - Update vendor
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const {
      companyName,
      contactName,
      category,
      email,
      phone,
      website,
      address,
      city,
      state,
      zip,
      accountNumber,
      creditLimit,
      currentBalance,
      paymentTerms,
      taxExempt,
      taxId,
      portalUrl,
      portalUsername,
      status,
      notes,
    } = req.body
    
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: {
        companyName,
        contactName,
        category,
        email,
        phone,
        website,
        address,
        city,
        state,
        zip,
        accountNumber,
        creditLimit: creditLimit !== undefined ? (creditLimit ? parseFloat(creditLimit) : null) : undefined,
        currentBalance: currentBalance !== undefined ? (currentBalance ? parseFloat(currentBalance) : null) : undefined,
        paymentTerms,
        taxExempt,
        taxId,
        portalUrl,
        portalUsername,
        status,
        notes,
      },
      include: {
        projects: {
          include: { project: true }
        }
      }
    })
    
    res.json(vendor)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/vendors/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.vendor.delete({
      where: { id: req.params.id },
    })
    
    res.json({ message: 'Vendor deleted' })
  } catch (error) {
    next(error)
  }
})

// ============================================================================
// VENDOR-PROJECT ASSOCIATIONS
// ============================================================================

// GET /api/vendors/:id/projects - Get projects for this vendor
router.get('/:id/projects', authMiddleware, async (req, res, next) => {
  try {
    const projectVendors = await prisma.projectVendor.findMany({
      where: { vendorId: req.params.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(projectVendors.map(pv => ({
      ...pv.project,
      role: pv.role,
      assignedAt: pv.createdAt
    })))
  } catch (error) {
    next(error)
  }
})

// POST /api/vendors/:id/projects - Add vendor to a project
router.post('/:id/projects', authMiddleware, async (req, res, next) => {
  try {
    const { projectId, role } = req.body
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' })
    }
    
    const projectVendor = await prisma.projectVendor.create({
      data: {
        vendorId: req.params.id,
        projectId,
        role
      },
      include: { project: true }
    })
    
    res.status(201).json(projectVendor)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Vendor already assigned to this project' })
    }
    next(error)
  }
})

// DELETE /api/vendors/:id/projects/:projectId - Remove vendor from project
router.delete('/:id/projects/:projectId', authMiddleware, async (req, res, next) => {
  try {
    await prisma.projectVendor.deleteMany({
      where: {
        vendorId: req.params.id,
        projectId: req.params.projectId
      }
    })
    
    res.json({ message: 'Vendor removed from project' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
