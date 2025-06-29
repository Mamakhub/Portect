import type { DustDataPoint } from './dust'
import type { NoiseDataPoint } from './noise'

// Re-export the imported types
export type { DustDataPoint, NoiseDataPoint }

export interface ConstructionSite {
  id: string
  name: string
  location: string
  coordinates: [number, number]
  status: 'active' | 'inactive' | 'completed'
  noiseLevel: number
  dustLevel: number
  lastUpdated: string
  deviceCount: number
  description: string
  manager: string
  contactPhone: string
  startDate: string
  estimatedCompletion: string
  projectType: 'residential' | 'commercial' | 'infrastructure' | 'industrial'
  budget: number
  progress: number // percentage
}

export interface SiteSchedule {
  id: string
  siteId: string
  time: string
  title: string
  description: string
  type: 'inspection' | 'maintenance' | 'meeting' | 'delivery' | 'break'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  color: string
  // Optional: for mock/demo data to allow scheduling on different days
  dateOffset?: number
}

export interface SiteAlert {
  id: string
  siteId: string
  title: string
  message: string
  type: 'noise' | 'dust' | 'safety' | 'maintenance' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved' | 'archived'
  createdAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  acknowledgedBy?: string
  resolvedBy?: string
  archivedAt?: string
}

export interface SiteData {
  site: ConstructionSite
  schedules: SiteSchedule[]
  alerts: SiteAlert[]
  noiseData: NoiseDataPoint[]
  dustData: DustDataPoint[]
}

export interface MapMarker {
  id: string
  position: [number, number]
  title: string
  status: string
  color: string
  data: ConstructionSite
}

export interface MapConfig {
  center: [number, number]
  zoom: number
  minZoom: number
  maxZoom: number
}

export interface SensorDevice {
  id: string
  name: string
  type: 'dust' | 'noise'
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  batteryLevel: number
  signalStrength: number
  lastReading?: number
  lastReadingTime?: string
  location?: string
  siteId: string
  manufacturer?: string
  model?: string
  firmware?: string
  installDate?: string
  history?: Array<{ timestamp: string, value: number }>
}
