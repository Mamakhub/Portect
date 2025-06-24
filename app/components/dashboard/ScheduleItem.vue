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
  green: {
    border: 'border-green-500',
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-800 dark:text-green-200',
  },
  yellow: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-800 dark:text-yellow-200',
  },
  red: {
    border: 'border-red-500',
    bg: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-800 dark:text-red-200',
  },
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
