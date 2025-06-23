<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
      404 - Page Not Found
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
      The page you are looking for does not exist.<br>
      Please check the URL or return to the <NuxtLink to="/">
        homepage
      </NuxtLink>.
    </p>
    <NuxtLink to="/" class="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
      Go Home
    </NuxtLink>
  </div>
</template>
