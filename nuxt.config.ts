// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: [
        '@nuxt/eslint',
        '@unocss/nuxt',
        '@nuxtjs/color-mode'
    ],

    css: [
        '@unocss/reset/tailwind.css'
    ],

    colorMode: {
        classSuffix: ''
    },

    app: {
        head: {
            title: 'Tenang Site',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'A modern Nuxt.js frontend application' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        }
    },

    runtimeConfig: {
        public: {
            appName: 'Tenang Site'
        }
    }
}) 