<script setup lang="ts">
const colorMode = useColorMode()

// Reactive data
const notifications = ref(true)
const userName = ref('John Doe')
const userEmail = ref('john@example.com')

// Methods
function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

definePageMeta({
  title: 'Settings',
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-tenang-primary dark:text-tenang-primary-dark">
        Settings
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Manage your application settings
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          General Settings
        </h2>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Dark Mode
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Toggle between light and dark themes
            </p>
          </div>
          <button
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="colorMode.value === 'dark' ? 'bg-tenang-primary-dark' : 'bg-gray-200'"
            @click="toggleTheme"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="colorMode.value === 'dark' ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Receive email notifications
            </p>
          </div>
          <button
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="notifications ? 'bg-tenang-primary' : 'bg-gray-200'"
            @click="notifications = !notifications"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="notifications ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Account Settings
        </h2>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input
            v-model="userName"
            type="text"
            placeholder="Enter your full name"
            class="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors duration-200 focus:border-tenang-primary dark:focus:border-tenang-primary-dark focus:ring-2 focus:ring-tenang-primary/20 dark:focus:ring-tenang-primary-dark/20 focus:outline-none"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            v-model="userEmail"
            type="email"
            placeholder="Enter your email address"
            class="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors duration-200 focus:border-tenang-primary dark:focus:border-tenang-primary-dark focus:ring-2 focus:ring-tenang-primary/20 dark:focus:ring-tenang-primary-dark/20 focus:outline-none"
          >
        </div>
        <div class="flex justify-end pt-4">
          <button class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
