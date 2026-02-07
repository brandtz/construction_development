const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/dashboard/stats - Get KPI stats
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    // Investor pipeline value
    const investorPipeline = await prisma.investor.aggregate({
      _sum: { committedAmount: true },
      _count: { id: true },
      where: {
        status: { in: ['COMMITTED', 'FUNDED'] }
      }
    })
    
    // Active projects - using actual ProjectStatus enum values
    // Active = PLANNING, FUNDED, LAND_SEARCH, LAND_ACQUIRED, PERMITTING, CONSTRUCTION, LISTED
    const activeProjects = await prisma.project.count({
      where: {
        status: { in: ['PLANNING', 'FUNDED', 'LAND_SEARCH', 'LAND_ACQUIRED', 'PERMITTING', 'CONSTRUCTION', 'LISTED', 'UNDER_CONTRACT'] }
      }
    })
    
    // Total projects
    const totalProjects = await prisma.project.count()
    
    // Pending bids
    const pendingBids = await prisma.bid.count({
      where: {
        status: { in: ['RECEIVED', 'UNDER_REVIEW', 'SHORTLISTED'] }
      }
    })
    
    // Expiring licenses/COIs (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const expiringLicenses = await prisma.subcontractor.count({
      where: {
        OR: [
          { licenseExpiry: { lte: thirtyDaysFromNow, gte: new Date() } },
          { insuranceExpiry: { lte: thirtyDaysFromNow, gte: new Date() } },
        ],
        status: { not: 'BLACKLISTED' }
      }
    })
    
    // Land leads stats - using actual LandLeadStatus enum values
    // Active = NEW, RESEARCHING, CONTACTED, NEGOTIATING, UNDER_CONTRACT, DUE_DILIGENCE
    const landLeads = await prisma.landLead.groupBy({
      by: ['status'],
      _count: { id: true }
    })
    const totalLandLeads = landLeads.reduce((sum, l) => sum + l._count.id, 0)
    const activeLandLeads = landLeads
      .filter(l => ['NEW', 'RESEARCHING', 'CONTACTED', 'NEGOTIATING', 'UNDER_CONTRACT', 'DUE_DILIGENCE'].includes(l.status))
      .reduce((sum, l) => sum + l._count.id, 0)
    
    // Vendor stats - using actual VendorStatus enum values (ACTIVE, PREFERRED, INACTIVE)
    const vendors = await prisma.vendor.groupBy({
      by: ['status'],
      _count: { id: true }
    })
    const totalVendors = vendors.reduce((sum, v) => sum + v._count.id, 0)
    const activeVendors = vendors
      .filter(v => ['ACTIVE', 'PREFERRED'].includes(v.status))
      .reduce((sum, v) => sum + v._count.id, 0)
    
    // Subcontractor stats - using actual SubcontractorStatus enum values
    // Active = ACTIVE, PREFERRED, PROBATION
    const subcontractors = await prisma.subcontractor.groupBy({
      by: ['status'],
      _count: { id: true }
    })
    const totalSubcontractors = subcontractors.reduce((sum, s) => sum + s._count.id, 0)
    const activeSubcontractors = subcontractors
      .filter(s => ['ACTIVE', 'PREFERRED', 'PROBATION'].includes(s.status))
      .reduce((sum, s) => sum + s._count.id, 0)
    
    // Overdue tasks count
    const overdueTasks = await prisma.activity.count({
      where: {
        type: 'TASK',
        completed: false,
        dueDate: { lt: new Date() }
      }
    })
    
    // Upcoming tasks (next 7 days)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const upcomingTasks = await prisma.activity.count({
      where: {
        type: 'TASK',
        completed: false,
        dueDate: { gte: new Date(), lte: sevenDaysFromNow }
      }
    })
    
    res.json({
      investorPipelineValue: investorPipeline._sum.committedAmount || 0,
      investorCount: investorPipeline._count.id,
      activeProjects,
      totalProjects,
      pendingBids,
      expiringLicenses,
      totalLandLeads,
      activeLandLeads,
      totalVendors,
      activeVendors,
      totalSubcontractors,
      activeSubcontractors,
      overdueTasks,
      upcomingTasks,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/pipeline - Get investor pipeline by status
router.get('/pipeline', authMiddleware, async (req, res, next) => {
  try {
    const pipeline = await prisma.investor.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { committedAmount: true },
    })
    
    res.json(pipeline)
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/alerts - Get alerts (expirations, overdue tasks, etc.)
router.get('/alerts', authMiddleware, async (req, res, next) => {
  try {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    // Expiring licenses
    const expiringLicenses = await prisma.subcontractor.findMany({
      where: {
        licenseExpiry: { lte: thirtyDaysFromNow, gte: new Date() },
        status: { not: 'BLACKLISTED' }
      },
      select: {
        id: true,
        companyName: true,
        licenseExpiry: true,
      },
      orderBy: { licenseExpiry: 'asc' },
      take: 10,
    })
    
    // Expiring insurance
    const expiringInsurance = await prisma.subcontractor.findMany({
      where: {
        insuranceExpiry: { lte: thirtyDaysFromNow, gte: new Date() },
        status: { not: 'BLACKLISTED' }
      },
      select: {
        id: true,
        companyName: true,
        insuranceExpiry: true,
      },
      orderBy: { insuranceExpiry: 'asc' },
      take: 10,
    })
    
    // Overdue tasks with full entity info for linking
    const overdueTasks = await prisma.activity.findMany({
      where: {
        type: 'TASK',
        completed: false,
        dueDate: { lt: new Date() }
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        investor: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        landLead: { select: { id: true, address: true } },
        subcontractor: { select: { id: true, companyName: true } },
        buyer: { select: { id: true, firstName: true, lastName: true } },
        vendor: { select: { id: true, companyName: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    })
    
    // Recent land leads needing follow-up - using actual LandLeadStatus values
    const landLeadsNeedingFollowup = await prisma.landLead.findMany({
      where: {
        status: { in: ['NEW', 'RESEARCHING', 'CONTACTED', 'NEGOTIATING'] },
      },
      select: {
        id: true,
        address: true,
        city: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'asc' },
      take: 5,
    })
    
    // Projects needing attention - using actual ProjectStatus values
    // CANCELLED projects or projects that have been in certain status too long
    const projectsNeedingAttention = await prisma.project.findMany({
      where: {
        status: { in: ['CANCELLED'] }
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
      take: 5,
    })
    
    res.json({
      expiringLicenses,
      expiringInsurance,
      overdueTasks,
      landLeadsNeedingFollowup,
      projectsNeedingAttention,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/recent - Get recent activities
router.get('/recent', authMiddleware, async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        createdBy: {
          select: { id: true, name: true }
        },
        investor: {
          select: { id: true, firstName: true, lastName: true }
        },
        project: {
          select: { id: true, name: true }
        },
        landLead: {
          select: { id: true, address: true }
        },
        subcontractor: {
          select: { id: true, companyName: true }
        },
        buyer: {
          select: { id: true, firstName: true, lastName: true }
        },
        vendor: {
          select: { id: true, companyName: true }
        },
      },
    })
    
    res.json(activities)
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/tasks - Get upcoming tasks
router.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const tasks = await prisma.activity.findMany({
      where: {
        type: 'TASK',
        completed: false,
        dueDate: { lte: sevenDaysFromNow }
      },
      orderBy: { dueDate: 'asc' },
      take: 20,
      include: {
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        investor: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        landLead: { select: { id: true, address: true } },
        subcontractor: { select: { id: true, companyName: true } },
        buyer: { select: { id: true, firstName: true, lastName: true } },
        vendor: { select: { id: true, companyName: true } },
      },
    })
    
    res.json(tasks)
  } catch (error) {
    next(error)
  }
})

// GET /api/dashboard/projects-summary - Get project status breakdown
router.get('/projects-summary', authMiddleware, async (req, res, next) => {
  try {
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true }
    })
    
    const recentProjects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true,
      }
    })
    
    res.json({
      byStatus: projectsByStatus,
      recent: recentProjects,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
