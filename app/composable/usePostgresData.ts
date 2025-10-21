import { computed, ref } from 'vue'
import type { PostgresQuery, PostgresResponse, Vessel } from '~/types/postgres'

// Reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const lastUpdate = ref<string | null>(null)

export function usePostgresData() {
  // Fetch data from PostgreSQL
  async function fetchData(query: PostgresQuery): Promise<PostgresResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/postgres/query', {
        method: 'POST',
        body: query
      }) as PostgresResponse

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch data from PostgreSQL')
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

  // Get all vessels
  async function getVessels(): Promise<Vessel[]> {
    const query: PostgresQuery = {
      table: 'Vessel',
      order_by: 'hullidentificationnumber ASC'
    }

    const response = await fetchData(query)
    return response.data as Vessel[]
  }

  // Get vessel by device ID
  async function getVesselByDeviceId(deviceId: string): Promise<Vessel | null> {
    const query: PostgresQuery = {
      table: 'Vessel',
      where: { deviceid: deviceId },
      limit: 1
    }

    const response = await fetchData(query)
    return response.data[0] as Vessel || null
  }

  // Get vessels by type
  async function getVesselsByType(vesselType: string): Promise<Vessel[]> {
    const query: PostgresQuery = {
      table: 'Vessel',
      where: { vesseltype: vesselType },
      order_by: 'hullidentificationnumber ASC'
    }

    const response = await fetchData(query)
    return response.data as Vessel[]
  }

  // Get dashboard summary
  async function getDashboardSummary() {
    const vessels = await getVessels()

    return {
      totalVessels: vessels.length,
      vesselsByType: {
        'Cargo Ship': vessels.filter(v => v.vesseltype === 'Cargo Ship').length,
        'Container Ship': vessels.filter(v => v.vesseltype === 'Container Ship').length,
        'Tanker': vessels.filter(v => v.vesseltype === 'Tanker').length,
        'Passenger': vessels.filter(v => v.vesseltype === 'Passenger').length,
        'Fishing': vessels.filter(v => v.vesseltype === 'Fishing').length,
        'Tug': vessels.filter(v => v.vesseltype === 'Tug').length
      }
    }
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
    getVessels,
    getVesselByDeviceId,
    getVesselsByType,
    getDashboardSummary
  }
}
