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

  // Exclude internal files from routing and auto-imports
  ignore: [
    '**/_internal/**',
  ],

  css: [
    '@unocss/reset/tailwind.css',
  ],

  app: {
    // Global page transition configuration
    pageTransition: {
      name: 'page',
      mode: 'out-in',
      duration: 300,
    },
    head: {
      title: 'Portect',
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
    // Private keys (only available server-side)
    postgresUrl: process.env.POSTGRES_URL || 'postgresql://mamakhub:mamakhub@yaoxiang-ubuntu.local:5432/portect',
    postgresUser: process.env.POSTGRES_USER || 'mamakhub',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'mamakhub',
    postgresDb: process.env.POSTGRES_DB || 'portect',
    influxUrl: process.env.INFLUX_URL || 'http://yaoxiang-ubuntu.local:8086',
    influxToken: process.env.INFLUX_TOKEN || '',
    influxOrg: process.env.INFLUX_ORG || 'portect',
    influxBucket: process.env.INFLUX_BUCKET || 'vessel_data',
    
    // Public keys (exposed to client)
    public: {
      appName: 'Portect',
    },
  },
})
