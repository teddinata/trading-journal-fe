# src/layout/Dashboard.vue
<template>
  <div class="h-screen flex">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white border-r border-gray-700">
      <div class="h-16 flex items-center px-6 border-b border-gray-700">
        <h1 class="text-xl font-bold text-white">Trading Journal</h1>
      </div>
      
      <nav class="mt-6 px-4">
        <router-link 
          to="/" 
          class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
          :class="$route.path === '/' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
        >
          <ChartBarIcon class="h-5 w-5 mr-3" />
          Dashboard
        </router-link>

        <router-link 
          to="/journals" 
          class="flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.path.includes('/journal') ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
        >
          <ClipboardDocumentListIcon class="h-5 w-5 mr-3" />
          Daily Journal
        </router-link>

        <router-link 
          to="/stats" 
          class="flex items-center px-4 py-2.5 mt-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.path === '/stats' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
        >
          <ChartPieIcon class="h-5 w-5 mr-3" />
          Reports
        </router-link>
      </nav>

      <!-- User Profile Section -->
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-700 bg-gray-800">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">John Doe</p>
            <p class="text-xs text-gray-400">Trader</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden bg-gray-900">
      <!-- Header -->
      <header class="h-16 bg-gray-800 border-b border-gray-700 text-white flex items-center justify-between px-6">
        <div class="flex items-center space-x-4">
          <h2 class="font-semibold text-lg">
            <span v-if="$route.path === '/'">Dashboard</span>
            <span v-else-if="$route.path === '/journals'">Daily Journal</span>
            <span v-else-if="$route.path === '/journal/create'">Create New Position</span>
          </h2>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Notification Button -->
          <button class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <BellIcon class="h-5 w-5" />
          </button>
          
          <!-- Settings Button -->
          <button class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Cog6ToothIcon class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-900">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  ChartPieIcon,
  BellIcon,
  Cog6ToothIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
</script>

<style>
/* Custom scrollbar for dark mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
}

::-webkit-scrollbar-thumb {
  background: #374151; /* gray-700 */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4b5563; /* gray-600 */
}
</style>