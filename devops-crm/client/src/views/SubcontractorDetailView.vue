<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubcontractorsStore } from '@/stores/subcontractors'
import { 
  ArrowLeftIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const subcontractorsStore = useSubcontractorsStore()

// Edit states for each section
const editingContact = ref(false)
const editingCompliance = ref(false)
const editingRates = ref(false)
const editingPerformance = ref(false)

// Form data
const contactForm = ref({})
const complianceForm = ref({})
const ratesForm = ref({})
const performanceForm = ref({})

// Projects
const projects = ref([])
const availableProjects = ref([])
const showAddProjectModal = ref(false)
const selectedProjectId = ref('')
const loadingProjects = ref(false)

// Trade options
const tradeOptions = [
  'GENERAL', 'CONCRETE', 'FRAMING', 'ELECTRICAL', 'PLUMBING', 'HVAC',
  'INSULATION', 'ROOFING', 'SIDING', 'DRYWALL', 'PAINTING', 'FLOORING',
  'TILE', 'CABINETS', 'COUNTERTOPS', 'LANDSCAPING', 'EXCAVATION',
  'GRADING', 'SURVEYING', 'ENGINEERING', 'ARCHITECTURE', 'OTHER'
]

const statusOptions = ['ACTIVE', 'PREFERRED', 'PROBATION', 'INACTIVE', 'BLACKLISTED']
const paymentOptions = ['Check', 'ACH', 'Wire', 'Credit Card', 'Cash']

const sub = computed(() => subcontractorsStore.currentSubcontractor)

onMounted(async () => {
  await subcontractorsStore.fetchSubcontractor(route.params.id)
  await fetchProjects()
})

async function fetchProjects() {
  loadingProjects.value = true
  try {
    // Get projects where this sub has bids
    const res = await fetch(`/api/subcontractors/${route.params.id}/projects`, { credentials: 'include' })
    if (res.ok) {
      projects.value = await res.json()
    }
    
    // Get all available projects for adding
    const allRes = await fetch('/api/projects?limit=100', { credentials: 'include' })
    if (allRes.ok) {
      const data = await allRes.json()
      availableProjects.value = data.data || []
    }
  } catch (err) {
    console.error('Error fetching projects:', err)
  } finally {
    loadingProjects.value = false
  }
}

// Contact section
function startEditContact() {
  contactForm.value = {
    companyName: sub.value.companyName,
    contactName: sub.value.contactName,
    trade: sub.value.trade,
    phone: sub.value.phone || '',
    email: sub.value.email || '',
    licenseNumber: sub.value.licenseNumber || '',
    address: sub.value.address || '',
    city: sub.value.city || '',
    state: sub.value.state || 'OR',
  }
  editingContact.value = true
}

async function saveContact() {
  await subcontractorsStore.updateSubcontractor(sub.value.id, contactForm.value)
  editingContact.value = false
}

// Compliance section
function startEditCompliance() {
  complianceForm.value = {
    licenseExpiry: sub.value.licenseExpiry ? sub.value.licenseExpiry.split('T')[0] : '',
    insuranceExpiry: sub.value.insuranceExpiry ? sub.value.insuranceExpiry.split('T')[0] : '',
    bondAmount: sub.value.bondAmount || '',
  }
  editingCompliance.value = true
}

async function saveCompliance() {
  await subcontractorsStore.updateSubcontractor(sub.value.id, complianceForm.value)
  editingCompliance.value = false
}

// Rates section
function startEditRates() {
  ratesForm.value = {
    hourlyRate: sub.value.hourlyRate || '',
    dayRate: sub.value.dayRate || '',
    preferredPayment: sub.value.preferredPayment || '',
  }
  editingRates.value = true
}

async function saveRates() {
  await subcontractorsStore.updateSubcontractor(sub.value.id, ratesForm.value)
  editingRates.value = false
}

// Performance section
function startEditPerformance() {
  performanceForm.value = {
    status: sub.value.status,
    rating: sub.value.rating || '',
    reliabilityScore: sub.value.reliabilityScore || '',
    notes: sub.value.notes || '',
  }
  editingPerformance.value = true
}

async function savePerformance() {
  await subcontractorsStore.updateSubcontractor(sub.value.id, performanceForm.value)
  editingPerformance.value = false
}

// Project management
async function addToProject() {
  if (!selectedProjectId.value) return
  try {
    const res = await fetch(`/api/subcontractors/${sub.value.id}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ projectId: selectedProjectId.value })
    })
    if (res.ok) {
      await fetchProjects()
      showAddProjectModal.value = false
      selectedProjectId.value = ''
    }
  } catch (err) {
    console.error('Error adding to project:', err)
  }
}

async function removeFromProject(projectId) {
  if (!confirm('Remove this subcontractor from the project?')) return
  try {
    const res = await fetch(`/api/subcontractors/${sub.value.id}/projects/${projectId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      await fetchProjects()
    }
  } catch (err) {
    console.error('Error removing from project:', err)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatCurrency = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

const isExpiringSoon = (date) => {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  return d - now < thirtyDays
}

const isExpired = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

function getStatusClass(status) {
  const classes = {
    ACTIVE: 'bg-green-100 text-green-700',
    PREFERRED: 'bg-forest-100 text-forest-700',
    PROBATION: 'bg-yellow-100 text-yellow-700',
    INACTIVE: 'bg-charcoal-100 text-charcoal-600',
    BLACKLISTED: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-charcoal-100 text-charcoal-600'
}

function getProjectStatusClass(status) {
  const classes = {
    PLANNING: 'bg-gray-100 text-gray-700',
    FUNDED: 'bg-blue-100 text-blue-700',
    CONSTRUCTION: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div>
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-charcoal-400 hover:text-charcoal-500 mb-6"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Back to Subcontractors
    </button>
    
    <div v-if="subcontractorsStore.loading" class="text-center py-12">
      Loading...
    </div>
    
    <div v-else-if="sub" class="grid lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Info Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-heading font-bold">{{ sub.companyName }}</h1>
              <p class="text-charcoal-400">{{ sub.contactName }}</p>
            </div>
            <button 
              v-if="!editingContact"
              @click="startEditContact" 
              class="btn-secondary btn-sm"
            >
              <PencilSquareIcon class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <!-- View Mode -->
          <dl v-if="!editingContact" class="grid sm:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-charcoal-400">Trade</dt>
              <dd class="font-medium">{{ sub.trade }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Phone</dt>
              <dd class="font-medium">{{ sub.phone || '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Email</dt>
              <dd class="font-medium">{{ sub.email || '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">License #</dt>
              <dd class="font-medium">{{ sub.licenseNumber || '-' }}</dd>
            </div>
            <div v-if="sub.address" class="sm:col-span-2">
              <dt class="text-sm text-charcoal-400">Address</dt>
              <dd class="font-medium">{{ sub.address }}, {{ sub.city }}, {{ sub.state }}</dd>
            </div>
          </dl>
          
          <!-- Edit Mode -->
          <form v-else @submit.prevent="saveContact" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Company Name</label>
                <input v-model="contactForm.companyName" type="text" class="input" required />
              </div>
              <div>
                <label class="label">Contact Name</label>
                <input v-model="contactForm.contactName" type="text" class="input" required />
              </div>
              <div>
                <label class="label">Trade</label>
                <select v-model="contactForm.trade" class="input">
                  <option v-for="t in tradeOptions" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <label class="label">Phone</label>
                <input v-model="contactForm.phone" type="tel" class="input" required />
              </div>
              <div>
                <label class="label">Email</label>
                <input v-model="contactForm.email" type="email" class="input" />
              </div>
              <div>
                <label class="label">License #</label>
                <input v-model="contactForm.licenseNumber" type="text" class="input" />
              </div>
              <div class="sm:col-span-2">
                <label class="label">Address</label>
                <input v-model="contactForm.address" type="text" class="input" placeholder="Street address" />
              </div>
              <div>
                <label class="label">City</label>
                <input v-model="contactForm.city" type="text" class="input" />
              </div>
              <div>
                <label class="label">State</label>
                <input v-model="contactForm.state" type="text" class="input" maxlength="2" />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingContact = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Compliance Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold">Compliance</h2>
            <button 
              v-if="!editingCompliance"
              @click="startEditCompliance" 
              class="btn-secondary btn-sm"
            >
              <PencilSquareIcon class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <!-- View Mode -->
          <dl v-if="!editingCompliance" class="grid sm:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-charcoal-400">License Expiry</dt>
              <dd class="font-medium flex items-center gap-2">
                {{ formatDate(sub.licenseExpiry) }}
                <ExclamationTriangleIcon 
                  v-if="isExpired(sub.licenseExpiry)" 
                  class="w-5 h-5 text-red-500" 
                  title="Expired"
                />
                <ExclamationTriangleIcon 
                  v-else-if="isExpiringSoon(sub.licenseExpiry)" 
                  class="w-5 h-5 text-yellow-500" 
                  title="Expiring soon"
                />
              </dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Insurance Expiry</dt>
              <dd class="font-medium flex items-center gap-2">
                {{ formatDate(sub.insuranceExpiry) }}
                <ExclamationTriangleIcon 
                  v-if="isExpired(sub.insuranceExpiry)" 
                  class="w-5 h-5 text-red-500" 
                  title="Expired"
                />
                <ExclamationTriangleIcon 
                  v-else-if="isExpiringSoon(sub.insuranceExpiry)" 
                  class="w-5 h-5 text-yellow-500" 
                  title="Expiring soon"
                />
              </dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Bond Amount</dt>
              <dd class="font-medium">{{ formatCurrency(sub.bondAmount) }}</dd>
            </div>
          </dl>
          
          <!-- Edit Mode -->
          <form v-else @submit.prevent="saveCompliance" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="label">License Expiry</label>
                <input v-model="complianceForm.licenseExpiry" type="date" class="input" />
              </div>
              <div>
                <label class="label">Insurance Expiry</label>
                <input v-model="complianceForm.insuranceExpiry" type="date" class="input" />
              </div>
              <div>
                <label class="label">Bond Amount</label>
                <input v-model.number="complianceForm.bondAmount" type="number" class="input" placeholder="0" />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingCompliance = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Rates Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold">Rates</h2>
            <button 
              v-if="!editingRates"
              @click="startEditRates" 
              class="btn-secondary btn-sm"
            >
              <PencilSquareIcon class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <!-- View Mode -->
          <dl v-if="!editingRates" class="grid sm:grid-cols-3 gap-4">
            <div>
              <dt class="text-sm text-charcoal-400">Hourly Rate</dt>
              <dd class="font-medium">{{ sub.hourlyRate ? formatCurrency(sub.hourlyRate) + '/hr' : '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Day Rate</dt>
              <dd class="font-medium">{{ sub.dayRate ? formatCurrency(sub.dayRate) + '/day' : '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Preferred Payment</dt>
              <dd class="font-medium">{{ sub.preferredPayment || '-' }}</dd>
            </div>
          </dl>
          
          <!-- Edit Mode -->
          <form v-else @submit.prevent="saveRates" class="space-y-4">
            <div class="grid sm:grid-cols-3 gap-4">
              <div>
                <label class="label">Hourly Rate ($)</label>
                <input v-model.number="ratesForm.hourlyRate" type="number" class="input" placeholder="0" />
              </div>
              <div>
                <label class="label">Day Rate ($)</label>
                <input v-model.number="ratesForm.dayRate" type="number" class="input" placeholder="0" />
              </div>
              <div>
                <label class="label">Preferred Payment</label>
                <select v-model="ratesForm.preferredPayment" class="input">
                  <option value="">Select...</option>
                  <option v-for="p in paymentOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingRates = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Projects Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold">Assigned Projects</h2>
            <button @click="showAddProjectModal = true" class="btn-primary btn-sm">
              <PlusIcon class="w-4 h-4 mr-1" />
              Add to Project
            </button>
          </div>
          
          <div v-if="loadingProjects" class="text-center py-4 text-charcoal-400">
            Loading projects...
          </div>
          <div v-else-if="projects.length === 0" class="text-center py-8 text-charcoal-400">
            <BuildingOffice2Icon class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Not assigned to any projects yet</p>
          </div>
          <div v-else class="divide-y divide-sand-200">
            <div 
              v-for="proj in projects" 
              :key="proj.id"
              class="py-3 flex items-center justify-between"
            >
              <div>
                <router-link :to="`/projects/${proj.id}`" class="font-medium text-forest-600 hover:underline">
                  {{ proj.name }}
                </router-link>
                <p class="text-sm text-charcoal-400">{{ proj.address || 'No address' }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span :class="['text-xs px-2 py-1 rounded-full', getProjectStatusClass(proj.status)]">
                  {{ proj.status }}
                </span>
                <button 
                  @click="removeFromProject(proj.id)"
                  class="text-charcoal-400 hover:text-red-500"
                  title="Remove from project"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Performance Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold">Performance</h2>
            <button 
              v-if="!editingPerformance"
              @click="startEditPerformance" 
              class="btn-secondary btn-sm"
            >
              <PencilSquareIcon class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <!-- View Mode -->
          <dl v-if="!editingPerformance" class="space-y-3">
            <div class="flex justify-between items-center">
              <dt class="text-charcoal-400">Status</dt>
              <dd>
                <span :class="['text-xs px-2 py-1 rounded-full font-medium', getStatusClass(sub.status)]">
                  {{ sub.status }}
                </span>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-charcoal-400">Rating</dt>
              <dd class="text-yellow-500">
                {{ sub.rating ? '★'.repeat(sub.rating) + '☆'.repeat(5 - sub.rating) : '-' }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-charcoal-400">Reliability</dt>
              <dd class="font-medium">{{ sub.reliabilityScore ? sub.reliabilityScore + '%' : '-' }}</dd>
            </div>
            <div v-if="sub.notes" class="pt-3 border-t border-sand-200">
              <dt class="text-charcoal-400 text-sm mb-1">Notes</dt>
              <dd class="text-sm">{{ sub.notes }}</dd>
            </div>
          </dl>
          
          <!-- Edit Mode -->
          <form v-else @submit.prevent="savePerformance" class="space-y-4">
            <div>
              <label class="label">Status</label>
              <select v-model="performanceForm.status" class="input">
                <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="label">Rating (1-5)</label>
              <select v-model.number="performanceForm.rating" class="input">
                <option value="">No rating</option>
                <option v-for="n in 5" :key="n" :value="n">{{ '★'.repeat(n) }} ({{ n }})</option>
              </select>
            </div>
            <div>
              <label class="label">Reliability Score (%)</label>
              <input v-model.number="performanceForm.reliabilityScore" type="number" min="0" max="100" class="input" />
            </div>
            <div>
              <label class="label">Notes</label>
              <textarea v-model="performanceForm.notes" class="input" rows="3"></textarea>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingPerformance = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Quick Stats -->
        <div class="card">
          <h2 class="text-lg font-heading font-bold mb-4">Activity</h2>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-charcoal-400">Total Bids</dt>
              <dd class="font-medium">{{ sub.bids?.length || 0 }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-charcoal-400">Projects Assigned</dt>
              <dd class="font-medium">{{ projects.length }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-charcoal-400">Member Since</dt>
              <dd class="font-medium">{{ formatDate(sub.createdAt) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    
    <!-- Add to Project Modal -->
    <div v-if="showAddProjectModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Add to Project</h3>
        <div class="mb-4">
          <label class="label">Select Project</label>
          <select v-model="selectedProjectId" class="input">
            <option value="">Choose a project...</option>
            <option 
              v-for="proj in availableProjects.filter(p => !projects.find(ap => ap.id === p.id))" 
              :key="proj.id" 
              :value="proj.id"
            >
              {{ proj.name }} ({{ proj.status }})
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-3">
          <button @click="showAddProjectModal = false" class="btn-secondary">Cancel</button>
          <button @click="addToProject" :disabled="!selectedProjectId" class="btn-primary">
            Add to Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
