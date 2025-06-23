<script setup lang="ts">
// This component provides a consistent card layout with optional header.
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <div v-if="$slots.header" class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
      <slot name="header" />
    </div>
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>
