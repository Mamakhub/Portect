<script setup lang="ts">
// This component will hold the schedule items

const emit = defineEmits<{
  viewDetails: []
}>()

function handleViewDetails() {
  emit('viewDetails')
}
</script>

<template>
  <CommonAppCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Today's Schedule
        </h3>
        <button
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          @click="handleViewDetails"
        >
          View Details
        </button>
      </div>
    </template>
    <div class="space-y-4">
      <slot />
    </div>
  </CommonAppCard>
</template>
