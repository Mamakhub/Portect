<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { ConstructionSite } from '~/types/sites'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Props
interface Props {
  onSiteSelect?: (site: ConstructionSite) => void
}

const props = withDefaults(defineProps<Props>(), {
  onSiteSelect: undefined,
})

// Composables - use the new multi-site data
const {
  sites,
  selectedSite,
  selectedSiteId,
  selectSite,
  clearSelection,
  getStatusColor,
  getSiteById,
} = useMultiSiteData()

// Map state
const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const markers = ref<any[]>([])

// Map configuration
const mapConfig = {
  center: [3.1390, 101.6869] as [number, number], // KLCC as center
  zoom: 10,
  minZoom: 8,
  maxZoom: 18,
}

// Computed map markers from multi-site data
const mapMarkers = computed(() => {
  return sites.value.map(site => ({
    id: site.id,
    position: site.coordinates,
    title: site.name,
    status: site.status,
    color: getStatusColor(site.status),
    data: site,
  }))
})

// Methods
function initializeMap() {
  if (!mapContainer.value)
    return

  // Import Leaflet dynamically to avoid SSR issues
  import('leaflet').then((L) => {
    // Set up map
    map.value = L.map(mapContainer.value!).setView(mapConfig.center, mapConfig.zoom)

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: mapConfig.maxZoom,
      minZoom: mapConfig.minZoom,
    }).addTo(map.value)

    // Add markers
    addMarkers(L)

    // Handle map click to clear selection
    map.value.on('click', () => {
      clearSelection()
    })

    // Force map refresh after a short delay to ensure proper rendering
    setTimeout(() => {
      map.value?.invalidateSize()
    }, 100)
  })
}

function addMarkers(L: any) {
  // Clear existing markers
  markers.value.forEach((marker) => {
    if (map.value) {
      map.value.removeLayer(marker)
    }
  })
  markers.value = []

  // Add new markers
  mapMarkers.value.forEach((markerData) => {
    const marker = L.circleMarker(markerData.position, {
      radius: 12,
      fillColor: markerData.color,
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    })

    // Create popup content with enhanced information
    const popupContent = `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-semibold text-gray-900 text-sm mb-1">${markerData.title}</h3>
        <p class="text-xs text-gray-600 mb-2">${markerData.data.location}</p>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Status:</span>
            <span class="font-medium" style="color: ${markerData.color}">
              ${markerData.status.charAt(0).toUpperCase() + markerData.status.slice(1)}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Noise:</span>
            <span class="font-medium">${markerData.data.noiseLevel} dB</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Dust:</span>
            <span class="font-medium">${markerData.data.dustLevel} mg/m³</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Progress:</span>
            <span class="font-medium">${markerData.data.progress}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Devices:</span>
            <span class="font-medium">${markerData.data.deviceCount}</span>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <button 
            class="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onclick="window.selectSiteFromMap('${markerData.id}')"
          >
            Select Site
          </button>
          <button 
            class="w-full px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onclick="window.viewSiteDetails('${markerData.id}')"
          >
            View Details
          </button>
        </div>
      </div>
    `

    marker.bindPopup(popupContent)
    marker.addTo(map.value)
    markers.value.push(marker)

    // Handle marker click
    marker.on('click', () => {
      const site = getSiteById(markerData.id)
      if (site) {
        selectSite(site.id)
        if (props.onSiteSelect) {
          props.onSiteSelect(site)
        }
      }
    })
  })
}

function handleSiteSelectFromMap(siteId: string) {
  const site = getSiteById(siteId)
  if (site) {
    selectSite(site.id)
    if (props.onSiteSelect) {
      props.onSiteSelect(site)
    }
  }
}

function handleViewSiteDetails(siteId: string) {
  // Navigate to site details page
  if (typeof window !== 'undefined') {
    window.location.href = `/site/${siteId}`
  }
}

// Watch for changes in selected site and update map
watch(selectedSiteId, (newSiteId) => {
  if (map.value && newSiteId) {
    const site = getSiteById(newSiteId)
    if (site) {
      // Pan to selected site
      map.value.setView(site.coordinates, 14)

      // Highlight the selected marker
      markers.value.forEach((marker, index) => {
        const markerData = mapMarkers.value[index]
        if (markerData.id === newSiteId) {
          marker.setStyle({
            radius: 16,
            fillOpacity: 1,
            weight: 3,
          })
        }
        else {
          marker.setStyle({
            radius: 12,
            fillOpacity: 0.8,
            weight: 2,
          })
        }
      })
    }
  }
})

// Expose methods globally for popup buttons
if (typeof window !== 'undefined') {
  ;(window as any).selectSiteFromMap = handleSiteSelectFromMap
  ;(window as any).viewSiteDetails = handleViewSiteDetails
}

// Lifecycle
onMounted(() => {
  initializeMap()
})
</script>

<template>
  <CommonAppCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Construction Sites
        </h3>
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 rounded-full bg-yellow-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">Inactive</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 rounded-full bg-gray-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Selected Site Info -->
    <div v-if="selectedSite" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ selectedSite.name }}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ selectedSite.location }}
          </p>
        </div>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="clearSelection"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="mt-2 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-500">Noise Level:</span>
          <span class="font-medium ml-1">{{ selectedSite.noiseLevel }} dB</span>
        </div>
        <div>
          <span class="text-gray-500">Dust Level:</span>
          <span class="font-medium ml-1">{{ selectedSite.dustLevel }} mg/m³</span>
        </div>
        <div>
          <span class="text-gray-500">Progress:</span>
          <span class="font-medium ml-1">{{ selectedSite.progress }}%</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span
            class="font-medium ml-1 capitalize"
            :style="{ color: getStatusColor(selectedSite.status) }"
          >
            {{ selectedSite.status }}
          </span>
        </div>
      </div>
      <div class="mt-3 flex space-x-2">
        <NuxtLink
          :to="`/site/${selectedSite.id}`"
          class="flex-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
        >
          View Details
        </NuxtLink>
        <button
          class="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          @click="clearSelection"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Map Container -->
    <div
      ref="mapContainer"
      class="h-64 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative"
      style="z-index: 1;"
    />

    <!-- Site List -->
    <div class="mt-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
        All Sites ({{ sites.length }})
      </h4>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="site in sites"
          :key="site.id"
          class="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedSite?.id === site.id }"
          @click="selectSite(site.id)"
        >
          <div class="flex items-center space-x-2">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: getStatusColor(site.status) }"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ site.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ site.location }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-900 dark:text-white">
              {{ site.noiseLevel }} dB
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ site.progress }}% complete
            </p>
          </div>
        </div>
      </div>
    </div>
  </CommonAppCard>
</template>

<style scoped>
/* Leaflet CSS will be imported dynamically */
</style>
