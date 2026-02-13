import { categories } from '../../data/mock'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const index = categories.findIndex((c) => c.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  categories[index] = { ...categories[index], ...body }
  return categories[index]
})
