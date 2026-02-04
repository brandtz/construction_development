<template>
  <div class="text-center p-6">
    <p class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-forest-500">
      {{ value }}
    </p>
    <p class="mt-2 text-sm text-charcoal-600 uppercase tracking-wide">
      {{ label }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>
