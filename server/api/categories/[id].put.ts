import { z } from 'zod'
import { categories } from '../../data/mock'
import { validateBody } from '../../utils/validateBody'

const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await validateBody(event, UpdateCategorySchema)
  const index = categories.findIndex((c) => c.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const category = categories[index]!
  if (body.name !== undefined) category.name = body.name
  if (body.color !== undefined) category.color = body.color
  if (body.icon !== undefined) category.icon = body.icon

  return category
})
