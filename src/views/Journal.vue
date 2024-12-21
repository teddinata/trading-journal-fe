// src/views/Journal.vue
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronUpIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { debounce } from 'lodash'
import { tradingPositionsService } from '@/service/tradingPositionService'

// State
const loading = ref(false)
const error = ref(null)
const positions = ref([])
const sortState = ref({
  column: 'created_at',
  direction: 'desc'
})

const fetchPositions = async () => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: 1,
      per_page: pagination.value.perPage,
      date_from: filters.value.dateFrom,
      date_to: filters.value.dateTo
    }
    
    console.log('Fetching with params:', params)
    const response = await tradingPositionsService.getPositions(params)
    console.log('API Response:', response)
    
    if (response?.data?.positions) {
      positions.value = response.data.positions
      console.log('Positions updated:', positions.value)
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching positions:', err)
    error.value = 'Gagal memuat data posisi trading'
    positions.value = [] // Reset positions on error
  } finally {
    loading.value = false
  }
}

// Methods
const handleFilter = () => {
  pagination.value.currentPage = 1
  // Filter akan diterapkan otomatis melalui computed property
}

const handleDateChange = () => {
  pagination.value.currentPage = 1
  fetchPositions()
}

// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 10
})

// Computed properties dengan null checking
const filteredPositions = computed(() => {
  // Pastikan positions.value ada dan merupakan array
  if (!positions.value || !Array.isArray(positions.value)) {
    return []
  }

  let result = [...positions.value]

  // Filter by emiten
  if (filters.value.emiten) {
    result = result.filter(position => 
      position.emiten?.toLowerCase().includes(filters.value.emiten.toLowerCase())
    )
  }

  // Filter by status
  if (filters.value.status) {
    result = result.filter(position => position.status === filters.value.status)
  }

  // Filter by date range
  const dateFrom = new Date(filters.value.dateFrom)
  const dateTo = new Date(filters.value.dateTo)
  dateTo.setHours(23, 59, 59)
  
  result = result.filter(position => {
    const posDate = new Date(position.created_at)
    return posDate >= dateFrom && posDate <= dateTo
  })

  return result
})

const totalPages = computed(() => {
  if (!filteredPositions.value) return 1
  return Math.max(1, Math.ceil(filteredPositions.value.length / pagination.value.perPage))
})

const paginatedPositions = computed(() => {
  if (!filteredPositions.value) return []
  
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  return filteredPositions.value.slice(start, end)
})


// Column definitions
const columns = [
  { key: 'emiten', label: 'Emiten', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'entry_price', label: 'Entry Price', sortable: true },
  { key: 'summary.total_volume', label: 'Volume', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'summary.total_pnl', label: 'P&L', sortable: true },
  { key: 'strategy', label: 'Strategy', sortable: true },
  { key: 'created_at', label: 'Tanggal', sortable: true }
]


// Bagian computed properties
// const filteredPositions = computed(() => {
//   // Tambahkan debug logs
//   console.log('Starting filter with positions:', positions.value)
  
//   // Pastikan ada data sebelum filter
//   if (!positions.value || !Array.isArray(positions.value)) {
//     console.log('No positions to filter')
//     return []
//   }

//   let result = [...positions.value]
//   console.log('Initial result:', result)

//   // Filter by emiten
//   if (filters.value.emiten) {
//     console.log('Filtering by emiten:', filters.value.emiten)
//     result = result.filter(position => 
//       (position.emiten || '').toLowerCase().includes(filters.value.emiten.toLowerCase())
//     )
//     console.log('After emiten filter:', result)
//   }

//   // Filter by status
//   if (filters.value.status) {
//     console.log('Filtering by status:', filters.value.status)
//     result = result.filter(position => 
//       position.status === filters.value.status
//     )
//     console.log('After status filter:', result)
//   }

//   // Filter by date range
//   if (filters.value.dateFrom && filters.value.dateTo) {
//     console.log('Filtering by date range:', filters.value.dateFrom, 'to', filters.value.dateTo)
//     const dateFrom = new Date(filters.value.dateFrom)
//     const dateTo = new Date(filters.value.dateTo)
//     dateTo.setHours(23, 59, 59) // Set to end of day
    
//     result = result.filter(position => {
//       const posDate = new Date(position.created_at)
//       return posDate >= dateFrom && posDate <= dateTo
//     })
//     console.log('After date filter:', result)
//   }

//   // Sort result
//   if (sortState.value.column) {
//     console.log('Sorting by:', sortState.value.column, sortState.value.direction)
//     result.sort((a, b) => {
//       let aValue = getSortValue(a, sortState.value.column)
//       let bValue = getSortValue(b, sortState.value.column)
      
//       // Handle numeric values
//       if (!isNaN(aValue) && !isNaN(bValue)) {
//         aValue = Number(aValue)
//         bValue = Number(bValue)
//       }
      
//       if (aValue < bValue) return sortState.value.direction === 'asc' ? -1 : 1
//       if (aValue > bValue) return sortState.value.direction === 'asc' ? 1 : -1
//       return 0
//     })
//     console.log('After sorting:', result)
//   }

//   return result
// })

// Update state definitions
const filters = ref({
  emiten: '',
  status: '',
  dateFrom: new Date('2024-01-01').toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0],
})

// format currency id
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// getPnLClass
const getPnLClass = (pnl) => {
  const value = Number(pnl || 0)
  return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Update watchers
watch([
  () => filters.value.emiten,
  () => filters.value.status
], () => {
  console.log('Filter changed:', filters.value)
  pagination.value.currentPage = 1
  // Tidak perlu fetch data baru untuk client-side filtering
})

watch([
  () => filters.value.dateFrom,
  () => filters.value.dateTo
], () => {
  console.log('Date filter changed:', filters.value)
  pagination.value.currentPage = 1
  fetchPositions() // Hanya fetch baru ketika tanggal berubah
})

const debouncedFetch = debounce(() => {
  fetchPositions()
}, 300)

// Lifecycle
onMounted(() => {
  fetchPositions()
})
</script>

# src/views/Journal.vue
<template>
  <div class="space-y-6">
    <!-- Filter Section -->
    <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Emiten</label>
          <input
            v-model="filters.emiten"
            type="text"
            class="w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Cari emiten..."
            @input="handleFilter"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            @change="handleFilter"
          >
            <option value="">Semua Status</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Tanggal Dari</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            @change="handleDateChange"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Tanggal Sampai</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            @change="handleDateChange"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <!-- Table Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 class="text-lg font-medium text-white">Posisi Trading</h2>
        <div class="flex items-center space-x-4">
          <router-link
            :to="{ name: 'JournalCreate' }"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-emerald-500 hover:bg-emerald-600"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Buat Posisi Baru
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-center text-red-400">
        {{ error }}
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Emiten
              </th>
              <th class="text-xs font-medium text-gray-300 bg-gray-900/50 px-2 py-1 text-center" colspan="2">
                AREA BUY
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Entry Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stop Loss
              </th>
              <th class="text-xs font-medium text-gray-300 bg-gray-900/50 px-2 py-1 text-center" colspan="2">
                TAKE PROFIT
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Strategy
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="position in paginatedPositions" :key="position.id">
              <!-- Tanggal -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(position.created_at) }}
              </td>
              
              <!-- Emiten -->
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link 
                  :to="{ name: 'JournalDetail', params: { id: position.id }}"
                  class="text-emerald-400 hover:text-emerald-300"
                >
                  <span class="font-medium">{{ position.emiten }}</span>
                </router-link>
              </td>
              
              <!-- Buy Range -->
              <td class="px-2 py-1 text-sm text-right text-gray-300">
                {{ formatCurrency(position.buy_range_low) }}
              </td>
              <td class="px-2 py-1 text-sm text-right text-gray-300">
                {{ formatCurrency(position.buy_range_high) }}
              </td>
              
              <!-- Entry Price -->
              <td class="px-6 py-4 whitespace-nowrap text-gray-300">
                {{ formatCurrency(position.entry_price) }}
              </td>
              
              <!-- Stop Loss -->
              <td class="px-6 py-4 whitespace-nowrap text-gray-300">
                {{ formatCurrency(position.stop_loss) }}
              </td>
              
              <!-- Take Profit -->
              <td class="px-2 py-1 text-sm text-right text-gray-300">
                TP 1: {{ formatCurrency(position.take_profit_1) }}
              </td>
              <td class="px-2 py-1 text-sm text-right text-gray-300">
                TP 2: {{ formatCurrency(position.take_profit_2) }}
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded"
                  :class="position.status === 'OPEN' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-700 text-gray-300'"
                >
                  {{ position.status }}
                </span>
              </td>
              
              <!-- Strategy -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ position.strategy }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && !error" class="px-6 py-4 border-t border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-400">
            Halaman {{ pagination.currentPage }} dari {{ totalPages }}
          </div>
          <div>
            <span class="text-sm text-gray-400">
              Menampilkan {{ paginatedPositions.length }} dari {{ filteredPositions.length }} posisi
            </span>
            <select
              v-model="pagination.perPage"
              @change="fetchPositions"
              class="ml-2 text-sm border-gray-600 bg-gray-700 text-white rounded-md focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option :value="10">10 per halaman</option>
              <option :value="25">25 per halaman</option>
              <option :value="50">50 per halaman</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="pagination.currentPage === 1"
              @click="changePage(pagination.currentPage - 1)"
              class="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              :disabled="pagination.currentPage === totalPages"
              @click="changePage(pagination.currentPage + 1)"
              class="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>