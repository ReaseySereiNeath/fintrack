import { z } from 'zod'
import { categories } from '../../data/mock'
import { validateBody } from '../../utils/validateBody'

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await validateBody(event, CreateCategorySchema)

  const newCategory = {
    id: `cat-${Date.now()}`,
    name: body.name,
    color: body.color,
    icon: body.icon,
  }

  categories.push(newCategory)
  setResponseStatus(event, 201)
  return newCategory
})
