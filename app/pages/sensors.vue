<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import SensorDetailModal from '~/components/common/SensorDetailModal.vue'
import { mockVesselGPSModules } from '~/data/mockVessels'
import type { VesselGPSModule } from '~/types/vessels'

const search = ref('')
const filterVesselType = ref('')
const filterStatus = ref('')
const selectedVessel = ref<VesselGPSModule | null>(null)

const filteredVessels = computed(() => {
  return mockVesselGPSModules.filter((vessel) => {
    const matchesSearch
      = vessel.name.toLowerCase().includes(search.value.toLowerCase())
        || vessel.location.toLowerCase().includes(search.value.toLowerCase())
        || vessel.vesselType.toLowerCase().includes(search.value.toLowerCase())
        || vessel.captain.toLowerCase().includes(search.value.toLowerCase())

    const matchesType = !filterVesselType.value || vessel.vesselType === filterVesselType.value
    const matchesStatus = !filterStatus.value || vessel.status === filterStatus.value

    return matchesSearch && matchesType && matchesStatus
  })
})

const activeVesselsCount = computed(() =>
  filteredVessels.value.filter(v => v.status === 'active').length,
)

const maintenanceVesselsCount = computed(() =>
  filteredVessels.value.filter(v => v.status === 'maintenance').length,
)

const offlineVesselsCount = computed(() =>
  filteredVessels.value.filter(v => v.status === 'offline' || v.status === 'inactive').length,
)

function statusClass(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function batteryClass(level: number) {
  if (level >= 80)
    return 'text-green-600 dark:text-green-400'
  if (level >= 50)
    return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function batteryColorClass(level: number) {
  if (level >= 80)
    return 'bg-green-500'
  if (level >= 50)
    return 'bg-yellow-500'
  return 'bg-red-500'
}

function signalClass(level: number) {
  if (level >= 80)
    return 'text-green-600 dark:text-green-400'
  if (level >= 50)
    return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function signalColorClass(level: number) {
  if (level >= 80)
    return 'bg-green-500'
  if (level >= 50)
    return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatTime(timestamp: string | undefined) {
  if (!timestamp)
    return 'N/A'
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
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

function getVesselTypeColor(vesselType: string) {
  switch (vesselType) {
    case 'container': return 'text-blue-600 dark:text-blue-400'
    case 'bulk': return 'text-orange-600 dark:text-orange-400'
    case 'tanker': return 'text-red-600 dark:text-red-400'
    case 'passenger': return 'text-purple-600 dark:text-purple-400'
    case 'fishing': return 'text-green-600 dark:text-green-400'
    case 'tug': return 'text-gray-600 dark:text-gray-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

function openVessel(vessel: VesselGPSModule) {
  selectedVessel.value = vessel
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vessel GPS Module Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Monitor and manage all vessel GPS modules across the port. Click a vessel for detailed information and real-time tracking data.
        </p>
      </div>

      <!-- Filters and Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-wrap items-center gap-4 mb-4">
          <!-- Search -->
          <div class="flex-1 min-w-64">
            <input
              v-model="search"
              type="text"
              placeholder="Search by vessel name, location, or captain..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>

          <!-- Vessel Type Filter -->
          <select
            v-model="filterVesselType"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">
              All Vessel Types
            </option>
            <option value="container">
              Container Ships
            </option>
            <option value="bulk">
              Bulk Carriers
            </option>
            <option value="tanker">
              Tankers
            </option>
            <option value="passenger">
              Passenger Ships
            </option>
            <option value="fishing">
              Fishing Vessels
            </option>
            <option value="tug">
              Tugboats
            </option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">
              All Status
            </option>
            <option value="active">
              Active
            </option>
            <option value="inactive">
              Inactive
            </option>
            <option value="maintenance">
              Maintenance
            </option>
            <option value="offline">
              Offline
            </option>
          </select>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ filteredVessels.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total Vessels
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ activeVesselsCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Active
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ maintenanceVesselsCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Maintenance
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ offlineVesselsCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Offline
            </div>
          </div>
        </div>
      </div>

      <!-- Vessels Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vessel
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Battery
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Signal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Speed & Heading
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="vessel in filteredVessels"
                :key="vessel.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                @click="openVessel(vessel)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <Icon
                          :icon="getVesselTypeIcon(vessel.vesselType)"
                          class="w-5 h-5 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ vessel.name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ vessel.captain }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getVesselTypeColor(vessel.vesselType)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <Icon :icon="getVesselTypeIcon(vessel.vesselType)" class="w-3 h-3 mr-1" />
                    {{ vessel.vesselType.charAt(0).toUpperCase() + vessel.vesselType.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center">
                    <Icon icon="heroicons:map-pin" class="w-4 h-4 text-gray-400 mr-1" />
                    {{ vessel.location }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="statusClass(vessel.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ vessel.status.charAt(0).toUpperCase() + vessel.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="batteryColorClass(vessel.batteryLevel)"
                        :style="{ width: `${vessel.batteryLevel}%` }"
                      />
                    </div>
                    <span :class="batteryClass(vessel.batteryLevel)" class="text-sm font-medium">
                      {{ vessel.batteryLevel }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="signalColorClass(vessel.signalStrength)"
                        :style="{ width: `${vessel.signalStrength}%` }"
                      />
                    </div>
                    <span :class="signalClass(vessel.signalStrength)" class="text-sm font-medium">
                      {{ vessel.signalStrength }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">
                    <span class="font-medium">{{ vessel.speed }} knots</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">@ {{ vessel.heading }}°</span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(vessel.lastReading) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <button
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white dark:text-black bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tenang-primary/50 dark:focus:ring-tenang-primary-dark/50 transition-colors"
                    @click.stop="openVessel(vessel)"
                  >
                    <Icon icon="heroicons:eye" class="w-3 h-3 mr-1" />
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredVessels.length === 0" class="text-center py-12">
          <Icon icon="mdi:ship-wheel" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No vessels found
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>

      <!-- Vessel Detail Modal -->
      <SensorDetailModal
        v-if="selectedVessel"
        :sensor="selectedVessel"
        @close="selectedVessel = null"
      />
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the sensors page */
</style>
