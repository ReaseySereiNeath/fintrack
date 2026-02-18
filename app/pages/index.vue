<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { useTransactions } from '~/domains/transaction/composables/useTransactions'
import { useCategories } from '~/domains/transaction/composables/useCategories'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

definePageMeta({ layout: 'default' })

const page = ref(1)
const limit = ref(100)
const { data: txData, isLoading } = useTransactions({ page, limit })
const { data: categories } = useCategories()

const categoryMap = computed(() => {
  if (!categories.value) return {} as Record<string, { name: string; color: string }>
  return Object.fromEntries(categories.value.map(c => [c.id, c]))
})

const transactions = computed(() => txData.value?.data ?? [])

const totalIncome = computed(() =>
  transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
)
const totalExpenses = computed(() =>
  transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
)
const balance = computed(() => totalIncome.value - totalExpenses.value)

const chartData = computed(() => {
  const grouped: Record<string, number> = {}
  transactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => { grouped[t.date] = (grouped[t.date] ?? 0) + t.amount })
  const sorted = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
  return {
    labels: sorted.map(([date]) =>
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      label: 'Spending',
      data: sorted.map(([, v]) => +(v / 100).toFixed(2)),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
    }],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
    y: { grid: { color: '#f3f4f6' }, ticks: { color: '#9ca3af' }, border: { display: false } },
  },
}

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm md:text-base text-gray-500 mt-1">Welcome back! Here's your financial overview.</p>
    </header>

    <div v-if="isLoading" class="text-center py-16 text-gray-400">Loading...</div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Wallet class="text-blue-600" :size="24" />
            </div>
            <span class="text-sm font-medium text-gray-500">Total Balance</span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900">{{ fmt(balance) }}</h3>
          <div class="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight :size="16" class="mr-1" />
            <span>+2.5% from last month</span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight class="text-green-600" :size="24" />
            </div>
            <span class="text-sm font-medium text-gray-500">Total Income</span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900">{{ fmt(totalIncome) }}</h3>
          <div class="mt-2 text-sm text-gray-500">+12% from last month</div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-red-100 rounded-lg">
              <ArrowDownRight class="text-red-600" :size="24" />
            </div>
            <span class="text-sm font-medium text-gray-500">Total Expenses</span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900">{{ fmt(totalExpenses) }}</h3>
          <div class="mt-2 flex items-center text-sm text-red-600">
            <ArrowUpRight :size="16" class="mr-1" />
            <span>+5% from last month</span>
          </div>
        </div>
      </div>

      <!-- Chart + Recent -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Spending Trends</h3>
          <div class="h-[300px]">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
          <div class="space-y-4">
            <div
              v-for="tx in transactions.slice(0, 5)"
              :key="tx.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 rounded-full"
                  :class="tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                >
                  <component :is="tx.type === 'income' ? ArrowUpRight : ArrowDownRight" :size="16" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">{{ tx.description }}</p>
                  <p class="text-xs text-gray-500">{{ categoryMap[tx.categoryId]?.name ?? tx.categoryId }}</p>
                </div>
              </div>
              <span
                class="font-semibold text-sm"
                :class="tx.type === 'income' ? 'text-green-600' : 'text-gray-900'"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ fmt(tx.amount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
