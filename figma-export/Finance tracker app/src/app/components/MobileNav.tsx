import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, PieChart, Wallet } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Trans', icon: List, path: '/transactions' },
    { name: 'Budget', icon: Wallet, path: '/budget' },
    { name: 'Analytics', icon: PieChart, path: '/analytics' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-full ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <item.icon size={24} />
          <span className="text-xs font-medium">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
