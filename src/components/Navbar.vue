<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo dan Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-white font-bold text-xl">
            Trading Journal
          </router-link>
        </div>

        <!-- Menu Desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'bg-gray-900': $route.path === '/' }"
          >
            Home
          </router-link>
          <router-link 
            to="/kalkulator-saham" 
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'bg-gray-900': $route.path === '/kalkulator-saham' }"
          >
            Kalkulator ARA/ARB
          </router-link>
          <template v-if="token">
            <router-link 
              to="/dashboard" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'bg-gray-900': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/journal" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'bg-gray-900': $route.path === '/journal' }"
            >
              Journal
            </router-link>
          </template>
        </div>

        <!-- Menu Mobile Toggle -->
        <div class="flex items-center md:hidden">
          <button 
            @click="isOpen = !isOpen"
            class="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <Bars3Icon v-if="!isOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>

        <!-- Auth Buttons Desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="!token">
            <router-link 
              to="/login" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </router-link>
          </template>
          <template v-else>
            <!-- Profile Menu akan ditampilkan di DashboardLayout -->
          </template>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-show="isOpen" 
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link 
            to="/" 
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            :class="{ 'bg-gray-900': $route.path === '/' }"
            @click="isOpen = false"
          >
            Home
          </router-link>
          <router-link 
            to="/kalkulator-saham" 
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            :class="{ 'bg-gray-900': $route.path === '/kalkulator-saham' }"
            @click="isOpen = false"
          >
            Kalkulator ARA/ARB
          </router-link>
          <template v-if="token">
            <router-link 
              to="/dashboard" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              :class="{ 'bg-gray-900': $route.path === '/dashboard' }"
              @click="isOpen = false"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/journal" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              :class="{ 'bg-gray-900': $route.path === '/journal' }"
              @click="isOpen = false"
            >
              Journal
            </router-link>
          </template>
        </div>

        <!-- Mobile Auth Menu -->
        <div v-if="!token" class="pt-4 pb-3 border-t border-gray-700">
          <div class="space-y-2 px-2">
            <router-link 
              to="/login" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="isOpen = false"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="bg-emerald-500 text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium text-center transition-colors"
              @click="isOpen = false"
            >
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const isOpen = ref(false)
const token = computed(() => localStorage.getItem('token'))
</script>