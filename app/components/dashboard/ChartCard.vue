<script setup lang="ts">
defineProps<{
  title: string
  value: string
  chartData: any[] // Replace with a proper type later
  chartColor: string
}>()
</script>

<template>
  <CommonAppCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <span class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ value }}</span>
      </div>
    </template>
    <div>
      <DashboardDataChart :data="chartData" :color="chartColor" />
    </div>
  </CommonAppCard>
</template>
