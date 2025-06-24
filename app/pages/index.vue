<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ConstructionSite } from '~/types/sites'

// Page metadata
definePageMeta({
  title: 'Dashboard',
})

// Modal state
const isNoiseModalOpen = ref(false)
const isDustModalOpen = ref(false)
const isSensorSummaryModalOpen = ref(false)

// Multi-site data
const {
  sites,
  selectedSiteId,
  selectedSite,
  selectedSiteNoiseChartData,
  selectedSiteDustChartData,
  selectedSiteStats,
  selectedSiteSensorSummary,
  selectedSiteActiveAlerts,
  selectedSiteSensorDevices,
  selectedSiteSensorSummaryWithTotal,
  averageNoiseLevel,
  averageDustLevel,
  selectSite,
  clearSelection,
  getSiteSchedules,
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

// Use selected site data directly
const displayNoiseData = computed(() => {
  return selectedSiteNoiseChartData.value
})

const displayDustData = computed(() => {
  return selectedSiteDustChartData.value
})

function handleAcknowledge() {
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

function openNoiseModal() {
  isNoiseModalOpen.value = true
}

function closeNoiseModal() {
  isNoiseModalOpen.value = false
}

function openDustModal() {
  isDustModalOpen.value = true
}

function closeDustModal() {
  isDustModalOpen.value = false
}

function openSensorSummaryModal() {
  isSensorSummaryModalOpen.value = true
}

function closeSensorSummaryModal() {
  isSensorSummaryModalOpen.value = false
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
          @view-details="openNoiseModal"
        />
        <DashboardChartCard
          title="Dust Level"
          :value="selectedSiteStats?.averageDust ? `${selectedSiteStats.averageDust} mg/m³` : `${averageDustLevel} mg/m³`"
          :chart-data="displayDustData"
          chart-color="#FBBF24"
          label="Dust Level"
          unit="mg/m³"
          @view-details="openDustModal"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardSensorsSummaryCard
            :dust-active="selectedSiteSensorSummary.dustActive"
            :dust-inactive="selectedSiteSensorSummary.dustInactive"
            :noise-active="selectedSiteSensorSummary.noiseActive"
            :noise-inactive="selectedSiteSensorSummary.noiseInactive"
            last-updated="18 May 2025, 11:05AM (GMT+8)"
            @view-details="openSensorSummaryModal"
          />
          <DashboardAlertCard
            :alert-count="selectedSiteActiveAlerts.length"
            :alerts="selectedSiteActiveAlerts"
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
              v-for="item in selectedSiteSchedules.slice(0, 5)"
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

    <!-- Modals -->
    <DashboardNoiseMonitoringModal
      :is-open="isNoiseModalOpen"
      :chart-data="displayNoiseData"
      :selected-site-stats="selectedSiteStats"
      @close="closeNoiseModal"
    />
    <DashboardDustMonitoringModal
      :is-open="isDustModalOpen"
      :chart-data="displayDustData"
      :selected-site-stats="selectedSiteStats"
      @close="closeDustModal"
    />
    <DashboardSensorsSummaryModal
      :is-open="isSensorSummaryModalOpen"
      :sensor-summary="selectedSiteSensorSummaryWithTotal"
      :sensor-devices="selectedSiteSensorDevices"
      :selected-site-name="selectedSite?.name"
      @close="closeSensorSummaryModal"
    />
  </div>
</template>
