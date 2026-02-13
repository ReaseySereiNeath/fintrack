import { transactions } from '../../data/mock'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const transaction = transactions.find((t) => t.id === id)

  if (!transaction) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction not found' })
  }

  return transaction
})
