import { useState } from 'react';
import { Trophy, Flame, TrendingUp, ChevronUp, ChevronDown, Minus, Crown } from 'lucide-react';
import { SlideIn } from '../ui/AnimatedComponents';

// Mock leaderboard data (in production, this would come from Firebase)
const mockLeaderboard = [
  { id: 1, name: 'Mike C.', avatar: 'MC', xp: 4850, streak: 28, level: 9, change: 0, title: 'Master' },
  { id: 2, name: 'Sarah J.', avatar: 'SJ', xp: 4720, streak: 21, level: 9, change: 1, title: 'Master' },
  { id: 3, name: 'You', avatar: 'JD', xp: 4510, streak: 8, level: 9, change: -1, title: 'Master', isUser: true },
  { id: 4, name: 'Emma D.', avatar: 'ED', xp: 4200, streak: 15, level: 8, change: 2, title: 'Expert' },
  { id: 5, name: 'Jake T.', avatar: 'JT', xp: 3890, streak: 7, level: 8, change: 0, title: 'Expert' },
  { id: 6, name: 'Maria L.', avatar: 'ML', xp: 3650, streak: 12, level: 7, change: -2, title: 'Advanced' },
  { id: 7, name: 'Chris P.', avatar: 'CP', xp: 3400, streak: 5, level: 7, change: 1, title: 'Advanced' },
  { id: 8, name: 'Alex R.', avatar: 'AR', xp: 3100, streak: 3, level: 6, change: 0, title: 'Skilled' },
];

const Leaderboard = ({ compact = false }) => {
  const [filter, setFilter] = useState('xp'); // 'xp' or 'streak'

  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    if (filter === 'streak') return b.streak - a.streak;
    return b.xp - a.xp;
  });

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={20} />;
    if (rank === 2) return <span className="text-gray-300 font-bold">2</span>;
    if (rank === 3) return <span className="text-amber-600 font-bold">3</span>;
    return <span className="text-gray-500">{rank}</span>;
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ChevronUp className="text-green-400" size={16} />;
    if (change < 0) return <ChevronDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-500" size={16} />;
  };

  if (compact) {
    const userRank = sortedLeaderboard.findIndex(u => u.isUser) + 1;
    const userEntry = sortedLeaderboard.find(u => u.isUser);

    return (
      <div className="bg-carbon-800/50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-gold-400" size={20} />
            <span className="text-white font-bold">Leaderboard</span>
          </div>
          <span className="text-gray-400 text-sm">This Week</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
              <span className="text-gold-400 font-bold">#{userRank}</span>
            </div>
            <div>
              <p className="text-white font-semibold">Your Rank</p>
              <p className="text-gray-500 text-xs">{userEntry?.xp?.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getChangeIcon(userEntry?.change)}
            <span className={`text-sm ${userEntry?.change > 0 ? 'text-green-400' : userEntry?.change < 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {Math.abs(userEntry?.change || 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Trophy className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Leaderboard</h3>
            <p className="text-gray-400 text-sm">This Week's Rankings</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('xp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === 'xp' ? 'bg-gold-500/20 text-gold-400' : 'bg-carbon-800 text-gray-400'
          }`}
        >
          <TrendingUp size={16} />
          XP Earned
        </button>
        <button
          onClick={() => setFilter('streak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filter === 'streak' ? 'bg-gold-500/20 text-gold-400' : 'bg-carbon-800 text-gray-400'
          }`}
        >
          <Flame size={16} />
          Streak
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {sortedLeaderboard.map((user, index) => {
          const rank = index + 1;

          return (
            <SlideIn key={user.id} delay={index * 50}>
              <div
                className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${
                  user.isUser
                    ? 'bg-gold-500/10 border border-gold-500/30'
                    : rank <= 3
                    ? 'bg-carbon-800/70'
                    : 'bg-carbon-800/40'
                }`}
              >
                {/* Rank */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankBadge(rank)}
                </div>

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.isUser
                      ? 'bg-gold-gradient text-carbon-900'
                      : 'bg-gradient-to-br from-slate-600 to-slate-700 text-white'
                  }`}
                >
                  {user.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold truncate ${user.isUser ? 'text-gold-400' : 'text-white'}`}>
                      {user.name}
                    </p>
                    {rank === 1 && <Crown className="text-yellow-400 flex-shrink-0" size={14} />}
                  </div>
                  <p className="text-gray-500 text-xs">{user.title} · Level {user.level}</p>
                </div>

                {/* Stats */}
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-white font-bold">
                      {filter === 'streak' ? (
                        <span className="flex items-center gap-1">
                          <Flame className="text-orange-400" size={14} />
                          {user.streak}
                        </span>
                      ) : (
                        user.xp.toLocaleString()
                      )}
                    </p>
                    <p className="text-gray-500 text-xs">{filter === 'streak' ? 'days' : 'XP'}</p>
                  </div>
                  <div className="flex items-center">
                    {getChangeIcon(user.change)}
                  </div>
                </div>
              </div>
            </SlideIn>
          );
        })}
      </div>

      {/* Weekly Reset Notice */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">Rankings reset every Monday at 12:00 AM</p>
      </div>
    </div>
  );
};

export default Leaderboard;
