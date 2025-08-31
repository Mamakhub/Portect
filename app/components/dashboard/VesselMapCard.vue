<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Vessel } from '~/types/vessels';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Props
interface Props {
  onVesselSelect?: (vessel: Vessel) => void
}

const props = withDefaults(defineProps<Props>(), {
  onVesselSelect: undefined,
})

// Composables - use the new vessel data
const {
  allVessels,
  allPortZones,
  selectedVessel,
  selectedVesselId,
  selectVessel,
  clearSelection,
  getStatusColor,
  getVesselById,
  getVesselTypeColor,
} = useVesselData()

// Map state
const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const vesselMarkers = ref<any[]>([])
const zoneLayers = ref<any[]>([])

// Map configuration - centered on Port Klang area
const mapConfig = {
  center: [2.8500, 101.3000] as [number, number], // Port Klang center
  zoom: 10,
  minZoom: 10,
  maxZoom: 18,
}

// Computed map markers from vessel data
const mapMarkers = computed(() => {
  return allVessels.value.map(vessel => ({
    id: vessel.id,
    position: vessel.coordinates,
    title: vessel.name,
    status: vessel.status,
    vesselType: vessel.vesselType,
    color: getVesselTypeColor(vessel.vesselType),
    statusColor: getStatusColor(vessel.status),
    data: vessel,
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

    // Add port zones
    addPortZones(L)

    // Add vessel markers
    addVesselMarkers(L)

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

function addPortZones(L: any) {
  // Clear existing zone layers
  zoneLayers.value.forEach((layer) => {
    if (map.value) {
      map.value.removeLayer(layer)
    }
  })
  zoneLayers.value = []

  // Add new zone layers
  allPortZones.value.forEach((zone) => {
    const polygon = L.polygon(zone.coordinates, {
      color: zone.color,
      weight: 2,
      opacity: 0.8,
      fillColor: zone.color,
      fillOpacity: 0.2,
    })

    // Create popup content for zones
    const popupContent = `
      <div class="p-3 min-w-[200px]">
        <h3 class="font-semibold text-gray-900 text-sm mb-1">${zone.name}</h3>
        <p class="text-xs text-gray-600 mb-2">${zone.description}</p>
        <div class="text-xs">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            ${zone.type.replace('_', ' ')}
          </span>
        </div>
      </div>
    `

    polygon.bindPopup(popupContent)
    polygon.addTo(map.value)
    zoneLayers.value.push(polygon)
  })
}

function addVesselMarkers(L: any) {
  // Clear existing markers
  vesselMarkers.value.forEach((marker) => {
    if (map.value) {
      map.value.removeLayer(marker)
    }
  })
  vesselMarkers.value = []

  // Add new vessel markers
  mapMarkers.value.forEach((markerData) => {
    // Create vessel icon with direction indicator
    const vesselIcon = L.divIcon({
      className: 'vessel-marker',
      html: `
        <div class="relative">
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center" 
               style="background-color: ${markerData.color}">
            <div class="w-2 h-2 rounded-full" style="background-color: ${markerData.statusColor}"></div>
          </div>
          <div class="absolute top-1/2 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white transform -translate-x-1/2 -translate-y-1/2 rotate-${markerData.data.heading}"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    const marker = L.marker(markerData.position, { icon: vesselIcon })

    // Create popup content with enhanced vessel information
    const popupContent = `
      <div class="p-3 min-w-[250px]">
        <h3 class="font-semibold text-gray-900 text-sm mb-1">${markerData.title}</h3>
        <p class="text-xs text-gray-600 mb-2">${markerData.data.vesselType.toUpperCase()}</p>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Status:</span>
            <span class="font-medium" style="color: ${markerData.statusColor}">
              ${markerData.status.charAt(0).toUpperCase() + markerData.status.slice(1)}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Speed:</span>
            <span class="font-medium">${markerData.data.speed} knots</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Heading:</span>
            <span class="font-medium">${markerData.data.heading}°</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Destination:</span>
            <span class="font-medium">${markerData.data.destination}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">ETA:</span>
            <span class="font-medium">${new Date(markerData.data.eta).toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Signal:</span>
            <span class="font-medium">${markerData.data.signalStrength}%</span>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <button 
            class="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onclick="window.selectVesselFromMap('${markerData.id}')"
          >
            Select Vessel
          </button>
          <button 
            class="w-full px-2 py-1 text-xs bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 transition-colors"
            onclick="window.viewVesselDetails('${markerData.id}')"
          >
            View Details
          </button>
        </div>
      </div>
    `

    marker.bindPopup(popupContent)
    marker.addTo(map.value)
    vesselMarkers.value.push(marker)

    // Handle marker click
    marker.on('click', () => {
      const vessel = getVesselById(markerData.id)
      if (vessel) {
        selectVessel(vessel.id)
        if (props.onVesselSelect) {
          props.onVesselSelect(vessel)
        }
      }
    })
  })
}

function handleVesselSelectFromMap(vesselId: string) {
  const vessel = getVesselById(vesselId)
  if (vessel) {
    selectVessel(vessel.id)
    if (props.onVesselSelect) {
      props.onVesselSelect(vessel)
    }
  }
}

function handleViewVesselDetails(vesselId: string) {
  // Navigate to vessel details page
  if (typeof window !== 'undefined') {
    window.location.href = `/vessel/${vesselId}`
  }
}

// Watch for changes in selected vessel and update map
watch(selectedVesselId, (newVesselId) => {
  if (map.value && newVesselId) {
    const vessel = getVesselById(newVesselId)
    if (vessel) {
      // Pan to selected vessel
      map.value.setView(vessel.lastKnownPosition, 14)

      // Highlight the selected marker
      vesselMarkers.value.forEach((marker, index) => {
        const markerData = mapMarkers.value[index]
        if (markerData.id === newVesselId) {
          marker.getElement()?.classList.add('selected-vessel')
        }
        else {
          marker.getElement()?.classList.remove('selected-vessel')
        }
      })
    }
  }
})

// Expose methods globally for popup buttons
if (typeof window !== 'undefined') {
  ;(window as any).selectVesselFromMap = handleVesselSelectFromMap
  ;(window as any).viewVesselDetails = handleViewVesselDetails
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
          Vessel GPS Tracking
        </h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 rounded-full bg-blue-500" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Container</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 rounded-full bg-purple-500" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Tanker</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 rounded-full bg-green-500" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Passenger</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 rounded-full bg-orange-500" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Tug</span>
            </div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ allVessels.length }} vessels tracked
          </div>
        </div>
      </div>
    </template>

    <!-- Selected Vessel Info -->
    <div v-if="selectedVessel" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ selectedVessel.name }}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ selectedVessel.vesselType.toUpperCase() }} • {{ selectedVessel.flag }}
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
          <span class="text-gray-500">Speed:</span>
          <span class="font-medium ml-1">{{ selectedVessel.speed }} knots</span>
        </div>
        <div>
          <span class="text-gray-500">Heading:</span>
          <span class="font-medium ml-1">{{ selectedVessel.heading }}°</span>
        </div>
        <div>
          <span class="text-gray-500">Destination:</span>
          <span class="font-medium ml-1">{{ selectedVessel.destination }}</span>
        </div>
        <div>
          <span class="text-gray-500">Status:</span>
          <span
            class="font-medium ml-1 capitalize"
            :style="{ color: getStatusColor(selectedVessel.status) }"
          >
            {{ selectedVessel.status }}
          </span>
        </div>
      </div>
      <div class="mt-3 flex space-x-2">
        <NuxtLink
          :to="`/vessel/${selectedVessel.id}`"
          class="flex-1 px-3 py-1 text-xs bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 transition-colors text-center"
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
      class="h-96 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative"
      style="z-index: 1;"
    />

    <!-- Vessel List -->
    <div class="mt-4">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
        All Vessels ({{ allVessels.length }})
      </h4>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="vessel in allVessels"
          :key="vessel.id"
          class="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': selectedVessel?.id === vessel.id }"
          @click="selectVessel(vessel.id)"
        >
          <div class="flex items-center space-x-2">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: getVesselTypeColor(vessel.vesselType) }"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ vessel.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ vessel.vesselType.toUpperCase() }} • {{ vessel.flag }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-900 dark:text-white">
              {{ vessel.speed }} knots
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ vessel.destination }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </CommonAppCard>
</template>

<style scoped>
.vessel-marker {
  background: transparent;
  border: none;
}

.selected-vessel {
  transform: scale(1.2);
  z-index: 1000;
}
</style>
