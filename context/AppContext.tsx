import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, AppSettings, MedicineBox, AlertEvent, ThemeColor, ThemeMode } from '../types';
import { DEFAULT_SETTINGS, INITIAL_BOXES, THEME_COLORS } from '../constants';
import { simulateTick } from '../services/simulationService';

interface AppContextType extends AppState {
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  selectBox: (id: string | null) => void;
  manualTempChange: (boxId: string, delta: number) => void;
  clearAlerts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [boxes, setBoxes] = useState<MedicineBox[]>(INITIAL_BOXES);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Apply Theme CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    const colorData = THEME_COLORS[themeColor];
    
    root.style.setProperty('--color-primary', colorData.primary);
    root.style.setProperty('--color-primary-hover', colorData.hover);

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeColor, themeMode]);

  // Simulation Interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBoxes((currentBoxes) => {
        const { updatedBoxes, newAlerts } = simulateTick(currentBoxes, settings, alerts);
        
        if (newAlerts.length > 0) {
          setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50
        }
        
        return updatedBoxes;
      });
    }, settings.simulationSpeed);

    return () => clearInterval(intervalId);
  }, [settings, alerts.length]); // Dependencies to ensure state freshness

  // Manual Temperature Control (for Demo/Testing)
  const manualTempChange = (boxId: string, delta: number) => {
    setBoxes(prev => prev.map(box => {
      if (box.id !== boxId) return box;
      return {
        ...box,
        currentTemp: Number((box.currentTemp + delta).toFixed(2))
      };
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearAlerts = () => setAlerts([]);

  const selectBox = (id: string | null) => setSelectedBoxId(id);

  return (
    <AppContext.Provider
      value={{
        boxes,
        alerts,
        settings,
        themeColor,
        themeMode,
        selectedBoxId,
        updateSettings,
        setThemeColor,
        setThemeMode,
        selectBox,
        manualTempChange,
        clearAlerts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};