import React, { useState } from 'react';
import { useFinance, Transaction, Category } from '../context/FinanceContext';
import { Search, Plus, Trash2, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const categories: Category[] = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Income', 'Other'];

const Transactions: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New Transaction State
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Food');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'All' || t.category === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newDescription) {
      toast.error("Please fill all fields");
      return;
    }

    addTransaction({
      amount: parseFloat(newAmount),
      description: newDescription,
      category: newCategory,
      type: newType,
      date: new Date().toISOString(),
    });

    setNewAmount('');
    setNewDescription('');
    setIsAdding(false);
    toast.success("Transaction added successfully");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Add Transaction</span>
          <span className="md:hidden">Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg md:text-xl font-bold mb-4">Add New Transaction</h3>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white w-full"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Category | 'All')}
              className="border-none bg-transparent focus:ring-0 text-sm font-medium text-gray-600 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{transaction.description}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-sm font-semibold text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 border-b border-gray-100 last:border-none flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-900">{transaction.description}</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.category}
                  </span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
