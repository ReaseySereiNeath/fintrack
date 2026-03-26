import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { TransactionSchema } from '~/domains/transaction/schemas/transaction'

export function useExpensesByCategory() {
  return useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: async () => {
      const raw = await $fetch('/api/transactions', { params: { limit: 1000 } })
      return z.object({ data: z.array(TransactionSchema) }).parse(raw)
    },
  })
}
