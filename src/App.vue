<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <router-view></router-view>
    <!-- Global Toast Container -->
    <Toaster position="top-right" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import { Toaster } from 'vue-sonner'

const auth = useAuthStore()

onMounted(async () => {
  try {
    await auth.loadUser()
  } catch (error) {
    console.error('Failed to load user:', error)
  }
})
</script>