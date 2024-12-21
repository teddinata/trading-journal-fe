// src/views/Dashboard.vue
<template>
  <div class="space-y-6 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600 p-4 bg-white rounded-xl shadow-sm">
      {{ error }}
    </div>

    <template v-else>
      <!-- Header Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total P&L -->
        <StatsCard
          title="Total P&L"
          :value="summaryData?.overall?.total_pnl ?? 0"
          type="currency"
          trend="up"
          :subtitle="`${summaryData?.overall?.total_trades ?? 0} trades`"
        />
        
        <!-- Win Rate -->
        <StatsCard
          title="Win Rate"
          :value="summaryData?.performance?.win_rate ?? 0"
          type="percentage"
          trend="neutral"
          :subtitle="`${summaryData?.performance?.winning_trades ?? 0} menang • ${summaryData?.performance?.losing_trades ?? 0} kalah`"
        />
        
        <!-- Profit Factor -->
        <StatsCard
          title="Profit Factor"
          :value="summaryData?.performance?.profit_factor ?? 0"
          type="number"
          trend="up"
          subtitle="Risk/Reward Metric"
        />
        
        <!-- Expectancy -->
        <StatsCard
          title="Ekspektasi"
          :value="summaryData?.risk_metrics?.expectancy ?? 0"
          type="currency"
          trend="neutral"
          subtitle="Expected value per trade"
        />
      </div>

      <!-- Trading Activity & Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Performance Overview</h2>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    v-model="chartSettings.showPnL"
                    class="rounded text-indigo-600 focus:ring-indigo-500"
                  >
                  <span class="text-sm text-gray-600">P&L</span>
                </div>
                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    v-model="chartSettings.showWinRate"
                    class="rounded text-indigo-600 focus:ring-indigo-500"
                  >
                  <span class="text-sm text-gray-600">Win Rate</span>
                </div>
                <PeriodSelector 
                  v-model="selectedPeriod"
                  :periods="periods"
                />
              </div>
            </div>
          </div>
          <div class="p-6">
            <PerformanceChart
              :data="chartData"
              height="300px"
              :loading="loading"
              v-bind="chartSettings"
            />
          </div>
        </div>

        <!-- Trading Activity -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Trading Activity</h2>
          </div>
          <div class="p-6 space-y-6">
            <!-- Profit Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-500">Largest Win</span>
                <p class="mt-1 text-lg font-semibold text-green-600">
                  {{ formatCurrency(summaryData?.performance?.largest_win) }}
                </p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Largest Loss</span>
                <p class="mt-1 text-lg font-semibold text-red-600">
                  {{ formatCurrency(summaryData?.performance?.largest_loss) }}
                </p>
              </div>
            </div>

            <!-- Trading Days -->
            <div class="pt-4 border-t border-gray-100">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Trading Days</span>
                  <p class="mt-1 text-lg font-semibold">
                    {{ summaryData?.daily_stats?.total_trading_days ?? 0 }}
                  </p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Winning Days</span>
                  <p class="mt-1 text-lg font-semibold text-green-600">
                    {{ summaryData?.daily_stats?.winning_days ?? 0 }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Average Values -->
            <div class="pt-4 border-t border-gray-100">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-500">Average Win</span>
                  <p class="mt-1 text-lg font-semibold text-green-600">
                    {{ formatCurrency(summaryData?.performance?.avg_win) }}
                  </p>
                </div>
                <div>
                  <span class="text-sm text-gray-500">Average Loss</span>
                  <p class="mt-1 text-lg font-semibold text-red-600">
                    {{ formatCurrency(summaryData?.performance?.avg_loss) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Analysis & Strategy -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Risk Analysis -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Risk Analysis</h2>
          </div>
          <div class="p-6 space-y-4">
            <MetricItem
              label="Win/Loss Ratio"
              :value="summaryData?.risk_metrics?.win_loss_ratio ?? 0"
              type="ratio"
            />
            <MetricItem
              label="Risk/Reward Ratio"
              :value="summaryData?.risk_metrics?.risk_reward_ratio ?? 0"
              type="ratio"
            />
            <MetricItem
              label="Average Risk"
              :value="summaryData?.risk_metrics?.avg_risk_per_trade ?? 0"
              type="currency"
            />
          </div>
        </div>

        <!-- Streaks -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Streaks</h2>
          </div>
          <div class="p-6 space-y-4">
            <MetricItem
              label="Current Streak"
              :value="summaryData?.streaks?.current_streak ?? 0"
              type="number"
              :trend="(summaryData?.streaks?.current_streak ?? 0) > 0 ? 'up' : 'down'"
            />
            <MetricItem
              label="Max Win Streak"
              :value="summaryData?.streaks?.max_winning_streak ?? 0"
              type="number"
              trend="up"
            />
            <MetricItem
              label="Max Loss Streak"
              :value="summaryData?.streaks?.max_losing_streak ?? 0"
              type="number"
              trend="down"
            />
          </div>
        </div>

        <!-- Open Positions -->
        <div class="bg-white rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">Open Positions</h2>
          </div>
          <div class="p-6">
            <div class="text-center">
              <span class="text-3xl font-bold text-gray-900">
                {{ summaryData?.daily_stats?.open_trades ?? 0 }}
              </span>
              <p class="mt-2 text-sm text-gray-500">Active trades</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategy Analysis -->
      <!-- Strategy Analysis Section -->
        <StrategyAnalysis 
        v-if="strategies.length > 0"
        :strategies="strategies"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { tradingService } from '@/service/tradingService'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import PeriodSelector from '@/components/dashboard/PeriodSelector.vue'
import PerformanceChart from '@/components/dashboard/PerformanceChart.vue'
import MetricItem from '@/components/dashboard/MetricItem.vue'
import StrategyAnalysis from '@/components/dashboard/StrategyAnalysis.vue'

// State
const loading = ref(true)
const error = ref(null)
const selectedPeriod = ref('Month')
const chartSettings = ref({
  showPnL: true,
  showWinRate: true
})

// Data state
const summaryData = ref({
  overall: {
    total_pnl: 0,
    total_trades: 0,
    total_volume: 0,
    avg_trade_size: 0,
    avg_daily_pnl: 0,
    avg_daily_volume: 0
  },
  performance: {
    winning_trades: 0,
    losing_trades: 0,
    breakeven_trades: 0,
    win_rate: 0,
    profit_factor: 0,
    avg_win: 0,
    avg_loss: 0,
    largest_win: 0,
    largest_loss: 0
  },
  daily_stats: {
    total_trading_days: 0,
    winning_days: 0,
    losing_days: 0,
    breakeven_days: 0,
    logged_days: 0,
    open_trades: 0
  },
  risk_metrics: {
    win_loss_ratio: 0,
    risk_reward_ratio: 0,
    expectancy: 0,
    avg_risk_per_trade: 0
  },
  streaks: {
    current_streak: 0,
    max_winning_streak: 0,
    max_losing_streak: 0,
    max_consecutive_win_days: 0,
    max_consecutive_loss_days: 0
  }
})


const strategies = ref([])
const dailyData = ref([])

// Constants
const periods = [
  { value: 'Day', label: 'Hari Ini' },
  { value: 'Week', label: '7 Hari' },
  { value: 'Month', label: '30 Hari' }
]

// Computed
const chartData = computed(() => 
  tradingService.transformDailyPnL(dailyData.value)
)

const hasStrategies = computed(() =>
  strategies.value && strategies.value.length > 0
)

// Methods
const formatCurrency = (value) => tradingService.formatCurrency(value)
const formatDate = (date) => tradingService.formatDate(date)

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tradingService.getSummary(selectedPeriod.value)
    
    if (response?.data) {
      summaryData.value = response.data.summary
      dailyData.value = response.data.daily_pnl
      strategies.value = response.data.strategies
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Gagal memuat data trading'
  } finally {
    loading.value = false
  }
}

// Watchers
watch(selectedPeriod, () => {
  fetchData()
})

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>