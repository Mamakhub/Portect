<script setup lang="ts">
import type { ChartDataPoint } from '~/types/noise'

interface Props {
  isOpen: boolean
  chartData: ChartDataPoint[]
  selectedSiteStats?: {
    averageNoise: number
    maxNoise: number
    minNoise: number
    averageDust: number
    maxDust: number
    minDust: number
  } | null
}

const _props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Get current time for display
const currentTime = new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

// Get latest noise reading from chart data
const latestReading = computed(() => {
  if (!_props.chartData || _props.chartData.length === 0)
    return null
  return _props.chartData[_props.chartData.length - 1]
})

// Calculate statistics from chart data
const stats = computed(() => {
  if (!_props.chartData || _props.chartData.length === 0) {
    return { average: 0, max: 0, min: 0 }
  }

  const values = _props.chartData.map((d: any) => d.y)
  return {
    average: Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length),
    max: Math.max(...values),
    min: Math.min(...values),
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label(context: any) {
          return `Noise Level: ${context.parsed.y} dB`
        },
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Time',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Noise Level (dB)',
      },
      beginAtZero: false,
      suggestedMin: 30,
      suggestedMax: 100,
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}
</script>

<template>
  <CommonModal
    :is-open="isOpen"
    title="Noise Monitoring Details"
    size="xl"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <!-- Content -->
      <div class="space-y-6">
        <!-- Current Status -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Current Noise Level
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {{ currentTime }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {{ latestReading?.y || 0 }} dB
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ latestReading?.x || 'N/A' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.average }} dB
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
            <div class="flex items-center">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Maximum
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.max }} dB
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Minimum
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.min }} dB
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Noise Level Trend
          </h3>
          <div class="h-64">
            <DashboardDataChart
              :data="_props.chartData"
              :options="chartOptions"
              color="#F87171"
            />
          </div>
        </div>

        <!-- Recent Readings Table -->
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Readings
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Noise Level
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="reading in _props.chartData?.slice(-10).reverse()" :key="reading.x">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ reading.x }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ reading.y }} dB
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': reading.y < 70,
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': reading.y >= 70 && reading.y < 85,
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': reading.y >= 85,
                      }"
                    >
                      {{ reading.y < 70 ? 'Normal' : reading.y < 85 ? 'Moderate' : 'High' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </CommonModal>
</template>
