<template>
  <div class="bg-sand-50 rounded-xl p-6 border border-sand-200">
    <component :is="icon" class="w-10 h-10 text-forest-500 mb-4" />
    <h3 class="font-heading text-xl font-bold text-charcoal-900">{{ title }}</h3>
    <p class="mt-2 text-charcoal-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: [Object, Function],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
