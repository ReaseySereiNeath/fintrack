import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type Category = 'Food' | 'Transport' | 'Housing' | 'Utilities' | 'Entertainment' | 'Health' | 'Shopping' | 'Income' | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  description: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: Category;
  limit: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: Category, limit: number) => void;
  getCategoryTotal: (category: Category) => number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Mock Data
const initialTransactions: Transaction[] = [
  { id: '1', amount: 2500, category: 'Income', date: '2023-10-01', description: 'Salary', type: 'income' },
  { id: '2', amount: 50, category: 'Food', date: '2023-10-02', description: 'Groceries', type: 'expense' },
  { id: '3', amount: 1200, category: 'Housing', date: '2023-10-01', description: 'Rent', type: 'expense' },
  { id: '4', amount: 30, category: 'Transport', date: '2023-10-03', description: 'Uber', type: 'expense' },
  { id: '5', amount: 15, category: 'Entertainment', date: '2023-10-05', description: 'Netflix', type: 'expense' },
  { id: '6', amount: 120, category: 'Utilities', date: '2023-10-10', description: 'Electric Bill', type: 'expense' },
  { id: '7', amount: 200, category: 'Shopping', date: '2023-10-12', description: 'New Shoes', type: 'expense' },
  { id: '8', amount: 45, category: 'Health', date: '2023-10-15', description: 'Pharmacy', type: 'expense' },
  { id: '9', amount: 60, category: 'Food', date: '2023-10-16', description: 'Dinner out', type: 'expense' },
  { id: '10', amount: 2500, category: 'Income', date: '2023-11-01', description: 'Salary', type: 'income' },
];

const initialBudgets: Budget[] = [
  { category: 'Food', limit: 400 },
  { category: 'Transport', limit: 150 },
  { category: 'Housing', limit: 1300 },
  { category: 'Utilities', limit: 200 },
  { category: 'Entertainment', limit: 100 },
  { category: 'Health', limit: 100 },
  { category: 'Shopping', limit: 300 },
  { category: 'Other', limit: 100 },
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

  // Load from local storage on mount (simulating persistence)
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedBudgets = localStorage.getItem('budgets');
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateBudget = (category: Category, limit: number) => {
    setBudgets(budgets.map(b => b.category === category ? { ...b, limit } : b));
  };

  const getCategoryTotal = (category: Category) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      addTransaction,
      deleteTransaction,
      updateBudget,
      getCategoryTotal,
      totalIncome,
      totalExpenses,
      balance
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
