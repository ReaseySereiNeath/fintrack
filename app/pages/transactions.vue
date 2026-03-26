<script setup lang="ts">
import { Search, Plus, Trash2, Filter, Calendar } from 'lucide-vue-next'
import { useCategories } from '~/domains/category/composables/useCategories'
import { useTransactions } from '~/domains/transaction/composables/useTransactions'
import { useCreateTransaction } from '~/domains/transaction/composables/useCreateTransaction'
import { useDeleteTransaction } from '~/domains/transaction/composables/useDeleteTransaction'
import { formatCurrency, formatDate } from '~/shared/utils/format'

definePageMeta({ layout: 'default' })

// --- Data ---
const { data: categories } = useCategories()

const searchTerm = ref('')
const filterCategory = ref('All')
const page = ref(1)
const limit = ref(20)
const categoryId = computed(() => filterCategory.value !== 'All' ? filterCategory.value : undefined)

const { data: txData, isLoading } = useTransactions({ page, limit, categoryId: categoryId as Ref<string | undefined> })

const filteredTransactions = computed(() => {
  if (!txData.value) return []
  if (!searchTerm.value) return txData.value.data
  const term = searchTerm.value.toLowerCase()
  return txData.value.data.filter(t => t.description.toLowerCase().includes(term))
})

const totalPages = computed(() => txData.value ? Math.ceil(txData.value.total / limit.value) : 1)

const categoryMap = computed(() =>
  Object.fromEntries((categories.value ?? []).map(c => [c.id, c]))
)

// --- Add Transaction ---
const isAdding = ref(false)
const form = reactive({
  description: '',
  amount: '',
  categoryId: '',
  type: 'expense' as 'income' | 'expense',
  date: new Date().toISOString().slice(0, 10),
})

const addMutation = useCreateTransaction()

function handleAdd(e: Event) {
  e.preventDefault()
  if (!form.amount || !form.description) return
  addMutation.mutate({
    amount: Math.round(parseFloat(form.amount) * 100),
    type: form.type,
    categoryId: form.categoryId || (categories.value?.[0]?.id ?? ''),
    description: form.description,
    date: form.date,
  }, {
    onSuccess: () => {
      form.description = ''
      form.amount = ''
      form.categoryId = categories.value?.[0]?.id ?? ''
      form.type = 'expense'
      form.date = new Date().toISOString().slice(0, 10)
      isAdding.value = false
    },
  })
}

// --- Delete Transaction ---
const deleteMutation = useDeleteTransaction()

// Init default category
watch(categories, (cats) => {
  const first = cats?.[0]
  if (first && !form.categoryId) form.categoryId = first.id
}, { immediate: true })

const fmtDate = formatDate
const fmtAmount = formatCurrency
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base"
        @click="isAdding = !isAdding"
      >
        <Plus :size="18" />
        <span class="hidden md:inline">Add Transaction</span>
        <span class="md:hidden">Add</span>
      </button>
    </div>

    <!-- Add Form -->
    <div
      v-if="isAdding"
      class="mb-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <h3 class="text-lg md:text-xl font-bold mb-4">Add New Transaction</h3>
      <form class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" @submit="handleAdd">
        <input
          v-model="form.description"
          type="text"
          placeholder="Description"
          class="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none lg:col-span-2"
        />
        <input
          v-model="form.amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          class="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          v-model="form.categoryId"
          class="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <div class="flex gap-2">
          <select
            v-model="form.type"
            class="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button
            type="submit"
            :disabled="addMutation.isPending.value"
            class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search transactions..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center gap-2 w-full md:w-auto">
          <Filter :size="20" class="text-gray-400 shrink-0" />
          <select
            v-model="filterCategory"
            class="border-none bg-transparent text-sm font-medium text-gray-600 cursor-pointer focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12 text-gray-400">Loading...</div>

      <template v-else>
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                <th class="text-right py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                <th class="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tx in filteredTransactions"
                :key="tx.id"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-6 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <Calendar :size="16" class="text-gray-400" />
                    {{ fmtDate(tx.date) }}
                  </div>
                </td>
                <td class="py-4 px-6 text-sm font-medium text-gray-900">{{ tx.description }}</td>
                <td class="py-4 px-6">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ categoryMap[tx.categoryId]?.name ?? tx.categoryId }}
                  </span>
                </td>
                <td
                  class="py-4 px-6 text-sm font-semibold text-right"
                  :class="tx.type === 'income' ? 'text-green-600' : 'text-gray-900'"
                >
                  {{ tx.type === 'income' ? '+' : '-' }}{{ fmtAmount(tx.amount) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <button
                    class="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                    @click="deleteMutation.mutate(tx.id)"
                  >
                    <Trash2 :size="18" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden">
          <div
            v-for="tx in filteredTransactions"
            :key="tx.id"
            class="p-4 border-b border-gray-100 last:border-none flex items-center justify-between"
          >
            <div class="flex flex-col gap-1">
              <span class="font-medium text-gray-900">{{ tx.description }}</span>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span
                  class="px-2 py-0.5 rounded-full"
                  :class="tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ categoryMap[tx.categoryId]?.name ?? tx.categoryId }}
                </span>
                <span>{{ fmtDate(tx.date) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="font-semibold"
                :class="tx.type === 'income' ? 'text-green-600' : 'text-gray-900'"
              >
                {{ tx.type === 'income' ? '+' : '-' }}{{ fmtAmount(tx.amount) }}
              </span>
              <button
                class="text-gray-400 hover:text-red-600 p-1"
                @click="deleteMutation.mutate(tx.id)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredTransactions.length === 0" class="text-center py-12 text-gray-500">
          No transactions found matching your criteria.
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 p-4 border-t border-gray-100">
          <button
            :disabled="page <= 1"
            class="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            @click="page--"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</span>
          <button
            :disabled="page >= totalPages"
            class="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            @click="page++"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
