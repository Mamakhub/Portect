<script setup lang="ts">
import { onMounted } from 'vue'

const route = useRoute()
const siteId = route.params.id as string

const {
  selectedSite,
  selectedSiteData,
  selectedSiteNoiseChartData,
  selectedSiteDustChartData,
  selectedSiteStats,
  getSiteSchedules,
  getSiteAlerts,
  acknowledgeAlert,
  resolveAlert,
  updateScheduleStatus,
  getStatusColor,
  getAlertSeverityColor,
  getSchedulePriorityColor,
  selectSite,
} = useMultiSiteData()

// Select the site when component mounts
onMounted(() => {
  selectSite(siteId)
})

// Get site-specific data
const siteSchedules = computed(() => getSiteSchedules(siteId))
const siteAlerts = computed(() => getSiteAlerts(siteId))
const activeSiteAlerts = computed(() => siteAlerts.value.filter(alert => alert.status === 'active'))

function handleAcknowledgeAlert(alertId: string) {
  acknowledgeAlert(alertId, 'Current User')
}

function handleResolveAlert(alertId: string) {
  resolveAlert(alertId, 'Current User')
}

function handleUpdateSchedule(scheduleId: string, status: 'completed' | 'in-progress' | 'cancelled') {
  updateScheduleStatus(scheduleId, status)
}

function getStatusColorClass(status: string) {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
    case 'inactive': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
    case 'completed': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
  }
}

function getAlertSeverityClass(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
    case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400'
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
  }
}

function getSchedulePriorityClass(priority: string) {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
    case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400'
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="!selectedSite" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>

      <!-- Site Data Display -->
      <div v-else class="space-y-6">
        <!-- Site Header -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {{ selectedSite.name }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ selectedSite.description }}
              </p>
              <div class="flex items-center space-x-4 text-sm">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(selectedSite.status)}`">
                  {{ selectedSite.status.charAt(0).toUpperCase() + selectedSite.status.slice(1) }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  Manager: {{ selectedSite.manager }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  {{ selectedSite.deviceCount }} devices
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">
                {{ selectedSite.progress }}%
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Progress
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Average Noise
                </h3>
                <span class="text-2xl font-bold text-blue-600">
                  {{ selectedSiteStats?.averageNoise || '--' }} dB
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Max: {{ selectedSiteStats?.maxNoise || '--' }} dB | Min: {{ selectedSiteStats?.minNoise || '--' }} dB
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Average Dust
                </h3>
                <span class="text-2xl font-bold text-orange-600">
                  {{ selectedSiteStats?.averageDust || '--' }} mg/m³
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Max: {{ selectedSiteStats?.maxDust || '--' }} mg/m³ | Min: {{ selectedSiteStats?.minDust || '--' }} mg/m³
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Active Alerts
                </h3>
                <span class="text-2xl font-bold text-red-600">
                  {{ activeSiteAlerts.length }}
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total alerts: {{ siteAlerts.length }}
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Today's Tasks
                </h3>
                <span class="text-2xl font-bold text-purple-600">
                  {{ siteSchedules.length }}
                </span>
              </div>
            </template>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Pending: {{ siteSchedules.filter(s => s.status === 'pending').length }}
            </div>
          </CommonAppCard>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CommonAppCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Noise Level Over Time
                </h3>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Noise Level (dB)</span>
                </div>
              </div>
            </template>
            <div class="p-4">
              <DashboardDataChart
                :data="selectedSiteNoiseChartData"
                color="#3b82f6"
                label="Noise Level"
                unit="dB"
              />
            </div>
          </CommonAppCard>

          <CommonAppCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Dust Level Over Time
                </h3>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-orange-500 rounded-full" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Dust Level (mg/m³)</span>
                </div>
              </div>
            </template>
            <div class="p-4">
              <DashboardDataChart
                :data="selectedSiteDustChartData"
                color="#f97316"
                label="Dust Level"
                unit="mg/m³"
              />
            </div>
          </CommonAppCard>
        </div>

        <!-- Alerts and Schedules Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Alerts -->
          <CommonAppCard>
            <template #header>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Site Alerts
              </h3>
            </template>
            <div class="space-y-4">
              <div v-if="siteAlerts.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                No alerts for this site
              </div>
              <div v-for="alert in siteAlerts" v-else :key="alert.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900 dark:text-white">
                    {{ alert.title }}
                  </h4>
                  <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAlertSeverityClass(alert.severity)}`">
                    {{ alert.severity }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ alert.message }}
                </p>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ new Date(alert.createdAt).toLocaleString() }}
                  </span>
                  <div class="flex space-x-2">
                    <button
                      v-if="alert.status === 'active'"
                      class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      @click="handleAcknowledgeAlert(alert.id)"
                    >
                      Acknowledge
                    </button>
                    <button
                      v-if="alert.status === 'acknowledged'"
                      class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      @click="handleResolveAlert(alert.id)"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CommonAppCard>

          <!-- Schedules -->
          <CommonAppCard>
            <template #header>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Today's Schedule
              </h3>
            </template>
            <div class="space-y-4">
              <div v-if="siteSchedules.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                No scheduled tasks for today
              </div>
              <div v-for="schedule in siteSchedules" v-else :key="schedule.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ schedule.title }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ schedule.description }}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ schedule.time }}
                    </div>
                    <span :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSchedulePriorityClass(schedule.priority)}`">
                      {{ schedule.priority }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Assigned to: {{ schedule.assignedTo }}
                  </span>
                  <div class="flex space-x-2">
                    <button
                      v-if="schedule.status === 'pending'"
                      class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      @click="handleUpdateSchedule(schedule.id, 'in-progress')"
                    >
                      Start
                    </button>
                    <button
                      v-if="schedule.status === 'in-progress'"
                      class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      @click="handleUpdateSchedule(schedule.id, 'completed')"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CommonAppCard>
        </div>
      </div>
    </div>
  </div>
</template>
