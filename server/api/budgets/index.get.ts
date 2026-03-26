import { budgets, transactions } from '../../data/mock'

export default defineEventHandler(() => {
  // Compute spent dynamically from transactions
  return budgets.map((budget) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const spent = transactions
      .filter((tx) => {
        if (tx.categoryId !== budget.categoryId) return false
        if (tx.type !== 'expense') return false
        const txDate = new Date(tx.date)
        if (budget.period === 'monthly') {
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
        }
        // Weekly: transactions within the last 7 days
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return txDate >= weekAgo
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    return { ...budget, spent }
  })
})
