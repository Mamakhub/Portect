// Re-export all types
export * from './dust'
export * from './influx'
export * from './noise'
export * from './postgres'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string, label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export type Theme = 'light' | 'dark' | 'system'
