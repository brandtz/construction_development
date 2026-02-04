<template>
  <div class="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"
       :class="isEven ? '' : 'lg:flex-row-reverse'">
    
    <!-- Step Number (Center on desktop) -->
    <div class="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-forest-500 text-white items-center justify-center font-bold text-lg z-10">
      {{ stepNumber }}
    </div>
    
    <!-- Content Card -->
    <div :class="[
      'bg-white rounded-xl p-6 shadow-sm border border-charcoal-100',
      isEven ? 'lg:mr-8' : 'lg:ml-8 lg:col-start-2'
    ]">
      <div class="flex items-start space-x-4">
        <div class="lg:hidden flex-shrink-0 w-10 h-10 rounded-full bg-forest-500 text-white flex items-center justify-center font-bold">
          {{ stepNumber }}
        </div>
        <div>
          <h3 class="font-heading text-xl font-bold text-charcoal-900">{{ title }}</h3>
          <p class="mt-2 text-charcoal-600">{{ description }}</p>
          <p class="mt-3 text-sm text-forest-600 font-medium">{{ duration }}</p>
        </div>
      </div>
    </div>
    
    <!-- Spacer for alternating layout -->
    <div :class="isEven ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'" class="hidden lg:block"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stepNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
})

const isEven = computed(() => props.stepNumber % 2 === 1)
</script>
