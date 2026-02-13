import { transactions } from '../../data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const categoryId = query.categoryId as string | undefined
  const from = query.from as string | undefined
  const to = query.to as string | undefined

  let filtered = [...transactions]

  if (categoryId) {
    filtered = filtered.filter((t) => t.categoryId === categoryId)
  }
  if (from) {
    filtered = filtered.filter((t) => t.date >= from)
  }
  if (to) {
    filtered = filtered.filter((t) => t.date <= to)
  }

  filtered.sort((a, b) => b.date.localeCompare(a.date))

  const total = filtered.length
  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return { data, total, page, limit }
})
