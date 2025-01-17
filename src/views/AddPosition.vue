# src/views/CreatePosition.vue
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { tradingPositionsService } from '@/service/tradingPositionService'
import { toast, Toaster } from 'vue-sonner'


// Component state
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const showPreview = ref(true)
const showTips = ref(true)
const isDesktop = ref(window.innerWidth >= 1024)

// Responsive handlers
window.addEventListener('resize', () => {
  isDesktop.value = window.innerWidth >= 1024
})

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const toggleTips = () => {
  showTips.value = !showTips.value
}


// Form state
const form = ref({
  emiten: '',
  type: 'BUY',
  buy_range_low: '',
  buy_range_high: '',
  entry_price: '',
  volume: '',
  stop_loss: '',
  take_profit_1: '',
  take_profit_2: '',
  strategy: '',
  notes: ''
})

// Kalkulasi real-time
const calculations = computed(() => {
  const entryPrice = Number(form.value.entry_price) || 0
  const volume = Number(form.value.volume) || 0
  const stopLoss = Number(form.value.stop_loss) || 0
  const takeProfit1 = Number(form.value.take_profit_1) || 0
  const takeProfit2 = Number(form.value.take_profit_2) || 0

  // Total Investasi
  const totalInvestment = entryPrice * volume * 100 // 1 lot = 100 lembar

  // Potensi Profit/Loss
  const potentialLoss = (entryPrice - stopLoss) * volume * 100
  const potentialProfit1 = (takeProfit1 - entryPrice) * volume * 100
  const potentialProfit2 = (takeProfit2 - entryPrice) * volume * 100

  // Risk/Reward Ratio
  const riskRewardRatio1 = potentialLoss !== 0 ? (potentialProfit1 / Math.abs(potentialLoss)).toFixed(2) : 0
  const riskRewardRatio2 = potentialLoss !== 0 ? (potentialProfit2 / Math.abs(potentialLoss)).toFixed(2) : 0

  return {
    totalInvestment,
    potentialLoss,
    potentialProfit1,
    potentialProfit2,
    riskRewardRatio1,
    riskRewardRatio2
  }
})

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Real-time validation
const validateField = (field) => {
  const errors = {}
  
  switch (field) {
    case 'emiten':
      if (!form.value.emiten) errors.emiten = 'Emiten harus diisi'
      break
    case 'buy_range_low':
      if (!form.value.buy_range_low) errors.buy_range_low = 'Buy range low harus diisi'
      if (isNaN(form.value.buy_range_low)) errors.buy_range_low = 'Harus berupa angka'
      if (Number(form.value.buy_range_low) >= Number(form.value.buy_range_high)) 
        errors.buy_range_low = 'Harus lebih kecil dari buy range high'
      break
    case 'buy_range_high':
      if (!form.value.buy_range_high) errors.buy_range_high = 'Buy range high harus diisi'
      if (isNaN(form.value.buy_range_high)) errors.buy_range_high = 'Harus berupa angka'
      if (Number(form.value.buy_range_high) <= Number(form.value.buy_range_low))
        errors.buy_range_high = 'Harus lebih besar dari buy range low'
      break
    case 'entry_price':
      if (!form.value.entry_price) errors.entry_price = 'Entry price harus diisi'
      if (isNaN(form.value.entry_price)) errors.entry_price = 'Harus berupa angka'
      break
    case 'volume':
      if (!form.value.volume) errors.volume = 'Volume harus diisi'
      if (isNaN(form.value.volume)) errors.volume = 'Harus berupa angka'
      if (form.value.volume <= 0) errors.volume = 'Volume harus lebih dari 0'
      break
    case 'stop_loss':
      if (!form.value.stop_loss) errors.stop_loss = 'Stop loss harus diisi'
      if (isNaN(form.value.stop_loss)) errors.stop_loss = 'Harus berupa angka'
      if (form.value.type === 'BUY' && Number(form.value.stop_loss) >= Number(form.value.entry_price))
        errors.stop_loss = 'Stop loss harus di bawah entry price untuk posisi BUY'
      if (form.value.type === 'SELL' && Number(form.value.stop_loss) <= Number(form.value.entry_price))
        errors.stop_loss = 'Stop loss harus di atas entry price untuk posisi SELL'
      break
    case 'take_profit_1':
    case 'take_profit_2':
      if (!form.value[field]) errors[field] = `${field === 'take_profit_1' ? 'Take profit 1' : 'Take profit 2'} harus diisi`
      if (isNaN(form.value[field])) errors[field] = 'Harus berupa angka'
      if (form.value.type === 'BUY' && Number(form.value[field]) <= Number(form.value.entry_price))
        errors[field] = 'Take profit harus di atas entry price untuk posisi BUY'
      if (form.value.type === 'SELL' && Number(form.value[field]) >= Number(form.value.entry_price))
        errors[field] = 'Take profit harus di bawah entry price untuk posisi SELL'
      break
    case 'strategy':
      if (!form.value.strategy) errors.strategy = 'Strategy harus dipilih'
      break
  }

  return errors
}

// Watch for changes and validate
const errors = ref({})
const validatedFields = ref(new Set())

const watchFields = [
  'emiten', 'type', 'buy_range_low', 'buy_range_high', 
  'entry_price', 'volume', 'stop_loss', 'take_profit_1', 
  'take_profit_2', 'strategy'
]

watchFields.forEach(field => {
  watch(() => form.value[field], () => {
    if (validatedFields.value.has(field)) {
      const fieldErrors = validateField(field)
      errors.value = { ...errors.value, ...fieldErrors }
    }
  })
})

const handleFieldBlur = (field) => {
  validatedFields.value.add(field)
  const fieldErrors = validateField(field)
  errors.value = { ...errors.value, ...fieldErrors }
}

// Validate all fields before submission
const validateForm = () => {
  let allErrors = {}
  watchFields.forEach(field => {
    const fieldErrors = validateField(field)
    allErrors = { ...allErrors, ...fieldErrors }
  })
  errors.value = allErrors
  return Object.keys(allErrors).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    error.value = 'Harap perbaiki error yang ada sebelum menyimpan'
    toast.error('Validation Error', {
      description: 'Please fix all errors before submitting',
      duration: 4000,
      position: 'top-right',
    })
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    const payload = {
      ...form.value,
      buy_range_low: Number(form.value.buy_range_low),
      buy_range_high: Number(form.value.buy_range_high),
      entry_price: Number(form.value.entry_price),
      volume: Number(form.value.volume),
      stop_loss: Number(form.value.stop_loss),
      take_profit_1: Number(form.value.take_profit_1),
      take_profit_2: Number(form.value.take_profit_2)
    }
    
    const result = await tradingPositionsService.createPosition(payload)
    
    if (result.status === 'success') {
      toast.success('Position Created!', {
        description: result.message || 'Position has been created successfully',
        duration: 3000,
        position: 'top-right',
      })
      
      // Reset form
      form.value = {
        emiten: '',
        type: 'BUY',
        buy_range_low: '',
        buy_range_high: '',
        entry_price: '',
        volume: '',
        stop_loss: '',
        take_profit_1: '',
        take_profit_2: '',
        strategy: '',
        notes: ''
      }
      setTimeout(() => router.push({ name: 'Journal' }), 1000)
    }
  } catch (err) {
    console.error('Error creating position:', err)
    error.value = 'Gagal membuat posisi trading baru'
    toast.error('Failed to Create Position', {
      description: err.response?.data?.message || 'An error occurred. Please try again.',
      duration: 4000,
      position: 'top-right',
    })
  } finally {
    loading.value = false
  }
}

const strategyOptions = [
  'Breakout Strategy',
  'Swing Trading',
  'Day Trading',
  'Position Trading',
  'Trend Following',
  'Mean Reversion',
  'Momentum Trading'
]

// Tooltip state
const activeTooltip = ref(null)
const showTooltip = (tooltipId) => {
  activeTooltip.value = tooltipId
}
const hideTooltip = () => {
  activeTooltip.value = null
}
</script>

<template>
  <!-- Container utama dengan padding responsive -->
  <div class="min-h-screen bg-gray-900">
    <div class="max-w-8xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
    <Toaster position="top-right" />
      <!-- Mobile Header - Hanya muncul di mobile -->
      <div class="lg:hidden mb-4">
        <h1 class="text-xl font-semibold text-white">Create New Position</h1>
        <p class="text-sm text-gray-400 mt-1">Buat posisi trading baru dengan mengisi detail berikut.</p>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
        <!-- Left Panel - Preview & Tips -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Sticky panel pada desktop -->
          <div class="lg:sticky lg:top-4 space-y-4">
            <!-- Info Card -->
            <div class="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
              <!-- Header - Hidden di mobile karena sudah ada di atas -->
              <div class="hidden lg:block mb-6">
                <h3 class="text-lg font-medium text-white">Create New Position</h3>
                <p class="text-sm text-gray-400 mt-1">
                  Buat posisi trading baru dengan mengisi detail berikut.
                </p>
              </div>

              <!-- Preview Calculations -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-emerald-400">Preview Kalkulasi</h4>
                  <!-- Mobile toggle -->
                  <button 
                    @click="togglePreview"
                    class="lg:hidden p-1 text-emerald-400 hover:bg-gray-700 rounded-lg"
                  >
                    <svg 
                      class="w-5 h-5 transition-transform"
                      :class="{ 'rotate-180': showPreview }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Calculations Content - Collapsible di mobile -->
                <div 
                  class="space-y-4"
                  :class="{ 'hidden': !showPreview }"
                  v-show="showPreview || isDesktop"
                >
                  <!-- Total Investment -->
                  <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <span class="text-xs sm:text-sm text-gray-400">Total Investasi:</span>
                    <p class="text-sm sm:text-base font-medium text-white mt-1">
                      {{ formatCurrency(calculations.totalInvestment) }}
                    </p>
                  </div>

                  <!-- Profit/Loss Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <!-- Potential Profit TP1 -->
                    <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <span class="text-xs sm:text-sm text-gray-400">Potensi Profit (TP1):</span>
                      <p class="text-sm sm:text-base font-medium mt-1" 
                         :class="calculations.potentialProfit1 >= 0 ? 'text-emerald-400' : 'text-red-400'"
                      >
                        {{ formatCurrency(calculations.potentialProfit1) }}
                      </p>
                    </div>

                    <!-- Potential Profit TP2 -->
                    <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <span class="text-xs sm:text-sm text-gray-400">Potensi Profit (TP2):</span>
                      <p class="text-sm sm:text-base font-medium mt-1"
                         :class="calculations.potentialProfit2 >= 0 ? 'text-emerald-400' : 'text-red-400'"
                      >
                        {{ formatCurrency(calculations.potentialProfit2) }}
                      </p>
                    </div>

                    <!-- Potential Loss -->
                    <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600 sm:col-span-2 lg:col-span-1">
                      <span class="text-xs sm:text-sm text-gray-400">Potensi Loss (Max):</span>
                      <p class="text-sm sm:text-base font-medium text-red-400 mt-1">
                        {{ formatCurrency(Math.abs(calculations.potentialLoss)) }}
                      </p>
                    </div>
                  </div>

                  <!-- Risk/Reward Section -->
                  <div class="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <span class="text-xs sm:text-sm text-gray-400 block mb-2">Risk/Reward Ratio:</span>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <span class="text-xs text-gray-400 block mb-1">TP1</span>
                        <p class="text-sm sm:text-base font-medium text-white">
                          1:{{ calculations.riskRewardRatio1 }}
                        </p>
                      </div>
                      <div>
                        <span class="text-xs text-gray-400 block mb-1">TP2</span>
                        <p class="text-sm sm:text-base font-medium text-white">
                          1:{{ calculations.riskRewardRatio2 }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tips Section -->
              <div class="mt-6 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-emerald-400">Tips Pengisian</h4>
                  <!-- Mobile toggle -->
                  <button 
                    @click="toggleTips"
                    class="lg:hidden p-1 text-emerald-400 hover:bg-gray-700 rounded-lg"
                  >
                    <svg 
                      class="w-5 h-5 transition-transform"
                      :class="{ 'rotate-180': showTips }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Tips Content - Collapsible di mobile -->
                <div 
                  class="space-y-2"
                  :class="{ 'hidden': !showTips }"
                  v-show="showTips || isDesktop"
                >
                  <div class="flex items-start space-x-2 text-sm">
                    <span class="text-emerald-400">•</span>
                    <span class="text-gray-400">Pastikan range harga masuk akal</span>
                  </div>
                  <div class="flex items-start space-x-2 text-sm">
                    <span class="text-emerald-400">•</span>
                    <span class="text-gray-400">Set stop loss untuk manajemen risiko</span>
                  </div>
                  <div class="flex items-start space-x-2 text-sm">
                    <span class="text-emerald-400">•</span>
                    <span class="text-gray-400">Risk/Reward ratio minimal 1:2</span>
                  </div>
                  <div class="flex items-start space-x-2 text-sm">
                    <span class="text-emerald-400">•</span>
                    <span class="text-gray-400">Take profit sebaiknya realistis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="lg:col-span-3 h-full">
          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <!-- Main Card -->
            <div class="bg-gray-800 shadow-lg rounded-xl border border-gray-700 overflow-hidden">
              <!-- Error message -->
              <div v-if="error" class="p-4 bg-red-400/10 border-b border-gray-700">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-red-400 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-3 text-sm text-red-400">{{ error }}</span>
                </div>
              </div>

              <div class="p-4 sm:p-6 space-y-6">
                <!-- Emiten & Type -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <!-- Emiten Input -->
                  <div class="space-y-2">
                    <label class="flex items-center text-sm font-medium text-gray-300">
                      Emiten
                      <button 
                        type="button" 
                        class="ml-2 text-emerald-400 hover:text-emerald-300"
                        @mouseenter="showTooltip('emiten')"
                        @mouseleave="hideTooltip"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </label>
                    <div class="relative">
                      <input
                        type="text"
                        v-model="form.emiten"
                        class="w-full px-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        :class="{ 'border-red-400 focus:ring-red-500': errors.emiten }"
                        placeholder="Contoh: BBCA"
                        @blur="handleFieldBlur('emiten')"
                      />
                      <!-- Tooltip -->
                      <div 
                        v-if="activeTooltip === 'emiten'"
                        class="absolute z-10 left-0 mt-2 w-64 px-4 py-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600"
                      >
                        <p class="text-sm text-gray-300">Masukkan kode saham yang akan ditransaksikan</p>
                      </div>
                    </div>
                    <p v-if="errors.emiten" class="text-sm text-red-400">{{ errors.emiten }}</p>
                  </div>

                  <!-- Type Select -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-300">Type</label>
                    <select
                      v-model="form.type"
                      class="w-full px-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      :class="{ 'border-red-400 focus:ring-red-500': errors.type }"
                      @blur="handleFieldBlur('type')"
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                    <p v-if="errors.type" class="text-sm text-red-400">{{ errors.type }}</p>
                  </div>
                </div>

                <!-- Price Section Card -->
                <div class="bg-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600 space-y-6">
                  <!-- Section Header -->
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-emerald-400">Detail Harga</h4>
                  </div>

                  <!-- Buy Range Fields -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Buy Range Low -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-300">Buy Range Low</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.buy_range_low"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          :class="{ 'border-red-400 focus:ring-red-500': errors.buy_range_low }"
                          @blur="handleFieldBlur('buy_range_low')"
                        />
                      </div>
                      <p v-if="errors.buy_range_low" class="text-sm text-red-400">{{ errors.buy_range_low }}</p>
                    </div>

                    <!-- Buy Range High -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-300">Buy Range High</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.buy_range_high"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          :class="{ 'border-red-400 focus:ring-red-500': errors.buy_range_high }"
                          @blur="handleFieldBlur('buy_range_high')"
                        />
                      </div>
                      <p v-if="errors.buy_range_high" class="text-sm text-red-400">{{ errors.buy_range_high }}</p>
                    </div>
                  </div>

                  <!-- Entry Price & Volume -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Entry Price -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-300">Entry Price</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.entry_price"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          :class="{ 'border-red-400 focus:ring-red-500': errors.entry_price }"
                          @blur="handleFieldBlur('entry_price')"
                        />
                      </div>
                      <p v-if="errors.entry_price" class="text-sm text-red-400">{{ errors.entry_price }}</p>
                    </div>

                    <!-- Volume -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-300">Volume (Lot)</label>
                      <input
                        type="number"
                        v-model="form.volume"
                        class="w-full px-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        :class="{ 'border-red-400 focus:ring-red-500': errors.volume }"
                        placeholder="1"
                        @blur="handleFieldBlur('volume')"
                      />
                      <p v-if="errors.volume" class="text-sm text-red-400">{{ errors.volume }}</p>
                    </div>
                  </div>
                </div>

                <!-- Target Section Card -->
                <div class="bg-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600 space-y-6">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-emerald-400">Target & Stop Loss</h4>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Stop Loss -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-red-400">Stop Loss</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.stop_loss"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          :class="{ 'border-red-400': errors.stop_loss }"
                          @blur="handleFieldBlur('stop_loss')"
                        />
                      </div>
                      <p v-if="errors.stop_loss" class="text-sm text-red-400">{{ errors.stop_loss }}</p>
                    </div>

                    <!-- Take Profit 1 -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-emerald-400">Take Profit 1</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.take_profit_1"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          :class="{ 'border-red-400': errors.take_profit_1 }"
                          @blur="handleFieldBlur('take_profit_1')"
                        />
                      </div>
                      <p v-if="errors.take_profit_1" class="text-sm text-red-400">{{ errors.take_profit_1 }}</p>
                    </div>

                    <!-- Take Profit 2 -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-emerald-400">Take Profit 2</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">Rp</span>
                        <input
                          type="number"
                          v-model="form.take_profit_2"
                          class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          :class="{ 'border-red-400': errors.take_profit_2 }"
                          @blur="handleFieldBlur('take_profit_2')"
                        />
                      </div>
                      <p v-if="errors.take_profit_2" class="text-sm text-red-400">{{ errors.take_profit_2 }}</p>
                    </div>
                  </div>
                </div>

                <!-- Strategy & Notes -->
                <div class="space-y-6">
                  <!-- Strategy Select -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-300">Strategy</label>
                    <select
                      v-model="form.strategy"
                      class="w-full px-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      :class="{ 'border-red-400': errors.strategy }"
                      @blur="handleFieldBlur('strategy')"
                    >
                      <option value="">Pilih Strategy</option>
                      <option v-for="strategy in strategyOptions" :key="strategy" :value="strategy">
                        {{ strategy }}
                      </option>
                    </select>
                    <p v-if="errors.strategy" class="text-sm text-red-400">{{ errors.strategy }}</p>
                  </div>

                  <!-- Notes Textarea -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-300">Notes</label>
                    <textarea
                      v-model="form.notes"
                      rows="3"
                      class="w-full px-4 py-2.5 rounded-lg border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y"
                      placeholder="Catatan tambahan tentang rencana trading..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="px-4 sm:px-6 py-4 bg-gray-900/50 border-t border-gray-700">
                <div class="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    class="w-full sm:w-auto px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 order-2 sm:order-1"
                    @click="router.push({ name: 'Journal' })"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center order-1 sm:order-2"
                  >
                    <svg 
                      v-if="loading" 
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ loading ? 'Menyimpan...' : 'Simpan' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>