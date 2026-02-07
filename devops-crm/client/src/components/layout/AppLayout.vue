<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  MapPinIcon,
  TruckIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Investors', href: '/investors', icon: UsersIcon },
  { name: 'Subcontractors', href: '/subcontractors', icon: WrenchScrewdriverIcon },
  { name: 'Projects', href: '/projects', icon: BuildingOffice2Icon },
  { name: 'Buyers', href: '/buyers', icon: UserGroupIcon },
  { name: 'Land Leads', href: '/land-leads', icon: MapPinIcon },
  { name: 'Vendors', href: '/vendors', icon: TruckIcon },
  { name: 'Templates', href: '/templates', icon: DocumentTextIcon },
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-sand-100">
    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 z-40 bg-charcoal-500/50 lg:hidden"
      @click="sidebarOpen = false"
    />
    
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-sand-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-sand-200">
        <span class="text-xl font-heading font-bold text-forest-500">DevOps CRM</span>
      </div>
      
      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-charcoal-500 hover:bg-sand-100 transition-colors"
          active-class="!bg-forest-50 !text-forest-600"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </RouterLink>
      </nav>
      
      <!-- User section -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-sand-200">
        <RouterLink
          to="/profile"
          class="flex items-center gap-3 mb-3 px-4 py-2 rounded-lg hover:bg-sand-100 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 font-medium">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-charcoal-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </RouterLink>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-charcoal-500 hover:bg-sand-100 transition-colors"
        >
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 h-16 bg-white border-b border-sand-200 flex items-center px-4 lg:px-8">
        <button
          @click="sidebarOpen = true"
          class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-sand-100"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        
        <div class="flex-1" />
        
        <!-- Can add search, notifications, etc. here -->
      </header>
      
      <!-- Page content -->
      <main class="p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
