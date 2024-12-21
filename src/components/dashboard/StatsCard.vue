# src/components/dashboard/StatsCard.vue
<template>
  <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:bg-gray-750 transition-all">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div 
          class="p-2 rounded-lg"
          :class="iconBackgroundClass"
        >
          <component 
            :is="icon" 
            class="h-5 w-5"
            :class="iconColorClass"
          />
        </div>
        <h3 class="text-sm font-medium text-gray-400">{{ title }}</h3>
      </div>
      <div 
        v-if="showTrend"
        class="flex items-center space-x-1"
        :class="trendTextClass"
      >
        <component 
          :is="trendIcon" 
          class="h-4 w-4"
        />
        <span class="text-sm font-medium">{{ trendValue }}</span>
      </div>
    </div>
    <div class="mt-4">
      <p class="text-2xl font-bold" :class="valueClass">
        {{ formattedValue }}
      </p>
      <p v-if="subtitle" class="mt-2 text-sm text-gray-400">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'currency', 'percentage', 'ratio'].includes(value)
  },
  icon: {
    type: [String, Object],
    required: true
  },
  trend: {
    type: String,
    default: 'neutral',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  subtitle: String,
  previousValue: {
    type: Number,
    default: null
  }
})

const formatNumber = (value, type) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: type === 'currency' ? 'currency' : 'decimal',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: type === 'percentage' ? 2 : 0
  })

  const formatted = formatter.format(value)
  return type === 'percentage' ? `${formatted}%` : formatted
}

const formattedValue = computed(() => {
  return formatNumber(props.value, props.type)
})

const showTrend = computed(() => {
  return props.previousValue !== null
})

const trendValue = computed(() => {
  if (!showTrend.value) return ''
  
  const change = ((props.value - props.previousValue) / Math.abs(props.previousValue)) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
})

const trendIcon = computed(() => {
  return props.trend === 'up' ? ArrowUpIcon : ArrowDownIcon
})

const iconColorClass = computed(() => {
  switch (props.trend) {
    case 'up': return 'text-emerald-400'
    case 'down': return 'text-red-400'
    default: return 'text-blue-400'
  }
})

const iconBackgroundClass = computed(() => {
  switch (props.trend) {
    case 'up': return 'bg-emerald-400/10'
    case 'down': return 'bg-red-400/10'
    default: return 'bg-blue-400/10'
  }
})

const trendTextClass = computed(() => {
  switch (props.trend) {
    case 'up': return 'text-emerald-400'
    case 'down': return 'text-red-400'
    default: return 'text-gray-400'
  }
})

const valueClass = computed(() => {
  if (props.type === 'currency' || props.type === 'percentage') {
    return props.value >= 0 ? 'text-emerald-400' : 'text-red-400'
  }
  return 'text-white'
})
</script>