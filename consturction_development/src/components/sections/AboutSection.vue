<template>
  <section id="about" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <!-- Image Column -->
        <div class="relative">
          <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-forest-200 to-forest-300 flex items-center justify-center">
            <div class="text-center p-8">
              <div class="w-24 h-24 bg-forest-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-white font-heading font-bold text-3xl">LC</span>
              </div>
              <p class="text-forest-700 font-medium">Team Photo Coming Soon</p>
            </div>
          </div>
          <!-- Experience Badge (overlapping card) -->
          <div class="absolute -bottom-6 -right-6 md:right-8 bg-white rounded-xl shadow-lg p-6 max-w-xs">
            <p class="text-4xl font-heading font-bold text-forest-500">{{ content.about.experienceYears }}</p>
            <p class="text-charcoal-600 mt-1">{{ content.about.experienceLabel }}</p>
          </div>
        </div>
        
        <!-- Content Column -->
        <div class="lg:pl-8">
          <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
            {{ content.about.sectionLabel }}
          </p>
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
            {{ content.about.headline }}
          </h2>
          <p class="mt-6 text-lg text-charcoal-600 leading-relaxed">
            {{ content.about.description }}
          </p>
          
          <!-- Founder Credentials -->
          <div class="mt-8 space-y-4">
            <div v-for="credential in content.about.credentials" :key="credential.title" 
                 class="flex items-start space-x-4">
              <CheckCircleIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-charcoal-900">{{ credential.title }}</p>
                <p class="text-charcoal-600 text-sm">{{ credential.description }}</p>
              </div>
            </div>
          </div>
          
          <a href="#contact" class="inline-flex items-center mt-8 text-forest-600 font-semibold hover:text-forest-700 transition-colors">
            Meet Our Team
            <ArrowRightIcon class="w-5 h-5 ml-2" />
          </a>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'
</script>
