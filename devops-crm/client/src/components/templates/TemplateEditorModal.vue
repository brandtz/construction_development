<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTemplatesStore } from '@/stores/templates'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import {
  XMarkIcon,
  EyeIcon,
  CodeBracketIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  template: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const templatesStore = useTemplatesStore()

const form = ref({
  name: '',
  description: '',
  category: 'GENERAL',
  content: '',
  isActive: true,
})

const showPreview = ref(false)
const previewData = ref({})
const saving = ref(false)
const extractedVariables = ref([])
const editorRef = ref(null)
const showSourceCode = ref(false)

const isEditing = computed(() => !!props.template)
const title = computed(() => isEditing.value ? 'Edit Template' : 'Create Template')

// Common variables that can be inserted
const commonVariables = [
  { name: 'investor.firstName', description: 'Investor first name' },
  { name: 'investor.lastName', description: 'Investor last name' },
  { name: 'investor.fullName', description: 'Investor full name' },
  { name: 'investor.email', description: 'Investor email' },
  { name: 'investor.company', description: 'Investor company' },
  { name: 'investor.investmentCapacity', description: 'Investment capacity' },
  { name: 'project.name', description: 'Project name' },
  { name: 'project.address', description: 'Project address' },
  { name: 'investment.amount', description: 'Investment amount' },
  { name: 'investment.date', description: 'Investment date' },
  { name: 'company.name', description: 'Your company name' },
  { name: 'company.address', description: 'Your company address' },
  { name: 'date.today', description: 'Today\'s date' },
  { name: 'date.year', description: 'Current year' },
]

onMounted(() => {
  if (props.template) {
    form.value = {
      name: props.template.name,
      description: props.template.description || '',
      category: props.template.category,
      content: props.template.content,
      isActive: props.template.isActive,
    }
    extractVariables()
  }
})

watch(() => form.value.content, () => {
  extractVariables()
})

function extractVariables() {
  const regex = /\{\{([^}]+)\}\}/g
  const matches = form.value.content.matchAll(regex)
  const vars = new Set()
  for (const match of matches) {
    vars.add(match[1].trim())
  }
  extractedVariables.value = Array.from(vars)
  
  // Initialize preview data for each variable
  extractedVariables.value.forEach(v => {
    if (!previewData.value[v]) {
      previewData.value[v] = ''
    }
  })
}

function insertVariable(varName) {
  const variableText = `{{${varName}}}`
  if (editorRef.value) {
    editorRef.value.insertText(variableText)
  } else {
    form.value.content += variableText
  }
  extractVariables()
}

function getPreviewHtml() {
  let html = form.value.content
  for (const [key, value] of Object.entries(previewData.value)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    html = html.replace(regex, value || `[${key}]`)
  }
  return html
}

async function handleSubmit() {
  if (!form.value.name.trim() || !form.value.content.trim()) {
    alert('Please fill in the required fields')
    return
  }
  
  saving.value = true
  
  try {
    if (isEditing.value) {
      await templatesStore.updateTemplate(props.template.id, form.value)
    } else {
      await templatesStore.createTemplate(form.value)
    }
    emit('saved')
  } catch (error) {
    console.error('Error saving template:', error)
    alert('Failed to save template')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-sand-200">
        <h2 class="text-xl font-bold">{{ title }}</h2>
        <button @click="emit('close')" class="text-charcoal-400 hover:text-charcoal-600">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Left Side: Form -->
        <div class="flex-1 overflow-y-auto p-6 border-r border-sand-200">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Template Name *</label>
                <input v-model="form.name" type="text" class="input" placeholder="e.g., Welcome Letter" />
              </div>
              <div>
                <label class="label">Category</label>
                <select v-model="form.category" class="input">
                  <option v-for="cat in templatesStore.categories" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="label">Description</label>
              <input v-model="form.description" type="text" class="input" placeholder="Brief description of this template" />
            </div>
            
            <!-- Content Editor -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="label mb-0">Content *</label>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="showSourceCode = !showSourceCode"
                    :class="['text-sm flex items-center gap-1', showSourceCode ? 'text-amber-600' : 'text-charcoal-500 hover:text-charcoal-700']"
                  >
                    <CodeBracketIcon class="w-4 h-4" />
                    {{ showSourceCode ? 'Visual Editor' : 'HTML Source' }}
                  </button>
                  <button
                    type="button"
                    @click="showPreview = !showPreview"
                    :class="['text-sm flex items-center gap-1', showPreview ? 'text-forest-600' : 'text-charcoal-500 hover:text-charcoal-700']"
                  >
                    <EyeIcon class="w-4 h-4" />
                    {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
                  </button>
                </div>
              </div>
              
              <div :class="['grid gap-4', showPreview ? 'grid-cols-2' : '']">
                <div>
                  <!-- Source Code View -->
                  <textarea
                    v-if="showSourceCode"
                    v-model="form.content"
                    class="input font-mono text-sm"
                    rows="14"
                    placeholder="Enter HTML content... Use {{variable}} for dynamic content"
                  ></textarea>
                  
                  <!-- Rich Text Editor -->
                  <RichTextEditor
                    v-else
                    ref="editorRef"
                    v-model="form.content"
                    placeholder="Start writing your template content... Use the Insert Variable panel on the right to add dynamic fields."
                  />
                  
                  <!-- Extracted Variables -->
                  <div v-if="extractedVariables.length > 0" class="mt-2 text-xs text-charcoal-500">
                    <span class="font-medium">Variables used:</span>
                    <span v-for="(v, idx) in extractedVariables" :key="v">
                      {{ v }}{{ idx < extractedVariables.length - 1 ? ', ' : '' }}
                    </span>
                  </div>
                </div>
                
                <!-- Preview -->
                <div v-if="showPreview" class="bg-sand-50 rounded-lg p-4 overflow-auto max-h-[400px] border border-sand-200">
                  <div class="text-xs text-charcoal-400 uppercase tracking-wide mb-2 pb-2 border-b border-sand-200">Live Preview</div>
                  <div class="prose prose-sm max-w-none" v-html="getPreviewHtml()"></div>
                </div>
              </div>
            </div>
            
            <!-- Active Toggle -->
            <div class="flex items-center gap-2">
              <input
                v-model="form.isActive"
                type="checkbox"
                id="isActive"
                class="w-4 h-4 rounded border-sand-300 text-forest-600 focus:ring-forest-500"
              />
              <label for="isActive" class="text-sm">Template is active and available for use</label>
            </div>
          </form>
        </div>
        
        <!-- Right Sidebar: Variables & Preview Data -->
        <div class="w-72 overflow-y-auto p-6 bg-sand-50">
          <h3 class="font-semibold mb-3 text-sm uppercase text-charcoal-500">Insert Variable</h3>
          <p class="text-xs text-charcoal-400 mb-3">Click to insert a variable at cursor position</p>
          <div class="space-y-1 mb-6">
            <button
              v-for="variable in commonVariables"
              :key="variable.name"
              type="button"
              @click="insertVariable(variable.name)"
              class="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-sand-100 flex items-center justify-between group"
            >
              <span class="font-mono text-xs text-forest-600">{{ variable.name }}</span>
              <PlusIcon class="w-4 h-4 text-charcoal-400 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          
          <!-- Preview Data Inputs -->
          <div v-if="showPreview && extractedVariables.length > 0">
            <h3 class="font-semibold mb-3 text-sm uppercase text-charcoal-500">Preview Data</h3>
            <div class="space-y-3">
              <div v-for="v in extractedVariables" :key="v">
                <label class="label text-xs">{{ v }}</label>
                <input
                  v-model="previewData[v]"
                  type="text"
                  class="input text-sm"
                  :placeholder="v"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-sand-200 bg-sand-50">
        <button type="button" @click="emit('close')" class="btn-secondary">Cancel</button>
        <button
          @click="handleSubmit"
          :disabled="saving || !form.name.trim() || !form.content.trim()"
          class="btn-primary"
        >
          {{ saving ? 'Saving...' : isEditing ? 'Update Template' : 'Create Template' }}
        </button>
      </div>
    </div>
  </div>
</template>
