import { z } from 'zod'

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string(),
  description: z.string(),
  date: z.string(),
  createdAt: z.string(),
})

export const TransactionListSchema = z.object({
  data: z.array(TransactionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type Transaction = z.infer<typeof TransactionSchema>
export type TransactionList = z.infer<typeof TransactionListSchema>
