<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="closeModal">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 p-6 relative" @click.stop>
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" 
        @click="closeModal"
      >
        <Icon icon="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ vessel.name }}</h2>
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span class="flex items-center gap-1">
            <Icon :icon="getVesselTypeIcon(vessel.vesselType)" class="w-4 h-4" />
            {{ vessel.vesselType.charAt(0).toUpperCase() + vessel.vesselType.slice(1) }} Vessel
          </span>
          <span class="flex items-center gap-1">
            <Icon icon="heroicons:map-pin" class="w-4 h-4" />
            {{ vessel.location }}
          </span>
          <span class="flex items-center gap-1">
            <Icon icon="heroicons:clock" class="w-4 h-4" />
            {{ formatTime(vessel.lastReading) }}
          </span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Vessel Details -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vessel Information</h3>
            
            <!-- Status Badge -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
              <span :class="statusClass(vessel.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ vessel.status.charAt(0).toUpperCase() + vessel.status.slice(1) }}
              </span>
            </div>

            <!-- Current Speed & Heading -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Speed</span>
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ vessel.speed }} <span class="text-sm">knots</span>
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Heading</span>
              <span class="text-lg font-bold text-green-600 dark:text-green-400">
                {{ vessel.heading }}°
              </span>
            </div>

            <!-- Signal Strength -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Signal</span>
                <span :class="signalClass(vessel.signalStrength)" class="text-sm font-semibold">
                  {{ vessel.signalStrength }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300" 
                  :class="signalColorClass(vessel.signalStrength)"
                  :style="{ width: `${vessel.signalStrength}%` }"
                ></div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Captain:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.captain }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Destination:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.destination }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">ETA:</span>
                <span class="text-gray-900 dark:text-white">{{ formatTime(vessel.eta) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">IMO:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.imo }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">MMSI:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.mmsi }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">GPS Model:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.model }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Firmware:</span>
                <span class="text-gray-900 dark:text-white">{{ vessel.firmware }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Installed:</span>
                <span class="text-gray-900 dark:text-white">{{ formatDate(vessel.installDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vessel Location & Tracking
            </h3>
            <div class="h-80">
              <div
                ref="mapContainer"
                class="h-full w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                style="z-index: 1;"
              />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Icon icon="heroicons:map-pin" class="w-4 h-4 text-gray-500" />
                  <span class="font-medium text-gray-700 dark:text-gray-300">Coordinates</span>
                </div>
                <p class="text-gray-900 dark:text-white">
                  {{ vessel.coordinates[0].toFixed(6) }}, {{ vessel.coordinates[1].toFixed(6) }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Icon icon="heroicons:arrow-trending-up" class="w-4 h-4 text-gray-500" />
                  <span class="font-medium text-gray-700 dark:text-gray-300">Movement</span>
                </div>
                <p class="text-gray-900 dark:text-white">
                  {{ vessel.speed > 0 ? 'Moving' : 'Stationary' }} @ {{ vessel.heading }}°
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import type { VesselGPSModule } from '~/types/vessels';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const props = defineProps<{ vessel: VesselGPSModule }>()
const emit = defineEmits<{ close: [] }>()

const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const vesselMarker = ref<any>(null)

// Map configuration
const mapConfig = {
  center: props.vessel.coordinates as [number, number],
  zoom: 12,
  minZoom: 8,
  maxZoom: 18,
}

function getVesselTypeIcon(vesselType: string) {
  switch (vesselType) {
    case 'container': return 'mdi:ship-wheel'
    case 'bulk': return 'mdi:cargo-van'
    case 'tanker': return 'mdi:fuel'
    case 'passenger': return 'mdi:ferry'
    case 'fishing': return 'mdi:fish'
    case 'tug': return 'mdi:anchor'
    default: return 'mdi:ship-wheel'
  }
}

function statusClass(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function signalClass(level: number) {
  if (level >= 80) return 'text-green-600 dark:text-green-400'
  if (level >= 50) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function signalColorClass(level: number) {
  if (level >= 80) return 'bg-green-500'
  if (level >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function initializeMap() {
  if (!mapContainer.value) return

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

    // Create vessel icon with direction indicator
    const vesselIcon = L.divIcon({
      className: 'vessel-marker',
      html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center" 
               style="background-color: ${getVesselTypeColor(props.vessel.vesselType)}">
            <div class="w-3 h-3 rounded-full" style="background-color: ${getStatusColor(props.vessel.status)}"></div>
          </div>
          <div class="absolute top-1/2 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white transform -translate-x-1/2 -translate-y-1/2" 
               style="transform: translate(-50%, -50%) rotate(${props.vessel.heading}deg)"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    // Add vessel marker
    vesselMarker.value = L.marker(props.vessel.coordinates, { icon: vesselIcon })

    // Create popup content
    const popupContent = `
      <div class="p-3 min-w-[250px]">
        <h3 class="font-semibold text-gray-900 text-sm mb-1">${props.vessel.name}</h3>
        <p class="text-xs text-gray-600 mb-2">${props.vessel.vesselType.toUpperCase()} • ${props.vessel.captain}</p>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Status:</span>
            <span class="font-medium" style="color: ${getStatusColor(props.vessel.status)}">
              ${props.vessel.status.charAt(0).toUpperCase() + props.vessel.status.slice(1)}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Speed:</span>
            <span class="font-medium">${props.vessel.speed} knots</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Heading:</span>
            <span class="font-medium">${props.vessel.heading}°</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Destination:</span>
            <span class="font-medium">${props.vessel.destination}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">GPS Signal:</span>
            <span class="font-medium">${props.vessel.signalStrength}%</span>
          </div>
        </div>
      </div>
    `

    vesselMarker.value.bindPopup(popupContent)
    vesselMarker.value.addTo(map.value)

    // Force map refresh after a short delay to ensure proper rendering
    setTimeout(() => {
      map.value?.invalidateSize()
    }, 100)
  })
}

function getVesselTypeColor(vesselType: string) {
  switch (vesselType) {
    case 'container': return '#3b82f6'
    case 'bulk': return '#f97316'
    case 'tanker': return '#ef4444'
    case 'passenger': return '#8b5cf6'
    case 'fishing': return '#22c55e'
    case 'tug': return '#6b7280'
    default: return '#6b7280'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return '#22c55e'
    case 'inactive': return '#6b7280'
    case 'maintenance': return '#f59e0b'
    case 'offline': return '#ef4444'
    default: return '#6b7280'
  }
}

function closeModal() {
  emit('close')
}

// Lifecycle
onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
.vessel-marker {
  background: transparent;
  border: none;
}
</style>
