<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTemplatesStore } from '@/stores/templates'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
  FunnelIcon,
} from '@heroicons/vue/24/outline'

const templatesStore = useTemplatesStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const templateToDelete = ref(null)
const editingTemplate = ref(null)

onMounted(() => {
  templatesStore.fetchTemplates()
  templatesStore.fetchCategories()
})

const filteredTemplates = computed(() => {
  let result = templatesStore.templates
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(t => t.category === selectedCategory.value)
  }
  
  return result
})

function getCategoryLabel(value) {
  const cat = templatesStore.categories.find(c => c.value === value)
  return cat?.label || value
}

function getCategoryColor(category) {
  const colors = {
    INVESTOR_PACKET: 'bg-blue-100 text-blue-700',
    SUBSCRIPTION_AGREEMENT: 'bg-purple-100 text-purple-700',
    OPERATING_AGREEMENT: 'bg-indigo-100 text-indigo-700',
    PPM: 'bg-red-100 text-red-700',
    WELCOME_LETTER: 'bg-green-100 text-green-700',
    TAX_DOCUMENT: 'bg-yellow-100 text-yellow-700',
    DISTRIBUTION_NOTICE: 'bg-emerald-100 text-emerald-700',
    PROJECT_UPDATE: 'bg-forest-100 text-forest-700',
    GENERAL: 'bg-gray-100 text-gray-700',
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function openCreateModal() {
  editingTemplate.value = null
  showCreateModal.value = true
}

function openEditModal(template) {
  editingTemplate.value = template
  showCreateModal.value = true
}

function confirmDelete(template) {
  templateToDelete.value = template
  showDeleteModal.value = true
}

async function handleDelete() {
  if (templateToDelete.value) {
    await templatesStore.deleteTemplate(templateToDelete.value.id)
    showDeleteModal.value = false
    templateToDelete.value = null
  }
}

async function handleDuplicate(template) {
  await templatesStore.duplicateTemplate(template.id)
}

function handleSaved() {
  showCreateModal.value = false
  editingTemplate.value = null
  templatesStore.fetchTemplates()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-heading font-bold">Document Templates</h1>
        <p class="text-charcoal-500">Manage reusable document templates for investors</p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        New Template
      </button>
    </div>
    
    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            class="input pl-10"
          />
        </div>
        <div class="sm:w-64">
          <select v-model="selectedCategory" class="input">
            <option value="">All Categories</option>
            <option v-for="cat in templatesStore.categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Loading -->
    <div v-if="templatesStore.loading" class="text-center py-12 text-charcoal-500">
      Loading templates...
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredTemplates.length === 0" class="card text-center py-12">
      <DocumentTextIcon class="w-12 h-12 text-charcoal-300 mx-auto" />
      <h3 class="mt-4 text-lg font-medium">No templates found</h3>
      <p class="text-charcoal-500 mt-2">
        {{ searchQuery || selectedCategory ? 'Try adjusting your filters' : 'Create your first template to get started' }}
      </p>
      <button v-if="!searchQuery && !selectedCategory" @click="openCreateModal" class="btn-primary mt-4">
        <PlusIcon class="w-5 h-5 mr-2" />
        Create Template
      </button>
    </div>
    
    <!-- Templates Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <span :class="['text-xs font-medium px-2 py-1 rounded-full', getCategoryColor(template.category)]">
            {{ getCategoryLabel(template.category) }}
          </span>
          <span v-if="!template.isActive" class="text-xs bg-charcoal-100 text-charcoal-600 px-2 py-1 rounded-full">
            Inactive
          </span>
        </div>
        
        <h3 class="font-bold text-lg mb-1">{{ template.name }}</h3>
        <p v-if="template.description" class="text-charcoal-500 text-sm mb-3 line-clamp-2">
          {{ template.description }}
        </p>
        
        <div class="text-xs text-charcoal-400 mb-4">
          Updated {{ formatDate(template.updatedAt) }} · v{{ template.version }}
        </div>
        
        <div class="flex items-center gap-2 pt-3 border-t border-sand-200">
          <button
            @click="openEditModal(template)"
            class="flex-1 btn-secondary btn-sm justify-center"
          >
            <PencilSquareIcon class="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            @click="handleDuplicate(template)"
            class="btn-secondary btn-sm"
            title="Duplicate"
          >
            <DocumentDuplicateIcon class="w-4 h-4" />
          </button>
          <button
            @click="confirmDelete(template)"
            class="btn-secondary btn-sm text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <TemplateEditorModal
      v-if="showCreateModal"
      :template="editingTemplate"
      @close="showCreateModal = false"
      @saved="handleSaved"
    />
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-2">Delete Template</h3>
        <p class="text-charcoal-600 mb-6">
          Are you sure you want to delete "{{ templateToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          <button @click="handleDelete" class="btn-primary bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateEditorModal from '@/components/templates/TemplateEditorModal.vue'

export default {
  components: { TemplateEditorModal }
}
</script>
