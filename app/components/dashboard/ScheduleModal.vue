<script setup lang="ts">
import type { SiteSchedule } from '~/types/sites'

const props = defineProps<{
  isOpen: boolean
  schedules: SiteSchedule[]
  selectedSiteName?: string
}>()

const emit = defineEmits<{
  close: []
  markAsDone: [scheduleId: string]
}>()

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400'
    case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
    case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400'
    case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-400'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'inspection': return '🔍'
    case 'maintenance': return '🔧'
    case 'meeting': return '👥'
    case 'delivery': return '📦'
    case 'break': return '☕'
    default: return '📋'
  }
}

function handleMarkAsDone(scheduleId: string) {
  emit('markAsDone', scheduleId)
}

function closeModal() {
  emit('close')
}

// Filter schedules by status for better organization
const pendingSchedules = computed(() =>
  props.schedules.filter(s => s.status === 'pending' || s.status === 'in-progress'),
)

const completedSchedules = computed(() =>
  props.schedules.filter(s => s.status === 'completed'),
)

const cancelledSchedules = computed(() =>
  props.schedules.filter(s => s.status === 'cancelled'),
)
</script>

<template>
  <CommonModal
    :is-open="isOpen"
    size="xl"
    title="Schedule Management"
    @close="closeModal"
  >
    <div class="space-y-6">
      <!-- Header with site info -->
      <div v-if="selectedSiteName" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ selectedSiteName }} - Schedule Overview
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage and track scheduled tasks
        </p>
      </div>

      <!-- Active Schedules Section -->
      <div v-if="pendingSchedules.length > 0">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Active Schedules ({{ pendingSchedules.length }})
        </h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th class="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned
                </th>
                <th class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="schedule in pendingSchedules" :key="schedule.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="w-16 px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ schedule.time }}
                </td>
                <td class="px-2 py-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">
                      {{ schedule.title }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                      {{ schedule.description }}
                    </div>
                  </div>
                </td>
                <td class="w-20 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="inline-flex items-center">
                    <span class="mr-1">{{ getTypeIcon(schedule.type) }}</span>
                    <span class="text-xs">{{ schedule.type }}</span>
                  </span>
                </td>
                <td class="w-16 px-2 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" :class="getPriorityColor(schedule.priority)">
                    {{ schedule.priority }}
                  </span>
                </td>
                <td class="w-20 px-2 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusColor(schedule.status)">
                    {{ schedule.status }}
                  </span>
                </td>
                <td class="w-24 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="truncate block max-w-20">{{ schedule.assignedTo }}</span>
                </td>
                <td class="w-20 px-2 py-3 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="schedule.status !== 'completed'"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-medium text-xs"
                    @click="handleMarkAsDone(schedule.id)"
                  >
                    Mark Done
                  </button>
                  <span v-else class="text-gray-400 dark:text-gray-500 text-xs">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Completed Schedules Section -->
      <div v-if="completedSchedules.length > 0">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Completed Schedules ({{ completedSchedules.length }})
        </h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th class="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="schedule in completedSchedules" :key="schedule.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="w-16 px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ schedule.time }}
                </td>
                <td class="px-2 py-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">
                      {{ schedule.title }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                      {{ schedule.description }}
                    </div>
                  </div>
                </td>
                <td class="w-20 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="inline-flex items-center">
                    <span class="mr-1">{{ getTypeIcon(schedule.type) }}</span>
                    <span class="text-xs">{{ schedule.type }}</span>
                  </span>
                </td>
                <td class="w-16 px-2 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" :class="getPriorityColor(schedule.priority)">
                    {{ schedule.priority }}
                  </span>
                </td>
                <td class="w-24 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="truncate block max-w-20">{{ schedule.assignedTo }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cancelled Schedules Section -->
      <div v-if="cancelledSchedules.length > 0">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
          Cancelled Schedules ({{ cancelledSchedules.length }})
        </h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th class="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th class="w-24 px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="schedule in cancelledSchedules" :key="schedule.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="w-16 px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ schedule.time }}
                </td>
                <td class="px-2 py-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">
                      {{ schedule.title }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                      {{ schedule.description }}
                    </div>
                  </div>
                </td>
                <td class="w-20 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="inline-flex items-center">
                    <span class="mr-1">{{ getTypeIcon(schedule.type) }}</span>
                    <span class="text-xs">{{ schedule.type }}</span>
                  </span>
                </td>
                <td class="w-16 px-2 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" :class="getPriorityColor(schedule.priority)">
                    {{ schedule.priority }}
                  </span>
                </td>
                <td class="w-24 px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="truncate block max-w-20">{{ schedule.assignedTo }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="schedules.length === 0" class="text-center py-12">
        <div class="text-gray-400 dark:text-gray-500">
          <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No schedules found
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            There are no scheduled tasks for this site.
          </p>
        </div>
      </div>
    </div>
  </CommonModal>
</template>
