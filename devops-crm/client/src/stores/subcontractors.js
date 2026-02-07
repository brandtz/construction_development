import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useSubcontractorsStore = defineStore('subcontractors', () => {
  const subcontractors = ref([])
  const currentSubcontractor = ref(null)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const loading = ref(false)
  const error = ref(null)
  const expiring = ref([])
  
  async function fetchSubcontractors(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/subcontractors', { params })
      subcontractors.value = response.data.data
      pagination.value = response.data.pagination
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load subcontractors'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchSubcontractor(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/subcontractors/${id}`)
      currentSubcontractor.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to load subcontractor'
    } finally {
      loading.value = false
    }
  }
  
  async function fetchExpiring() {
    try {
      const response = await api.get('/subcontractors/expiring')
      expiring.value = response.data
    } catch (err) {
      console.error('Failed to load expiring:', err)
    }
  }
  
  async function createSubcontractor(data) {
    const response = await api.post('/subcontractors', data)
    subcontractors.value.unshift(response.data)
    return response.data
  }
  
  async function updateSubcontractor(id, data) {
    const response = await api.put(`/subcontractors/${id}`, data)
    const index = subcontractors.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subcontractors.value[index] = response.data
    }
    if (currentSubcontractor.value?.id === id) {
      currentSubcontractor.value = response.data
    }
    return response.data
  }
  
  async function deleteSubcontractor(id) {
    await api.delete(`/subcontractors/${id}`)
    subcontractors.value = subcontractors.value.filter(s => s.id !== id)
  }
  
  return {
    subcontractors,
    currentSubcontractor,
    pagination,
    loading,
    error,
    expiring,
    fetchSubcontractors,
    fetchSubcontractor,
    fetchExpiring,
    createSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
  }
})
