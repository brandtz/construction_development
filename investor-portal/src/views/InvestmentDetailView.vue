<template>
  <div>
    <router-link to="/investments" class="text-forest-600 hover:text-forest-700 text-sm mb-6 inline-flex items-center">
      <ArrowLeftIcon class="w-4 h-4 mr-1" />
      Back to Investments
    </router-link>
    
    <div v-if="investmentsStore.loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading investment details...</div>
    </div>
    
    <div v-else-if="investment" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Project Info -->
        <div class="card p-6">
          <h2 class="text-2xl font-heading font-bold mb-2">{{ investment.project?.name }}</h2>
          <p class="text-gray-600">
            {{ investment.project?.address }}<br />
            {{ investment.project?.city }}, {{ investment.project?.state }} {{ investment.project?.zip }}
          </p>
          
          <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p class="text-gray-500 text-sm">Your Investment</p>
              <p class="text-2xl font-bold text-forest-600">{{ formatCurrency(investment.amount) }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Investment Type</p>
              <p class="text-lg font-semibold">{{ investment.type }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Status</p>
              <span
                class="inline-flex px-2 py-1 text-sm rounded-full mt-1"
                :class="getStatusClass(investment.status)"
              >
                {{ investment.status }}
              </span>
            </div>
            <div v-if="investment.interestRate">
              <p class="text-gray-500 text-sm">Interest Rate</p>
              <p class="text-lg font-semibold">{{ investment.interestRate }}%</p>
            </div>
            <div v-if="investment.equityPercent">
              <p class="text-gray-500 text-sm">Equity Stake</p>
              <p class="text-lg font-semibold">{{ investment.equityPercent }}%</p>
            </div>
          </div>
          
          <div v-if="investment.terms" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Terms</p>
            <p class="text-gray-600 mt-1">{{ investment.terms }}</p>
          </div>
        </div>
        
        <!-- Distributions -->
        <div class="card">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="font-heading font-bold text-lg">Distributions</h3>
              <div class="text-right">
                <p class="text-sm text-gray-500">Total Received</p>
                <p class="text-xl font-bold text-green-600">{{ formatCurrency(totalDistributions) }}</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div
              v-for="dist in investment.distributions"
              :key="dist.id"
              class="p-6 flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ getDistributionTypeLabel(dist.type) }}</p>
                <p class="text-gray-500 text-sm">{{ formatDate(dist.date) }}</p>
                <p v-if="dist.notes" class="text-gray-600 text-sm mt-1">{{ dist.notes }}</p>
              </div>
              <p class="text-lg font-semibold text-green-600">
                +{{ formatCurrency(dist.amount) }}
              </p>
            </div>
            
            <div v-if="!investment.distributions?.length" class="p-6 text-center text-gray-500">
              No distributions yet
            </div>
          </div>
        </div>
        
        <!-- Project Details -->
        <div class="card p-6">
          <h3 class="font-heading font-bold text-lg mb-4">Project Details</h3>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-gray-500 text-sm">Project Status</p>
              <p class="font-medium">{{ investment.project?.status }}</p>
            </div>
            <div v-if="investment.project?.startDate">
              <p class="text-gray-500 text-sm">Start Date</p>
              <p class="font-medium">{{ formatDate(investment.project.startDate) }}</p>
            </div>
            <div v-if="investment.project?.targetEndDate">
              <p class="text-gray-500 text-sm">Target Completion</p>
              <p class="font-medium">{{ formatDate(investment.project.targetEndDate) }}</p>
            </div>
            <div v-if="investment.project?.targetSalePrice">
              <p class="text-gray-500 text-sm">Target Sale Price</p>
              <p class="font-medium">{{ formatCurrency(investment.project.targetSalePrice) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Timeline -->
        <div class="card p-6">
          <h3 class="font-heading font-bold text-lg mb-4">Timeline</h3>
          
          <div class="space-y-4">
            <div v-if="investment.fundedDate" class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon class="w-5 h-5 text-green-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium">Investment Funded</p>
                <p class="text-gray-500 text-sm">{{ formatDate(investment.fundedDate) }}</p>
              </div>
            </div>
            
            <div v-if="investment.maturityDate" class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CalendarIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <p class="font-medium">Maturity Date</p>
                <p class="text-gray-500 text-sm">{{ formatDate(investment.maturityDate) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Documents -->
        <div class="card">
          <div class="p-6 border-b border-gray-100">
            <h3 class="font-heading font-bold text-lg">Documents</h3>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div
              v-for="doc in investment.investmentDocuments"
              :key="doc.id"
              class="p-4 hover:bg-gray-50"
            >
              <div class="flex items-start">
                <DocumentTextIcon class="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-sm truncate">{{ doc.name }}</p>
                  <p class="text-gray-500 text-xs">{{ formatDate(doc.createdAt) }}</p>
                </div>
                <a
                  :href="`/api/investor/documents/${doc.id}/download`"
                  class="text-forest-600 hover:text-forest-700 text-sm"
                >
                  Download
                </a>
              </div>
            </div>
            
            <div v-if="!investment.investmentDocuments?.length" class="p-4 text-center text-gray-500 text-sm">
              No documents attached
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="card p-12 text-center">
      <p class="text-gray-500">Investment not found</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useInvestmentsStore } from '../stores/portal'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const investmentsStore = useInvestmentsStore()

const investment = computed(() => investmentsStore.currentInvestment)

const totalDistributions = computed(() => {
  return investment.value?.distributions?.reduce((sum, d) => sum + d.amount, 0) || 0
})

onMounted(() => {
  investmentsStore.fetchInvestment(route.params.id)
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
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

function getDistributionTypeLabel(type) {
  const labels = {
    RETURN_OF_CAPITAL: 'Return of Capital',
    PROFIT_DISTRIBUTION: 'Profit Distribution',
    INTEREST_PAYMENT: 'Interest Payment',
    FINAL_DISTRIBUTION: 'Final Distribution'
  }
  return labels[type] || type
}
</script>
