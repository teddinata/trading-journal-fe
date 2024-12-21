<!-- // src/components/dashboard/PnLDisplay.vue -->
<template>
  <span :class="valueClass">
    {{ formattedValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  }
})

const valueClass = computed(() => {
  return props.value >= 0 ? 'text-green-600' : 'text-red-600'
})

const formattedValue = computed(() => {
  const prefix = props.value >= 0 ? '+' : ''
  return `${prefix}$${props.value.toLocaleString()}`
})
</script>