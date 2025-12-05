import { Flame } from 'lucide-react';

const StreakDisplay = ({ streak, weeklyTarget, weeklyCompleted }) => (
  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-5 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <Flame className="text-white" size={28} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Weekly Streak</p>
          <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
            {streak} <span className="text-lg text-gray-400">weeks</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">This Week</p>
        <p className="text-xl font-bold text-white">
          {weeklyCompleted}/{weeklyTarget}
        </p>
        <div className="flex gap-1 mt-1" role="img" aria-label={`${weeklyCompleted} of ${weeklyTarget} workouts completed this week`}>
          {Array.from({ length: weeklyTarget }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < weeklyCompleted ? 'bg-orange-500' : 'bg-slate-700'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StreakDisplay;
