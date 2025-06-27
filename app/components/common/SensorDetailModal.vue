<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="closeModal">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 relative" @click.stop>
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" 
        @click="closeModal"
      >
        <Icon icon="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ sensor.name }}</h2>
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <Icon :icon="sensor.type === 'dust' ? 'heroicons:cloud' : 'heroicons:speaker-wave'" class="w-4 h-4" />
            {{ sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1) }} Sensor
          </span>
          <span class="flex items-center gap-1">
            <Icon icon="heroicons:map-pin" class="w-4 h-4" />
            {{ getSiteName(sensor.siteId) }}
          </span>
          <span class="flex items-center gap-1">
            <Icon icon="heroicons:clock" class="w-4 h-4" />
            {{ formatTime(sensor.lastReadingTime) }}
          </span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sensor Details -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sensor Information</h3>
            
            <!-- Status Badge -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
              <span :class="statusClass(sensor.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1) }}
              </span>
            </div>

            <!-- Current Reading -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current Reading</span>
              <span class="text-lg font-bold" :class="sensor.type === 'dust' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'">
                {{ sensor.lastReading }} <span class="text-sm">{{ sensor.type === 'dust' ? 'mg/m³' : 'dB' }}</span>
              </span>
            </div>

            <!-- Battery Level -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Battery</span>
                <span :class="batteryClass(sensor.batteryLevel)" class="text-sm font-semibold">
                  {{ sensor.batteryLevel }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300" 
                  :class="batteryColorClass(sensor.batteryLevel)"
                  :style="{ width: `${sensor.batteryLevel}%` }"
                ></div>
              </div>
            </div>

            <!-- Signal Strength -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Signal</span>
                <span :class="signalClass(sensor.signalStrength)" class="text-sm font-semibold">
                  {{ sensor.signalStrength }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300" 
                  :class="signalColorClass(sensor.signalStrength)"
                  :style="{ width: `${sensor.signalStrength}%` }"
                ></div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Location:</span>
                <span class="text-gray-900 dark:text-white">{{ sensor.location }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                <span class="text-gray-900 dark:text-white">{{ sensor.manufacturer }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Model:</span>
                <span class="text-gray-900 dark:text-white">{{ sensor.model }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Firmware:</span>
                <span class="text-gray-900 dark:text-white">{{ sensor.firmware }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Installed:</span>
                <span class="text-gray-900 dark:text-white">{{ formatDate(sensor.installDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ sensor.type === 'dust' ? 'Dust Level' : 'Noise Level' }} History (Last 24 Hours)
            </h3>
            <div class="h-80">
              <DataChart 
                :data="chartData" 
                :color="sensor.type === 'dust' ? '#fbbf24' : '#3b82f6'"
                :label="sensor.type === 'dust' ? 'Dust Level' : 'Noise Level'"
                :unit="sensor.type === 'dust' ? 'mg/m³' : 'dB'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import DataChart from '~/components/dashboard/DataChart.vue';
import { mockSites } from '~/data/mockSites';

const props = defineProps<{ sensor: any }>()
const emit = defineEmits<{ close: [] }>()

const chartData = computed(() => {
  return props.sensor.history.map((d: any) => ({
    x: new Date(d.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    y: d.value
  }))
})

function getSiteName(siteId: string) {
  const site = mockSites.find((s: any) => s.id === siteId)
  return site ? site.name : siteId
}

function statusClass(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function batteryClass(level: number) {
  if (level >= 80) return 'text-green-600 dark:text-green-400'
  if (level >= 50) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function batteryColorClass(level: number) {
  if (level >= 80) return 'bg-green-500'
  if (level >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function signalClass(level: number) {
  if (level >= 80) return 'text-green-600 dark:text-green-400'
  if (level >= 50) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function signalColorClass(level: number) {
  if (level >= 80) return 'bg-green-500'
  if (level >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function closeModal() {
  emit('close')
}
</script>

<style scoped>
/* Custom styles for modal */
</style> 