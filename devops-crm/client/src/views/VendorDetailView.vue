<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  LinkIcon,
  DocumentTextIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const vendor = ref(null)
const loading = ref(true)
const saving = ref(false)
const editingSection = ref(null)

// Projects management
const projects = ref([])
const availableProjects = ref([])
const showAddProjectModal = ref(false)
const selectedProjectId = ref('')
const projectRole = ref('')

const categories = [
  'LUMBER', 'CONCRETE_SUPPLY', 'ELECTRICAL_SUPPLY', 'PLUMBING_SUPPLY',
  'HVAC_SUPPLY', 'ROOFING_SUPPLY', 'WINDOWS_DOORS', 'APPLIANCES',
  'FIXTURES', 'HARDWARE', 'EQUIPMENT_RENTAL', 'WASTE_DISPOSAL',
  'INSURANCE', 'LEGAL', 'ACCOUNTING', 'MARKETING', 'TITLE_ESCROW',
  'REAL_ESTATE_AGENT', 'OTHER'
]

const editForm = reactive({
  companyName: '',
  contactName: '',
  category: '',
  status: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  accountNumber: '',
  creditLimit: null,
  currentBalance: null,
  paymentTerms: '',
  taxExempt: false,
  taxId: '',
  portalUrl: '',
  portalUsername: '',
  notes: ''
})

const creditUtilization = computed(() => {
  if (!vendor.value?.creditLimit || vendor.value.creditLimit === 0) return 0
  return (vendor.value.currentBalance / vendor.value.creditLimit) * 100
})

const creditUtilizationClass = computed(() => {
  const util = creditUtilization.value
  if (util >= 90) return 'bg-red-500'
  if (util >= 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const fetchVendor = async () => {
  loading.value = true
  try {
    const response = await api.get(`/vendors/${route.params.id}`)
    vendor.value = response.data
    projects.value = response.data.projects?.map(p => ({
      ...p.project,
      role: p.role,
      assignedAt: p.createdAt
    })) || []
  } catch (error) {
    console.error('Failed to fetch vendor:', error)
    router.push('/vendors')
  } finally {
    loading.value = false
  }
}

const fetchAvailableProjects = async () => {
  try {
    const response = await api.get('/projects?limit=100')
    const linkedProjectIds = projects.value.map(p => p.id)
    availableProjects.value = response.data.data.filter(p => !linkedProjectIds.includes(p.id))
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

const startEditing = (section) => {
  editForm.companyName = vendor.value.companyName || ''
  editForm.contactName = vendor.value.contactName || ''
  editForm.category = vendor.value.category || ''
  editForm.status = vendor.value.status || 'ACTIVE'
  editForm.email = vendor.value.email || ''
  editForm.phone = vendor.value.phone || ''
  editForm.website = vendor.value.website || ''
  editForm.address = vendor.value.address || ''
  editForm.city = vendor.value.city || ''
  editForm.state = vendor.value.state || 'OR'
  editForm.zip = vendor.value.zip || ''
  editForm.accountNumber = vendor.value.accountNumber || ''
  editForm.creditLimit = vendor.value.creditLimit
  editForm.currentBalance = vendor.value.currentBalance
  editForm.paymentTerms = vendor.value.paymentTerms || ''
  editForm.taxExempt = vendor.value.taxExempt || false
  editForm.taxId = vendor.value.taxId || ''
  editForm.portalUrl = vendor.value.portalUrl || ''
  editForm.portalUsername = vendor.value.portalUsername || ''
  editForm.notes = vendor.value.notes || ''
  editingSection.value = section
}

const cancelEditing = () => {
  editingSection.value = null
}

const saveSection = async () => {
  saving.value = true
  try {
    const response = await api.put(`/vendors/${vendor.value.id}`, editForm)
    vendor.value = { ...vendor.value, ...response.data }
    editingSection.value = null
  } catch (error) {
    console.error('Failed to save vendor:', error)
    alert('Failed to save changes: ' + (error.response?.data?.error || error.message))
  } finally {
    saving.value = false
  }
}

const addProject = async () => {
  if (!selectedProjectId.value) return
  
  try {
    await api.post(`/vendors/${vendor.value.id}/projects`, {
      projectId: selectedProjectId.value,
      role: projectRole.value || null
    })
    await fetchVendor()
    showAddProjectModal.value = false
    selectedProjectId.value = ''
    projectRole.value = ''
  } catch (error) {
    console.error('Failed to add project:', error)
    alert('Failed to add project: ' + (error.response?.data?.error || error.message))
  }
}

const removeProject = async (projectId) => {
  if (!confirm('Remove this project association?')) return
  
  try {
    await api.delete(`/vendors/${vendor.value.id}/projects/${projectId}`)
    await fetchVendor()
  } catch (error) {
    console.error('Failed to remove project:', error)
    alert('Failed to remove project: ' + (error.response?.data?.error || error.message))
  }
}

const deleteVendor = async () => {
  if (!confirm(`Are you sure you want to delete "${vendor.value.companyName}"? This action cannot be undone.`)) {
    return
  }
  
  try {
    await api.delete(`/vendors/${vendor.value.id}`)
    router.push('/vendors')
  } catch (error) {
    console.error('Failed to delete vendor:', error)
    alert('Failed to delete vendor: ' + (error.response?.data?.error || error.message))
  }
}

const formatCategory = (category) => {
  if (!category) return '-'
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const formatPaymentTerms = (terms) => {
  if (!terms) return '-'
  return terms.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '-'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  const classes = {
    ACTIVE: 'bg-green-100 text-green-800',
    PREFERRED: 'bg-yellow-100 text-yellow-800',
    INACTIVE: 'bg-gray-100 text-gray-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const getProjectStatusClass = (status) => {
  const classes = {
    'PLANNING': 'bg-gray-100 text-gray-700',
    'LAND_ACQUISITION': 'bg-blue-100 text-blue-700',
    'PRE_CONSTRUCTION': 'bg-indigo-100 text-indigo-700',
    'UNDER_CONSTRUCTION': 'bg-yellow-100 text-yellow-700',
    'NEAR_COMPLETION': 'bg-orange-100 text-orange-700',
    'COMPLETED': 'bg-green-100 text-green-700',
    'ON_HOLD': 'bg-red-100 text-red-700',
    'SOLD': 'bg-purple-100 text-purple-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

watch(showAddProjectModal, (val) => {
  if (val) fetchAvailableProjects()
})

onMounted(fetchVendor)
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>

    <div v-else-if="vendor">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <button @click="router.push('/vendors')" class="p-2 hover:bg-sand-100 rounded-lg text-charcoal-500">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-heading font-bold text-charcoal-900">{{ vendor.companyName }}</h1>
            <div class="flex items-center gap-2 mt-1">
              <span :class="getStatusClass(vendor.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ vendor.status }}
              </span>
              <span class="px-2 py-1 text-xs rounded bg-sand-100 text-charcoal-600">
                {{ formatCategory(vendor.category) }}
              </span>
            </div>
          </div>
        </div>
        <button @click="deleteVendor" class="btn btn-secondary text-red-600 hover:bg-red-50">
          <TrashIcon class="w-4 h-4" />
          Delete Vendor
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Company Information -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <BuildingOfficeIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Company Information</h2>
              </div>
              <button 
                v-if="editingSection !== 'company'" 
                @click="startEditing('company')"
                class="text-accent hover:text-accent-dark p-1"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <div v-else class="flex gap-2">
                <button @click="saveSection" :disabled="saving" class="text-green-600 hover:text-green-700 p-1">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="cancelEditing" class="text-red-600 hover:text-red-700 p-1">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <div v-if="editingSection === 'company'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Company Name *</label>
                  <input v-model="editForm.companyName" type="text" required class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Category *</label>
                  <select v-model="editForm.category" required class="input">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ formatCategory(cat) }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Contact Name</label>
                  <input v-model="editForm.contactName" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Status</label>
                  <select v-model="editForm.status" class="input">
                    <option value="ACTIVE">Active</option>
                    <option value="PREFERRED">Preferred</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div v-else class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-charcoal-500">Company Name</p>
                  <p class="font-medium text-charcoal-900">{{ vendor.companyName }}</p>
                </div>
                <div>
                  <p class="text-sm text-charcoal-500">Category</p>
                  <p class="font-medium text-charcoal-900">{{ formatCategory(vendor.category) }}</p>
                </div>
                <div>
                  <p class="text-sm text-charcoal-500">Contact Name</p>
                  <p class="font-medium text-charcoal-900">{{ vendor.contactName || '-' }}</p>
                </div>
                <div>
                  <p class="text-sm text-charcoal-500">Status</p>
                  <span :class="getStatusClass(vendor.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ vendor.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <UserIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Contact Information</h2>
              </div>
              <button 
                v-if="editingSection !== 'contact'" 
                @click="startEditing('contact')"
                class="text-accent hover:text-accent-dark p-1"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <div v-else class="flex gap-2">
                <button @click="saveSection" :disabled="saving" class="text-green-600 hover:text-green-700 p-1">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="cancelEditing" class="text-red-600 hover:text-red-700 p-1">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <div v-if="editingSection === 'contact'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Email</label>
                  <input v-model="editForm.email" type="email" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Phone</label>
                  <input v-model="editForm.phone" type="tel" class="input" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Website</label>
                  <input v-model="editForm.website" type="url" placeholder="https://" class="input" />
                </div>
              </div>
              <div v-else class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-charcoal-500">Email</p>
                  <p v-if="vendor.email" class="font-medium text-charcoal-900">
                    <a :href="'mailto:' + vendor.email" class="text-accent hover:text-accent-dark">{{ vendor.email }}</a>
                  </p>
                  <p v-else class="text-charcoal-400">-</p>
                </div>
                <div>
                  <p class="text-sm text-charcoal-500">Phone</p>
                  <p v-if="vendor.phone" class="font-medium text-charcoal-900">
                    <a :href="'tel:' + vendor.phone" class="text-accent hover:text-accent-dark">{{ vendor.phone }}</a>
                  </p>
                  <p v-else class="text-charcoal-400">-</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-charcoal-500">Website</p>
                  <p v-if="vendor.website" class="font-medium">
                    <a :href="vendor.website" target="_blank" class="text-accent hover:text-accent-dark flex items-center gap-1">
                      {{ vendor.website }}
                      <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                    </a>
                  </p>
                  <p v-else class="text-charcoal-400">-</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <MapPinIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Address</h2>
              </div>
              <button 
                v-if="editingSection !== 'address'" 
                @click="startEditing('address')"
                class="text-accent hover:text-accent-dark p-1"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <div v-else class="flex gap-2">
                <button @click="saveSection" :disabled="saving" class="text-green-600 hover:text-green-700 p-1">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="cancelEditing" class="text-red-600 hover:text-red-700 p-1">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <div v-if="editingSection === 'address'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Street Address</label>
                  <input v-model="editForm.address" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">City</label>
                  <input v-model="editForm.city" type="text" class="input" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-charcoal-600 mb-1">State</label>
                    <input v-model="editForm.state" type="text" maxlength="2" class="input" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-charcoal-600 mb-1">ZIP</label>
                    <input v-model="editForm.zip" type="text" class="input" />
                  </div>
                </div>
              </div>
              <div v-else>
                <p v-if="vendor.address || vendor.city" class="font-medium text-charcoal-900">
                  {{ vendor.address }}<br v-if="vendor.address && vendor.city" />
                  {{ [vendor.city, vendor.state, vendor.zip].filter(Boolean).join(', ') }}
                </p>
                <p v-else class="text-charcoal-400">No address on file</p>
              </div>
            </div>
          </div>

          <!-- Account & Credit Information -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <CreditCardIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Account & Credit Information</h2>
              </div>
              <button 
                v-if="editingSection !== 'account'" 
                @click="startEditing('account')"
                class="text-accent hover:text-accent-dark p-1"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <div v-else class="flex gap-2">
                <button @click="saveSection" :disabled="saving" class="text-green-600 hover:text-green-700 p-1">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="cancelEditing" class="text-red-600 hover:text-red-700 p-1">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <div v-if="editingSection === 'account'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Account Number</label>
                  <input v-model="editForm.accountNumber" type="text" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Payment Terms</label>
                  <select v-model="editForm.paymentTerms" class="input">
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
                  <input v-model="editForm.creditLimit" type="number" step="0.01" min="0" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Current Balance ($)</label>
                  <input v-model="editForm.currentBalance" type="number" step="0.01" min="0" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Tax ID</label>
                  <input v-model="editForm.taxId" type="text" placeholder="XX-XXXXXXX" class="input" />
                </div>
                <div class="flex items-center pt-6">
                  <input v-model="editForm.taxExempt" type="checkbox" id="editTaxExempt" class="h-4 w-4 text-accent rounded focus:ring-accent" />
                  <label for="editTaxExempt" class="ml-2 text-sm text-charcoal-600">Tax Exempt</label>
                </div>
              </div>
              <div v-else>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-charcoal-500">Account Number</p>
                    <p class="font-medium text-charcoal-900 font-mono">{{ vendor.accountNumber || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-charcoal-500">Payment Terms</p>
                    <p class="font-medium text-charcoal-900">{{ formatPaymentTerms(vendor.paymentTerms) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-charcoal-500">Tax ID</p>
                    <p class="font-medium text-charcoal-900 font-mono">{{ vendor.taxId || '-' }}</p>
                  </div>
                </div>
                
                <!-- Credit Info Card -->
                <div v-if="vendor.creditLimit" class="bg-sand-50 rounded-lg p-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-charcoal-600">Credit Utilization</span>
                    <span class="text-sm font-medium">{{ creditUtilization.toFixed(1) }}%</span>
                  </div>
                  <div class="w-full bg-sand-200 rounded-full h-2 mb-3">
                    <div :class="creditUtilizationClass" class="h-2 rounded-full transition-all" :style="{ width: Math.min(creditUtilization, 100) + '%' }"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-charcoal-500">Credit Limit</p>
                      <p class="text-lg font-bold text-charcoal-900">${{ formatNumber(vendor.creditLimit) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-charcoal-500">Current Balance</p>
                      <p class="text-lg font-bold" :class="creditUtilization >= 90 ? 'text-red-600' : 'text-charcoal-900'">
                        ${{ formatNumber(vendor.currentBalance || 0) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-charcoal-400 text-sm">No credit limit set</div>

                <div v-if="vendor.taxExempt" class="mt-4">
                  <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Tax Exempt</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Linked Projects -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <FolderIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Linked Projects</h2>
                <span class="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">{{ projects.length }}</span>
              </div>
              <button @click="showAddProjectModal = true" class="btn btn-primary text-sm">
                <PlusIcon class="w-4 h-4" />
                Add Project
              </button>
            </div>
            <div class="p-4">
              <div v-if="projects.length === 0" class="text-center py-8 text-charcoal-400">
                <FolderIcon class="w-12 h-12 mx-auto mb-2 text-charcoal-300" />
                <p>No projects linked to this vendor</p>
              </div>
              <div v-else class="space-y-3">
                <div 
                  v-for="project in projects" 
                  :key="project.id"
                  class="flex items-center justify-between p-3 bg-sand-50 rounded-lg hover:bg-sand-100 transition-colors"
                >
                  <div 
                    class="flex-1 cursor-pointer"
                    @click="router.push(`/projects/${project.id}`)"
                  >
                    <p class="font-medium text-charcoal-900">{{ project.name }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span :class="getProjectStatusClass(project.status)" class="px-2 py-0.5 text-xs rounded-full">
                        {{ project.status?.replace(/_/g, ' ') }}
                      </span>
                      <span v-if="project.role" class="text-xs text-charcoal-500">
                        Role: {{ project.role }}
                      </span>
                    </div>
                  </div>
                  <button @click.stop="removeProject(project.id)" class="p-1 text-red-500 hover:text-red-700">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="card">
            <div class="flex items-center justify-between p-4 border-b border-sand-100">
              <div class="flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-charcoal-400" />
                <h2 class="font-semibold text-charcoal-900">Notes</h2>
              </div>
              <button 
                v-if="editingSection !== 'notes'" 
                @click="startEditing('notes')"
                class="text-accent hover:text-accent-dark p-1"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <div v-else class="flex gap-2">
                <button @click="saveSection" :disabled="saving" class="text-green-600 hover:text-green-700 p-1">
                  <CheckIcon class="w-4 h-4" />
                </button>
                <button @click="cancelEditing" class="text-red-600 hover:text-red-700 p-1">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="p-4">
              <textarea 
                v-if="editingSection === 'notes'" 
                v-model="editForm.notes" 
                rows="4" 
                class="input"
                placeholder="Add notes about this vendor..."
              ></textarea>
              <p v-else class="text-charcoal-700 whitespace-pre-wrap">{{ vendor.notes || 'No notes' }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Portal -->
        <div class="space-y-6">
          <!-- Vendor Portal Quick Access -->
          <div class="card">
            <div class="flex items-center gap-2 p-4 border-b border-sand-100">
              <LinkIcon class="w-5 h-5 text-charcoal-400" />
              <h2 class="font-semibold text-charcoal-900">Vendor Portal</h2>
            </div>
            <div class="p-4">
              <div v-if="editingSection !== 'portal'">
                <div v-if="vendor.portalUrl" class="space-y-3">
                  <a 
                    :href="vendor.portalUrl" 
                    target="_blank"
                    class="btn btn-primary w-full justify-center"
                  >
                    <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                    Open Vendor Portal
                  </a>
                  <div class="text-sm">
                    <p class="text-charcoal-500">Username</p>
                    <p class="font-medium text-charcoal-900 font-mono">{{ vendor.portalUsername || '-' }}</p>
                  </div>
                  <div class="text-sm">
                    <p class="text-charcoal-500">Portal URL</p>
                    <p class="font-medium text-charcoal-700 text-xs break-all">{{ vendor.portalUrl }}</p>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-charcoal-400">
                  <LinkIcon class="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
                  <p class="text-sm">No portal configured</p>
                </div>
                <button @click="startEditing('portal')" class="btn btn-secondary w-full mt-4">
                  <PencilIcon class="w-4 h-4" />
                  {{ vendor.portalUrl ? 'Edit Portal Info' : 'Add Portal Info' }}
                </button>
              </div>
              <div v-else class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Portal URL</label>
                  <input v-model="editForm.portalUrl" type="url" placeholder="https://vendor.example.com/login" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-charcoal-600 mb-1">Username</label>
                  <input v-model="editForm.portalUsername" type="text" class="input" />
                </div>
                <div class="flex gap-2">
                  <button @click="saveSection" :disabled="saving" class="btn btn-primary flex-1">
                    <CheckIcon class="w-4 h-4" />
                    Save
                  </button>
                  <button @click="cancelEditing" class="btn btn-secondary">
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Info -->
          <div class="card p-4">
            <h3 class="text-sm font-medium text-charcoal-500 mb-3">Quick Info</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-charcoal-500">Created</span>
                <span class="text-charcoal-900">{{ formatDate(vendor.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-charcoal-500">Last Updated</span>
                <span class="text-charcoal-900">{{ formatDate(vendor.updatedAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-charcoal-500">Projects</span>
                <span class="text-charcoal-900">{{ projects.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showAddProjectModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center p-4 border-b border-sand-100">
          <h2 class="text-lg font-heading font-bold">Add Project Association</h2>
          <button @click="showAddProjectModal = false" class="text-charcoal-400 hover:text-charcoal-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-charcoal-600 mb-1">Select Project *</label>
            <select v-model="selectedProjectId" required class="input">
              <option value="">Choose a project...</option>
              <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-charcoal-600 mb-1">Role (optional)</label>
            <input v-model="projectRole" type="text" placeholder="e.g., Lumber Supplier, Material Provider" class="input" />
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="showAddProjectModal = false" class="btn btn-secondary flex-1">Cancel</button>
            <button @click="addProject" :disabled="!selectedProjectId" class="btn btn-primary flex-1 disabled:opacity-50">Add Project</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
