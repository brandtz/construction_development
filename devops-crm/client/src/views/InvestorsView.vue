<script setup>
import { ref, onMounted, watch } from 'vue'
import { useInvestorsStore } from '@/stores/investors'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/vue/24/outline'
import InvestorModal from '@/components/investors/InvestorModal.vue'

const investorsStore = useInvestorsStore()

const search = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingInvestor = ref(null)

const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'MEETING_SCHEDULED', label: 'Meeting Scheduled' },
  { value: 'REVIEWING_DOCS', label: 'Reviewing Docs' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'COMMITTED', label: 'Committed' },
  { value: 'FUNDED', label: 'Funded' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const loadInvestors = () => {
  investorsStore.fetchInvestors({
    search: search.value || undefined,
    status: statusFilter.value || undefined,
  })
}

onMounted(loadInvestors)

watch([search, statusFilter], loadInvestors)

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
    LEAD: 'badge-gray',
    CONTACTED: 'badge-yellow',
    MEETING_SCHEDULED: 'badge-yellow',
    REVIEWING_DOCS: 'badge-yellow',
    NEGOTIATING: 'badge-yellow',
    COMMITTED: 'badge-green',
    FUNDED: 'badge-green',
    DECLINED: 'badge-red',
    INACTIVE: 'badge-gray',
  }
  return colors[status] || 'badge-gray'
}

const openCreateModal = () => {
  editingInvestor.value = null
  showModal.value = true
}

const openEditModal = (investor) => {
  editingInvestor.value = investor
  showModal.value = true
}

const handleSaved = () => {
  showModal.value = false
  loadInvestors()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Investors</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
        Add Investor
      </button>
    </div>
    
    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Search investors..."
            class="input pl-10"
          />
        </div>
        <div class="w-full sm:w-48">
          <select v-model="statusFilter" class="input">
            <option v-for="s in statuses" :key="s.value" :value="s.value">
              {{ s.label }}
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
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Name</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Company</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Capacity</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Committed</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sand-100">
            <tr 
              v-for="investor in investorsStore.investors" 
              :key="investor.id"
              class="hover:bg-sand-50"
            >
              <td class="px-4 py-4">
                <RouterLink 
                  :to="`/investors/${investor.id}`"
                  class="font-medium text-forest-600 hover:text-forest-700"
                >
                  {{ investor.firstName }} {{ investor.lastName }}
                </RouterLink>
                <p class="text-sm text-charcoal-400">{{ investor.email }}</p>
              </td>
              <td class="px-4 py-4 text-sm">{{ investor.company || '-' }}</td>
              <td class="px-4 py-4">
                <span :class="['badge', getStatusColor(investor.status)]">
                  {{ investor.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">{{ investor.investmentCapacity || '-' }}</td>
              <td class="px-4 py-4 text-sm font-medium">
                {{ formatCurrency(investor.committedAmount) }}
              </td>
              <td class="px-4 py-4">
                <button 
                  @click="openEditModal(investor)"
                  class="text-sm text-forest-600 hover:text-forest-700"
                >
                  Edit
                </button>
              </td>
            </tr>
            <tr v-if="!investorsStore.investors.length && !investorsStore.loading">
              <td colspan="6" class="px-4 py-8 text-center text-charcoal-400">
                No investors found
              </td>
            </tr>
            <tr v-if="investorsStore.loading">
              <td colspan="6" class="px-4 py-8 text-center text-charcoal-400">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="investorsStore.pagination.totalPages > 1" class="px-4 py-3 border-t border-sand-100 flex items-center justify-between">
        <p class="text-sm text-charcoal-400">
          Showing {{ (investorsStore.pagination.page - 1) * investorsStore.pagination.limit + 1 }} to 
          {{ Math.min(investorsStore.pagination.page * investorsStore.pagination.limit, investorsStore.pagination.total) }} of 
          {{ investorsStore.pagination.total }} results
        </p>
      </div>
    </div>
    
    <!-- Modal -->
    <InvestorModal
      v-if="showModal"
      :investor="editingInvestor"
      @close="showModal = false"
      @saved="handleSaved"
    />
  </div>
</template>
