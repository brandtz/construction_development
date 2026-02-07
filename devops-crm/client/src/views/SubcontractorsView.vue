<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSubcontractorsStore } from '@/stores/subcontractors'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const subcontractorsStore = useSubcontractorsStore()

const search = ref('')
const tradeFilter = ref('')

const trades = [
  { value: '', label: 'All Trades' },
  { value: 'FRAMING', label: 'Framing' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'HVAC', label: 'HVAC' },
  { value: 'ROOFING', label: 'Roofing' },
  { value: 'CONCRETE', label: 'Concrete' },
  { value: 'DRYWALL', label: 'Drywall' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'FLOORING', label: 'Flooring' },
  { value: 'LANDSCAPING', label: 'Landscaping' },
  { value: 'OTHER', label: 'Other' },
]

const loadSubcontractors = () => {
  subcontractorsStore.fetchSubcontractors({
    search: search.value || undefined,
    trade: tradeFilter.value || undefined,
  })
}

onMounted(() => {
  loadSubcontractors()
  subcontractorsStore.fetchExpiring()
})

watch([search, tradeFilter], loadSubcontractors)

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const isExpiringSoon = (date) => {
  if (!date) return false
  const thirtyDays = new Date()
  thirtyDays.setDate(thirtyDays.getDate() + 30)
  return new Date(date) <= thirtyDays
}

const getStatusColor = (status) => {
  const colors = {
    ACTIVE: 'badge-green',
    PREFERRED: 'badge-green',
    INACTIVE: 'badge-gray',
    BLACKLISTED: 'badge-red',
  }
  return colors[status] || 'badge-gray'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Subcontractors</h1>
      <button class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
        Add Subcontractor
      </button>
    </div>
    
    <!-- Expiring Alert -->
    <div v-if="subcontractorsStore.expiring.length" class="card bg-yellow-50 border-yellow-200 mb-6">
      <div class="flex items-center gap-3">
        <ExclamationTriangleIcon class="w-6 h-6 text-yellow-600" />
        <div>
          <p class="font-medium text-yellow-800">
            {{ subcontractorsStore.expiring.length }} subcontractor(s) have licenses or insurance expiring within 30 days
          </p>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search subcontractors..."
            class="input pl-10"
          />
        </div>
        <div class="w-full sm:w-48">
          <select v-model="tradeFilter" class="input">
            <option v-for="t in trades" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sand-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Company</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Trade</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">License Exp.</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Insurance Exp.</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Rating</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sand-100">
            <tr 
              v-for="sub in subcontractorsStore.subcontractors" 
              :key="sub.id"
              class="hover:bg-sand-50"
            >
              <td class="px-4 py-4">
                <RouterLink 
                  :to="`/subcontractors/${sub.id}`"
                  class="font-medium text-forest-600 hover:text-forest-700"
                >
                  {{ sub.companyName }}
                </RouterLink>
                <p class="text-sm text-charcoal-400">{{ sub.contactName }}</p>
              </td>
              <td class="px-4 py-4 text-sm">{{ sub.trade }}</td>
              <td class="px-4 py-4">
                <span :class="['badge', getStatusColor(sub.status)]">
                  {{ sub.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">
                <span :class="{ 'text-terracotta-600 font-medium': isExpiringSoon(sub.licenseExpiry) }">
                  {{ formatDate(sub.licenseExpiry) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">
                <span :class="{ 'text-terracotta-600 font-medium': isExpiringSoon(sub.insuranceExpiry) }">
                  {{ formatDate(sub.insuranceExpiry) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">
                <span v-if="sub.rating" class="text-yellow-500">
                  {{ '★'.repeat(sub.rating) }}{{ '☆'.repeat(5 - sub.rating) }}
                </span>
                <span v-else class="text-charcoal-400">-</span>
              </td>
            </tr>
            <tr v-if="!subcontractorsStore.subcontractors.length && !subcontractorsStore.loading">
              <td colspan="6" class="px-4 py-8 text-center text-charcoal-400">
                No subcontractors found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
