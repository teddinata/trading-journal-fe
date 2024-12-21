# src/views/Login.vue
<template>
  <div class="min-h-screen bg-gray-900 relative overflow-hidden">
    <!-- Background Illustrations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <!-- Decorative Elements -->
      <div class="absolute left-20 top-40">
        <div class="w-40 h-40 decorative-dots bg-emerald-500 rounded-xl opacity-10"></div>
      </div>
      <div class="absolute right-20 bottom-40">
        <div class="w-40 h-40 decorative-dots bg-emerald-500 rounded-xl opacity-10"></div>
      </div>
      
      <!-- Woman Working Illustration -->
      <div class="absolute right-20 top-1/2 -translate-y-1/2">
        <img src="/programmer.svg" alt="Woman Working" class="w-80 h-80 opacity-80" />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 p-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <h1 class="text-xl font-bold text-white">Trading Journal</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">Sign up</button>
          <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors">
            Request Demo
          </button>
        </div>
      </div>
    </nav>

    <!-- Login Container -->
    <div class="relative z-10 max-w-md mx-auto mt-20 px-4">
      <div class="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold mb-2 text-white">Agent Login</h2>
          <p class="text-gray-400 text-sm">Hey, Enter your details to get sign in<br>to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Enter Email / Phone No"
              class="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Passcode"
              class="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
            <button 
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-emerald-400"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <div class="text-right">
            <button type="button" class="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Having trouble in sign in?
            </button>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>

          <p class="text-center text-sm text-gray-400">
            Don't have an account?
            <button type="button" class="text-emerald-400 font-medium hover:text-emerald-300 ml-1 transition-colors">
              Request Now
            </button>
          </p>
        </form>
      </div>
    </div>

    <!-- Toast Container -->
    <Toaster position="top-right" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    await auth.login({
      email: email.value,
      password: password.value
    })
    toast.success('Login successful!', {
      duration: 3000,
      description: 'Redirecting you to dashboard...'
    })
    setTimeout(() => router.push('/'), 1000)
  } catch (error) {
    toast.error('Login failed', {
      duration: 4000,
      description: 'Please check your credentials and try again.'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.decorative-dots {
  background-image: radial-gradient(#fff 1px, transparent 1px);
  background-size: 8px 8px;
}
</style>