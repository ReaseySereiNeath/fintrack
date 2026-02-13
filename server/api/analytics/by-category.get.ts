import { transactions, categories } from '../../data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const from = query.from as string | undefined
  const to = query.to as string | undefined

  let expenses = transactions.filter((t) => t.type === 'expense')

  if (from) expenses = expenses.filter((t) => t.date >= from)
  if (to) expenses = expenses.filter((t) => t.date <= to)

  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0)

  // Group by category
  const grouped = new Map<string, number>()
  for (const tx of expenses) {
    grouped.set(tx.categoryId, (grouped.get(tx.categoryId) || 0) + tx.amount)
  }

  return Array.from(grouped.entries()).map(([categoryId, total]) => {
    const cat = categories.find((c) => c.id === categoryId)
    return {
      categoryId,
      categoryName: cat?.name ?? 'Unknown',
      total,
      percentage: totalSpent > 0 ? Math.round((total / totalSpent) * 10000) / 100 : 0,
    }
  })
})
