import { transactions } from '../../data/mock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

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
