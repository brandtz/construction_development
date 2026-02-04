<template>
  <section id="contact" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
          {{ content.contact.sectionLabel }}
        </p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          {{ content.contact.headline }}
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          {{ content.contact.description }}
        </p>
      </div>
      
      <div class="grid lg:grid-cols-5 gap-12 lg:gap-16">
        
        <!-- Form Column (3/5) -->
        <div class="lg:col-span-3">
          <form 
            v-if="!submitted"
            name="investor-inquiry"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            @submit.prevent="handleSubmit"
            class="space-y-6"
          >
            <!-- Honeypot (spam protection) -->
            <input type="hidden" name="form-name" value="investor-inquiry" />
            <p class="hidden">
              <label>Don't fill this out: <input name="bot-field" /></label>
            </p>
            
            <!-- Name Fields -->
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-charcoal-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  v-model="form.firstName"
                  class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-charcoal-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  v-model="form.lastName"
                  class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>
            
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-charcoal-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                v-model="form.email"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
            
            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-charcoal-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                v-model="form.phone"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <!-- Investment Range -->
            <div>
              <label for="investmentRange" class="block text-sm font-medium text-charcoal-700 mb-2">
                Potential Investment Range
              </label>
              <select
                id="investmentRange"
                name="investmentRange"
                v-model="form.investmentRange"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors bg-white"
              >
                <option value="">Select a range...</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k+">$250,000+</option>
                <option value="undecided">Not sure yet</option>
              </select>
            </div>
            
            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-charcoal-700 mb-2">
                Questions or Comments
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                v-model="form.message"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors resize-none"
                placeholder="Tell us about your investment goals or any questions you have..."
              ></textarea>
            </div>
            
            <!-- Accredited Investor Checkbox -->
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accredited"
                name="accredited"
                v-model="form.accredited"
                class="mt-1 w-5 h-5 rounded border-charcoal-300 text-forest-500 focus:ring-forest-500"
              />
              <label for="accredited" class="text-sm text-charcoal-600">
                I am an <a href="https://www.sec.gov/education/capitalraising/building-blocks/accredited-investor" target="_blank" class="text-forest-600 underline hover:text-forest-700">accredited investor</a> 
                or am investing through an accredited entity.
              </label>
            </div>
            
            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              <span v-if="!isSubmitting">Request Investor Packet</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
            
            <p class="text-xs text-charcoal-400 text-center">
              By submitting, you agree to receive investment-related communications. 
              We respect your privacy and will never share your information.
            </p>
            
          </form>
          
          <!-- Success Message (shown after submission) -->
          <div v-if="submitted" class="p-8 bg-forest-50 border border-forest-200 rounded-xl text-center">
            <CheckCircleIcon class="w-16 h-16 text-forest-500 mx-auto mb-4" />
            <h3 class="font-heading text-2xl font-bold text-charcoal-900">Thank You!</h3>
            <p class="mt-2 text-charcoal-600">
              We've received your inquiry and will send the investor packet to your email within 24 hours.
            </p>
          </div>
        </div>
        
        <!-- Contact Info Column (2/5) -->
        <div class="lg:col-span-2">
          <div class="bg-sand-50 rounded-2xl p-8 h-full">
            <h3 class="font-heading text-xl font-bold text-charcoal-900 mb-6">Contact Information</h3>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <EnvelopeIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Email</p>
                  <a :href="'mailto:' + content.company.email" class="text-forest-600 hover:text-forest-700">
                    {{ content.company.email }}
                  </a>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <PhoneIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Phone</p>
                  <a :href="'tel:' + content.company.phone.replace(/[^\d+]/g, '')" class="text-forest-600 hover:text-forest-700">
                    {{ content.company.phone }}
                  </a>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <MapPinIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Location</p>
                  <p class="text-charcoal-600">
                    {{ content.company.location }}<br />
                    Lane County
                  </p>
                </div>
              </div>
            </div>
            
            <hr class="my-8 border-charcoal-200" />
            
            <div>
              <p class="font-medium text-charcoal-900 mb-3">Prefer to Schedule a Call?</p>
              <a 
                href="#" 
                class="inline-flex items-center px-5 py-2.5 bg-white border border-forest-500 text-forest-600 font-semibold rounded-lg hover:bg-forest-50 transition-colors"
              >
                <CalendarIcon class="w-5 h-5 mr-2" />
                Book a Meeting
              </a>
              <p class="mt-2 text-xs text-charcoal-400">
                (Calendly integration coming soon)
              </p>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  investmentRange: '',
  message: '',
  accredited: false,
})

const isSubmitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Netlify Forms submission
    const formData = new FormData()
    formData.append('form-name', 'investor-inquiry')
    Object.entries(form.value).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
    
    submitted.value = true
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      investmentRange: '',
      message: '',
      accredited: false,
    }
  } catch (error) {
    console.error('Form submission error:', error)
    alert('There was an error submitting the form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
