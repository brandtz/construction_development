<template>
  <div>
    <div v-if="investmentsStore.loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading investments...</div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="investment in investmentsStore.investments"
          :key="investment.id"
          :to="`/investments/${investment.id}`"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-heading font-bold text-lg">{{ investment.project?.name }}</h3>
                <p class="text-gray-500 text-sm">
                  {{ investment.project?.address || investment.project?.city }}
                </p>
              </div>
              <span
                class="inline-flex px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(investment.status)"
              >
                {{ investment.status }}
              </span>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-500 text-xs">Investment</p>
                <p class="font-semibold text-lg">{{ formatCurrency(investment.amount) }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Type</p>
                <p class="font-medium">{{ investment.type }}</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Distributions</span>
                <span class="font-medium text-green-600">
                  {{ formatCurrency(getTotalDistributions(investment)) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm mt-1">
                <span class="text-gray-500">Project Status</span>
                <span class="font-medium">{{ investment.project?.status }}</span>
              </div>
            </div>
            
            <div v-if="investment.interestRate" class="mt-4 text-sm text-gray-600">
              Interest Rate: {{ investment.interestRate }}%
            </div>
            <div v-if="investment.equityPercent" class="mt-4 text-sm text-gray-600">
              Equity: {{ investment.equityPercent }}%
            </div>
          </div>
        </router-link>
      </div>
      
      <div v-if="investmentsStore.investments.length === 0" class="card p-12 text-center">
        <CurrencyDollarIcon class="w-12 h-12 text-gray-300 mx-auto" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">No investments yet</h3>
        <p class="mt-2 text-gray-500">Your investments will appear here once they're recorded in the system.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInvestmentsStore } from '../stores/portal'
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'

const investmentsStore = useInvestmentsStore()

onMounted(() => {
  investmentsStore.fetchInvestments()
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0)
}

function getTotalDistributions(investment) {
  return investment.distributions?.reduce((sum, d) => sum + d.amount, 0) || 0
}

function getStatusClass(status) {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    FUNDED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    DISTRIBUTING: 'bg-purple-100 text-purple-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    DEFAULTED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
