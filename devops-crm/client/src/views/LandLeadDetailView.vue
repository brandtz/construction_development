<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { 
  ArrowLeftIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  TrashIcon,
  MapPinIcon,
  HomeModernIcon,
  UserIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const lead = ref(null)
const loading = ref(true)
const deleting = ref(false)

// Edit states
const editingLocation = ref(false)
const editingProperty = ref(false)
const editingOwner = ref(false)
const editingDeal = ref(false)

// Form data
const locationForm = ref({})
const propertyForm = ref({})
const ownerForm = ref({})
const dealForm = ref({})

// Projects for assignment
const projects = ref([])
const showStatusLegend = ref(false)

const statusOptions = [
  'NEW', 'RESEARCHING', 'CONTACTED', 'NEGOTIATING', 
  'UNDER_CONTRACT', 'DUE_DILIGENCE', 'CLOSED', 'PASSED', 'LOST'
]

const statusLegend = {
  NEW: { label: 'New', description: 'Fresh lead, not yet evaluated', color: 'bg-gray-100 text-gray-700' },
  RESEARCHING: { label: 'Researching', description: 'Gathering info on property & owner', color: 'bg-blue-100 text-blue-700' },
  CONTACTED: { label: 'Contacted', description: 'Initial contact made with owner', color: 'bg-purple-100 text-purple-700' },
  NEGOTIATING: { label: 'Negotiating', description: 'Active price/terms negotiation', color: 'bg-yellow-100 text-yellow-700' },
  UNDER_CONTRACT: { label: 'Under Contract', description: 'Purchase agreement signed', color: 'bg-orange-100 text-orange-700' },
  DUE_DILIGENCE: { label: 'Due Diligence', description: 'Inspections & title review', color: 'bg-indigo-100 text-indigo-700' },
  CLOSED: { label: 'Closed', description: 'Property acquired successfully', color: 'bg-green-100 text-green-700' },
  PASSED: { label: 'Passed', description: 'Decided not to pursue', color: 'bg-charcoal-100 text-charcoal-600' },
  LOST: { label: 'Lost', description: 'Lost to another buyer or unavailable', color: 'bg-red-100 text-red-700' },
}

const zoningOptions = ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Mixed-Use', 'R-1', 'R-2', 'R-3', 'C-1', 'C-2', 'M-1', 'Other']
const sourceOptions = ['MLS', 'Redfin', 'Zillow', 'Direct Mail', 'Cold Call', 'Referral', 'Driving for Dollars', 'Auction', 'County Records', 'Other']

onMounted(async () => {
  await loadLead()
  await loadProjects()
})

async function loadLead() {
  loading.value = true
  try {
    const response = await api.get(`/land-leads/${route.params.id}`)
    lead.value = response.data
  } catch (err) {
    console.error('Failed to load land lead:', err)
  } finally {
    loading.value = false
  }
}

async function loadProjects() {
  try {
    const response = await api.get('/projects?limit=100')
    projects.value = response.data.data || []
  } catch (err) {
    console.error('Failed to load projects:', err)
  }
}

// Generate external listing URLs
function getListingUrls(lead) {
  if (!lead.address) return []
  
  const addressEncoded = encodeURIComponent(`${lead.address}, ${lead.city || ''}, ${lead.state || 'OR'} ${lead.zip || ''}`.trim())
  const addressForZillow = `${lead.address}, ${lead.city || ''}, ${lead.state || 'OR'} ${lead.zip || ''}`.replace(/\s+/g, '-').replace(/[,#]/g, '')
  
  return [
    { name: 'Zillow', url: `https://www.zillow.com/homes/${encodeURIComponent(addressForZillow)}_rb/`, icon: '🏠' },
    { name: 'Redfin', url: `https://www.redfin.com/search?search=${addressEncoded}`, icon: '🔴' },
    { name: 'Realtor', url: `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(lead.city || '')}~${lead.state || 'OR'}/type-land`, icon: '🏡' },
    { name: 'County Records', url: `https://www.google.com/search?q=${encodeURIComponent(`${lead.city || ''} ${lead.state || 'OR'} county assessor parcel search`)}`, icon: '📋' },
    { name: 'LandWatch', url: `https://www.landwatch.com/search?search=${addressEncoded}`, icon: '🌲' },
  ]
}

// Generate Google Maps embed URL
function getMapEmbedUrl(lead) {
  if (!lead.address) return null
  const address = `${lead.address}, ${lead.city || ''}, ${lead.state || 'OR'} ${lead.zip || ''}`.trim()
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=17&output=embed`
}

// Status change
async function changeStatus(newStatus) {
  try {
    const response = await api.put(`/land-leads/${lead.value.id}`, { status: newStatus })
    lead.value = { ...lead.value, ...response.data }
  } catch (err) {
    console.error('Failed to change status:', err)
  }
}

// Location editing
function startEditLocation() {
  locationForm.value = {
    address: lead.value.address || '',
    city: lead.value.city || '',
    state: lead.value.state || 'OR',
    zip: lead.value.zip || '',
    parcelId: lead.value.parcelId || '',
  }
  editingLocation.value = true
}

async function saveLocation() {
  try {
    const response = await api.put(`/land-leads/${lead.value.id}`, locationForm.value)
    lead.value = { ...lead.value, ...response.data }
    editingLocation.value = false
  } catch (err) {
    console.error('Failed to save location:', err)
  }
}

// Property editing
function startEditProperty() {
  propertyForm.value = {
    acreage: lead.value.acreage || '',
    zoning: lead.value.zoning || '',
    utilities: lead.value.utilities || '',
    topography: lead.value.topography || '',
    source: lead.value.source || '',
    notes: lead.value.notes || '',
  }
  editingProperty.value = true
}

async function saveProperty() {
  try {
    const response = await api.put(`/land-leads/${lead.value.id}`, propertyForm.value)
    lead.value = { ...lead.value, ...response.data }
    editingProperty.value = false
  } catch (err) {
    console.error('Failed to save property:', err)
  }
}

// Owner editing
function startEditOwner() {
  ownerForm.value = {
    ownerName: lead.value.ownerName || '',
    ownerPhone: lead.value.ownerPhone || '',
    ownerEmail: lead.value.ownerEmail || '',
    ownerAddress: lead.value.ownerAddress || '',
  }
  editingOwner.value = true
}

async function saveOwner() {
  try {
    const response = await api.put(`/land-leads/${lead.value.id}`, ownerForm.value)
    lead.value = { ...lead.value, ...response.data }
    editingOwner.value = false
  } catch (err) {
    console.error('Failed to save owner:', err)
  }
}

// Deal editing
function startEditDeal() {
  dealForm.value = {
    askingPrice: lead.value.askingPrice || '',
    estimatedValue: lead.value.estimatedValue || '',
    pricePerAcre: lead.value.pricePerAcre || '',
    projectId: lead.value.projectId || '',
  }
  editingDeal.value = true
}

async function saveDeal() {
  try {
    const response = await api.put(`/land-leads/${lead.value.id}`, dealForm.value)
    lead.value = { ...lead.value, ...response.data }
    editingDeal.value = false
  } catch (err) {
    console.error('Failed to save deal:', err)
  }
}

// Delete lead
async function deleteLead() {
  if (!confirm('Are you sure you want to delete this land lead? This action cannot be undone.')) return
  
  deleting.value = true
  try {
    await api.delete(`/land-leads/${lead.value.id}`)
    router.push('/land-leads')
  } catch (err) {
    console.error('Failed to delete lead:', err)
    alert('Failed to delete land lead')
  } finally {
    deleting.value = false
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

const computedPricePerAcre = computed(() => {
  if (lead.value?.pricePerAcre) return lead.value.pricePerAcre
  if (lead.value?.askingPrice && lead.value?.acreage) {
    return lead.value.askingPrice / lead.value.acreage
  }
  return null
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <button 
        @click="router.back()" 
        class="flex items-center gap-2 text-charcoal-400 hover:text-charcoal-500"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Back to Land Leads
      </button>
      
      <button 
        v-if="lead"
        @click="deleteLead" 
        :disabled="deleting"
        class="btn-secondary btn-sm text-red-600 hover:bg-red-50"
      >
        <TrashIcon class="w-4 h-4 mr-1" />
        {{ deleting ? 'Deleting...' : 'Delete Lead' }}
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-12">Loading...</div>
    
    <div v-else-if="lead" class="space-y-6">
      <!-- Status Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-heading font-bold">Lead Status</h2>
          <button @click="showStatusLegend = !showStatusLegend" class="text-charcoal-400 hover:text-forest-600 flex items-center gap-1 text-sm">
            <InformationCircleIcon class="w-4 h-4" />
            {{ showStatusLegend ? 'Hide' : 'Show' }} Legend
          </button>
        </div>
        
        <div class="flex items-center gap-4 mb-4">
          <span class="text-charcoal-500">Current Status:</span>
          <div class="relative">
            <select 
              :value="lead.status" 
              @change="changeStatus($event.target.value)"
              :class="['appearance-none cursor-pointer font-medium pl-3 pr-8 py-2 rounded-full text-sm border-2 border-transparent hover:border-forest-300 focus:border-forest-500 focus:outline-none', statusLegend[lead.status]?.color || 'bg-gray-100']"
            >
              <option v-for="s in statusOptions" :key="s" :value="s">{{ statusLegend[s]?.label || s }}</option>
            </select>
            <ChevronDownIcon class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
          </div>
        </div>
        
        <div v-if="showStatusLegend" class="border-t border-sand-200 pt-4">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="(info, status) in statusLegend" :key="status" class="flex items-start gap-2 p-2 rounded-lg hover:bg-sand-50">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', info.color]">{{ info.label }}</span>
              <span class="text-xs text-charcoal-500">{{ info.description }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- External Listings Section -->
      <div class="card">
        <h2 class="text-lg font-heading font-bold mb-4 flex items-center gap-2">
          <ArrowTopRightOnSquareIcon class="w-5 h-5 text-charcoal-400" />
          External Listings & Research
        </h2>
        <p class="text-sm text-charcoal-400 mb-4">
          Search for this property on listing sites (note: these sites don't allow embedding, so links open in new tabs):
        </p>
        <div class="flex flex-wrap gap-2">
          <a 
            v-for="link in getListingUrls(lead)" 
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-sand-50 hover:bg-sand-100 rounded-full text-sm font-medium text-charcoal-600 transition-colors"
          >
            <span>{{ link.icon }}</span>
            {{ link.name }}
            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5 opacity-50" />
          </a>
        </div>
      </div>
      
      <!-- Google Maps Embed -->
      <div class="card">
        <h2 class="text-lg font-heading font-bold mb-4 flex items-center gap-2">
          <MapPinIcon class="w-5 h-5 text-charcoal-400" />
          Property Location
        </h2>
        <div class="relative w-full h-80 rounded-lg overflow-hidden bg-sand-100">
          <iframe
            v-if="getMapEmbedUrl(lead)"
            :src="getMapEmbedUrl(lead)"
            class="absolute inset-0 w-full h-full border-0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div v-else class="flex items-center justify-center h-full text-charcoal-400">
            No address available for map
          </div>
        </div>
        <p class="text-xs text-charcoal-400 mt-2">
          Satellite view • 
          <a 
            :href="`https://www.google.com/maps/search/${encodeURIComponent(lead.address + ', ' + (lead.city || '') + ', ' + (lead.state || 'OR'))}`"
            target="_blank"
            class="text-forest-600 hover:underline"
          >
            Open in Google Maps ↗
          </a>
        </p>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Location Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-charcoal-400" />
              Location
            </h2>
            <button v-if="!editingLocation" @click="startEditLocation" class="btn-secondary btn-sm">
              <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
            </button>
          </div>
          
          <dl v-if="!editingLocation" class="space-y-3">
            <div>
              <dt class="text-sm text-charcoal-400">Address</dt>
              <dd class="font-medium">{{ lead.address }}</dd>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <dt class="text-sm text-charcoal-400">City</dt>
                <dd class="font-medium">{{ lead.city || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">State</dt>
                <dd class="font-medium">{{ lead.state }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">ZIP</dt>
                <dd class="font-medium">{{ lead.zip || '-' }}</dd>
              </div>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Parcel ID</dt>
              <dd class="font-medium">{{ lead.parcelId || '-' }}</dd>
            </div>
          </dl>
          
          <form v-else @submit.prevent="saveLocation" class="space-y-4">
            <div>
              <label class="label">Address</label>
              <input v-model="locationForm.address" type="text" class="input" required />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="label">City</label>
                <input v-model="locationForm.city" type="text" class="input" />
              </div>
              <div>
                <label class="label">State</label>
                <input v-model="locationForm.state" type="text" class="input" maxlength="2" />
              </div>
              <div>
                <label class="label">ZIP</label>
                <input v-model="locationForm.zip" type="text" class="input" />
              </div>
            </div>
            <div>
              <label class="label">Parcel ID</label>
              <input v-model="locationForm.parcelId" type="text" class="input" placeholder="County parcel/APN number" />
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingLocation = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" /> Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Property Details Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <HomeModernIcon class="w-5 h-5 text-charcoal-400" />
              Property Details
            </h2>
            <button v-if="!editingProperty" @click="startEditProperty" class="btn-secondary btn-sm">
              <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
            </button>
          </div>
          
          <dl v-if="!editingProperty" class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-charcoal-400">Acreage</dt>
                <dd class="font-medium">{{ lead.acreage ? `${lead.acreage} acres` : '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Zoning</dt>
                <dd class="font-medium">{{ lead.zoning || '-' }}</dd>
              </div>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Utilities</dt>
              <dd class="font-medium">{{ lead.utilities || '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Topography</dt>
              <dd class="font-medium">{{ lead.topography || '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Lead Source</dt>
              <dd class="font-medium">{{ lead.source || '-' }}</dd>
            </div>
            <div v-if="lead.notes">
              <dt class="text-sm text-charcoal-400">Notes</dt>
              <dd class="text-sm whitespace-pre-wrap">{{ lead.notes }}</dd>
            </div>
          </dl>
          
          <form v-else @submit.prevent="saveProperty" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Acreage</label>
                <input v-model.number="propertyForm.acreage" type="number" step="0.01" class="input" />
              </div>
              <div>
                <label class="label">Zoning</label>
                <select v-model="propertyForm.zoning" class="input">
                  <option value="">Select...</option>
                  <option v-for="z in zoningOptions" :key="z" :value="z">{{ z }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="label">Utilities</label>
              <input v-model="propertyForm.utilities" type="text" class="input" placeholder="e.g., Water, Sewer, Electric at street" />
            </div>
            <div>
              <label class="label">Topography</label>
              <input v-model="propertyForm.topography" type="text" class="input" placeholder="e.g., Flat, Sloped, Wooded" />
            </div>
            <div>
              <label class="label">Lead Source</label>
              <select v-model="propertyForm.source" class="input">
                <option value="">Select...</option>
                <option v-for="s in sourceOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="label">Notes</label>
              <textarea v-model="propertyForm.notes" class="input" rows="3"></textarea>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingProperty = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" /> Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Owner Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <UserIcon class="w-5 h-5 text-charcoal-400" />
              Owner Information
            </h2>
            <button v-if="!editingOwner" @click="startEditOwner" class="btn-secondary btn-sm">
              <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
            </button>
          </div>
          
          <dl v-if="!editingOwner" class="space-y-3">
            <div>
              <dt class="text-sm text-charcoal-400">Owner Name</dt>
              <dd class="font-medium">{{ lead.ownerName || '-' }}</dd>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-charcoal-400">Phone</dt>
                <dd class="font-medium">
                  <a v-if="lead.ownerPhone" :href="`tel:${lead.ownerPhone}`" class="text-forest-600 hover:underline">
                    {{ lead.ownerPhone }}
                  </a>
                  <span v-else>-</span>
                </dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Email</dt>
                <dd class="font-medium">
                  <a v-if="lead.ownerEmail" :href="`mailto:${lead.ownerEmail}`" class="text-forest-600 hover:underline">
                    {{ lead.ownerEmail }}
                  </a>
                  <span v-else>-</span>
                </dd>
              </div>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Mailing Address</dt>
              <dd class="font-medium">{{ lead.ownerAddress || '-' }}</dd>
            </div>
          </dl>
          
          <form v-else @submit.prevent="saveOwner" class="space-y-4">
            <div>
              <label class="label">Owner Name</label>
              <input v-model="ownerForm.ownerName" type="text" class="input" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Phone</label>
                <input v-model="ownerForm.ownerPhone" type="tel" class="input" />
              </div>
              <div>
                <label class="label">Email</label>
                <input v-model="ownerForm.ownerEmail" type="email" class="input" />
              </div>
            </div>
            <div>
              <label class="label">Mailing Address</label>
              <input v-model="ownerForm.ownerAddress" type="text" class="input" placeholder="Owner's mailing address" />
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingOwner = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" /> Save
              </button>
            </div>
          </form>
        </div>
        
        <!-- Deal Section -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-bold flex items-center gap-2">
              <CurrencyDollarIcon class="w-5 h-5 text-charcoal-400" />
              Deal Information
            </h2>
            <button v-if="!editingDeal" @click="startEditDeal" class="btn-secondary btn-sm">
              <PencilSquareIcon class="w-4 h-4 mr-1" /> Edit
            </button>
          </div>
          
          <dl v-if="!editingDeal" class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-charcoal-400">Asking Price</dt>
                <dd class="font-medium text-lg">{{ formatCurrency(lead.askingPrice) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Estimated Value</dt>
                <dd class="font-medium text-lg text-forest-600">{{ formatCurrency(lead.estimatedValue) }}</dd>
              </div>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Price per Acre</dt>
              <dd class="font-medium">{{ computedPricePerAcre ? formatCurrency(computedPricePerAcre) + '/acre' : '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-charcoal-400">Linked Project</dt>
              <dd class="font-medium">
                <router-link v-if="lead.project" :to="`/projects/${lead.project.id}`" class="text-forest-600 hover:underline">
                  {{ lead.project.name }}
                </router-link>
                <span v-else class="text-charcoal-400">Not linked to a project</span>
              </dd>
            </div>
            <div class="pt-2 border-t border-sand-200">
              <dt class="text-sm text-charcoal-400">Created</dt>
              <dd class="text-sm">{{ formatDate(lead.createdAt) }}</dd>
            </div>
          </dl>
          
          <form v-else @submit.prevent="saveDeal" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Asking Price ($)</label>
                <input v-model.number="dealForm.askingPrice" type="number" class="input" />
              </div>
              <div>
                <label class="label">Estimated Value ($)</label>
                <input v-model.number="dealForm.estimatedValue" type="number" class="input" />
              </div>
            </div>
            <div>
              <label class="label">Price per Acre ($)</label>
              <input v-model.number="dealForm.pricePerAcre" type="number" class="input" placeholder="Auto-calculated if left blank" />
            </div>
            <div>
              <label class="label">Link to Project</label>
              <select v-model="dealForm.projectId" class="input">
                <option value="">Not linked</option>
                <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="editingDeal = false" class="btn-secondary btn-sm">
                <XMarkIcon class="w-4 h-4 mr-1" /> Cancel
              </button>
              <button type="submit" class="btn-primary btn-sm">
                <CheckIcon class="w-4 h-4 mr-1" /> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
