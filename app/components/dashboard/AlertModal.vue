<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { SiteAlert } from '~/types/sites'

const props = defineProps<{
  isOpen: boolean
  alerts: SiteAlert[]
  selectedSiteName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'acknowledge', alertId: string): void
  (e: 'resolve', alertId: string): void
  (e: 'archive', alertId: string): void
}>()

// Reactive state for expanded rows
const expandedAlerts = ref<Set<string>>(new Set())

function closeModal() {
  emit('close')
}

function toggleExpanded(alertId: string) {
  if (expandedAlerts.value.has(alertId)) {
    expandedAlerts.value.delete(alertId)
  }
  else {
    expandedAlerts.value.add(alertId)
  }
}

function handleAcknowledge(alertId: string) {
  emit('acknowledge', alertId)
}

function handleResolve(alertId: string) {
  emit('resolve', alertId)
}

function handleArchive(alertId: string) {
  emit('archive', alertId)
}

// Get severity color
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Get type icon
function getTypeIcon(type: string): string {
  switch (type) {
    case 'noise': return 'heroicons:speaker-wave'
    case 'dust': return 'heroicons:cloud'
    case 'safety': return 'heroicons:shield-exclamation'
    case 'maintenance': return 'heroicons:wrench-screwdriver'
    case 'general': return 'heroicons:information-circle'
    default: return 'heroicons:exclamation-triangle'
  }
}

// Get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'acknowledged': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Group alerts by priority and archived
const groupedAlerts = computed(() => {
  const groups = {
    critical: [] as SiteAlert[],
    high: [] as SiteAlert[],
    medium: [] as SiteAlert[],
    low: [] as SiteAlert[],
    archived: [] as SiteAlert[],
  }

  props.alerts.forEach((alert) => {
    if (alert.status === 'archived') {
      groups.archived.push(alert)
    }
    else {
      groups[alert.severity as keyof typeof groups].push(alert)
    }
  })

  return groups
})

// Get priority order for display
const priorityOrder = ['critical', 'high', 'medium', 'low']
</script>

<template>
  <CommonModal
    :is-open="isOpen"
    :title="selectedSiteName ? `Alerts - ${selectedSiteName}` : 'All Alerts'"
    size="xl"
    @close="closeModal"
  >
    <div class="space-y-6">
      <!-- Summary Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-red-600 dark:text-red-400">
                Critical
              </p>
              <p class="text-2xl font-bold text-red-900 dark:text-red-100">
                {{ groupedAlerts.critical.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:exclamation-circle" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-orange-600 dark:text-orange-400">
                High
              </p>
              <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {{ groupedAlerts.high.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:information-circle" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Medium
              </p>
              <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {{ groupedAlerts.medium.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div class="flex items-center">
            <Icon icon="heroicons:information-circle" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-blue-600 dark:text-blue-400">
                Low
              </p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {{ groupedAlerts.low.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts by Priority -->
      <div class="space-y-6">
        <div
          v-for="priority in priorityOrder"
          v-show="groupedAlerts[priority as keyof typeof groupedAlerts].length > 0"
          :key="priority"
          class="space-y-3"
        >
          <!-- Priority Header -->
          <div class="flex items-center space-x-3">
            <h3
              class="text-lg font-semibold capitalize" :class="{
                'text-red-600 dark:text-red-400': priority === 'critical',
                'text-orange-600 dark:text-orange-400': priority === 'high',
                'text-yellow-600 dark:text-yellow-400': priority === 'medium',
                'text-blue-600 dark:text-blue-400': priority === 'low',
              }"
            >
              {{ priority }} Priority
            </h3>
            <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getSeverityColor(priority)">
              {{ groupedAlerts[priority as keyof typeof groupedAlerts].length }} alerts
            </span>
          </div>

          <!-- Alerts in this priority -->
          <div class="space-y-2">
            <div
              v-for="alert in groupedAlerts[priority as keyof typeof groupedAlerts]"
              :key="alert.id"
              class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              <!-- Alert Header (Always Visible) -->
              <div
                class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                @click="toggleExpanded(alert.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Icon
                      :icon="getTypeIcon(alert.type)"
                      class="w-5 h-5 text-gray-600 dark:text-gray-400"
                    />
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ alert.title }}
                      </h4>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ new Date(alert.createdAt).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusColor(alert.status)"
                    >
                      {{ alert.status }}
                    </span>
                    <Icon
                      :icon="expandedAlerts.has(alert.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                      class="w-4 h-4 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <!-- Expanded Content -->
              <div
                v-show="expandedAlerts.has(alert.id)"
                class="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              >
                <div class="p-4 space-y-4">
                  <!-- Alert Message -->
                  <div>
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Description
                    </h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ alert.message }}
                    </p>
                  </div>

                  <!-- Alert Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Details
                      </h5>
                      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex justify-between">
                          <span>Type:</span>
                          <span class="capitalize">{{ alert.type }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Severity:</span>
                          <span class="capitalize">{{ alert.severity }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span>Created:</span>
                          <span>{{ new Date(alert.createdAt).toLocaleString() }}</span>
                        </div>
                        <div v-if="alert.acknowledgedAt" class="flex justify-between">
                          <span>Acknowledged:</span>
                          <span>{{ new Date(alert.acknowledgedAt).toLocaleString() }}</span>
                        </div>
                        <div v-if="alert.resolvedAt" class="flex justify-between">
                          <span>Resolved:</span>
                          <span>{{ new Date(alert.resolvedAt).toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Actions
                      </h5>
                      <div class="space-y-2">
                        <button
                          v-if="alert.status === 'active'"
                          class="w-full px-3 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          @click="handleAcknowledge(alert.id)"
                        >
                          Acknowledge
                        </button>
                        <button
                          v-if="alert.status === 'acknowledged'"
                          class="w-full px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          @click="handleResolve(alert.id)"
                        >
                          Resolve
                        </button>
                        <button
                          v-if="alert.status === 'resolved'"
                          class="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                          @click="handleArchive(alert.id)"
                        >
                          Archive
                        </button>
                        <div v-if="alert.acknowledgedBy" class="text-xs text-gray-500 dark:text-gray-400">
                          Acknowledged by: {{ alert.acknowledgedBy }}
                        </div>
                        <div v-if="alert.resolvedBy" class="text-xs text-gray-500 dark:text-gray-400">
                          Resolved by: {{ alert.resolvedBy }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Archived Alerts Section -->
        <div v-if="groupedAlerts.archived.length > 0" class="space-y-3">
          <div class="flex items-center space-x-3 mt-8">
            <h3 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
              Archived Alerts
            </h3>
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {{ groupedAlerts.archived.length }}
            </span>
          </div>
          <div class="space-y-2">
            <div
              v-for="alert in groupedAlerts.archived"
              :key="alert.id"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden opacity-70"
            >
              <div class="p-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <Icon
                    :icon="getTypeIcon(alert.type)"
                    class="w-5 h-5 text-gray-400 dark:text-gray-500"
                  />
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-300">
                      {{ alert.title }}
                    </h4>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ new Date(alert.createdAt).toLocaleString() }}
                    </p>
                  </div>
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  Archived
                </span>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                <div class="p-4 space-y-2">
                  <div>
                    <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Description
                    </h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ alert.message }}
                    </p>
                  </div>
                  <div class="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <div>Type: <span class="capitalize">{{ alert.type }}</span></div>
                    <div>Severity: <span class="capitalize">{{ alert.severity }}</span></div>
                    <div>Created: {{ new Date(alert.createdAt).toLocaleString() }}</div>
                    <div v-if="alert.acknowledgedAt">
                      Acknowledged: {{ new Date(alert.acknowledgedAt).toLocaleString() }}
                    </div>
                    <div v-if="alert.resolvedAt">
                      Resolved: {{ new Date(alert.resolvedAt).toLocaleString() }}
                    </div>
                    <div v-if="alert.archivedAt">
                      Archived: {{ new Date(alert.archivedAt).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No alerts message -->
      <div v-if="alerts.length === 0" class="text-center py-8">
        <Icon
          icon="heroicons:check-circle"
          class="w-12 h-12 text-green-500 mx-auto mb-3"
        />
        <p class="text-gray-600 dark:text-gray-400">
          No alerts to display
        </p>
      </div>
    </div>
  </CommonModal>
</template>
