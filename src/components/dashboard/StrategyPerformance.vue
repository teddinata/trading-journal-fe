// src/components/dashboard/StrategyPerformance.vue
<template>
  <div class="bg-white rounded-xl shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium">Strategy Performance</h2>
      <select 
        v-model="selectedMetric" 
        class="text-sm border-gray-300 rounded-md"
      >
        <option value="win_rate">Win Rate</option>
        <option value="total_pnl">Total P&L</option>
        <option value="expectancy">Expectancy</option>
        <option value="profit_factor">Profit Factor</option>
      </select>
    </div>

    <div class="space-y-6">
      <div 
        v-for="strategy in sortedStrategies" 
        :key="strategy.name"
        class="space-y-2"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getStrategyColor(strategy.name) }"
            ></div>
            <span class="font-medium text-gray-900">{{ strategy.name }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium" :class="getMetricColor(strategy)">
              {{ formatMetricValue(strategy) }}
            </span>
            <span class="text-xs text-gray-500">
              ({{ strategy.metrics.total_trades }} trades)
            </span>
          </div>
        </div>

        <div class="relative">
          <!-- Background bar -->
          <div class="w-full bg-gray-100 rounded-full h-1.5"></div>
          
          <!-- Progress bar -->
          <div 
            class="absolute top-0 left-0 h-1.5 rounded-full transition-all duration-500"
            :style="{
              width: `${getProgressWidth(strategy)}%`,
              backgroundColor: getStrategyColor(strategy.name)
            }"
          ></div>
        </div>

        <!-- Metrics grid -->
        <div class="grid grid-cols-3 gap-4 mt-2">
          <div>
            <div class="text-xs text-gray-500">Win Rate</div>
            <div class="text-sm font-medium">
              {{ strategy.metrics.win_rate }}%
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-500">Avg Profit</div>
            <div class="text-sm font-medium">
              {{ formatCurrency(strategy.metrics.avg_profit) }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-500">Expectancy</div>
            <div class="text-sm font-medium">
              {{ formatCurrency(strategy.metrics.expectancy) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  strategies: {
    type: Array,
    required: true
  }
})

const selectedMetric = ref('win_rate')

const strategyColors = {
  'Breakout Strategy': '#4F46E5',
  'Trend Following': '#10B981',
  'Mean Reversion': '#F59E0B',
  'Scalping': '#EC4899'
}

const sortedStrategies = computed(() => {
  return [...props.strategies].sort((a, b) => {
    return b.metrics[selectedMetric.value] - a.metrics[selectedMetric.value]
  })
})

const getStrategyColor = (name) => {
  return strategyColors[name] || '#6B7280'
}

const getMetricColor = (strategy) => {
  const value = strategy.metrics[selectedMetric.value]
  if (selectedMetric.value === 'win_rate') {
    return value >= 50 ? 'text-green-600' : 'text-red-600'
  }
  return value >= 0 ? 'text-green-600' : 'text-red-600'
}

const getProgressWidth = (strategy) => {
  const value = strategy.metrics[selectedMetric.value]
  const maxValue = Math.max(...props.strategies.map(s => s.metrics[selectedMetric.value]))
  return (value / maxValue) * 100
}

const formatMetricValue = (strategy) => {
  const value = strategy.metrics[selectedMetric.value]
  switch (selectedMetric.value) {
    case 'win_rate':
      return `${value.toFixed(1)}%`
    case 'total_pnl':
    case 'expectancy':
      return formatCurrency(value)
    case 'profit_factor':
      return value.toFixed(2)
    default:
      return value
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>