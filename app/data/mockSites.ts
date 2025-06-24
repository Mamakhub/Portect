import type {
  ConstructionSite,
  DustDataPoint,
  NoiseDataPoint,
  SensorDevice,
  SiteAlert,
  SiteData,
  SiteSchedule,
} from '~/types/sites'

// Helper function to generate time-based data
function generateTimeSeriesData(
  startTime: string,
  count: number,
  baseValue: number,
  variance: number,
  trend: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable',
): Array<{ timestamp: string, value: number }> {
  const data = []
  const startDate = new Date(startTime)

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startDate.getTime() + i * 5 * 60 * 1000) // 5-minute intervals
    let value = baseValue

    // Apply trend
    switch (trend) {
      case 'increasing':
        value += (i / count) * variance
        break
      case 'decreasing':
        value -= (i / count) * variance
        break
      case 'fluctuating':
        value += Math.sin(i * 0.5) * variance * 0.5
        break
      default:
        // stable - just add random variance
        break
    }

    // Add random variance
    value += (Math.random() - 0.5) * variance

    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value), // Ensure non-negative
    })
  }

  return data
}

// Generate noise data for a site
function generateNoiseData(siteId: string, baseLevel: number, variance: number, trend: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable'): NoiseDataPoint[] {
  const timeData = generateTimeSeriesData('2024-01-01T00:00:00', 37, baseLevel, variance, trend)

  return timeData.map(item => ({
    timestamp: item.timestamp,
    noise_level: Math.round(item.value * 10) / 10,
    location: `Site ${siteId}`,
    device_id: `DEV${siteId.padStart(3, '0')}`,
  }))
}

// Generate dust data for a site
function generateDustData(siteId: string, baseLevel: number, variance: number, trend: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable'): DustDataPoint[] {
  const timeData = generateTimeSeriesData('2024-01-01T00:00:00', 37, baseLevel, variance, trend)

  return timeData.map(item => ({
    timestamp: item.timestamp,
    dust_level: Math.round(item.value * 100) / 100,
    location: `Site ${siteId}`,
    device_id: `DEV${siteId.padStart(3, '0')}`,
  }))
}

// Mock construction sites
export const mockSites: ConstructionSite[] = [
  {
    id: 'site-001',
    name: 'KLCC Tower Extension',
    location: 'Kuala Lumpur City Centre',
    coordinates: [3.1579, 101.7116],
    status: 'active',
    noiseLevel: 68,
    dustLevel: 0.28,
    lastUpdated: '2024-01-24T08:30:00Z',
    deviceCount: 8,
    description: 'Extension of the iconic Petronas Twin Towers',
    manager: 'Ahmad Rahman',
    contactPhone: '+60 12-345 6789',
    startDate: '2024-01-15',
    estimatedCompletion: '2024-12-31',
    projectType: 'commercial',
    budget: 25000000,
    progress: 35,
  },
  {
    id: 'site-002',
    name: 'Putrajaya Bridge Project',
    location: 'Putrajaya',
    coordinates: [2.9264, 101.6964],
    status: 'active',
    noiseLevel: 72,
    dustLevel: 0.42,
    lastUpdated: '2024-01-24T08:25:00Z',
    deviceCount: 6,
    description: 'New bridge connecting Putrajaya to Cyberjaya',
    manager: 'Sarah Lim',
    contactPhone: '+60 12-345 6790',
    startDate: '2023-11-01',
    estimatedCompletion: '2024-08-15',
    projectType: 'infrastructure',
    budget: 15000000,
    progress: 65,
  },
  {
    id: 'site-003',
    name: 'Subang Jaya Residential Complex',
    location: 'Subang Jaya',
    coordinates: [3.0738, 101.5183],
    status: 'active',
    noiseLevel: 45,
    dustLevel: 0.15,
    lastUpdated: '2024-01-24T08:20:00Z',
    deviceCount: 4,
    description: 'High-rise residential development',
    manager: 'David Chen',
    contactPhone: '+60 12-345 6791',
    startDate: '2024-02-01',
    estimatedCompletion: '2025-06-30',
    projectType: 'residential',
    budget: 8000000,
    progress: 15,
  },
  {
    id: 'site-004',
    name: 'Port Klang Industrial Zone',
    location: 'Port Klang',
    coordinates: [3.0000, 101.4000],
    status: 'active',
    noiseLevel: 85,
    dustLevel: 0.65,
    lastUpdated: '2024-01-24T08:15:00Z',
    deviceCount: 10,
    description: 'Industrial facility expansion',
    manager: 'Maria Rodriguez',
    contactPhone: '+60 12-345 6792',
    startDate: '2023-09-15',
    estimatedCompletion: '2024-10-31',
    projectType: 'industrial',
    budget: 35000000,
    progress: 80,
  },
  {
    id: 'site-005',
    name: 'Cyberjaya Tech Campus',
    location: 'Cyberjaya',
    coordinates: [2.9189, 101.6525],
    status: 'inactive',
    noiseLevel: 25,
    dustLevel: 0.08,
    lastUpdated: '2024-01-24T08:10:00Z',
    deviceCount: 3,
    description: 'Technology campus development',
    manager: 'James Wong',
    contactPhone: '+60 12-345 6793',
    startDate: '2024-03-01',
    estimatedCompletion: '2025-03-31',
    projectType: 'commercial',
    budget: 20000000,
    progress: 5,
  },
]

// Mock schedules for each site
export const mockSchedules: SiteSchedule[] = [
  // Site 001 - KLCC
  {
    id: 'sch-001',
    siteId: 'site-001',
    time: '8:00 AM',
    title: 'Safety Inspection',
    description: 'Daily safety inspection of all equipment and work areas',
    type: 'inspection',
    priority: 'high',
    assignedTo: 'Ahmad Rahman',
    status: 'completed',
    color: 'blue',
  },
  {
    id: 'sch-002',
    siteId: 'site-001',
    time: '10:00 AM',
    title: 'Material Delivery',
    description: 'Steel beams delivery from supplier',
    type: 'delivery',
    priority: 'medium',
    assignedTo: 'Site Team',
    status: 'in-progress',
    color: 'green',
  },
  {
    id: 'sch-003',
    siteId: 'site-001',
    time: '2:00 PM',
    title: 'Progress Meeting',
    description: 'Weekly progress review with stakeholders',
    type: 'meeting',
    priority: 'high',
    assignedTo: 'Ahmad Rahman',
    status: 'pending',
    color: 'purple',
  },

  // Site 002 - Putrajaya Bridge
  {
    id: 'sch-004',
    siteId: 'site-002',
    time: '7:30 AM',
    title: 'Equipment Maintenance',
    description: 'Crane maintenance and safety checks',
    type: 'maintenance',
    priority: 'critical',
    assignedTo: 'Technical Team',
    status: 'in-progress',
    color: 'orange',
  },
  {
    id: 'sch-005',
    siteId: 'site-002',
    time: '12:00 PM',
    title: 'Lunch Break',
    description: 'Team lunch break',
    type: 'break',
    priority: 'low',
    assignedTo: 'All Staff',
    status: 'pending',
    color: 'gray',
  },

  // Site 003 - Subang Jaya
  {
    id: 'sch-006',
    siteId: 'site-003',
    time: '9:00 AM',
    title: 'Foundation Inspection',
    description: 'Foundation work quality inspection',
    type: 'inspection',
    priority: 'high',
    assignedTo: 'David Chen',
    status: 'pending',
    color: 'blue',
  },

  // Site 004 - Port Klang
  {
    id: 'sch-007',
    siteId: 'site-004',
    time: '6:00 AM',
    title: 'Early Shift Start',
    description: 'Early morning shift for heavy machinery operation',
    type: 'maintenance',
    priority: 'high',
    assignedTo: 'Maria Rodriguez',
    status: 'completed',
    color: 'red',
  },
  {
    id: 'sch-008',
    siteId: 'site-004',
    time: '3:00 PM',
    title: 'Environmental Check',
    description: 'Environmental compliance inspection',
    type: 'inspection',
    priority: 'medium',
    assignedTo: 'Environmental Team',
    status: 'pending',
    color: 'blue',
  },
]

// Mock alerts for each site
export const mockAlerts: SiteAlert[] = [
  // Site 001 - KLCC
  {
    id: 'alert-001',
    siteId: 'site-001',
    title: 'Noise Level Exceeded',
    message: 'Noise levels have exceeded the 70 dB threshold for the past 30 minutes',
    type: 'noise',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T08:00:00Z',
  },
  {
    id: 'alert-002',
    siteId: 'site-001',
    title: 'Dust Level Warning',
    message: 'Dust levels approaching threshold limit',
    type: 'dust',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: '2024-01-24T07:30:00Z',
    acknowledgedAt: '2024-01-24T07:45:00Z',
    acknowledgedBy: 'Ahmad Rahman',
  },
  {
    id: 'alert-003',
    siteId: 'site-001',
    title: 'Safety Equipment Maintenance',
    message: 'Safety harness inspection overdue by 1 day',
    type: 'safety',
    severity: 'medium',
    status: 'active',
    createdAt: '2024-01-24T06:15:00Z',
  },
  {
    id: 'alert-004',
    siteId: 'site-001',
    title: 'Generator Maintenance Required',
    message: 'Backup generator requires scheduled maintenance',
    type: 'maintenance',
    severity: 'low',
    status: 'acknowledged',
    createdAt: '2024-01-24T05:30:00Z',
    acknowledgedAt: '2024-01-24T06:00:00Z',
    acknowledgedBy: 'Technical Team',
  },

  // Site 002 - Putrajaya Bridge
  {
    id: 'alert-005',
    siteId: 'site-002',
    title: 'Critical Noise Alert',
    message: 'Noise levels have exceeded 75 dB for 15 minutes',
    type: 'noise',
    severity: 'critical',
    status: 'active',
    createdAt: '2024-01-24T08:15:00Z',
  },
  {
    id: 'alert-006',
    siteId: 'site-002',
    title: 'Crane Safety Check',
    message: 'Crane safety inspection required before next operation',
    type: 'safety',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T07:45:00Z',
  },
  {
    id: 'alert-007',
    siteId: 'site-002',
    title: 'Material Delivery Delay',
    message: 'Steel beam delivery delayed by 2 hours',
    type: 'general',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: '2024-01-24T07:00:00Z',
    acknowledgedAt: '2024-01-24T07:15:00Z',
    acknowledgedBy: 'Sarah Lim',
  },

  // Site 003 - Subang Jaya
  {
    id: 'alert-008',
    siteId: 'site-003',
    title: 'Foundation Inspection Required',
    message: 'Foundation work quality inspection overdue',
    type: 'safety',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T08:30:00Z',
  },
  {
    id: 'alert-009',
    siteId: 'site-003',
    title: 'Low Dust Level Alert',
    message: 'Dust levels below normal range, check sensor calibration',
    type: 'dust',
    severity: 'low',
    status: 'acknowledged',
    createdAt: '2024-01-24T08:00:00Z',
    acknowledgedAt: '2024-01-24T08:10:00Z',
    acknowledgedBy: 'David Chen',
  },

  // Site 004 - Port Klang
  {
    id: 'alert-010',
    siteId: 'site-004',
    title: 'High Dust Levels',
    message: 'Dust levels have exceeded 0.5 mg/m³ threshold',
    type: 'dust',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T08:10:00Z',
  },
  {
    id: 'alert-011',
    siteId: 'site-004',
    title: 'Safety Equipment Check',
    message: 'Safety equipment inspection overdue by 2 days',
    type: 'safety',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: '2024-01-24T07:00:00Z',
    acknowledgedAt: '2024-01-24T07:30:00Z',
    acknowledgedBy: 'Maria Rodriguez',
  },
  {
    id: 'alert-012',
    siteId: 'site-004',
    title: 'Critical Noise Level',
    message: 'Noise levels exceeded 80 dB for 10 minutes',
    type: 'noise',
    severity: 'critical',
    status: 'active',
    createdAt: '2024-01-24T08:20:00Z',
  },
  {
    id: 'alert-013',
    siteId: 'site-004',
    title: 'Heavy Machinery Maintenance',
    message: 'Excavator requires immediate maintenance check',
    type: 'maintenance',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T06:45:00Z',
  },

  // Site 005 - Cyberjaya (inactive site)
  {
    id: 'alert-014',
    siteId: 'site-005',
    title: 'Site Inactivity Notice',
    message: 'Site has been inactive for 3 days, check project status',
    type: 'general',
    severity: 'low',
    status: 'acknowledged',
    createdAt: '2024-01-24T07:30:00Z',
    acknowledgedAt: '2024-01-24T08:00:00Z',
    acknowledgedBy: 'James Wong',
  },
]

// Enhanced sensor data with more realistic device counts and status
export const mockSensorData = {
  'site-001': {
    noiseData: generateNoiseData('001', 68, 15, 'fluctuating'),
    dustData: generateDustData('001', 0.28, 0.1, 'stable'),
    // KLCC has 8 devices: 4 noise sensors, 4 dust sensors
    noiseSensors: { active: 4, inactive: 0 },
    dustSensors: { active: 4, inactive: 0 },
  },
  'site-002': {
    noiseData: generateNoiseData('002', 72, 20, 'increasing'),
    dustData: generateDustData('002', 0.42, 0.15, 'fluctuating'),
    // Putrajaya Bridge has 6 devices: 3 noise sensors, 3 dust sensors
    noiseSensors: { active: 3, inactive: 0 },
    dustSensors: { active: 3, inactive: 0 },
  },
  'site-003': {
    noiseData: generateNoiseData('003', 45, 10, 'stable'),
    dustData: generateDustData('003', 0.15, 0.05, 'stable'),
    // Subang Jaya has 4 devices: 2 noise sensors, 2 dust sensors
    noiseSensors: { active: 2, inactive: 0 },
    dustSensors: { active: 2, inactive: 0 },
  },
  'site-004': {
    noiseData: generateNoiseData('004', 85, 25, 'fluctuating'),
    dustData: generateDustData('004', 0.65, 0.2, 'increasing'),
    // Port Klang has 10 devices: 5 noise sensors, 5 dust sensors
    noiseSensors: { active: 5, inactive: 0 },
    dustSensors: { active: 5, inactive: 0 },
  },
  'site-005': {
    noiseData: generateNoiseData('005', 25, 5, 'stable'),
    dustData: generateDustData('005', 0.08, 0.03, 'stable'),
    // Cyberjaya has 3 devices: 2 noise sensors, 1 dust sensor (inactive site)
    noiseSensors: { active: 1, inactive: 1 },
    dustSensors: { active: 0, inactive: 1 },
  },
}

// Helper function to get complete site data
export function getSiteData(siteId: string): SiteData | null {
  const site = mockSites.find(s => s.id === siteId)
  if (!site)
    return null

  const schedules = mockSchedules.filter(s => s.siteId === siteId)
  const alerts = mockAlerts.filter(a => a.siteId === siteId)
  const sensorData = mockSensorData[siteId as keyof typeof mockSensorData]

  return {
    site,
    schedules,
    alerts,
    noiseData: sensorData.noiseData,
    dustData: sensorData.dustData,
  }
}

// Helper function to get all sites data
export function getAllSitesData(): SiteData[] {
  return mockSites.map(site => getSiteData(site.id)!).filter(Boolean)
}

// Helper function to get active alerts
export function getActiveAlerts(): SiteAlert[] {
  return mockAlerts.filter(alert => alert.status === 'active')
}

// Helper function to get today's schedules
export function getTodaySchedules(): SiteSchedule[] {
  return mockSchedules.filter(schedule => schedule.status === 'pending' || schedule.status === 'in-progress')
}

// Helper function to get sensor summary data for all sites
export function getSensorSummary() {
  let totalNoiseActive = 0
  let totalNoiseInactive = 0
  let totalDustActive = 0
  let totalDustInactive = 0

  Object.values(mockSensorData).forEach((siteData) => {
    totalNoiseActive += siteData.noiseSensors.active
    totalNoiseInactive += siteData.noiseSensors.inactive
    totalDustActive += siteData.dustSensors.active
    totalDustInactive += siteData.dustSensors.inactive
  })

  return {
    noiseActive: totalNoiseActive,
    noiseInactive: totalNoiseInactive,
    dustActive: totalDustActive,
    dustInactive: totalDustInactive,
  }
}

// Helper function to get sensor summary for a specific site
export function getSiteSensorSummary(siteId: string) {
  const sensorData = mockSensorData[siteId as keyof typeof mockSensorData]
  if (!sensorData) {
    return {
      noiseActive: 0,
      noiseInactive: 0,
      dustActive: 0,
      dustInactive: 0,
    }
  }

  return {
    noiseActive: sensorData.noiseSensors.active,
    noiseInactive: sensorData.noiseSensors.inactive,
    dustActive: sensorData.dustSensors.active,
    dustInactive: sensorData.dustSensors.inactive,
  }
}

// Helper function to get alerts for a specific site
export function getSiteAlerts(siteId: string): SiteAlert[] {
  return mockAlerts.filter(alert => alert.siteId === siteId)
}

// Helper function to get active alerts for a specific site
export function getSiteActiveAlerts(siteId: string): SiteAlert[] {
  return mockAlerts.filter(alert => alert.siteId === siteId && alert.status === 'active')
}

// Mock sensor devices for each site
export const mockSensorDevices: SensorDevice[] = [
  // Site 001 - KLCC Tower Extension (8 devices)
  {
    id: 'dev-001-001',
    name: 'Noise Sensor 1',
    type: 'noise',
    status: 'active',
    batteryLevel: 85,
    signalStrength: 92,
    lastReading: 68,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'North Tower',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-002',
    name: 'Noise Sensor 2',
    type: 'noise',
    status: 'active',
    batteryLevel: 78,
    signalStrength: 88,
    lastReading: 72,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'South Tower',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-003',
    name: 'Noise Sensor 3',
    type: 'noise',
    status: 'active',
    batteryLevel: 92,
    signalStrength: 95,
    lastReading: 65,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'East Wing',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-004',
    name: 'Noise Sensor 4',
    type: 'noise',
    status: 'active',
    batteryLevel: 67,
    signalStrength: 85,
    lastReading: 70,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'West Wing',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-005',
    name: 'Dust Sensor 1',
    type: 'dust',
    status: 'active',
    batteryLevel: 89,
    signalStrength: 90,
    lastReading: 0.28,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'North Tower',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-006',
    name: 'Dust Sensor 2',
    type: 'dust',
    status: 'active',
    batteryLevel: 76,
    signalStrength: 87,
    lastReading: 0.32,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'South Tower',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-007',
    name: 'Dust Sensor 3',
    type: 'dust',
    status: 'active',
    batteryLevel: 94,
    signalStrength: 93,
    lastReading: 0.25,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'East Wing',
    siteId: 'site-001',
  },
  {
    id: 'dev-001-008',
    name: 'Dust Sensor 4',
    type: 'dust',
    status: 'active',
    batteryLevel: 82,
    signalStrength: 89,
    lastReading: 0.29,
    lastReadingTime: '2024-01-24T08:30:00Z',
    location: 'West Wing',
    siteId: 'site-001',
  },

  // Site 002 - Putrajaya Bridge Project (6 devices)
  {
    id: 'dev-002-001',
    name: 'Noise Sensor 1',
    type: 'noise',
    status: 'active',
    batteryLevel: 73,
    signalStrength: 91,
    lastReading: 72,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge North',
    siteId: 'site-002',
  },
  {
    id: 'dev-002-002',
    name: 'Noise Sensor 2',
    type: 'noise',
    status: 'active',
    batteryLevel: 88,
    signalStrength: 94,
    lastReading: 75,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge South',
    siteId: 'site-002',
  },
  {
    id: 'dev-002-003',
    name: 'Noise Sensor 3',
    type: 'noise',
    status: 'active',
    batteryLevel: 65,
    signalStrength: 86,
    lastReading: 69,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge Center',
    siteId: 'site-002',
  },
  {
    id: 'dev-002-004',
    name: 'Dust Sensor 1',
    type: 'dust',
    status: 'active',
    batteryLevel: 91,
    signalStrength: 92,
    lastReading: 0.42,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge North',
    siteId: 'site-002',
  },
  {
    id: 'dev-002-005',
    name: 'Dust Sensor 2',
    type: 'dust',
    status: 'active',
    batteryLevel: 79,
    signalStrength: 88,
    lastReading: 0.45,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge South',
    siteId: 'site-002',
  },
  {
    id: 'dev-002-006',
    name: 'Dust Sensor 3',
    type: 'dust',
    status: 'active',
    batteryLevel: 84,
    signalStrength: 90,
    lastReading: 0.38,
    lastReadingTime: '2024-01-24T08:25:00Z',
    location: 'Bridge Center',
    siteId: 'site-002',
  },

  // Site 003 - Subang Jaya Residential Complex (4 devices)
  {
    id: 'dev-003-001',
    name: 'Noise Sensor 1',
    type: 'noise',
    status: 'active',
    batteryLevel: 95,
    signalStrength: 96,
    lastReading: 45,
    lastReadingTime: '2024-01-24T08:20:00Z',
    location: 'Building A',
    siteId: 'site-003',
  },
  {
    id: 'dev-003-002',
    name: 'Noise Sensor 2',
    type: 'noise',
    status: 'active',
    batteryLevel: 87,
    signalStrength: 93,
    lastReading: 43,
    lastReadingTime: '2024-01-24T08:20:00Z',
    location: 'Building B',
    siteId: 'site-003',
  },
  {
    id: 'dev-003-003',
    name: 'Dust Sensor 1',
    type: 'dust',
    status: 'active',
    batteryLevel: 92,
    signalStrength: 94,
    lastReading: 0.15,
    lastReadingTime: '2024-01-24T08:20:00Z',
    location: 'Building A',
    siteId: 'site-003',
  },
  {
    id: 'dev-003-004',
    name: 'Dust Sensor 2',
    type: 'dust',
    status: 'active',
    batteryLevel: 89,
    signalStrength: 91,
    lastReading: 0.12,
    lastReadingTime: '2024-01-24T08:20:00Z',
    location: 'Building B',
    siteId: 'site-003',
  },

  // Site 004 - Port Klang Industrial Zone (10 devices)
  {
    id: 'dev-004-001',
    name: 'Noise Sensor 1',
    type: 'noise',
    status: 'active',
    batteryLevel: 68,
    signalStrength: 89,
    lastReading: 85,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Warehouse A',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-002',
    name: 'Noise Sensor 2',
    type: 'noise',
    status: 'active',
    batteryLevel: 72,
    signalStrength: 87,
    lastReading: 88,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Warehouse B',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-003',
    name: 'Noise Sensor 3',
    type: 'noise',
    status: 'maintenance',
    batteryLevel: 45,
    signalStrength: 65,
    lastReading: 82,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Loading Dock',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-004',
    name: 'Noise Sensor 4',
    type: 'noise',
    status: 'active',
    batteryLevel: 81,
    signalStrength: 92,
    lastReading: 86,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Factory Floor',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-005',
    name: 'Noise Sensor 5',
    type: 'noise',
    status: 'active',
    batteryLevel: 76,
    signalStrength: 85,
    lastReading: 84,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Office Area',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-006',
    name: 'Dust Sensor 1',
    type: 'dust',
    status: 'active',
    batteryLevel: 69,
    signalStrength: 88,
    lastReading: 0.65,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Warehouse A',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-007',
    name: 'Dust Sensor 2',
    type: 'dust',
    status: 'active',
    batteryLevel: 74,
    signalStrength: 86,
    lastReading: 0.68,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Warehouse B',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-008',
    name: 'Dust Sensor 3',
    type: 'dust',
    status: 'active',
    batteryLevel: 83,
    signalStrength: 91,
    lastReading: 0.62,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Loading Dock',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-009',
    name: 'Dust Sensor 4',
    type: 'dust',
    status: 'active',
    batteryLevel: 77,
    signalStrength: 89,
    lastReading: 0.70,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Factory Floor',
    siteId: 'site-004',
  },
  {
    id: 'dev-004-010',
    name: 'Dust Sensor 5',
    type: 'dust',
    status: 'inactive',
    batteryLevel: 23,
    signalStrength: 45,
    lastReading: 0.58,
    lastReadingTime: '2024-01-24T08:15:00Z',
    location: 'Office Area',
    siteId: 'site-004',
  },

  // Site 005 - Cyberjaya Tech Campus (3 devices - inactive site)
  {
    id: 'dev-005-001',
    name: 'Noise Sensor 1',
    type: 'noise',
    status: 'active',
    batteryLevel: 96,
    signalStrength: 98,
    lastReading: 25,
    lastReadingTime: '2024-01-24T08:10:00Z',
    location: 'Main Building',
    siteId: 'site-005',
  },
  {
    id: 'dev-005-002',
    name: 'Noise Sensor 2',
    type: 'noise',
    status: 'inactive',
    batteryLevel: 34,
    signalStrength: 67,
    lastReading: 28,
    lastReadingTime: '2024-01-24T08:10:00Z',
    location: 'Parking Area',
    siteId: 'site-005',
  },
  {
    id: 'dev-005-003',
    name: 'Dust Sensor 1',
    type: 'dust',
    status: 'inactive',
    batteryLevel: 41,
    signalStrength: 72,
    lastReading: 0.08,
    lastReadingTime: '2024-01-24T08:10:00Z',
    location: 'Main Building',
    siteId: 'site-005',
  },
]

// Helper function to get sensor devices for a specific site
export function getSiteSensorDevices(siteId: string): SensorDevice[] {
  return mockSensorDevices.filter(device => device.siteId === siteId)
}

// Helper function to get all sensor devices
export function getAllSensorDevices(): SensorDevice[] {
  return mockSensorDevices
}
