<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden lg:block h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
        isExpanded ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Logo/Brand -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div v-if="isExpanded" class="flex items-center">
          <Icon icon="heroicons:home" class="w-8 h-8 text-primary-600" />
          <span class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            {{ config.public.appName }}
          </span>
        </div>
        <div v-else class="flex justify-center w-full">
          <Icon icon="heroicons:home" class="w-8 h-8 text-primary-600" />
        </div>
        
        <!-- Toggle Button -->
        <button
          @click="toggleSidebar"
          class="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            :icon="isExpanded ? 'heroicons:chevron-left' : 'heroicons:chevron-right'"
            class="w-5 h-5"
          />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-4 px-2">
        <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <!-- Menu Item -->
            <NuxtLink
              :to="item.href"
              :class="[
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActiveRoute(item.href)
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="isExpanded" class="ml-3">{{ item.name }}</span>
            </NuxtLink>

            <!-- Submenu -->
            <ul v-if="item.children && isExpanded" class="mt-1 ml-4 space-y-1">
              <li v-for="child in item.children" :key="child.name">
                <NuxtLink
                  :to="child.href"
                  :class="[
                    'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                    isActiveRoute(child.href)
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <Icon :icon="child.icon" class="w-4 h-4 flex-shrink-0" />
                  <span class="ml-3">{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Version Info -->
      <div class="absolute bottom-4 left-4 right-4">
        <div
          :class="[
            'text-xs text-gray-500 dark:text-gray-400 text-center',
            isExpanded ? 'block' : 'hidden'
          ]"
        >
          v1.0.0
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="showMobileSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeMobileSidebar"
    />

    <!-- Mobile Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ease-in-out lg:hidden',
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full',
        'w-64'
      ]"
    >
      <!-- Mobile Header -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <Icon icon="heroicons:home" class="w-8 h-8 text-primary-600" />
          <span class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            {{ config.public.appName }}
          </span>
        </div>
        <button
          @click="closeMobileSidebar"
          class="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon icon="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <nav class="mt-4 px-2">
        <ul class="space-y-1">
          <li v-for="item in navigationItems" :key="item.name">
            <NuxtLink
              :to="item.href"
              :class="[
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActiveRoute(item.href)
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
              @click="closeMobileSidebar"
            >
              <Icon :icon="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span class="ml-3">{{ item.name }}</span>
            </NuxtLink>

            <!-- Mobile Submenu -->
            <ul v-if="item.children" class="mt-1 ml-4 space-y-1">
              <li v-for="child in item.children" :key="child.name">
                <NuxtLink
                  :to="child.href"
                  :class="[
                    'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                    isActiveRoute(child.href)
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                  @click="closeMobileSidebar"
                >
                  <Icon :icon="child.icon" class="w-4 h-4 flex-shrink-0" />
                  <span class="ml-3">{{ child.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

// Props
interface Props {
  isExpanded?: boolean
  showMobileSidebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: true,
  showMobileSidebar: false
})

// Emits
const emit = defineEmits<{
  'update:isExpanded': [value: boolean]
  'update:showMobileSidebar': [value: boolean]
}>()

// Composables
const route = useRoute()
const config = useRuntimeConfig()

// Navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'heroicons:home'
  },
  {
    name: 'Pages',
    href: '/pages',
    icon: 'heroicons:document-text',
    children: [
      {
        name: 'About',
        href: '/about',
        icon: 'heroicons:information-circle'
      }
    ]
  },
  {
    name: 'Components',
    href: '/components',
    icon: 'heroicons:puzzle-piece',
    children: [
      {
        name: 'Modal',
        href: '/components/modal',
        icon: 'heroicons:rectangle-stack'
      }
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'heroicons:cog-6-tooth'
  }
]

// Methods
const isActiveRoute = (href: string): boolean => {
  return route.path === href
}

const toggleSidebar = () => {
  emit('update:isExpanded', !props.isExpanded)
}

const closeMobileSidebar = () => {
  emit('update:showMobileSidebar', false)
}
</script>