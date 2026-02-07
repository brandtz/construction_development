<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

const authStore = useAuthStore()
</script>

<template>
  <component :is="authStore.isAuthenticated ? AppLayout : AuthLayout">
    <RouterView />
  </component>
</template>
