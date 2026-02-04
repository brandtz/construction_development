<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 md:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm" @click="closeMobileMenu"></div>
        
        <!-- Menu Panel -->
        <Transition
          enter-active-class="transition-transform duration-300"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-if="mobileMenuOpen" class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div class="flex flex-col h-full">
              <!-- Header -->
              <div class="flex items-center justify-between p-4 border-b border-charcoal-100">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
                    <span class="text-white font-heading font-bold">LC</span>
                  </div>
                  <span class="font-heading font-bold text-charcoal-900">Lane County Housing</span>
                </div>
                <button @click="closeMobileMenu" class="p-2 text-charcoal-500 hover:text-charcoal-700">
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
              
              <!-- Navigation Links -->
              <nav class="flex-1 p-4">
                <ul class="space-y-1">
                  <li v-for="link in navLinks" :key="link.href">
                    <a 
                      :href="link.href"
                      @click="closeMobileMenu"
                      class="block px-4 py-3 text-lg font-medium text-charcoal-700 hover:text-forest-500 hover:bg-forest-50 rounded-lg transition-colors"
                    >
                      {{ link.label }}
                    </a>
                  </li>
                </ul>
              </nav>
              
              <!-- CTA Button -->
              <div class="p-4 border-t border-charcoal-100">
                <a 
                  href="#contact"
                  @click="closeMobileMenu"
                  class="block w-full px-6 py-3 bg-forest-500 hover:bg-forest-600 text-white text-center font-semibold rounded-lg transition-colors"
                >
                  Invest With Us
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const mobileMenuOpen = inject('mobileMenuOpen')

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Opportunity', href: '#opportunity' },
  { label: 'Our Approach', href: '#approach' },
  { label: 'Investment', href: '#investment' },
  { label: 'Contact', href: '#contact' },
]

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>
