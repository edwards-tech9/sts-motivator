import { useState, useEffect } from 'react';
import { Target, Zap, Check, Gift, ChevronRight, Flame, Star } from 'lucide-react';
import { SlideIn } from '../ui/AnimatedComponents';

// Daily quests that refresh each day
const generateDailyQuests = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const allQuests = [
    { id: 'warmup', name: 'Warm Up', description: 'Complete your warm-up routine', xp: 15, icon: Flame, target: 1, unit: 'routine' },
    { id: 'sets_10', name: 'Set Crusher', description: 'Complete 10 sets', xp: 25, icon: Target, target: 10, unit: 'sets' },
    { id: 'sets_20', name: 'Volume King', description: 'Complete 20 sets', xp: 50, icon: Target, target: 20, unit: 'sets' },
    { id: 'compound', name: 'Compound Master', description: 'Do 3 compound exercises', xp: 30, icon: Zap, target: 3, unit: 'exercises' },
    { id: 'volume_5k', name: 'Heavy Lifting', description: 'Lift 5,000+ lbs total', xp: 35, icon: Star, target: 5000, unit: 'lbs' },
    { id: 'volume_10k', name: 'Iron Will', description: 'Lift 10,000+ lbs total', xp: 60, icon: Star, target: 10000, unit: 'lbs' },
    { id: 'pr_attempt', name: 'Chase the PR', description: 'Attempt a personal record', xp: 40, icon: Star, target: 1, unit: 'attempt' },
    { id: 'complete', name: 'Full Send', description: 'Complete your workout', xp: 50, icon: Check, target: 1, unit: 'workout' },
  ];

  // Select 3 quests based on the day's seed
  const shuffled = [...allQuests].sort((a, b) => ((seed * a.id.length) % 100) - ((seed * b.id.length) % 100));
  return shuffled.slice(0, 3);
};

// Get saved quest progress from localStorage
const getQuestProgress = () => {
  try {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('sts_daily_quests');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed.progress;
      }
    }
    return {};
  } catch {
    // If parsing fails, return empty progress
    return {};
  }
};

// Save quest progress
const saveQuestProgress = (progress) => {
  try {
    const today = new Date().toDateString();
    localStorage.setItem('sts_daily_quests', JSON.stringify({ date: today, progress }));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

const DailyQuests = ({ compact = false }) => {
  const [quests, setQuests] = useState([]);
  const [progress, setProgress] = useState({});
  const [claimedRewards, setClaimedRewards] = useState(new Set());
  const [showReward, setShowReward] = useState(null);

  useEffect(() => {
    setQuests(generateDailyQuests());
    setProgress(getQuestProgress());
  }, []);

  const handleClaimReward = (quest) => {
    if (claimedRewards.has(quest.id)) return;

    setShowReward(quest);
    setClaimedRewards(prev => new Set([...prev, quest.id]));

    // Add XP to user state (in real app this would update gamification service)
    const currentXP = parseInt(localStorage.getItem('sts_total_xp') || '0', 10);
    localStorage.setItem('sts_total_xp', String(currentXP + quest.xp));

    setTimeout(() => setShowReward(null), 2000);
  };

  const totalXP = quests.reduce((acc, q) => acc + q.xp, 0);
  const earnedXP = quests.reduce((acc, q) => {
    const current = progress[q.id] || 0;
    const completed = current >= q.target;
    return acc + (completed && claimedRewards.has(q.id) ? q.xp : 0);
  }, 0);

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Gift className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Daily Quests</p>
              <p className="text-gray-400 text-sm">{earnedXP}/{totalXP} XP available</p>
            </div>
          </div>
          <ChevronRight className="text-gray-500" size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Gift className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Daily Quests</h3>
            <p className="text-gray-400 text-sm">Refresh in {getTimeUntilReset()}</p>
          </div>
        </div>
        <div className="bg-carbon-800 px-3 py-1 rounded-full">
          <span className="text-gold-400 font-semibold">{earnedXP}/{totalXP} XP</span>
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {quests.map((quest, index) => {
          const current = progress[quest.id] || 0;
          const completed = current >= quest.target;
          const claimed = claimedRewards.has(quest.id);
          const percentage = Math.min(100, Math.round((current / quest.target) * 100));
          const Icon = quest.icon;

          return (
            <SlideIn key={quest.id} delay={index * 100}>
              <div
                className={`p-4 rounded-2xl transition-all ${
                  completed
                    ? claimed
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-gold-500/10 border border-gold-500/30 animate-pulse'
                    : 'bg-carbon-800/50 border border-carbon-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      completed ? 'bg-gold-500/20' : 'bg-carbon-700'
                    }`}
                  >
                    {claimed ? (
                      <Check className="text-green-400" size={24} />
                    ) : (
                      <Icon className={completed ? 'text-gold-400' : 'text-gray-400'} size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-semibold ${claimed ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {quest.name}
                      </p>
                      <span className="text-gold-400 font-bold text-sm">+{quest.xp} XP</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-carbon-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            completed ? 'bg-gradient-to-r from-gold-500 to-gold-300' : 'bg-gray-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs whitespace-nowrap">
                        {current}/{quest.target} {quest.unit}
                      </span>
                    </div>
                  </div>

                  {/* Claim Button */}
                  {completed && !claimed && (
                    <button
                      onClick={() => handleClaimReward(quest)}
                      className="px-4 py-2 bg-gold-gradient text-carbon-900 font-bold rounded-xl hover:scale-105 transition-transform flex-shrink-0"
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            </SlideIn>
          );
        })}
      </div>

      {/* All Quests Complete Bonus */}
      {quests.every(q => claimedRewards.has(q.id)) && (
        <SlideIn delay={300}>
          <div className="bg-gradient-to-r from-gold-500/20 to-purple-500/20 border border-gold-500/30 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">
              <Star className="inline text-gold-400" size={32} />
            </div>
            <p className="text-white font-bold text-lg">All Quests Complete!</p>
            <p className="text-gray-400 text-sm">Come back tomorrow for new challenges</p>
          </div>
        </SlideIn>
      )}

      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-carbon-900 rounded-3xl p-8 text-center animate-scale-up">
            <div className="text-6xl mb-4">
              <Zap className="inline text-gold-400" size={64} />
            </div>
            <p className="text-gold-400 font-bold text-3xl mb-2">+{showReward.xp} XP</p>
            <p className="text-white font-semibold">{showReward.name} Complete!</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get time until daily reset
function getTimeUntilReset() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

export default DailyQuests;
