import React from 'react';
import { useApp } from '../context/AppContext';
import { Thermometer, Droplets, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BoxList = () => {
  const { boxes, selectBox } = useApp();
  const navigate = useNavigate();

  const handleBoxClick = (id: string) => {
    selectBox(id);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Shipments</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tracking {boxes.length} units
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <div 
            key={box.id}
            onClick={() => handleBoxClick(box.id)}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
               <img src={box.imageUrl} alt={box.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-lg">{box.name}</h3>
                    <p className="text-gray-200 text-sm">{box.location}</p>
                  </div>
               </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-gray-700 text-orange-500">
                    <Thermometer size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Temp</p>
                    <p className="font-bold text-gray-900 dark:text-white">{box.currentTemp}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-gray-700 text-cyan-500">
                    <Droplets size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="font-bold text-gray-900 dark:text-white">{box.currentHumidity}%</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${box.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                    box.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                  {box.status}
                </span>
                
                <span className="flex items-center text-xs font-medium text-[var(--color-primary)] group-hover:underline">
                  View Details <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};