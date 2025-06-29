<script setup lang="ts">
import AppCard from '~/components/common/AppCard.vue'
// No runtime config needed for team page
</script>

<template>
  <div class="max-w-6xl mx-auto py-12 px-4 space-y-10">
    <!-- System Features & Functions Section -->
    <AppCard>
      <template #header>
        <h2 class="text-2xl md:text-3xl font-bold text-[#017359] text-center w-full">
          System Features & Functions
        </h2>
      </template>
      <div>
        <p class="text-center text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Our platform is designed to streamline site management, monitoring, and scheduling for modern teams. Here are some of the key features and functions that make our system powerful and user-friendly:
        </p>
        <ul class="space-y-3 max-w-xl mx-auto">
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Real-time environmental monitoring (dust, noise, and more)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Automated project scheduling and task optimization</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Multi-site management with centralized dashboard</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Customizable alerts and notifications for site events</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Comprehensive reporting and analytics</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[#017359] text-lg mt-1">✔</span>
            <span class="text-gray-800 dark:text-gray-200">User-friendly interface with dark mode support</span>
          </li>
        </ul>
      </div>
    </AppCard>
    <!-- Team Section (narrower) -->
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <template #header>
          <h1 class="text-3xl md:text-4xl font-bold text-[#017359] text-center w-full">
            Meet the Team
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 text-center mt-2">
            Get to know the people behind this project
          </p>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <!-- Leon Then (CEO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center p-6">
            <img src="/assets/Leon Then _ Portrait.png" alt="Leon Then" class="w-32 h-32 object-cover rounded-full mb-4 shadow-md">
            <h2 class="text-xl font-semibold text-[#017359] mb-1">
              Leon Then
            </h2>
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-0">
              CEO
            </h3>
          </div>
          <!-- Anson Kiu (CIO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center p-6">
            <img src="/assets/Anson Kiu.jpg" alt="Anson Kiu" class="w-32 h-32 object-cover rounded-full mb-4 shadow-md">
            <h2 class="text-xl font-semibold text-[#017359] mb-1">
              Anson Kiu
            </h2>
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-0">
              CIO
            </h3>
          </div>
          <!-- Chong Yi Jian (CTO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center p-6">
            <img src="/assets/Chong Yi Jian.png" alt="Chong Yi Jian" class="w-32 h-32 object-cover rounded-full mb-4 shadow-md">
            <h2 class="text-xl font-semibold text-[#017359] mb-1">
              Chong Yi Jian
            </h2>
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-0">
              CTO
            </h3>
          </div>
          <!-- Go Yao Xiang (CMO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center p-6">
            <img src="/assets/Go Yao Xiang.png" alt="Go Yao Xiang" class="w-32 h-32 object-cover rounded-full mb-4 shadow-md">
            <h2 class="text-xl font-semibold text-[#017359] mb-1">
              Go Yao Xiang
            </h2>
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-0">
              CMO
            </h3>
          </div>
        </div>
      </AppCard>
    </div>
    <!-- Back to Home Button -->
    <div class="flex justify-center pt-8">
      <NuxtLink
        to="/"
        class="bg-[#017359] hover:bg-[#02684f] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>
