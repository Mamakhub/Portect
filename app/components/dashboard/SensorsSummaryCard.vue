<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  dustActive: number
  dustInactive: number
  noiseActive: number
  noiseInactive: number
  lastUpdated: string
}>()

const emit = defineEmits<{
  (e: 'viewDetails'): void
}>()

function handleViewDetails() {
  emit('viewDetails')
}
</script>

<template>
  <CommonAppCard class="cursor-pointer hover:shadow-lg transition-shadow" @click="handleViewDetails">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Sensors' Summary
        </h3>
        <div class="flex items-center space-x-4">
          <Icon icon="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
          <button
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            @click.stop="handleViewDetails"
          >
            View Details
          </button>
        </div>
      </div>
    </template>
    <div class="flex justify-between items-center">
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Dust
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            Active: <span class="font-semibold">{{ dustActive }}</span>
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            Inactive: <span class="font-semibold">{{ dustInactive }}</span>
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Noise
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            Active: <span class="font-semibold">{{ noiseActive }}</span>
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            Inactive: <span class="font-semibold">{{ noiseInactive }}</span>
          </p>
        </div>
      </div>
      <div>
        <img
          src="~/assets/worker.png"
          alt="Worker"
          class="w-24 h-24 rounded-full object-cover"
        >
      </div>
    </div>
    <div class="mt-4">
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Last Updated: {{ lastUpdated }}
      </div>
    </div>
  </CommonAppCard>
</template>
