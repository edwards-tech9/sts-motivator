// Body Metrics Service - Weight, body composition, sleep, and nutrition tracking
// Designed to be compatible with future Terra API / Renpho integration

const STORAGE_KEYS = {
  BODY_METRICS: 'sts_body_metrics',
  SLEEP_LOG: 'sts_sleep_log',
  NUTRITION_LOG: 'sts_nutrition_log',
  MEASUREMENTS: 'sts_measurements',
};

// ============================================
// BODY METRICS (Weight, Body Fat, BMI, etc.)
// ============================================

// Get all body metrics for a user
export const getBodyMetrics = (userId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.BODY_METRICS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading body metrics:', e);
    return [];
  }
};

// Save a new body metric entry
export const saveBodyMetric = (userId, metric) => {
  try {
    const metrics = getBodyMetrics(userId);
    const newEntry = {
      id: `bm_${Date.now()}`,
      date: new Date().toISOString(),
      ...metric,
      source: metric.source || 'manual', // 'manual', 'renpho', 'apple_health', etc.
    };
    metrics.unshift(newEntry); // Add to beginning (most recent first)
    localStorage.setItem(`${STORAGE_KEYS.BODY_METRICS}_${userId}`, JSON.stringify(metrics));
    return { success: true, entry: newEntry };
  } catch (e) {
    console.error('Error saving body metric:', e);
    return { success: false, error: e.message };
  }
};

// Get latest body metric
export const getLatestBodyMetric = (userId) => {
  const metrics = getBodyMetrics(userId);
  return metrics.length > 0 ? metrics[0] : null;
};

// Calculate BMI from weight (lbs) and height (inches)
export const calculateBMI = (weightLbs, heightInches) => {
  if (!weightLbs || !heightInches) return null;
  // BMI = (weight in lbs / height in inches²) × 703
  return Math.round((weightLbs / (heightInches * heightInches)) * 703 * 10) / 10;
};

// Get weight trend (last 7, 30 days)
export const getWeightTrend = (userId, days = 30) => {
  const metrics = getBodyMetrics(userId);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentMetrics = metrics.filter(m => new Date(m.date) > cutoffDate && m.weight);

  if (recentMetrics.length < 2) return { trend: 'insufficient_data', change: 0 };

  const oldest = recentMetrics[recentMetrics.length - 1].weight;
  const newest = recentMetrics[0].weight;
  const change = Math.round((newest - oldest) * 10) / 10;

  return {
    trend: change > 0 ? 'gaining' : change < 0 ? 'losing' : 'maintaining',
    change,
    startWeight: oldest,
    currentWeight: newest,
    entries: recentMetrics.length,
  };
};

// ============================================
// BODY MEASUREMENTS (Circumferences)
// ============================================

// Get all measurements for a user
export const getMeasurements = (userId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.MEASUREMENTS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading measurements:', e);
    return [];
  }
};

// Save new measurements
export const saveMeasurements = (userId, measurements) => {
  try {
    const existing = getMeasurements(userId);
    const newEntry = {
      id: `ms_${Date.now()}`,
      date: new Date().toISOString(),
      ...measurements,
    };
    existing.unshift(newEntry);
    localStorage.setItem(`${STORAGE_KEYS.MEASUREMENTS}_${userId}`, JSON.stringify(existing));
    return { success: true, entry: newEntry };
  } catch (e) {
    console.error('Error saving measurements:', e);
    return { success: false, error: e.message };
  }
};

// Get latest measurements
export const getLatestMeasurements = (userId) => {
  const measurements = getMeasurements(userId);
  return measurements.length > 0 ? measurements[0] : null;
};

// ============================================
// SLEEP TRACKING
// ============================================

// Get sleep logs for a user
export const getSleepLogs = (userId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.SLEEP_LOG}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading sleep logs:', e);
    return [];
  }
};

// Save a sleep entry
export const saveSleepLog = (userId, sleepData) => {
  try {
    const logs = getSleepLogs(userId);
    const newEntry = {
      id: `sl_${Date.now()}`,
      date: new Date().toISOString(),
      ...sleepData,
      source: sleepData.source || 'manual',
    };
    logs.unshift(newEntry);
    localStorage.setItem(`${STORAGE_KEYS.SLEEP_LOG}_${userId}`, JSON.stringify(logs));
    return { success: true, entry: newEntry };
  } catch (e) {
    console.error('Error saving sleep log:', e);
    return { success: false, error: e.message };
  }
};

// Get sleep average for past N days
export const getSleepAverage = (userId, days = 7) => {
  const logs = getSleepLogs(userId);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter(l => new Date(l.date) > cutoffDate && l.duration);

  if (recentLogs.length === 0) return null;

  const avgDuration = recentLogs.reduce((sum, l) => sum + l.duration, 0) / recentLogs.length;
  const avgQuality = recentLogs.filter(l => l.quality).reduce((sum, l) => sum + l.quality, 0) /
                     recentLogs.filter(l => l.quality).length || null;

  return {
    avgDuration: Math.round(avgDuration * 10) / 10,
    avgQuality: avgQuality ? Math.round(avgQuality * 10) / 10 : null,
    entries: recentLogs.length,
    days,
  };
};

// ============================================
// NUTRITION TRACKING
// ============================================

// Get nutrition logs for a user
export const getNutritionLogs = (userId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.NUTRITION_LOG}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading nutrition logs:', e);
    return [];
  }
};

// Save nutrition entry
export const saveNutritionLog = (userId, nutritionData) => {
  try {
    const logs = getNutritionLogs(userId);
    const newEntry = {
      id: `nl_${Date.now()}`,
      date: new Date().toISOString(),
      ...nutritionData,
    };
    logs.unshift(newEntry);
    localStorage.setItem(`${STORAGE_KEYS.NUTRITION_LOG}_${userId}`, JSON.stringify(logs));
    return { success: true, entry: newEntry };
  } catch (e) {
    console.error('Error saving nutrition log:', e);
    return { success: false, error: e.message };
  }
};

// Get nutrition average for past N days
export const getNutritionAverage = (userId, days = 7) => {
  const logs = getNutritionLogs(userId);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter(l => new Date(l.date) > cutoffDate);

  if (recentLogs.length === 0) return null;

  const avgCalories = recentLogs.reduce((sum, l) => sum + (l.calories || 0), 0) / recentLogs.length;
  const avgProtein = recentLogs.reduce((sum, l) => sum + (l.protein || 0), 0) / recentLogs.length;
  const avgCarbs = recentLogs.reduce((sum, l) => sum + (l.carbs || 0), 0) / recentLogs.length;
  const avgFat = recentLogs.reduce((sum, l) => sum + (l.fat || 0), 0) / recentLogs.length;

  return {
    avgCalories: Math.round(avgCalories),
    avgProtein: Math.round(avgProtein),
    avgCarbs: Math.round(avgCarbs),
    avgFat: Math.round(avgFat),
    entries: recentLogs.length,
    days,
  };
};

// ============================================
// COMPREHENSIVE ATHLETE WELLNESS SNAPSHOT
// ============================================

export const getWellnessSnapshot = (userId) => {
  const latestMetric = getLatestBodyMetric(userId);
  const weightTrend = getWeightTrend(userId, 30);
  const sleepAvg = getSleepAverage(userId, 7);
  const nutritionAvg = getNutritionAverage(userId, 7);
  const latestMeasurements = getLatestMeasurements(userId);

  return {
    body: {
      current: latestMetric,
      trend: weightTrend,
    },
    measurements: latestMeasurements,
    sleep: sleepAvg,
    nutrition: nutritionAvg,
    lastUpdated: latestMetric?.date || null,
  };
};

// ============================================
// TERRA API / RENPHO WEBHOOK HANDLER
// (Ready for future integration)
// ============================================

// Process incoming data from Terra API webhook
export const processTerraWebhook = (userId, terraData) => {
  // Terra sends normalized body data in this format
  if (terraData.type === 'body') {
    const measurements = terraData.data?.measurements_data;
    if (measurements) {
      saveBodyMetric(userId, {
        weight: measurements.weight_kg ? measurements.weight_kg * 2.205 : null, // Convert to lbs
        bodyFat: measurements.body_fat_percentage,
        muscleMass: measurements.muscle_mass_kg ? measurements.muscle_mass_kg * 2.205 : null,
        boneMass: measurements.bone_mass_kg ? measurements.bone_mass_kg * 2.205 : null,
        waterPercent: measurements.water_percentage,
        bmi: measurements.bmi,
        source: 'renpho',
        rawData: terraData,
      });
    }
  }

  if (terraData.type === 'sleep') {
    const sleepData = terraData.data;
    if (sleepData) {
      saveSleepLog(userId, {
        duration: sleepData.duration_hours,
        quality: sleepData.sleep_score,
        deepSleep: sleepData.deep_sleep_hours,
        remSleep: sleepData.rem_sleep_hours,
        lightSleep: sleepData.light_sleep_hours,
        source: terraData.source || 'device',
        rawData: terraData,
      });
    }
  }

  return { success: true };
};

export default {
  // Body Metrics
  getBodyMetrics,
  saveBodyMetric,
  getLatestBodyMetric,
  calculateBMI,
  getWeightTrend,
  // Measurements
  getMeasurements,
  saveMeasurements,
  getLatestMeasurements,
  // Sleep
  getSleepLogs,
  saveSleepLog,
  getSleepAverage,
  // Nutrition
  getNutritionLogs,
  saveNutritionLog,
  getNutritionAverage,
  // Comprehensive
  getWellnessSnapshot,
  // Terra Integration
  processTerraWebhook,
};
