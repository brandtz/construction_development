import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/investors',
    name: 'investors',
    component: () => import('@/views/InvestorsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/investors/:id',
    name: 'investor-detail',
    component: () => import('@/views/InvestorDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subcontractors',
    name: 'subcontractors',
    component: () => import('@/views/SubcontractorsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subcontractors/:id',
    name: 'subcontractor-detail',
    component: () => import('@/views/SubcontractorDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/buyers',
    name: 'buyers',
    component: () => import('@/views/BuyersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/land-leads',
    name: 'land-leads',
    component: () => import('@/views/LandLeadsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/land-leads/:id',
    name: 'land-lead-detail',
    component: () => import('@/views/LandLeadDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors',
    name: 'vendors',
    component: () => import('@/views/VendorsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors/:id',
    name: 'vendor-detail',
    component: () => import('@/views/VendorDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/views/TemplatesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
