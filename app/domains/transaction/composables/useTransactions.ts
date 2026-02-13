import { useQuery } from '@tanstack/vue-query'
import { TransactionListSchema } from '../schemas/transaction'
import type { Ref } from 'vue'

interface UseTransactionsOptions {
  page?: Ref<number>
  limit?: Ref<number>
  categoryId?: Ref<string | undefined>
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const page = options.page ?? ref(1)
  const limit = options.limit ?? ref(20)
  const categoryId = options.categoryId ?? ref(undefined)

  return useQuery({
    queryKey: ['transactions', { page, limit, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page.value),
        limit: String(limit.value),
      })
      if (categoryId.value) {
        params.set('categoryId', categoryId.value)
      }

      const data = await $fetch(`/api/transactions?${params}`)
      return TransactionListSchema.parse(data)
    },
  })
}
