import React from 'react';
import { Home, Brain, BarChart2, Settings, Database, PlayCircle, History } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Brain, label: 'Models' },
    { icon: PlayCircle, label: 'Training' },
    { icon: Database, label: 'Datasets' },
    { icon: BarChart2, label: 'Analytics' },
    { icon: History, label: 'History' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 text-white p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Brain className="w-8 h-8 text-blue-400" />
        <h1 className="text-xl font-bold">ML Platform</h1>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors mb-1"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;