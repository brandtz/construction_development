<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-700 to-forest-900 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-white">Investor Portal</h1>
        <p class="text-forest-200 mt-2">Lane County Housing Development</p>
      </div>
      
      <div class="card p-8">
        <h2 class="text-2xl font-heading font-bold text-center mb-6">Sign In</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">Email Address</label>
            <input
              v-model="email"
              type="email"
              class="input"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label class="label">Password</label>
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ authStore.error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <div class="mt-6 text-center space-y-2">
          <router-link to="/forgot-password" class="text-sm text-forest-600 hover:text-forest-700">
            Forgot your password?
          </router-link>
          <p class="text-sm text-gray-600">
            New investor? 
            <router-link to="/register" class="text-forest-600 hover:text-forest-700 font-medium">
              Register for portal access
            </router-link>
          </p>
          <p class="text-sm text-gray-600">
            Interested in investing? 
            <router-link to="/interest" class="text-forest-600 hover:text-forest-700 font-medium">
              Request information
            </router-link>
          </p>
        </div>
      </div>
      
      <p class="text-center text-forest-300 text-sm mt-8">
        Need help? Contact us at 
        <a href="mailto:investors@lchd.com" class="text-white hover:underline">investors@lchd.com</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
