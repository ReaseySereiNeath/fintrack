import { transactions } from '../../data/mock'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const index = transactions.findIndex(t => t.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Transaction not found' })
  }
  transactions.splice(index, 1)
  setResponseStatus(event, 204)
  return null
})
