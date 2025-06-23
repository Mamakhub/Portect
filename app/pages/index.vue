<script setup lang="ts">
const config = useRuntimeConfig()
const showModal = ref(false)

const features = [
  {
    icon: '⚡',
    title: 'Fast Performance',
    description: 'Built with Nuxt.js for optimal performance and SEO.',
  },
  {
    icon: '🎨',
    title: 'Modern Design',
    description: 'Beautiful UI with dark mode support and responsive design.',
  },
  {
    icon: '🔧',
    title: 'Developer Friendly',
    description: 'TypeScript support and excellent developer experience.',
  },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to {{ config.public.appName }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        A modern Nuxt.js frontend application built with Vue 3 and TypeScript
      </p>
      <div class="flex justify-center space-x-4">
        <NuxtLink
          to="/about"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Learn More
        </NuxtLink>
        <button
          class="border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-6 py-3 rounded-lg font-medium transition-colors"
          @click="showModal = true"
        >
          Get Started
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="grid md:grid-cols-3 gap-8">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="text-3xl mb-4">
          {{ feature.icon }}
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ feature.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ feature.description }}
        </p>
      </div>
    </section>

    <!-- Modal -->
    <Modal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Welcome!
        </h3>
      </template>
      <template #body>
        <p class="text-gray-600 dark:text-gray-300">
          This is a sample modal component. You can customize it according to your needs.
        </p>
      </template>
      <template #footer>
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          @click="showModal = false"
        >
          Close
        </button>
      </template>
    </Modal>
  </div>
</template>
