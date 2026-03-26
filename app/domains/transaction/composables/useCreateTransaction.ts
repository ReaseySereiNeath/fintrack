import { useMutation, useQueryClient } from '@tanstack/vue-query'

interface CreateTransactionInput {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description: string
  date: string
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateTransactionInput): Promise<void> => {
      await $fetch('/api/transactions', { method: 'POST', body })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
