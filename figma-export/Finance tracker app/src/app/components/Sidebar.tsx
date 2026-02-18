import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, PieChart, Settings, Wallet } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Transactions', icon: List, path: '/transactions' },
    { name: 'Budget', icon: Wallet, path: '/budget' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 bg-gray-900 text-white flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-blue-500 p-1 rounded">
            <Wallet size={24} className="text-white" />
          </span>
          FinTrack
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white cursor-pointer">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
