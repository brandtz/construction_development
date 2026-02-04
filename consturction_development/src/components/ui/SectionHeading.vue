<template>
  <div class="text-center mb-16" :class="centered ? 'max-w-3xl mx-auto' : ''">
    <p v-if="label" class="text-forest-500 font-semibold text-sm uppercase tracking-wide mb-3">
      {{ label }}
    </p>
    <h2 class="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-lg text-charcoal-600">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: true
  }
})
</script>
