// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Add compatibility date to fix warning
  compatibilityDate: '2025-06-23',

  modules: [
    '@nuxt/eslint',
    '@unocss/nuxt',
    [
      '@nuxtjs/color-mode',
      {
        classSuffix: '',
      },
    ],
  ],

  // Explicit auto-import configuration for app directory structure
  imports: {
    dirs: ['composable/**', 'utils/**'],
    global: true,
  },

  // Component auto-import configuration for app directory structure
  components: [
    {
      path: '~/components/common',
      prefix: 'Common',
    },
    {
      path: '~/components/dashboard',
      prefix: 'Dashboard',
    },
    {
      path: '~/components/Navigation',
    },
  ],

  // Configure source directory
  srcDir: 'app',

  css: [
    '@unocss/reset/tailwind.css',
  ],

  app: {
    head: {
      title: 'Tenang Site',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern Nuxt.js frontend application' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      appName: 'Tenang Site',
    },
  },
})
