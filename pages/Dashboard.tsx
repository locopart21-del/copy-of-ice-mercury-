import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { Thermometer, Droplets, Activity, Box, Plus, Minus, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MedicineBox } from '../types';

export const Dashboard = () => {
  const { boxes, selectedBoxId, selectBox, manualTempChange, settings } = useApp();

  // Determine which box to show details for (default to first if none selected)
  const activeBox: MedicineBox = selectedBoxId 
    ? boxes.find(b => b.id === selectedBoxId) || boxes[0]
    : boxes[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'At Risk': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default: return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
  };

  const chartData = activeBox.readings.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    temp: r.temperature,
    humidity: r.humidity
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Monitoring</h2>
          <p className="text-gray-500 dark:text-gray-400">Real-time sensor data from cold chain logistics.</p>
        </div>
        
        {/* Box Selector for Dashboard */}
        <select 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          value={activeBox.id}
          onChange={(e) => selectBox(e.target.value)}
        >
          {boxes.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
          ))}
        </select>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Current Temperature" 
          value={activeBox.currentTemp} 
          unit="°C"
          icon={<Thermometer size={24} />}
          status={activeBox.currentTemp < settings.tempMin || activeBox.currentTemp > settings.tempMax ? 'danger' : 'good'}
        />
        <StatCard 
          label="Humidity" 
          value={activeBox.currentHumidity} 
          unit="%"
          icon={<Droplets size={24} />}
          status={activeBox.currentHumidity > settings.humidityMax ? 'warning' : 'good'}
        />
        <StatCard 
          label="Violations (Cached)" 
          value={activeBox.consecutiveViolations} 
          unit={`/ ${settings.violationThreshold}`}
          icon={<AlertTriangle size={24} />}
          status={activeBox.consecutiveViolations > 0 ? 'warning' : 'good'}
        />
        <StatCard 
          label="Current Status" 
          value={activeBox.status} 
          icon={<Activity size={24} />}
          status={activeBox.status === 'Critical' ? 'danger' : activeBox.status === 'At Risk' ? 'warning' : 'good'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-gray-800 dark:text-white">Temperature History</h3>
             <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></span> Temp
                <span className="w-3 h-3 rounded-full bg-cyan-400 ml-2"></span> Humidity
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[-5, 30]} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={300}
                />
                 <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#22d3ee" 
                  strokeWidth={2} 
                  dot={false}
                  strokeDasharray="5 5"
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Box Details & Control */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
              <img 
                src={activeBox.imageUrl} 
                alt={activeBox.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(activeBox.status)}`}>
                {activeBox.status.toUpperCase()}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{activeBox.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{activeBox.batchNumber} • {activeBox.location}</p>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-3">Simulation Controls</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-300">Force Temp</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => manualTempChange(activeBox.id, -2)}
                      className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 shadow-sm border border-gray-200 dark:border-gray-500 transition-colors"
                      title="Decrease 2°C"
                    >
                      <Minus size={16} className="text-gray-700 dark:text-gray-200" />
                    </button>
                    <span className="w-16 text-center font-mono font-bold dark:text-white">{activeBox.currentTemp.toFixed(1)}°</span>
                    <button 
                      onClick={() => manualTempChange(activeBox.id, 2)}
                       className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 shadow-sm border border-gray-200 dark:border-gray-500 transition-colors"
                       title="Increase 2°C"
                    >
                      <Plus size={16} className="text-gray-700 dark:text-gray-200" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                  Manually changing temperature helps test the "consecutive violation" alert logic.
                </p>
              </div>

              {activeBox.isCorrecting && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 animate-pulse">
                  <Activity size={16} />
                  <span>Auto-Correcting Environment...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};