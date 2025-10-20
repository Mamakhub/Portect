// PostgreSQL data types for vessel information

export interface Vessel {
  device_id: string // Primary key
  hull_identification_number: string
  vessel_type: 'container' | 'bulk' | 'tanker' | 'passenger' | 'fishing' | 'tug'
}

export interface PostgresQuery {
  table: string
  where?: Record<string, any>
  order_by?: string
  limit?: number
  offset?: number
}

export interface PostgresResponse<T = any> {
  data: T[]
  total: number
  success: boolean
  error?: string
}
