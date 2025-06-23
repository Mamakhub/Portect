<script setup lang="ts">
const props = defineProps<{
  alertCount: number
  message: string
}>()

const emit = defineEmits<{
  (e: 'acknowledge'): void
}>()

function acknowledge() {
  emit('acknowledge')
}
</script>

<template>
  <CommonAppCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Alerts
        </h3>
        <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{{ alertCount }}</span>
      </div>
    </template>
    <div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {{ message }}
      </p>
      <CommonButton variant="secondary" @click="acknowledge">
        Acknowledge
      </CommonButton>
    </div>
  </CommonAppCard>
</template>
