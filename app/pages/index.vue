<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// Page metadata
definePageMeta({
  title: 'Port Monitoring Dashboard',
  description: 'Real-time monitoring of port sensors and vessels'
})

// Data composables
const { 
  getVesselGPSData, 
  getLatestGPSReading, 
  getAllVesselGPSData,
  getVesselsWithSOS,
  loading: influxLoading,
  hasError: influxError 
} = useInfluxData()

const { 
  getVessels, 
  getVesselByDeviceId, 
  getVesselsByType, 
  getDashboardSummary,
  loading: postgresLoading,
  hasError: postgresError 
} = usePostgresData()

// Reactive data
const vessels = ref<any[]>([])
const vesselGPSData = ref<any[]>([])
const sosVessels = ref<any[]>([])
const summary = ref({
  totalVessels: 0,
  vesselsByType: {
    container: 0,
    bulk: 0,
    tanker: 0,
    passenger: 0,
    fishing: 0,
    tug: 0
  }
})

// Computed properties
const loading = computed(() => influxLoading.value || postgresLoading.value)
const hasError = computed(() => influxError.value || postgresError.value)

// Load data on mount
onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    // Load all data in parallel
    const [
      vesselsData,
      gpsData,
      sosData,
      summaryData
    ] = await Promise.all([
      getVessels(),
      getAllVesselGPSData(24), // Last 24 hours
      getVesselsWithSOS(),
      getDashboardSummary()
    ])

    vessels.value = vesselsData
    vesselGPSData.value = gpsData
    sosVessels.value = sosData
    summary.value = summaryData
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

// Refresh data
async function refreshData() {
  await loadDashboardData()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-tenang-primary dark:text-tenang-primary-dark mb-2">
          Port Monitoring Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Real-time monitoring of port sensors and vessel data
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-tenang-primary"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <div class="text-red-600 dark:text-red-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
              Error loading data
            </h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">
              Please check your database connections and try again.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Vessels -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vessels</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.totalVessels }}</p>
              </div>
            </div>
          </div>

          <!-- GPS Data Points -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">GPS Data Points</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ vesselGPSData.length }}</p>
              </div>
            </div>
          </div>

          <!-- SOS Alerts -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">SOS Alerts</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ sosVessels.length }}</p>
              </div>
            </div>
          </div>

          <!-- Container Vessels -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Container Vessels</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ summary.vesselsByType.container }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vessel GPS Data Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent GPS Data -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent GPS Data</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  Live
                </span>
              </div>
            </div>
            
            <div v-if="vesselGPSData.length > 0" class="space-y-3">
              <div 
                v-for="(data, index) in vesselGPSData.slice(0, 5)" 
                :key="index"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ data.device_id }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    {{ data.latitude.toFixed(6) }}, {{ data.longitude.toFixed(6) }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ new Date(data.timestamp).toLocaleTimeString() }}
                  </div>
                  <div v-if="data.sos_signal" class="text-xs text-red-600 font-medium">
                    SOS
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No GPS data available</p>
            </div>
          </div>

          <!-- SOS Alerts -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">SOS Alerts</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ sosVessels.length }} Active
                </span>
              </div>
            </div>
            
            <div v-if="sosVessels.length > 0" class="space-y-3">
              <div 
                v-for="(vessel, index) in sosVessels.slice(0, 5)" 
                :key="index"
                class="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium text-red-900 dark:text-red-400 text-sm">
                    {{ vessel.device_id }}
                  </div>
                  <div class="text-xs text-red-600 dark:text-red-400 font-medium">
                    SOS ACTIVE
                  </div>
                </div>
                <div class="text-xs text-red-800 dark:text-red-300 mt-1">
                  {{ vessel.latitude.toFixed(6) }}, {{ vessel.longitude.toFixed(6) }}
                </div>
                <div class="text-xs text-red-600 dark:text-red-400 mt-1">
                  {{ new Date(vessel.timestamp).toLocaleString() }}
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No SOS alerts</p>
            </div>
          </div>
        </div>

        <!-- Vessels Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vessels</h3>
            <button
              @click="refreshData"
              class="px-4 py-2 bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded-md hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          
          <div v-if="vessels.length > 0" class="space-y-4">
            <div 
              v-for="vessel in vessels" 
              :key="vessel.device_id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ vessel.device_id }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ vessel.vessel_type }} • HIN: {{ vessel.hull_identification_number }}
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ vessel.vessel_type }}
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No vessels found</p>
          </div>
        </div>

        <!-- Vessel Types Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Vessel Types</h3>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div 
              v-for="(count, type) in summary.vesselsByType" 
              :key="type"
              class="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ count }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ type }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
