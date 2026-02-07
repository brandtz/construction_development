<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-700 to-forest-900 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-white">Investor Portal</h1>
        <p class="text-forest-200 mt-2">Lane County Housing Development</p>
      </div>
      
      <div class="card p-8">
        <h2 class="text-2xl font-heading font-bold text-center mb-2">Register for Access</h2>
        <p class="text-gray-600 text-center mb-6 text-sm">
          Already submitted an inquiry? Register here to view documents and messages from our team.
        </p>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="label">Email Address</label>
            <input
              v-model="email"
              type="email"
              class="input"
              placeholder="your@email.com"
              required
            />
            <p class="text-gray-500 text-xs mt-1">Use the email you submitted in your inquiry</p>
          </div>
          
          <div>
            <label class="label">Create Password</label>
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="••••••••"
              minlength="8"
              required
            />
          </div>
          
          <div>
            <label class="label">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
          
          <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-green-700 text-sm">
              Registration successful! You can now 
              <router-link to="/login" class="font-medium underline">sign in</router-link>.
            </p>
          </div>
          
          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            <span v-if="authStore.loading">Registering...</span>
            <span v-else>Register</span>
          </button>
        </form>
        
        <p class="mt-6 text-center text-sm text-gray-600">
          Already registered? 
          <router-link to="/login" class="text-forest-600 hover:text-forest-700 font-medium">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = false
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  
  const result = await authStore.register(email.value, password.value)
  if (result) {
    success.value = true
  } else {
    error.value = authStore.error
  }
}
</script>
