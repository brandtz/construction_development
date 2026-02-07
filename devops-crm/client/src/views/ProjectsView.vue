<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { PlusIcon } from '@heroicons/vue/24/outline'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/projects')
    projects.value = response.data.data
  } catch (err) {
    console.error('Failed to load projects:', err)
  } finally {
    loading.value = false
  }
})

const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

const getStatusColor = (status) => {
  const colors = {
    PLANNING: 'badge-gray',
    FUNDED: 'badge-green',
    LAND_SEARCH: 'badge-yellow',
    LAND_ACQUIRED: 'badge-yellow',
    PERMITTING: 'badge-yellow',
    CONSTRUCTION: 'badge-green',
    LISTED: 'badge-green',
    SOLD: 'badge-green',
    CLOSED: 'badge-gray',
  }
  return colors[status] || 'badge-gray'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Projects</h1>
      <button class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
        Add Project
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-12">Loading...</div>
    
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-heading font-bold text-lg">{{ project.name }}</h3>
          <span :class="['badge', getStatusColor(project.status)]">
            {{ project.status.replace('_', ' ') }}
          </span>
        </div>
        <p class="text-sm text-charcoal-400 mb-4">
          {{ project.address }}, {{ project.city }}, {{ project.state }}
        </p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-charcoal-400">Budget</p>
            <p class="font-medium">{{ formatCurrency(project.buildBudget) }}</p>
          </div>
          <div>
            <p class="text-charcoal-400">Target Sale</p>
            <p class="font-medium">{{ formatCurrency(project.targetSalePrice) }}</p>
          </div>
        </div>
      </RouterLink>
      
      <div v-if="!projects.length" class="col-span-full text-center py-8 text-charcoal-400">
        No projects yet
      </div>
    </div>
  </div>
</template>
