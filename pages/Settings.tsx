import React from 'react';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../constants';
import { ThemeColor, ThemeMode } from '../types';
import { Sliders, Sun, Moon, Palette } from 'lucide-react';

export const SettingsPage = () => {
  const { settings, updateSettings, themeColor, setThemeColor, themeMode, setThemeMode } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Configure alert thresholds and application appearance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Appearance Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <Palette className="text-gray-400" size={20} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h3>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Mode</label>
             <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit">
                {(['light', 'dark'] as ThemeMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      themeMode === mode 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {mode === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="capitalize">{mode}</span>
                  </button>
                ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</label>
            <div className="flex gap-3">
              {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                    themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: THEME_COLORS[color].primary }}
                  aria-label={`Select ${color} theme`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Thresholds Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <Sliders className="text-gray-400" size={20} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sensor Thresholds</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Temperature ({settings.tempMin}°C)
              </label>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={settings.tempMin}
                onChange={(e) => updateSettings({ tempMin: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Temperature ({settings.tempMax}°C)
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={settings.tempMax}
                onChange={(e) => updateSettings({ tempMax: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Humidity ({settings.humidityMax}%)
              </label>
              <input
                type="range"
                min="30"
                max="90"
                value={settings.humidityMax}
                onChange={(e) => updateSettings({ humidityMax: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Consecutive Violations Trigger
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.violationThreshold}
                  onChange={(e) => updateSettings({ violationThreshold: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-center"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  readings in a row required to trigger Alert.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};