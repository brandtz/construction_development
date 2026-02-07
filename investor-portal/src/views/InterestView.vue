<template>
  <div class="min-h-screen bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900">
    <!-- Hero Section -->
    <header class="px-4 py-6">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <h1 class="text-xl font-heading font-bold text-white">Lane County Housing Development</h1>
        <router-link to="/login" class="text-forest-200 hover:text-white transition-colors">
          Investor Login →
        </router-link>
      </div>
    </header>
    
    <main class="px-4 py-12">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Value Proposition -->
        <div class="text-white space-y-8">
          <div>
            <p class="text-forest-300 uppercase tracking-wider text-sm font-medium">Investment Opportunity</p>
            <h2 class="text-4xl lg:text-5xl font-heading font-bold mt-2 leading-tight">
              Build Wealth Through<br/>Real Estate Development
            </h2>
          </div>
          
          <p class="text-xl text-forest-100 leading-relaxed">
            Join our network of accredited investors participating in high-quality 
            residential construction projects in Lane County, Oregon.
          </p>
          
          <div class="grid sm:grid-cols-2 gap-6">
            <div class="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <p class="text-4xl font-bold text-gold-400">$25M+</p>
              <p class="text-forest-200 mt-1">Projects Funded</p>
            </div>
            <div class="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <p class="text-4xl font-bold text-gold-400">12+</p>
              <p class="text-forest-200 mt-1">Active Projects</p>
            </div>
            <div class="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <p class="text-4xl font-bold text-gold-400">15-22%</p>
              <p class="text-forest-200 mt-1">Target Returns</p>
            </div>
            <div class="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <p class="text-4xl font-bold text-gold-400">50+</p>
              <p class="text-forest-200 mt-1">Happy Investors</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4 text-forest-200">
            <CheckCircleIcon class="w-5 h-5 text-gold-400" />
            <span>SEC Compliant Offerings</span>
          </div>
        </div>
        
        <!-- Right: Interest Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div v-if="!submitted">
            <h3 class="text-2xl font-heading font-bold text-charcoal-900">
              Request Investment Information
            </h3>
            <p class="text-gray-600 mt-2">
              Fill out the form below and our investor relations team will contact you 
              within 24 hours.
            </p>
            
            <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="label">First Name *</label>
                  <input v-model="form.firstName" type="text" class="input" required />
                </div>
                <div>
                  <label class="label">Last Name *</label>
                  <input v-model="form.lastName" type="text" class="input" required />
                </div>
              </div>
              
              <div>
                <label class="label">Email Address *</label>
                <input v-model="form.email" type="email" class="input" required />
              </div>
              
              <div>
                <label class="label">Phone Number</label>
                <input v-model="form.phone" type="tel" class="input" placeholder="(555) 123-4567" />
              </div>
              
              <div>
                <label class="label">Company (Optional)</label>
                <input v-model="form.company" type="text" class="input" />
              </div>
              
              <div>
                <label class="label">Accreditation Status *</label>
                <select v-model="form.accreditedStatus" class="input" required>
                  <option value="">Select status...</option>
                  <option value="INDIVIDUAL">Individual Accredited Investor</option>
                  <option value="JOINT">Joint Accredited Investor</option>
                  <option value="ENTITY">Accredited Entity</option>
                  <option value="NOT_ACCREDITED">Not Currently Accredited</option>
                  <option value="UNKNOWN">Not Sure</option>
                </select>
              </div>
              
              <div>
                <label class="label">Investment Range *</label>
                <select v-model="form.investmentCapacity" class="input" required>
                  <option value="">Select range...</option>
                  <option value="$25K-$50K">$25,000 - $50,000</option>
                  <option value="$50K-$100K">$50,000 - $100,000</option>
                  <option value="$100K-$250K">$100,000 - $250,000</option>
                  <option value="$250K-$500K">$250,000 - $500,000</option>
                  <option value="$500K+">$500,000+</option>
                </select>
              </div>
              
              <div>
                <label class="label">How did you hear about us?</label>
                <select v-model="form.source" class="input">
                  <option value="">Select...</option>
                  <option value="REFERRAL">Referral from Investor</option>
                  <option value="WEBSITE">Website</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="NETWORKING">Networking Event</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label class="label">Message (Optional)</label>
                <textarea 
                  v-model="form.notes" 
                  class="input" 
                  rows="3"
                  placeholder="Tell us about your investment goals..."
                ></textarea>
              </div>
              
              <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-red-700 text-sm">{{ error }}</p>
              </div>
              
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary w-full py-3 text-lg"
              >
                <span v-if="loading">Submitting...</span>
                <span v-else>Request Information</span>
              </button>
              
              <p class="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to receive investment-related communications.
                Your information is kept strictly confidential.
              </p>
            </form>
          </div>
          
          <!-- Success State -->
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon class="w-10 h-10 text-green-600" />
            </div>
            <h3 class="text-2xl font-heading font-bold text-charcoal-900 mt-6">
              Thank You for Your Interest!
            </h3>
            <p class="text-gray-600 mt-3 max-w-sm mx-auto">
              Our investor relations team will review your information and contact you 
              within 24 business hours.
            </p>
            <div class="mt-8 space-y-3">
              <p class="text-sm text-gray-500">Already an investor?</p>
              <router-link to="/login" class="btn-primary inline-block">
                Sign in to Investor Portal
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="px-4 py-8 mt-12">
      <div class="max-w-6xl mx-auto text-center text-forest-300 text-sm">
        <p>&copy; 2026 Lane County Housing Development. All rights reserved.</p>
        <p class="mt-2">
          Investments involve risk. Past performance does not guarantee future results.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import api from '../services/api'

const loading = ref(false)
const error = ref('')
const submitted = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  accreditedStatus: '',
  investmentCapacity: '',
  source: '',
  notes: ''
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  
  try {
    await api.post('/investor/interest', form)
    submitted.value = true
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to submit. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
