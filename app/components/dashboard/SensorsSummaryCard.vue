<script setup lang="ts">
defineProps<{
  dustActive: number
  dustInactive: number
  noiseActive: number
  noiseInactive: number
  lastUpdated: string
}>()
</script>

<template>
  <CommonAppCard>
    <template #header>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Sensors' Summary
      </h3>
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
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
      Last Updated: {{ lastUpdated }}
    </div>
  </CommonAppCard>
</template>
