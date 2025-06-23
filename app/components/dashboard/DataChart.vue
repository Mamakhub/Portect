<script setup lang="ts">
const props = defineProps<{
  data: any[] // Replace with a proper type later
  color: string
}>()

// Logic for the chart library will be added here
</script>

<template>
  <div class="h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
    <p class="text-gray-500 dark:text-gray-400">
      Chart will be displayed here
    </p>
    <!-- Chart library integration will go here -->
  </div>
</template>
