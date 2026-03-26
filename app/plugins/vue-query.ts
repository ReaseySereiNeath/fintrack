import { VueQueryPlugin, QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'
import { useToast } from '~/shared/composables/useToast'

export default defineNuxtPlugin((nuxtApp) => {
  const { error: showError } = useToast()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        showError(`Failed to load data: ${error.message}`)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        showError(`Operation failed: ${error.message}`)
      },
    }),
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
