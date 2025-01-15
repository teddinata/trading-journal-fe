# src/views/Calculator.vue
<template>
  <Navbar />
  <div class="min-h-screen bg-gray-900 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Card Container -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <!-- Header -->
        <div class="bg-emerald-600 p-4">
          <h1 class="text-2xl font-bold text-center text-white">
            Kalkulator ARA ARB
          </h1>
        </div>

        <!-- Calculator Form -->
        <div class="p-6 space-y-6">
          <!-- Harga Penutupan Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              Harga Penutupan
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
              <input
                v-model="hargaPenutupan"
                type="number"
                class="w-full rounded-md border-gray-600 bg-gray-700 text-white pl-12 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Masukkan harga penutupan"
                @input="calculateRanges"
              />
            </div>
          </div>

          <!-- Peraturan Selector -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              Pilih Peraturan
            </label>
            <select
              v-model="selectedRule"
              class="w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
              @change="calculateRanges"
            >
              <option value="auto">Auto (Berdasarkan Harga)</option>
              <option value="tier1">Harga Rp50-Rp200 (ARB 35%)</option>
              <option value="tier2">Harga Rp200-Rp5.000 (ARB 25%)</option>
              <option value="tier3">Harga >Rp5.000 (ARB 20%)</option>
              <option value="simetris15">Simetris ARB 15% (Tahap I)</option>
              <option value="suspensi">Setelah Suspensi (10%)</option>
            </select>
          </div>

          <!-- Results -->
          <div class="space-y-4 pt-4 border-t border-gray-700">
            <h3 class="text-lg font-medium text-white">Hasil Perhitungan</h3>
            
            <!-- Auto Rejection Atas -->
            <div class="bg-gray-900 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Auto Rejection Atas (ARA)</span>
                <span class="text-emerald-500 font-semibold">{{ formatCurrency(hasilARA) }}</span>
              </div>
            </div>

            <!-- Auto Rejection Bawah -->
            <div class="bg-gray-900 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">Auto Rejection Bawah (ARB)</span>
                <span class="text-red-500 font-semibold">{{ formatCurrency(hasilARB) }}</span>
              </div>
            </div>

            <!-- Applied Rule Info -->
            <div v-if="selectedRule === 'auto'" class="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <p class="text-sm text-gray-300">
                Menggunakan aturan: {{ appliedRuleText }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Penjelasan Rules -->
      <div class="mt-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <h2 class="text-xl font-bold text-white mb-4">Penjelasan Auto Rejection</h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-lg text-emerald-500 font-medium mb-2">Harga Rp50-Rp200</h3>
            <p class="text-gray-300">ARB maksimal 35% dari harga penutupan</p>
          </div>
          
          <div>
            <h3 class="text-lg text-emerald-500 font-medium mb-2">Harga Rp200-Rp5.000</h3>
            <p class="text-gray-300">ARB maksimal 25% dari harga penutupan</p>
          </div>
          
          <div>
            <h3 class="text-lg text-emerald-500 font-medium mb-2">Harga >Rp5.000</h3>
            <p class="text-gray-300">ARB maksimal 20% dari harga penutupan</p>
          </div>
          
          <div>
            <h3 class="text-lg text-emerald-500 font-medium mb-2">Simetris (Tahap I)</h3>
            <p class="text-gray-300">
              Berlaku sejak 5 Juni 2023 dengan batas ARB maksimal 15%
            </p>
          </div>
          
          <div>
            <h3 class="text-lg text-emerald-500 font-medium mb-2">Setelah Suspensi</h3>
            <p class="text-gray-300">
              Berlaku untuk saham yang baru dibuka suspensinya. Batas atas dan bawah 10%.
            </p>
          </div>

          <div class="mt-6 p-4 bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-300">
              * BEI menerapkan kebijakan ARB simetris dalam dua tahap. Tahap I berlaku sejak 5 Juni 2023 dengan batas ARB maksimal 15%. 
              Tahap II berlaku sejak 4 September 2023 dengan batas ARB yang disesuaikan berdasarkan harga saham.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'

const hargaPenutupan = ref('')
const selectedRule = ref('auto')
const hasilARA = ref(0)
const hasilARB = ref(0)

// Rules configuration
const rules = {
  tier1: {
    ara: 0.35,
    arb: -0.35,
    description: 'Harga Rp50-Rp200 (ARB 35%)'
  },
  tier2: {
    ara: 0.25,
    arb: -0.25,
    description: 'Harga Rp200-Rp5.000 (ARB 25%)'
  },
  tier3: {
    ara: 0.20,
    arb: -0.20,
    description: 'Harga >Rp5.000 (ARB 20%)'
  },
  simetris15: {
    ara: 0.15,
    arb: -0.15,
    description: 'Simetris ARB 15%'
  },
  suspensi: {
    ara: 0.10,
    arb: -0.10,
    description: 'Setelah Suspensi (10%)'
  }
}

// Get appropriate rule based on price
const getAutoRule = (price) => {
  if (price <= 200) return 'tier1'
  if (price <= 5000) return 'tier2'
  return 'tier3'
}

// Applied rule text for auto mode
const appliedRuleText = computed(() => {
  if (selectedRule.value !== 'auto' || !hargaPenutupan.value) return ''
  const rule = getAutoRule(parseFloat(hargaPenutupan.value))
  return rules[rule].description
})

// Calculate ARA ARB ranges
const calculateRanges = () => {
  if (!hargaPenutupan.value || hargaPenutupan.value <= 0) {
    hasilARA.value = 0
    hasilARB.value = 0
    return
  }

  const harga = parseFloat(hargaPenutupan.value)
  let ruleKey = selectedRule.value
  
  // If auto is selected, determine rule based on price
  if (ruleKey === 'auto') {
    ruleKey = getAutoRule(harga)
  }

  const rule = rules[ruleKey]
  
  // Calculate ARA and ARB with rounding
  hasilARA.value = Math.round(harga * (1 + rule.ara))
  hasilARB.value = Math.round(harga * (1 + rule.arb))
}

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Watch for changes
watch([hargaPenutupan, selectedRule], () => {
  calculateRanges()
})
</script>