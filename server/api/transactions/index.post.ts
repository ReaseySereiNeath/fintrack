import { z } from 'zod'
import { transactions } from '../../data/mock'
import { validateBody } from '../../utils/validateBody'

const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await validateBody(event, CreateTransactionSchema)

  const newTransaction = {
    id: `tx-${Date.now()}`,
    amount: body.amount,
    type: body.type,
    categoryId: body.categoryId,
    description: body.description,
    date: body.date,
    createdAt: new Date().toISOString(),
  }

  transactions.unshift(newTransaction)
  setResponseStatus(event, 201)
  return newTransaction
})
