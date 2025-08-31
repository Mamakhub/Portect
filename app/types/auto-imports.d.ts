// Auto-import type declarations for Nuxt 3
declare module '#app' {
  interface NuxtApp {
    $config: RuntimeConfig
  }
}

// Vessel types
declare module '~/types/vessels' {
  export interface Vessel {
    id: string
    name: string
    vesselType: 'cargo' | 'container' | 'tanker' | 'passenger' | 'fishing' | 'tug' | 'barge'
    imoNumber: string
    mmsi: string
    callSign: string
    flag: string
    length: number
    beam: number
    draft: number
    grossTonnage: number
    status: 'active' | 'inactive' | 'maintenance' | 'offline'
    lastKnownPosition: [number, number]
    lastUpdated: string
    speed: number
    heading: number
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
    speed: number
    heading: number
    accuracy: number
    satellites: number
    hdop: number
    vdop: number
  }

  export interface VesselAlert {
    id: string
    vesselId: string
    title: string
    message: string
    type: 'speed_limit' | 'geofence_breach' | 'maintenance_due' | 'offline' | 'general'
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

  export interface PortZone {
    id: string
    name: string
    type: 'anchorage' | 'berth' | 'channel' | 'restricted' | 'traffic_separation'
    coordinates: [number, number][]
    color: string
    description: string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $config: RuntimeConfig
  }
}

// Global type declarations for auto-imported composables and utilities
declare global {
  // Nuxt auto-imports
  const defineNuxtConfig: typeof import('nuxt/config').defineNuxtConfig
  const definePageMeta: typeof import('nuxt/app').definePageMeta
  const useRuntimeConfig: typeof import('nuxt/app').useRuntimeConfig
  const useRoute: typeof import('nuxt/app').useRoute
  const useRouter: typeof import('nuxt/app').useRouter
  const useColorMode: typeof import('@nuxtjs/color-mode').useColorMode
  
  // Vue auto-imports
  const ref: typeof import('vue').ref
  const computed: typeof import('vue').computed
  const reactive: typeof import('vue').reactive
  const watch: typeof import('vue').watch
  const watchEffect: typeof import('vue').watchEffect
  const onMounted: typeof import('vue').onMounted
  const onUnmounted: typeof import('vue').onUnmounted
  const onBeforeMount: typeof import('vue').onBeforeMount
  const onBeforeUnmount: typeof import('vue').onBeforeUnmount
  const nextTick: typeof import('vue').nextTick
  const readonly: typeof import('vue').readonly
  
  // Custom composables
  const useCounter: typeof import('~/composable/useCounter').useCounter
  const useCsvData: typeof import('~/composable/useCsvData').useCsvData
  const useDustData: typeof import('~/composable/useDustData').useDustData
  const useMultiSiteData: typeof import('~/composable/useMultiSiteData').useMultiSiteData
  const useVesselData: typeof import('~/composable/useVesselData').useVesselData
  
  // Custom utilities
  const formatDate: typeof import('~/utils/date').formatDate
  const formatDateTime: typeof import('~/utils/date').formatDateTime
  const formatRelativeTime: typeof import('~/utils/date').formatRelativeTime
  const isValidDate: typeof import('~/utils/date').isValidDate
}

export { }

