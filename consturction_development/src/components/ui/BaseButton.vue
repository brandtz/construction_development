<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="!href ? type : undefined"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-forest-500 hover:bg-forest-600 active:bg-forest-700 text-white focus:ring-forest-500 disabled:bg-forest-300',
    secondary: 'bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white focus:ring-terracotta-500 disabled:bg-terracotta-300',
    outline: 'bg-transparent hover:bg-forest-50 text-forest-600 border-2 border-forest-500 focus:ring-forest-500',
    ghost: 'bg-transparent hover:bg-charcoal-100 text-charcoal-700 focus:ring-charcoal-500'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : '',
    props.disabled ? 'cursor-not-allowed opacity-60' : ''
  ].join(' ')
})
</script>
