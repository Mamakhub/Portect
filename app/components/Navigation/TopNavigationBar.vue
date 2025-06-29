<script setup lang="ts">
import { Icon } from '@iconify/vue'

// Emits
defineEmits<{
  toggleSidebar: []
}>()

// Composables
const colorMode = useColorMode()

// Reactive data
const showUserMenu = ref(false)

// Mock user data (replace with actual user data)
const userName = ref('John Doe')
const userEmail = ref('john@example.com')
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
})

// Methods
function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function logout() {
  showUserMenu.value = false

  if (process.client) {
    localStorage.removeItem('mockLoggedIn')
    // Force navigation with window.location
    window.location.href = '/login'
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>

<template>
  <div class="flex justify-between items-center bg-white dark:bg-gray-800 py-3 px-6 border-b border-gray-200 dark:border-gray-700">
    <!-- Left side - App Icon, Title, and Mobile menu button -->
    <div class="flex items-center">
      <!-- App Icon and Title -->
      <div class="flex items-center space-x-3">
        <NuxtLink to="/">
          <div class="h-10 w-10 rounded-xl flex items-center justify-center bg-transparent dark:bg-[#BED9D2] dark:border dark:border-white/20 dark:shadow-md">
            <img src="/assets/icon_2.png" alt="TenangSite" class="h-8 w-8 drop-shadow-sm">
          </div>
        </NuxtLink>
        <NuxtLink to="/">
          <h1 class="text-xl font-bold text-[#017359] dark:text-[#BED9D2] tracking-tight drop-shadow-sm cursor-pointer">
            TenangSite
          </h1>
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        @click="$emit('toggleSidebar')"
      >
        <Icon icon="heroicons:bars-3" class="w-6 h-6" />
      </button>
    </div>

    <!-- Right side - User menu and theme toggle -->
    <div class="flex items-center gap-x-4">
      <!-- Theme Toggle -->
      <button
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        @click="toggleTheme"
      >
        <Icon
          :icon="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'"
          class="w-5 h-5"
        />
      </button>

      <!-- User Profile Dropdown -->
      <div class="relative">
        <button
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="showUserMenu = !showUserMenu"
        >
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ userInitials }}
          </div>
          <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ userName }}
          </span>
          <Icon icon="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ userName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ userEmail }}
            </p>
          </div>
          <ul class="py-2">
            <li>
              <NuxtLink
                to="/profile"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                <Icon icon="heroicons:user-circle" class="w-4 h-4 mr-3" />
                Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/settings"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                <Icon icon="heroicons:cog-6-tooth" class="w-4 h-4 mr-3" />
                Settings
              </NuxtLink>
            </li>
            <li class="border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                @click="logout"
              >
                <Icon icon="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
