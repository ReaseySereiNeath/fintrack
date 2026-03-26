import { z } from 'zod'
import { budgets } from '../../data/mock'
import { validateBody } from '../../utils/validateBody'

const UpsertBudgetSchema = z.object({
  categoryId: z.string().min(1),
  limit: z.number().positive(),
  period: z.enum(['monthly', 'weekly']),
})

export default defineEventHandler(async (event) => {
  const body = await validateBody(event, UpsertBudgetSchema)

  // Upsert: update if budget for this category exists, otherwise create
  const existingIndex = budgets.findIndex((b) => b.categoryId === body.categoryId && b.period === body.period)
  const existing = existingIndex !== -1 ? budgets[existingIndex] : undefined

  if (existing) {
    existing.limit = body.limit
    return existing
  }

  const newBudget = {
    id: `bud-${Date.now()}`,
    categoryId: body.categoryId,
    limit: body.limit,
    spent: 0,
    period: body.period,
  }

  budgets.push(newBudget)
  return newBudget
})
