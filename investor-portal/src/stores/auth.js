import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const investor = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const isAuthenticated = computed(() => !!investor.value)
  const fullName = computed(() => 
    investor.value ? `${investor.value.firstName} ${investor.value.lastName}` : ''
  )
  
  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const data = await api.post('/login', { email, password })
      investor.value = data.investor
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function register(email, password) {
    loading.value = true
    error.value = null
    
    try {
      await api.post('/register', { email, password })
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      investor.value = null
    }
  }
  
  async function checkAuth() {
    try {
      const data = await api.get('/me')
      investor.value = data.investor
    } catch {
      investor.value = null
    }
  }
  
  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    
    try {
      await api.post('/forgot-password', { email })
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function updateProfile(data) {
    loading.value = true
    error.value = null
    
    try {
      const result = await api.put('/profile', data)
      // Update investor with new profile data
      if (investor.value) {
        investor.value = { ...investor.value, ...result }
      }
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function changePassword(currentPassword, newPassword) {
    loading.value = true
    error.value = null
    
    try {
      await api.put('/password', { currentPassword, newPassword })
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    investor,
    loading,
    error,
    isAuthenticated,
    fullName,
    login,
    register,
    logout,
    checkAuth,
    forgotPassword,
    updateProfile,
    changePassword
  }
})
