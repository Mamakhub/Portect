<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    variant: 'primary',
    size: 'md',
  },
)

const buttonClasses = computed(() => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return `${variantClasses[props.variant]} ${sizeClasses[props.size]}`
})
</script>

<template>
  <button
    class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2" :class="[
      buttonClasses,
    ]"
  >
    <slot />
  </button>
</template>
