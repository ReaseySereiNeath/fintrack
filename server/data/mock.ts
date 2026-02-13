export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  description: string
  date: string
  createdAt: string
}

export interface Budget {
  id: string
  categoryId: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly'
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Groceries', color: '#4CAF50', icon: 'shopping-cart' },
  { id: 'cat-2', name: 'Transport', color: '#2196F3', icon: 'car' },
  { id: 'cat-3', name: 'Entertainment', color: '#9C27B0', icon: 'film' },
  { id: 'cat-4', name: 'Utilities', color: '#FF9800', icon: 'zap' },
  { id: 'cat-5', name: 'Dining', color: '#F44336', icon: 'utensils' },
  { id: 'cat-6', name: 'Salary', color: '#00BCD4', icon: 'briefcase' },
  { id: 'cat-7', name: 'Freelance', color: '#8BC34A', icon: 'laptop' },
]

export const transactions: Transaction[] = [
  { id: 'tx-1', amount: 4500, type: 'expense', categoryId: 'cat-1', description: 'Weekly groceries at Walmart', date: '2026-02-10', createdAt: '2026-02-10T10:30:00Z' },
  { id: 'tx-2', amount: 2000, type: 'expense', categoryId: 'cat-2', description: 'Gas station fill-up', date: '2026-02-09', createdAt: '2026-02-09T14:00:00Z' },
  { id: 'tx-3', amount: 1500, type: 'expense', categoryId: 'cat-3', description: 'Netflix subscription', date: '2026-02-08', createdAt: '2026-02-08T09:00:00Z' },
  { id: 'tx-4', amount: 12000, type: 'expense', categoryId: 'cat-4', description: 'Electric bill - February', date: '2026-02-07', createdAt: '2026-02-07T11:00:00Z' },
  { id: 'tx-5', amount: 3200, type: 'expense', categoryId: 'cat-5', description: 'Dinner at Italian restaurant', date: '2026-02-06', createdAt: '2026-02-06T20:00:00Z' },
  { id: 'tx-6', amount: 500000, type: 'income', categoryId: 'cat-6', description: 'Monthly salary', date: '2026-02-01', createdAt: '2026-02-01T08:00:00Z' },
  { id: 'tx-7', amount: 75000, type: 'income', categoryId: 'cat-7', description: 'Freelance web project', date: '2026-02-03', createdAt: '2026-02-03T16:00:00Z' },
  { id: 'tx-8', amount: 8500, type: 'expense', categoryId: 'cat-1', description: 'Costco bulk shopping', date: '2026-02-05', createdAt: '2026-02-05T13:00:00Z' },
  { id: 'tx-9', amount: 1800, type: 'expense', categoryId: 'cat-5', description: 'Coffee and lunch', date: '2026-02-04', createdAt: '2026-02-04T12:30:00Z' },
  { id: 'tx-10', amount: 5000, type: 'expense', categoryId: 'cat-3', description: 'Concert tickets', date: '2026-02-02', createdAt: '2026-02-02T18:00:00Z' },
  { id: 'tx-11', amount: 3500, type: 'expense', categoryId: 'cat-2', description: 'Uber rides', date: '2026-01-31', createdAt: '2026-01-31T22:00:00Z' },
  { id: 'tx-12', amount: 15000, type: 'expense', categoryId: 'cat-4', description: 'Internet bill - January', date: '2026-01-28', createdAt: '2026-01-28T10:00:00Z' },
  { id: 'tx-13', amount: 500000, type: 'income', categoryId: 'cat-6', description: 'Monthly salary', date: '2026-01-01', createdAt: '2026-01-01T08:00:00Z' },
  { id: 'tx-14', amount: 6000, type: 'expense', categoryId: 'cat-1', description: 'Farmers market', date: '2026-01-25', createdAt: '2026-01-25T10:00:00Z' },
  { id: 'tx-15', amount: 2500, type: 'expense', categoryId: 'cat-5', description: 'Fast food', date: '2026-01-20', createdAt: '2026-01-20T19:00:00Z' },
]

export const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-1', limit: 30000, spent: 13000, period: 'monthly' },
  { id: 'bud-2', categoryId: 'cat-2', limit: 15000, spent: 5500, period: 'monthly' },
  { id: 'bud-3', categoryId: 'cat-3', limit: 10000, spent: 6500, period: 'monthly' },
  { id: 'bud-4', categoryId: 'cat-4', limit: 20000, spent: 12000, period: 'monthly' },
  { id: 'bud-5', categoryId: 'cat-5', limit: 15000, spent: 7500, period: 'monthly' },
]
