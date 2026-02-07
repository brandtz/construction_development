const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const errorHandler = require('./middleware/errorHandler')

// Import routes
const authRoutes = require('./routes/auth.routes')
const investorsRoutes = require('./routes/investors.routes')
const subcontractorsRoutes = require('./routes/subcontractors.routes')
const projectsRoutes = require('./routes/projects.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const activitiesRoutes = require('./routes/activities.routes')
const buyersRoutes = require('./routes/buyers.routes')
const vendorsRoutes = require('./routes/vendors.routes')
const landLeadsRoutes = require('./routes/landLeads.routes')
const webhooksRoutes = require('./routes/webhooks.routes')
const investorPortalRoutes = require('./routes/investor-portal.routes')
const documentsRoutes = require('./routes/documents.routes')
const distributionsRoutes = require('./routes/distributions.routes')
const templatesRoutes = require('./routes/templates.routes')

const app = express()

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174', // Investor Portal
    'http://localhost:5175'  // Marketing Site
  ],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes - CRM (Admin)
app.use('/api/auth', authRoutes)
app.use('/api/investors', investorsRoutes)
app.use('/api/subcontractors', subcontractorsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/buyers', buyersRoutes)
app.use('/api/vendors', vendorsRoutes)
app.use('/api/land-leads', landLeadsRoutes)
app.use('/api/webhooks', webhooksRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/distributions', distributionsRoutes)
app.use('/api/templates', templatesRoutes)

// API Routes - Investor Portal
app.use('/api/investor', investorPortalRoutes)

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 DevOps CRM API running on port ${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
