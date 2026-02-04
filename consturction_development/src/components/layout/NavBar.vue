<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
    ]"
  >
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <a href="#" class="flex items-center space-x-2">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-forest-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-heading font-bold text-lg">LC</span>
          </div>
          <span class="font-heading font-bold text-lg hidden sm:block"
                :class="isScrolled ? 'text-charcoal-900' : 'text-white'">
            Lane County Housing
          </span>
        </a>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a v-for="link in navLinks" :key="link.href"
             :href="link.href"
             class="text-sm font-medium transition-colors"
             :class="isScrolled ? 'text-charcoal-700 hover:text-forest-500' : 'text-white/90 hover:text-white'">
            {{ link.label }}
          </a>
          <a href="#contact" 
             class="px-5 py-2.5 bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Invest With Us
          </a>
        </div>
        
        <!-- Mobile Menu Button -->
        <button @click="openMobileMenu" class="md:hidden p-2">
          <Bars3Icon class="w-6 h-6" :class="isScrolled ? 'text-charcoal-900' : 'text-white'" />
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useNavScroll } from '@/composables/useNavScroll.js'

const { isScrolled } = useNavScroll(50)
const mobileMenuOpen = inject('mobileMenuOpen')

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Opportunity', href: '#opportunity' },
  { label: 'Our Approach', href: '#approach' },
  { label: 'Investment', href: '#investment' },
  { label: 'Contact', href: '#contact' },
]

const openMobileMenu = () => {
  mobileMenuOpen.value = true
}
</script>
