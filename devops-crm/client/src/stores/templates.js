import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTemplatesStore = defineStore('templates', {
  state: () => ({
    templates: [],
    currentTemplate: null,
    categories: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchTemplates(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        if (filters.category) params.append('category', filters.category)
        if (filters.search) params.append('search', filters.search)
        if (filters.active !== undefined) params.append('active', filters.active)
        
        const response = await api.get(`/templates?${params}`)
        this.templates = response.data.templates
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch templates'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchTemplate(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/templates/${id}`)
        this.currentTemplate = response.data.template
        return this.currentTemplate
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch template'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      try {
        const response = await api.get('/templates/categories')
        this.categories = response.data.categories
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },
    
    async createTemplate(data) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/templates', data)
        this.templates.unshift(response.data.template)
        return response.data.template
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create template'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateTemplate(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/templates/${id}`, data)
        const index = this.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          this.templates[index] = response.data.template
        }
        this.currentTemplate = response.data.template
        return response.data.template
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update template'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteTemplate(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/templates/${id}`)
        this.templates = this.templates.filter(t => t.id !== id)
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete template'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async duplicateTemplate(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(`/templates/${id}/duplicate`)
        this.templates.unshift(response.data.template)
        return response.data.template
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to duplicate template'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async renderTemplate(id, variables) {
      try {
        const response = await api.post(`/templates/${id}/render`, { variables })
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    async extractVariables(id) {
      try {
        const response = await api.get(`/templates/${id}/variables`)
        return response.data.variables
      } catch (error) {
        throw error
      }
    }
  }
})
