<template>
  <section id="projects" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
          {{ content.projects.sectionLabel }}
        </p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          {{ content.projects.headline }}
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          {{ content.projects.description }}
        </p>
      </div>
      
      <!-- Project Cards -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Active Pipeline Card -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal-100">
          <div class="aspect-[4/3] bg-forest-100 flex items-center justify-center">
            <div class="text-center p-6">
              <MagnifyingGlassIcon class="w-12 h-12 text-forest-400 mx-auto mb-3" />
              <p class="text-forest-600 font-medium">Site Selection In Progress</p>
            </div>
          </div>
          <div class="p-6">
            <span class="inline-block px-3 py-1 bg-forest-100 text-forest-700 text-xs font-semibold rounded-full mb-3">
              ACTIVE
            </span>
            <h3 class="font-heading text-xl font-bold text-charcoal-900">Pilot Cycle — 5 Homes</h3>
            <p class="mt-2 text-charcoal-600 text-sm">
              Evaluating buildable lots in Springfield and South Eugene. Target acquisition Q1 2026.
            </p>
          </div>
        </div>
        
        <!-- Coming Soon Card 1 -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal-100 opacity-75">
          <div class="aspect-[4/3] bg-charcoal-100 flex items-center justify-center">
            <div class="text-center p-6">
              <HomeIcon class="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <p class="text-charcoal-400 font-medium">Coming Soon</p>
            </div>
          </div>
          <div class="p-6">
            <span class="inline-block px-3 py-1 bg-charcoal-100 text-charcoal-500 text-xs font-semibold rounded-full mb-3">
              PLANNED
            </span>
            <h3 class="font-heading text-xl font-bold text-charcoal-500">Project TBD</h3>
            <p class="mt-2 text-charcoal-400 text-sm">
              Details coming after pilot cycle funding is secured.
            </p>
          </div>
        </div>
        
        <!-- Coming Soon Card 2 -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-charcoal-100 opacity-75">
          <div class="aspect-[4/3] bg-charcoal-100 flex items-center justify-center">
            <div class="text-center p-6">
              <HomeIcon class="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <p class="text-charcoal-400 font-medium">Coming Soon</p>
            </div>
          </div>
          <div class="p-6">
            <span class="inline-block px-3 py-1 bg-charcoal-100 text-charcoal-500 text-xs font-semibold rounded-full mb-3">
              PLANNED
            </span>
            <h3 class="font-heading text-xl font-bold text-charcoal-500">Project TBD</h3>
            <p class="mt-2 text-charcoal-400 text-sm">
              Scale-up cycle after pilot proves the model.
            </p>
          </div>
        </div>
        
      </div>
      
      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="text-charcoal-600 mb-4">
          Want to be notified when we break ground?
        </p>
        <a href="#contact" class="inline-flex items-center text-forest-600 font-semibold hover:text-forest-700 transition-colors">
          Join Our Investor List
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </a>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { MagnifyingGlassIcon, HomeIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'
</script>
