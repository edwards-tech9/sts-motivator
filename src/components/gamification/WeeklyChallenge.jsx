import { Target, Trophy, Clock } from 'lucide-react';
import { getGamificationState } from '../../services/gamificationService';
import { getCurrentWeeklyChallenge } from '../../data/gamification';

const WeeklyChallenge = () => {
  const state = getGamificationState();
  const challenge = getCurrentWeeklyChallenge();
  const progress = state.weeklyChallenge?.progress || 0;
  const completed = state.weeklyChallenge?.completed || false;
  const percentage = Math.min(100, Math.round((progress / challenge.target) * 100));

  // Calculate days remaining in the week
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysRemaining = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  return (
    <div className={`rounded-2xl p-5 border ${
      completed
        ? 'bg-gold-500/10 border-gold-500/30'
        : 'bg-carbon-800/50 border-carbon-700'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            completed ? 'bg-gold-500' : 'bg-carbon-700'
          }`}>
            {completed ? (
              <Trophy size={24} className="text-carbon-900" />
            ) : (
              <Target size={24} className="text-gold-400" />
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Weekly Challenge</p>
            <h3 className="text-white font-bold text-lg">{challenge.name}</h3>
          </div>
        </div>
        {!completed && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock size={14} />
            <span>{daysRemaining}d left</span>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">
            {progress.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}
          </span>
          <span className={completed ? 'text-gold-400 font-semibold' : 'text-gray-400'}>
            {percentage}%
          </span>
        </div>
        <div className="h-3 bg-carbon-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completed
                ? 'bg-gradient-to-r from-gold-500 to-gold-300'
                : 'bg-gradient-to-r from-blue-500 to-blue-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Reward */}
      <div className={`flex items-center justify-between p-3 rounded-xl ${
        completed ? 'bg-gold-500/20' : 'bg-carbon-900/50'
      }`}>
        <span className={completed ? 'text-gold-400' : 'text-gray-400'}>
          {completed ? 'Reward Claimed!' : 'Reward:'}
        </span>
        <span className={`font-bold ${completed ? 'text-gold-400' : 'text-white'}`}>
          +{challenge.xpReward} XP
        </span>
      </div>

      {completed && (
        <p className="text-center text-gold-400 text-sm mt-3 font-semibold">
          Challenge Completed!
        </p>
      )}
    </div>
  );
};

export default WeeklyChallenge;
