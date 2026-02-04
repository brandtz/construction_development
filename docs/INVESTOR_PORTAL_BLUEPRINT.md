# Lane County Housing Development — Investor Portal Technical Blueprint

## Project Overview

**Project Name:** Lane County Housing Investor Portal  
**Project Type:** Single-page marketing/pitch website with investor inquiry form  
**Primary Goal:** Establish credibility, present investment opportunity, capture investor leads  
**Target Audience:** Accredited investors, private lenders, potential equity partners  

**Client:** Lane County Housing Development LLC (Husband-wife team, decades of GC experience)  
**Developer:** Brandtworks-Enterprises LLC  

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| **Frontend Framework** | Vue.js | 3.x (Composition API) | Use `<script setup>` syntax |
| **Build Tool** | Vite | Latest | Fast dev server, optimized builds |
| **Styling** | Tailwind CSS | 3.x | Utility-first, custom theme |
| **Icons** | Heroicons | 2.x | `@heroicons/vue` |
| **Animations** | Vue Transition + CSS | Native | Scroll-triggered animations |
| **Forms** | Netlify Forms | Native | Zero-backend form handling |
| **Hosting** | Netlify | Free tier | Auto-deploy from GitHub |
| **Version Control** | GitHub | — | Main branch deploys to production |
| **Database** | None (Phase 0) | — | Form submissions stored in Netlify |

---

## Project Structure

```
lane-county-housing/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Optional: CI/CD config
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg                # Social sharing image (1200x630)
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── hero-bg.jpg         # Hero background (Lane County landscape)
│   │   │   ├── team-placeholder.jpg
│   │   │   ├── construction-1.jpg
│   │   │   ├── construction-2.jpg
│   │   │   ├── home-render-1.jpg
│   │   │   └── logo.svg
│   │   └── styles/
│   │       └── main.css            # Tailwind imports + custom styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── NavBar.vue
│   │   │   ├── Footer.vue
│   │   │   └── MobileMenu.vue
│   │   ├── sections/
│   │   │   ├── HeroSection.vue
│   │   │   ├── AboutSection.vue
│   │   │   ├── OpportunitySection.vue
│   │   │   ├── ApproachSection.vue
│   │   │   ├── InvestmentSection.vue
│   │   │   ├── ProjectsSection.vue
│   │   │   └── ContactSection.vue
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── StatCard.vue
│   │       ├── FeatureCard.vue
│   │       ├── TimelineStep.vue
│   │       ├── TestimonialCard.vue
│   │       └── SectionHeading.vue
│   ├── composables/
│   │   ├── useScrollAnimation.js   # Intersection Observer for animations
│   │   └── useFormValidation.js    # Form validation logic
│   ├── data/
│   │   └── content.js              # All site copy in one place for easy editing
│   ├── App.vue
│   └── main.js
├── .env.example                    # Environment variables template
├── .gitignore
├── index.html
├── netlify.toml                    # Netlify configuration
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Design System

### Color Palette

```javascript
// tailwind.config.js - colors
colors: {
  // Primary: Forest Green (Trust, Oregon, Nature)
  forest: {
    50:  '#f0f7f1',
    100: '#d9ead9',
    200: '#b3d5b3',
    300: '#8cbf8c',
    400: '#66a866',
    500: '#2C5F2D',  // PRIMARY - Use for CTAs, headings, accents
    600: '#244d24',
    700: '#1c3b1c',
    800: '#142914',
    900: '#0c170c',
  },
  // Secondary: Warm Sand/Cream (Approachable, Premium)
  sand: {
    50:  '#FDFCFA',  // Background light sections
    100: '#F7F4EF',  // Card backgrounds
    200: '#EDE8DF',
    300: '#E0D7C9',
    400: '#C9BBAA',
    500: '#B5A48E',
    600: '#998A74',
    700: '#7D705C',
    800: '#615644',
    900: '#453C2C',
  },
  // Accent: Terracotta (Energy, Action, Warmth)
  terracotta: {
    50:  '#fef6f4',
    100: '#fce8e3',
    200: '#f9d0c7',
    300: '#f4b0a0',
    400: '#ec8a74',
    500: '#B85042',  // ACCENT - Use sparingly for emphasis
    600: '#9a4238',
    700: '#7c352d',
    800: '#5e2822',
    900: '#401b17',
  },
  // Neutral: Charcoal (Text, Borders)
  charcoal: {
    50:  '#f6f7f7',
    100: '#e3e5e5',
    200: '#c7cbcc',
    300: '#a9afb0',
    400: '#8b9294',
    500: '#6d7578',
    600: '#565d5f',
    700: '#404546',
    800: '#2A2E2F',  // Body text
    900: '#1a1d1e',  // Headings
  },
}
```

### Typography

```javascript
// tailwind.config.js - fontFamily
fontFamily: {
  // Headings: Georgia (Classic, Trustworthy, Editorial)
  heading: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
  // Body: Inter (Modern, Clean, Readable)
  body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
}

// Font size scale (tailwind defaults + custom)
fontSize: {
  'xs':   ['0.75rem', { lineHeight: '1rem' }],
  'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.625' }],        // 16px, relaxed line height
  'lg':   ['1.125rem', { lineHeight: '1.625' }],
  'xl':   ['1.25rem', { lineHeight: '1.5' }],
  '2xl':  ['1.5rem', { lineHeight: '1.4' }],
  '3xl':  ['1.875rem', { lineHeight: '1.3' }],
  '4xl':  ['2.25rem', { lineHeight: '1.2' }],
  '5xl':  ['3rem', { lineHeight: '1.1' }],
  '6xl':  ['3.75rem', { lineHeight: '1.05' }],      // Hero headline
  'display': ['4.5rem', { lineHeight: '1' }],       // Extra large display
}
```

### Typography Usage Rules

| Element | Font | Size (Desktop) | Size (Mobile) | Weight | Color |
|---------|------|----------------|---------------|--------|-------|
| Hero Headline | `font-heading` | `text-6xl` | `text-4xl` | `font-bold` | `text-white` or `text-charcoal-900` |
| Section Title | `font-heading` | `text-4xl` | `text-3xl` | `font-bold` | `text-charcoal-900` |
| Subtitle/Tagline | `font-body` | `text-xl` | `text-lg` | `font-medium` | `text-charcoal-600` |
| Body Text | `font-body` | `text-base` | `text-base` | `font-normal` | `text-charcoal-700` |
| Small/Caption | `font-body` | `text-sm` | `text-sm` | `font-normal` | `text-charcoal-500` |
| Button Text | `font-body` | `text-base` | `text-base` | `font-semibold` | varies |
| Nav Links | `font-body` | `text-sm` | `text-base` | `font-medium` | `text-charcoal-700` |
| Stat Numbers | `font-heading` | `text-5xl` | `text-4xl` | `font-bold` | `text-forest-500` |

### Spacing System

Use Tailwind's default spacing scale consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `space-4` | 1rem | Minimum padding, tight gaps |
| `space-6` | 1.5rem | Card padding, element gaps |
| `space-8` | 2rem | Component separation |
| `space-12` | 3rem | Small section padding |
| `space-16` | 4rem | Medium section padding |
| `space-20` | 5rem | Section padding (mobile) |
| `space-24` | 6rem | Section padding (desktop) |
| `space-32` | 8rem | Large section padding |

### Section Padding Pattern

```html
<!-- Standard section wrapper -->
<section class="py-20 md:py-24 lg:py-32">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    <!-- Section content -->
  </div>
</section>
```

### Component Styling Patterns

**Primary Button:**
```html
<button class="
  inline-flex items-center justify-center
  px-6 py-3
  bg-forest-500 hover:bg-forest-600 active:bg-forest-700
  text-white font-semibold
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
">
```

**Secondary Button:**
```html
<button class="
  inline-flex items-center justify-center
  px-6 py-3
  bg-transparent hover:bg-forest-50
  text-forest-600 font-semibold
  border-2 border-forest-500
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
">
```

**Card:**
```html
<div class="
  bg-white
  rounded-2xl
  p-6 md:p-8
  shadow-sm hover:shadow-md
  border border-charcoal-100
  transition-shadow duration-300
">
```

**Stat Card:**
```html
<div class="text-center p-6">
  <p class="text-5xl font-heading font-bold text-forest-500">$460K</p>
  <p class="mt-2 text-sm text-charcoal-500 uppercase tracking-wide">Median Home Price</p>
</div>
```

---

## Page Sections — Detailed Specifications

### 1. Navigation Bar (`NavBar.vue`)

**Behavior:**
- Fixed position at top of viewport
- Transparent background on hero, white background after scroll (50px threshold)
- Smooth transition between states
- Mobile: Hamburger menu → Full-screen overlay

**Structure:**
```vue
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
          <img src="@/assets/images/logo.svg" alt="Lane County Housing" class="h-8 md:h-10">
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
        <button @click="mobileMenuOpen = true" class="md:hidden p-2">
          <Bars3Icon class="w-6 h-6" :class="isScrolled ? 'text-charcoal-900' : 'text-white'" />
        </button>
      </div>
    </nav>
  </header>
</template>
```

**Navigation Links:**
```javascript
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Opportunity', href: '#opportunity' },
  { label: 'Our Approach', href: '#approach' },
  { label: 'Investment', href: '#investment' },
  { label: 'Contact', href: '#contact' },
]
```

---

### 2. Hero Section (`HeroSection.vue`)

**Layout:** Full viewport height, background image with overlay, centered content

**Structure:**
```vue
<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img 
        src="@/assets/images/hero-bg.jpg" 
        alt="" 
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900/70"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
      <!-- Badge -->
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
        <span class="text-sm text-white/90 font-medium">Now Accepting Investors</span>
      </div>
      
      <!-- Headline -->
      <h1 class="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
        Building Lane County's Future,<br class="hidden sm:block" />
        <span class="text-terracotta-400">One Home at a Time</span>
      </h1>
      
      <!-- Subheadline -->
      <p class="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
        A new residential development company bringing decades of construction expertise 
        to Oregon's high-demand housing market. Join us as an investment partner.
      </p>
      
      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#investment" 
           class="w-full sm:w-auto px-8 py-4 bg-forest-500 hover:bg-forest-600 text-white font-semibold rounded-lg transition-colors text-lg">
          View Investment Opportunity
        </a>
        <a href="#about" 
           class="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 transition-colors text-lg">
          Learn About Us
        </a>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <ChevronDownIcon class="w-8 h-8 text-white/60" />
    </div>
  </section>
</template>
```

**Hero Background Image Requirements:**
- High-quality landscape of Lane County/Oregon (mountains, forests, or aerial of Eugene/Springfield)
- Minimum resolution: 1920x1080
- Optimized for web: <500KB if possible
- Fallback: Solid gradient if image fails to load

---

### 3. About Section (`AboutSection.vue`)

**Layout:** Two-column on desktop (image left, content right), stacked on mobile

**Content Focus:** Establish credibility through founders' GC experience

**Structure:**
```vue
<template>
  <section id="about" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <!-- Image Column -->
        <div class="relative">
          <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="@/assets/images/team-placeholder.jpg" 
              alt="Founders on job site"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- Experience Badge (overlapping card) -->
          <div class="absolute -bottom-6 -right-6 md:right-8 bg-white rounded-xl shadow-lg p-6 max-w-xs">
            <p class="text-4xl font-heading font-bold text-forest-500">25+</p>
            <p class="text-charcoal-600 mt-1">Years Combined Construction Experience</p>
          </div>
        </div>
        
        <!-- Content Column -->
        <div class="lg:pl-8">
          <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">About Us</p>
          <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
            From General Contractors to Residential Developers
          </h2>
          <p class="mt-6 text-lg text-charcoal-600 leading-relaxed">
            After decades of building homes for others, we're taking everything we've learned 
            and applying it to our own developments. We know what it takes to deliver quality 
            construction on time and on budget — because we've done it hundreds of times.
          </p>
          
          <!-- Founder Credentials -->
          <div class="mt-8 space-y-4">
            <div class="flex items-start space-x-4">
              <CheckCircleIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-charcoal-900">Licensed & Bonded in Oregon</p>
                <p class="text-charcoal-600 text-sm">CCB License #XXXXXX — Active and in good standing</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <CheckCircleIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-charcoal-900">100+ Homes Built</p>
                <p class="text-charcoal-600 text-sm">Custom homes, renovations, and multi-family across Lane County</p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <CheckCircleIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-semibold text-charcoal-900">Deep Local Relationships</p>
                <p class="text-charcoal-600 text-sm">Trusted network of subcontractors, suppliers, and city officials</p>
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
```

---

### 4. Opportunity Section (`OpportunitySection.vue`)

**Layout:** Stats bar + Two-column content with market data

**Content Focus:** Lane County market opportunity, housing demand, why now

**Structure:**
```vue
<template>
  <section id="opportunity" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">The Opportunity</p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          Lane County's Housing Market is Ready for New Inventory
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          Strong demand, limited supply, and favorable economics create an ideal environment 
          for residential development.
        </p>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div v-for="stat in marketStats" :key="stat.label" 
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
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
              <span>Population growth outpacing housing construction</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
              <span>3 months of inventory — a strong seller's market</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
              <span>University of Oregon drives steady rental & purchase demand</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
              <span>Remote work migration from California continues</span>
            </li>
          </ul>
        </div>
        
        <!-- Economics Card -->
        <div class="bg-sand-100 rounded-2xl p-8">
          <h3 class="font-heading text-2xl font-bold text-charcoal-900 mb-4">Favorable Economics</h3>
          <ul class="space-y-4">
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span class="text-charcoal-700">Median sale price: <strong>$460,000</strong></span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span class="text-charcoal-700">Build cost: <strong>$294/sq ft</strong> average</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span class="text-charcoal-700">Target gross margin: <strong>20-25%</strong> per home</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="w-5 h-5 text-forest-500 flex-shrink-0 mt-0.5" />
              <span class="text-charcoal-700">Construction loans available at <strong>7.5% APR</strong></span>
            </li>
          </ul>
        </div>
        
      </div>
      
      <!-- Source Citation -->
      <p class="mt-8 text-center text-sm text-charcoal-400">
        Market data: Redfin Lane County (Dec 2025), U.S. Census, MLS/Altos Research
      </p>
      
    </div>
  </section>
</template>

<script setup>
const marketStats = [
  { value: '$460K', label: 'Median Home Price' },
  { value: '382K', label: 'County Population' },
  { value: '1,808', label: 'Permits Issued (2024)' },
  { value: '3 mo', label: 'Inventory Supply' },
]
</script>
```

---

### 5. Approach Section (`ApproachSection.vue`)

**Layout:** Process timeline with icons, alternating left/right on desktop

**Content Focus:** How they build — quality, timeline, cost control

**Structure:**
```vue
<template>
  <section id="approach" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">Our Approach</p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          A Proven Build Process, Refined Over Decades
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          We don't cut corners. Our systematic approach delivers quality homes on time and on budget.
        </p>
      </div>
      
      <!-- Process Timeline -->
      <div class="relative">
        <!-- Vertical Line (desktop only) -->
        <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-forest-200 transform -translate-x-1/2"></div>
        
        <!-- Timeline Steps -->
        <div class="space-y-12 lg:space-y-0">
          <div v-for="(step, index) in processSteps" :key="step.title"
               class="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"
               :class="index % 2 === 0 ? '' : 'lg:flex-row-reverse'">
            
            <!-- Step Number (Center on desktop) -->
            <div class="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-forest-500 text-white items-center justify-center font-bold text-lg z-10">
              {{ index + 1 }}
            </div>
            
            <!-- Content Card -->
            <div :class="[
              'bg-white rounded-xl p-6 shadow-sm border border-charcoal-100',
              index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8 lg:col-start-2'
            ]">
              <div class="flex items-start space-x-4">
                <div class="lg:hidden flex-shrink-0 w-10 h-10 rounded-full bg-forest-500 text-white flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div>
                  <h3 class="font-heading text-xl font-bold text-charcoal-900">{{ step.title }}</h3>
                  <p class="mt-2 text-charcoal-600">{{ step.description }}</p>
                  <p class="mt-3 text-sm text-forest-600 font-medium">{{ step.duration }}</p>
                </div>
              </div>
            </div>
            
            <!-- Spacer for alternating layout -->
            <div :class="index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'" class="hidden lg:block"></div>
            
          </div>
        </div>
      </div>
      
      <!-- Bottom CTA -->
      <div class="mt-16 text-center">
        <p class="text-lg text-charcoal-600 mb-6">
          Total project timeline: <strong>9-12 months</strong> from land acquisition to sold home
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
const processSteps = [
  {
    title: 'Site Selection & Acquisition',
    description: 'We identify buildable lots in high-demand neighborhoods with strong resale potential. Our local knowledge helps us find off-market opportunities.',
    duration: '1-2 months'
  },
  {
    title: 'Design & Permitting',
    description: 'Working with licensed architects and engineers, we create efficient floor plans that maximize value while navigating the permitting process.',
    duration: '2-3 months'
  },
  {
    title: 'Construction',
    description: 'Our trusted network of subcontractors executes the build. Weekly progress updates, strict quality control, and budget tracking at every phase.',
    duration: '4-6 months'
  },
  {
    title: 'Sale & Distribution',
    description: 'We list through top local agents, close with buyers, repay construction financing, and distribute profits to investors.',
    duration: '1-2 months'
  },
]
</script>
```

---

### 6. Investment Section (`InvestmentSection.vue`)

**Layout:** Feature grid + key terms summary

**Content Focus:** High-level investment structure (NOT full terms — tease to capture leads)

**Structure:**
```vue
<template>
  <section id="investment" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">Investment Opportunity</p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          Partner With Us on Our Pilot Development
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          We're raising capital for our first 5-home development cycle. Here's the high-level structure.
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
                <dd class="font-semibold">$200K - $500K</dd>
              </div>
              <div class="flex justify-between border-b border-white/20 pb-3">
                <dt class="text-white/80">Number of Homes</dt>
                <dd class="font-semibold">3-5 Homes</dd>
              </div>
              <div class="flex justify-between border-b border-white/20 pb-3">
                <dt class="text-white/80">Projected Cycle</dt>
                <dd class="font-semibold">12-18 Months</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-white/80">Target ROI Range</dt>
                <dd class="font-semibold">15-25%*</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 class="font-heading text-2xl font-bold mb-6">What Investors Receive</h3>
            <ul class="space-y-3">
              <li class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
                <span>Preferred return structure with profit participation</span>
              </li>
              <li class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
                <span>Quarterly progress reports and financial updates</span>
              </li>
              <li class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
                <span>Secured position against real property assets</span>
              </li>
              <li class="flex items-start space-x-3">
                <CheckIcon class="w-5 h-5 text-terracotta-300 flex-shrink-0 mt-0.5" />
                <span>Priority access to future development cycles</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <!-- Disclaimer -->
        <p class="mt-8 text-sm text-white/60 border-t border-white/20 pt-6">
          *Projected returns are estimates based on current market conditions and are not guaranteed. 
          Investment involves risk including potential loss of principal. Full terms provided to qualified investors.
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
import { CurrencyDollarIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const investmentHighlights = [
  {
    icon: CurrencyDollarIcon,
    title: 'Equity Investment',
    description: 'Participate as an equity partner in our residential developments with profit-sharing on each home sold.'
  },
  {
    icon: ChartBarIcon,
    title: 'Asset-Backed',
    description: 'Your investment is secured by real property — land and homes under construction in Lane County.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Experienced Operators',
    description: 'Decades of construction experience means we know how to control costs and deliver on time.'
  },
]
</script>
```

---

### 7. Projects Section (`ProjectsSection.vue`)

**Layout:** Card grid showing current/upcoming projects (placeholder for Phase 0)

**Content Focus:** Tease what's coming — builds anticipation

**Structure:**
```vue
<template>
  <section id="projects" class="py-20 md:py-24 lg:py-32 bg-sand-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">Current Projects</p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          Our Development Pipeline
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          We're actively sourcing land and preparing for our first development cycle.
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
```

---

### 8. Contact Section (`ContactSection.vue`)

**Layout:** Two-column — Form left, contact info right

**Form Handling:** Netlify Forms (zero backend required)

**Structure:**
```vue
<template>
  <section id="contact" class="py-20 md:py-24 lg:py-32 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <p class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">Get In Touch</p>
        <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
          Interested in Investing?
        </h2>
        <p class="mt-4 text-lg text-charcoal-600">
          Fill out the form below and we'll send you our detailed investor packet and schedule a call.
        </p>
      </div>
      
      <div class="grid lg:grid-cols-5 gap-12 lg:gap-16">
        
        <!-- Form Column (3/5) -->
        <div class="lg:col-span-3">
          <form 
            name="investor-inquiry"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            @submit.prevent="handleSubmit"
            class="space-y-6"
          >
            <!-- Honeypot (spam protection) -->
            <input type="hidden" name="form-name" value="investor-inquiry" />
            <p class="hidden">
              <label>Don't fill this out: <input name="bot-field" /></label>
            </p>
            
            <!-- Name Fields -->
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-charcoal-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  v-model="form.firstName"
                  class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-charcoal-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  v-model="form.lastName"
                  class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>
            
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-charcoal-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                v-model="form.email"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
            
            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-charcoal-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                v-model="form.phone"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <!-- Investment Range -->
            <div>
              <label for="investmentRange" class="block text-sm font-medium text-charcoal-700 mb-2">
                Potential Investment Range
              </label>
              <select
                id="investmentRange"
                name="investmentRange"
                v-model="form.investmentRange"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors bg-white"
              >
                <option value="">Select a range...</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k+">$250,000+</option>
                <option value="undecided">Not sure yet</option>
              </select>
            </div>
            
            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-charcoal-700 mb-2">
                Questions or Comments
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                v-model="form.message"
                class="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none transition-colors resize-none"
                placeholder="Tell us about your investment goals or any questions you have..."
              ></textarea>
            </div>
            
            <!-- Accredited Investor Checkbox -->
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accredited"
                name="accredited"
                v-model="form.accredited"
                class="mt-1 w-5 h-5 rounded border-charcoal-300 text-forest-500 focus:ring-forest-500"
              />
              <label for="accredited" class="text-sm text-charcoal-600">
                I am an <a href="https://www.sec.gov/education/capitalraising/building-blocks/accredited-investor" target="_blank" class="text-forest-600 underline hover:text-forest-700">accredited investor</a> 
                or am investing through an accredited entity.
              </label>
            </div>
            
            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              <span v-if="!isSubmitting">Request Investor Packet</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
            
            <p class="text-xs text-charcoal-400 text-center">
              By submitting, you agree to receive investment-related communications. 
              We respect your privacy and will never share your information.
            </p>
            
          </form>
          
          <!-- Success Message (shown after submission) -->
          <div v-if="submitted" class="mt-8 p-6 bg-forest-50 border border-forest-200 rounded-xl text-center">
            <CheckCircleIcon class="w-12 h-12 text-forest-500 mx-auto mb-4" />
            <h3 class="font-heading text-xl font-bold text-charcoal-900">Thank You!</h3>
            <p class="mt-2 text-charcoal-600">
              We've received your inquiry and will send the investor packet to your email within 24 hours.
            </p>
          </div>
        </div>
        
        <!-- Contact Info Column (2/5) -->
        <div class="lg:col-span-2">
          <div class="bg-sand-50 rounded-2xl p-8 h-full">
            <h3 class="font-heading text-xl font-bold text-charcoal-900 mb-6">Contact Information</h3>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <EnvelopeIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Email</p>
                  <a href="mailto:invest@lanecountyhousing.com" class="text-forest-600 hover:text-forest-700">
                    invest@lanecountyhousing.com
                  </a>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <PhoneIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Phone</p>
                  <a href="tel:+15415551234" class="text-forest-600 hover:text-forest-700">
                    (541) 555-1234
                  </a>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <MapPinIcon class="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-charcoal-900">Location</p>
                  <p class="text-charcoal-600">
                    Springfield, Oregon<br />
                    Lane County
                  </p>
                </div>
              </div>
            </div>
            
            <hr class="my-8 border-charcoal-200" />
            
            <div>
              <p class="font-medium text-charcoal-900 mb-3">Prefer to Schedule a Call?</p>
              <a 
                href="#" 
                class="inline-flex items-center px-5 py-2.5 bg-white border border-forest-500 text-forest-600 font-semibold rounded-lg hover:bg-forest-50 transition-colors"
              >
                <CalendarIcon class="w-5 h-5 mr-2" />
                Book a Meeting
              </a>
              <p class="mt-2 text-xs text-charcoal-400">
                (Calendly integration coming soon)
              </p>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  investmentRange: '',
  message: '',
  accredited: false,
})

const isSubmitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Netlify Forms submission
    const formData = new FormData()
    formData.append('form-name', 'investor-inquiry')
    Object.entries(form.value).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
    
    submitted.value = true
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      investmentRange: '',
      message: '',
      accredited: false,
    }
  } catch (error) {
    console.error('Form submission error:', error)
    alert('There was an error submitting the form. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

---

### 9. Footer (`Footer.vue`)

**Structure:**
```vue
<template>
  <footer class="bg-charcoal-900 text-white py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        
        <!-- Brand Column -->
        <div>
          <img src="@/assets/images/logo-white.svg" alt="Lane County Housing" class="h-10 mb-4" />
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
        <p>&copy; {{ new Date().getFullYear() }} Lane County Housing Development LLC. All rights reserved.</p>
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
```

---

## Configuration Files

### `package.json`

```json
{
  "name": "lane-county-housing",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "@heroicons/vue": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.0"
  }
}
```

### `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        }
      }
    }
  }
})
```

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f1',
          100: '#d9ead9',
          200: '#b3d5b3',
          300: '#8cbf8c',
          400: '#66a866',
          500: '#2C5F2D',
          600: '#244d24',
          700: '#1c3b1c',
          800: '#142914',
          900: '#0c170c',
        },
        sand: {
          50:  '#FDFCFA',
          100: '#F7F4EF',
          200: '#EDE8DF',
          300: '#E0D7C9',
          400: '#C9BBAA',
          500: '#B5A48E',
          600: '#998A74',
          700: '#7D705C',
          800: '#615644',
          900: '#453C2C',
        },
        terracotta: {
          50:  '#fef6f4',
          100: '#fce8e3',
          200: '#f9d0c7',
          300: '#f4b0a0',
          400: '#ec8a74',
          500: '#B85042',
          600: '#9a4238',
          700: '#7c352d',
          800: '#5e2822',
          900: '#401b17',
        },
        charcoal: {
          50:  '#f6f7f7',
          100: '#e3e5e5',
          200: '#c7cbcc',
          300: '#a9afb0',
          400: '#8b9294',
          500: '#6d7578',
          600: '#565d5f',
          700: '#404546',
          800: '#2A2E2F',
          900: '#1a1d1e',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>Lane County Housing Development | Invest in Oregon Real Estate</title>
    <meta name="title" content="Lane County Housing Development | Invest in Oregon Real Estate" />
    <meta name="description" content="A new residential development company building quality homes in Lane County, Oregon. Join us as an investment partner and grow with Oregon's housing market." />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://lanecountyhousing.com/" />
    <meta property="og:title" content="Lane County Housing Development | Invest in Oregon Real Estate" />
    <meta property="og:description" content="A new residential development company building quality homes in Lane County, Oregon. Join us as an investment partner." />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://lanecountyhousing.com/" />
    <meta property="twitter:title" content="Lane County Housing Development | Invest in Oregon Real Estate" />
    <meta property="twitter:description" content="A new residential development company building quality homes in Lane County, Oregon. Join us as an investment partner." />
    <meta property="twitter:image" content="/og-image.jpg" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    
  </head>
  <body class="font-body text-charcoal-800 antialiased">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## Content Data File (`src/data/content.js`)

All site copy in one editable location:

```javascript
export const siteContent = {
  // Company Info (update with real details)
  company: {
    name: 'Lane County Housing Development LLC',
    tagline: 'Building Lane County\'s Future, One Home at a Time',
    ccbLicense: 'XXXXXX', // Replace with real CCB #
    email: 'invest@lanecountyhousing.com',
    phone: '(541) 555-1234',
    location: 'Springfield, Oregon',
  },
  
  // Hero Section
  hero: {
    badge: 'Now Accepting Investors',
    headline: 'Building Lane County\'s Future,',
    headlineAccent: 'One Home at a Time',
    subheadline: 'A new residential development company bringing decades of construction expertise to Oregon\'s high-demand housing market. Join us as an investment partner.',
    ctaPrimary: 'View Investment Opportunity',
    ctaSecondary: 'Learn About Us',
  },
  
  // About Section
  about: {
    sectionLabel: 'About Us',
    headline: 'From General Contractors to Residential Developers',
    description: 'After decades of building homes for others, we\'re taking everything we\'ve learned and applying it to our own developments. We know what it takes to deliver quality construction on time and on budget — because we\'ve done it hundreds of times.',
    experienceYears: '25+',
    experienceLabel: 'Years Combined Construction Experience',
    credentials: [
      {
        title: 'Licensed & Bonded in Oregon',
        description: 'CCB License #XXXXXX — Active and in good standing',
      },
      {
        title: '100+ Homes Built',
        description: 'Custom homes, renovations, and multi-family across Lane County',
      },
      {
        title: 'Deep Local Relationships',
        description: 'Trusted network of subcontractors, suppliers, and city officials',
      },
    ],
  },
  
  // Opportunity Section
  opportunity: {
    sectionLabel: 'The Opportunity',
    headline: 'Lane County\'s Housing Market is Ready for New Inventory',
    description: 'Strong demand, limited supply, and favorable economics create an ideal environment for residential development.',
    stats: [
      { value: '$460K', label: 'Median Home Price' },
      { value: '382K', label: 'County Population' },
      { value: '1,808', label: 'Permits Issued (2024)' },
      { value: '3 mo', label: 'Inventory Supply' },
    ],
    demandPoints: [
      'Population growth outpacing housing construction',
      '3 months of inventory — a strong seller\'s market',
      'University of Oregon drives steady rental & purchase demand',
      'Remote work migration from California continues',
    ],
    economicsPoints: [
      { text: 'Median sale price:', value: '$460,000' },
      { text: 'Build cost:', value: '$294/sq ft average' },
      { text: 'Target gross margin:', value: '20-25% per home' },
      { text: 'Construction loans available at', value: '7.5% APR' },
    ],
    sourceNote: 'Market data: Redfin Lane County (Dec 2025), U.S. Census, MLS/Altos Research',
  },
  
  // Investment Section
  investment: {
    sectionLabel: 'Investment Opportunity',
    headline: 'Partner With Us on Our Pilot Development',
    description: 'We\'re raising capital for our first 5-home development cycle. Here\'s the high-level structure.',
    highlights: [
      {
        title: 'Equity Investment',
        description: 'Participate as an equity partner in our residential developments with profit-sharing on each home sold.',
      },
      {
        title: 'Asset-Backed',
        description: 'Your investment is secured by real property — land and homes under construction in Lane County.',
      },
      {
        title: 'Experienced Operators',
        description: 'Decades of construction experience means we know how to control costs and deliver on time.',
      },
    ],
    terms: {
      targetRaise: '$200K - $500K',
      numberOfHomes: '3-5 Homes',
      projectedCycle: '12-18 Months',
      targetROI: '15-25%*',
    },
    investorBenefits: [
      'Preferred return structure with profit participation',
      'Quarterly progress reports and financial updates',
      'Secured position against real property assets',
      'Priority access to future development cycles',
    ],
    disclaimer: '*Projected returns are estimates based on current market conditions and are not guaranteed. Investment involves risk including potential loss of principal. Full terms provided to qualified investors.',
  },
  
  // Contact Section
  contact: {
    sectionLabel: 'Get In Touch',
    headline: 'Interested in Investing?',
    description: 'Fill out the form below and we\'ll send you our detailed investor packet and schedule a call.',
  },
}
```

---

## Composables

### `src/composables/useScrollAnimation.js`

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
  } = options
  
  const isVisible = ref(false)
  const elementRef = ref(null)
  let observer = null
  
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )
    
    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  })
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
  
  return { elementRef, isVisible }
}
```

### `src/composables/useNavScroll.js`

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useNavScroll(scrollThreshold = 50) {
  const isScrolled = ref(false)
  
  const handleScroll = () => {
    isScrolled.value = window.scrollY > scrollThreshold
  }
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state
  })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  
  return { isScrolled }
}
```

---

## Main Entry Files

### `src/main.js`

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'

createApp(App).mount('#app')
```

### `src/App.vue`

```vue
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
    <MobileMenu v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
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
```

### `src/assets/styles/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Animation utilities */
@layer utilities {
  .animate-fade-up {
    animation: fadeUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Transition delays for staggered animations */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
```

---

## Image Requirements

| Image | Location | Dimensions | Format | Notes |
|-------|----------|------------|--------|-------|
| `hero-bg.jpg` | `/src/assets/images/` | 1920×1080 min | JPG | Lane County landscape, optimized <500KB |
| `team-placeholder.jpg` | `/src/assets/images/` | 800×600 | JPG | Founders on job site (placeholder OK) |
| `construction-1.jpg` | `/src/assets/images/` | 600×400 | JPG | Home under construction |
| `construction-2.jpg` | `/src/assets/images/` | 600×400 | JPG | Completed home exterior |
| `logo.svg` | `/src/assets/images/` | Vector | SVG | Company logo (dark version) |
| `logo-white.svg` | `/src/assets/images/` | Vector | SVG | Company logo (white version for footer) |
| `og-image.jpg` | `/public/` | 1200×630 | JPG | Social sharing preview |
| `favicon.ico` | `/public/` | 32×32 | ICO | Browser tab icon |

**Stock Photo Sources (for placeholders):**
- Unsplash: [unsplash.com](https://unsplash.com) (free, high-quality)
- Pexels: [pexels.com](https://pexels.com) (free)
- Search terms: "Oregon landscape", "home construction", "new home exterior", "contractor site"

---

## Deployment Checklist

1. **Pre-Deploy:**
   - [ ] Replace all placeholder content in `src/data/content.js`
   - [ ] Add real CCB license number
   - [ ] Add real contact email/phone
   - [ ] Replace placeholder images with real photos
   - [ ] Test form submission on Netlify deploy preview
   - [ ] Test all navigation links
   - [ ] Test mobile responsiveness

2. **Deploy:**
   - [ ] Push to GitHub main branch
   - [ ] Netlify auto-deploys from main
   - [ ] Verify Netlify Forms is capturing submissions
   - [ ] Test live site on mobile device

3. **Post-Deploy:**
   - [ ] Set up custom domain (if available)
   - [ ] Enable HTTPS (automatic on Netlify)
   - [ ] Submit to Google Search Console
   - [ ] Create Google Business Profile (future)

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Total Page Size | <2MB | DevTools |
| Lighthouse Performance | >90 | Lighthouse |
| Mobile Usability | 100% | Google |

---

## Future Enhancements (Post-Phase 0)

- [ ] Add Calendly integration for "Book a Meeting" button
- [ ] Add Google Analytics / Plausible analytics
- [ ] Add blog section for SEO content
- [ ] Add testimonials section (after first investors)
- [ ] Add live project gallery (after construction starts)
- [ ] Add investor login portal (Phase 3)

---

## Agent Instructions Summary

**When building this site, follow this order:**

1. Initialize project with `npm create vite@latest lane-county-housing -- --template vue`
2. Install dependencies: `npm install @heroicons/vue && npm install -D tailwindcss postcss autoprefixer`
3. Configure Tailwind with the custom theme above
4. Create the project structure as specified
5. Build components in this order:
   - Layout components (NavBar, Footer, MobileMenu)
   - UI components (BaseButton, StatCard, etc.)
   - Section components (Hero → About → Opportunity → Approach → Investment → Projects → Contact)
6. Wire up App.vue with all sections
7. Add smooth scroll and animations
8. Test Netlify Forms integration
9. Optimize images and run Lighthouse audit
10. Deploy to Netlify

**Critical Requirements:**
- Use Vue 3 Composition API with `<script setup>`
- Use Tailwind utility classes exclusively (no custom CSS except animations)
- Ensure all sections have proper `id` attributes for navigation
- Form must use Netlify Forms attribute syntax
- All content should be editable from `src/data/content.js`
- Mobile-first responsive design
- Accessible (proper heading hierarchy, alt text, focus states)

---

*Blueprint Version: 1.0 | Created: February 2026 | For: Brandtworks-Enterprises LLC*
