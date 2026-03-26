// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: '/api',
    },
  },

  components: [
    { path: '~/shared/components', prefix: '' },
    { path: '~/domains', prefix: '', pathPrefix: false },
  ],

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/eslint'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  i18n: {
    locales: [{ code: 'en', name: 'English' }],
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
  },
})
