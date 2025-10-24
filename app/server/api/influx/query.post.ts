import type { InfluxQuery, InfluxResponse } from '~/types/influx'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as InfluxQuery

    // InfluxDB configuration
    const config = useRuntimeConfig()
    const INFLUX_URL = config.influxUrl
    const INFLUX_TOKEN = config.influxToken
    const INFLUX_ORG = config.influxOrg
    const INFLUX_BUCKET = config.influxBucket

    // Build InfluxDB query for vessel GPS data
    let fluxQuery = `from(bucket: "${INFLUX_BUCKET}")`
    fluxQuery += ` |> range(start: ${body.start_time || '-7d'}, stop: ${body.end_time || 'now()'})`
    
    if (body.device_id) {
      fluxQuery += ` |> filter(fn: (r) => r.device_id == "${body.device_id}")`
    }

    fluxQuery += ` |> filter(fn: (r) => r._field =~ /^(longitude|latitude|altitude|priority|sos_signal)$/)`
    fluxQuery += ` |> pivot(rowKey:["_time", "device_id"], columnKey: ["_field"], valueColumn: "_value")`
    fluxQuery += ` |> sort(columns: ["_time"])`

    if (body.limit) {
      fluxQuery += ` |> limit(n: ${body.limit})`
    }

    if (body.offset) {
      fluxQuery += ` |> offset(n: ${body.offset})`
    }

    // Make request to InfluxDB
    const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${INFLUX_TOKEN}`,
        'Content-Type': 'application/vnd.flux',
        'Accept': 'application/csv'
      },
      body: fluxQuery
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('InfluxDB Response Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      // Provide more specific error messages based on status code
      let errorMessage = 'InfluxDB connection error: '
      if (response.status === 401) {
        errorMessage += 'Authentication failed. Please check your InfluxDB token.'
      } else if (response.status === 404) {
        errorMessage += 'Bucket not found. Please verify your InfluxDB bucket configuration.'
      } else if (response.status === 503) {
        errorMessage += 'InfluxDB service unavailable. The database may be down or unreachable.'
      } else {
        errorMessage += `${response.status} ${response.statusText}`
      }
      
      throw new Error(errorMessage)
    }

    const csvData = await response.text()
    const data = parseInfluxCSV(csvData)

    const result: InfluxResponse = {
      data,
      total: data.length,
      success: true
    }

    return result
  } catch (error) {
    console.error('InfluxDB query error:', error)
    
    // Distinguish between network errors and other errors
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot reach InfluxDB server. Please check your network connection and InfluxDB URL configuration.'
      } else {
        errorMessage = error.message
      }
    }
    
    const result: InfluxResponse = {
      data: [],
      total: 0,
      success: false,
      error: errorMessage
    }

    return result
  }
})

function parseInfluxCSV(csvData: string): any[] {
  const lines = csvData.trim().split('\n')
  if (lines.length < 2) return []

  const data = []
  let currentHeaders: string[] = []
  let tableCount = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip empty lines and annotation lines (starting with #)
    if (!line || line.startsWith('#')) continue
    
    const values = line.split(',')
    
    // Check if this is a header row (contains field names like _time, device_id, etc.)
    // Header rows contain these known field names
    const isHeaderRow = line.includes('_time') || (line.includes('result') && line.includes('table') && i < 5)
    
    if (isHeaderRow) {
      // This is a new table with new headers
      currentHeaders = values.map(h => h.trim())
      tableCount++
      continue
    }
    
    // This is a data row - parse it with current headers
    if (currentHeaders.length === 0) continue
    
    const row: any = {}
    
    currentHeaders.forEach((header, index) => {
      const value = values[index]?.trim()
      if (value && value !== '' && value !== 'null') {
        if (header === '_time') {
          row.timestamp = value
        } else if (header === 'device_id') {
          row.device_id = value
        } else if (header === 'longitude') {
          row.longitude = parseFloat(value)
        } else if (header === 'latitude') {
          row.latitude = parseFloat(value)
        } else if (header === 'altitude') {
          row.altitude = parseFloat(value)
        } else if (header === 'priority') {
          row.priority = parseFloat(value)
        } else if (header === 'sos_signal') {
          row.sos_signal = value === 'true' || value === 'True'
        }
      }
    })

    // Only include rows with valid GPS coordinates
    if (row.timestamp && row.device_id && row.longitude !== undefined && row.latitude !== undefined) {
      data.push({
        timestamp: row.timestamp,
        device_id: row.device_id,
        longitude: row.longitude || 0,
        latitude: row.latitude || 0,
        altitude: row.altitude || 0,
        priority: row.priority !== undefined ? row.priority : 0,
        sos_signal: row.sos_signal || false
      })
    }
  }

  return data
}
