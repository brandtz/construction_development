# Lane County Housing Development - Investor Portal

A Vue 3 + Vite single-page marketing website for Lane County Housing Development LLC.

## Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Forms**: Netlify Forms
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.css          # Tailwind imports + custom styles
├── components/
│   ├── layout/
│   │   ├── NavBar.vue
│   │   ├── Footer.vue
│   │   └── MobileMenu.vue
│   ├── sections/
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── OpportunitySection.vue
│   │   ├── ApproachSection.vue
│   │   ├── InvestmentSection.vue
│   │   ├── ProjectsSection.vue
│   │   └── ContactSection.vue
│   └── ui/
│       ├── BaseButton.vue
│       ├── StatCard.vue
│       ├── FeatureCard.vue
│       ├── TimelineStep.vue
│       └── SectionHeading.vue
├── composables/
│   ├── useScrollAnimation.js
│   ├── useNavScroll.js
│   └── useFormValidation.js
├── data/
│   └── content.js            # All site copy in one place
├── App.vue
└── main.js
```

## Configuration

### Tailwind CSS

Custom color palette and fonts are configured in `tailwind.config.js`:

- **Forest**: Primary green color for CTAs and accents
- **Sand**: Warm cream tones for backgrounds
- **Terracotta**: Accent color for emphasis
- **Charcoal**: Neutral tones for text

### Content Management

All site copy is centralized in `src/data/content.js` for easy editing without touching component files.

## Deployment

This project is configured for Netlify deployment:

1. Push to GitHub
2. Connect repository to Netlify
3. Deploy settings are in `netlify.toml`

## Development Notes

- Uses Vue 3 Composition API with `<script setup>` syntax
- Mobile-first responsive design
- Form handling via Netlify Forms (zero backend)
- Smooth scroll navigation between sections

## License

Private - Lane County Housing Development LLC

---

Built by [Brandtworks-Enterprises LLC](https://brandtworks-enterprises.com)
