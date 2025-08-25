import type { VesselGPSModule } from '~/types/vessels'

// Helper function to generate time-based GPS data
function generateGPSTimeSeries(
  startTime: string,
  count: number,
  baseLat: number,
  baseLng: number,
  variance: number,
  movement: 'docked' | 'moving' | 'anchored' = 'docked',
): Array<{ timestamp: string, latitude: number, longitude: number, speed: number }> {
  const data = []
  const startDate = new Date(startTime)

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startDate.getTime() + i * 5 * 60 * 1000) // 5-minute intervals
    let latitude = baseLat
    let longitude = baseLng
    let speed = 0

    // Apply movement patterns
    switch (movement) {
      case 'moving':
        // Simulate vessel movement
        latitude += (Math.random() - 0.5) * variance * 0.001
        longitude += (Math.random() - 0.5) * variance * 0.001
        speed = Math.random() * 25 + 5 // 5-30 knots
        break
      case 'anchored':
        // Small drift when anchored
        latitude += (Math.random() - 0.5) * variance * 0.0001
        longitude += (Math.random() - 0.5) * variance * 0.0001
        speed = Math.random() * 2 // 0-2 knots
        break
      default:
        // docked - minimal movement
        latitude += (Math.random() - 0.5) * variance * 0.00001
        longitude += (Math.random() - 0.5) * variance * 0.00001
        speed = 0
        break
    }

    data.push({
      timestamp: timestamp.toISOString(),
      latitude: Math.round(latitude * 1000000) / 1000000,
      longitude: Math.round(longitude * 1000000) / 1000000,
      speed: Math.round(speed * 10) / 10,
    })
  }

  return data
}

// Mock vessel GPS modules
export const mockVesselGPSModules: VesselGPSModule[] = [
  // Container Ships
     {
     id: 'vessel-001',
     name: 'MV Port Klang Star',
     vesselType: 'container',
     status: 'active',
     batteryLevel: 85,
     signalStrength: 92,
     lastReading: '2024-01-24T08:30:00Z',
     location: 'Port Klang Terminal 1',
     coordinates: [2.8500, 101.2500],
    speed: 0,
    heading: 180,
    destination: 'Singapore',
    eta: '2024-01-25T14:00:00Z',
    captain: 'Captain Ahmad Rahman',
    contactPhone: '+60 12-345 6789',
    imo: 'IMO1234567',
    mmsi: '123456789',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
         installDate: '2023-06-15',
     history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8500, 101.2500, 0.001, 'docked'),
   },
  {
    id: 'vessel-002',
    name: 'MV Singapore Express',
    vesselType: 'container',
    status: 'active',
    batteryLevel: 73,
    signalStrength: 89,
    lastReading: '2024-01-24T08:25:00Z',
    location: 'South China Sea',
         coordinates: [2.4000, 101.9000],
    speed: 18.5,
    heading: 45,
    destination: 'Port Klang',
    eta: '2024-01-24T16:00:00Z',
    captain: 'Captain Sarah Lim',
    contactPhone: '+60 12-345 6790',
    imo: 'IMO2345678',
    mmsi: '234567890',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-08-20',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.4000, 101.9000, 0.01, 'moving'),
  },
  {
    id: 'vessel-003',
    name: 'MV Hong Kong Trader',
    vesselType: 'container',
    status: 'maintenance',
    batteryLevel: 45,
    signalStrength: 67,
    lastReading: '2024-01-24T07:15:00Z',
    location: 'Port Klang Anchorage',
         coordinates: [2.8000, 101.2000],
    speed: 0.5,
    heading: 90,
    destination: 'Port Klang',
    eta: '2024-01-24T12:00:00Z',
    captain: 'Captain David Chen',
    contactPhone: '+60 12-345 6791',
    imo: 'IMO3456789',
    mmsi: '345678901',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-07-10',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8000, 101.2000, 0.0001, 'anchored'),
  },

  // Bulk Carriers
  {
    id: 'vessel-004',
    name: 'MV Iron Ore Carrier',
    vesselType: 'bulk',
    status: 'active',
    batteryLevel: 91,
    signalStrength: 94,
    lastReading: '2024-01-24T08:20:00Z',
    location: 'Port Klang Terminal 2',
         coordinates: [2.8200, 101.1800],
    speed: 0,
    heading: 270,
    destination: 'Australia',
    eta: '2024-01-26T08:00:00Z',
    captain: 'Captain Maria Rodriguez',
    contactPhone: '+60 12-345 6792',
    imo: 'IMO4567890',
    mmsi: '456789012',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-09-05',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.001, 'docked'),
  },
  {
    id: 'vessel-005',
    name: 'MV Grain Trader',
    vesselType: 'bulk',
    status: 'active',
    batteryLevel: 68,
    signalStrength: 82,
    lastReading: '2024-01-24T08:15:00Z',
    location: 'Malacca Strait',
    coordinates: [2.800, 101.300],
    speed: 12.3,
    heading: 135,
    destination: 'Port Klang',
    eta: '2024-01-24T20:00:00Z',
    captain: 'Captain James Wong',
    contactPhone: '+60 12-345 6793',
    imo: 'IMO5678901',
    mmsi: '567890123',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-10-12',
    history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.7500, 101.7500, 0.01, 'moving'),
  },

  // Tankers
  {
    id: 'vessel-006',
    name: 'MV Oil Tanker Alpha',
    vesselType: 'tanker',
    status: 'active',
    batteryLevel: 76,
    signalStrength: 88,
    lastReading: '2024-01-24T08:10:00Z',
    location: 'Port Klang Terminal 3',
         coordinates: [2.8200, 101.1800],
    speed: 0,
    heading: 0,
    destination: 'Middle East',
    eta: '2024-01-28T10:00:00Z',
    captain: 'Captain Robert Kim',
    contactPhone: '+60 12-345 6794',
    imo: 'IMO6789012',
    mmsi: '678901234',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-11-18',
    history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.001, 'docked'),
  },
  {
    id: 'vessel-007',
    name: 'MV Chemical Carrier',
    vesselType: 'tanker',
    status: 'offline',
    batteryLevel: 12,
    signalStrength: 25,
    lastReading: '2024-01-24T02:45:00Z',
    location: 'Port Klang Anchorage',
         coordinates: [2.8000, 101.2000],
    speed: 0,
    heading: 180,
    destination: 'Port Klang',
    eta: '2024-01-24T14:00:00Z',
    captain: 'Captain Lisa Tan',
    contactPhone: '+60 12-345 6795',
    imo: 'IMO7890123',
    mmsi: '789012345',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-12-03',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8000, 101.2000, 0.0001, 'anchored'),
  },

  // Passenger Ships
  {
    id: 'vessel-008',
    name: 'MV Cruise Paradise',
    vesselType: 'passenger',
    status: 'active',
    batteryLevel: 95,
    signalStrength: 96,
    lastReading: '2024-01-24T08:05:00Z',
    location: 'Port Klang Cruise Terminal',
         coordinates: [2.8200, 101.1800],
    speed: 0,
    heading: 90,
    destination: 'Thailand',
    eta: '2024-01-25T18:00:00Z',
    captain: 'Captain Michael Lee',
    contactPhone: '+60 12-345 6796',
    imo: 'IMO8901234',
    mmsi: '890123456',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2024-01-05',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.001, 'docked'),
  },

  // Fishing Vessels
  {
    id: 'vessel-009',
    name: 'MV Fishing Fleet 1',
    vesselType: 'fishing',
    status: 'active',
    batteryLevel: 82,
    signalStrength: 85,
    lastReading: '2024-01-24T08:00:00Z',
    location: 'South China Sea',
    coordinates: [2.6500, 101.5500],
    speed: 8.7,
    heading: 315,
    destination: 'Port Klang',
    eta: '2024-01-24T22:00:00Z',
    captain: 'Captain Ali Hassan',
    contactPhone: '+60 12-345 6797',
    imo: 'IMO9012345',
    mmsi: '901234567',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-05-22',
    history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.6500, 101.5500, 0.01, 'moving'),
  },
  {
    id: 'vessel-010',
    name: 'MV Fishing Fleet 2',
    vesselType: 'fishing',
    status: 'inactive',
    batteryLevel: 34,
    signalStrength: 58,
    lastReading: '2024-01-24T06:30:00Z',
    location: 'Port Klang Marina',
         coordinates: [2.8200, 101.1800],
    speed: 0,
    heading: 0,
    destination: 'Port Klang',
    eta: '2024-01-24T10:00:00Z',
    captain: 'Captain Siti Aminah',
    contactPhone: '+60 12-345 6798',
    imo: 'IMO0123456',
    mmsi: '012345678',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-04-15',
         history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.001, 'docked'),
  },

  // Tugboats
  {
    id: 'vessel-011',
    name: 'MV Tugboat Alpha',
    vesselType: 'tug',
    status: 'active',
    batteryLevel: 88,
    signalStrength: 91,
    lastReading: '2024-01-24T07:55:00Z',
    location: 'Port Klang Harbor',
    coordinates: [2.8200, 101.1800],
    speed: 5.2,
    heading: 45,
    destination: 'Port Klang',
    eta: '2024-01-24T09:00:00Z',
    captain: 'Captain Raj Kumar',
    contactPhone: '+60 12-345 6799',
    imo: 'IMO1234567',
    mmsi: '123456789',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-03-08',
    history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.01, 'moving'),
  },
  {
    id: 'vessel-012',
    name: 'MV Tugboat Beta',
    vesselType: 'tug',
    status: 'maintenance',
    batteryLevel: 56,
    signalStrength: 73,
    lastReading: '2024-01-24T07:30:00Z',
    location: 'Port Klang Dock',
    coordinates: [2.8200, 101.1800],
    speed: 0,
    heading: 180,
    destination: 'Port Klang',
    eta: '2024-01-24T12:00:00Z',
    captain: 'Captain Wei Chen',
    contactPhone: '+60 12-345 6800',
    imo: 'IMO2345678',
    mmsi: '234567890',
    manufacturer: 'MarineGPS Pro',
    model: 'GPS-2000',
    firmware: 'v2.1.3',
    installDate: '2023-02-14',
    history: generateGPSTimeSeries('2024-01-24T00:00:00', 24, 2.8200, 101.1800, 0.001, 'docked'),
  },
]

// Helper function to get all vessel GPS modules
export function getAllVesselGPSModules(): VesselGPSModule[] {
  return mockVesselGPSModules
}

// Helper function to get vessel GPS modules by type
export function getVesselGPSModulesByType(vesselType: string): VesselGPSModule[] {
  return mockVesselGPSModules.filter(vessel => vessel.vesselType === vesselType)
}

// Helper function to get vessel GPS modules by status
export function getVesselGPSModulesByStatus(status: string): VesselGPSModule[] {
  return mockVesselGPSModules.filter(vessel => vessel.status === status)
}

// Helper function to get vessel GPS module by ID
export function getVesselGPSModuleById(id: string): VesselGPSModule | undefined {
  return mockVesselGPSModules.find(vessel => vessel.id === id)
}

// Mock data for compatibility with existing components
export const vessels = mockVesselGPSModules
export const vesselAlerts: any[] = [
  {
    id: 'alert-001',
    vesselId: 'vessel-007',
    title: 'Low Battery Alert',
    message: 'Vessel GPS module battery level critically low (12%)',
    severity: 'critical',
    status: 'active',
    createdAt: '2024-01-24T06:00:00Z',
  },
  {
    id: 'alert-002',
    vesselId: 'vessel-003',
    title: 'Maintenance Required',
    message: 'GPS module requires scheduled maintenance',
    severity: 'medium',
    status: 'active',
    createdAt: '2024-01-24T07:00:00Z',
  },
  {
    id: 'alert-003',
    vesselId: 'vessel-010',
    title: 'Signal Interference',
    message: 'Weak GPS signal detected, possible interference',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T08:00:00Z',
  }
]
export const vesselSchedules: any[] = [
  {
    id: 'schedule-001',
    vesselId: 'vessel-002',
    title: 'Port Entry',
    description: 'Scheduled port entry and docking procedures',
    time: '2024-01-24T16:00:00Z',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Port Control',
  },
  {
    id: 'schedule-002',
    vesselId: 'vessel-005',
    title: 'Cargo Loading',
    description: 'Bulk cargo loading operations',
    time: '2024-01-24T20:00:00Z',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Cargo Operations',
  },
  {
    id: 'schedule-003',
    vesselId: 'vessel-008',
    title: 'Passenger Disembarkation',
    description: 'Cruise ship passenger disembarkation',
    time: '2024-01-24T09:00:00Z',
    priority: 'low',
    status: 'pending',
    assignedTo: 'Passenger Services',
  },
  {
    id: 'schedule-004',
    vesselId: 'vessel-011',
    title: 'Tug Operations',
    description: 'Assist vessel docking operations',
    time: '2024-01-24T09:00:00Z',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Tug Operations',
  }
]
export const portZones: any[] = [
  {
    id: 'zone-001',
    name: 'Container Terminal',
    coordinates: [[2.9700, 101.3700], [2.9900, 101.3900]],
    type: 'operational',
  },
  {
    id: 'zone-002',
    name: 'Anchorage Area',
    coordinates: [[2.9000, 101.3000], [2.9200, 101.3200]],
    type: 'waiting',
  }
]
