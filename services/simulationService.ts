import { MedicineBox, AppSettings, AlertEvent, SensorReading } from '../types';

/**
 * SIMULATION ENGINE
 * This mimics the backend processing of Raspberry Pi data.
 * In a real app, this logic would reside on the server or edge device.
 */

// Helper to generate a somewhat realistic random walk for temperature
const getNextValue = (current: number, min: number, max: number, volatility: number, target?: number): number => {
  let change = (Math.random() - 0.5) * volatility;
  
  // If there is a target (auto-correction), bias the change towards it
  if (target !== undefined) {
    const diff = target - current;
    change += diff * 0.3; // Corrective force
  }

  let next = current + change;
  // Hard limits to prevent unrealistic physics
  if (next < -20) next = -20;
  if (next > 40) next = 40;
  return Number(next.toFixed(2));
};

export const simulateTick = (
  boxes: MedicineBox[],
  settings: AppSettings,
  existingAlerts: AlertEvent[]
): { updatedBoxes: MedicineBox[]; newAlerts: AlertEvent[] } => {
  const newAlerts: AlertEvent[] = [];
  
  const updatedBoxes = boxes.map((box) => {
    // 1. Determine next readings
    let nextTemp = box.currentTemp;
    let nextHumidity = box.currentHumidity;
    
    // Auto-correction Logic: If box is correcting, pull values to safe center
    if (box.isCorrecting) {
       const safeTempTarget = (settings.tempMax + settings.tempMin) / 2;
       nextTemp = getNextValue(box.currentTemp, -10, 30, 0.5, safeTempTarget);
       nextHumidity = getNextValue(box.currentHumidity, 30, 70, 1, 45);
    } else {
       // Standard random walk
       nextTemp = getNextValue(box.currentTemp, -10, 30, 0.8);
       nextHumidity = getNextValue(box.currentHumidity, 0, 100, 2);
    }

    // Occasional random shock (1% chance)
    const shock = Math.random() < 0.01;

    // 2. Validate against Rules
    const isTempViolation = nextTemp < settings.tempMin || nextTemp > settings.tempMax;
    const isHumidityViolation = nextHumidity > settings.humidityMax;
    
    // Twist: Consecutive violation logic
    let newViolations = box.consecutiveViolations;
    
    if (isTempViolation || isHumidityViolation || shock) {
      newViolations += 1;
    } else {
      // Recovery: If we are not critical yet, reset violations
      // If we are critical, we need to stay critical until fully resolved (handled by isCorrecting logic essentially)
      if (!box.isCorrecting) {
        newViolations = Math.max(0, newViolations - 1);
      }
    }

    // 3. Determine Status & Triggers
    let newStatus = box.status;
    let newIsCorrecting = box.isCorrecting;

    // Check Trigger Threshold
    if (newViolations >= settings.violationThreshold && !box.isCorrecting) {
      newStatus = 'Critical';
      newIsCorrecting = true; // Trigger auto-correction simulation

      // Generate Alert
      const violationTypes = [];
      if (isTempViolation) violationTypes.push('Temperature');
      if (isHumidityViolation) violationTypes.push('Humidity');
      if (shock) violationTypes.push('Shock');

      const alert: AlertEvent = {
        id: crypto.randomUUID(),
        boxId: box.id,
        boxName: box.name,
        timestamp: Date.now(),
        type: violationTypes.length > 1 ? 'Combined' : (violationTypes[0] as any) || 'Temperature',
        message: `Sequential violation detected: ${violationTypes.join(', ')}. Value: ${nextTemp}°C`,
        severity: 'critical',
        resolved: false,
      };
      newAlerts.push(alert);
    } else if (newViolations > 0 && newViolations < settings.violationThreshold && !box.isCorrecting) {
      newStatus = 'At Risk';
    } else if (newViolations === 0) {
      newStatus = 'Stable';
      newIsCorrecting = false; // Stop correcting if we are stable
    }

    // 4. Update History
    const newReading: SensorReading = {
      timestamp: Date.now(),
      temperature: nextTemp,
      humidity: nextHumidity,
      shock: shock
    };

    const updatedReadings = [...box.readings, newReading].slice(-20); // Keep last 20

    return {
      ...box,
      currentTemp: nextTemp,
      currentHumidity: nextHumidity,
      consecutiveViolations: newViolations,
      status: newStatus,
      isCorrecting: newIsCorrecting,
      readings: updatedReadings
    };
  });

  return { updatedBoxes, newAlerts };
};