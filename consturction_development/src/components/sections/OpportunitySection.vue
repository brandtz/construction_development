<template>
  <section id="opportunity" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
          {{ content.opportunity.sectionLabel }}
        </p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          {{ content.opportunity.headline }}
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          {{ content.opportunity.description }}
        </p>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div v-for="stat in content.opportunity.stats" :key="stat.label" 
             class="bg-sand-50 rounded-xl p-6 text-center">
          <p class="text-3xl md:text-4xl font-heading font-bold text-forest-500">{{ stat.value }}</p>
          <p class="mt-2 text-sm text-charcoal-600">{{ stat.label }}</p>
        </div>
      </div>
      
      <!-- Two Column Content -->
      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- Market Demand Card -->
        <div class="bg-forest-500 rounded-2xl p-8 text-white">
          <h3 class="font-heading text-2xl font-bold mb-4">Strong Buyer Demand</h3>
          <ul class="space-y-4">
            <li v-for="point in content.opportunity.demandPoints" :key="point" 
                class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Economics Card -->
        <div class="bg-sand-100 rounded-2xl p-8">
          <h3 class="font-heading text-2xl font-bold text-charcoal-900 mb-4">Favorable Economics</h3>
          <ul class="space-y-4">
            <li v-for="point in content.opportunity.economicsPoints" :key="point.text" 
                class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span class="text-charcoal-700">{{ point.text }} <strong>{{ point.value }}</strong></span>
            </li>
          </ul>
        </div>
        
      </div>
      
      <!-- Source Citation -->
      <p class="mt-8 text-center text-sm text-charcoal-400">
        {{ content.opportunity.sourceNote }}
      </p>
      
    </div>
  </section>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'
</script>
