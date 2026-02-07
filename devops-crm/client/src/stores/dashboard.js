import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref(null)
  const pipeline = ref([])
  const alerts = ref({
    expiringLicenses: [],
    expiringInsurance: [],
    overdueTasks: [],
  })
  const recentActivities = ref([])
  const tasks = ref([])
  const loading = ref(false)
  
  async function fetchStats() {
    try {
      const response = await api.get('/dashboard/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    }
  }
  
  async function fetchPipeline() {
    try {
      const response = await api.get('/dashboard/pipeline')
      pipeline.value = response.data
    } catch (err) {
      console.error('Failed to load pipeline:', err)
    }
  }
  
  async function fetchAlerts() {
    try {
      const response = await api.get('/dashboard/alerts')
      alerts.value = response.data
    } catch (err) {
      console.error('Failed to load alerts:', err)
    }
  }
  
  async function fetchRecentActivities() {
    try {
      const response = await api.get('/dashboard/recent')
      recentActivities.value = response.data
    } catch (err) {
      console.error('Failed to load recent activities:', err)
    }
  }
  
  async function fetchTasks() {
    try {
      const response = await api.get('/dashboard/tasks')
      tasks.value = response.data
    } catch (err) {
      console.error('Failed to load tasks:', err)
    }
  }
  
  async function loadDashboard() {
    loading.value = true
    await Promise.all([
      fetchStats(),
      fetchPipeline(),
      fetchAlerts(),
      fetchRecentActivities(),
      fetchTasks(),
    ])
    loading.value = false
  }
  
  return {
    stats,
    pipeline,
    alerts,
    recentActivities,
    tasks,
    loading,
    fetchStats,
    fetchPipeline,
    fetchAlerts,
    fetchRecentActivities,
    fetchTasks,
    loadDashboard,
  }
})
