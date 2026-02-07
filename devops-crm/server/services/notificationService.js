const prisma = require('../config/database')

/**
 * Notification Service
 * Handles creating and sending notifications to investors from CRM actions
 */

class NotificationService {
  /**
   * Send a notification to an investor
   */
  async notify(investorId, { type, title, message, link, projectId, investmentId, documentId }) {
    try {
      const notification = await prisma.notification.create({
        data: {
          investorId,
          type,
          title,
          message,
          link,
          projectId,
          investmentId,
          documentId
        }
      })
      
      // In production, also send email/SMS here
      // await this.sendEmail(investorId, { type, title, message })
      
      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }
  
  /**
   * Notify investor of new investment
   */
  async notifyInvestmentCreated(investment) {
    const project = await prisma.project.findUnique({
      where: { id: investment.projectId },
      select: { name: true }
    })
    
    return this.notify(investment.investorId, {
      type: 'INVESTMENT_STATUS',
      title: 'New Investment Recorded',
      message: `Your investment of $${investment.amount.toLocaleString()} in "${project?.name || 'a project'}" has been recorded.`,
      investmentId: investment.id,
      projectId: investment.projectId
    })
  }
  
  /**
   * Notify investor of investment status change
   */
  async notifyInvestmentStatusChange(investment, oldStatus, newStatus) {
    const project = await prisma.project.findUnique({
      where: { id: investment.projectId },
      select: { name: true }
    })
    
    const statusMessages = {
      FUNDED: 'Your investment has been funded. Thank you!',
      ACTIVE: 'Your investment is now active.',
      DISTRIBUTING: 'Distributions are being processed for your investment.',
      CLOSED: 'Your investment has been fully closed and returned.',
    }
    
    return this.notify(investment.investorId, {
      type: 'INVESTMENT_STATUS',
      title: `Investment Status: ${newStatus}`,
      message: statusMessages[newStatus] || `Your investment in "${project?.name}" status changed to ${newStatus}.`,
      investmentId: investment.id,
      projectId: investment.projectId
    })
  }
  
  /**
   * Notify investor of pending distribution
   */
  async notifyDistributionPending(distribution) {
    const investment = await prisma.investment.findUnique({
      where: { id: distribution.investmentId },
      include: { project: { select: { name: true } } }
    })
    
    return this.notify(investment.investorId, {
      type: 'DISTRIBUTION_PENDING',
      title: 'Distribution Coming Soon',
      message: `A distribution of $${distribution.amount.toLocaleString()} is being prepared for your investment in "${investment.project?.name}".`,
      investmentId: distribution.investmentId,
      projectId: investment.projectId
    })
  }
  
  /**
   * Notify investor of sent distribution
   */
  async notifyDistributionSent(distribution) {
    const investment = await prisma.investment.findUnique({
      where: { id: distribution.investmentId },
      include: { project: { select: { name: true } } }
    })
    
    const typeLabels = {
      RETURN_OF_CAPITAL: 'return of capital',
      PROFIT_DISTRIBUTION: 'profit distribution',
      INTEREST_PAYMENT: 'interest payment',
      FINAL_DISTRIBUTION: 'final distribution'
    }
    
    return this.notify(investment.investorId, {
      type: 'DISTRIBUTION_SENT',
      title: 'Distribution Sent',
      message: `A ${typeLabels[distribution.type] || 'distribution'} of $${distribution.amount.toLocaleString()} has been sent for your investment in "${investment.project?.name}".`,
      investmentId: distribution.investmentId,
      projectId: investment.projectId
    })
  }
  
  /**
   * Notify investor of project update
   */
  async notifyProjectUpdate(project, updateMessage) {
    // Get all investors in this project
    const investments = await prisma.investment.findMany({
      where: { projectId: project.id },
      select: { investorId: true }
    })
    
    const uniqueInvestorIds = [...new Set(investments.map(i => i.investorId))]
    
    return Promise.all(
      uniqueInvestorIds.map(investorId => 
        this.notify(investorId, {
          type: 'PROJECT_UPDATE',
          title: `Update: ${project.name}`,
          message: updateMessage,
          projectId: project.id
        })
      )
    )
  }
  
  /**
   * Notify investor of tax documents
   */
  async notifyTaxDocumentReady(investorId, year, documentId) {
    return this.notify(investorId, {
      type: 'TAX_DOCUMENT_READY',
      title: `${year} Tax Documents Ready`,
      message: `Your K-1 and tax documents for ${year} are now available in your portal.`,
      documentId
    })
  }
  
  /**
   * Notify all investors in a project
   */
  async notifyProjectInvestors(projectId, { type, title, message }) {
    const investments = await prisma.investment.findMany({
      where: { projectId },
      select: { investorId: true }
    })
    
    const uniqueInvestorIds = [...new Set(investments.map(i => i.investorId))]
    
    return Promise.all(
      uniqueInvestorIds.map(investorId =>
        this.notify(investorId, { type, title, message, projectId })
      )
    )
  }
  
  /**
   * Get unread notification count for an investor
   */
  async getUnreadCount(investorId) {
    return prisma.notification.count({
      where: { investorId, read: false }
    })
  }
  
  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, investorId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, investorId },
      data: { read: true, readAt: new Date() }
    })
  }
  
  /**
   * Mark all notifications as read for an investor
   */
  async markAllAsRead(investorId) {
    return prisma.notification.updateMany({
      where: { investorId, read: false },
      data: { read: true, readAt: new Date() }
    })
  }
}

module.exports = new NotificationService()
