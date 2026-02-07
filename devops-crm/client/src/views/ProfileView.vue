<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  UserCircleIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const profile = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordError = ref('')

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  loading.value = true
  try {
    const res = await fetch('/api/auth/profile', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      profile.value = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || '',
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    errorMessage.value = 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: profile.value.name,
        phone: profile.value.phone,
      }),
    })
    
    if (res.ok) {
      successMessage.value = 'Profile updated successfully'
      // Update auth store
      authStore.user.name = profile.value.name
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      const data = await res.json()
      errorMessage.value = data.error || 'Failed to update profile'
    }
  } catch (error) {
    errorMessage.value = 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

const canChangePassword = computed(() => {
  return passwordForm.value.currentPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.newPassword.length >= 6 &&
    passwordsMatch.value
})

async function changePassword() {
  if (!canChangePassword.value) return
  
  changingPassword.value = true
  passwordError.value = ''
  successMessage.value = ''
  
  try {
    const res = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      }),
    })
    
    if (res.ok) {
      successMessage.value = 'Password changed successfully'
      passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      const data = await res.json()
      passwordError.value = data.error || 'Failed to change password'
    }
  } catch (error) {
    passwordError.value = 'Failed to change password'
  } finally {
    changingPassword.value = false
  }
}

function getRoleBadgeClass(role) {
  switch (role) {
    case 'ADMIN': return 'bg-forest-100 text-forest-700'
    case 'USER': return 'bg-blue-100 text-blue-700'
    case 'VIEWER': return 'bg-charcoal-100 text-charcoal-600'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-heading font-bold">My Profile</h1>
      <p class="text-charcoal-500">Manage your account settings and password</p>
    </div>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 p-4 bg-forest-50 border border-forest-200 rounded-xl flex items-center gap-3">
      <CheckCircleIcon class="w-5 h-5 text-forest-600" />
      <span class="text-forest-700">{{ successMessage }}</span>
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
      <ExclamationCircleIcon class="w-5 h-5 text-red-600" />
      <span class="text-red-700">{{ errorMessage }}</span>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-charcoal-500">
      Loading profile...
    </div>
    
    <div v-else class="space-y-6">
      <!-- Profile Information -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <UserCircleIcon class="w-6 h-6 text-forest-600" />
          <h2 class="text-lg font-bold">Profile Information</h2>
        </div>
        
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">Full Name</label>
              <input
                v-model="profile.name"
                type="text"
                class="input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label class="label">Email Address</label>
              <input
                :value="profile.email"
                type="email"
                class="input bg-sand-50"
                disabled
              />
              <p class="text-xs text-charcoal-400 mt-1">Email cannot be changed</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">Phone Number</label>
              <input
                v-model="profile.phone"
                type="tel"
                class="input"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label class="label">Role</label>
              <div class="flex items-center h-[42px]">
                <span :class="['badge', getRoleBadgeClass(profile.role)]">
                  {{ profile.role }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end pt-4">
            <button 
              type="submit" 
              :disabled="saving"
              class="btn-primary"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Change Password -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <KeyIcon class="w-6 h-6 text-forest-600" />
          <h2 class="text-lg font-bold">Change Password</h2>
        </div>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="label">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="input max-w-md"
              placeholder="Enter current password"
            />
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="input"
                placeholder="Enter new password"
              />
              <p class="text-xs text-charcoal-400 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <label class="label">Confirm New Password</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="input"
                :class="{ 'border-red-300': passwordForm.confirmPassword && !passwordsMatch }"
                placeholder="Confirm new password"
              />
              <p v-if="passwordForm.confirmPassword && !passwordsMatch" class="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            </div>
          </div>
          
          <div v-if="passwordError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ passwordError }}
          </div>
          
          <div class="flex justify-end pt-4">
            <button 
              type="submit" 
              :disabled="!canChangePassword || changingPassword"
              class="btn-primary"
            >
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
