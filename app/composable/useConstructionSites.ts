import { computed, ref } from 'vue'
import type { ConstructionSite, MapMarker } from '~/types/sites'

export function useConstructionSites() {
  const sites = ref<ConstructionSite[]>([
    {
      id: 'site-001',
      name: 'Downtown Office Complex',
      location: 'Kuala Lumpur City Center',
      coordinates: [3.1390, 101.6869], // KLCC coordinates
      status: 'active',
      noiseLevel: 78,
      dustLevel: 0.82,
      lastUpdated: '2024-01-24T09:30:00Z',
      deviceCount: 15,
      description: 'High-rise office building construction',
    },
    {
      id: 'site-002',
      name: 'Subang Airport Extension',
      location: 'Subang, Selangor',
      coordinates: [3.1301, 101.5491], // Subang Airport coordinates
      status: 'active',
      noiseLevel: 65,
      dustLevel: 0.45,
      lastUpdated: '2024-01-24T09:25:00Z',
      deviceCount: 12,
      description: 'Airport runway extension project',
    },
    {
      id: 'site-003',
      name: 'Petaling Jaya Mall',
      location: 'Petaling Jaya, Selangor',
      coordinates: [3.0738, 101.5183], // PJ coordinates
      status: 'inactive',
      noiseLevel: 42,
      dustLevel: 0.12,
      lastUpdated: '2024-01-24T08:15:00Z',
      deviceCount: 8,
      description: 'Shopping mall renovation',
    },
    {
      id: 'site-004',
      name: 'Cyberjaya Tech Hub',
      location: 'Cyberjaya, Selangor',
      coordinates: [2.9186, 101.6525], // Cyberjaya coordinates
      status: 'active',
      noiseLevel: 72,
      dustLevel: 0.68,
      lastUpdated: '2024-01-24T09:28:00Z',
      deviceCount: 20,
      description: 'Technology campus development',
    },
    {
      id: 'site-005',
      name: 'Putrajaya Bridge',
      location: 'Putrajaya',
      coordinates: [2.9264, 101.6964], // Putrajaya coordinates
      status: 'completed',
      noiseLevel: 35,
      dustLevel: 0.08,
      lastUpdated: '2024-01-24T07:45:00Z',
      deviceCount: 5,
      description: 'Bridge construction completed',
    },
  ])

  const selectedSite = ref<ConstructionSite | null>(null)

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10B981' // green
      case 'inactive': return '#F59E0B' // yellow
      case 'completed': return '#6B7280' // gray
      default: return '#6B7280'
    }
  }

  const mapMarkers = computed((): MapMarker[] => {
    return sites.value.map(site => ({
      id: site.id,
      position: site.coordinates,
      title: site.name,
      status: site.status,
      color: getStatusColor(site.status),
      data: site,
    }))
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

  const totalSites = computed(() => sites.value.length)
  const totalDevices = computed(() =>
    sites.value.reduce((sum, site) => sum + site.deviceCount, 0),
  )

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

  const selectSite = (site: ConstructionSite) => {
    selectedSite.value = site
  }

  const clearSelection = () => {
    selectedSite.value = null
  }

  const getSiteById = (id: string) => {
    return sites.value.find(site => site.id === id)
  }

  const updateSiteStatus = (siteId: string, status: ConstructionSite['status']) => {
    const site = sites.value.find(s => s.id === siteId)
    if (site) {
      site.status = status
    }
  }

  return {
    sites: readonly(sites),
    selectedSite: readonly(selectedSite),
    mapMarkers,
    activeSites,
    inactiveSites,
    completedSites,
    totalSites,
    totalDevices,
    averageNoiseLevel,
    averageDustLevel,
    selectSite,
    clearSelection,
    getSiteById,
    updateSiteStatus,
    getStatusColor,
  }
}
