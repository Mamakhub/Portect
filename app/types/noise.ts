export interface NoiseDataPoint {
  timestamp: string
  noise_level: number
  location: string
  device_id: string
}

export interface ChartDataPoint {
  x: string
  y: number
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter'
  color: string
  backgroundColor?: string
  borderColor?: string
  fill?: boolean
}
