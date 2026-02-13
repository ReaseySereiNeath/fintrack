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
function defineI18nConfig(arg0: () => { legacy: boolean; locale: string; messages: { en: { app: { title: string; }; transactions: { title: string; amount: string; date: string; category: string; description: string; }; categories: { title: string; }; analytics: { title: string; }; budgets: { title: string; }; }; }; }) {
  throw new Error("Function not implemented.");
}

