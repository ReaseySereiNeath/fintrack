import { budgets } from '../../data/mock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Upsert: update if budget for this category exists, otherwise create
  const existing = budgets.findIndex((b) => b.categoryId === body.categoryId && b.period === body.period)

  if (existing !== -1) {
    budgets[existing] = { ...budgets[existing], limit: body.limit }
    return budgets[existing]
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
