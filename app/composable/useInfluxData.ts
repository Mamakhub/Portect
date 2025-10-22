import { computed, ref } from 'vue'
import type { InfluxQuery, InfluxResponse, VesselGPSData } from '~/types/influx'

// Configuration - These are now managed in nuxt.config.ts and server-side
// The composable uses the API endpoints which handle the actual InfluxDB connection

// Reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const lastUpdate = ref<string | null>(null)

export function useInfluxData() {
  // Fetch data from InfluxDB
  async function fetchData(query: InfluxQuery): Promise<InfluxResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/influx/query', {
        method: 'POST',
        body: query
      }) as InfluxResponse

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch data from InfluxDB')
      }

      lastUpdate.value = new Date().toISOString()
      return response
    } catch (err) {
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
      limit: 5000,
      sos_only: true  // Filter directly in InfluxDB query
    }

    const response = await fetchData(query)
    const sosData = response.data as VesselGPSData[]
    
    // Data is already filtered by InfluxDB, just sort by timestamp (newest first)
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

  // Computed properties
  const loading = computed(() => isLoading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)

  return {
    // State
    loading,
    hasError,
    errorMessage,
    lastUpdate,

    // Methods
    fetchData,
    getVesselGPSData,
    getLatestGPSReading,
    getAllVesselGPSData,
    getGPSDataByDevice,
    getVesselsWithSOS,
    getLatestSOSByDevice
  }
}
