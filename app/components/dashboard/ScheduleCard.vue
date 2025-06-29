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
          class="text-sm text-tenang-primary dark:text-tenang-primary-dark hover:text-tenang-primary/80 dark:hover:text-tenang-primary-dark/80 font-medium transition-colors"
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
