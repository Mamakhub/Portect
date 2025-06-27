<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sensor Control & Summary
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Monitor and manage all sensors across different sites. Click a sensor for detailed information and real-time data.
        </p>
      </div>

      <!-- Filters and Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <!-- Search -->
          <div class="flex-1 min-w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search by name, site, or type..." 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
            />
          </div>
          
          <!-- Site Filter -->
          <select 
            v-model="filterSite" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Sites</option>
            <option v-for="site in mockSites" :key="site.id" :value="site.id">
              {{ site.name }}
            </option>
          </select>
          
          <!-- Type Filter -->
          <select 
            v-model="filterType" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="noise">Noise Sensors</option>
            <option value="dust">Dust Sensors</option>
          </select>
          
          <!-- Status Filter -->
          <select 
            v-model="filterStatus" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredSensors.length }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Sensors</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ activeSensorsCount }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ maintenanceSensorsCount }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Maintenance</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ offlineSensorsCount }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Offline</div>
          </div>
        </div>
      </div>

      <!-- Sensors Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sensor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Site</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Battery</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Signal</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Reading</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="sensor in filteredSensors" 
                :key="sensor.id" 
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                @click="openSensor(sensor)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <Icon 
                          :icon="sensor.type === 'dust' ? 'heroicons:cloud' : 'heroicons:speaker-wave'" 
                          class="w-5 h-5 text-gray-600 dark:text-gray-400" 
                        />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ sensor.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ sensor.location }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="sensor.type === 'noise' ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <Icon :icon="sensor.type === 'dust' ? 'heroicons:cloud' : 'heroicons:speaker-wave'" class="w-3 h-3 mr-1" />
                    {{ sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center">
                    <Icon icon="heroicons:map-pin" class="w-4 h-4 text-gray-400 mr-1" />
                    {{ getSiteName(sensor.siteId) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="statusClass(sensor.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300" 
                        :class="batteryColorClass(sensor.batteryLevel)"
                        :style="{ width: `${sensor.batteryLevel}%` }"
                      ></div>
                    </div>
                    <span :class="batteryClass(sensor.batteryLevel)" class="text-sm font-medium">
                      {{ sensor.batteryLevel }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300" 
                        :class="signalColorClass(sensor.signalStrength)"
                        :style="{ width: `${sensor.signalStrength}%` }"
                      ></div>
                    </div>
                    <span :class="signalClass(sensor.signalStrength)" class="text-sm font-medium">
                      {{ sensor.signalStrength }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">
                    <span class="font-medium">{{ sensor.lastReading }}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">{{ sensor.type === 'dust' ? 'mg/m³' : 'dB' }}</span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(sensor.lastReadingTime) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <button 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors" 
                    @click.stop="openSensor(sensor)"
                  >
                    <Icon icon="heroicons:eye" class="w-3 h-3 mr-1" />
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSensors.length === 0" class="text-center py-12">
          <Icon icon="heroicons:cpu-chip" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No sensors found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>

      <!-- Sensor Detail Modal -->
      <SensorDetailModal 
        v-if="selectedSensor" 
        :sensor="selectedSensor" 
        @close="selectedSensor = null" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import SensorDetailModal from '~/components/common/SensorDetailModal.vue'
import { mockSensorDevices, mockSites } from '~/data/mockSites'
import type { SensorDevice } from '~/types/sites'

const search = ref('')
const filterSite = ref('')
const filterType = ref('')
const filterStatus = ref('')
const selectedSensor = ref<SensorDevice | null>(null)

const filteredSensors = computed(() => {
  return mockSensorDevices.filter(sensor => {
    const matchesSearch =
      sensor.name.toLowerCase().includes(search.value.toLowerCase()) ||
      getSiteName(sensor.siteId).toLowerCase().includes(search.value.toLowerCase()) ||
      sensor.type.toLowerCase().includes(search.value.toLowerCase()) ||
      (sensor.location?.toLowerCase().includes(search.value.toLowerCase()) || false)
    
    const matchesSite = !filterSite.value || sensor.siteId === filterSite.value
    const matchesType = !filterType.value || sensor.type === filterType.value
    const matchesStatus = !filterStatus.value || sensor.status === filterStatus.value
    
    return matchesSearch && matchesSite && matchesType && matchesStatus
  })
})

const activeSensorsCount = computed(() => 
  filteredSensors.value.filter(s => s.status === 'active').length
)

const maintenanceSensorsCount = computed(() => 
  filteredSensors.value.filter(s => s.status === 'maintenance').length
)

const offlineSensorsCount = computed(() => 
  filteredSensors.value.filter(s => s.status === 'offline' || s.status === 'inactive').length
)

function getSiteName(siteId: string) {
  const site = mockSites.find(s => s.id === siteId)
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

function formatTime(timestamp: string | undefined) {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function openSensor(sensor: SensorDevice) {
  selectedSensor.value = sensor
}
</script>

<style scoped>
/* Custom styles for the sensors page */
</style> 