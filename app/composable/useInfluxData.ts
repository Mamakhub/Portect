import { computed, ref } from 'vue'
import type { InfluxQuery, InfluxResponse, VesselGPSData } from '~/types/influx'

// Configuration - These are now managed in nuxt.config.ts and server-side
// The composable uses the API endpoints which handle the actual InfluxDB connection

// Reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const lastUpdate = ref<string | null>(null)
const connectionError = ref(false) // Track if it's a connection error vs just no data

export function useInfluxData() {
  // Fetch data from InfluxDB
  async function fetchData(query: InfluxQuery): Promise<InfluxResponse> {
    isLoading.value = true
    error.value = null
    connectionError.value = false

    try {
      const response = await $fetch('/api/influx/query', {
        method: 'POST',
        body: query
      }) as InfluxResponse

      if (!response.success) {
        connectionError.value = true
        throw new Error(response.error || 'Failed to fetch data from InfluxDB')
      }

      lastUpdate.value = new Date().toISOString()
      return response
    } catch (err) {
      connectionError.value = true
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      return {
        data: [],
        total: 0,
        success: false,
        error: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  // Get vessel GPS data
  async function getVesselGPSData(deviceId?: string, hours: number = 24): Promise<VesselGPSData[]> {
    const query: InfluxQuery = {
      device_id: deviceId,
      start_time: `-${hours}h`,
      end_time: 'now()',
      limit: 5000
    }

    const response = await fetchData(query)
    return response.data as VesselGPSData[]
  }

  // Get latest GPS reading for a vessel
  async function getLatestGPSReading(deviceId: string): Promise<VesselGPSData | null> {
    const query: InfluxQuery = {
      device_id: deviceId,
      limit: 1
    }

    const response = await fetchData(query)
    return response.data[0] as VesselGPSData || null
  }

  // Get all vessel GPS data (no filtering - get everything)
  async function getAllVesselGPSData(hours: number = 24): Promise<VesselGPSData[]> {
    const query: InfluxQuery = {
      start_time: `-${hours}h`,
      end_time: 'now()',
      limit: 10000 // Increased limit since we're doing one query for everything
    }

    const response = await fetchData(query)
    return response.data as VesselGPSData[]
  }

  // Get only the most recent GPS data (for incremental updates)
  async function getRecentGPSData(seconds: number = 30): Promise<VesselGPSData[]> {
    const query: InfluxQuery = {
      start_time: `-${seconds}s`,
      end_time: 'now()',
      limit: 1000 // Should be plenty for 30 seconds of data
    }

    const response = await fetchData(query)
    return response.data as VesselGPSData[]
  }

  // Get GPS data grouped by device ID
  async function getGPSDataByDevice(hours: number = 24): Promise<Record<string, VesselGPSData[]>> {
    const allData = await getAllVesselGPSData(hours)
    
    // Group by device_id
    const grouped: Record<string, VesselGPSData[]> = {}
    allData.forEach(data => {
      if (!grouped[data.device_id]) {
        grouped[data.device_id] = []
      }
      grouped[data.device_id].push(data)
    })
    
    // Sort each device's data by timestamp (newest first)
    Object.keys(grouped).forEach(deviceId => {
      grouped[deviceId].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    })
    
    return grouped
  }

  // Get vessels with SOS signal active (last 24 hours)
  async function getVesselsWithSOS(hours: number = 24): Promise<VesselGPSData[]> {
    const query: InfluxQuery = {
      start_time: `-${hours}h`,
      end_time: 'now()',
      limit: 5000
    }

    const response = await fetchData(query)
    const sosData = (response.data as VesselGPSData[]).filter(d => d.sos_signal === true)
    
    // Filter and sort by timestamp (newest first)
    return sosData.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // Get latest SOS alerts per device
  async function getLatestSOSByDevice(hours: number = 24): Promise<Record<string, VesselGPSData>> {
    const sosData = await getVesselsWithSOS(hours)
    
    // Get only the most recent SOS for each device
    const latestByDevice: Record<string, VesselGPSData> = {}
    sosData.forEach(data => {
      if (!latestByDevice[data.device_id]) {
        latestByDevice[data.device_id] = data
      }
    })
    
    return latestByDevice
  }

  // Lightweight check: Get only the latest timestamp to see if there's new data
  async function getLatestTimestamp(): Promise<string | null> {
    try {
      const query: InfluxQuery = {
        start_time: '-1h', // Only check last hour for performance
        end_time: 'now()',
        limit: 1 // Only get the most recent point
      }

      const response = await fetchData(query)
      if (response.data && response.data.length > 0) {
        return response.data[0].timestamp
      }
      return null
    } catch (err) {
      console.error('Failed to check for new data:', err)
      return null
    }
  }

  // Computed properties
  const loading = computed(() => isLoading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)
  const isConnectionError = computed(() => connectionError.value)

  return {
    // State
    loading,
    hasError,
    errorMessage,
    isConnectionError,
    lastUpdate,

    // Methods
    fetchData,
    getVesselGPSData,
    getLatestGPSReading,
    getAllVesselGPSData,
    getRecentGPSData,
    getGPSDataByDevice,
    getVesselsWithSOS,
    getLatestSOSByDevice,
    getLatestTimestamp
  }
}
