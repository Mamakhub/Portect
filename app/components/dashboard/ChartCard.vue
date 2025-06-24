<script setup lang="ts">
defineProps<{
  title: string
  value: string
  chartData: any[] // Replace with a proper type later
  chartColor: string
  label?: string
  unit?: string
}>()

const emit = defineEmits<{
  'view-details': []
}>()
</script>

<template>
  <CommonAppCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <div class="flex items-center space-x-4">
          <span class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ value }}</span>
          <button
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            @click="emit('view-details')"
          >
            View Details
          </button>
        </div>
      </div>
    </template>
    <div>
      <DashboardDataChart
        :data="chartData"
        :color="chartColor"
        :label="label"
        :unit="unit"
      />
    </div>
  </CommonAppCard>
</template>
