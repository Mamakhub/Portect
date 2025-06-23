<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  time: string
  title: string
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'red'
}>()

const colorClasses = {
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-800 dark:text-blue-200',
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-800 dark:text-purple-200',
  },
  // Add other colors as needed
}

const borderColor = computed(() => colorClasses[props.color]?.border || 'border-gray-300')
const bgColor = computed(() => colorClasses[props.color]?.bg || 'bg-gray-100 dark:bg-gray-700')
const textColor = computed(() => colorClasses[props.color]?.text || 'text-gray-800 dark:text-gray-200')
</script>

<template>
  <div class="flex">
    <div class="w-16 text-sm text-gray-500 dark:text-gray-400">
      {{ time }}
    </div>
    <div class="flex-1 pl-4 border-l-2" :class="borderColor">
      <div class="p-3 rounded-md" :class="bgColor">
        <p class="text-sm font-medium" :class="textColor">
          {{ title }}
        </p>
      </div>
    </div>
  </div>
</template>
