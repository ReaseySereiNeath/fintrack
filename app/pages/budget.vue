<script setup lang="ts">
import { Edit2, Save } from 'lucide-vue-next'
import { useBudgets, useUpdateBudget } from '~/domains/budget/composables/useBudgets'
import { useCategories } from '~/domains/category/composables/useCategories'
import { formatCurrency } from '~/shared/utils/format'
import type { Budget } from '~/domains/budget/schemas/budget'

definePageMeta({ layout: 'default' })

const { data: budgets, isLoading: budgetsLoading } = useBudgets()
const { data: categories } = useCategories()

const categoryMap = computed(() =>
  Object.fromEntries((categories.value ?? []).map(c => [c.id, c]))
)

// Editing
const editingId = ref<string | null>(null)
const editLimit = ref(0)

function startEdit(budget: Budget) {
  editingId.value = budget.id
  editLimit.value = budget.limit / 100
}

const updateMutation = useUpdateBudget()

function handleSave(budget: Budget) {
  updateMutation.mutate({
    categoryId: budget.categoryId,
    limit: Math.round(editLimit.value * 100),
    period: budget.period,
  }, {
    onSuccess: () => {
      editingId.value = null
    },
  })
}

function percentage(spent: number, limit: number) {
  return Math.min((spent / limit) * 100, 100)
}

const fmt = formatCurrency
</script>

<template>
  <div class="min-h-screen">
    <header class="mb-4 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Budgeting</h1>
      <p class="text-sm md:text-base text-gray-500 mt-1">Manage your monthly spending limits.</p>
    </header>

    <div v-if="budgetsLoading" class="text-center py-16 text-gray-400">Loading...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="budget in budgets"
        :key="budget.id"
        class="bg-white p-6 rounded-2xl shadow-sm border transition-transform hover:-translate-y-1"
        :class="budget.spent > budget.limit ? 'border-red-200' : 'border-gray-100'"
      >
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              {{ categoryMap[budget.categoryId]?.name ?? budget.categoryId }}
            </h3>
            <p class="text-sm text-gray-500">
              Spent:
              <span
                class="font-semibold"
                :class="budget.spent > budget.limit ? 'text-red-600' : 'text-gray-900'"
              >
                {{ fmt(budget.spent) }}
              </span>
              / {{ fmt(budget.limit) }}
            </p>
          </div>
          <button
            v-if="editingId === budget.id"
            class="text-green-600 hover:text-green-700 p-1"
            @click="handleSave(budget)"
          >
            <Save :size="18" />
          </button>
          <button
            v-else
            class="text-gray-400 hover:text-blue-600 p-1 transition-colors"
            @click="startEdit(budget)"
          >
            <Edit2 :size="18" />
          </button>
        </div>

        <!-- Edit Input -->
        <div v-if="editingId === budget.id" class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-1">New Limit ($)</label>
          <input
            v-model="editLimit"
            type="number"
            step="0.01"
            autofocus
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
        </div>

        <!-- Progress Bar -->
        <template v-else>
          <div class="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="[
                budget.spent > budget.limit
                  ? 'bg-red-500'
                  : percentage(budget.spent, budget.limit) > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              ]"
              :style="{ width: `${percentage(budget.spent, budget.limit)}%` }"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span class="font-medium" :class="budget.spent > budget.limit ? 'text-red-500' : 'text-gray-600'">
              {{ percentage(budget.spent, budget.limit).toFixed(0) }}%
            </span>
            <span>100%</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
