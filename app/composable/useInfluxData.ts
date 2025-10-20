import { computed, ref } from 'vue'
import type { InfluxQuery, InfluxResponse, VesselGPSData } from '~/types/influx'

// Configuration
const INFLUX_URL = process.env.INFLUX_URL || 'http://localhost:8086'
const INFLUX_TOKEN = process.env.INFLUX_TOKEN || ''
const INFLUX_ORG = process.env.INFLUX_ORG || 'portect'
const INFLUX_BUCKET = process.env.INFLUX_BUCKET || 'vessel_data'

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
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000)

    const query: InfluxQuery = {
      device_id: deviceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      limit: 1000
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

  // Get all vessel GPS data
  async function getAllVesselGPSData(hours: number = 24): Promise<VesselGPSData[]> {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000)

    const query: InfluxQuery = {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      limit: 1000
    }

    const response = await fetchData(query)
    return response.data as VesselGPSData[]
  }

  // Get vessels with SOS signal active
  async function getVesselsWithSOS(): Promise<VesselGPSData[]> {
    const query: InfluxQuery = {
      limit: 100
    }

    const response = await fetchData(query)
    const allData = response.data as VesselGPSData[]
    
    // Filter for vessels with SOS signal active
    return allData.filter(data => data.sos_signal === true)
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
    getVesselsWithSOS
  }
}
