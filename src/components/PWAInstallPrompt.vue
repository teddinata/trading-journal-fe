<!-- src/components/PWAInstallPrompt.vue -->
<template>
  <div 
    v-if="showInstallPrompt"
    class="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700 transform transition-transform duration-300"
    :class="{ 'translate-y-full': !showInstallPrompt }"
  >
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="hidden sm:block p-2 bg-emerald-600 rounded-lg">
          <DevicePhoneMobileIcon class="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 class="text-white font-medium">Install Trading Journal</h3>
          <p class="text-sm text-gray-400">Add to home screen for quick access</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="hideInstallPrompt"
          class="px-4 py-2 text-sm text-gray-400 hover:text-white"
        >
          Later
        </button>
        <button
          @click="installPWA"
          class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500"
        >
          Install
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'

const deferredPrompt = ref(null)
const showInstallPrompt = ref(false)

onMounted(() => {
  // Check if already installed
  if (localStorage.getItem('pwaInstalled')) return

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })

  window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwaInstalled', 'true')
    showInstallPrompt.value = false
  })
})

const installPWA = async () => {
  if (!deferredPrompt.value) return
  
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    deferredPrompt.value = null
  }
}

const hideInstallPrompt = () => {
  showInstallPrompt.value = false
  // Hide for 7 days
  localStorage.setItem('hideInstallPrompt', new Date().getTime() + (7 * 24 * 60 * 60 * 1000))
}
</script>