import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchDashboard() {
    loading.value = true
    error.value = null
    
    try {
      data.value = await api.get('/dashboard')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    error,
    fetchDashboard
  }
})

export const useInvestmentsStore = defineStore('investments', () => {
  const investments = ref([])
  const currentInvestment = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchInvestments() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.get('/investments')
      investments.value = data.investments
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function fetchInvestment(id) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.get(`/investments/${id}`)
      currentInvestment.value = data.investment
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    investments,
    currentInvestment,
    loading,
    error,
    fetchInvestments,
    fetchInvestment
  }
})

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchDocuments(category = null) {
    loading.value = true
    error.value = null
    
    try {
      const params = category ? { category } : {}
      const data = await api.get('/documents', { params })
      documents.value = data.documents
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    documents,
    loading,
    error,
    fetchDocuments
  }
})

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  
  async function fetchNotifications() {
    loading.value = true
    
    try {
      const data = await api.get('/notifications')
      notifications.value = data.notifications
      unreadCount.value = notifications.value.filter(n => !n.read).length
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }
  
  async function markAllAsRead() {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => n.read = true)
      unreadCount.value = 0
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }
  
  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
})

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchMessages() {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.get('/messages')
      messages.value = data.messages
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function sendMessage(subject, message) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.post('/messages', { subject, message })
      messages.value.unshift(data.message)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage
  }
})
