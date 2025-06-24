import { computed, ref } from 'vue'
import {
  getAllSensorDevices,
  getSensorSummary,
  getSiteActiveAlerts,
  getSiteData,
  getSiteSensorDevices,
  getSiteSensorSummary,
  mockAlerts,
  mockSchedules,
  mockSensorData,
  mockSites,
} from '~/data/mockSites'
import type { ChartDataPoint } from '~/types/noise'
import type {
  ConstructionSite,
  SiteAlert,
  SiteSchedule,
} from '~/types/sites'

export function useMultiSiteData() {
  const selectedSiteId = ref<string | null>(null)
  const sites = ref<ConstructionSite[]>(mockSites)
  const schedules = ref<SiteSchedule[]>(mockSchedules)
  const alerts = ref<SiteAlert[]>(mockAlerts)

  // Computed properties
  const selectedSite = computed(() => {
    if (!selectedSiteId.value)
      return null
    return sites.value.find(site => site.id === selectedSiteId.value)
  })

  const selectedSiteData = computed(() => {
    if (!selectedSiteId.value)
      return null
    return getSiteData(selectedSiteId.value)
  })

  const activeSites = computed(() =>
    sites.value.filter(site => site.status === 'active'),
  )

  const inactiveSites = computed(() =>
    sites.value.filter(site => site.status === 'inactive'),
  )

  const completedSites = computed(() =>
    sites.value.filter(site => site.status === 'completed'),
  )

  const activeAlerts = computed(() =>
    alerts.value.filter(alert => alert.status === 'active'),
  )

  const todaySchedules = computed(() =>
    schedules.value.filter(schedule =>
      schedule.status === 'pending' || schedule.status === 'in-progress',
    ),
  )

  const totalSites = computed(() => sites.value.length)
  const totalDevices = computed(() =>
    sites.value.reduce((sum, site) => sum + site.deviceCount, 0),
  )

  // Sensor summary data
  const sensorSummary = computed(() => getSensorSummary())

  const selectedSiteSensorSummary = computed(() => {
    if (!selectedSiteId.value)
      return sensorSummary.value
    return getSiteSensorSummary(selectedSiteId.value)
  })

  const selectedSiteActiveAlerts = computed(() => {
    if (!selectedSiteId.value)
      return activeAlerts.value
    return getSiteActiveAlerts(selectedSiteId.value)
  })

  const averageNoiseLevel = computed(() => {
    const activeSitesData = activeSites.value
    if (activeSitesData.length === 0)
      return 0
    const sum = activeSitesData.reduce((acc, site) => acc + site.noiseLevel, 0)
    return Math.round(sum / activeSitesData.length)
  })

  const averageDustLevel = computed(() => {
    const activeSitesData = activeSites.value
    if (activeSitesData.length === 0)
      return 0
    const sum = activeSitesData.reduce((acc, site) => acc + site.dustLevel, 0)
    return Math.round((sum / activeSitesData.length) * 100) / 100
  })

  // Chart data for selected site
  const selectedSiteNoiseChartData = computed((): ChartDataPoint[] => {
    if (!selectedSiteId.value)
      return []

    const sensorData = mockSensorData[selectedSiteId.value as keyof typeof mockSensorData]
    if (!sensorData)
      return []

    return sensorData.noiseData.map((item) => {
      const date = new Date(item.timestamp)
      return {
        x: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        y: item.noise_level,
      }
    })
  })

  const selectedSiteDustChartData = computed((): ChartDataPoint[] => {
    if (!selectedSiteId.value)
      return []

    const sensorData = mockSensorData[selectedSiteId.value as keyof typeof mockSensorData]
    if (!sensorData)
      return []

    return sensorData.dustData.map((item) => {
      const date = new Date(item.timestamp)
      return {
        x: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        y: item.dust_level,
      }
    })
  })

  // Site-specific statistics
  const selectedSiteStats = computed(() => {
    if (!selectedSiteId.value)
      return null

    const sensorData = mockSensorData[selectedSiteId.value as keyof typeof mockSensorData]
    if (!sensorData)
      return null

    const noiseLevels = sensorData.noiseData.map(d => d.noise_level)
    const dustLevels = sensorData.dustData.map(d => d.dust_level)

    return {
      averageNoise: Math.round((noiseLevels.reduce((a, b) => a + b, 0) / noiseLevels.length) * 10) / 10,
      maxNoise: Math.max(...noiseLevels),
      minNoise: Math.min(...noiseLevels),
      averageDust: Math.round((dustLevels.reduce((a, b) => a + b, 0) / dustLevels.length) * 100) / 100,
      maxDust: Math.max(...dustLevels),
      minDust: Math.min(...dustLevels),
    }
  })

  // Sensor device data
  const allSensorDevices = computed(() => getAllSensorDevices())

  const selectedSiteSensorDevices = computed(() => {
    if (!selectedSiteId.value)
      return allSensorDevices.value
    return getSiteSensorDevices(selectedSiteId.value)
  })

  const selectedSiteSensorSummaryWithTotal = computed(() => {
    const summary = selectedSiteSensorSummary.value
    const totalDevices = selectedSiteSensorDevices.value.length
    return {
      ...summary,
      totalDevices,
    }
  })

  // Methods
  const selectSite = (siteId: string) => {
    selectedSiteId.value = siteId
  }

  const clearSelection = () => {
    selectedSiteId.value = null
  }

  const getSiteById = (id: string) => {
    return sites.value.find(site => site.id === id)
  }

  const getSiteSchedules = (siteId: string) => {
    return schedules.value.filter(schedule => schedule.siteId === siteId)
  }

  const getSiteAlerts = (siteId: string) => {
    return alerts.value.filter(alert => alert.siteId === siteId)
  }

  const acknowledgeAlert = (alertId: string, acknowledgedBy: string) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'acknowledged'
      alert.acknowledgedAt = new Date().toISOString()
      alert.acknowledgedBy = acknowledgedBy
    }
  }

  const resolveAlert = (alertId: string, resolvedBy: string) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'resolved'
      alert.resolvedAt = new Date().toISOString()
      alert.resolvedBy = resolvedBy
    }
  }

  const updateScheduleStatus = (scheduleId: string, status: SiteSchedule['status']) => {
    const schedule = schedules.value.find(s => s.id === scheduleId)
    if (schedule) {
      schedule.status = status
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10B981' // green
      case 'inactive': return '#F59E0B' // yellow
      case 'completed': return '#6B7280' // gray
      default: return '#6B7280'
    }
  }

  const getAlertSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#EF4444' // red
      case 'high': return '#F97316' // orange
      case 'medium': return '#F59E0B' // yellow
      case 'low': return '#10B981' // green
      default: return '#6B7280' // gray
    }
  }

  const getSchedulePriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#EF4444' // red
      case 'high': return '#F97316' // orange
      case 'medium': return '#F59E0B' // yellow
      case 'low': return '#10B981' // green
      default: return '#6B7280' // gray
    }
  }

  return {
    // State
    sites: readonly(sites),
    schedules: readonly(schedules),
    alerts: readonly(alerts),
    selectedSiteId: readonly(selectedSiteId),

    // Computed
    selectedSite,
    selectedSiteData,
    activeSites,
    inactiveSites,
    completedSites,
    activeAlerts,
    todaySchedules,
    totalSites,
    totalDevices,
    sensorSummary,
    selectedSiteSensorSummary,
    selectedSiteActiveAlerts,
    averageNoiseLevel,
    averageDustLevel,
    selectedSiteNoiseChartData,
    selectedSiteDustChartData,
    selectedSiteStats,
    allSensorDevices,
    selectedSiteSensorDevices,
    selectedSiteSensorSummaryWithTotal,

    // Methods
    selectSite,
    clearSelection,
    getSiteById,
    getSiteSchedules,
    getSiteAlerts,
    acknowledgeAlert,
    resolveAlert,
    updateScheduleStatus,
    getStatusColor,
    getAlertSeverityColor,
    getSchedulePriorityColor,
  }
}
