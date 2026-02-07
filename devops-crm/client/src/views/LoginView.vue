<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card">
    <h2 class="text-2xl font-heading font-bold text-center mb-6">Sign In</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 bg-terracotta-50 border border-terracotta-200 rounded-lg text-terracotta-700 text-sm">
        {{ error }}
      </div>
      
      <div>
        <label class="label">Email</label>
        <input
          v-model="email"
          type="email"
          class="input"
          placeholder="you@example.com"
          autocomplete="email"
        />
      </div>
      
      <div>
        <label class="label">Password</label>
        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>
      
      <button
        type="submit"
        :disabled="loading"
        class="btn btn-primary w-full"
      >
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign In</span>
      </button>
    </form>
  </div>
</template>
