import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { CategorySchema } from '../schemas/category'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await $fetch('/api/categories')
      return z.array(CategorySchema).parse(data)
    },
  })
}
