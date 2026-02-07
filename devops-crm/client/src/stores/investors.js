import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useInvestorsStore = defineStore('investors', () => {
  const investors = ref([])
  const currentInvestor = ref(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const loading = ref(false)
  const error = ref(null)
  const stats = ref(null)
  
  async function fetchInvestors(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/investors', { params })
      investors.value = response.data.data
      pagination.value = response.data.pagination
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load investors'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchInvestor(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/investors/${id}`)
      currentInvestor.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load investor'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStats() {
    try {
      const response = await api.get('/investors/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Failed to load investor stats:', err)
    }
  }
  
  async function createInvestor(data) {
    const response = await api.post('/investors', data)
    investors.value.unshift(response.data)
    return response.data
  }
  
  async function updateInvestor(id, data) {
    const response = await api.put(`/investors/${id}`, data)
    const index = investors.value.findIndex(i => i.id === id)
    if (index !== -1) {
      investors.value[index] = response.data
    }
    if (currentInvestor.value?.id === id) {
      currentInvestor.value = response.data
    }
    return response.data
  }
  
  async function deleteInvestor(id) {
    await api.delete(`/investors/${id}`)
    investors.value = investors.value.filter(i => i.id !== id)
  }
  
  async function addActivity(investorId, data) {
    const response = await api.post(`/investors/${investorId}/activities`, data)
    if (currentInvestor.value?.id === investorId) {
      currentInvestor.value.activities.unshift(response.data)
    }
    return response.data
  }
  
  return {
    investors,
    currentInvestor,
    pagination,
    loading,
    error,
    stats,
    fetchInvestors,
    fetchInvestor,
    fetchStats,
    createInvestor,
    updateInvestor,
    deleteInvestor,
    addActivity,
  }
})
