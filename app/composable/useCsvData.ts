import { computed, ref } from 'vue'
import type { ChartDataPoint, NoiseDataPoint } from '~/types/noise'

export function useCsvData() {
  const data = ref<NoiseDataPoint[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const parseCsv = (csvText: string): NoiseDataPoint[] => {
    const lines = csvText.trim().split('\n')

    if (lines.length < 2) {
      console.error('CSV file has no data rows')
      return []
    }

    const headers = lines[0].split(',')
    console.log('CSV headers:', headers)

    const parsedData = lines.slice(1).map((line, index) => {
      const values = line.split(',')

      if (values.length < 4) {
        console.warn(`Line ${index + 1} has insufficient values:`, values)
        return null
      }

      const timestamp = values[0].trim()
      const noiseLevel = Number.parseFloat(values[1].trim())
      const location = values[2].trim()
      const deviceId = values[3].trim()

      if (Number.isNaN(noiseLevel)) {
        console.warn(`Invalid noise level in line ${index + 1}:`, values[1])
        return null
      }

      return {
        timestamp,
        noise_level: noiseLevel,
        location,
        device_id: deviceId,
      }
    }).filter(item => item !== null) as NoiseDataPoint[]

    console.log('Parsed data count:', parsedData.length)
    return parsedData
  }

  const loadCsvData = async (filePath: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching CSV from:', filePath)
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to load CSV file: ${response.statusText}`)
      }

      const csvText = await response.text()
      console.log('CSV text received:', `${csvText.substring(0, 200)}...`)
      const parsedData = parseCsv(csvText)
      console.log('Parsed data:', parsedData.slice(0, 3))
      data.value = parsedData
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load CSV data'
      console.error('Error loading CSV data:', err)
    }
    finally {
      loading.value = false
    }
  }

  const chartData = computed((): ChartDataPoint[] => {
    if (data.value.length === 0) {
      return []
    }

    return data.value.map((item, index) => {
      const date = new Date(item.timestamp)
      const isValidDate = !Number.isNaN(date.getTime())

      if (!isValidDate) {
        console.warn(`Invalid date for item ${index}:`, item.timestamp)
        return { x: `Time ${index}`, y: item.noise_level }
      }

      return {
        x: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        y: item.noise_level,
      }
    })
  })

  const averageNoiseLevel = computed(() => {
    if (data.value.length === 0)
      return 0
    const sum = data.value.reduce((acc, item) => acc + item.noise_level, 0)
    return Math.round((sum / data.value.length) * 10) / 10
  })

  const maxNoiseLevel = computed(() => {
    if (data.value.length === 0)
      return 0
    return Math.max(...data.value.map(item => item.noise_level))
  })

  const minNoiseLevel = computed(() => {
    if (data.value.length === 0)
      return 0
    return Math.min(...data.value.map(item => item.noise_level))
  })

  const noiseLevelStatus = computed(() => {
    const avg = averageNoiseLevel.value
    if (avg < 50)
      return { status: 'Low', color: 'green' }
    if (avg < 70)
      return { status: 'Moderate', color: 'yellow' }
    return { status: 'High', color: 'red' }
  })

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    chartData,
    averageNoiseLevel,
    maxNoiseLevel,
    minNoiseLevel,
    noiseLevelStatus,
    loadCsvData,
  }
}
