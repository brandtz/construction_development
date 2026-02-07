<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { PlusIcon } from '@heroicons/vue/24/outline'

const buyers = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/buyers')
    buyers.value = response.data.data
  } catch (err) {
    console.error('Failed to load buyers:', err)
  } finally {
    loading.value = false
  }
})

const getStatusColor = (status) => {
  const colors = {
    INQUIRY: 'badge-gray',
    SHOWING_SCHEDULED: 'badge-yellow',
    SHOWED: 'badge-yellow',
    OFFER_RECEIVED: 'badge-yellow',
    UNDER_CONTRACT: 'badge-green',
    CLOSED: 'badge-green',
    LOST: 'badge-red',
  }
  return colors[status] || 'badge-gray'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-heading font-bold">Buyers</h1>
      <button class="btn btn-primary">
        <PlusIcon class="w-5 h-5" />
        Add Buyer
      </button>
    </div>
    
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sand-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Name</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Project</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-charcoal-500">Source</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-sand-100">
            <tr v-for="buyer in buyers" :key="buyer.id" class="hover:bg-sand-50">
              <td class="px-4 py-4">
                <p class="font-medium">{{ buyer.firstName }} {{ buyer.lastName }}</p>
                <p class="text-sm text-charcoal-400">{{ buyer.email }}</p>
              </td>
              <td class="px-4 py-4 text-sm">{{ buyer.project?.name || '-' }}</td>
              <td class="px-4 py-4">
                <span :class="['badge', getStatusColor(buyer.status)]">
                  {{ buyer.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">{{ buyer.source || '-' }}</td>
            </tr>
            <tr v-if="!buyers.length && !loading">
              <td colspan="4" class="px-4 py-8 text-center text-charcoal-400">
                No buyers yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
