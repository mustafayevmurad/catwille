// client/src/components/ui/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const tabs = [
    { path: '/', label: 'Дом', icon: '🏠' },
    { path: '/cats', label: 'Коты', icon: '🐱' },
    { path: '/expeditions', label: 'Вылазки', icon: '🌲' },
    { path: '/tasks', label: 'Задания', icon: '📋' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-2 z-10">
      {tabs.map(tab => (
        <Link 
          key={tab.path} 
          to={tab.path}
          className={`flex flex-col items-center p-2 ${
            location.pathname === tab.path ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-xs mt-1">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;