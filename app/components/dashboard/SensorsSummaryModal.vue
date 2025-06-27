<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { SensorDevice } from '~/types/sites';

defineProps<{
  isOpen: boolean
  sensorSummary: {
    dustActive: number
    dustInactive: number
    noiseActive: number
    noiseInactive: number
    totalDevices: number
  }
  sensorDevices?: SensorDevice[]
  selectedSiteName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeModal() {
  emit('close')
}

// Get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Get sensor type icon
function getSensorIcon(type: string): string {
  switch (type) {
    case 'dust': return 'heroicons:cloud'
    case 'noise': return 'heroicons:speaker-wave'
    default: return 'heroicons:cpu-chip'
  }
}

// Get battery level color
function getBatteryColor(level: number): string {
  if (level > 80)
    return 'text-green-600 dark:text-green-400'
  if (level > 50)
    return 'text-yellow-600 dark:text-yellow-400'
  if (level > 20)
    return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

// Get signal strength color
function getSignalColor(strength: number): string {
  if (strength > 80)
    return 'text-green-600 dark:text-green-400'
  if (strength > 50)
    return 'text-yellow-600 dark:text-yellow-400'
  if (strength > 20)
    return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}
</script>

<template>
  <CommonModal
    :is-open="isOpen"
    :title="selectedSiteName ? `Sensor Summary - ${selectedSiteName}` : 'Sensor Summary'"
    size="xl"
    @close="closeModal"
  >
    <div class="space-y-6">
      <!-- Summary Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:cloud" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-600 dark:text-blue-400">
                Dust Sensors
              </p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {{ sensorSummary.dustActive + sensorSummary.dustInactive }}
              </p>
            </div>
          </div>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {{ sensorSummary.dustActive }} active
          </p>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:speaker-wave" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-purple-600 dark:text-purple-400">
                Noise Sensors
              </p>
              <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {{ sensorSummary.noiseActive + sensorSummary.noiseInactive }}
              </p>
            </div>
          </div>
          <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">
            {{ sensorSummary.noiseActive }} active
          </p>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-green-600 dark:text-green-400">
                Total Active
              </p>
              <p class="text-2xl font-bold text-green-900 dark:text-green-100">
                {{ sensorSummary.dustActive + sensorSummary.noiseActive }}
              </p>
            </div>
          </div>
          <p class="text-xs text-green-600 dark:text-green-400 mt-1">
            {{ Math.round(((sensorSummary.dustActive + sensorSummary.noiseActive) / sensorSummary.totalDevices) * 100) }}% of total
          </p>
        </div>

        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-red-600 dark:text-red-400">
                Inactive
              </p>
              <p class="text-2xl font-bold text-red-900 dark:text-red-100">
                {{ sensorSummary.dustInactive + sensorSummary.noiseInactive }}
              </p>
            </div>
          </div>
          <p class="text-xs text-red-600 dark:text-red-400 mt-1">
            Needs attention
          </p>
        </div>
      </div>

      <!-- Device List -->
      <div v-if="sensorDevices && sensorDevices.length > 0">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Device Details
        </h3>

        <!-- Column Headers -->
        <div class="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          <div class="col-span-4">
            Device Information
          </div>
          <div class="col-span-2 text-center">
            Battery Level
          </div>
          <div class="col-span-2 text-center">
            Signal Strength
          </div>
          <div class="col-span-2 text-center">
            Status
          </div>
          <div class="col-span-2 text-center">
            Last Reading
          </div>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="device in sensorDevices"
            :key="device.id"
            class="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg items-center"
          >
            <!-- Device Information -->
            <div class="col-span-4 flex items-center space-x-3">
              <Icon
                :icon="getSensorIcon(device.type)"
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ device.name }}
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ID: {{ device.id }} | Type: {{ device.type }}
                </p>
                <p v-if="device.location" class="text-xs text-gray-500 dark:text-gray-500">
                  Location: {{ device.location }}
                </p>
              </div>
            </div>

            <!-- Battery Level -->
            <div class="col-span-2 flex flex-col items-center space-y-1">
              <div class="flex items-center space-x-1">
                <Icon icon="heroicons:battery-50" class="w-4 h-4" :class="getBatteryColor(device.batteryLevel)" />
                <span class="text-xs font-medium" :class="getBatteryColor(device.batteryLevel)">
                  {{ device.batteryLevel }}%
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">Battery</span>
            </div>

            <!-- Signal Strength -->
            <div class="col-span-2 flex flex-col items-center space-y-1">
              <div class="flex items-center space-x-1">
                <Icon icon="heroicons:signal" class="w-4 h-4" :class="getSignalColor(device.signalStrength)" />
                <span class="text-xs font-medium" :class="getSignalColor(device.signalStrength)">
                  {{ device.signalStrength }}%
                </span>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">Signal</span>
            </div>

            <!-- Status -->
            <div class="col-span-2 flex flex-col items-center space-y-1">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusColor(device.status)"
              >
                {{ device.status }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Status</span>
            </div>

            <!-- Last Reading -->
            <div class="col-span-2 flex flex-col items-center space-y-1">
              <span class="text-xs font-medium text-gray-900 dark:text-white">
                {{ device.lastReading ? `${device.lastReading}${device.type === 'noise' ? ' dB' : ' mg/m³'}` : 'N/A' }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Reading</span>
            </div>
          </div>

          <!-- Mobile Layout -->
          <div
            v-for="device in sensorDevices"
            :key="`mobile-${device.id}`"
            class="md:hidden p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3"
          >
            <!-- Device Information -->
            <div class="flex items-center space-x-3">
              <Icon
                :icon="getSensorIcon(device.type)"
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ device.name }}
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  ID: {{ device.id }} | Type: {{ device.type }}
                </p>
                <p v-if="device.location" class="text-xs text-gray-500 dark:text-gray-500">
                  Location: {{ device.location }}
                </p>
              </div>
            </div>

            <!-- Data Row -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Battery Level -->
              <div class="flex flex-col items-center space-y-1">
                <div class="flex items-center space-x-1">
                  <Icon icon="heroicons:battery-50" class="w-4 h-4" :class="getBatteryColor(device.batteryLevel)" />
                  <span class="text-xs font-medium" :class="getBatteryColor(device.batteryLevel)">
                    {{ device.batteryLevel }}%
                  </span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Battery</span>
              </div>

              <!-- Signal Strength -->
              <div class="flex flex-col items-center space-y-1">
                <div class="flex items-center space-x-1">
                  <Icon icon="heroicons:signal" class="w-4 h-4" :class="getSignalColor(device.signalStrength)" />
                  <span class="text-xs font-medium" :class="getSignalColor(device.signalStrength)">
                    {{ device.signalStrength }}%
                  </span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Signal</span>
              </div>

              <!-- Status -->
              <div class="flex flex-col items-center space-y-1">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusColor(device.status)"
                >
                  {{ device.status }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Status</span>
              </div>

              <!-- Last Reading -->
              <div class="flex flex-col items-center space-y-1">
                <span class="text-xs font-medium text-gray-900 dark:text-white">
                  {{ device.lastReading ? `${device.lastReading}${device.type === 'noise' ? ' dB' : ' mg/m³'}` : 'N/A' }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">Reading</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No devices message -->
      <div v-else class="text-center py-8">
        <Icon
          icon="heroicons:cpu-chip"
          class="w-12 h-12 text-gray-400 mx-auto mb-3"
        />
        <p class="text-gray-600 dark:text-gray-400">
          No detailed device information available
        </p>
      </div>

      <!-- Last Updated -->
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Last Updated: {{ new Date().toLocaleString() }}
        </p>
      </div>
    </div>
  </CommonModal>
</template>
