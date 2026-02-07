import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  
  const isAuthenticated = computed(() => !!user.value)
  
  async function checkAuth() {
    loading.value = true
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
    } catch (error) {
      user.value = null
    } finally {
      loading.value = false
    }
  }
  
  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    user.value = response.data.user
    return response.data
  }
  
  async function register(email, name, password) {
    const response = await api.post('/auth/register', { email, name, password })
    user.value = response.data.user
    return response.data
  }
  
  async function logout() {
    await api.post('/auth/logout')
    user.value = null
  }
  
  // Check auth on store init
  checkAuth()
  
  return {
    user,
    loading,
    isAuthenticated,
    checkAuth,
    login,
    register,
    logout,
  }
})
