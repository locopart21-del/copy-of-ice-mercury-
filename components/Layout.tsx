import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, AlertTriangle, Settings, Snowflake } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { alerts, themeColor } = useApp();
  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-[var(--color-primary)] text-white shadow-lg'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar / Mobile Header */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4 md:p-6 flex-shrink-0 sticky top-0 z-50 md:h-screen md:overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white shadow-md">
             <Snowflake size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-gray-600 dark:to-gray-200">
            Ice Mercury
          </h1>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard size={20} />
            <span className="whitespace-nowrap">Dashboard</span>
          </NavLink>
          
          <NavLink to="/boxes" className={navClass}>
            <Package size={20} />
            <span className="whitespace-nowrap">Inventory</span>
          </NavLink>

          <NavLink to="/alerts" className={navClass}>
            <div className="relative">
              <AlertTriangle size={20} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap">Alerts</span>
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            <Settings size={20} />
            <span className="whitespace-nowrap">Settings</span>
          </NavLink>
        </nav>

        <div className="hidden md:block mt-auto pt-6 border-t dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sensors Online
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
};