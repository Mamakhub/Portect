// PostgreSQL data types for vessel information

export interface Vessel {
  deviceid: string // Primary key
  hullidentificationnumber: string
  vesseltype: string
  created_at?: string
  updated_at?: string
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
