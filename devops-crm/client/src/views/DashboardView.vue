<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import {
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  FolderIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.loadDashboard()
})

const formatCurrency = (value) => {
  if (!value) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
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

// Get link for an activity based on its entity type
const getActivityLink = (activity) => {
  if (activity.project) return `/projects/${activity.project.id}`
  if (activity.investor) return `/investors/${activity.investor.id}`
  if (activity.subcontractor) return `/subcontractors/${activity.subcontractor.id}`
  if (activity.landLead) return `/land-leads/${activity.landLead.id}`
  if (activity.buyer) return `/buyers/${activity.buyer.id}`
  if (activity.vendor) return `/vendors/${activity.vendor.id}`
  return null
}

// Get the entity name for an activity
const getActivityEntityName = (activity) => {
  if (activity.project) return activity.project.name
  if (activity.investor) return `${activity.investor.firstName} ${activity.investor.lastName}`
  if (activity.subcontractor) return activity.subcontractor.companyName
  if (activity.landLead) return activity.landLead.propertyAddress
  if (activity.buyer) return `${activity.buyer.firstName} ${activity.buyer.lastName}`
  if (activity.vendor) return activity.vendor.companyName
  return null
}

// Get the entity type label
const getActivityEntityType = (activity) => {
  if (activity.project) return 'Project'
  if (activity.investor) return 'Investor'
  if (activity.subcontractor) return 'Subcontractor'
  if (activity.landLead) return 'Land Lead'
  if (activity.buyer) return 'Buyer'
  if (activity.vendor) return 'Vendor'
  return null
}

// Using actual ProjectStatus enum values from schema
const getProjectStatusClass = (status) => {
  const classes = {
    'PLANNING': 'bg-gray-100 text-gray-700',
    'FUNDED': 'bg-green-100 text-green-700',
    'LAND_SEARCH': 'bg-blue-100 text-blue-700',
    'LAND_ACQUIRED': 'bg-indigo-100 text-indigo-700',
    'PERMITTING': 'bg-yellow-100 text-yellow-700',
    'CONSTRUCTION': 'bg-orange-100 text-orange-700',
    'COMPLETED': 'bg-green-100 text-green-700',
    'LISTED': 'bg-purple-100 text-purple-700',
    'UNDER_CONTRACT': 'bg-pink-100 text-pink-700',
    'SOLD': 'bg-emerald-100 text-emerald-700',
    'CANCELLED': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Using actual LandLeadStatus enum values from schema
const getLandLeadStatusClass = (status) => {
  const classes = {
    'NEW': 'bg-blue-100 text-blue-700',
    'RESEARCHING': 'bg-cyan-100 text-cyan-700',
    'CONTACTED': 'bg-yellow-100 text-yellow-700',
    'NEGOTIATING': 'bg-orange-100 text-orange-700',
    'UNDER_CONTRACT': 'bg-purple-100 text-purple-700',
    'DUE_DILIGENCE': 'bg-indigo-100 text-indigo-700',
    'CLOSED': 'bg-green-100 text-green-700',
    'PASSED': 'bg-gray-100 text-gray-600',
    'LOST': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-heading font-bold mb-6">Dashboard</h1>
    
    <!-- Stats Grid - Row 1 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/investors')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-forest-100 rounded-lg">
            <CurrencyDollarIcon class="w-6 h-6 text-forest-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Investor Pipeline</p>
            <p class="text-2xl font-bold">{{ formatCurrency(dashboardStore.stats?.investorPipelineValue) }}</p>
            <p class="text-xs text-charcoal-400">{{ dashboardStore.stats?.investorCount || 0 }} committed</p>
          </div>
        </div>
      </div>
      
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/projects')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-forest-100 rounded-lg">
            <BuildingOffice2Icon class="w-6 h-6 text-forest-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Projects</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.activeProjects || 0 }} <span class="text-sm font-normal text-charcoal-400">active</span></p>
            <p class="text-xs text-charcoal-400">{{ dashboardStore.stats?.totalProjects || 0 }} total</p>
          </div>
        </div>
      </div>
      
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/land-leads')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-terracotta-100 rounded-lg">
            <MapPinIcon class="w-6 h-6 text-terracotta-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Land Leads</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.activeLandLeads || 0 }} <span class="text-sm font-normal text-charcoal-400">active</span></p>
            <p class="text-xs text-charcoal-400">{{ dashboardStore.stats?.totalLandLeads || 0 }} total</p>
          </div>
        </div>
      </div>
      
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/subcontractors')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <ExclamationTriangleIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Expiring Licenses</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.expiringLicenses || 0 }}</p>
            <p class="text-xs text-charcoal-400">next 30 days</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Grid - Row 2 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/subcontractors')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-lg">
            <UserGroupIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Subcontractors</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.activeSubcontractors || 0 }} <span class="text-sm font-normal text-charcoal-400">active</span></p>
            <p class="text-xs text-charcoal-400">{{ dashboardStore.stats?.totalSubcontractors || 0 }} total</p>
          </div>
        </div>
      </div>
      
      <div class="card cursor-pointer hover:shadow-md transition-shadow" @click="navigateTo('/vendors')">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-100 rounded-lg">
            <TruckIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Vendors</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.activeVendors || 0 }} <span class="text-sm font-normal text-charcoal-400">active</span></p>
            <p class="text-xs text-charcoal-400">{{ dashboardStore.stats?.totalVendors || 0 }} total</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-red-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Overdue Tasks</p>
            <p class="text-2xl font-bold text-red-600">{{ dashboardStore.stats?.overdueTasks || 0 }}</p>
            <p class="text-xs text-charcoal-400">need attention</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-lg">
            <CalendarIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-charcoal-400">Upcoming Tasks</p>
            <p class="text-2xl font-bold">{{ dashboardStore.stats?.upcomingTasks || 0 }}</p>
            <p class="text-xs text-charcoal-400">next 7 days</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Investor Pipeline -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-heading font-bold">Investor Pipeline</h2>
          <RouterLink to="/investors" class="text-sm text-accent hover:text-accent-dark flex items-center gap-1">
            View All
            <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          </RouterLink>
        </div>
        <div class="space-y-3">
          <RouterLink
            v-for="stage in dashboardStore.pipeline"
            :key="stage.status"
            :to="`/investors?status=${stage.status}`"
            class="flex items-center justify-between p-2 hover:bg-sand-50 rounded-lg transition-colors"
          >
            <div class="flex items-center gap-3">
              <span :class="['badge', getStatusColor(stage.status)]">
                {{ stage.status.replace('_', ' ') }}
              </span>
            </div>
            <div class="text-right">
              <span class="font-medium">{{ stage._count.id }}</span>
              <span class="text-charcoal-400 text-sm ml-2">
                {{ formatCurrency(stage._sum?.committedAmount) }}
              </span>
            </div>
          </RouterLink>
          <div v-if="!dashboardStore.pipeline.length" class="text-charcoal-400 text-center py-4">
            No investor data yet
          </div>
        </div>
      </div>
      
      <!-- Alerts -->
      <div class="card">
        <h2 class="text-lg font-heading font-bold mb-4">Alerts & Follow-ups</h2>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <!-- Overdue Tasks -->
          <div v-if="dashboardStore.alerts.overdueTasks?.length">
            <h3 class="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
              <ClockIcon class="w-4 h-4" />
              Overdue Tasks
            </h3>
            <div class="space-y-2">
              <RouterLink
                v-for="task in dashboardStore.alerts.overdueTasks.slice(0, 5)"
                :key="task.id"
                :to="getActivityLink(task) || '#'"
                class="flex items-center justify-between p-2 hover:bg-red-50 rounded-lg border border-red-100"
              >
                <div class="flex-1 min-w-0">
                  <span class="font-medium text-charcoal-900 block truncate">{{ task.subject }}</span>
                  <span v-if="getActivityEntityName(task)" class="text-xs text-charcoal-500">
                    {{ getActivityEntityType(task) }}: {{ getActivityEntityName(task) }}
                  </span>
                </div>
                <span class="badge badge-red ml-2 whitespace-nowrap">{{ formatDate(task.dueDate) }}</span>
              </RouterLink>
            </div>
          </div>
          
          <!-- Expiring Licenses -->
          <div v-if="dashboardStore.alerts.expiringLicenses?.length">
            <h3 class="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
              <DocumentTextIcon class="w-4 h-4" />
              Expiring Licenses
            </h3>
            <div class="space-y-2">
              <RouterLink
                v-for="sub in dashboardStore.alerts.expiringLicenses.slice(0, 3)"
                :key="sub.id"
                :to="`/subcontractors/${sub.id}`"
                class="flex items-center justify-between p-2 hover:bg-sand-50 rounded-lg"
              >
                <span class="font-medium">{{ sub.companyName }}</span>
                <span class="badge badge-yellow">{{ formatDate(sub.licenseExpiry) }}</span>
              </RouterLink>
            </div>
          </div>
          
          <!-- Expiring Insurance -->
          <div v-if="dashboardStore.alerts.expiringInsurance?.length">
            <h3 class="text-sm font-medium text-orange-600 mb-2 flex items-center gap-1">
              <ExclamationTriangleIcon class="w-4 h-4" />
              Expiring Insurance
            </h3>
            <div class="space-y-2">
              <RouterLink
                v-for="sub in dashboardStore.alerts.expiringInsurance.slice(0, 3)"
                :key="sub.id"
                :to="`/subcontractors/${sub.id}`"
                class="flex items-center justify-between p-2 hover:bg-sand-50 rounded-lg"
              >
                <span class="font-medium">{{ sub.companyName }}</span>
                <span class="badge badge-red">{{ formatDate(sub.insuranceExpiry) }}</span>
              </RouterLink>
            </div>
          </div>
          
          <!-- Land Leads Needing Follow-up -->
          <div v-if="dashboardStore.alerts.landLeadsNeedingFollowup?.length">
            <h3 class="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
              <MapPinIcon class="w-4 h-4" />
              Land Leads - Follow-up Due
            </h3>
            <div class="space-y-2">
              <RouterLink
                v-for="lead in dashboardStore.alerts.landLeadsNeedingFollowup"
                :key="lead.id"
                :to="`/land-leads/${lead.id}`"
                class="flex items-center justify-between p-2 hover:bg-sand-50 rounded-lg"
              >
                <div class="flex-1 min-w-0">
                  <span class="font-medium block truncate">{{ lead.propertyAddress }}</span>
                </div>
                <span :class="getLandLeadStatusClass(lead.status)" class="px-2 py-0.5 text-xs rounded-full ml-2">
                  {{ lead.status?.replace('_', ' ') }}
                </span>
              </RouterLink>
            </div>
          </div>
          
          <!-- Projects Needing Attention -->
          <div v-if="dashboardStore.alerts.projectsNeedingAttention?.length">
            <h3 class="text-sm font-medium text-purple-600 mb-2 flex items-center gap-1">
              <FolderIcon class="w-4 h-4" />
              Projects Needing Attention
            </h3>
            <div class="space-y-2">
              <RouterLink
                v-for="project in dashboardStore.alerts.projectsNeedingAttention"
                :key="project.id"
                :to="`/projects/${project.id}`"
                class="flex items-center justify-between p-2 hover:bg-sand-50 rounded-lg"
              >
                <span class="font-medium">{{ project.name }}</span>
                <span :class="getProjectStatusClass(project.status)" class="px-2 py-0.5 text-xs rounded-full">
                  {{ project.status?.replace(/_/g, ' ') }}
                </span>
              </RouterLink>
            </div>
          </div>
          
          <div 
            v-if="!dashboardStore.alerts.expiringLicenses?.length && 
                  !dashboardStore.alerts.expiringInsurance?.length && 
                  !dashboardStore.alerts.overdueTasks?.length &&
                  !dashboardStore.alerts.landLeadsNeedingFollowup?.length &&
                  !dashboardStore.alerts.projectsNeedingAttention?.length" 
            class="text-charcoal-400 text-center py-4"
          >
            <CheckCircleIcon class="w-8 h-8 mx-auto mb-2 text-green-500" />
            No alerts at this time
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="card lg:col-span-2">
        <h2 class="text-lg font-heading font-bold mb-4">Recent Activity</h2>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <component
            :is="getActivityLink(activity) ? 'RouterLink' : 'div'"
            v-for="activity in dashboardStore.recentActivities.slice(0, 15)"
            :key="activity.id"
            :to="getActivityLink(activity)"
            :class="[
              'flex items-start gap-3 py-3 border-b border-sand-100 last:border-0',
              getActivityLink(activity) ? 'hover:bg-sand-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors' : ''
            ]"
          >
            <div class="p-2 bg-sand-100 rounded-lg flex-shrink-0">
              <ClockIcon class="w-4 h-4 text-charcoal-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-charcoal-900">{{ activity.subject }}</p>
              <p v-if="activity.description" class="text-sm text-charcoal-500 truncate">
                {{ activity.description }}
              </p>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <span v-if="getActivityEntityName(activity)" class="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                  {{ getActivityEntityType(activity) }}: {{ getActivityEntityName(activity) }}
                </span>
                <span class="text-xs text-charcoal-400">
                  {{ activity.createdBy?.name }} · {{ formatDateTime(activity.createdAt) }}
                </span>
              </div>
            </div>
            <ArrowTopRightOnSquareIcon v-if="getActivityLink(activity)" class="w-4 h-4 text-charcoal-300 flex-shrink-0" />
          </component>
          <div v-if="!dashboardStore.recentActivities.length" class="text-charcoal-400 text-center py-4">
            No recent activity
          </div>
        </div>
      </div>
      
      <!-- Upcoming Tasks -->
      <div v-if="dashboardStore.tasks?.length" class="card lg:col-span-2">
        <h2 class="text-lg font-heading font-bold mb-4">Upcoming Tasks</h2>
        <div class="space-y-2">
          <RouterLink
            v-for="task in dashboardStore.tasks.slice(0, 10)"
            :key="task.id"
            :to="getActivityLink(task) || '#'"
            class="flex items-center justify-between p-3 hover:bg-sand-50 rounded-lg border border-sand-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-charcoal-900">{{ task.subject }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span v-if="getActivityEntityName(task)" class="text-xs text-charcoal-500">
                  {{ getActivityEntityType(task) }}: {{ getActivityEntityName(task) }}
                </span>
                <span v-if="task.assignedTo" class="text-xs text-charcoal-400">
                  → {{ task.assignedTo.name }}
                </span>
              </div>
            </div>
            <div class="text-right flex-shrink-0 ml-4">
              <span :class="[
                'badge',
                new Date(task.dueDate) < new Date() ? 'badge-red' : 
                new Date(task.dueDate) < new Date(Date.now() + 86400000) ? 'badge-yellow' : 'badge-gray'
              ]">
                {{ formatDate(task.dueDate) }}
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
