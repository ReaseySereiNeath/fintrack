import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Analytics from './components/Analytics';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <FinanceProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
          <Sidebar />
          <MobileNav />
          <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </FinanceProvider>
  );
};

export default App;
