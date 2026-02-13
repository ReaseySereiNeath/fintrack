<script setup lang="ts">
import { useTransactions } from '~/domains/transaction/composables/useTransactions'
import { useCategories } from '~/domains/transaction/composables/useCategories'
import TransactionTable from '~/domains/transaction/components/TransactionTable.vue'

const page = ref(1)
const limit = ref(10)

const { data: txData, isLoading: txLoading, isError: txError } = useTransactions({ page, limit })
const { data: categories, isLoading: catLoading } = useCategories()

const isLoading = computed(() => txLoading.value || catLoading.value)
const totalPages = computed(() => {
  if (!txData.value) return 1
  return Math.ceil(txData.value.total / txData.value.limit)
})
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>FinTrack</h1>
      <p class="subtitle">Personal Finance Tracker</p>
    </header>

    <main class="main-content">
      <section class="section">
        <h2>Recent Transactions</h2>

        <div v-if="isLoading" class="loading">Loading transactions...</div>
        <div v-else-if="txError" class="error">Failed to load transactions.</div>
        <template v-else-if="txData && categories">
          <TransactionTable :transactions="txData.data" :categories="categories" />

          <div class="pagination">
            <button :disabled="page <= 1" @click="page--">Previous</button>
            <span>Page {{ page }} of {{ totalPages }}</span>
            <button :disabled="page >= totalPages" @click="page++">Next</button>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #212529;
}

.app-header {
  margin-bottom: 2rem;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: #6c757d;
}

.section h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

.error {
  color: #dc3545;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem 0;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}

.pagination button:hover:not(:disabled) {
  background: #f8f9fa;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
