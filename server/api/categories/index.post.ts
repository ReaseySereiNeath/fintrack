import { categories } from '../../data/mock'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

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
