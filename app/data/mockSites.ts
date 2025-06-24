import type {
  ConstructionSite,
  DustDataPoint,
  NoiseDataPoint,
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

  return timeData.map((item, index) => ({
    timestamp: item.timestamp,
    noise_level: Math.round(item.value * 10) / 10,
    location: `Site ${siteId}`,
    device_id: `DEV${siteId.padStart(3, '0')}`,
  }))
}

// Generate dust data for a site
function generateDustData(siteId: string, baseLevel: number, variance: number, trend: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable'): DustDataPoint[] {
  const timeData = generateTimeSeriesData('2024-01-01T00:00:00', 37, baseLevel, variance, trend)

  return timeData.map((item, index) => ({
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

  // Site 002 - Putrajaya Bridge
  {
    id: 'alert-003',
    siteId: 'site-002',
    title: 'Critical Noise Alert',
    message: 'Noise levels have exceeded 75 dB for 15 minutes',
    type: 'noise',
    severity: 'critical',
    status: 'active',
    createdAt: '2024-01-24T08:15:00Z',
  },

  // Site 004 - Port Klang
  {
    id: 'alert-004',
    siteId: 'site-004',
    title: 'High Dust Levels',
    message: 'Dust levels have exceeded 0.5 mg/m³ threshold',
    type: 'dust',
    severity: 'high',
    status: 'active',
    createdAt: '2024-01-24T08:10:00Z',
  },
  {
    id: 'alert-005',
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
]

// Generate sensor data for each site
export const mockSensorData = {
  'site-001': {
    noiseData: generateNoiseData('001', 68, 15, 'fluctuating'),
    dustData: generateDustData('001', 0.28, 0.1, 'stable'),
  },
  'site-002': {
    noiseData: generateNoiseData('002', 72, 20, 'increasing'),
    dustData: generateDustData('002', 0.42, 0.15, 'fluctuating'),
  },
  'site-003': {
    noiseData: generateNoiseData('003', 45, 10, 'stable'),
    dustData: generateDustData('003', 0.15, 0.05, 'stable'),
  },
  'site-004': {
    noiseData: generateNoiseData('004', 85, 25, 'fluctuating'),
    dustData: generateDustData('004', 0.65, 0.2, 'increasing'),
  },
  'site-005': {
    noiseData: generateNoiseData('005', 25, 5, 'stable'),
    dustData: generateDustData('005', 0.08, 0.03, 'stable'),
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
