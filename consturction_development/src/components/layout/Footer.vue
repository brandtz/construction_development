<template>
  <footer class="bg-charcoal-900 text-white py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        
        <!-- Brand Column -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-forest-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-heading font-bold text-lg">LC</span>
            </div>
            <span class="font-heading font-bold text-lg text-white">Lane County Housing</span>
          </div>
          <p class="text-charcoal-400 text-sm max-w-xs">
            Building quality homes in Lane County, Oregon. A new residential development 
            company backed by decades of construction experience.
          </p>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#about" class="text-charcoal-400 hover:text-white transition-colors text-sm">About Us</a></li>
            <li><a href="#opportunity" class="text-charcoal-400 hover:text-white transition-colors text-sm">The Opportunity</a></li>
            <li><a href="#investment" class="text-charcoal-400 hover:text-white transition-colors text-sm">Investment</a></li>
            <li><a href="#contact" class="text-charcoal-400 hover:text-white transition-colors text-sm">Contact</a></li>
          </ul>
        </div>
        
        <!-- Legal -->
        <div>
          <h4 class="font-semibold text-white mb-4">Legal</h4>
          <ul class="space-y-2">
            <li><a href="/privacy" class="text-charcoal-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            <li><a href="/terms" class="text-charcoal-400 hover:text-white transition-colors text-sm">Terms of Use</a></li>
          </ul>
          <p class="mt-4 text-charcoal-500 text-xs">
            CCB License #XXXXXX<br />
            Lane County Housing Development LLC
          </p>
        </div>
        
      </div>
      
      <hr class="border-charcoal-700 mb-8" />
      
      <!-- Bottom Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center text-sm text-charcoal-500">
        <p>&copy; {{ currentYear }} Lane County Housing Development LLC. All rights reserved.</p>
        <p class="mt-2 md:mt-0">
          Website by <a href="https://brandtworks-enterprises.com" target="_blank" class="text-charcoal-400 hover:text-white">Brandtworks-Enterprises</a>
        </p>
      </div>
      
      <!-- Investment Disclaimer -->
      <p class="mt-8 text-xs text-charcoal-600 max-w-4xl">
        <strong>Disclaimer:</strong> This website is for informational purposes only and does not constitute 
        an offer to sell or a solicitation of an offer to buy any securities. Any such offer will only be 
        made pursuant to a private placement memorandum and only to accredited investors. Past performance 
        is not indicative of future results. Investment involves risk including potential loss of principal.
      </p>
      
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
