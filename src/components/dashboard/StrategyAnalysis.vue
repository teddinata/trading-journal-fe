# src/components/dashboard/StrategyAnalysis.vue
<template>
  <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
    <div class="p-6 border-b border-gray-700">
      <h2 class="text-lg font-semibold text-white">Analisis Strategi Trading</h2>
    </div>
    
    <div class="p-6">
      <div class="space-y-8">
        <!-- Strategy Card untuk setiap strategi -->
        <div v-for="strategy in strategies" :key="strategy.name" class="space-y-4">
          <!-- Header Strategi -->
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium text-white">{{ strategy.name }}</h3>
              <p class="text-sm text-gray-400">{{ strategy.metrics.total_trades }} trades</p>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold" :class="strategy.metrics.total_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'">
                {{ formatCurrency(strategy.metrics.total_pnl) }}
              </div>
              <div class="text-sm text-gray-400">Total P&L</div>
            </div>
          </div>

          <!-- Metrics Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Win Rate -->
            <div class="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div class="text-sm text-gray-400">Win Rate</div>
              <div class="mt-1 text-lg font-semibold text-white">
                {{ strategy.metrics.win_rate }}%
              </div>
            </div>

            <!-- Average Profit -->
            <div class="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div class="text-sm text-gray-400">Rata-rata Profit Harian</div>
              <div class="mt-1 text-lg font-semibold text-emerald-400">
                {{ formatCurrency(strategy.metrics.avg_profit) }}
              </div>
            </div>

            <!-- Average Loss -->
            <div class="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div class="text-sm text-gray-400">Rata-rata Loss Harian</div>
              <div class="mt-1 text-lg font-semibold text-red-400">
                {{ formatCurrency(strategy.metrics.avg_loss) }}
              </div>
            </div>

            <!-- Profit Factor -->
            <div class="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div class="text-sm text-gray-400">Profit Factor</div>
              <div class="mt-1 text-lg font-semibold text-white">
                {{ strategy.metrics.profit_factor || 'N/A' }}
              </div>
            </div>
          </div>

          <!-- Progress Bar & Additional Info -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Performance Meter</span>
              <span class="font-medium text-white">{{ strategy.metrics.win_rate }}% Win Rate</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                :style="{ width: `${strategy.metrics.win_rate}%` }"
              ></div>
            </div>
          </div>

          <!-- Additional Analysis -->
          <div class="mt-4 pt-4 border-t border-gray-700">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-400">Holding Period</span>
                <p class="mt-1 font-medium text-white">
                  {{ strategy.analysis.avg_holding_period || 'N/A' }}
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-400">Best Emiten</span>
                <p class="mt-1 font-medium text-white">
                  {{ strategy.analysis.best_performing_emiten || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tradingService } from '@/service/tradingService'

defineProps({
  strategies: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatCurrency = (value) => tradingService.formatCurrency(value)
</script>