<template>
  <section id="approach" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
          {{ content.approach.sectionLabel }}
        </p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          {{ content.approach.headline }}
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          {{ content.approach.description }}
        </p>
      </div>
      
      <!-- Process Timeline -->
      <div class="relative">
        <!-- Vertical Line (desktop only) -->
        <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-forest-200 transform -translate-x-1/2"></div>
        
        <!-- Timeline Steps -->
        <div class="space-y-12 lg:space-y-0">
          <TimelineStep
            v-for="(step, index) in content.approach.processSteps"
            :key="step.title"
            :step-number="index + 1"
            :title="step.title"
            :description="step.description"
            :duration="step.duration"
            :class="index > 0 ? 'lg:mt-8' : ''"
          />
        </div>
      </div>
      
      <!-- Bottom CTA -->
      <div class="mt-16 text-center">
        <p class="text-lg text-charcoal-600 mb-6">
          Total project timeline: <strong>{{ content.approach.totalTimeline }}</strong>
        </p>
        <a href="#investment" class="inline-flex items-center px-6 py-3 bg-forest-500 hover:bg-forest-600 text-white font-semibold rounded-lg transition-colors">
          See the Investment Structure
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </a>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import TimelineStep from '@/components/ui/TimelineStep.vue'
import { siteContent as content } from '@/data/content.js'
</script>
