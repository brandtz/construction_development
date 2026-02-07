<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-forest-800 text-white flex-shrink-0">
      <div class="p-6">
        <h1 class="text-xl font-heading font-bold">Lane County Housing</h1>
        <p class="text-forest-200 text-sm">Investor Portal</p>
      </div>
      
      <nav class="mt-6">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex items-center px-6 py-3 text-forest-100 hover:bg-forest-700 transition-colors"
          :class="{ 'bg-forest-700': $route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/') }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
      
      <div class="absolute bottom-0 w-64 p-4 border-t border-forest-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
            {{ authStore.investor?.firstName?.[0] }}{{ authStore.investor?.lastName?.[0] }}
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.fullName }}</p>
            <p class="text-xs text-forest-300 truncate">{{ authStore.investor?.email }}</p>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="mt-3 w-full text-left text-sm text-forest-300 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-gray-500 hover:text-gray-700"
              >
                <BellIcon class="w-6 h-6" />
                <span
                  v-if="notificationsStore.unreadCount > 0"
                  class="absolute top-0 right-0 w-5 h-5 bg-terracotta-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {{ notificationsStore.unreadCount }}
                </span>
              </button>
              
              <!-- Notifications dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-semibold">Notifications</h3>
                  <button
                    v-if="notificationsStore.unreadCount > 0"
                    @click="notificationsStore.markAllAsRead()"
                    class="text-sm text-forest-600 hover:text-forest-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div
                    v-for="notification in notificationsStore.notifications.slice(0, 10)"
                    :key="notification.id"
                    @click="notificationsStore.markAsRead(notification.id)"
                    class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    :class="{ 'bg-forest-50': !notification.read }"
                  >
                    <p class="font-medium text-sm">{{ notification.title }}</p>
                    <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
                    <p class="text-gray-400 text-xs mt-2">
                      {{ formatDate(notification.createdAt) }}
                    </p>
                  </div>
                  <div
                    v-if="notificationsStore.notifications.length === 0"
                    class="p-4 text-center text-gray-500"
                  >
                    No notifications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationsStore } from '../stores/portal'
import {
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()

const showNotifications = ref(false)

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Investments', to: '/investments', icon: CurrencyDollarIcon },
  { name: 'Documents', to: '/documents', icon: DocumentTextIcon },
  { name: 'Messages', to: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
]

const pageTitle = computed(() => {
  const currentRoute = navigation.find(n => n.to === route.path)
  return currentRoute?.name || 'Investor Portal'
})

onMounted(() => {
  notificationsStore.fetchNotifications()
})

// Close notifications dropdown when clicking outside
watch(showNotifications, (value) => {
  if (value) {
    const handler = (e) => {
      if (!e.target.closest('.relative')) {
        showNotifications.value = false
        document.removeEventListener('click', handler)
      }
    }
    setTimeout(() => document.addEventListener('click', handler), 0)
  }
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
