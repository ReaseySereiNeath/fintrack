import { transactions } from '../../data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const now = new Date()
  const year = Number(query.year) || now.getFullYear()
  const month = Number(query.month) || now.getMonth() + 1

  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const monthTx = transactions.filter((t) => t.date.startsWith(monthStr))

  const totalIncome = monthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Build daily spending map
  const dailyMap = new Map<string, number>()
  for (const tx of monthTx.filter((t) => t.type === 'expense')) {
    dailyMap.set(tx.date, (dailyMap.get(tx.date) || 0) + tx.amount)
  }

  const dailySpending = Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    year,
    month,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    dailySpending,
  }
})
