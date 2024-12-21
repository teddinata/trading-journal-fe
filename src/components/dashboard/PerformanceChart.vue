<!-- // src/components/dashboard/PerformanceChart.vue -->
<template>
  <div class="relative" :style="{ height }">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
    <Line 
      v-else
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { tradingService } from '@/service/tradingService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  height: {
    type: String,
    default: '300px'
  },
  loading: {
    type: Boolean,
    default: false
  },
  showPnL: {
    type: Boolean,
    default: true
  },
  showWinRate: {
    type: Boolean,
    default: true
  }
})

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  datasets: [
    ...(props.showPnL ? [{
      label: 'P&L Kumulatif',
      data: props.data.map(d => d.cumulative_pnl),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      yAxisID: 'pnl',
      tension: 0.4
    }] : []),
    ...(props.showWinRate ? [{
      label: 'Win Rate %',
      data: props.data.map(d => d.win_rate),
      borderColor: '#10B981',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      fill: false,
      yAxisID: 'winRate',
      tension: 0.4
    }] : [])
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxTicksLimit: 7,
        color: '#6B7280',
        font: {
          size: 11
        }
      }
    },
    pnl: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        borderDash: [2, 2],
        color: '#E5E7EB'
      },
      ticks: {
        callback: value => tradingService.formatCurrency(value),
        color: '#6B7280',
        font: {
          size: 11
        }
      }
    },
    winRate: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        display: false
      },
      ticks: {
        callback: value => `${value.toFixed(1)}%`,
        color: '#6B7280',
        font: {
          size: 11
        }
      },
      min: 0,
      max: 100
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 8,
        usePointStyle: true,
        padding: 15,
        color: '#6B7280',
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#111827',
      bodyColor: '#111827',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label
          const value = context.raw
          if (context.dataset.yAxisID === 'pnl') {
            return `${label}: ${tradingService.formatCurrency(value)}`
          }
          return `${label}: ${value.toFixed(1)}%`
        }
      }
    }
  }
}
</script>