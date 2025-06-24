<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { ConstructionSite } from '~/types/sites'

// Page metadata
definePageMeta({
  title: 'Dashboard',
})

// Multi-site data
const {
  sites,
  selectedSiteId,
  selectedSite,
  selectedSiteNoiseChartData,
  selectedSiteDustChartData,
  selectedSiteStats,
  activeAlerts,
  todaySchedules,
  totalSites,
  totalDevices,
  averageNoiseLevel,
  averageDustLevel,
  selectSite,
  clearSelection,
  getSiteSchedules,
  getSiteAlerts,
} = useMultiSiteData()

// Select first active site by default
onMounted(() => {
  const firstActiveSite = sites.value.find(site => site.status === 'active')
  if (firstActiveSite) {
    selectSite(firstActiveSite.id)
  }
})

// Get selected site data
const selectedSiteSchedules = computed(() => {
  if (!selectedSiteId.value)
    return []
  return getSiteSchedules(selectedSiteId.value)
})

const selectedSiteAlerts = computed(() => {
  if (!selectedSiteId.value)
    return []
  return getSiteAlerts(selectedSiteId.value)
})

// Fallback data for charts when no site is selected
const fallbackNoiseData = [
  { x: '00:00', y: 45 },
  { x: '01:00', y: 48 },
  { x: '02:00', y: 52 },
  { x: '03:00', y: 47 },
  { x: '04:00', y: 50 },
]

const fallbackDustData = [
  { x: '00:00', y: 0.3 },
  { x: '01:00', y: 0.4 },
  { x: '02:00', y: 0.2 },
  { x: '03:00', y: 0.6 },
  { x: '04:00', y: 0.8 },
]

// Use selected site data or fallback
const displayNoiseData = computed(() => {
  if (selectedSiteNoiseChartData.value.length > 0) {
    return selectedSiteNoiseChartData.value
  }
  return fallbackNoiseData
})

const displayDustData = computed(() => {
  if (selectedSiteDustChartData.value.length > 0) {
    return selectedSiteDustChartData.value
  }
  return fallbackDustData
})

function handleAcknowledge() {
  console.log('Alert acknowledged')
  // Add logic to dismiss the alert
}

function handleSiteChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target.value) {
    selectSite(target.value)
  }
  else {
    clearSelection()
  }
}

function handleSiteSelectFromMap(site: ConstructionSite) {
  selectSite(site.id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Site Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Site Overview
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Select a site to view detailed monitoring data
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <select
            :value="selectedSiteId || ''"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handleSiteChange"
          >
            <option value="">
              All Sites Overview
            </option>
            <option
              v-for="site in sites"
              :key="site.id"
              :value="site.id"
            >
              {{ site.name }} ({{ site.status }})
            </option>
          </select>
          <NuxtLink
            v-if="selectedSiteId"
            :to="`/site/${selectedSiteId}`"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content Column -->
      <div class="lg:col-span-2 space-y-6">
        <DashboardChartCard
          title="Noise Level"
          :value="selectedSiteStats?.averageNoise ? `${selectedSiteStats.averageNoise} dB` : `${averageNoiseLevel} dB`"
          :chart-data="displayNoiseData"
          chart-color="#F87171"
          label="Noise Level"
          unit="dB"
        />
        <DashboardChartCard
          title="Dust Level"
          :value="selectedSiteStats?.averageDust ? `${selectedSiteStats.averageDust} mg/m³` : `${averageDustLevel} mg/m³`"
          :chart-data="displayDustData"
          chart-color="#FBBF24"
          label="Dust Level"
          unit="mg/m³"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardSensorsSummaryCard
            :dust-active="sites.filter(s => s.status === 'active').length"
            :dust-inactive="sites.filter(s => s.status === 'inactive').length"
            :noise-active="totalDevices"
            :noise-inactive="0"
            last-updated="18 May 2025, 11:05AM (GMT+8)"
          />
          <DashboardAlertCard
            :alert-count="activeAlerts.length"
            :message="activeAlerts.length > 0 ? `There are ${activeAlerts.length} active alerts across all sites. Please review and take necessary actions.` : 'All systems are operating normally with no active alerts.'"
            @acknowledge="handleAcknowledge"
          />
        </div>
      </div>

      <!-- Right Sidebar Column -->
      <div class="space-y-6">
        <DashboardMapCard :on-site-select="handleSiteSelectFromMap" />
        <DashboardScheduleCard>
          <div v-if="selectedSiteId && selectedSiteSchedules.length > 0">
            <div
              v-for="(item, index) in selectedSiteSchedules.slice(0, 5)"
              :key="item.id"
              class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg mb-3"
            >
              <div>
                <div class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ item.time }}
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-xs">
                  {{ item.title }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400': item.priority === 'critical',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400': item.priority === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400': item.priority === 'medium',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400': item.priority === 'low',
                  }"
                >
                  {{ item.priority }}
                </span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400': item.status === 'pending',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400': item.status === 'in-progress',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400': item.status === 'completed',
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400': item.status === 'cancelled',
                  }"
                >
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p class="text-sm">
              No scheduled tasks for today
            </p>
          </div>
        </DashboardScheduleCard>
      </div>
    </div>
  </div>
</template>
