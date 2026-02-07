<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvestorsStore } from '@/stores/investors'
import api from '@/services/api'
import InvestorModal from '@/components/investors/InvestorModal.vue'
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const investorsStore = useInvestorsStore()

const activeTab = ref('overview')
const messages = ref([])
const documents = ref([])
const loadingMessages = ref(false)
const loadingDocuments = ref(false)

// Edit modal
const showEditModal = ref(false)

// Message response modal
const showResponseModal = ref(false)
const selectedMessage = ref(null)
const responseText = ref('')
const sendingResponse = ref(false)

// Document upload modal
const showUploadModal = ref(false)
const uploadForm = ref({
  name: '',
  description: '',
  category: 'INVESTOR_PACKET',
  isPublic: false,
  file: null
})
const uploading = ref(false)

const documentCategories = [
  { value: 'INVESTOR_PACKET', label: 'Investor Packet' },
  { value: 'SUBSCRIPTION_AGREEMENT', label: 'Subscription Agreement' },
  { value: 'TAX_DOCUMENT', label: 'Tax Document' },
  { value: 'K1_FORM', label: 'K-1 Form' },
  { value: 'DISTRIBUTION_NOTICE', label: 'Distribution Notice' },
  { value: 'PROJECT_UPDATE', label: 'Project Update' },
  { value: 'LEGAL', label: 'Legal Document' },
  { value: 'OTHER', label: 'Other' },
]

onMounted(async () => {
  await investorsStore.fetchInvestor(route.params.id)
  fetchMessages()
  fetchDocuments()
})

async function fetchMessages() {
  loadingMessages.value = true
  try {
    const response = await api.get(`/investors/${route.params.id}/messages`)
    messages.value = response.data.messages || []
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  } finally {
    loadingMessages.value = false
  }
}

async function fetchDocuments() {
  loadingDocuments.value = true
  try {
    const response = await api.get(`/documents?investorId=${route.params.id}`)
    documents.value = response.data.data || []
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  } finally {
    loadingDocuments.value = false
  }
}

function openResponseModal(message) {
  selectedMessage.value = message
  responseText.value = ''
  showResponseModal.value = true
}

async function sendResponse() {
  if (!responseText.value.trim()) return
  
  sendingResponse.value = true
  try {
    await api.post(`/investors/${route.params.id}/messages/${selectedMessage.value.id}/respond`, {
      response: responseText.value
    })
    showResponseModal.value = false
    fetchMessages()
  } catch (error) {
    console.error('Failed to send response:', error)
    alert('Failed to send response. Please try again.')
  } finally {
    sendingResponse.value = false
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    uploadForm.value.file = file
    if (!uploadForm.value.name) {
      uploadForm.value.name = file.name
    }
  }
}

async function uploadDocument() {
  if (!uploadForm.value.file) {
    alert('Please select a file')
    return
  }
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('name', uploadForm.value.name || uploadForm.value.file.name)
    formData.append('description', uploadForm.value.description)
    formData.append('category', uploadForm.value.category)
    formData.append('isPublic', uploadForm.value.isPublic)
    formData.append('investorId', route.params.id)
    
    await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    showUploadModal.value = false
    uploadForm.value = { name: '', description: '', category: 'INVESTOR_PACKET', isPublic: false, file: null }
    fetchDocuments()
  } catch (error) {
    console.error('Failed to upload document:', error)
    alert('Failed to upload document. Please try again.')
  } finally {
    uploading.value = false
  }
}

const unreadMessages = computed(() => messages.value.filter(m => m.status === 'PENDING').length)

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

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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

const getCategoryLabel = (category) => {
  const cat = documentCategories.find(c => c.value === category)
  return cat?.label || category
}

async function handleInvestorSaved() {
  showEditModal.value = false
  await investorsStore.fetchInvestor(route.params.id)
}
</script>

<template>
  <div>
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-charcoal-400 hover:text-charcoal-500 mb-6"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      Back to Investors
    </button>
    
    <div v-if="investorsStore.loading" class="text-center py-12">
      Loading...
    </div>
    
    <div v-else-if="investorsStore.currentInvestor">
      <!-- Header -->
      <div class="card mb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-heading font-bold">
              {{ investorsStore.currentInvestor.firstName }} {{ investorsStore.currentInvestor.lastName }}
            </h1>
            <p class="text-charcoal-400">{{ investorsStore.currentInvestor.company }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['badge', getStatusColor(investorsStore.currentInvestor.status)]">
              {{ investorsStore.currentInvestor.status.replace('_', ' ') }}
            </span>
            <button @click="showEditModal = true" class="btn-secondary btn-sm">
              <PencilSquareIcon class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
        </div>
        
        <div class="grid sm:grid-cols-3 gap-4">
          <div class="flex items-center gap-3">
            <EnvelopeIcon class="w-5 h-5 text-charcoal-400" />
            <a :href="`mailto:${investorsStore.currentInvestor.email}`" class="text-forest-600 hover:underline">
              {{ investorsStore.currentInvestor.email }}
            </a>
          </div>
          <div v-if="investorsStore.currentInvestor.phone" class="flex items-center gap-3">
            <PhoneIcon class="w-5 h-5 text-charcoal-400" />
            <a :href="`tel:${investorsStore.currentInvestor.phone}`" class="text-forest-600 hover:underline">
              {{ investorsStore.currentInvestor.phone }}
            </a>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-charcoal-400">Committed:</span>
            <span class="font-bold text-forest-600">{{ formatCurrency(investorsStore.currentInvestor.committedAmount) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="border-b border-sand-200 mb-6">
        <nav class="flex gap-8">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'py-3 border-b-2 font-medium transition-colors',
              activeTab === 'overview' 
                ? 'border-forest-500 text-forest-600' 
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            ]"
          >
            Overview
          </button>
          <button
            @click="activeTab = 'messages'"
            :class="[
              'py-3 border-b-2 font-medium transition-colors flex items-center gap-2',
              activeTab === 'messages' 
                ? 'border-forest-500 text-forest-600' 
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            ]"
          >
            <ChatBubbleLeftRightIcon class="w-5 h-5" />
            Messages
            <span v-if="unreadMessages > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {{ unreadMessages }}
            </span>
          </button>
          <button
            @click="activeTab = 'documents'"
            :class="[
              'py-3 border-b-2 font-medium transition-colors flex items-center gap-2',
              activeTab === 'documents' 
                ? 'border-forest-500 text-forest-600' 
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            ]"
          >
            <DocumentTextIcon class="w-5 h-5" />
            Documents
            <span class="bg-charcoal-200 text-charcoal-600 text-xs rounded-full px-2 py-0.5">
              {{ documents.length }}
            </span>
          </button>
        </nav>
      </div>
      
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="grid lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Investment Details -->
          <div class="card">
            <h2 class="text-lg font-heading font-bold mb-4">Investment Details</h2>
            <dl class="grid sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-charcoal-400">Accredited Status</dt>
                <dd class="font-medium">{{ investorsStore.currentInvestor.accreditedStatus?.replace('_', ' ') || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Investment Capacity</dt>
                <dd class="font-medium">{{ investorsStore.currentInvestor.investmentCapacity || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Preferred Structure</dt>
                <dd class="font-medium">{{ investorsStore.currentInvestor.preferredStructure || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Source</dt>
                <dd class="font-medium">{{ investorsStore.currentInvestor.source || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Committed Amount</dt>
                <dd class="font-medium text-forest-600">{{ formatCurrency(investorsStore.currentInvestor.committedAmount) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-charcoal-400">Committed Date</dt>
                <dd class="font-medium">{{ formatDate(investorsStore.currentInvestor.committedDate) }}</dd>
              </div>
            </dl>
          </div>
          
          <!-- Notes -->
          <div v-if="investorsStore.currentInvestor.notes" class="card">
            <h2 class="text-lg font-heading font-bold mb-4">Notes</h2>
            <p class="whitespace-pre-wrap">{{ investorsStore.currentInvestor.notes }}</p>
          </div>
          
          <!-- Investments -->
          <div v-if="investorsStore.currentInvestor.investments?.length" class="card">
            <h2 class="text-lg font-heading font-bold mb-4">Investments</h2>
            <div class="space-y-3">
              <div 
                v-for="inv in investorsStore.currentInvestor.investments" 
                :key="inv.id"
                class="p-4 bg-sand-50 rounded-lg"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ inv.project?.name }}</span>
                  <span class="font-bold text-forest-600">{{ formatCurrency(inv.amount) }}</span>
                </div>
                <p class="text-sm text-charcoal-400 mt-1">{{ inv.type }} · {{ inv.status }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Sidebar -->
        <div class="space-y-6">
          <div class="card">
            <h2 class="text-lg font-heading font-bold mb-4">Activity</h2>
            <div class="space-y-4">
              <div 
                v-for="activity in investorsStore.currentInvestor.activities" 
                :key="activity.id"
                class="border-b border-sand-100 pb-4 last:border-0 last:pb-0"
              >
                <p class="font-medium">{{ activity.subject }}</p>
                <p class="text-sm text-charcoal-400 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-charcoal-400 mt-2">
                  {{ activity.createdBy?.name }} · {{ formatDate(activity.createdAt) }}
                </p>
              </div>
              <div v-if="!investorsStore.currentInvestor.activities?.length" class="text-charcoal-400 text-center py-4">
                No activity yet
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Messages Tab -->
      <div v-if="activeTab === 'messages'">
        <div v-if="loadingMessages" class="text-center py-12 text-charcoal-400">
          Loading messages...
        </div>
        
        <div v-else-if="messages.length === 0" class="card text-center py-12">
          <ChatBubbleLeftRightIcon class="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 class="mt-4 text-lg font-medium">No Messages</h3>
          <p class="text-charcoal-400 mt-2">Messages from this investor will appear here.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="card"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold">{{ message.subject }}</h3>
                  <span 
                    :class="[
                      'badge text-xs',
                      message.status === 'PENDING' ? 'badge-yellow' : 
                      message.status === 'RESPONDED' ? 'badge-green' : 'badge-gray'
                    ]"
                  >
                    {{ message.status }}
                  </span>
                </div>
                <p class="text-sm text-charcoal-400">{{ formatDateTime(message.createdAt) }}</p>
              </div>
              
              <button
                v-if="message.status === 'PENDING'"
                @click="openResponseModal(message)"
                class="btn-primary btn-sm"
              >
                <PaperAirplaneIcon class="w-4 h-4 mr-1" />
                Respond
              </button>
            </div>
            
            <div class="bg-sand-50 rounded-lg p-4 mb-3">
              <p class="whitespace-pre-wrap">{{ message.message }}</p>
            </div>
            
            <div v-if="message.response" class="border-l-4 border-forest-500 pl-4">
              <p class="text-sm text-charcoal-400 mb-1">
                Response from {{ message.respondedBy?.name }} · {{ formatDateTime(message.respondedAt) }}
              </p>
              <p class="whitespace-pre-wrap">{{ message.response }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Documents Tab -->
      <div v-if="activeTab === 'documents'">
        <div class="flex justify-end mb-4">
          <button @click="showUploadModal = true" class="btn-primary">
            <ArrowUpTrayIcon class="w-5 h-5 mr-2" />
            Upload Document
          </button>
        </div>
        
        <div v-if="loadingDocuments" class="text-center py-12 text-charcoal-400">
          Loading documents...
        </div>
        
        <div v-else-if="documents.length === 0" class="card text-center py-12">
          <DocumentTextIcon class="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 class="mt-4 text-lg font-medium">No Documents</h3>
          <p class="text-charcoal-400 mt-2">Upload documents for this investor.</p>
        </div>
        
        <div v-else class="card">
          <div class="divide-y divide-sand-100">
            <div 
              v-for="doc in documents" 
              :key="doc.id"
              class="p-4 flex items-center justify-between hover:bg-sand-50"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-forest-100 text-forest-600 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="font-medium">{{ doc.name }}</h4>
                  <p class="text-sm text-charcoal-400">
                    {{ getCategoryLabel(doc.category) }} · {{ formatFileSize(doc.size) }} · {{ formatDate(doc.createdAt) }}
                  </p>
                  <p v-if="doc.description" class="text-sm text-charcoal-500 mt-1">{{ doc.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="doc.isPublic" class="badge badge-green text-xs">Visible to Investor</span>
                <a 
                  :href="`/api/documents/${doc.id}/download`"
                  class="btn-secondary btn-sm"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Response Modal -->
    <div v-if="showResponseModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-heading font-bold">Respond to Message</h3>
          <button @click="showResponseModal = false" class="text-charcoal-400 hover:text-charcoal-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="bg-sand-50 rounded-lg p-3 mb-4">
          <p class="text-sm font-medium">{{ selectedMessage?.subject }}</p>
          <p class="text-sm text-charcoal-500 mt-1">{{ selectedMessage?.message }}</p>
        </div>
        
        <div class="mb-4">
          <label class="label">Your Response</label>
          <textarea
            v-model="responseText"
            class="input"
            rows="4"
            placeholder="Type your response..."
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-3">
          <button @click="showResponseModal = false" class="btn-secondary">Cancel</button>
          <button @click="sendResponse" :disabled="sendingResponse" class="btn-primary">
            <span v-if="sendingResponse">Sending...</span>
            <span v-else>Send Response</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-heading font-bold">Upload Document</h3>
          <button @click="showUploadModal = false" class="text-charcoal-400 hover:text-charcoal-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="uploadDocument" class="space-y-4">
          <div>
            <label class="label">File</label>
            <input
              type="file"
              @change="handleFileSelect"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              class="input"
              required
            />
          </div>
          
          <div>
            <label class="label">Document Name</label>
            <input v-model="uploadForm.name" type="text" class="input" placeholder="e.g., K-1 Form 2025" />
          </div>
          
          <div>
            <label class="label">Category</label>
            <select v-model="uploadForm.category" class="input">
              <option v-for="cat in documentCategories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="label">Description (Optional)</label>
            <textarea v-model="uploadForm.description" class="input" rows="2"></textarea>
          </div>
          
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              v-model="uploadForm.isPublic" 
              id="isPublic"
              class="w-4 h-4 text-forest-600 border-charcoal-300 rounded focus:ring-forest-500"
            />
            <label for="isPublic" class="text-sm text-charcoal-600">
              Make visible to investor in portal
            </label>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showUploadModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" :disabled="uploading" class="btn-primary">
              <span v-if="uploading">Uploading...</span>
              <span v-else>Upload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Edit Investor Modal -->
    <InvestorModal
      v-if="showEditModal"
      :investor="investorsStore.currentInvestor"
      @close="showEditModal = false"
      @saved="handleInvestorSaved"
    />
  </div>
</template>
