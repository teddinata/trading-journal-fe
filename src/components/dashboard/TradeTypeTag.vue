<!-- // src/components/dashboard/TradeTypeTag.vue -->
<template>
  <span 
    class="px-2 py-1 text-xs font-medium rounded"
    :class="typeClass"
  >
    {{ type }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['BUY', 'SELL'].includes(value)
  }
})

const typeClass = computed(() => {
  return props.type === 'BUY' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700'
})
</script>