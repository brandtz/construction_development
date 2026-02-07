<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { 
  ArrowLeftIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  HomeIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const project = ref(null)
const loading = ref(true)

// Edit states
const editingDetails = ref(false)
const editingFinancials = ref(false)
const editingTimeline = ref(false)

// Form data
const detailsForm = ref({})
const financialsForm = ref({})
const timelineForm = ref({})

// Related entities
const vendors = ref([])
const subcontractors = ref([])
const buyers = ref([])
const documents = ref([])

// Available entities for adding
const availableVendors = ref([])
const availableSubcontractors = ref([])
const availableBuyers = ref([])
const availableDocuments = ref([])

// Modals
const showAddVendorModal = ref(false)
const showAddSubModal = ref(false)
const showAddBuyerModal = ref(false)
const showAddDocModal = ref(false)

// Selected items for adding
const selectedVendorId = ref('')
const selectedSubId = ref('')
const selectedBuyerId = ref('')
const selectedDocId = ref('')
const vendorRole = ref('')

const statusOptions = [
  'PLANNING', 'FUNDED', 'LAND_SEARCH', 'LAND_ACQUIRED', 'PERMITTING',
  'CONSTRUCTION', 'COMPLETED', 'LISTED', 'UNDER_CONTRACT', 'SOLD', 'CANCELLED'
]

// Status legend with descriptions
const statusLegend = {
  PLANNING: { label: 'Planning', description: 'Initial project planning and feasibility analysis', color: 'bg-gray-100 text-gray-700', order: 1 },
  FUNDED: { label: 'Funded', description: 'Investment secured, ready to proceed', color: 'bg-blue-100 text-blue-700', order: 2 },
  LAND_SEARCH: { label: 'Land Search', description: 'Actively searching for suitable land', color: 'bg-purple-100 text-purple-700', order: 3 },
  LAND_ACQUIRED: { label: 'Land Acquired', description: 'Land purchased, preparing for permits', color: 'bg-indigo-100 text-indigo-700', order: 4 },
  PERMITTING: { label: 'Permitting', description: 'Obtaining necessary permits and approvals', color: 'bg-orange-100 text-orange-700', order: 5 },
  CONSTRUCTION: { label: 'Construction', description: 'Active construction in progress', color: 'bg-yellow-100 text-yellow-700', order: 6 },
  COMPLETED: { label: 'Completed', description: 'Construction finished, ready for sale', color: 'bg-green-100 text-green-700', order: 7 },
  LISTED: { label: 'Listed', description: 'Property listed on the market', color: 'bg-forest-100 text-forest-700', order: 8 },
  UNDER_CONTRACT: { label: 'Under Contract', description: 'Buyer found, in escrow', color: 'bg-teal-100 text-teal-700', order: 9 },
  SOLD: { label: 'Sold', description: 'Sale completed, project closed', color: 'bg-emerald-100 text-emerald-700', order: 10 },
  CANCELLED: { label: 'Cancelled', description: 'Project cancelled or abandoned', color: 'bg-red-100 text-red-700', order: 0 },
}

const showStatusLegend = ref(false)

onMounted(async () => {
  await loadProject()
  await loadRelatedEntities()
  await loadAvailableEntities()
})

async function loadProject() {
  loading.value = true
  try {
    const response = await api.get(`/projects/${route.params.id}`)
    project.value = response.data
  } catch (err) {
    console.error('Failed to load project:', err)
  } finally {
    loading.value = false
  }
}

async function loadRelatedEntities() {
  try {
    const [vendorsRes, subsRes, buyersRes, docsRes] = await Promise.all([
      api.get(`/projects/${route.params.id}/vendors`),
      api.get(`/projects/${route.params.id}/subcontractors`),
      api.get(`/projects/${route.params.id}/buyers`),
      api.get(`/projects/${route.params.id}/documents`),
    ])
    vendors.value = vendorsRes.data
    subcontractors.value = subsRes.data
    buyers.value = buyersRes.data
    documents.value = docsRes.data
  } catch (err) {
    console.error('Failed to load related entities:', err)
  }
}

async function loadAvailableEntities() {
  try {
    const [vendorsRes, subsRes, buyersRes, docsRes] = await Promise.all([
      api.get('/vendors?limit=100'),
      api.get('/subcontractors?limit=100'),
      api.get('/buyers?limit=100'),
      api.get('/documents?limit=100'),
    ])
    availableVendors.value = vendorsRes.data.data || vendorsRes.data || []
    availableSubcontractors.value = subsRes.data.data || subsRes.data || []
    availableBuyers.value = buyersRes.data.data || buyersRes.data || []
    availableDocuments.value = docsRes.data.data || docsRes.data || []
  } catch (err) {
    console.error('Failed to load available entities:', err)
  }
}

// Details editing
function startEditDetails() {
  detailsForm.value = {
    name: project.value.name,
    address: project.value.address || '',
    city: project.value.city || '',
    state: project.value.state || 'OR',
    zip: project.value.zip || '',
    status: project.value.status,
    notes: project.value.notes || '',
  }
  editingDetails.value = true
}

async function saveDetails() {
  try {
    const response = await api.put(`/projects/${project.value.id}`, detailsForm.value)
    project.value = { ...project.value, ...response.data }
    editingDetails.value = false
  } catch (err) {
    console.error('Failed to save details:', err)
  }
}

// Quick status change
async function changeStatus(newStatus) {
  try {
    const response = await api.put(`/projects/${project.value.id}`, { status: newStatus })
    project.value = { ...project.value, ...response.data }
  } catch (err) {
    console.error('Failed to change status:', err)
  }
}

// Financials editing
function startEditFinancials() {
  financialsForm.value = {
    landCost: project.value.landCost || '',
    buildBudget: project.value.buildBudget || '',
    targetSalePrice: project.value.targetSalePrice || '',
    actualSalePrice: project.value.actualSalePrice || '',
  }
  editingFinancials.value = true
}

async function saveFinancials() {
  try {
    const response = await api.put(`/projects/${project.value.id}`, financialsForm.value)
    project.value = { ...project.value, ...response.data }
    editingFinancials.value = false
  } catch (err) {
    console.error('Failed to save financials:', err)
  }
}

// Timeline editing
function startEditTimeline() {
  timelineForm.value = {
    startDate: project.value.startDate ? project.value.startDate.split('T')[0] : '',
    targetEndDate: project.value.targetEndDate ? project.value.targetEndDate.split('T')[0] : '',
    actualEndDate: project.value.actualEndDate ? project.value.actualEndDate.split('T')[0] : '',
  }
  editingTimeline.value = true
}

async function saveTimeline() {
  try {
    const response = await api.put(`/projects/${project.value.id}`, timelineForm.value)
    project.value = { ...project.value, ...response.data }
    editingTimeline.value = false
  } catch (err) {
    console.error('Failed to save timeline:', err)
  }
}

// Vendor management
async function addVendor() {
  if (!selectedVendorId.value) return
  try {
    await api.post(`/projects/${project.value.id}/vendors`, {
      vendorId: selectedVendorId.value,
      role: vendorRole.value
    })
    await loadRelatedEntities()
    showAddVendorModal.value = false
    selectedVendorId.value = ''
    vendorRole.value = ''
  } catch (err) {
    console.error('Failed to add vendor:', err)
    alert(err.response?.data?.error || 'Failed to add vendor')
  }
}

async function removeVendor(vendorId) {
  if (!confirm('Remove this vendor from the project?')) return
  try {
    await api.delete(`/projects/${project.value.id}/vendors/${vendorId}`)
    await loadRelatedEntities()
  } catch (err) {
    console.error('Failed to remove vendor:', err)
  }
}

// Subcontractor management
async function addSubcontractor() {
  if (!selectedSubId.value) return
  try {
    await api.post(`/projects/${project.value.id}/subcontractors`, {
      subcontractorId: selectedSubId.value
    })
    await loadRelatedEntities()
    showAddSubModal.value = false
    selectedSubId.value = ''
  } catch (err) {
    console.error('Failed to add subcontractor:', err)
    alert(err.response?.data?.error || 'Failed to add subcontractor')
  }
}

async function removeSubcontractor(subId) {
  if (!confirm('Remove this subcontractor from the project?')) return
  try {
    await api.delete(`/projects/${project.value.id}/subcontractors/${subId}`)
    await loadRelatedEntities()
  } catch (err) {
    console.error('Failed to remove subcontractor:', err)
  }
}

// Buyer management
async function addBuyer() {
  if (!selectedBuyerId.value) return
  try {
    await api.post(`/projects/${project.value.id}/buyers`, {
      buyerId: selectedBuyerId.value
    })
    await loadRelatedEntities()
    showAddBuyerModal.value = false
    selectedBuyerId.value = ''
  } catch (err) {
    console.error('Failed to add buyer:', err)
    alert(err.response?.data?.error || 'Failed to add buyer')
  }
}

async function removeBuyer(buyerId) {
  if (!confirm('Remove this buyer from the project?')) return
  try {
    await api.delete(`/projects/${project.value.id}/buyers/${buyerId}`)
    await loadRelatedEntities()
  } catch (err) {
    console.error('Failed to remove buyer:', err)
  }
}

// Document management
async function addDocument() {
  if (!selectedDocId.value) return
  try {
    await api.post(`/projects/${project.value.id}/documents`, {
      documentId: selectedDocId.value
    })
    await loadRelatedEntities()
    showAddDocModal.value = false
    selectedDocId.value = ''
  } catch (err) {
    console.error('Failed to add document:', err)
    alert(err.response?.data?.error || 'Failed to add document')
  }
}

async function removeDocument(docId) {
  if (!confirm('Remove this document from the project?')) return
  try {
    await api.delete(`/projects/${project.value.id}/documents/${docId}`)
    await loadRelatedEntities()
  } catch (err) {
    console.error('Failed to remove document:', err)
  }
}

const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusClass(status) {
  const classes = {
    PLANNING: 'bg-gray-100 text-gray-700',
    FUNDED: 'bg-blue-100 text-blue-700',
    LAND_SEARCH: 'bg-purple-100 text-purple-700',
    LAND_ACQUIRED: 'bg-indigo-100 text-indigo-700',
    PERMITTING: 'bg-orange-100 text-orange-700',
    CONSTRUCTION: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    LISTED: 'bg-forest-100 text-forest-700',
    UNDER_CONTRACT: 'bg-teal-100 text-teal-700',
    SOLD: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Filter out already assigned entities
const unassignedVendors = computed(() => 
  availableVendors.value.filter(v => !vendors.value.find(pv => pv.id === v.id))
)
const unassignedSubcontractors = computed(() => 
  availableSubcontractors.value.filter(s => !subcontractors.value.find(ps => ps.id === s.id))
)
const unassignedBuyers = computed(() => 
  availableBuyers.value.filter(b => !buyers.value.find(pb => pb.id === b.id))
)
const unassignedDocuments = computed(() => 
  availableDocuments.value.filter(d => !documents.value.find(pd => pd.id === d.id))
)
</script>

<template>
  <div>
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-charcoal-400 hover:text-charcoal-500 mb-6"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Back to Projects
    </button>
    
    <div v-if="loading" class="text-center py-12">Loading...</div>
    
    <div v-else-if="project" class="space-y-6">
      <!-- Status Section with Quick Change -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-heading font-bold">Project Status</h2>
          <button @click="showStatusLegend = !showStatusLegend" class="text-charcoal-400 hover:text-forest-600 flex items-center gap-1 text-sm">
            <InformationCircleIcon class="w-4 h-4" />
            {{ showStatusLegend ? 'Hide' : 'Show' }} Legend
          </button>
        </div>
        
        <!-- Quick Status Change -->
        <div class="flex items-center gap-4 mb-4">
          <span class="text-charcoal-500">Current Status:</span>
          <div class="relative">
            <select 
              :value="project.status" 
              @change="changeStatus($event.target.value)"
              :class="['appearance-none cursor-pointer font-medium pl-3 pr-8 py-2 rounded-full text-sm border-2 border-transparent hover:border-forest-300 focus:border-forest-500 focus:outline-none', statusLegend[project.status]?.color || 'bg-gray-100']"
            >
              <option v-for="s in statusOptions" :key="s" :value="s">{{ statusLegend[s]?.label || s.replace(/_/g, ' ') }}</option>
            </select>
            <ChevronDownIcon class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
          </div>
        </div>
        
        <!-- Status Legend -->
        <div v-if="showStatusLegend" class="border-t border-sand-200 pt-4">
          <h3 class="text-sm font-medium text-charcoal-500 mb-3">Status Legend</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div 
              v-for="(info, status) in statusLegend" 
              :key="status"
              class="flex items-start gap-2 p-2 rounded-lg hover:bg-sand-50"
            >
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', info.color]">
                {{ info.label }}
              </span>
              <span class="text-xs text-charcoal-500">{{ info.description }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Project Details Section -->
      <div class="card">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-heading font-bold mb-1">{{ project.name }}</h1>
            <p class="text-charcoal-400">
              {{ project.address ? `${project.address}, ${project.city}, ${project.state} ${project.zip}` : 'No address set' }}
            </p>
          </div>
          <button v-if="!editingDetails" @click="startEditDetails" class="btn-secondary btn-sm">
            <PencilSquareIcon class="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
        
        <!-- Edit Details Form -->
        <form v-if="editingDetails" @submit.prevent="saveDetails" class="space-y-4 border-t border-sand-200 pt-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="label">Project Name</label>
              <input v-model="detailsForm.name" type="text" class="input" required />
            </div>
            <div>
              <label class="label">Address</label>
              <input v-model="detailsForm.address" type="text" class="input" />
            </div>
            <div>
              <label class="label">City</label>
              <input v-model="detailsForm.city" type="text" class="input" />
            </div>
            <div>
              <label class="label">State</label>
              <input v-model="detailsForm.state" type="text" class="input" maxlength="2" />
            </div>
            <div>
              <label class="label">ZIP</label>
              <input v-model="detailsForm.zip" type="text" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="label">Notes</label>
              <textarea v-model="detailsForm.notes" class="input" rows="2"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="editingDetails = false" class="btn-secondary btn-sm">
              <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
            </button>
            <button type="submit" class="btn-primary btn-sm">
              <CheckIcon class="w-4 h-4 mr-1" /> Save
            </button>
          </div>
        </form>
      </div>
      
      <!-- Financials Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-heading font-bold">Financials</h2>
          <button v-if="!editingFinancials" @click="startEditFinancials" class="btn-secondary btn-sm">
            <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
          </button>
        </div>
        
        <div v-if="!editingFinancials" class="grid sm:grid-cols-4 gap-4">
          <div class="bg-sand-50 rounded-lg p-4">
            <h3 class="text-sm text-charcoal-400 mb-1">Land Cost</h3>
            <p class="text-xl font-bold">{{ formatCurrency(project.landCost) }}</p>
          </div>
          <div class="bg-sand-50 rounded-lg p-4">
            <h3 class="text-sm text-charcoal-400 mb-1">Build Budget</h3>
            <p class="text-xl font-bold">{{ formatCurrency(project.buildBudget) }}</p>
          </div>
          <div class="bg-sand-50 rounded-lg p-4">
            <h3 class="text-sm text-charcoal-400 mb-1">Target Sale</h3>
            <p class="text-xl font-bold text-forest-600">{{ formatCurrency(project.targetSalePrice) }}</p>
          </div>
          <div class="bg-sand-50 rounded-lg p-4">
            <h3 class="text-sm text-charcoal-400 mb-1">Actual Sale</h3>
            <p class="text-xl font-bold text-forest-600">{{ formatCurrency(project.actualSalePrice) }}</p>
          </div>
        </div>
        
        <form v-else @submit.prevent="saveFinancials" class="space-y-4">
          <div class="grid sm:grid-cols-4 gap-4">
            <div>
              <label class="label">Land Cost ($)</label>
              <input v-model.number="financialsForm.landCost" type="number" class="input" />
            </div>
            <div>
              <label class="label">Build Budget ($)</label>
              <input v-model.number="financialsForm.buildBudget" type="number" class="input" />
            </div>
            <div>
              <label class="label">Target Sale ($)</label>
              <input v-model.number="financialsForm.targetSalePrice" type="number" class="input" />
            </div>
            <div>
              <label class="label">Actual Sale ($)</label>
              <input v-model.number="financialsForm.actualSalePrice" type="number" class="input" />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="editingFinancials = false" class="btn-secondary btn-sm">
              <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
            </button>
            <button type="submit" class="btn-primary btn-sm">
              <CheckIcon class="w-4 h-4 mr-1" /> Save
            </button>
          </div>
        </form>
      </div>
      
      <!-- Timeline Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-heading font-bold">Timeline</h2>
          <button v-if="!editingTimeline" @click="startEditTimeline" class="btn-secondary btn-sm">
            <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
          </button>
        </div>
        
        <dl v-if="!editingTimeline" class="grid sm:grid-cols-3 gap-4">
          <div>
            <dt class="text-sm text-charcoal-400">Start Date</dt>
            <dd class="font-medium">{{ formatDate(project.startDate) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-charcoal-400">Target End</dt>
            <dd class="font-medium">{{ formatDate(project.targetEndDate) }}</dd>
          </div>
          <div>
            <dt class="text-sm text-charcoal-400">Actual End</dt>
            <dd class="font-medium">{{ formatDate(project.actualEndDate) }}</dd>
          </div>
        </dl>
        
        <form v-else @submit.prevent="saveTimeline" class="space-y-4">
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="label">Start Date</label>
              <input v-model="timelineForm.startDate" type="date" class="input" />
            </div>
            <div>
              <label class="label">Target End</label>
              <input v-model="timelineForm.targetEndDate" type="date" class="input" />
            </div>
            <div>
              <label class="label">Actual End</label>
              <input v-model="timelineForm.actualEndDate" type="date" class="input" />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="editingTimeline = false" class="btn-secondary btn-sm">
              <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
            </button>
            <button type="submit" class="btn-primary btn-sm">
              <CheckIcon class="w-4 h-4 mr-1" /> Save
            </button>
          </div>
        </form>
      </div>
      
      <!-- Associations Grid -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Vendors Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <TruckIcon class="w-5 h-5 text-charcoal-400" />
              Vendors
            </h2>
            <button @click="showAddVendorModal = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" /> Add
            </button>
          </div>
          
          <div v-if="vendors.length === 0" class="text-center py-6 text-charcoal-400">
            No vendors assigned
          </div>
          <div v-else class="divide-y divide-sand-200">
            <div v-for="vendor in vendors" :key="vendor.id" class="py-3 flex items-center justify-between">
              <div>
                <router-link :to="`/vendors/${vendor.id}`" class="font-medium text-forest-600 hover:underline">
                  {{ vendor.companyName }}
                </router-link>
                <p class="text-sm text-charcoal-400">{{ vendor.category }} {{ vendor.role ? `• ${vendor.role}` : '' }}</p>
              </div>
              <button @click="removeVendor(vendor.id)" class="text-charcoal-400 hover:text-red-500">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Subcontractors Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <WrenchScrewdriverIcon class="w-5 h-5 text-charcoal-400" />
              Subcontractors
            </h2>
            <button @click="showAddSubModal = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" /> Add
            </button>
          </div>
          
          <div v-if="subcontractors.length === 0" class="text-center py-6 text-charcoal-400">
            No subcontractors assigned
          </div>
          <div v-else class="divide-y divide-sand-200">
            <div v-for="sub in subcontractors" :key="sub.id" class="py-3 flex items-center justify-between">
              <div>
                <router-link :to="`/subcontractors/${sub.id}`" class="font-medium text-forest-600 hover:underline">
                  {{ sub.companyName }}
                </router-link>
                <p class="text-sm text-charcoal-400">{{ sub.trade }} • {{ sub.contactName }}</p>
              </div>
              <button @click="removeSubcontractor(sub.id)" class="text-charcoal-400 hover:text-red-500">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Buyers Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <HomeIcon class="w-5 h-5 text-charcoal-400" />
              Interested Buyers
            </h2>
            <button @click="showAddBuyerModal = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" /> Add
            </button>
          </div>
          
          <div v-if="buyers.length === 0" class="text-center py-6 text-charcoal-400">
            No buyers assigned
          </div>
          <div v-else class="divide-y divide-sand-200">
            <div v-for="buyer in buyers" :key="buyer.id" class="py-3 flex items-center justify-between">
              <div>
                <router-link :to="`/buyers/${buyer.id}`" class="font-medium text-forest-600 hover:underline">
                  {{ buyer.firstName }} {{ buyer.lastName }}
                </router-link>
                <p class="text-sm text-charcoal-400">{{ buyer.status }} {{ buyer.preApproved ? '• Pre-approved' : '' }}</p>
              </div>
              <button @click="removeBuyer(buyer.id)" class="text-charcoal-400 hover:text-red-500">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Documents Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <DocumentIcon class="w-5 h-5 text-charcoal-400" />
              Documents
            </h2>
            <button @click="showAddDocModal = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" /> Add
            </button>
          </div>
          
          <div v-if="documents.length === 0" class="text-center py-6 text-charcoal-400">
            No documents attached
          </div>
          <div v-else class="divide-y divide-sand-200">
            <div v-for="doc in documents" :key="doc.id" class="py-3 flex items-center justify-between">
              <div>
                <p class="font-medium">{{ doc.name }}</p>
                <p class="text-sm text-charcoal-400">{{ doc.category }} • {{ formatDate(doc.createdAt) }}</p>
              </div>
              <button @click="removeDocument(doc.id)" class="text-charcoal-400 hover:text-red-500">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Vendor Modal -->
    <div v-if="showAddVendorModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Add Vendor to Project</h3>
        <div class="space-y-4">
          <div>
            <label class="label">Select Vendor</label>
            <select v-model="selectedVendorId" class="input">
              <option value="">Choose a vendor...</option>
              <option v-for="v in unassignedVendors" :key="v.id" :value="v.id">
                {{ v.companyName }} ({{ v.category }})
              </option>
            </select>
          </div>
          <div>
            <label class="label">Role/Service (optional)</label>
            <input v-model="vendorRole" type="text" class="input" placeholder="e.g., Lumber supplier" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddVendorModal = false" class="btn-secondary">Cancel</button>
          <button @click="addVendor" :disabled="!selectedVendorId" class="btn-primary">Add Vendor</button>
        </div>
      </div>
    </div>
    
    <!-- Add Subcontractor Modal -->
    <div v-if="showAddSubModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Add Subcontractor to Project</h3>
        <div>
          <label class="label">Select Subcontractor</label>
          <select v-model="selectedSubId" class="input">
            <option value="">Choose a subcontractor...</option>
            <option v-for="s in unassignedSubcontractors" :key="s.id" :value="s.id">
              {{ s.companyName }} ({{ s.trade }})
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddSubModal = false" class="btn-secondary">Cancel</button>
          <button @click="addSubcontractor" :disabled="!selectedSubId" class="btn-primary">Add Subcontractor</button>
        </div>
      </div>
    </div>
    
    <!-- Add Buyer Modal -->
    <div v-if="showAddBuyerModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Add Buyer to Project</h3>
        <div>
          <label class="label">Select Buyer</label>
          <select v-model="selectedBuyerId" class="input">
            <option value="">Choose a buyer...</option>
            <option v-for="b in unassignedBuyers" :key="b.id" :value="b.id">
              {{ b.firstName }} {{ b.lastName }} ({{ b.status }})
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddBuyerModal = false" class="btn-secondary">Cancel</button>
          <button @click="addBuyer" :disabled="!selectedBuyerId" class="btn-primary">Add Buyer</button>
        </div>
      </div>
    </div>
    
    <!-- Add Document Modal -->
    <div v-if="showAddDocModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Add Document to Project</h3>
        <div>
          <label class="label">Select Document</label>
          <select v-model="selectedDocId" class="input">
            <option value="">Choose a document...</option>
            <option v-for="d in unassignedDocuments" :key="d.id" :value="d.id">
              {{ d.name }} ({{ d.category }})
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showAddDocModal = false" class="btn-secondary">Cancel</button>
          <button @click="addDocument" :disabled="!selectedDocId" class="btn-primary">Add Document</button>
        </div>
      </div>
    </div>
  </div>
</template>
