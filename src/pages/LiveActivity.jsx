import { useState, useEffect } from 'react';
import { Radio, Flame, Trophy, TrendingUp, Dumbbell, Clock, Filter, Users, Zap } from 'lucide-react';
import { PageTransition, SlideIn, StaggerContainer, ScaleIn } from '../components/ui/AnimatedComponents';
import { getSocialSettings } from '../components/settings/SocialSettings';
import { getLiveActivity, saveEncouragement } from '../services/localStorage';
import { awardEncouragementXP } from '../services/gamificationService';

// Fallback mock data when no real athletes
const MOCK_LIVE_USERS = [
  { id: 1, name: 'Mike C.', avatar: 'MC', color: 'from-blue-500 to-blue-600', action: 'Just hit 315 lb squat!', time: '2m ago', type: 'pr', exercise: 'Squat' },
  { id: 2, name: 'Sarah J.', avatar: 'SJ', color: 'from-pink-500 to-pink-600', action: 'Finished leg day!', time: '5m ago', type: 'complete', exercise: 'Workout Complete' },
  { id: 3, name: 'Emma D.', avatar: 'ED', color: 'from-purple-500 to-purple-600', action: 'New PR on bench press!', time: '8m ago', type: 'pr', exercise: 'Bench Press' },
  { id: 4, name: 'Jake T.', avatar: 'JT', color: 'from-green-500 to-green-600', action: 'Set 4 of 5 complete', time: '1m ago', type: 'set', exercise: 'Deadlift' },
  { id: 5, name: 'Maria L.', avatar: 'ML', color: 'from-orange-500 to-orange-600', action: 'Going for a PR attempt...', time: 'now', type: 'attempt', exercise: 'Squat' },
  { id: 6, name: 'Chris R.', avatar: 'CR', color: 'from-cyan-500 to-cyan-600', action: 'Starting upper body', time: '3m ago', type: 'start', exercise: 'Upper Body' },
  { id: 7, name: 'Ava W.', avatar: 'AW', color: 'from-rose-500 to-rose-600', action: '225 lb x 8 reps!', time: '4m ago', type: 'set', exercise: 'Romanian Deadlift' },
  { id: 8, name: 'David K.', avatar: 'DK', color: 'from-amber-500 to-amber-600', action: 'New 1RM: 405 lbs!', time: '6m ago', type: 'pr', exercise: 'Deadlift' },
  { id: 9, name: 'Lisa M.', avatar: 'LM', color: 'from-teal-500 to-teal-600', action: 'Crushing pull day!', time: '7m ago', type: 'set', exercise: 'Pull-ups' },
  { id: 10, name: 'Ryan P.', avatar: 'RP', color: 'from-indigo-500 to-indigo-600', action: 'Final set incoming', time: '30s ago', type: 'attempt', exercise: 'Overhead Press' },
];

const LiveActivity = () => {
  const [liveUsers, setLiveUsers] = useState([]);
  const [encouragedUsers, setEncouragedUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showToast, setShowToast] = useState(null);
  const socialSettings = getSocialSettings();

  // Load live activity - try real data first, fallback to mock
  const loadLiveActivity = () => {
    const realActivity = getLiveActivity();
    if (realActivity && realActivity.length > 0) {
      return realActivity;
    }
    // Fallback to mock data with random shuffle
    const shuffled = [...MOCK_LIVE_USERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6 + Math.floor(Math.random() * 4));
  };

  // Initial load and periodic updates
  useEffect(() => {
    setLiveUsers(loadLiveActivity());

    const interval = setInterval(() => {
      setLiveUsers(loadLiveActivity());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEncourage = (userId) => {
    if (!encouragedUsers.includes(userId)) {
      // Find the user to get their details
      const user = liveUsers.find(u => u.id === userId);
      if (user) {
        // Persist encouragement to localStorage
        saveEncouragement({
          toUserId: userId,
          toUserName: user.name,
          message: 'Sent encouragement',
          fromPage: 'live-activity',
        });

        // Award XP for sending encouragement
        const xpResult = awardEncouragementXP();

        // Show toast notification with XP
        setShowToast(`Sent encouragement to ${user.name}! +${xpResult.xpAwarded} XP`);
        setTimeout(() => setShowToast(null), 2500);
      }
      setEncouragedUsers([...encouragedUsers, userId]);
    }
  };

  const filteredUsers = filter === 'all'
    ? liveUsers
    : liveUsers.filter(u => u.type === filter);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'pr': return <Trophy className="text-yellow-400" size={16} />;
      case 'complete': return <TrendingUp className="text-green-400" size={16} />;
      case 'set': return <Dumbbell className="text-blue-400" size={16} />;
      case 'attempt': return <Flame className="text-orange-400" size={16} />;
      case 'start': return <Clock className="text-purple-400" size={16} />;
      default: return <Dumbbell className="text-gray-400" size={16} />;
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case 'pr': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'PR' };
      case 'complete': return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Done' };
      case 'set': return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Set' };
      case 'attempt': return { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Live' };
      case 'start': return { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Start' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '' };
    }
  };

  // Check if social features are enabled
  if (!socialSettings.showLiveActivity || socialSettings.socialVisibility === 'private') {
    return (
      <PageTransition>
        <div className="min-h-screen pb-24 flex items-center justify-center">
          <div className="text-center p-8">
            <Users className="mx-auto text-gray-600 mb-4" size={64} />
            <h2 className="text-white text-xl font-bold mb-2">Live Activity Disabled</h2>
            <p className="text-gray-400 mb-4">Enable social features in Settings to see live activity from other athletes.</p>
            <p className="text-gray-500 text-sm">Settings → Social & Privacy → Show Live Activity</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
          <div className="p-4">
            <SlideIn direction="down">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Radio className="text-gold-400" size={28} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-white text-xl font-bold">Live Activity</h1>
                    <p className="text-gray-400 text-sm">{liveUsers.length} athletes working out</p>
                  </div>
                </div>
                {encouragedUsers.length > 0 && (
                  <div className="flex items-center gap-2 bg-gold-500/20 px-3 py-1 rounded-full">
                    <Flame className="text-gold-400" size={16} />
                    <span className="text-gold-400 text-sm font-semibold">{encouragedUsers.length}</span>
                  </div>
                )}
              </div>
            </SlideIn>

            {/* Filter tabs */}
            <SlideIn delay={50}>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pr', label: 'PRs' },
                  { id: 'attempt', label: 'Live' },
                  { id: 'set', label: 'Sets' },
                  { id: 'complete', label: 'Done' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                      filter === f.id
                        ? 'bg-gold-gradient text-carbon-900'
                        : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </SlideIn>
          </div>
        </header>

        {/* Stats Bar */}
        <SlideIn delay={100}>
          <div className="p-4 grid grid-cols-3 gap-3">
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{liveUsers.length}</p>
              <p className="text-gray-500 text-xs">Active Now</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{liveUsers.filter(u => u.type === 'pr').length}</p>
              <p className="text-gray-500 text-xs">PRs Today</p>
            </div>
            <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gold-400">{encouragedUsers.length}</p>
              <p className="text-gray-500 text-xs">Sent</p>
            </div>
          </div>
        </SlideIn>

        {/* Live Feed */}
        <div className="px-4 space-y-3">
          <StaggerContainer staggerDelay={75}>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No activity matching this filter</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const badge = getActivityBadge(user.type);
                const isEncouraged = encouragedUsers.includes(user.id);

                return (
                  <SlideIn key={user.id}>
                    <div className={`bg-carbon-800/50 rounded-2xl p-4 border transition-all ${
                      user.type === 'attempt' ? 'border-orange-500/30 animate-pulse-subtle' : 'border-transparent'
                    }`}>
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {user.avatar}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold truncate">{user.name}</span>
                            <span className={`${badge.bg} ${badge.text} text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1`}>
                              {getActivityIcon(user.type)}
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{user.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 text-xs">{user.exercise}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 text-xs">{user.time}</span>
                          </div>
                        </div>

                        {/* Encourage Button */}
                        <button
                          onClick={() => handleEncourage(user.id)}
                          disabled={isEncouraged}
                          className={`p-3 rounded-xl transition-all ${
                            isEncouraged
                              ? 'bg-gold-500/20 text-gold-400 scale-110'
                              : 'bg-carbon-700 text-gray-400 hover:bg-gold-500/20 hover:text-gold-400 active:scale-95'
                          }`}
                          aria-label={`Send encouragement to ${user.name}`}
                        >
                          <Flame size={20} className={isEncouraged ? 'animate-pulse' : ''} />
                        </button>
                      </div>
                    </div>
                  </SlideIn>
                );
              })
            )}
          </StaggerContainer>
        </div>

        {/* Encouragement Summary */}
        {encouragedUsers.length > 0 && (
          <ScaleIn delay={200}>
            <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-gold-500/20 to-orange-500/20 border border-gold-500/30 rounded-2xl p-4 backdrop-blur-lg">
              <div className="flex items-center justify-center gap-2">
                <Flame className="text-gold-400" size={20} />
                <span className="text-gold-400 font-semibold">
                  You've sent {encouragedUsers.length} encouragement{encouragedUsers.length > 1 ? 's' : ''} today!
                </span>
              </div>
            </div>
          </ScaleIn>
        )}

        {/* Toast notification */}
        {showToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
            <div className="bg-gold-500/90 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-gold-400/50 flex items-center gap-2">
              <Flame className="text-carbon-900" size={18} />
              <span className="text-carbon-900 font-semibold">{showToast}</span>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default LiveActivity;
