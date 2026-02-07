const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads')

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, images, Word, Excel'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// GET /api/documents - List all documents with filters
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category,
      investorId,
      projectId,
      search
    } = req.query
    
    const where = {}
    
    if (category && category !== 'undefined' && category.trim()) {
      where.category = category
    }
    
    if (investorId && investorId !== 'undefined' && investorId.trim()) {
      where.investorId = investorId
    }
    
    if (projectId && projectId !== 'undefined' && projectId.trim()) {
      where.projectId = projectId
    }
    
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { originalName: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          investor: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          project: {
            select: { id: true, name: true }
          },
          investment: {
            select: { id: true, amount: true }
          },
          uploadedBy: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.document.count({ where })
    ])
    
    res.json({
      data: documents,
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

// POST /api/documents/upload - Upload a document
router.post('/upload', authMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const { 
      name,
      description,
      category,
      isPublic = false,
      investorId,
      projectId,
      investmentId
    } = req.body
    
    const document = await prisma.document.create({
      data: {
        name: name || req.file.originalname,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.filename,
        category: category || 'OTHER',
        isPublic: isPublic === 'true' || isPublic === true,
        description,
        investorId: investorId || null,
        projectId: projectId || null,
        investmentId: investmentId || null,
        uploadedById: req.session.userId
      },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, name: true } }
      }
    })
    
    // If investor document, create notification
    if (investorId) {
      await prisma.notification.create({
        data: {
          investorId,
          type: 'DOCUMENT_AVAILABLE',
          title: 'New Document Available',
          message: `A new document "${document.name}" has been uploaded for you.`,
          documentId: document.id
        }
      })
    }
    
    res.status(201).json({ document })
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    next(error)
  }
})

// GET /api/documents/:id - Get document details
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true, email: true } },
        project: { select: { id: true, name: true } },
        investment: { select: { id: true, amount: true, type: true } },
        uploadedBy: { select: { id: true, name: true } }
      }
    })
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
    
    res.json({ document })
  } catch (error) {
    next(error)
  }
})

// PUT /api/documents/:id - Update document metadata
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name, description, category, isPublic } = req.body
    
    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        category,
        isPublic
      },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } }
      }
    })
    
    res.json({ document })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
    
    // Delete file from disk
    const filePath = path.join(uploadDir, document.path)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    await prisma.document.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Document deleted' })
  } catch (error) {
    next(error)
  }
})

// GET /api/documents/:id/download - Download a document
router.get('/:id/download', authMiddleware, async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
    
    const filePath = path.join(uploadDir, document.path)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' })
    }
    
    res.download(filePath, document.originalName)
  } catch (error) {
    next(error)
  }
})

// POST /api/documents/bulk-assign - Assign document to multiple investors
router.post('/bulk-assign', authMiddleware, async (req, res, next) => {
  try {
    const { documentId, investorIds } = req.body
    
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    })
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }
    
    // Create copies for each investor
    const copies = await Promise.all(
      investorIds.map(async (investorId) => {
        // Create notification
        await prisma.notification.create({
          data: {
            investorId,
            type: 'DOCUMENT_AVAILABLE',
            title: 'New Document Available',
            message: `A new document "${document.name}" has been shared with you.`,
            documentId: document.id
          }
        })
        
        // Create document copy linked to investor
        return prisma.document.create({
          data: {
            name: document.name,
            originalName: document.originalName,
            mimeType: document.mimeType,
            size: document.size,
            path: document.path, // Share same file
            category: document.category,
            isPublic: false,
            description: document.description,
            investorId,
            projectId: document.projectId,
            uploadedById: req.session.userId
          }
        })
      })
    )
    
    res.json({ 
      message: `Document shared with ${copies.length} investors`,
      copies 
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
