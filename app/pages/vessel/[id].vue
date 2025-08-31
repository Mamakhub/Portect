<script setup lang="ts">
import { computed } from 'vue'

// Page metadata
definePageMeta({
  title: 'Vessel Details',
})

// Get route params
const route = useRoute()
const vesselId = route.params.id as string

// Vessel data
const {
  getVesselById,
  getVesselAlerts,
  getVesselSchedules,
  getVesselGpsDevices,
  getVesselStats,
  getStatusColor,
  getVesselTypeColor,
  getAlertSeverityColor,
  acknowledgeAlert,
  resolveAlert,
  archiveAlert,
  updateScheduleStatus,
} = useVesselData()

// Computed properties
const vessel = computed(() => getVesselById(vesselId))
const vesselAlerts = computed(() => getVesselAlerts(vesselId))
const vesselSchedules = computed(() => getVesselSchedules(vesselId))
const vesselGpsDevices = computed(() => getVesselGpsDevices(vesselId))
const vesselStats = computed(() => getVesselStats(vesselId))

// Check if vessel exists
if (!vessel.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Vessel not found',
  })
}

// Methods
function handleAlertAcknowledge(alertId: string) {
  acknowledgeAlert(alertId, 'Current User')
}

function handleAlertResolve(alertId: string) {
  resolveAlert(alertId, 'Current User')
}

function handleAlertArchive(alertId: string) {
  archiveAlert(alertId)
}

function handleScheduleMarkAsDone(scheduleId: string) {
  updateScheduleStatus(scheduleId, 'completed')
}

// Set page title
useHead({
  title: `${vessel.value?.name} - Vessel Details`,
})
</script>

<template>
  <div v-if="vessel" class="space-y-6">
    <!-- Vessel Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ vessel.name }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {{ vessel.vesselType.toUpperCase() }} • {{ vessel.flag }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            IMO: {{ vessel.imoNumber }} | MMSI: {{ vessel.mmsi }} | Call Sign: {{ vessel.callSign }}
          </p>
        </div>
        <div class="text-right">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :style="{ backgroundColor: getStatusColor(vessel.status) + '20', color: getStatusColor(vessel.status) }"
          >
            {{ vessel.status.charAt(0).toUpperCase() + vessel.status.slice(1) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Vessel Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ vessel.speed }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Speed (knots)
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ vessel.heading }}°
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Heading
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ vessel.length }}m
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Length
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ vessel.grossTonnage.toLocaleString() }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Gross Tonnage
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- GPS Devices -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            GPS Devices
          </h2>
          <div class="space-y-4">
            <div
              v-for="device in vesselGpsDevices"
              :key="device.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ device.manufacturer }} {{ device.model }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ device.deviceType }} • S/N: {{ device.serialNumber }}
                  </p>
                </div>
                <div
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :style="{ backgroundColor: getStatusColor(device.status) + '20', color: getStatusColor(device.status) }"
                >
                  {{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
                </div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Signal:</span>
                  <span class="font-medium ml-1">{{ device.signalStrength }}%</span>
                </div>
                <div>
                  <span class="text-gray-500">Firmware:</span>
                  <span class="font-medium ml-1">{{ device.firmware }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Last Reading:</span>
                  <span class="font-medium ml-1">{{ new Date(device.lastReading.timestamp).toLocaleString() }}</span>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Latitude:</span>
                  <span class="font-medium ml-1">{{ device.lastReading.latitude.toFixed(6) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Longitude:</span>
                  <span class="font-medium ml-1">{{ device.lastReading.longitude.toFixed(6) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Accuracy:</span>
                  <span class="font-medium ml-1">{{ device.lastReading.accuracy.toFixed(1) }}m</span>
                </div>
                <div>
                  <span class="text-gray-500">Satellites:</span>
                  <span class="font-medium ml-1">{{ device.lastReading.satellites }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vessel Info -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Vessel Information
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Destination:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.destination }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">ETA:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ new Date(vessel.eta).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Port of Call:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.portOfCall }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Operator:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.operator }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Contact:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.contactPhone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Emergency:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.emergencyContact }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Beam:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.beam }}m</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Draft:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ vessel.draft }}m</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Last Updated:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ new Date(vessel.lastUpdated).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div v-if="vesselStats" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">GPS Devices:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ vesselStats.activeGpsDevices }}/{{ vesselStats.totalGpsDevices }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Avg Signal:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ Math.round(vesselStats.averageSignalStrength) }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Active Alerts:</span>
              <span class="font-medium text-red-600">{{ vesselStats.activeAlerts }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Pending Schedules:</span>
              <span class="font-medium text-yellow-600">{{ vesselStats.pendingSchedules }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts and Schedules -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Alerts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Alerts ({{ vesselAlerts.length }})
        </h2>
        <div v-if="vesselAlerts.length > 0" class="space-y-4">
          <div
            v-for="alert in vesselAlerts"
            :key="alert.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ alert.title }}
              </div>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: getAlertSeverityColor(alert.severity) + '20', color: getAlertSeverityColor(alert.severity) }"
              >
                {{ alert.severity }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ alert.message }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ new Date(alert.createdAt).toLocaleString() }}</span>
              <div class="flex space-x-2">
                <button
                  v-if="alert.status === 'active'"
                  class="text-blue-600 hover:text-blue-800"
                  @click="handleAlertAcknowledge(alert.id)"
                >
                  Acknowledge
                </button>
                <button
                  v-if="alert.status === 'acknowledged'"
                  class="text-green-600 hover:text-green-800"
                  @click="handleAlertResolve(alert.id)"
                >
                  Resolve
                </button>
                <button
                  v-if="alert.status === 'resolved'"
                  class="text-gray-600 hover:text-gray-800"
                  @click="handleAlertArchive(alert.id)"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p class="text-sm">No alerts for this vessel</p>
        </div>
      </div>

      <!-- Schedules -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Schedules ({{ vesselSchedules.length }})
        </h2>
        <div v-if="vesselSchedules.length > 0" class="space-y-4">
          <div
            v-for="schedule in vesselSchedules"
            :key="schedule.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ schedule.title }}
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
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ schedule.description }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ schedule.time }} • {{ schedule.assignedTo }}</span>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400': schedule.status === 'pending',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400': schedule.status === 'in-progress',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400': schedule.status === 'completed',
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400': schedule.status === 'cancelled',
                  }"
                >
                  {{ schedule.status }}
                </span>
                <button
                  v-if="schedule.status === 'pending'"
                  class="text-green-600 hover:text-green-800"
                  @click="handleScheduleMarkAsDone(schedule.id)"
                >
                  Mark Done
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p class="text-sm">No schedules for this vessel</p>
        </div>
      </div>
    </div>
  </div>
</template>
