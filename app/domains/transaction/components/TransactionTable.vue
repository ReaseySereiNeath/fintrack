<script setup lang="ts">
import type { Transaction } from '../schemas/transaction'
import type { Category } from '~/domains/category/schemas/category'

const props = defineProps<{
  transactions: Transaction[]
  categories: Category[]
}>()

function getCategoryName(categoryId: string): string {
  return props.categories.find((c) => c.id === categoryId)?.name ?? 'Unknown'
}

function getCategoryColor(categoryId: string): string {
  return props.categories.find((c) => c.id === categoryId)?.color ?? '#888'
}

function formatAmount(amount: number, type: string): string {
  const value = (amount / 100).toFixed(2)
  return type === 'income' ? `+$${value}` : `-$${value}`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="transaction-table">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td class="date">{{ formatDate(tx.date) }}</td>
          <td>{{ tx.description }}</td>
          <td>
            <span class="category-badge" :style="{ backgroundColor: getCategoryColor(tx.categoryId) }">
              {{ getCategoryName(tx.categoryId) }}
            </span>
          </td>
          <td class="text-right" :class="tx.type === 'income' ? 'amount-income' : 'amount-expense'">
            {{ formatAmount(tx.amount, tx.type) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.transaction-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background-color: #f8f9fa;
}

th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}

tr:hover {
  background-color: #f8f9fa;
}

.date {
  white-space: nowrap;
  color: #6c757d;
}

.text-right {
  text-align: right;
}

.category-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
}

.amount-income {
  color: #28a745;
  font-weight: 600;
}

.amount-expense {
  color: #dc3545;
  font-weight: 600;
}
</style>
