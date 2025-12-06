import { useState, useEffect } from 'react';
import { Zap, TrendingUp, Star } from 'lucide-react';
import { getGamificationState, checkDailyBonus } from '../../services/gamificationService';
import { RARITY_COLORS } from '../../data/gamification';

const XPDisplay = ({ compact = false, showBonus = true }) => {
  const [state, setState] = useState(null);
  const [dailyBonus, setDailyBonus] = useState(null);
  const [showBonusAnimation, setShowBonusAnimation] = useState(false);

  useEffect(() => {
    const gamificationState = getGamificationState();
    setState(gamificationState);

    // Check for daily bonus on mount
    if (showBonus) {
      const bonus = checkDailyBonus();
      if (bonus) {
        setDailyBonus(bonus);
        setShowBonusAnimation(true);
        setTimeout(() => setShowBonusAnimation(false), 3000);
      }
    }
  }, [showBonus]);

  if (!state) return null;

  const levelColor = {
    gray: 'from-gray-400 to-gray-600',
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    gold: 'from-gold-400 to-gold-600',
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${levelColor[state.level.color]} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">{state.level.level}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-semibold">{state.xp} XP</span>
          <div className="w-16 h-1.5 bg-carbon-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500"
              style={{ width: `${state.progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-carbon-800/50 rounded-2xl p-5 border border-gold-500/20">
      {/* Daily Bonus Alert */}
      {dailyBonus && showBonusAnimation && (
        <div className="mb-4 p-3 bg-gold-500/20 border border-gold-500/30 rounded-xl animate-pulse">
          <div className="flex items-center gap-2 text-gold-400">
            <span className="text-2xl">{dailyBonus.icon}</span>
            <div>
              <p className="font-bold">{dailyBonus.name}</p>
              <p className="text-sm text-gold-300">
                {dailyBonus.multiplier ? `${dailyBonus.multiplier}x XP today!` : 'Bonus active!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Level & XP */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${levelColor[state.level.color]} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xl font-bold">{state.level.level}</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Level {state.level.level}</p>
            <p className="text-white font-bold text-lg">{state.level.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gold-400">
            <Zap size={18} />
            <span className="font-bold text-xl">{state.xp}</span>
          </div>
          <p className="text-gray-400 text-sm">Total XP</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress to Level {state.progress.nextLevel?.level || 'MAX'}</span>
          <span className="text-gold-400 font-semibold">{state.progress.percentage}%</span>
        </div>
        <div className="h-3 bg-carbon-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500 rounded-full"
            style={{ width: `${state.progress.percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {state.progress.current} / {state.progress.required} XP
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
          <TrendingUp size={18} className="mx-auto text-gold-400 mb-1" />
          <p className="text-white font-bold">{state.streakDays}</p>
          <p className="text-gray-500 text-xs">Day Streak</p>
        </div>
        <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
          <Star size={18} className="mx-auto text-gold-400 mb-1" />
          <p className="text-white font-bold">{state.earnedBadges.length}</p>
          <p className="text-gray-500 text-xs">Badges</p>
        </div>
        <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
          <Zap size={18} className="mx-auto text-gold-400 mb-1" />
          <p className="text-white font-bold">{state.stats.totalWorkouts}</p>
          <p className="text-gray-500 text-xs">Workouts</p>
        </div>
      </div>
    </div>
  );
};

export default XPDisplay;
