<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center">
    <!-- Background Image with Gradient Overlay -->
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full bg-gradient-to-br from-forest-800 via-forest-700 to-charcoal-900"></div>
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900/70"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center pt-20">
      <!-- Badge -->
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
        <span class="text-sm text-white/90 font-medium">{{ content.hero.badge }}</span>
      </div>
      
      <!-- Headline -->
      <h1 class="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
        {{ content.hero.headline }}<br class="hidden sm:block" />
        <span class="text-terracotta-400">{{ content.hero.headlineAccent }}</span>
      </h1>
      
      <!-- Subheadline -->
      <p class="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
        {{ content.hero.subheadline }}
      </p>
      
      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#investment" 
           class="w-full sm:w-auto px-8 py-4 bg-forest-500 hover:bg-forest-600 text-white font-semibold rounded-lg transition-colors text-lg">
          {{ content.hero.ctaPrimary }}
        </a>
        <a href="#about" 
           class="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 transition-colors text-lg">
          {{ content.hero.ctaSecondary }}
        </a>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ChevronDownIcon class="w-8 h-8 text-white/60" />
    </div>
  </section>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'
</script>
