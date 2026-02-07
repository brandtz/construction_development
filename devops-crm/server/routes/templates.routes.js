const express = require('express')
const prisma = require('../config/database')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/templates - List all templates
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { category, search, active } = req.query
    
    const where = {}
    
    if (category && category !== 'undefined' && category.trim()) {
      where.category = category
    }
    
    if (active !== undefined && active !== 'undefined') {
      where.isActive = active === 'true'
    }
    
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    const templates = await prisma.documentTemplate.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
    
    res.json({ templates })
  } catch (error) {
    next(error)
  }
})

// GET /api/templates/categories - Get available categories
router.get('/categories', authMiddleware, (req, res) => {
  const categories = [
    { value: 'INVESTOR_PACKET', label: 'Investor Packet' },
    { value: 'SUBSCRIPTION_AGREEMENT', label: 'Subscription Agreement' },
    { value: 'OPERATING_AGREEMENT', label: 'Operating Agreement' },
    { value: 'PPM', label: 'Private Placement Memorandum' },
    { value: 'WELCOME_LETTER', label: 'Welcome Letter' },
    { value: 'TAX_DOCUMENT', label: 'Tax Document' },
    { value: 'DISTRIBUTION_NOTICE', label: 'Distribution Notice' },
    { value: 'PROJECT_UPDATE', label: 'Project Update' },
    { value: 'GENERAL', label: 'General' },
  ]
  res.json({ categories })
})

// GET /api/templates/:id - Get single template
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const template = await prisma.documentTemplate.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }
    
    res.json({ template })
  } catch (error) {
    next(error)
  }
})

// POST /api/templates - Create new template
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, description, category, content, variables } = req.body
    
    if (!name || !category || !content) {
      return res.status(400).json({ error: 'Name, category, and content are required' })
    }
    
    const template = await prisma.documentTemplate.create({
      data: {
        name,
        description: description || null,
        category,
        content,
        variables: variables ? JSON.stringify(variables) : null,
        createdById: req.user.id
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    res.status(201).json({ template })
  } catch (error) {
    next(error)
  }
})

// PUT /api/templates/:id - Update template
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name, description, category, content, variables, isActive } = req.body
    
    const existing = await prisma.documentTemplate.findUnique({
      where: { id: req.params.id }
    })
    
    if (!existing) {
      return res.status(404).json({ error: 'Template not found' })
    }
    
    const template = await prisma.documentTemplate.update({
      where: { id: req.params.id },
      data: {
        name: name !== undefined ? name : existing.name,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        content: content !== undefined ? content : existing.content,
        variables: variables !== undefined ? JSON.stringify(variables) : existing.variables,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        version: content !== existing.content ? existing.version + 1 : existing.version
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    res.json({ template })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/templates/:id - Delete template
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.documentTemplate.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Template deleted' })
  } catch (error) {
    next(error)
  }
})

// POST /api/templates/:id/duplicate - Duplicate a template
router.post('/:id/duplicate', authMiddleware, async (req, res, next) => {
  try {
    const original = await prisma.documentTemplate.findUnique({
      where: { id: req.params.id }
    })
    
    if (!original) {
      return res.status(404).json({ error: 'Template not found' })
    }
    
    const template = await prisma.documentTemplate.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        category: original.category,
        content: original.content,
        variables: original.variables,
        createdById: req.user.id
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    })
    
    res.status(201).json({ template })
  } catch (error) {
    next(error)
  }
})

// POST /api/templates/:id/render - Render template with variables
router.post('/:id/render', authMiddleware, async (req, res, next) => {
  try {
    const { variables } = req.body
    
    const template = await prisma.documentTemplate.findUnique({
      where: { id: req.params.id }
    })
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }
    
    let renderedContent = template.content
    
    // Replace variables in template
    if (variables && typeof variables === 'object') {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
        renderedContent = renderedContent.replace(regex, value || '')
      })
    }
    
    res.json({ 
      renderedContent,
      templateName: template.name 
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/templates/:id/variables - Extract variables from template
router.get('/:id/variables', authMiddleware, async (req, res, next) => {
  try {
    const template = await prisma.documentTemplate.findUnique({
      where: { id: req.params.id }
    })
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }
    
    // Extract variables from content using regex
    const variableRegex = /\{\{\s*([^}]+)\s*\}\}/g
    const matches = [...template.content.matchAll(variableRegex)]
    const variables = [...new Set(matches.map(m => m[1].trim()))]
    
    res.json({ variables })
  } catch (error) {
    next(error)
  }
})

module.exports = router
