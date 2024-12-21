<!-- src/views/PositionDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { tradingPositionsService } from '@/service/tradingPositionService'

const route = useRoute()
const loading = ref(false)
const error = ref(null)
const position = ref(null)

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Format date
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

// Get PNL class for coloring
const getPnLClass = (pnl) => {
  const value = Number(pnl || 0)
  return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
}

// Fetch position detail
const fetchPositionDetail = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tradingPositionsService.getPosition(route.params.id)
    position.value = response.data
  } catch (err) {
    console.error('Error fetching position detail:', err)
    error.value = 'Gagal memuat detail posisi trading'
  } finally {
    loading.value = false
  }
}

// Transaction Modal State
const showTransactionModal = ref(false)
const transactionForm = ref({
  type: 'SELL',
  price: '',
  volume: '',
  notes: ''
})
const transactionLoading = ref(false)
const transactionError = ref(null)

// Handle transaction submission
const handleTransactionSubmit = async () => {
  try {
    transactionLoading.value = true
    transactionError.value = null
    
    const payload = {
      ...transactionForm.value,
      price: Number(transactionForm.value.price),
      volume: Number(transactionForm.value.volume)
    }
    
    await tradingPositionsService.addTransaction(route.params.id, payload)
    showTransactionModal.value = false
    // Reset form
    transactionForm.value = {
      type: 'SELL',
      price: '',
      volume: '',
      notes: ''
    }
    // Refresh position data
    await fetchPositionDetail()
  } catch (err) {
    console.error('Error adding transaction:', err)
    transactionError.value = 'Gagal menambahkan transaksi'
  } finally {
    transactionLoading.value = false
  }
}

// Validate transaction form
const validateTransactionForm = () => {
  const errors = []
  if (!transactionForm.value.price) errors.push('Price harus diisi')
  if (!transactionForm.value.volume) errors.push('Volume harus diisi')
  if (isNaN(transactionForm.value.price)) errors.push('Price harus berupa angka')
  if (isNaN(transactionForm.value.volume)) errors.push('Volume harus berupa angka')
  return errors
}

onMounted(() => {
  fetchPositionDetail()
})
</script>

# src/views/PositionDetail.vue
<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-400">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else-if="position" class="space-y-6">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            {{ position.emiten }} - {{ position.type }}
          </h2>
          <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div class="mt-2 flex items-center text-sm text-gray-400">
              {{ formatDate(position.created_at) }}
            </div>
            <div class="mt-2 flex items-center text-sm">
              <span 
                class="px-2 py-1 text-xs font-medium rounded"
                :class="position.status === 'OPEN' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gray-700 text-gray-300'"
              >
                {{ position.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Position Details Card -->
      <div class="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Buy Range -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Buy Range</h3>
              <div class="mt-1 flex space-x-2">
                <span class="text-lg font-medium text-white">
                  {{ formatCurrency(position.buy_range_low) }}
                </span>
                <span class="text-gray-400">-</span>
                <span class="text-lg font-medium text-white">
                  {{ formatCurrency(position.buy_range_high) }}
                </span>
              </div>
            </div>

            <!-- Entry Price -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Entry Price</h3>
              <p class="mt-1 text-lg font-medium text-white">
                {{ formatCurrency(position.entry_price) }}
              </p>
            </div>

            <!-- Stop Loss -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Stop Loss</h3>
              <p class="mt-1 text-lg font-medium text-red-400">
                {{ formatCurrency(position.stop_loss) }}
              </p>
            </div>

            <!-- Take Profit 1 -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Take Profit 1</h3>
              <p class="mt-1 text-lg font-medium text-emerald-400">
                {{ formatCurrency(position.take_profit_1) }}
              </p>
            </div>

            <!-- Take Profit 2 -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Take Profit 2</h3>
              <p class="mt-1 text-lg font-medium text-emerald-400">
                {{ formatCurrency(position.take_profit_2) }}
              </p>
            </div>

            <!-- Strategy -->
            <div>
              <h3 class="text-sm font-medium text-gray-400">Strategy</h3>
              <p class="mt-1 text-lg font-medium text-white">
                {{ position.strategy }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-white mb-4">Position Summary</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 class="text-sm font-medium text-gray-400">Total Volume</h4>
              <p class="mt-1 text-lg font-medium text-white">
                {{ position.summary.total_volume }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-400">Average Price</h4>
              <p class="mt-1 text-lg font-medium text-white">
                {{ formatCurrency(position.summary.average_price) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-400">Realized P&L</h4>
              <p class="mt-1 text-lg font-medium" 
                :class="position.summary.realized_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'">
                {{ formatCurrency(position.summary.realized_pnl) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-400">Unrealized P&L</h4>
              <p class="mt-1 text-lg font-medium"
                :class="position.summary.unrealized_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'">
                {{ formatCurrency(position.summary.unrealized_pnl) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-white">Transaction History</h3>
            <button
              @click="showTransactionModal = true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Add Transaction
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Volume
                  </th>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 bg-gray-900/50 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr v-for="transaction in position.transactions" :key="transaction.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="transaction.type === 'BUY' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'"
                    >
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ formatCurrency(transaction.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ transaction.volume }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ formatCurrency(transaction.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {{ transaction.notes }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-white mb-4">Notes</h3>
          <p class="text-gray-300">{{ position.notes }}</p>
        </div>
      </div>

      <!-- Transaction Modal -->
      <div v-if="showTransactionModal" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" @click="showTransactionModal = false"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-700">
            <!-- Modal content -->
            <div class="sm:flex sm:items-start">
              <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-white mb-4">Add New Transaction</h3>
                
                <!-- Error message -->
                <div v-if="transactionError" class="mb-4 p-4 bg-red-400/10 rounded-md">
                  <p class="text-sm text-red-400">{{ transactionError }}</p>
                </div>

                <!-- Transaction Form -->
                <form @submit.prevent="handleTransactionSubmit">
                  <div class="space-y-4">
                    <!-- Transaction Type -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300">Type</label>
                      <select
                        v-model="transactionForm.type"
                        class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>

                    <!-- Price -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300">Price</label>
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-400 sm:text-sm">Rp</span>
                        </div>
                        <input
                          type="number"
                          v-model="transactionForm.price"
                          class="pl-12 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <!-- Volume -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300">Volume</label>
                      <input
                        type="number"
                        v-model="transactionForm.volume"
                        class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>

                    <!-- Notes -->
                    <div>
                      <label class="block text-sm font-medium text-gray-300">Notes</label>
                      <textarea
                        v-model="transactionForm.notes"
                        rows="2"
                        class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Transaction notes..."
                      ></textarea>
                    </div>
                  </div>

                  <!-- Form Actions -->
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0"
                      @click="showTransactionModal = false"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="transactionLoading"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <svg v-if="transactionLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ transactionLoading ? 'Adding...' : 'Add Transaction' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>