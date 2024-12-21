// src/components/dashboard/TradingChart.vue
<template>
  <div class="relative h-[300px]">
    <Line 
      v-if="chartData" 
      :data="chartData" 
      :options="chartOptions" 
      class="h-full"
    />
    <div 
      v-else 
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="text-gray-500">Loading chart...</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import debounce from 'lodash/debounce'

// Register only needed components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: []
    })
  },
  period: {
    type: String,
    default: 'Day'
  }
})

// Optimize dataset processing
const processDatasets = (datasets) => {
  return datasets.map(dataset => ({
    ...dataset,
    pointRadius: 0, // Remove points for better performance
    pointHitRadius: 10, // Keep hover detection
    borderWidth: 2,
    fill: false,
    tension: 0.4
  }))
}

// Memoize chart data
const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: processDatasets(props.data.datasets)
}))

// Optimized chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0 // Disable animations for better performance
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        boxWidth: 12,
        usePointStyle: true
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      animation: {
        duration: 100
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        maxTicksLimit: 5 // Limit number of ticks
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxTicksLimit: 8, // Limit number of ticks
        maxRotation: 0 // Prevent label rotation
      }
    }
  }
}

// Handle resize events efficiently
const handleResize = debounce(() => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}, 250)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  handleResize.cancel()
})
</script>