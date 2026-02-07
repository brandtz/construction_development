const express = require('express')
const prisma = require('../config/database')

const router = express.Router()

// POST /api/webhooks/netlify-form - Handle Netlify form submissions
// This allows the investor portal contact form to create leads in the CRM
router.post('/netlify-form', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      first_name, // Netlify may use different field names
      last_name,
      email,
      phone,
      company,
      investmentCapacity,
      investment_capacity,
      message,
      source,
      form_name,
    } = req.body
    
    // Determine which form was submitted
    const formName = form_name || 'contact'
    
    // Handle investor inquiry form
    if (formName === 'investor-inquiry' || formName === 'contact') {
      const investorData = {
        firstName: firstName || first_name || 'Unknown',
        lastName: lastName || last_name || 'Unknown',
        email: email || '',
        phone: phone || null,
        company: company || null,
        investmentCapacity: investmentCapacity || investment_capacity || null,
        status: 'LEAD',
        source: source || 'Website',
        notes: message ? `Initial inquiry: ${message}` : null,
      }
      
      // Check if investor already exists
      let investor = null
      if (email) {
        investor = await prisma.investor.findUnique({
          where: { email }
        })
      }
      
      if (investor) {
        // Update existing investor with new inquiry
        await prisma.activity.create({
          data: {
            entityType: 'INVESTOR',
            entityId: investor.id,
            investorId: investor.id,
            type: 'NOTE',
            subject: 'New website inquiry',
            description: message || 'Submitted contact form on website',
          }
        })
      } else {
        // Create new investor
        investor = await prisma.investor.create({
          data: investorData
        })
        
        // Log the creation as an activity
        await prisma.activity.create({
          data: {
            entityType: 'INVESTOR',
            entityId: investor.id,
            investorId: investor.id,
            type: 'NOTE',
            subject: 'Lead created from website',
            description: `New investor lead from ${source || 'website contact form'}`,
          }
        })
      }
      
      res.json({ success: true, message: 'Lead processed', investorId: investor.id })
    } else {
      // Unknown form type - just log it
      console.log('Unknown form submission:', req.body)
      res.json({ success: true, message: 'Form received' })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    // Still return success to Netlify to prevent retries
    res.json({ success: true, message: 'Processed with errors' })
  }
})

// POST /api/webhooks/test - Test webhook endpoint
router.post('/test', (req, res) => {
  console.log('Test webhook received:', req.body)
  res.json({ success: true, received: req.body })
})

module.exports = router
