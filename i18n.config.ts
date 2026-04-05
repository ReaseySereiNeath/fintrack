/// <reference path="./.nuxt/nuxt.d.ts" />

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      app: {
        title: 'FinTrack',
      },
      transactions: {
        title: 'Transactions',
        amount: 'Amount',
        date: 'Date',
        category: 'Category',
        description: 'Description',
      },
      categories: {
        title: 'Categories',
      },
      analytics: {
        title: 'Analytics',
      },
      budgets: {
        title: 'Budgets',
      },
    },
  },
}))

