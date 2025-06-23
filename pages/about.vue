<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        About {{ config.public.appName }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Learn more about our project and technology stack
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Technology Stack
      </h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Frontend Framework
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Nuxt.js 3 - Full-stack Vue framework</li>
            <li>• Vue 3 - Progressive JavaScript framework</li>
            <li>• TypeScript - Type-safe JavaScript</li>
            <li>• UnoCSS - Atomic CSS engine</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Development Tools
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• ESLint - Code linting</li>
            <li>• Vite - Fast build tool</li>
            <li>• Headless UI - Accessible UI components</li>
            <li>• VueUse - Vue composition utilities</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Features
      </h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <div class="text-primary-600 text-xl">✓</div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Server-Side Rendering</h3>
            <p class="text-gray-600 dark:text-gray-300">SEO-friendly with Nuxt.js SSR capabilities</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="text-primary-600 text-xl">✓</div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Dark Mode Support</h3>
            <p class="text-gray-600 dark:text-gray-300">Automatic dark/light theme switching</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="text-primary-600 text-xl">✓</div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Responsive Design</h3>
            <p class="text-gray-600 dark:text-gray-300">Mobile-first responsive layout</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="text-primary-600 text-xl">✓</div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Type Safety</h3>
            <p class="text-gray-600 dark:text-gray-300">Full TypeScript support for better development experience</p>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <NuxtLink
        to="/"
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

definePageMeta({
  title: 'About'
})
</script> 