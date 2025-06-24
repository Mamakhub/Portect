// Auto-import type declarations for Nuxt 3
declare module '#app' {
  interface NuxtApp {
    $config: RuntimeConfig
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $config: RuntimeConfig
  }
}

// Global type declarations for auto-imported composables and utilities
declare global {
  // Nuxt auto-imports
  const defineNuxtConfig: typeof import('nuxt/config').defineNuxtConfig
  const definePageMeta: typeof import('nuxt/app').definePageMeta
  const useRuntimeConfig: typeof import('nuxt/app').useRuntimeConfig
  const useRoute: typeof import('nuxt/app').useRoute
  const useRouter: typeof import('nuxt/app').useRouter
  const useColorMode: typeof import('@nuxtjs/color-mode').useColorMode
  
  // Vue auto-imports
  const ref: typeof import('vue').ref
  const computed: typeof import('vue').computed
  const reactive: typeof import('vue').reactive
  const watch: typeof import('vue').watch
  const watchEffect: typeof import('vue').watchEffect
  const onMounted: typeof import('vue').onMounted
  const onUnmounted: typeof import('vue').onUnmounted
  const onBeforeMount: typeof import('vue').onBeforeMount
  const onBeforeUnmount: typeof import('vue').onBeforeUnmount
  const nextTick: typeof import('vue').nextTick
  const readonly: typeof import('vue').readonly
  
  // Custom composables
  const useCounter: typeof import('~/composable/useCounter').useCounter
  const useCsvData: typeof import('~/composable/useCsvData').useCsvData
  const useDustData: typeof import('~/composable/useDustData').useDustData
  const useConstructionSites: typeof import('~/composable/useConstructionSites').useConstructionSites
  
  // Custom utilities
  const formatDate: typeof import('~/utils/date').formatDate
  const formatDateTime: typeof import('~/utils/date').formatDateTime
  const formatRelativeTime: typeof import('~/utils/date').formatRelativeTime
  const isValidDate: typeof import('~/utils/date').isValidDate
}

export { }

