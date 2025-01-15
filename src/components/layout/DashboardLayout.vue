<!-- src/layouts/Dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Mobile Header -->
    <header 
      class="lg:hidden bg-gray-800 border-b border-gray-700 text-white flex items-center justify-between px-4 h-16 fixed top-0 left-0 right-0 z-30"
    >
      <div class="flex items-center">
        <button
          @click="toggleSidebar"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <span class="ml-3 text-lg font-bold">Trading Journal</span>
      </div>

      <!-- Profile Dropdown -->
      <div class="relative">
        <button 
          @click="isOpen = !isOpen"
          class="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <div class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span class="text-sm font-medium text-white">
              {{ userInitials }}
            </span>
          </div>
          <ChevronDownIcon 
            class="h-5 w-5 text-gray-400"
            :class="{ 'transform rotate-180': isOpen }"
          />
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isOpen"
          class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5"
        >
          <div class="py-1">
            <div class="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
              Signed in as<br>
              <span class="font-medium text-white">{{ auth?.user?.email || 'User' }}</span>
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex h-full min-h-screen lg:h-screen pt-16 lg:pt-0">
      <!-- Sidebar Overlay -->
      <div 
        v-if="isSidebarOpen" 
        class="fixed inset-0 bg-gray-900/50 lg:hidden z-40"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar -->
      <aside
        class="fixed lg:static w-64 h-full z-40 transform transition-transform duration-300 ease-in-out lg:transform-none"
        :class="{'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen}"
      >
        <div class="h-full bg-gray-800 border-r border-gray-700 flex flex-col">
          <!-- Sidebar Header - Only visible on desktop -->
          <div class="h-16 hidden lg:flex items-center px-6 border-b border-gray-700">
            <h1 class="text-xl font-bold text-white">Trading Journal</h1>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <router-link 
              to="/dashboard" 
              class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
              @click="handleNavClick"
            >
              <ChartBarIcon class="h-5 w-5 mr-3" />
              Dashboard
            </router-link>

            <router-link 
              to="/journals" 
              class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('/journal') ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
              @click="handleNavClick"
            >
              <ClipboardDocumentListIcon class="h-5 w-5 mr-3" />
              Daily Journal
            </router-link>

            <router-link 
              to="/stats" 
              class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/stats' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'"
              @click="handleNavClick"
            >
              <ChartPieIcon class="h-5 w-5 mr-3" />
              Reports
            </router-link>
          </nav>

          <!-- User Profile -->
          <div class="p-4 border-t border-gray-700">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium">
                TK
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">Teddinata Kusuma</p>
                <p class="text-xs text-gray-400">Trader</p>
              </div>
            </div>
            <!-- Version Info -->
          <div class="mt-2 pt-2 border-t border-gray-700">
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>Version {{ version }}</span>
            </div>
          </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Desktop Header -->
        <header class="hidden lg:flex h-16 bg-gray-800 border-b border-gray-700 items-center justify-between px-6">
          <div class="flex items-center">
            <h2 class="text-lg font-semibold text-white">
              <span v-if="$route.path === '/'">Dashboard</span>
              <span v-else-if="$route.path.includes('/journal')">Daily Journal</span>
              <span v-else-if="$route.path === '/stats'">Reports</span>
            </h2>
          </div>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button 
              @click="isOpen = !isOpen"
              class="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
            >
              <div class="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ userInitials }}
                </span>
              </div>
              <ChevronDownIcon 
                class="h-5 w-5 text-gray-400"
                :class="{ 'transform rotate-180': isOpen }"
              />
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="isOpen"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                  Signed in as<br>
                  <span class="font-medium text-white">{{ auth?.user?.email || 'User' }}</span>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 lg:p-6">
          <router-view></router-view>
        </main>
      </div>
    </div>

    <!-- PWA Install Prompt -->
    <PWAInstallPrompt v-if="showInstallPrompt" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  ChartPieIcon,
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import PWAInstallPrompt from '@/components/PWAInstallPrompt.vue'
import packageJson from '../../../package.json'
import { useRouter } from 'vue-router'

const version = packageJson.version

// Sidebar State
const isSidebarOpen = ref(false)
const showInstallPrompt = ref(false)
const router = useRouter()
const auth = useAuthStore()
const isOpen = ref(false)

// Computed untuk user initials
const userInitials = computed(() => {
  const name = auth?.user?.name || 'U'
  return name.charAt(0).toUpperCase()
})

// Handle logout dengan proper feedback
const handleLogout = async () => {
  try {
    await auth.logout()
    toast.success('Logged out successfully')
    router.push('/login')
  } catch (error) {
    toast.error('Failed to logout')
  } finally {
    isOpen.value = false // Tutup dropdown setelah logout
  }
}

// Close sidebar when route changes
watch(router.currentRoute, () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
})


// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

// Responsive Handling
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = true
  } else {
    isSidebarOpen.value = false
  }
}

// Lifecycle Hooks
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
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

/* Prevent scroll when sidebar is open on mobile */
@media (max-width: 1024px) {
  .sidebar-open {
    overflow: hidden;
  }
}
</style>