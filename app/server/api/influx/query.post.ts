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

    // Debug logging
    console.log('InfluxDB Config:', {
      url: INFLUX_URL,
      org: INFLUX_ORG,
      bucket: INFLUX_BUCKET,
      tokenLength: INFLUX_TOKEN?.length || 0
    })

    // Build InfluxDB query for vessel GPS data
    let fluxQuery = `from(bucket: "${INFLUX_BUCKET}")`
    fluxQuery += ` |> range(start: ${body.start_time || '-7d'}, stop: ${body.end_time || 'now()'})`
    
    if (body.device_id) {
      fluxQuery += ` |> filter(fn: (r) => r.device_id == "${body.device_id}")`
    }

    fluxQuery += ` |> filter(fn: (r) => r._field =~ /^(longitude|latitude|altitude|priority|sos_signal)$/)`
    fluxQuery += ` |> pivot(rowKey:["_time", "device_id"], columnKey: ["_field"], valueColumn: "_value")`
    
    // Filter for SOS signals only if requested
    if (body.sos_only) {
      fluxQuery += ` |> filter(fn: (r) => r.sos_signal == true)`
    }
    
    fluxQuery += ` |> sort(columns: ["_time"])`

    if (body.limit) {
      fluxQuery += ` |> limit(n: ${body.limit})`
    }

    if (body.offset) {
      fluxQuery += ` |> offset(n: ${body.offset})`
    }

    // Log the Flux query for debugging
    console.log('Flux Query:', fluxQuery)

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
      throw new Error(`InfluxDB error: ${response.status} ${response.statusText} - ${errorText}`)
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
    
    const result: InfluxResponse = {
      data: [],
      total: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }

    return result
  }
})

function parseInfluxCSV(csvData: string): any[] {
  const lines = csvData.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',')
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const row: any = {}

    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      if (value && value !== '') {
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
          row.priority = parseInt(value)
        } else if (header === 'sos_signal') {
          row.sos_signal = value === 'true'
        }
      }
    })

    if (row.timestamp && row.device_id && row.longitude !== undefined && row.latitude !== undefined) {
      data.push({
        timestamp: row.timestamp,
        device_id: row.device_id,
        longitude: row.longitude || 0,
        latitude: row.latitude || 0,
        altitude: row.altitude || 0,
        priority: row.priority || 0,
        sos_signal: row.sos_signal || false
      })
    }
  }

  return data
}
