import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

export const Alerts = () => {
  const { alerts, clearAlerts } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Alerts</h2>
           <p className="text-gray-500 dark:text-gray-400">Violations detected by multi-point validation logic.</p>
        </div>
        {alerts.length > 0 && (
          <button 
            onClick={clearAlerts}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Systems Nominal</h3>
            <p className="text-gray-500 dark:text-gray-400">No active alerts or violations in the log.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full flex-shrink-0 ${
                    alert.severity === 'critical' 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{alert.boxName}</h4>
                      <span className="text-xs text-gray-400 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{alert.boxId}</span>
                       <span className="text-gray-300">•</span>
                       <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                         alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                       }`}>
                         {alert.type} Violation
                       </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};