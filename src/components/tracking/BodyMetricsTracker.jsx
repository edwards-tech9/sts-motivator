import { useState, useEffect } from 'react';
import { Scale, Moon, Utensils, Ruler, TrendingUp, TrendingDown, Minus, Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getBodyMetrics,
  saveBodyMetric,
  getLatestBodyMetric,
  getWeightTrend,
  getSleepLogs,
  saveSleepLog,
  getSleepAverage,
  getNutritionLogs,
  saveNutritionLog,
  getNutritionAverage,
  getMeasurements,
  saveMeasurements,
  getLatestMeasurements,
  calculateBMI,
} from '../../services/bodyMetricsService';

// Quick Log Modal for Body Weight
const WeightLogModal = ({ userId, onClose, onSave }) => {
  const latest = getLatestBodyMetric(userId);
  const [weight, setWeight] = useState(latest?.weight || '');
  const [bodyFat, setBodyFat] = useState(latest?.bodyFat || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!weight) return;
    setSaving(true);
    const result = saveBodyMetric(userId, {
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
    });
    if (result.success) {
      onSave?.();
      setTimeout(() => onClose(), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-carbon-900 rounded-3xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Scale className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Log Weight</p>
              <p className="text-gray-500 text-sm">Quick daily check-in</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="185.0"
              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white text-xl font-bold text-center placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Body Fat % (optional)</label>
            <input
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="15.0"
              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!weight || saving}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Check size={20} /> : <Scale size={20} />}
            {saving ? 'Saved!' : 'Save Weight'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Log Modal for Sleep
const SleepLogModal = ({ userId, onClose, onSave }) => {
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(30);
  const [quality, setQuality] = useState(3); // 1-5 scale
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    const duration = hours + minutes / 60;
    const result = saveSleepLog(userId, {
      duration,
      quality,
      hours,
      minutes,
    });
    if (result.success) {
      onSave?.();
      setTimeout(() => onClose(), 500);
    }
  };

  const qualityLabels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Great'];
  const qualityColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-carbon-900 rounded-3xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Moon className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Log Sleep</p>
              <p className="text-gray-500 text-sm">How'd you sleep last night?</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Duration */}
          <div>
            <label className="block text-gray-400 text-sm mb-3">Duration</label>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHours(Math.max(0, hours - 1))}
                    className="p-2 bg-carbon-800 rounded-lg hover:bg-carbon-700"
                  >
                    <Minus size={16} className="text-gray-400" />
                  </button>
                  <span className="text-3xl font-bold text-white w-12 text-center">{hours}</span>
                  <button
                    onClick={() => setHours(Math.min(12, hours + 1))}
                    className="p-2 bg-carbon-800 rounded-lg hover:bg-carbon-700"
                  >
                    <Plus size={16} className="text-gray-400" />
                  </button>
                </div>
                <span className="text-gray-500 text-xs mt-1">hours</span>
              </div>
              <span className="text-2xl text-gray-500">:</span>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMinutes(minutes === 0 ? 45 : minutes - 15)}
                    className="p-2 bg-carbon-800 rounded-lg hover:bg-carbon-700"
                  >
                    <Minus size={16} className="text-gray-400" />
                  </button>
                  <span className="text-3xl font-bold text-white w-12 text-center">{String(minutes).padStart(2, '0')}</span>
                  <button
                    onClick={() => setMinutes(minutes === 45 ? 0 : minutes + 15)}
                    className="p-2 bg-carbon-800 rounded-lg hover:bg-carbon-700"
                  >
                    <Plus size={16} className="text-gray-400" />
                  </button>
                </div>
                <span className="text-gray-500 text-xs mt-1">mins</span>
              </div>
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-gray-400 text-sm mb-3">
              Quality: <span className={qualityColors[quality]}>{qualityLabels[quality]}</span>
            </label>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    quality === q
                      ? 'bg-purple-500 text-white'
                      : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Check size={20} /> : <Moon size={20} />}
            {saving ? 'Saved!' : 'Save Sleep'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Log Modal for Nutrition
const NutritionLogModal = ({ userId, onClose, onSave }) => {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [water, setWater] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!calories && !protein) return;
    setSaving(true);
    const result = saveNutritionLog(userId, {
      calories: calories ? parseInt(calories) : null,
      protein: protein ? parseInt(protein) : null,
      carbs: carbs ? parseInt(carbs) : null,
      fat: fat ? parseInt(fat) : null,
      water: water ? parseFloat(water) : null,
    });
    if (result.success) {
      onSave?.();
      setTimeout(() => onClose(), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-carbon-900 rounded-3xl w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-carbon-700 flex items-center justify-between sticky top-0 bg-carbon-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Utensils className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Log Nutrition</p>
              <p className="text-gray-500 text-sm">Today's intake</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="2000"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="150"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="200"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Fat (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="70"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">Water (liters)</label>
            <input
              type="number"
              step="0.5"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="3.0"
              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={(!calories && !protein) || saving}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Check size={20} /> : <Utensils size={20} />}
            {saving ? 'Saved!' : 'Save Nutrition'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Measurements Log Modal
const MeasurementsLogModal = ({ userId, onClose, onSave }) => {
  const latest = getLatestMeasurements(userId);
  const [measurements, setMeasurements] = useState({
    chest: latest?.chest || '',
    waist: latest?.waist || '',
    hips: latest?.hips || '',
    leftArm: latest?.leftArm || '',
    rightArm: latest?.rightArm || '',
    leftThigh: latest?.leftThigh || '',
    rightThigh: latest?.rightThigh || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    const hasValues = Object.values(measurements).some(v => v);
    if (!hasValues) return;

    setSaving(true);
    const cleanMeasurements = {};
    Object.entries(measurements).forEach(([key, value]) => {
      if (value) cleanMeasurements[key] = parseFloat(value);
    });

    const result = saveMeasurements(userId, cleanMeasurements);
    if (result.success) {
      onSave?.();
      setTimeout(() => onClose(), 500);
    }
  };

  const fields = [
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'hips', label: 'Hips' },
    { key: 'leftArm', label: 'Left Arm' },
    { key: 'rightArm', label: 'Right Arm' },
    { key: 'leftThigh', label: 'Left Thigh' },
    { key: 'rightThigh', label: 'Right Thigh' },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-carbon-900 rounded-3xl w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-carbon-700 flex items-center justify-between sticky top-0 bg-carbon-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Ruler className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Body Measurements</p>
              <p className="text-gray-500 text-sm">Circumferences (inches)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {fields.map((field) => (
            <div key={field.key} className="flex items-center justify-between">
              <label className="text-gray-400 text-sm">{field.label}</label>
              <input
                type="number"
                step="0.25"
                value={measurements[field.key]}
                onChange={(e) => setMeasurements({ ...measurements, [field.key]: e.target.value })}
                placeholder="--"
                className="w-24 bg-carbon-800 border border-carbon-700 rounded-lg py-2 px-3 text-white text-center placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Check size={20} /> : <Ruler size={20} />}
            {saving ? 'Saved!' : 'Save Measurements'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Tracker Widget (for athlete home page)
const BodyMetricsTracker = ({ userId = 'demo' }) => {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const latestWeight = getLatestBodyMetric(userId);
  const weightTrend = getWeightTrend(userId, 30);
  const sleepAvg = getSleepAverage(userId, 7);
  const nutritionAvg = getNutritionAverage(userId, 7);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const getTrendIcon = (trend) => {
    if (trend === 'gaining') return <TrendingUp size={14} className="text-green-400" />;
    if (trend === 'losing') return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Scale className="text-blue-400" size={20} />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Body Tracking</p>
              <p className="text-gray-500 text-xs">Weight, sleep, nutrition</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {latestWeight && (
              <div className="text-right">
                <p className="text-white font-bold">{latestWeight.weight} lbs</p>
                <div className="flex items-center gap-1 justify-end">
                  {getTrendIcon(weightTrend.trend)}
                  <span className="text-gray-500 text-xs">
                    {weightTrend.change > 0 ? '+' : ''}{weightTrend.change} lbs
                  </span>
                </div>
              </div>
            )}
            {expanded ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <Moon className="text-purple-400 mx-auto mb-1" size={16} />
                <p className="text-white font-bold text-sm">
                  {sleepAvg ? `${sleepAvg.avgDuration.toFixed(1)}h` : '--'}
                </p>
                <p className="text-gray-500 text-xs">Avg Sleep</p>
              </div>
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <Utensils className="text-green-400 mx-auto mb-1" size={16} />
                <p className="text-white font-bold text-sm">
                  {nutritionAvg ? `${nutritionAvg.avgCalories}` : '--'}
                </p>
                <p className="text-gray-500 text-xs">Avg Cals</p>
              </div>
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <Scale className="text-blue-400 mx-auto mb-1" size={16} />
                <p className="text-white font-bold text-sm">
                  {latestWeight?.bodyFat ? `${latestWeight.bodyFat}%` : '--'}
                </p>
                <p className="text-gray-500 text-xs">Body Fat</p>
              </div>
            </div>

            {/* Log Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowWeightModal(true)}
                className="flex items-center justify-center gap-2 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-semibold text-sm transition-colors"
              >
                <Scale size={16} />
                Log Weight
              </button>
              <button
                onClick={() => setShowSleepModal(true)}
                className="flex items-center justify-center gap-2 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-semibold text-sm transition-colors"
              >
                <Moon size={16} />
                Log Sleep
              </button>
              <button
                onClick={() => setShowNutritionModal(true)}
                className="flex items-center justify-center gap-2 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-semibold text-sm transition-colors"
              >
                <Utensils size={16} />
                Log Nutrition
              </button>
              <button
                onClick={() => setShowMeasurementsModal(true)}
                className="flex items-center justify-center gap-2 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl font-semibold text-sm transition-colors"
              >
                <Ruler size={16} />
                Measurements
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showWeightModal && (
        <WeightLogModal
          userId={userId}
          onClose={() => setShowWeightModal(false)}
          onSave={handleRefresh}
        />
      )}
      {showSleepModal && (
        <SleepLogModal
          userId={userId}
          onClose={() => setShowSleepModal(false)}
          onSave={handleRefresh}
        />
      )}
      {showNutritionModal && (
        <NutritionLogModal
          userId={userId}
          onClose={() => setShowNutritionModal(false)}
          onSave={handleRefresh}
        />
      )}
      {showMeasurementsModal && (
        <MeasurementsLogModal
          userId={userId}
          onClose={() => setShowMeasurementsModal(false)}
          onSave={handleRefresh}
        />
      )}
    </>
  );
};

export default BodyMetricsTracker;
