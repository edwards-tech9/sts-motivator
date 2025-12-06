import { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Users, Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { getSocialSettings } from '../settings/SocialSettings';
import { saveEncouragement, getLiveActivity } from '../../services/localStorage';
import { awardEncouragementXP } from '../../services/gamificationService';

// Simulated live users working out
const MOCK_LIVE_USERS = [
  { id: 1, name: 'Mike C.', avatar: 'MC', color: 'from-blue-500 to-blue-600', action: 'Just hit 315 lb squat!', time: '2m ago' },
  { id: 2, name: 'Sarah J.', avatar: 'SJ', color: 'from-pink-500 to-pink-600', action: 'Finished leg day!', time: '5m ago' },
  { id: 3, name: 'Emma D.', avatar: 'ED', color: 'from-purple-500 to-purple-600', action: 'New PR on bench press!', time: '8m ago' },
  { id: 4, name: 'Jake T.', avatar: 'JT', color: 'from-green-500 to-green-600', action: 'Set 4 of 5 complete', time: '1m ago' },
  { id: 5, name: 'Maria L.', avatar: 'ML', color: 'from-orange-500 to-orange-600', action: 'Going for a PR attempt...', time: 'now' },
];

const RestTimer = ({ duration, onComplete, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showLiveFeed, setShowLiveFeed] = useState(true);
  const [encouragedUsers, setEncouragedUsers] = useState([]);
  const [liveUsers, setLiveUsers] = useState(MOCK_LIVE_USERS.slice(0, 3));

  // Memoize social settings to avoid re-computation on every render
  const socialSettings = useMemo(() => getSocialSettings(), []);
  const circumference = 2 * Math.PI * 120;
  const progress = ((duration - timeLeft) / duration) * circumference;

  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update live users
      const shuffled = [...MOCK_LIVE_USERS].sort(() => 0.5 - Math.random());
      setLiveUsers(shuffled.slice(0, 3 + Math.floor(Math.random() * 2)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleEncourage = (userId) => {
    if (!encouragedUsers.includes(userId)) {
      const user = liveUsers.find(u => u.id === userId);
      if (user) {
        saveEncouragement({
          toUserId: userId,
          toUserName: user.name,
          message: 'Sent encouragement during rest',
          fromPage: 'rest-timer',
        });
        // Award XP for sending encouragement
        awardEncouragementXP();
      }
      setEncouragedUsers([...encouragedUsers, userId]);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    if (isPaused) return;

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount) => {
    setTimeLeft(t => Math.max(0, t + amount));
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-carbon-900 to-slate-950 flex flex-col items-center justify-center z-50"
      role="dialog"
      aria-label="Rest timer"
    >
      <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">REST</p>

      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90" aria-hidden="true">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="140" cy="140" r="120" fill="none"
            stroke="url(#timerGradient)" strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-7xl font-black text-white"
            style={{ fontFamily: 'Oswald, sans-serif' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-12" role="group" aria-label="Timer controls">
        <button
          onClick={() => adjustTime(-15)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Subtract 15 seconds"
        >
          -15s
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={() => adjustTime(15)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Add 15 seconds"
        >
          +15s
        </button>
      </div>

      {/* Skip Rest Button - positioned above live feed */}
      <div className={`${socialSettings.showLiveActivity && socialSettings.socialVisibility !== 'private' ? 'mb-48' : ''} relative z-[60]`}>
        <button
          onClick={onSkip}
          className="bg-gold-gradient text-carbon-900 font-bold py-4 px-16 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-900"
        >
          SKIP REST
        </button>
      </div>

      {/* Live Activity Feed - Shown during rest */}
      {socialSettings.showLiveActivity && socialSettings.socialVisibility !== 'private' && (
        <div className="absolute bottom-0 left-0 right-0 bg-carbon-900/95 backdrop-blur-lg border-t border-carbon-700 z-[55]">
          <button
            onClick={() => setShowLiveFeed(!showLiveFeed)}
            className="w-full flex items-center justify-between p-3 hover:bg-carbon-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Users className="text-gold-400" size={18} />
              <span className="text-white font-semibold text-sm">Live Activity</span>
              <span className="text-gray-500 text-xs">({liveUsers.length} working out)</span>
            </div>
            {showLiveFeed ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
          </button>

          {showLiveFeed && (
            <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto">
              {liveUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-carbon-800/50 rounded-xl animate-slide-in"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{user.time}</span>
                    <button
                      onClick={() => handleEncourage(user.id)}
                      disabled={encouragedUsers.includes(user.id)}
                      className={`p-2 rounded-xl transition-all ${
                        encouragedUsers.includes(user.id)
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'bg-carbon-700 text-gray-400 hover:bg-gold-500/20 hover:text-gold-400 active:scale-95'
                      }`}
                      aria-label={`Send encouragement to ${user.name}`}
                    >
                      <Flame size={16} className={encouragedUsers.includes(user.id) ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </div>
              ))}

              {encouragedUsers.length > 0 && (
                <div className="text-center py-2">
                  <span className="text-gold-400 text-xs font-semibold">
                    🔥 You've sent {encouragedUsers.length} encouragement{encouragedUsers.length > 1 ? 's' : ''}!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestTimer;
