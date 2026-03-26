import { z } from 'zod'

export const BudgetSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  limit: z.number(),
  spent: z.number(),
  period: z.enum(['monthly', 'weekly']),
})

export type Budget = z.infer<typeof BudgetSchema>
