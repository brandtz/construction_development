<template>
  <div>
    <!-- Category Filter -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="selectedCategory = cat.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="selectedCategory === cat.value 
            ? 'bg-forest-500 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>
    
    <div v-if="documentsStore.loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading documents...</div>
    </div>
    
    <div v-else>
      <div class="card">
        <div class="divide-y divide-gray-100">
          <div
            v-for="doc in documentsStore.documents"
            :key="doc.id"
            class="p-6 hover:bg-gray-50 flex items-center justify-between"
          >
            <div class="flex items-start">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="getCategoryColor(doc.category)"
              >
                <DocumentTextIcon class="w-5 h-5" />
              </div>
              <div class="ml-4">
                <h3 class="font-medium">{{ doc.name }}</h3>
                <p class="text-gray-500 text-sm">
                  {{ getCategoryLabel(doc.category) }}
                  <span v-if="doc.project"> • {{ doc.project.name }}</span>
                </p>
                <p v-if="doc.description" class="text-gray-600 text-sm mt-1">{{ doc.description }}</p>
                <p class="text-gray-400 text-xs mt-1">
                  Uploaded {{ formatDate(doc.createdAt) }} • {{ formatFileSize(doc.size) }}
                </p>
              </div>
            </div>
            
            <a
              :href="`/api/investor/documents/${doc.id}/download`"
              class="btn-secondary btn-sm"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-1" />
              Download
            </a>
          </div>
          
          <div v-if="documentsStore.documents.length === 0" class="p-12 text-center">
            <DocumentTextIcon class="w-12 h-12 text-gray-300 mx-auto" />
            <h3 class="mt-4 text-lg font-medium text-gray-900">No documents</h3>
            <p class="mt-2 text-gray-500">
              {{ selectedCategory ? 'No documents in this category' : 'Your documents will appear here' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useDocumentsStore } from '../stores/portal'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const documentsStore = useDocumentsStore()

const selectedCategory = ref(null)

const categories = [
  { value: null, label: 'All Documents' },
  { value: 'INVESTOR_PACKET', label: 'Investor Packets' },
  { value: 'SUBSCRIPTION_AGREEMENT', label: 'Agreements' },
  { value: 'TAX_DOCUMENT', label: 'Tax Documents' },
  { value: 'K1_FORM', label: 'K-1 Forms' },
  { value: 'DISTRIBUTION_NOTICE', label: 'Distributions' },
  { value: 'PROJECT_UPDATE', label: 'Project Updates' },
]

watch(selectedCategory, (value) => {
  documentsStore.fetchDocuments(value)
})

onMounted(() => {
  documentsStore.fetchDocuments()
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getCategoryLabel(category) {
  const cat = categories.find(c => c.value === category)
  return cat?.label || category
}

function getCategoryColor(category) {
  const colors = {
    INVESTOR_PACKET: 'bg-blue-100 text-blue-600',
    SUBSCRIPTION_AGREEMENT: 'bg-purple-100 text-purple-600',
    TAX_DOCUMENT: 'bg-yellow-100 text-yellow-600',
    K1_FORM: 'bg-yellow-100 text-yellow-600',
    DISTRIBUTION_NOTICE: 'bg-green-100 text-green-600',
    PROJECT_UPDATE: 'bg-forest-100 text-forest-600',
  }
  return colors[category] || 'bg-gray-100 text-gray-600'
}
</script>
