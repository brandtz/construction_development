<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-heading font-bold">My Profile</h1>
      <p class="text-gray-500">Manage your account information and security settings</p>
    </div>
    
    <!-- Success Message -->
    <div v-if="profileSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
      <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0" />
      <span class="text-green-700">Profile updated successfully!</span>
    </div>
    
    <!-- Profile Information -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-3 mb-6">
        <UserCircleIcon class="w-6 h-6 text-forest-600" />
        <h2 class="text-lg font-bold">Personal Information</h2>
      </div>
      
      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="label">First Name</label>
            <input
              v-model="profile.firstName"
              type="text"
              class="input"
              placeholder="First name"
            />
          </div>
          <div>
            <label class="label">Last Name</label>
            <input
              v-model="profile.lastName"
              type="text"
              class="input"
              placeholder="Last name"
            />
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="label">Email Address</label>
            <input
              :value="authStore.investor?.email"
              type="email"
              class="input bg-gray-50"
              disabled
            />
            <p class="text-xs text-gray-400 mt-1">Contact us to update your email</p>
          </div>
          <div>
            <label class="label">Phone Number</label>
            <input
              v-model="profile.phone"
              type="tel"
              class="input"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        
        <div>
          <label class="label">Company (optional)</label>
          <input
            v-model="profile.company"
            type="text"
            class="input"
            placeholder="Company name"
          />
        </div>
        
        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="btn-primary"
          >
            {{ authStore.loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Mailing Address -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-3 mb-6">
        <MapPinIcon class="w-6 h-6 text-forest-600" />
        <h2 class="text-lg font-bold">Mailing Address</h2>
      </div>
      
      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <div>
          <label class="label">Street Address</label>
          <input
            v-model="profile.address"
            type="text"
            class="input"
            placeholder="123 Main Street"
          />
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="label">City</label>
            <input
              v-model="profile.city"
              type="text"
              class="input"
              placeholder="City"
            />
          </div>
          <div>
            <label class="label">State</label>
            <input
              v-model="profile.state"
              type="text"
              class="input"
              placeholder="OR"
              maxlength="2"
            />
          </div>
          <div>
            <label class="label">ZIP Code</label>
            <input
              v-model="profile.zipCode"
              type="text"
              class="input"
              placeholder="97401"
            />
          </div>
        </div>
        
        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="btn-primary"
          >
            {{ authStore.loading ? 'Saving...' : 'Save Address' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Account Status -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-3 mb-6">
        <ShieldCheckIcon class="w-6 h-6 text-forest-600" />
        <h2 class="text-lg font-bold">Account Status</h2>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600">Investor Status</span>
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(authStore.investor?.status)]">
            {{ formatStatus(authStore.investor?.status) }}
          </span>
        </div>
        
        <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600">Accreditation</span>
          <span class="font-medium text-sm">{{ formatAccreditation(authStore.investor?.accreditedStatus) }}</span>
        </div>
        
        <div v-if="authStore.investor?.committedAmount" class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600">Total Committed</span>
          <span class="font-medium text-sm">{{ formatCurrency(authStore.investor.committedAmount) }}</span>
        </div>
        
        <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600">Member Since</span>
          <span class="font-medium text-sm">{{ formatDate(authStore.investor?.createdAt) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Change Password -->
    <div class="card p-6">
      <div class="flex items-center gap-3 mb-6">
        <KeyIcon class="w-6 h-6 text-forest-600" />
        <h2 class="text-lg font-bold">Change Password</h2>
      </div>
      
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="label">Current Password</label>
          <input
            v-model="passwords.current"
            type="password"
            class="input max-w-md"
            placeholder="Enter current password"
          />
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="label">New Password</label>
            <input
              v-model="passwords.new"
              type="password"
              class="input"
              placeholder="Enter new password"
            />
            <p class="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
          </div>
          <div>
            <label class="label">Confirm New Password</label>
            <input
              v-model="passwords.confirm"
              type="password"
              class="input"
              :class="{ 'border-red-300': passwords.confirm && passwords.new !== passwords.confirm }"
              placeholder="Confirm new password"
            />
            <p v-if="passwords.confirm && passwords.new !== passwords.confirm" class="text-xs text-red-500 mt-1">
              Passwords do not match
            </p>
          </div>
        </div>
        
        <div v-if="passwordSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Password changed successfully!
        </div>
        
        <div v-if="passwordError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ passwordError }}
        </div>
        
        <div class="flex justify-end pt-2">
          <button 
            type="submit" 
            :disabled="!canChangePassword || authStore.loading"
            class="btn-primary"
          >
            {{ authStore.loading ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import {
  UserCircleIcon,
  KeyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const profile = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

const passwords = reactive({
  current: '',
  new: '',
  confirm: ''
})

const profileSuccess = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')

onMounted(async () => {
  // Load full profile data
  try {
    const res = await fetch('/api/investor/profile', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      profile.firstName = data.firstName || ''
      profile.lastName = data.lastName || ''
      profile.phone = data.phone || ''
      profile.company = data.company || ''
      profile.address = data.address || ''
      profile.city = data.city || ''
      profile.state = data.state || ''
      profile.zipCode = data.zipCode || ''
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
  }
})

const canChangePassword = computed(() => {
  return passwords.current && 
    passwords.new && 
    passwords.new.length >= 8 && 
    passwords.new === passwords.confirm
})

async function handleUpdateProfile() {
  profileSuccess.value = false
  const success = await authStore.updateProfile({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    company: profile.company,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zipCode: profile.zipCode
  })
  
  if (success) {
    profileSuccess.value = true
    setTimeout(() => profileSuccess.value = false, 3000)
  }
}

async function handleChangePassword() {
  passwordSuccess.value = false
  passwordError.value = ''
  
  if (passwords.new !== passwords.confirm) {
    passwordError.value = 'New passwords do not match'
    return
  }
  
  if (passwords.new.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return
  }
  
  const success = await authStore.changePassword(passwords.current, passwords.new)
  
  if (success) {
    passwordSuccess.value = true
    passwords.current = ''
    passwords.new = ''
    passwords.confirm = ''
    setTimeout(() => passwordSuccess.value = false, 3000)
  } else {
    passwordError.value = authStore.error || 'Failed to change password'
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value || 0)
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

function getStatusClass(status) {
  const classes = {
    FUNDED: 'bg-green-100 text-green-700',
    COMMITTED: 'bg-blue-100 text-blue-700',
    REVIEWING: 'bg-yellow-100 text-yellow-700',
    CONTACTED: 'bg-purple-100 text-purple-700',
    LEAD: 'bg-gray-100 text-gray-700',
    INACTIVE: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function formatStatus(status) {
  const labels = {
    LEAD: 'Prospective',
    CONTACTED: 'In Discussion',
    REVIEWING: 'Under Review',
    COMMITTED: 'Committed',
    FUNDED: 'Active Investor',
    INACTIVE: 'Inactive',
  }
  return labels[status] || status
}

function formatAccreditation(status) {
  const labels = {
    NOT_VERIFIED: 'Not Verified',
    PENDING: 'Verification Pending',
    VERIFIED: 'Verified Accredited',
    EXPIRED: 'Verification Expired',
  }
  return labels[status] || status || 'Not Specified'
}
</script>
