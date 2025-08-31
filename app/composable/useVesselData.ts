import { computed, ref } from 'vue'
import { portZones, vesselAlerts, vessels, vesselSchedules } from '~/data/mockVessels'
import type { Vessel, VesselAlert, VesselSchedule } from '~/types/vessels'

export function useVesselData() {
  // Reactive state
  const allVessels = ref<any[]>(vessels)
  const allAlerts = ref<any[]>(vesselAlerts)
  const allSchedules = ref<any[]>(vesselSchedules)
  const allPortZones = ref<any[]>(portZones)
  const selectedVesselId = ref<string | null>(null)

  // Computed properties
  const selectedVessel = computed(() => {
    if (!selectedVesselId.value) return null
    return allVessels.value.find(vessel => vessel.id === selectedVesselId.value) || null
  })

  const activeVessels = computed(() => {
    return allVessels.value.filter(vessel => vessel.status === 'active')
  })

  const vesselsByType = computed(() => {
    const grouped: Record<string, Vessel[]> = {}
    allVessels.value.forEach(vessel => {
      if (!grouped[vessel.vesselType]) {
        grouped[vessel.vesselType] = []
      }
      grouped[vessel.vesselType].push(vessel)
    })
    return grouped
  })

  const activeAlerts = computed(() => {
    return allAlerts.value.filter(alert => alert.status === 'active')
  })

  const alertsByVessel = computed(() => {
    const grouped: Record<string, VesselAlert[]> = {}
    allAlerts.value.forEach(alert => {
      if (!grouped[alert.vesselId]) {
        grouped[alert.vesselId] = []
      }
      grouped[alert.vesselId].push(alert)
    })
    return grouped
  })

  const schedulesByVessel = computed(() => {
    const grouped: Record<string, VesselSchedule[]> = {}
    allSchedules.value.forEach(schedule => {
      if (!grouped[schedule.vesselId]) {
        grouped[schedule.vesselId] = []
      }
      grouped[schedule.vesselId].push(schedule)
    })
    return grouped
  })

  const todaySchedules = computed(() => {
    const today = new Date().toDateString()
    return allSchedules.value.filter(schedule => {
      const scheduleDate = new Date(schedule.time).toDateString()
      return scheduleDate === today
    })
  })

  // Methods
  function selectVessel(vesselId: string) {
    selectedVesselId.value = vesselId
  }

  function clearSelection() {
    selectedVesselId.value = null
  }

  function getVesselById(vesselId: string): any | null {
    return allVessels.value.find(vessel => vessel.id === vesselId) || null
  }

  function getVesselAlerts(vesselId: string): VesselAlert[] {
    return allAlerts.value.filter(alert => alert.vesselId === vesselId)
  }

  function getVesselSchedules(vesselId: string): VesselSchedule[] {
    return allSchedules.value.filter(schedule => schedule.vesselId === vesselId)
  }

  function getVesselGpsDevices(vesselId: string): any[] {
    const vessel = getVesselById(vesselId)
    // For VesselGPSModule, treat the vessel itself as a GPS device
    return vessel ? [vessel] : []
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return '#10B981' // green
      case 'inactive':
        return '#6B7280' // gray
      case 'maintenance':
        return '#F59E0B' // yellow
      case 'offline':
        return '#EF4444' // red
      default:
        return '#6B7280' // gray
    }
  }

  function getVesselTypeColor(vesselType: string): string {
    switch (vesselType) {
      case 'container':
        return '#3B82F6' // blue
      case 'tanker':
        return '#8B5CF6' // purple
      case 'cargo':
        return '#F59E0B' // yellow
      case 'passenger':
        return '#10B981' // green
      case 'fishing':
        return '#06B6D4' // cyan
      case 'tug':
        return '#F97316' // orange
      case 'barge':
        return '#6B7280' // gray
      default:
        return '#6B7280' // gray
    }
  }

  function getAlertSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return '#EF4444' // red
      case 'high':
        return '#F97316' // orange
      case 'medium':
        return '#F59E0B' // yellow
      case 'low':
        return '#10B981' // green
      default:
        return '#6B7280' // gray
    }
  }

  function acknowledgeAlert(alertId: string, acknowledgedBy: string) {
    const alert = allAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'acknowledged'
      alert.acknowledgedAt = new Date().toISOString()
      alert.acknowledgedBy = acknowledgedBy
    }
  }

  function resolveAlert(alertId: string, resolvedBy: string) {
    const alert = allAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'resolved'
      alert.resolvedAt = new Date().toISOString()
      alert.resolvedBy = resolvedBy
    }
  }

  function archiveAlert(alertId: string) {
    const alert = allAlerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'archived'
      alert.archivedAt = new Date().toISOString()
    }
  }

  function updateScheduleStatus(scheduleId: string, status: string) {
    const schedule = allSchedules.value.find(s => s.id === scheduleId)
    if (schedule) {
      schedule.status = status as any
    }
  }

  function getVesselStats(vesselId: string) {
    const vessel = getVesselById(vesselId)
    if (!vessel) return null

    const alerts = getVesselAlerts(vesselId)
    const schedules = getVesselSchedules(vesselId)
    const gpsDevices = getVesselGpsDevices(vesselId)

    return {
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => a.status === 'active').length,
      totalSchedules: schedules.length,
      pendingSchedules: schedules.filter(s => s.status === 'pending').length,
      totalGpsDevices: gpsDevices.length,
      activeGpsDevices: gpsDevices.filter(d => d.status === 'active').length,
    }
  }

  function getPortStats() {
    return {
      totalVessels: allVessels.value.length,
      activeVessels: activeVessels.value.length,
      totalAlerts: allAlerts.value.length,
      activeAlerts: activeAlerts.value.length,
      todaySchedules: todaySchedules.value.length,
      vesselsByType: Object.keys(vesselsByType.value).length,
    }
  }

  return {
    // State
    allVessels,
    allAlerts,
    allSchedules,
    allPortZones,
    selectedVesselId,
    
    // Computed
    selectedVessel,
    activeVessels,
    vesselsByType,
    activeAlerts,
    alertsByVessel,
    schedulesByVessel,
    todaySchedules,
    
    // Methods
    selectVessel,
    clearSelection,
    getVesselById,
    getVesselAlerts,
    getVesselSchedules,
    getVesselGpsDevices,
    getStatusColor,
    getVesselTypeColor,
    getAlertSeverityColor,
    acknowledgeAlert,
    resolveAlert,
    archiveAlert,
    updateScheduleStatus,
    getVesselStats,
    getPortStats,
  }
}
