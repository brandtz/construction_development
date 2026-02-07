<template>
  <div>
    <!-- Loading State -->
    <div v-if="dashboardStore.loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading dashboard...</div>
    </div>
    
    <!-- Dashboard Content -->
    <div v-else-if="dashboardStore.data">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <p class="text-gray-500 text-sm font-medium">Total Invested</p>
          <p class="text-3xl font-heading font-bold text-forest-600 mt-2">
            {{ formatCurrency(dashboardStore.data.summary.totalInvested) }}
          </p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm font-medium">Total Distributions</p>
          <p class="text-3xl font-heading font-bold text-forest-600 mt-2">
            {{ formatCurrency(dashboardStore.data.summary.totalDistributions) }}
          </p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm font-medium">Net Position</p>
          <p class="text-3xl font-heading font-bold mt-2" :class="dashboardStore.data.summary.netPosition >= 0 ? 'text-green-600' : 'text-gray-600'">
            {{ formatCurrency(dashboardStore.data.summary.netPosition) }}
          </p>
        </div>
        
        <div class="card p-6">
          <p class="text-gray-500 text-sm font-medium">Active Investments</p>
          <p class="text-3xl font-heading font-bold text-forest-600 mt-2">
            {{ dashboardStore.data.summary.activeInvestments }}
          </p>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Investments List -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h3 class="font-heading font-bold text-lg">Your Investments</h3>
                <router-link to="/investments" class="text-sm text-forest-600 hover:text-forest-700">
                  View all →
                </router-link>
              </div>
            </div>
            
            <div class="divide-y divide-gray-100">
              <div
                v-for="investment in dashboardStore.data.investments.slice(0, 5)"
                :key="investment.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium">{{ investment.project?.name || 'Project' }}</h4>
                    <p class="text-gray-500 text-sm">{{ investment.project?.city }}, {{ investment.project?.state }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold">{{ formatCurrency(investment.amount) }}</p>
                    <span
                      class="inline-flex px-2 py-1 text-xs rounded-full"
                      :class="getStatusClass(investment.status)"
                    >
                      {{ investment.status }}
                    </span>
                  </div>
                </div>
                
                <!-- Recent distributions -->
                <div v-if="investment.distributions.length > 0" class="mt-4 pt-4 border-t border-gray-100">
                  <p class="text-xs text-gray-500 mb-2">Recent Distributions</p>
                  <div class="space-y-1">
                    <div
                      v-for="dist in investment.distributions.slice(0, 2)"
                      :key="dist.id"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-gray-600">{{ formatDate(dist.date) }}</span>
                      <span class="text-green-600 font-medium">+{{ formatCurrency(dist.amount) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="dashboardStore.data.investments.length === 0" class="p-6 text-center text-gray-500">
                No investments yet
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Documents -->
          <div class="card">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h3 class="font-heading font-bold text-lg">Recent Documents</h3>
                <router-link to="/documents" class="text-sm text-forest-600 hover:text-forest-700">
                  View all →
                </router-link>
              </div>
            </div>
            
            <div class="divide-y divide-gray-100">
              <div
                v-for="doc in dashboardStore.data.recentDocuments"
                :key="doc.id"
                class="p-4 hover:bg-gray-50"
              >
                <div class="flex items-start">
                  <DocumentTextIcon class="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-sm truncate">{{ doc.name }}</p>
                    <p class="text-gray-500 text-xs">{{ formatDate(doc.createdAt) }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="!dashboardStore.data.recentDocuments?.length" class="p-4 text-center text-gray-500 text-sm">
                No documents yet
              </div>
            </div>
          </div>
          
          <!-- Recent Notifications -->
          <div class="card">
            <div class="p-6 border-b border-gray-100">
              <h3 class="font-heading font-bold text-lg">Recent Activity</h3>
            </div>
            
            <div class="divide-y divide-gray-100">
              <div
                v-for="notification in dashboardStore.data.notifications.slice(0, 5)"
                :key="notification.id"
                class="p-4"
                :class="{ 'bg-forest-50': !notification.read }"
              >
                <p class="font-medium text-sm">{{ notification.title }}</p>
                <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
                <p class="text-gray-400 text-xs mt-2">{{ formatDate(notification.createdAt) }}</p>
              </div>
              
              <div v-if="!dashboardStore.data.notifications?.length" class="p-4 text-center text-gray-500 text-sm">
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="dashboardStore.error" class="card p-6 text-center">
      <p class="text-red-600">{{ dashboardStore.error }}</p>
      <button @click="dashboardStore.fetchDashboard()" class="btn-primary mt-4">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '../stores/portal'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboard()
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
    month: 'short',
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
</script>
