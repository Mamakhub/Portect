<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          © {{ new Date().getFullYear() }} {{ config.public.appName }}. All rights reserved.
        </div>
        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
          <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>