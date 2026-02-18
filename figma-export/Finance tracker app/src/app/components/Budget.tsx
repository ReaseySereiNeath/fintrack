import React, { useState } from 'react';
import { useFinance, Budget as BudgetType, Category } from '../context/FinanceContext';
import { motion } from 'motion/react';
import { Edit2, Save, Trash2 } from 'lucide-react';

const Budget: React.FC = () => {
  const { budgets, getCategoryTotal, updateBudget } = useFinance();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);

  const handleEdit = (budget: BudgetType) => {
    setEditingCategory(budget.category);
    setNewLimit(budget.limit);
  };

  const handleSave = () => {
    if (editingCategory) {
      updateBudget(editingCategory, newLimit);
      setEditingCategory(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Budgeting</h1>
        <p className="text-sm md:text-base text-gray-500">Manage your monthly spending limits.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spent = getCategoryTotal(budget.category);
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOverBudget = spent > budget.limit;

          return (
            <motion.div
              key={budget.category}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${
                isOverBudget ? 'border-red-200' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-500">
                    Spent: <span className={isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-900'}>${spent.toFixed(2)}</span> / ${budget.limit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {editingCategory === budget.category ? (
                    <button onClick={handleSave} className="text-green-600 hover:text-green-700 p-1">
                      <Save size={18} />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(budget)} className="text-gray-400 hover:text-blue-600 p-1">
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {editingCategory === budget.category ? (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">New Limit</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
