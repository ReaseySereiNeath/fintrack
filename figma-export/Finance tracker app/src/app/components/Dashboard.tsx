import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { transactions, totalIncome, totalExpenses, balance } = useFinance();

  // Group transactions by date for the chart
  const data = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { date: string; amount: number }[], curr) => {
      const existing = acc.find(item => item.date === curr.date);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ date: curr.date, amount: curr.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days with activity

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Welcome back! Here's your financial overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Balance</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">${balance.toLocaleString()}</h3>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+2.5% from last month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Income</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">${totalIncome.toLocaleString()}</h3>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>+12% from last month</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownRight className="text-red-600" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Expenses</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</h3>
          <div className="mt-2 flex items-center text-sm text-red-600">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+5% from last month</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Spending Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
