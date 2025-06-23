<script setup lang="ts">
// This component will hold the schedule items
</script>

<template>
  <CommonAppCard>
    <template #header>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Today's Schedule
      </h3>
    </template>
    <div class="space-y-4">
      <slot />
    </div>
  </CommonAppCard>
</template>
