<script setup lang="ts">
import { computed, onMounted } from 'vue'

// Page metadata
definePageMeta({
  title: 'Port Melaka Vessel GPS Tracking',
})

// Vessel data
const {
  allVessels,
  activeVessels,
  vesselsByType,
  activeAlerts,
  todaySchedules,
  selectedVessel,
  selectedVesselId,
  selectVessel,
  clearSelection,
  getVesselStats,
  getPortStats,
  getStatusColor,
  getVesselTypeColor,
} = useVesselData()

// Select first active vessel by default
onMounted(() => {
  const firstActiveVessel = activeVessels.value[0]
  if (firstActiveVessel) {
    selectVessel(firstActiveVessel.id)
  }
})

// Get selected vessel data
const selectedVesselStats = computed(() => {
  if (!selectedVesselId.value)
    return null
  return getVesselStats(selectedVesselId.value)
})

const portStats = computed(() => getPortStats())

function handleVesselSelectFromMap(vessel) {
  selectVessel(vessel.id)
}

function handleVesselChange(event) {
  const target = event.target
  if (target.value) {
    selectVessel(target.value)
  }
  else {
    clearSelection()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Port Overview Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Port Melaka Vessel GPS Tracking
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time monitoring and management of vessels in port waters
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ portStats.totalVessels }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total Vessels
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">
              {{ portStats.activeVessels }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Active
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-red-600">
              {{ portStats.activeAlerts }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Alerts
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vessel Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Vessel Overview
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Select a vessel to view detailed GPS tracking data
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <select
            :value="selectedVesselId || ''"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleVesselChange"
          >
            <option value="">
              All Vessels
            </option>
            <option
              v-for="vessel in allVessels"
              :key="vessel.id"
              :value="vessel.id"
            >
              {{ vessel.name }} ({{ vessel.vesselType }})
            </option>
          </select>
          <NuxtLink
            v-if="selectedVesselId"
            :to="`/vessel/${selectedVesselId}`"
            class="px-4 py-2 bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded-md hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 transition-colors"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Map Column -->
      <div class="lg:col-span-3">
        <DashboardVesselMapCard :on-vessel-select="handleVesselSelectFromMap" />
      </div>

      <!-- Right Sidebar Column -->
      <div class="space-y-6">
        <!-- Vessel Types Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Vessel Types
          </h3>
          <div class="space-y-3">
            <div
              v-for="(vessels, type) in vesselsByType"
              :key="type"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: getVesselTypeColor(type) }"
                />
                <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {{ type }}
                </span>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ vessels.length }}
              </span>
            </div>
          </div>
        </div>

        <!-- Selected Vessel Stats -->
        <div v-if="selectedVessel && selectedVesselStats" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ selectedVessel.name }} Stats
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">GPS Devices:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedVesselStats.activeGpsDevices }}/{{ selectedVesselStats.totalGpsDevices }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Battery Level:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ Math.round(selectedVesselStats.averageBatteryLevel) }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Signal Strength:</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ Math.round(selectedVesselStats.averageSignalStrength) }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Active Alerts:</span>
              <span class="text-sm font-medium text-red-600">
                {{ selectedVesselStats.activeAlerts }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Pending Schedules:</span>
              <span class="text-sm font-medium text-yellow-600">
                {{ selectedVesselStats.pendingSchedules }}
              </span>
            </div>
          </div>
        </div>

        <!-- Today's Schedules -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Today's Schedules
          </h3>
          <div v-if="todaySchedules.length > 0" class="space-y-3">
            <div
              v-for="schedule in todaySchedules.slice(0, 5)"
              :key="schedule.id"
              class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ schedule.time }}
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400': schedule.priority === 'critical',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400': schedule.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400': schedule.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400': schedule.priority === 'low',
                  }"
                >
                  {{ schedule.priority }}
                </span>
              </div>
              <div class="text-sm text-gray-900 dark:text-white font-medium">
                {{ schedule.title }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ schedule.description }}
              </div>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ schedule.assignedTo }}
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p class="text-sm">
              No scheduled activities for today
            </p>
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Active Alerts
          </h3>
          <div v-if="activeAlerts.length > 0" class="space-y-3">
            <div
              v-for="alert in activeAlerts.slice(0, 3)"
              :key="alert.id"
              class="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-red-900 dark:text-red-400 text-sm">
                  {{ alert.title }}
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400': alert.severity === 'critical',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400': alert.severity === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400': alert.severity === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400': alert.severity === 'low',
                  }"
                >
                  {{ alert.severity }}
                </span>
              </div>
              <div class="text-sm text-red-800 dark:text-red-300">
                {{ alert.message }}
              </div>
              <div class="mt-2 text-xs text-red-600 dark:text-red-400">
                {{ new Date(alert.createdAt).toLocaleString() }}
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p class="text-sm">
              No active alerts
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
