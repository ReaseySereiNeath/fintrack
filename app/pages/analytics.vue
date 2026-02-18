<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { TransactionSchema } from '~/domains/transaction/schemas/transaction'
import { CategorySchema } from '~/domains/transaction/schemas/category'

ChartJS.register(ArcElement, Tooltip, Legend)

definePageMeta({ layout: 'default' })

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c']

const { data: txData } = useQuery({
  queryKey: ['transactions', 'all'],
  queryFn: async () => {
    const raw = await $fetch('/api/transactions', { params: { limit: 1000 } })
    return z.object({ data: z.array(TransactionSchema) }).parse(raw)
  },
})

const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: async () => z.array(CategorySchema).parse(await $fetch('/api/categories')),
})

const categoryMap = computed(() =>
  Object.fromEntries((categories.value ?? []).map(c => [c.id, c]))
)

const expensesByCategory = computed(() => {
  const grouped: Record<string, number> = {}
  txData.value?.data
    .filter(t => t.type === 'expense')
    .forEach(t => { grouped[t.categoryId] = (grouped[t.categoryId] ?? 0) + t.amount })
  return Object.entries(grouped)
    .map(([categoryId, value]) => ({ categoryId, name: categoryMap.value[categoryId]?.name ?? categoryId, value }))
    .sort((a, b) => b.value - a.value)
})

const totalExpense = computed(() => expensesByCategory.value.reduce((s, c) => s + c.value, 0))

const chartData = computed(() => ({
  labels: expensesByCategory.value.map(c => c.name),
  datasets: [{
    data: expensesByCategory.value.map(c => +(c.value / 100).toFixed(2)),
    backgroundColor: expensesByCategory.value.map((_, i) => COLORS[i % COLORS.length]),
    borderWidth: 2,
    borderColor: '#ffffff',
  }],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const },
  },
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}
</script>

<template>
  <div class="min-h-screen">
    <header class="mb-4 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
      <p class="text-sm md:text-base text-gray-500 mt-1">Breakdown of your spending habits.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Pie Chart -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.01] transition-transform">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Spending Distribution</h3>
        <div class="h-[400px] md:h-[500px]">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Top Categories</h3>
        <div class="space-y-4">
          <div
            v-for="(cat, index) in expensesByCategory"
            :key="cat.categoryId"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: COLORS[index % COLORS.length] }" />
              <span class="font-medium text-gray-900">{{ cat.name }}</span>
            </div>
            <div class="text-right">
              <span class="block font-bold text-gray-900">{{ fmt(cat.value) }}</span>
              <span class="text-xs text-gray-500">
                {{ totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0 }}% of total
              </span>
            </div>
          </div>
          <div v-if="expensesByCategory.length === 0" class="text-center py-8 text-gray-400">
            No expense data available.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
