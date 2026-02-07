<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const landLeads = ref([])
const loading = ref(true)
const search = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)

// Form for new lead
const newLead = ref({
  address: '',
  city: '',
  state: 'OR',
  zip: '',
  acreage: '',
  zoning: '',
  askingPrice: '',
  source: '',
  notes: '',
})

const statusOptions = ['NEW', 'RESEARCHING', 'CONTACTED', 'NEGOTIATING', 'UNDER_CONTRACT', 'DUE_DILIGENCE', 'CLOSED', 'PASSED', 'LOST']
const sourceOptions = ['MLS', 'Redfin', 'Zillow', 'Direct Mail', 'Cold Call', 'Referral', 'Driving for Dollars', 'Auction', 'County Records', 'Other']
const zoningOptions = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed-Use', 'R-1', 'R-2', 'R-3', 'Other']

onMounted(() => {
  loadLeads()
})

async function loadLeads() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (search.value) params.append('search', search.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    
    const response = await api.get(`/land-leads?${params.toString()}`)
    landLeads.value = response.data.data
  } catch (err) {
    console.error('Failed to load land leads:', err)
  } finally {
    loading.value = false
  }
}

async function createLead() {
  try {
    await api.post('/land-leads', newLead.value)
    showAddModal.value = false
    resetForm()
    await loadLeads()
  } catch (err) {
    console.error('Failed to create lead:', err)
    alert(err.response?.data?.error || 'Failed to create lead')
  }
}

async function deleteLead(id, event) {
  event.stopPropagation()
  if (!confirm('Delete this land lead?')) return
  try {
    await api.delete(`/land-leads/${id}`)
    await loadLeads()
  } catch (err) {
    console.error('Failed to delete lead:', err)
  }
}

function resetForm() {
  newLead.value = {
    address: '',
    city: '',
    state: 'OR',
    zip: '',
    acreage: '',
    zoning: '',
    askingPrice: '',
    source: '',
    notes: '',
  }
}

function openZillow(lead, event) {
  event.stopPropagation()
  const address = `${lead.address}, ${lead.city || ''}, ${lead.state || 'OR'} ${lead.zip || ''}`.replace(/\s+/g, '-').replace(/[,#]/g, '')
  window.open(`https://www.zillow.com/homes/${encodeURIComponent(address)}_rb/`, '_blank')
}

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
    NEW: 'bg-gray-100 text-gray-700',
    RESEARCHING: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-purple-100 text-purple-700',
    NEGOTIATING: 'bg-yellow-100 text-yellow-700',
    UNDER_CONTRACT: 'bg-orange-100 text-orange-700',
    DUE_DILIGENCE: 'bg-indigo-100 text-indigo-700',
    CLOSED: 'bg-green-100 text-green-700',
    PASSED: 'bg-charcoal-100 text-charcoal-600',
    LOST: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const filteredLeads = computed(() => {
  return landLeads.value
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Land Leads</h1>
      <button @click="showAddModal = true" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-1" />
        Add Lead
      </button>
    </div>
    
    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input 
              v-model="search"
              @input="loadLeads"
              type="text" 
              placeholder="Search address, city, owner..." 
              class="input pl-10"
            />
          </div>
        </div>
        <div class="w-48">
          <select v-model="statusFilter" @change="loadLeads" class="input">
            <option value="">All Statuses</option>
            <option v-for="s in statusOptions" :key="s" :value="s">{{ s.replace(/_/g, ' ') }}</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sand-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Address</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Zoning</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Acreage</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Asking</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sand-100">
            <tr 
              v-for="lead in filteredLeads" 
              :key="lead.id" 
              @click="router.push(`/land-leads/${lead.id}`)"
              class="hover:bg-sand-50 cursor-pointer"
            >
              <td class="px-4 py-4">
                <p class="font-medium">{{ lead.address }}</p>
                <p class="text-sm text-charcoal-400">{{ lead.city }}, {{ lead.state }}</p>
              </td>
              <td class="px-4 py-4 text-sm">{{ lead.zoning || '-' }}</td>
              <td class="px-4 py-4 text-sm">{{ lead.acreage ? `${lead.acreage} ac` : '-' }}</td>
              <td class="px-4 py-4 text-sm font-medium">{{ formatCurrency(lead.askingPrice) }}</td>
              <td class="px-4 py-4">
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', getStatusColor(lead.status)]">
                  {{ lead.status.replace(/_/g, ' ') }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="openZillow(lead, $event)" 
                    class="p-1.5 text-charcoal-400 hover:text-forest-600 hover:bg-forest-50 rounded"
                    title="Search on Zillow"
                  >
                    <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteLead(lead.id, $event)" 
                    class="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredLeads.length && !loading">
              <td colspan="6" class="px-4 py-8 text-center text-charcoal-400">
                No land leads found
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-charcoal-400">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Add Lead Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Add Land Lead</h3>
        <form @submit.prevent="createLead" class="space-y-4">
          <div>
            <label class="label">Address *</label>
            <input v-model="newLead.address" type="text" class="input" required placeholder="123 Main St" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="label">City</label>
              <input v-model="newLead.city" type="text" class="input" placeholder="Eugene" />
            </div>
            <div>
              <label class="label">State</label>
              <input v-model="newLead.state" type="text" class="input" maxlength="2" />
            </div>
            <div>
              <label class="label">ZIP</label>
              <input v-model="newLead.zip" type="text" class="input" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Acreage</label>
              <input v-model.number="newLead.acreage" type="number" step="0.01" class="input" />
            </div>
            <div>
              <label class="label">Zoning</label>
              <select v-model="newLead.zoning" class="input">
                <option value="">Select...</option>
                <option v-for="z in zoningOptions" :key="z" :value="z">{{ z }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Asking Price ($)</label>
              <input v-model.number="newLead.askingPrice" type="number" class="input" />
            </div>
            <div>
              <label class="label">Source</label>
              <select v-model="newLead.source" class="input">
                <option value="">Select...</option>
                <option v-for="s in sourceOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="label">Notes</label>
            <textarea v-model="newLead.notes" class="input" rows="2"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showAddModal = false; resetForm()" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
