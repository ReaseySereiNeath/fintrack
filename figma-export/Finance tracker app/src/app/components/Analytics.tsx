import React from 'react';
import { useFinance, Category } from '../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'];

const Analytics: React.FC = () => {
  const { transactions } = useFinance();

  // Aggregate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { name: Category; value: number }[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const totalExpense = expensesByCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm md:text-base text-gray-500">Breakdown of your spending habits.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] md:h-[500px]"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Distribution</h3>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Categories</h3>
            <div className="space-y-4">
              {expensesByCategory.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-900">${category.value.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">{((category.value / totalExpense) * 100).toFixed(1)}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
