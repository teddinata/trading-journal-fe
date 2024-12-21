// src/components/dashboard/PeriodSelector.vue
<template>
  <div class="flex items-center space-x-2">
    <button 
      v-for="option in periodOptions" 
      :key="option.value"
      class="px-3 py-1.5 text-sm rounded-lg transition-colors"
      :class="modelValue === option.value 
        ? 'bg-indigo-100 text-indigo-600' 
        : 'text-gray-500 hover:bg-gray-100'"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
const periodOptions = [
  { value: 'Day', label: 'Hari Ini' },
  { value: 'Week', label: '7 Hari' },
  { value: 'Month', label: '30 Hari' }
]

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>