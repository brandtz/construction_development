<template>
  <div class="min-h-screen">
    <NavBar />
    <main>
      <HeroSection />
      <AboutSection />
      <OpportunitySection />
      <ApproachSection />
      <InvestmentSection />
      <ProjectsSection />
      <ContactSection />
    </main>
    <Footer />
    <MobileMenu />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import OpportunitySection from '@/components/sections/OpportunitySection.vue'
import ApproachSection from '@/components/sections/ApproachSection.vue'
import InvestmentSection from '@/components/sections/InvestmentSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const mobileMenuOpen = ref(false)
provide('mobileMenuOpen', mobileMenuOpen)
</script>
