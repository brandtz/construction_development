import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
  {
    path: '/interest',
    name: 'Interest',
    component: () => import('./views/InterestView.vue'),
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('./layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('./views/DashboardView.vue')
      },
      {
        path: 'investments',
        name: 'Investments',
        component: () => import('./views/InvestmentsView.vue')
      },
      {
        path: 'investments/:id',
        name: 'InvestmentDetail',
        component: () => import('./views/InvestmentDetailView.vue')
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('./views/DocumentsView.vue')
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('./views/MessagesView.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('./views/ProfileView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
