import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'danger';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, status = 'good' }) => {
  const statusColors = {
    good: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${statusColors[status]}`}>
          {icon}
        </div>
        {status === 'danger' && (
          <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {unit && <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>}
        </h3>
      </div>
    </div>
  );
};