<script setup lang="ts">
import { onMounted } from 'vue'

const {
  data,
  loading,
  error,
  chartData,
  averageNoiseLevel,
  maxNoiseLevel,
  minNoiseLevel,
  noiseLevelStatus,
  loadCsvData,
} = useCsvData()

onMounted(() => {
  loadCsvData('/data/noise-data.csv')
})

function getStatusColor(status: string) {
  switch (status) {
    case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
    case 'Moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
    case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Noise Monitoring Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Real-time noise level monitoring and analysis
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading data
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Data Display -->
      <div v-else-if="data.length > 0" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Average Noise
                </h3>
                <span class="text-2xl font-bold text-blue-600">
                  {{ averageNoiseLevel }} dB
                </span>
              </div>
            </template>
            <div class="flex items-center">
              <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(noiseLevelStatus.status)}`">
                {{ noiseLevelStatus.status }}
              </span>
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Max Noise
                </h3>
                <span class="text-2xl font-bold text-red-600">
                  {{ maxNoiseLevel }} dB
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Peak noise level recorded
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Min Noise
                </h3>
                <span class="text-2xl font-bold text-green-600">
                  {{ minNoiseLevel }} dB
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Lowest noise level recorded
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Data Points
                </h3>
                <span class="text-2xl font-bold text-purple-600">
                  {{ data.length }}
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total measurements
            </div>
          </CommonAppCard>
        </div>

        <!-- Chart -->
        <CommonAppCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Noise Level Over Time
              </h3>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Noise Level (dB)</span>
              </div>
            </div>
          </template>
          <div class="p-4">
            <DashboardDataChart
              :data="chartData"
              color="#3b82f6"
            />
          </div>
        </CommonAppCard>

        <!-- Data Table -->
        <CommonAppCard>
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Recent Measurements
            </h3>
          </template>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Noise Level
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="item in data.slice(0, 10)" :key="item.timestamp">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ new Date(item.timestamp).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.noise_level }} dB
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.location }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.device_id }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CommonAppCard>
      </div>
    </div>
  </div>
</template>
