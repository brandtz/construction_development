<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInvestorsStore } from '@/stores/investors'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  investor: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const investorsStore = useInvestorsStore()

const loading = ref(false)
const error = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  accreditedStatus: 'UNKNOWN',
  investmentCapacity: '',
  preferredStructure: '',
  status: 'LEAD',
  source: '',
  notes: '',
})

const isEditing = computed(() => !!props.investor)

onMounted(() => {
  if (props.investor) {
    form.value = {
      firstName: props.investor.firstName || '',
      lastName: props.investor.lastName || '',
      email: props.investor.email || '',
      phone: props.investor.phone || '',
      company: props.investor.company || '',
      accreditedStatus: props.investor.accreditedStatus || 'UNKNOWN',
      investmentCapacity: props.investor.investmentCapacity || '',
      preferredStructure: props.investor.preferredStructure || '',
      status: props.investor.status || 'LEAD',
      source: props.investor.source || '',
      notes: props.investor.notes || '',
    }
  }
})

const handleSubmit = async () => {
  if (!form.value.firstName || !form.value.lastName || !form.value.email) {
    error.value = 'Please fill in required fields'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    if (isEditing.value) {
      await investorsStore.updateInvestor(props.investor.id, form.value)
    } else {
      await investorsStore.createInvestor(form.value)
    }
    emit('saved')
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save investor'
  } finally {
    loading.value = false
  }
}

const accreditedOptions = [
  { value: 'UNKNOWN', label: 'Unknown' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'SELF_REPORTED', label: 'Self-Reported' },
  { value: 'NOT_ACCREDITED', label: 'Not Accredited' },
]

const statusOptions = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'MEETING_SCHEDULED', label: 'Meeting Scheduled' },
  { value: 'REVIEWING_DOCS', label: 'Reviewing Docs' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'COMMITTED', label: 'Committed' },
  { value: 'FUNDED', label: 'Funded' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const capacityOptions = [
  '$0 - $10K',
  '$10K - $50K',
  '$50K - $100K',
  '$100K - $250K',
  '$250K - $500K',
  '$500K - $1M',
  '$1M+',
]
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-charcoal-500/50" @click="emit('close')" />
      
      <!-- Modal -->
      <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white px-6 py-4 border-b border-sand-200 flex items-center justify-between">
          <h2 class="text-xl font-heading font-bold">
            {{ isEditing ? 'Edit Investor' : 'Add Investor' }}
          </h2>
          <button @click="emit('close')" class="p-1 hover:bg-sand-100 rounded">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div v-if="error" class="p-3 bg-terracotta-50 border border-terracotta-200 rounded-lg text-terracotta-700 text-sm">
            {{ error }}
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">First Name *</label>
              <input v-model="form.firstName" type="text" class="input" required />
            </div>
            <div>
              <label class="label">Last Name *</label>
              <input v-model="form.lastName" type="text" class="input" required />
            </div>
          </div>
          
          <div>
            <label class="label">Email *</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Phone</label>
              <input v-model="form.phone" type="tel" class="input" />
            </div>
            <div>
              <label class="label">Company</label>
              <input v-model="form.company" type="text" class="input" />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Status</label>
              <select v-model="form.status" class="input">
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">Accredited Status</label>
              <select v-model="form.accreditedStatus" class="input">
                <option v-for="opt in accreditedOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Investment Capacity</label>
              <select v-model="form.investmentCapacity" class="input">
                <option value="">Select...</option>
                <option v-for="cap in capacityOptions" :key="cap" :value="cap">
                  {{ cap }}
                </option>
              </select>
            </div>
            <div>
              <label class="label">Preferred Structure</label>
              <input v-model="form.preferredStructure" type="text" class="input" placeholder="Equity, Debt, etc." />
            </div>
          </div>
          
          <div>
            <label class="label">Source</label>
            <input v-model="form.source" type="text" class="input" placeholder="Referral, Website, etc." />
          </div>
          
          <div>
            <label class="label">Notes</label>
            <textarea v-model="form.notes" rows="3" class="input" />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="button" @click="emit('close')" class="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
