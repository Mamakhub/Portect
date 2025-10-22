// InfluxDB time series data types for vessel GPS data

export interface VesselGPSData {
  timestamp: string
  device_id: string
  longitude: number
  latitude: number
  altitude: number
  priority: number
  sos_signal: boolean
}

export interface InfluxQuery {
  device_id?: string
  start_time?: string
  end_time?: string
  limit?: number
  offset?: number
  sos_only?: boolean  // Filter for SOS signals only
}

export interface InfluxResponse<T = VesselGPSData> {
  data: T[]
  total: number
  success: boolean
  error?: string
}
