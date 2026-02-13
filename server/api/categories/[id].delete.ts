import { categories } from '../../data/mock'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const index = categories.findIndex((c) => c.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  categories.splice(index, 1)
  setResponseStatus(event, 204)
  return null
})
