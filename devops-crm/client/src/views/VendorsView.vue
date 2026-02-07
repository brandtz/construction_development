<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, TrashIcon, ArrowTopRightOnSquareIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const vendors = ref([])
const loading = ref(false)
const saving = ref(false)
const showAddModal = ref(false)

const filters = reactive({
  search: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const statusCounts = ref({})

const categories = [
  'LUMBER',
  'CONCRETE_SUPPLY',
  'ELECTRICAL_SUPPLY',
  'PLUMBING_SUPPLY',
  'HVAC_SUPPLY',
  'ROOFING_SUPPLY',
  'WINDOWS_DOORS',
  'APPLIANCES',
  'FIXTURES',
  'HARDWARE',
  'EQUIPMENT_RENTAL',
  'WASTE_DISPOSAL',
  'INSURANCE',
  'LEGAL',
  'ACCOUNTING',
  'MARKETING',
  'TITLE_ESCROW',
  'REAL_ESTATE_AGENT',
  'OTHER'
]

const getDefaultVendor = () => ({
  companyName: '',
  contactName: '',
  category: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: 'OR',
  zip: '',
  accountNumber: '',
  creditLimit: null,
  currentBalance: null,
  paymentTerms: '',
  taxExempt: false,
  taxId: '',
  portalUrl: '',
  portalUsername: '',
  status: 'ACTIVE',
  notes: ''
})

const newVendor = reactive(getDefaultVendor())

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pagination.page = 1
    fetchVendors()
  }, 300)
}

const fetchVendors = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    })
    
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.status) params.append('status', filters.status)
    
    const response = await api.get(`/vendors?${params}`)
    vendors.value = response.data.data
    pagination.total = response.data.pagination.total
    pagination.totalPages = response.data.pagination.totalPages
  } catch (error) {
    console.error('Failed to fetch vendors:', error)
  } finally {
    loading.value = false
  }
}

const fetchStatusCounts = async () => {
  try {
    const [active, preferred, inactive] = await Promise.all([
      api.get('/vendors?status=ACTIVE&limit=1'),
      api.get('/vendors?status=PREFERRED&limit=1'),
      api.get('/vendors?status=INACTIVE&limit=1')
    ])
    statusCounts.value = {
      ACTIVE: active.data.pagination.total,
      PREFERRED: preferred.data.pagination.total,
      INACTIVE: inactive.data.pagination.total
    }
  } catch (error) {
    console.error('Failed to fetch status counts:', error)
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.status = ''
  pagination.page = 1
  fetchVendors()
}

const formatCategory = (category) => {
  if (!category) return '-'
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

const getStatusClass = (status) => {
  const classes = {
    ACTIVE: 'bg-green-100 text-green-800',
    PREFERRED: 'bg-yellow-100 text-yellow-800',
    INACTIVE: 'bg-gray-100 text-gray-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const goToVendor = (id) => {
  router.push(`/vendors/${id}`)
}

const closeAddModal = () => {
  showAddModal.value = false
  Object.assign(newVendor, getDefaultVendor())
}

const createVendor = async () => {
  saving.value = true
  try {
    const response = await api.post('/vendors', newVendor)
    closeAddModal()
    fetchVendors()
    fetchStatusCounts()
    // Navigate to the new vendor
    router.push(`/vendors/${response.data.id}`)
  } catch (error) {
    console.error('Failed to create vendor:', error)
    alert('Failed to create vendor: ' + (error.response?.data?.error || error.message))
  } finally {
    saving.value = false
  }
}

const deleteVendor = async (vendor) => {
  if (!confirm(`Are you sure you want to delete "${vendor.companyName}"? This action cannot be undone.`)) {
    return
  }
  
  try {
    await api.delete(`/vendors/${vendor.id}`)
    fetchVendors()
    fetchStatusCounts()
  } catch (error) {
    console.error('Failed to delete vendor:', error)
    alert('Failed to delete vendor: ' + (error.response?.data?.error || error.message))
  }
}

onMounted(() => {
  fetchVendors()
  fetchStatusCounts()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Vendors</h1>
      <button @click="showAddModal = true" class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
        Add Vendor
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-charcoal-600 mb-1">Search</label>
          <div class="relative">
            <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search vendors..."
              class="input pl-10"
              @input="debouncedFetch"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-charcoal-600 mb-1">Category</label>
          <select v-model="filters.category" class="input" @change="fetchVendors">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ formatCategory(cat) }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-charcoal-600 mb-1">Status</label>
          <select v-model="filters.status" class="input" @change="fetchVendors">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PREFERRED">Preferred</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn btn-secondary">
            <FunnelIcon class="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <div class="text-sm text-charcoal-500">Total Vendors</div>
        <div class="text-2xl font-bold text-charcoal-900">{{ pagination.total }}</div>
      </div>
      <div class="card p-4">
        <div class="text-sm text-charcoal-500">Active</div>
        <div class="text-2xl font-bold text-green-600">{{ statusCounts.ACTIVE || 0 }}</div>
      </div>
      <div class="card p-4">
        <div class="text-sm text-charcoal-500">Preferred</div>
        <div class="text-2xl font-bold text-yellow-600">{{ statusCounts.PREFERRED || 0 }}</div>
      </div>
      <div class="card p-4">
        <div class="text-sm text-charcoal-500">Inactive</div>
        <div class="text-2xl font-bold text-charcoal-400">{{ statusCounts.INACTIVE || 0 }}</div>
      </div>
    </div>

    <!-- Vendors Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sand-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Company</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Category</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Contact</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Credit Info</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Projects</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Status</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-charcoal-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sand-100">
            <tr 
              v-for="vendor in vendors" 
              :key="vendor.id" 
              class="hover:bg-sand-50 cursor-pointer"
              @click="goToVendor(vendor.id)"
            >
              <td class="px-4 py-4">
                <p class="font-medium text-charcoal-900">{{ vendor.companyName }}</p>
                <p class="text-sm text-charcoal-400">{{ vendor.email || '-' }}</p>
                <a 
                  v-if="vendor.portalUrl" 
                  :href="vendor.portalUrl" 
                  target="_blank"
                  @click.stop
                  class="text-xs text-accent hover:text-accent-dark flex items-center gap-1 mt-1"
                >
                  <ArrowTopRightOnSquareIcon class="w-3 h-3" />
                  Vendor Portal
                </a>
              </td>
              <td class="px-4 py-4">
                <span class="px-2 py-1 text-xs rounded bg-sand-100 text-charcoal-700">
                  {{ formatCategory(vendor.category) }}
                </span>
              </td>
              <td class="px-4 py-4">
                <p class="text-sm text-charcoal-900">{{ vendor.contactName || '-' }}</p>
                <p class="text-sm text-charcoal-400">{{ vendor.phone || '-' }}</p>
              </td>
              <td class="px-4 py-4">
                <div v-if="vendor.creditLimit" class="text-sm">
                  <span class="text-charcoal-500">Limit:</span>
                  <span class="font-medium text-charcoal-900 ml-1">${{ formatNumber(vendor.creditLimit) }}</span>
                </div>
                <div v-if="vendor.currentBalance" class="text-sm">
                  <span class="text-charcoal-500">Balance:</span>
                  <span :class="vendor.currentBalance > (vendor.creditLimit * 0.8) ? 'text-red-600' : 'text-charcoal-900'" class="font-medium ml-1">
                    ${{ formatNumber(vendor.currentBalance) }}
                  </span>
                </div>
                <div v-if="!vendor.creditLimit && !vendor.currentBalance" class="text-sm text-charcoal-400">-</div>
              </td>
              <td class="px-4 py-4">
                <span class="px-2 py-1 text-xs rounded bg-accent/10 text-accent">
                  {{ vendor._count?.projects || 0 }} projects
                </span>
              </td>
              <td class="px-4 py-4">
                <span :class="getStatusClass(vendor.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ vendor.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-right" @click.stop>
                <button @click="deleteVendor(vendor)" class="text-red-500 hover:text-red-700 p-1">
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
            <tr v-if="vendors.length === 0 && !loading">
              <td colspan="7" class="px-4 py-12 text-center text-charcoal-400">
                <BuildingOfficeIcon class="w-12 h-12 mx-auto mb-4 text-charcoal-300" />
                <p class="text-lg font-medium">No vendors found</p>
                <p class="text-sm">Try adjusting your filters or add a new vendor</p>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-12 text-center text-charcoal-400">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p class="mt-2">Loading vendors...</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-sand-50 px-4 py-3 flex items-center justify-between border-t border-sand-100">
        <div class="text-sm text-charcoal-500">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} vendors
        </div>
        <div class="flex gap-2">
          <button
            @click="pagination.page--; fetchVendors()"
            :disabled="pagination.page === 1"
            class="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="pagination.page++; fetchVendors()"
            :disabled="pagination.page >= pagination.totalPages"
            class="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add Vendor Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-sand-100 sticky top-0 bg-white">
          <h2 class="text-xl font-heading font-bold">Add New Vendor</h2>
          <button @click="closeAddModal" class="text-charcoal-400 hover:text-charcoal-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form @submit.prevent="createVendor" class="p-6 space-y-6">
          <!-- Company Info -->
          <div>
            <h3 class="text-lg font-medium text-charcoal-900 mb-4">Company Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Company Name *</label>
                <input v-model="newVendor.companyName" type="text" required class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Category *</label>
                <select v-model="newVendor.category" required class="input">
                  <option value="">Select Category</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ formatCategory(cat) }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Contact Name</label>
                <input v-model="newVendor.contactName" type="text" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Status</label>
                <select v-model="newVendor.status" class="input">
                  <option value="ACTIVE">Active</option>
                  <option value="PREFERRED">Preferred</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-medium text-charcoal-900 mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Email</label>
                <input v-model="newVendor.email" type="email" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Phone</label>
                <input v-model="newVendor.phone" type="tel" class="input" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Website</label>
                <input v-model="newVendor.website" type="url" placeholder="https://" class="input" />
              </div>
            </div>
          </div>

          <!-- Address -->
          <div>
            <h3 class="text-lg font-medium text-charcoal-900 mb-4">Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Street Address</label>
                <input v-model="newVendor.address" type="text" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">City</label>
                <input v-model="newVendor.city" type="text" class="input" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">State</label>
                  <input v-model="newVendor.state" type="text" maxlength="2" placeholder="OR" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">ZIP</label>
                  <input v-model="newVendor.zip" type="text" class="input" />
                </div>
              </div>
            </div>
          </div>

          <!-- Account Info -->
          <div>
            <h3 class="text-lg font-medium text-charcoal-900 mb-4">Account & Credit Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Account Number</label>
                <input v-model="newVendor.accountNumber" type="text" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Payment Terms</label>
                <select v-model="newVendor.paymentTerms" class="input">
                  <option value="">Select Terms</option>
                  <option value="NET_15">Net 15</option>
                  <option value="NET_30">Net 30</option>
                  <option value="NET_45">Net 45</option>
                  <option value="NET_60">Net 60</option>
                  <option value="DUE_ON_RECEIPT">Due on Receipt</option>
                  <option value="COD">COD</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Credit Limit ($)</label>
                <input v-model="newVendor.creditLimit" type="number" step="0.01" min="0" placeholder="0.00" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Current Balance ($)</label>
                <input v-model="newVendor.currentBalance" type="number" step="0.01" min="0" placeholder="0.00" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Tax ID</label>
                <input v-model="newVendor.taxId" type="text" placeholder="XX-XXXXXXX" class="input" />
              </div>
              <div class="flex items-center pt-6">
                <input v-model="newVendor.taxExempt" type="checkbox" id="taxExempt" class="h-4 w-4 text-accent rounded focus:ring-accent" />
                <label for="taxExempt" class="ml-2 text-sm text-charcoal-600">Tax Exempt</label>
              </div>
            </div>
          </div>

          <!-- Portal Info -->
          <div>
            <h3 class="text-lg font-medium text-charcoal-900 mb-4">Vendor Portal Login</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Portal URL</label>
                <input v-model="newVendor.portalUrl" type="url" placeholder="https://vendor.example.com/login" class="input" />
              </div>
              <div>
                <label class="block text-sm font-medium text-charcoal-600 mb-1">Portal Username</label>
                <input v-model="newVendor.portalUsername" type="text" class="input" />
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-charcoal-600 mb-1">Notes</label>
            <textarea v-model="newVendor.notes" rows="3" class="input"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-sand-100">
            <button type="button" @click="closeAddModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="btn btn-primary disabled:opacity-50">
              {{ saving ? 'Creating...' : 'Create Vendor' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
