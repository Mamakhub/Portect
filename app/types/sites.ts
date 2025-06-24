export interface ConstructionSite {
  id: string
  name: string
  location: string
  coordinates: readonly [number, number] // [latitude, longitude]
  status: 'active' | 'inactive' | 'completed'
  noiseLevel: number
  dustLevel: number
  lastUpdated: string
  deviceCount: number
  description?: string
}

export interface MapMarker {
  id: string
  position: readonly [number, number]
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
