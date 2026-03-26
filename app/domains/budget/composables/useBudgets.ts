import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { z } from 'zod'
import { BudgetSchema } from '../schemas/budget'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => z.array(BudgetSchema).parse(await $fetch('/api/budgets')),
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: { categoryId: string; limit: number; period: string }) => {
      await $fetch('/api/budgets', { method: 'POST', body })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
