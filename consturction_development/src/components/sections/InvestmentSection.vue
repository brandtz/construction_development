<template>
  <section id="investment" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
          {{ content.investment.sectionLabel }}
        </p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          {{ content.investment.headline }}
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          {{ content.investment.description }}
        </p>
      </div>
      
      <!-- Investment Highlights Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <div v-for="highlight in investmentHighlights" :key="highlight.title"
             class="bg-sand-50 rounded-xl p-6 border border-sand-200">
          <component :is="highlight.icon" class="w-10 h-10 text-forest-500 mb-4" />
          <h3 class="font-heading text-xl font-bold text-charcoal-900">{{ highlight.title }}</h3>
          <p class="mt-2 text-charcoal-600">{{ highlight.description }}</p>
        </div>
      </div>
      
      <!-- Key Terms Box -->
      <div class="bg-forest-500 rounded-2xl p-8 md:p-12 text-white">
        <div class="grid md:grid-cols-2 gap-8">
          
          <div>
            <h3 class="font-heading text-2xl font-bold mb-6">Pilot Cycle Overview</h3>
            <dl class="space-y-4">
              <div class="flex justify-between border-b border-white/20 pb-3">
                <dt class="text-white/80">Target Capital Raise</dt>
                <dd class="font-semibold">{{ content.investment.terms.targetRaise }}</dd>
              </div>
              <div class="flex justify-between border-b border-white/20 pb-3">
                <dt class="text-white/80">Number of Homes</dt>
                <dd class="font-semibold">{{ content.investment.terms.numberOfHomes }}</dd>
              </div>
              <div class="flex justify-between border-b border-white/20 pb-3">
                <dt class="text-white/80">Projected Cycle</dt>
                <dd class="font-semibold">{{ content.investment.terms.projectedCycle }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-white/80">Target ROI Range</dt>
                <dd class="font-semibold">{{ content.investment.terms.targetROI }}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 class="font-heading text-2xl font-bold mb-6">What Investors Receive</h3>
            <ul class="space-y-3">
              <li v-for="benefit in content.investment.investorBenefits" :key="benefit" 
                  class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <!-- Disclaimer -->
        <p class="mt-8 text-sm text-white/60 border-t border-white/20 pt-6">
          {{ content.investment.disclaimer }}
        </p>
      </div>
      
      <!-- CTA -->
      <div class="mt-12 text-center">
        <a href="#contact" 
           class="inline-flex items-center px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg transition-colors text-lg">
          Request Investment Details
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </a>
        <p class="mt-4 text-sm text-charcoal-500">
          For accredited investors. We'll send our full investor packet and schedule a call.
        </p>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { CheckIcon, ArrowRightIcon, CurrencyDollarIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { siteContent as content } from '@/data/content.js'

const investmentHighlights = [
  {
    icon: CurrencyDollarIcon,
    title: content.investment.highlights[0].title,
    description: content.investment.highlights[0].description
  },
  {
    icon: ChartBarIcon,
    title: content.investment.highlights[1].title,
    description: content.investment.highlights[1].description
  },
  {
    icon: ShieldCheckIcon,
    title: content.investment.highlights[2].title,
    description: content.investment.highlights[2].description
  },
]
</script>
