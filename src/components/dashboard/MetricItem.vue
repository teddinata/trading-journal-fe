// src/components/dashboard/MetricItem.vue
<template>
  <div class="flex items-center justify-between">
    <span class="text-gray-500">{{ label }}</span>
    <div class="flex items-center space-x-2">
      <span 
        class="font-medium"
        :class="valueClass"
      >
        {{ formattedValue }}
      </span>
      <component 
        v-if="trend"
        :is="trendIcon"
        class="h-4 w-4"
        :class="trendColorClass"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  label: {
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
  trend: {
    type: String,
    default: null,
    validator: (value) => ['up', 'down', 'neutral', null].includes(value)
  }
})

const formattedValue = computed(() => {
  // Handle null/undefined values
  if (props.value === null || props.value === undefined) {
    return '-'
  }

  try {
    switch (props.type) {
      case 'currency':
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(props.value)
      case 'percentage':
        return `${props.value.toFixed(2)}%`
      case 'ratio':
        return props.value.toFixed(2)
      default:
        return props.value.toLocaleString()
    }
  } catch (error) {
    console.error('Error formatting value:', error)
    return '-'
  }
})

const valueClass = computed(() => {
  if (!props.value && props.value !== 0) return 'text-gray-500'
  
  if (props.type === 'currency') {
    return props.value >= 0 ? 'text-green-600' : 'text-red-600'
  }
  return 'text-gray-900'
})

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up': return ArrowUpIcon
    case 'down': return ArrowDownIcon
    case 'neutral': return MinusIcon
    default: return null
  }
})

const trendColorClass = computed(() => {
  switch (props.trend) {
    case 'up': return 'text-green-500'
    case 'down': return 'text-red-500'
    default: return 'text-gray-400'
  }
})
</script>