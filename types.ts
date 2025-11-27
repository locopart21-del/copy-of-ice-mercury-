export type BoxStatus = 'Stable' | 'At Risk' | 'Critical';

export interface SensorReading {
  timestamp: number;
  temperature: number;
  humidity: number;
  shock: boolean; // Accelerometer > threshold
}

export interface MedicineBox {
  id: string;
  name: string;
  batchNumber: string;
  location: string;
  readings: SensorReading[]; // History for charts
  currentTemp: number;
  currentHumidity: number;
  status: BoxStatus;
  consecutiveViolations: number; // Internal counter for alert logic
  isCorrecting: boolean; // Simulation flag for auto-correction
  imageUrl: string;
}

export interface AlertEvent {
  id: string;
  boxId: string;
  boxName: string;
  type: 'Temperature' | 'Humidity' | 'Shock' | 'Combined';
  message: string;
  timestamp: number;
  severity: 'warning' | 'critical';
  resolved: boolean;
}

export interface AppSettings {
  tempMin: number;
  tempMax: number;
  humidityMax: number;
  violationThreshold: number; // Number of consecutive bad readings to trigger alert
  simulationSpeed: number; // ms
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'rose' | 'amber';
export type ThemeMode = 'light' | 'dark';

export interface AppState {
  boxes: MedicineBox[];
  alerts: AlertEvent[];
  settings: AppSettings;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  selectedBoxId: string | null;
}