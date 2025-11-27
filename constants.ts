import { AppSettings, ThemeColor, MedicineBox } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  tempMin: 2,
  tempMax: 8,
  humidityMax: 60,
  violationThreshold: 3, // Requires 3 consecutive bad readings
  simulationSpeed: 2000, // 2 seconds per tick
};

export const THEME_COLORS: Record<ThemeColor, { primary: string; hover: string; tailwind: string }> = {
  blue: { primary: '#3b82f6', hover: '#2563eb', tailwind: 'blue' },
  green: { primary: '#22c55e', hover: '#16a34a', tailwind: 'green' },
  purple: { primary: '#a855f7', hover: '#9333ea', tailwind: 'purple' },
  rose: { primary: '#f43f5e', hover: '#e11d48', tailwind: 'rose' },
  amber: { primary: '#f59e0b', hover: '#d97706', tailwind: 'amber' },
};

export const INITIAL_BOXES: MedicineBox[] = [
  {
    id: 'BOX-101',
    name: 'Vaccine Batch Alpha',
    batchNumber: 'V-2023-001',
    location: 'Warehouse Zone A',
    readings: [],
    currentTemp: 4.5,
    currentHumidity: 45,
    status: 'Stable',
    consecutiveViolations: 0,
    isCorrecting: false,
    imageUrl: 'https://picsum.photos/id/10/200/200', // Abstract nature often works well for placeholders
  },
  {
    id: 'BOX-102',
    name: 'Insulin Glargine',
    batchNumber: 'INS-992-X',
    location: 'Transport Truck 4',
    readings: [],
    currentTemp: 5.2,
    currentHumidity: 50,
    status: 'Stable',
    consecutiveViolations: 0,
    isCorrecting: false,
    imageUrl: 'https://picsum.photos/id/20/200/200',
  },
  {
    id: 'BOX-103',
    name: 'Oncology Meds',
    batchNumber: 'ONC-551-B',
    location: 'Cold Room 2',
    readings: [],
    currentTemp: 3.0,
    currentHumidity: 30,
    status: 'Stable',
    consecutiveViolations: 0,
    isCorrecting: false,
    imageUrl: 'https://picsum.photos/id/30/200/200',
  },
];