export interface Vessel {
  id: string
  name: string
  vesselType: 'cargo' | 'container' | 'tanker' | 'passenger' | 'fishing' | 'tug' | 'barge'
  imoNumber: string
  mmsi: string
  callSign: string
  flag: string
  length: number // meters
  beam: number // meters
  draft: number // meters
  grossTonnage: number
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  lastKnownPosition: [number, number] // [latitude, longitude]
  lastUpdated: string
  speed: number // knots
  heading: number // degrees
  destination: string
  eta: string
  portOfCall: string
  operator: string
  contactPhone: string
  emergencyContact: string
  gpsDevices: GpsDevice[]
}

export interface GpsDevice {
  id: string
  vesselId: string
  deviceType: 'primary' | 'secondary' | 'backup'
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  signalStrength: number // percentage
  lastReading: GpsReading
  manufacturer: string
  model: string
  serialNumber: string
  firmware: string
  installDate: string
  lastMaintenance: string
  nextMaintenance: string
}

export interface GpsReading {
  timestamp: string
  latitude: number
  longitude: number
  altitude: number
  speed: number // knots
  heading: number // degrees
  accuracy: number // meters
  satellites: number
  hdop: number // horizontal dilution of precision
  vdop: number // vertical dilution of precision
}

export interface VesselAlert {
  id: string
  vesselId: string
  title: string
  message: string
  type: 'gps_signal_lost' | 'speed_limit' | 'geofence_breach' | 'maintenance_due' | 'offline' | 'general'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'acknowledged' | 'resolved' | 'archived'
  createdAt: string
  acknowledgedAt?: string
  resolvedAt?: string
  acknowledgedBy?: string
  resolvedBy?: string
  archivedAt?: string
}

export interface VesselSchedule {
  id: string
  vesselId: string
  time: string
  title: string
  description: string
  type: 'arrival' | 'departure' | 'berthing' | 'unberthing' | 'maintenance' | 'inspection' | 'meeting'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  color: string
  berth?: string
  terminal?: string
}

export interface VesselData {
  vessel: Vessel
  schedules: VesselSchedule[]
  alerts: VesselAlert[]
  gpsHistory: GpsReading[]
}

export interface MapMarker {
  id: string
  position: [number, number]
  title: string
  status: string
  color: string
  data: Vessel
}

export interface MapConfig {
  center: [number, number]
  zoom: number
  minZoom: number
  maxZoom: number
}

export interface PortZone {
  id: string
  name: string
  type: 'anchorage' | 'berth' | 'channel' | 'restricted' | 'traffic_separation'
  coordinates: [number, number][]
  color: string
  description: string
}

export interface VesselGPSModule {
  id: string
  name: string
  vesselType: 'container' | 'bulk' | 'tanker' | 'passenger' | 'fishing' | 'tug'
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  signalStrength: number
  lastReading: string
  location: string
  coordinates: [number, number]
  speed: number
  heading: number
  destination: string
  eta: string
  captain: string
  contactPhone: string
  imo: string
  mmsi: string
  manufacturer: string
  model: string
  firmware: string
  installDate: string
  history: Array<{ timestamp: string, latitude: number, longitude: number, speed: number }>
}
