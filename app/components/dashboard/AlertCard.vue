<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { SiteAlert } from '~/types/sites'

const props = defineProps<{
  alertCount: number
  alerts: SiteAlert[]
}>()

const emit = defineEmits<{
  (e: 'viewDetails'): void
}>()

function handleViewDetails() {
  emit('viewDetails')
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
</script>

<template>
  <CommonAppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="handleViewDetails">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Alerts
          </h3>
          <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{{ alertCount }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <button
            class="px-3 py-1 text-sm bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded-md hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 transition-colors"
            @click.stop="handleViewDetails"
          >
            View Details
          </button>
        </div>
      </div>
    </template>
    <div>
      <!-- Alert List -->
      <div v-if="alerts.length > 0" class="space-y-3 mb-4">
        <div
          v-for="alert in alerts.slice(0, 3)"
          :key="alert.id"
          class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex-shrink-0">
            <Icon
              :icon="getTypeIcon(alert.type)"
              class="w-5 h-5 text-gray-600 dark:text-gray-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ alert.title }}
              </h4>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                :class="getSeverityColor(alert.severity)"
              >
                {{ alert.severity }}
              </span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {{ alert.message }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              {{ new Date(alert.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Show more indicator -->
        <div v-if="alerts.length > 3" class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            +{{ alerts.length - 3 }} more alerts
          </p>
        </div>
      </div>

      <!-- No alerts message -->
      <div v-else class="text-center py-4">
        <Icon
          icon="heroicons:check-circle"
          class="w-8 h-8 text-green-500 mx-auto mb-2"
        />
        <p class="text-sm text-gray-600 dark:text-gray-400">
          All systems are operating normally with no active alerts.
        </p>
      </div>

      <!-- Info message -->
      <div class="text-center py-2">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Click "View Details" to manage alerts
        </p>
      </div>
    </div>
  </CommonAppCard>
</template>
