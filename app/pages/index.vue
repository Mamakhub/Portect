<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useInfluxData } from '~/composable/useInfluxData'
import { usePostgresData } from '~/composable/usePostgresData'

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
  getGPSDataByDevice,
  getVesselsWithSOS,
  getLatestSOSByDevice,
  getLatestTimestamp,
  loading: influxLoading,
  hasError: influxError,
  errorMessage: influxErrorMessage,
  isConnectionError: influxConnectionError
} = useInfluxData()

const { 
  getVessels, 
  getVesselByDeviceId, 
  getVesselsByType,
  loading: postgresLoading,
  hasError: postgresError 
} = usePostgresData()

// Reactive data
const vessels = ref<any[]>([])
const vesselGPSData = ref<any[]>([])
const gpsDataByDevice = ref<Record<string, any[]>>({})
const sosVessels = ref<any[]>([])
const sosDataByDevice = ref<Record<string, any>>({})

// Loading states
const influxDataLoaded = ref(false)
const postgresDataLoaded = ref(false)

// Device selection for GPS data
const selectedDevice = ref<string>('summary') // 'summary' or specific device ID
const selectedTimeRange = ref<number>(24) // Hours to query (1, 6, 12, 24)

// Auto-refresh state
const lastKnownTimestamp = ref<string | null>(null)
const refreshInterval = ref<NodeJS.Timeout | null>(null)

// Computed properties
const loading = computed(() => !postgresDataLoaded.value || !influxDataLoaded.value)
const postgresDataAvailable = computed(() => postgresDataLoaded.value && !postgresError.value && vessels.value.length > 0)
const influxDataAvailable = computed(() => influxDataLoaded.value && !influxError.value && (vesselGPSData.value.length > 0 || sosVessels.value.length > 0))

// Calculate summary from vessels data (no extra database query needed)
const summary = computed(() => {
  return {
    totalVessels: vessels.value.length,
    vesselsByType: {
      'Cargo Ship': vessels.value.filter(v => v.vesseltype === 'Cargo Ship').length,
      'Container Ship': vessels.value.filter(v => v.vesseltype === 'Container Ship').length,
      'Tanker': vessels.value.filter(v => v.vesseltype === 'Tanker').length,
      'Passenger': vessels.value.filter(v => v.vesseltype === 'Passenger').length,
      'Fishing': vessels.value.filter(v => v.vesseltype === 'Fishing').length,
      'Tug': vessels.value.filter(v => v.vesseltype === 'Tug').length
    }
  }
})

// Available devices for dropdown
const availableDevices = computed(() => {
  return Object.keys(gpsDataByDevice.value).sort()
})

// Device color mapping for visual distinction
const deviceColors: Record<string, { bg: string, text: string, border: string }> = {
  '10010': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700' },
  '24108': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700' },
  '63876': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-700' }
}

// Get color for a device (with fallback)
function getDeviceColor(deviceId: string) {
  return deviceColors[deviceId] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-300 dark:border-gray-700' }
}

// Filtered GPS data based on selected device
const displayedGPSData = computed(() => {
  if (selectedDevice.value === 'summary') {
    // Show all devices combined, sorted by most recent timestamp
    return [...vesselGPSData.value].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } else {
    // Show specific device data, sorted by most recent timestamp
    return gpsDataByDevice.value[selectedDevice.value] || []
  }
})

// Load data on mount and start auto-refresh
onMounted(async () => {
  await loadDashboardData()
  startAutoRefresh()
})

// Clean up interval on unmount
onBeforeUnmount(() => {
  stopAutoRefresh()
})

async function loadDashboardData() {
  // Reset loading states
  postgresDataLoaded.value = false
  influxDataLoaded.value = false

  // Load both PostgreSQL and InfluxDB data in parallel
  await Promise.allSettled([
    loadPostgresData(),
    loadInfluxData()
  ])
}

async function loadPostgresData() {
  try {
    const vesselsData = await getVessels()
    vessels.value = vesselsData
    postgresDataLoaded.value = true
  } catch (error) {
    console.error('Failed to load PostgreSQL data:', error)
    postgresDataLoaded.value = true // Mark as loaded even if failed
  }
}

async function loadInfluxData() {
  try {
    const allData = await getAllVesselGPSData(selectedTimeRange.value) // Query for selected time range
    
    // GPS data for the selected time range
    vesselGPSData.value = allData
    
    // GPS data grouped by device
    const byDevice: Record<string, any[]> = {}
    vesselGPSData.value.forEach(data => {
      if (!byDevice[data.device_id]) {
        byDevice[data.device_id] = []
      }
      byDevice[data.device_id].push(data)
    })
    // Sort each device's data by timestamp (newest first)
    Object.keys(byDevice).forEach(deviceId => {
      byDevice[deviceId].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    })
    gpsDataByDevice.value = byDevice
    
    // All SOS alerts (last 24 hours - always query 24 hours for SOS)
    const sosData = selectedTimeRange.value >= 24 ? allData : await getAllVesselGPSData(24)
    sosVessels.value = sosData
      .filter(d => d.sos_signal === true)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // Latest SOS per device
    const latestSOSByDevice: Record<string, any> = {}
    sosVessels.value.forEach(data => {
      if (!latestSOSByDevice[data.device_id]) {
        latestSOSByDevice[data.device_id] = data
      }
    })
    sosDataByDevice.value = latestSOSByDevice
    
    // Track the latest timestamp for auto-refresh
    if (allData.length > 0) {
      const timestamps = allData.map(d => new Date(d.timestamp).getTime())
      const latestTime = Math.max(...timestamps)
      lastKnownTimestamp.value = new Date(latestTime).toISOString()
    }
    
    influxDataLoaded.value = true
  } catch (error) {
    console.error('InfluxDB connection failed:', error)
    influxDataLoaded.value = true // Mark as loaded even if failed
  }
}

// Refresh data
async function refreshData() {
  await loadDashboardData()
}

// Reload GPS data when time range changes
async function onTimeRangeChange() {
  influxDataLoaded.value = false
  await loadInfluxData()
}

// Check for new data (lightweight query)
async function checkForNewData() {
  if (!influxDataLoaded.value) return // Don't check if initial load isn't complete
  
  try {
    const latestTimestamp = await getLatestTimestamp()
    
    if (!latestTimestamp) return // No data available
    
    // If this is the first check, just store the timestamp
    if (!lastKnownTimestamp.value) {
      lastKnownTimestamp.value = latestTimestamp
      return
    }
    
    // Compare timestamps
    const latest = new Date(latestTimestamp).getTime()
    const lastKnown = new Date(lastKnownTimestamp.value).getTime()
    
    // If there's new data, reload
    if (latest > lastKnown) {
      await loadInfluxData()
    }
  } catch (error) {
    console.error('Failed to check for new data:', error)
  }
}

// Start auto-refresh
function startAutoRefresh() {
  // Clear any existing interval
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
  
  // Check for new data every 5 seconds
  refreshInterval.value = setInterval(() => {
    checkForNewData()
  }, 5000)
}

// Stop auto-refresh
function stopAutoRefresh() {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
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
      <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-tenang-primary"></div>
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard data...</p>
          <div class="mt-2 space-y-1">
            <p class="text-sm text-gray-500 dark:text-gray-500">
              <span v-if="!postgresDataLoaded">⏳ Loading vessel information...</span>
              <span v-else class="text-green-600 dark:text-green-400">✓ Vessel data loaded</span>
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              <span v-if="!influxDataLoaded">⏳ Loading GPS & sensor data...</span>
              <span v-else class="text-green-600 dark:text-green-400">✓ GPS data loaded</span>
            </p>
          </div>
        </div>
      </div>

      <!-- PostgreSQL Error State -->
      <div v-else-if="!postgresDataAvailable" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div class="flex items-center">
          <div class="text-red-600 dark:text-red-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
              Database Connection Error
            </h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">
              Unable to connect to PostgreSQL database. Please check your database connection and try again.
            </p>
            <button
              @click="refreshData"
              class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- InfluxDB Warning Banner - Only show if loaded but no data -->
        <div v-if="influxDataLoaded && !influxDataAvailable && !influxError" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="text-yellow-600 dark:text-yellow-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                No GPS Data Available
              </h3>
              <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                ✓ Successfully connected to InfluxDB, but no GPS readings found in the selected time range (last {{ selectedTimeRange }} hour{{ selectedTimeRange > 1 ? 's' : '' }}). Vessel information is still available below.
              </p>
            </div>
          </div>
        </div>
        
        <!-- InfluxDB Error Banner -->
        <div v-if="influxDataLoaded && influxError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <div class="text-red-600 dark:text-red-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
                InfluxDB Connection Error
              </h3>
              <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                {{ influxErrorMessage || 'Could not connect to InfluxDB.' }} Real-time GPS tracking and SOS alerts are currently unavailable.
              </p>
              <button
                @click="refreshData"
                class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" :class="!influxDataAvailable ? 'opacity-60' : ''">
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
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ influxDataAvailable ? vesselGPSData.length : 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- SOS Alerts -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" :class="!influxDataAvailable ? 'opacity-60' : ''">
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
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ influxDataAvailable ? sosVessels.length : 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vessel GPS Data Section -->
        <div class="grid grid-cols-1 gap-6">
          <!-- GPS Data with Device Selection -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Recent GPS Data (Last {{ selectedTimeRange }} Hour{{ selectedTimeRange > 1 ? 's' : '' }})
              </h3>
              <div class="flex items-center space-x-4">
                <!-- Time Range Selector -->
                <select 
                  v-model.number="selectedTimeRange"
                  @change="onTimeRangeChange"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-tenang-primary dark:focus:ring-tenang-primary-dark"
                >
                  <option :value="1">⏱️ Last 1 Hour</option>
                  <option :value="6">⏱️ Last 6 Hours</option>
                  <option :value="12">⏱️ Last 12 Hours</option>
                  <option :value="24">⏱️ Last 24 Hours</option>
                </select>
                
                <!-- Device Selector -->
                <select 
                  v-model="selectedDevice"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-tenang-primary dark:focus:ring-tenang-primary-dark"
                >
                  <option value="summary">📊 Summary (All Devices)</option>
                  <option v-for="deviceId in availableDevices" :key="deviceId" :value="deviceId">
                    {{ deviceId === '10010' ? '🔵' : deviceId === '24108' ? '🟣' : '🟢' }} Device {{ deviceId }}
                  </option>
                </select>
                
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ availableDevices.length }} Devices
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Summary View (All Devices Sorted by Priority) -->
            <div v-if="selectedDevice === 'summary' && displayedGPSData.length > 0">
              
              <!-- Scrollable container -->
              <div class="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                <div 
                  v-for="(data, index) in displayedGPSData" 
                  :key="index"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="px-2 py-1 text-xs font-semibold rounded-md border"
                            :class="`${getDeviceColor(data.device_id).bg} ${getDeviceColor(data.device_id).text} ${getDeviceColor(data.device_id).border}`">
                        🚢 Device {{ data.device_id }}
                      </span>
                      <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                            :class="data.priority === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                    data.priority === 2 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'">
                        Priority {{ data.priority }}
                      </span>
                      <span v-if="data.sos_signal" class="text-xs text-red-600 dark:text-red-400 font-medium">
                        🚨 SOS
                      </span>
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      Lat: {{ data.latitude.toFixed(6) }}, Lon: {{ data.longitude.toFixed(6) }}, Alt: {{ data.altitude.toFixed(2) }}m
                    </div>
                  </div>
                  <div class="text-right text-xs text-gray-500 dark:text-gray-400">
                    {{ new Date(data.timestamp).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Individual Device View -->
            <div v-else-if="selectedDevice !== 'summary' && displayedGPSData.length > 0">
              
              <!-- Scrollable container -->
              <div class="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                <div 
                  v-for="(data, index) in displayedGPSData" 
                  :key="index"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                            :class="data.priority === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                    data.priority === 2 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'">
                        Priority {{ data.priority }}
                      </span>
                      <span v-if="data.sos_signal" class="text-xs text-red-600 dark:text-red-400 font-medium">
                        🚨 SOS
                      </span>
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      Lat: {{ data.latitude.toFixed(6) }}, Lon: {{ data.longitude.toFixed(6) }}, Alt: {{ data.altitude.toFixed(2) }}m
                    </div>
                  </div>
                  <div class="text-right text-xs text-gray-500 dark:text-gray-400">
                    {{ new Date(data.timestamp).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div v-if="influxError" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                </svg>
                <p class="text-sm font-medium">Connection Error</p>
                <p class="text-xs">Real-time GPS data unavailable</p>
              </div>
              <p v-else>📭 No GPS data available in the selected time range</p>
            </div>
          </div>
        </div>

        <!-- SOS Alerts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- SOS Alerts - All Alerts -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent SOS Alerts (Last 24 Hours)</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ sosVessels.length }} Total
                </span>
              </div>
            </div>
            
            <!-- Scrollable SOS Alerts Container -->
            <div v-if="sosVessels.length > 0" class="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              <div 
                v-for="(vessel, index) in sosVessels" 
                :key="index"
                class="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium text-red-900 dark:text-red-400 text-sm">
                    Device {{ vessel.device_id }}
                  </div>
                  <div class="text-xs text-red-600 dark:text-red-400 font-medium">
                    🚨 SOS
                  </div>
                </div>
                <div class="text-xs text-red-800 dark:text-red-300 mt-1">
                  Lat: {{ vessel.latitude.toFixed(6) }}, Lon: {{ vessel.longitude.toFixed(6) }}
                </div>
                <div class="text-xs text-red-600 dark:text-red-400 mt-1">
                  {{ new Date(vessel.timestamp).toLocaleString() }}
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div v-if="influxError" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                </svg>
                <p class="text-sm font-medium">Connection Error</p>
                <p class="text-xs">Real-time SOS monitoring unavailable</p>
              </div>
              <p v-else>✅ No SOS alerts in the last 24 hours</p>
            </div>
          </div>

          <!-- Latest SOS by Device -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Latest SOS by Device</h3>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ Object.keys(sosDataByDevice).length }} Devices
                </span>
              </div>
            </div>
            
            <!-- Scrollable Latest SOS Container -->
            <div v-if="Object.keys(sosDataByDevice).length > 0" class="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              <div 
                v-for="(vessel, deviceId) in sosDataByDevice" 
                :key="deviceId"
                class="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium text-red-900 dark:text-red-400 text-sm">
                    Device {{ deviceId }}
                  </div>
                  <div class="text-xs text-red-600 dark:text-red-400 font-medium">
                    🚨 LATEST SOS
                  </div>
                </div>
                <div class="text-xs text-red-800 dark:text-red-300 mt-1">
                  Lat: {{ vessel.latitude.toFixed(6) }}, Lon: {{ vessel.longitude.toFixed(6) }}
                </div>
                <div class="text-xs text-red-600 dark:text-red-400 mt-1">
                  {{ new Date(vessel.timestamp).toLocaleString() }}
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div v-if="influxError" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                </svg>
                <p class="text-sm font-medium">Connection Error</p>
                <p class="text-xs">Real-time SOS monitoring unavailable</p>
              </div>
              <p v-else>✅ No SOS alerts from any device</p>
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
              :key="vessel.deviceid"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ vessel.deviceid }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ vessel.vesseltype }} • HIN: {{ vessel.hullidentificationnumber }}
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ vessel.vesseltype }}
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
