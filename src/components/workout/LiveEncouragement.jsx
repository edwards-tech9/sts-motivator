import { useState, useEffect, useCallback, useRef } from 'react';
import { Flame, Zap, Star, Heart, Trophy, Users, Send, X } from 'lucide-react';
import { saveEncouragement } from '../../services/localStorage';

// Gaming Psychology: Variable Reward System
// Messages are weighted by intensity to create dopamine-triggering unpredictability
const ENCOURAGEMENT_MESSAGES = {
  // Low intensity (60% chance) - Subtle support
  low: [
    { text: "Nice work!", emoji: "👍" },
    { text: "Keep going!", emoji: "💪" },
    { text: "You got this!", emoji: "✊" },
    { text: "Looking strong!", emoji: "💯" },
    { text: "Solid rep!", emoji: "👊" },
    { text: "Stay focused!", emoji: "🎯" },
    { text: "Good form!", emoji: "✅" },
    { text: "Crushing it!", emoji: "🔥" },
  ],
  // Medium intensity (30% chance) - Energizing
  medium: [
    { text: "PUSH IT!", emoji: "🚀" },
    { text: "GET IT BRO!", emoji: "💪🔥" },
    { text: "BEAST MODE!", emoji: "🦁" },
    { text: "LET'S GO!", emoji: "⚡" },
    { text: "GAINS INCOMING!", emoji: "📈" },
    { text: "YOU'RE ON FIRE!", emoji: "🔥🔥" },
    { text: "UNSTOPPABLE!", emoji: "💨" },
    { text: "IRON WILL!", emoji: "🏋️" },
  ],
  // High intensity (10% chance) - Peak hype (rare = more valuable)
  high: [
    { text: "ABSOLUTELY LEGENDARY!", emoji: "👑🔥" },
    { text: "THIS IS YOUR MOMENT!", emoji: "⭐💫" },
    { text: "CHAMPION MENTALITY!", emoji: "🏆🔥" },
    { text: "GREATNESS LOADING...", emoji: "💯🚀" },
    { text: "NOTHING CAN STOP YOU!", emoji: "🦾⚡" },
    { text: "PR ENERGY DETECTED!", emoji: "📊🔥" },
  ],
};

// XP gain messages
const XP_MESSAGES = [
  "+12 XP", "+15 XP", "+18 XP", "+10 XP", "+20 XP", "+8 XP",
];

// Simulated live users (in production, this would come from a real-time database)
const MOCK_USERS = [
  { name: 'Mike C.', avatar: 'MC', color: 'from-blue-500 to-blue-600' },
  { name: 'Sarah J.', avatar: 'SJ', color: 'from-pink-500 to-pink-600' },
  { name: 'Emma D.', avatar: 'ED', color: 'from-purple-500 to-purple-600' },
  { name: 'Jake T.', avatar: 'JT', color: 'from-green-500 to-green-600' },
  { name: 'Coach Mike', avatar: 'CM', color: 'from-gold-500 to-gold-600', isCoach: true },
];

// Floating message component with CSS keyframe animation
const FloatingMessage = ({ message, position, onComplete }) => {
  useEffect(() => {
    // Remove after animation completes (3s)
    const removeTimer = setTimeout(onComplete, 3000);
    return () => clearTimeout(removeTimer);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[70] animate-float-up transform-gpu"
      style={{
        bottom: `${position.y}%`,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div className={`px-5 py-3 rounded-2xl ${message.isXP ? 'bg-gold-500' : 'bg-carbon-800/95'} backdrop-blur-md border-2 ${message.isXP ? 'border-gold-300' : 'border-carbon-600'} shadow-2xl whitespace-nowrap`}>
        {message.fromUser ? (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${message.fromUser.color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
              {message.fromUser.avatar}
            </div>
            <span className="text-white font-bold text-base">{message.text}</span>
            <span className="text-2xl">{message.emoji}</span>
          </div>
        ) : message.isXP ? (
          <span className="text-carbon-900 font-black text-xl tracking-wide">{message.text}</span>
        ) : (
          <span className="text-white font-bold text-xl">
            {message.text} <span className="text-2xl">{message.emoji}</span>
          </span>
        )}
      </div>
    </div>
  );
};

// Live workout feed item
const LiveFeedItem = ({ activity, onEncourage }) => {
  const [encouraged, setEncouraged] = useState(false);

  const handleEncourage = () => {
    setEncouraged(true);
    onEncourage(activity);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-carbon-800/50 rounded-xl animate-slide-in">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.user.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
        {activity.user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{activity.user.name}</p>
        <p className="text-gray-400 text-xs truncate">{activity.action}</p>
      </div>
      <button
        onClick={handleEncourage}
        disabled={encouraged}
        className={`p-2 rounded-xl transition-all ${
          encouraged
            ? 'bg-gold-500/20 text-gold-400'
            : 'bg-carbon-700 text-gray-400 hover:bg-gold-500/20 hover:text-gold-400'
        }`}
      >
        <Flame size={18} className={encouraged ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
};

const LiveEncouragement = ({
  isActive = true,
  onSetComplete,
  currentExercise,
  userSettings = { socialVisibility: 'public', receiveEncouragement: true }
}) => {
  const [floatingMessages, setFloatingMessages] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [showFeed, setShowFeed] = useState(false);
  const [encouragementCount, setEncouragementCount] = useState(0);
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(0);

  // Track last processed set completion to prevent cascade
  const lastProcessedSetComplete = useRef(0);

  // Max concurrent floating messages to prevent chaos
  const MAX_FLOATING_MESSAGES = 2;
  // Minimum time between messages (ms)
  const MIN_MESSAGE_INTERVAL = 8000;

  // Fixed vertical slots for messages to prevent overlap
  const VERTICAL_SLOTS = [30, 45];
  const [usedSlots, setUsedSlots] = useState([]);

  // Generate position using available slots - no more random vertical overlap
  const getAvailablePosition = useCallback(() => {
    // Find an unused vertical slot
    const availableSlot = VERTICAL_SLOTS.find(slot => !usedSlots.includes(slot));
    const y = availableSlot || VERTICAL_SLOTS[0];

    // Mark slot as used
    setUsedSlots(prev => [...prev, y]);

    return {
      x: 25 + Math.random() * 50, // 25-75% from left (centered)
      y,
    };
  }, [usedSlots]);

  // Release a slot when message is removed
  const releaseSlot = useCallback((yPos) => {
    setUsedSlots(prev => prev.filter(slot => slot !== yPos));
  }, []);

  // Select message based on weighted probability (variable reward)
  const getRandomMessage = useCallback(() => {
    const roll = Math.random();
    let intensity;
    if (roll < 0.1) intensity = 'high';
    else if (roll < 0.4) intensity = 'medium';
    else intensity = 'low';

    const messages = ENCOURAGEMENT_MESSAGES[intensity];
    const message = messages[Math.floor(Math.random() * messages.length)];

    // 30% chance message is from a "user"
    if (Math.random() < 0.3) {
      const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      return { ...message, fromUser: user };
    }

    return message;
  }, []);

  // Add XP floating message - positioned at top to avoid modal overlap
  const showXPGain = useCallback(() => {
    const xpMessage = XP_MESSAGES[Math.floor(Math.random() * XP_MESSAGES.length)];
    const newMessage = {
      id: messageIdCounter,
      text: xpMessage,
      isXP: true,
    };
    setMessageIdCounter(prev => prev + 1);
    // Position at top of screen (80% from bottom = 20% from top)
    setFloatingMessages(prev => [...prev, { ...newMessage, position: { x: 50, y: 75 } }]);
  }, [messageIdCounter]);

  // Show encouragement message with rate limiting
  const showEncouragement = useCallback(() => {
    if (!userSettings.receiveEncouragement) return;

    const now = Date.now();
    // Rate limit: don't show if too soon after last message or too many on screen
    if (now - lastMessageTime < MIN_MESSAGE_INTERVAL) return;
    if (floatingMessages.length >= MAX_FLOATING_MESSAGES) return;
    if (usedSlots.length >= VERTICAL_SLOTS.length) return; // No slots available

    const message = getRandomMessage();
    const position = getAvailablePosition();
    const newMessage = {
      id: messageIdCounter,
      ...message,
      position,
    };
    setMessageIdCounter(prev => prev + 1);
    setFloatingMessages(prev => [...prev, newMessage]);
    setEncouragementCount(prev => prev + 1);
    setLastMessageTime(now);
  }, [getRandomMessage, messageIdCounter, userSettings.receiveEncouragement, lastMessageTime, floatingMessages.length, usedSlots.length, getAvailablePosition]);

  // Remove message from floating array and release its slot
  const removeMessage = useCallback((id) => {
    setFloatingMessages(prev => {
      const msgToRemove = prev.find(m => m.id === id);
      if (msgToRemove?.position?.y) {
        releaseSlot(msgToRemove.position.y);
      }
      return prev.filter(m => m.id !== id);
    });
  }, [releaseSlot]);

  // Simulate live feed updates
  useEffect(() => {
    if (!isActive || userSettings.socialVisibility === 'private') return;

    const actions = [
      'Just crushed 315 lb squat!',
      'Finished leg day! 💪',
      'New PR on bench press!',
      'Set 4 of 5 complete',
      'Warming up for deadlifts',
      'Hit 225 for 8 reps!',
      'First workout this week!',
      'Going for a PR attempt...',
    ];

    const addLiveFeedItem = () => {
      const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];

      setLiveFeed(prev => {
        const newFeed = [{ id: Date.now(), user, action }, ...prev];
        return newFeed.slice(0, 5); // Keep only last 5
      });
    };

    // Add initial items
    addLiveFeedItem();
    const interval = setInterval(addLiveFeedItem, 15000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, [isActive, userSettings.socialVisibility]);

  // Trigger encouragement periodically during active workout - MUCH less frequent
  useEffect(() => {
    if (!isActive || !userSettings.receiveEncouragement) return;

    // Initial encouragement after 15-25 seconds
    const initialTimeout = setTimeout(() => {
      showEncouragement();
    }, 15000 + Math.random() * 10000);

    // Periodic encouragement every 45-90 seconds (much slower)
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // Only 30% chance each interval
        showEncouragement();
      }
    }, 45000 + Math.random() * 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isActive, showEncouragement, userSettings.receiveEncouragement]);

  // Show XP when set is completed - only fires when onSetComplete actually increases
  useEffect(() => {
    // Only process if onSetComplete is a new value (greater than last processed)
    if (onSetComplete && onSetComplete > lastProcessedSetComplete.current) {
      lastProcessedSetComplete.current = onSetComplete;
      showXPGain();
      // Only trigger encouragement 25% of the time on set complete
      if (Math.random() < 0.25) {
        setTimeout(showEncouragement, 1500);
      }
    }
  }, [onSetComplete]); // Remove showXPGain and showEncouragement from deps to prevent re-triggers

  const handleEncourageUser = (activity) => {
    // Persist encouragement to localStorage
    saveEncouragement({
      toUserId: activity.id,
      toUserName: activity.user.name,
      message: 'Sent encouragement during workout',
      fromPage: 'live-encouragement',
    });
    setEncouragementCount(prev => prev + 1);
  };

  if (!isActive) return null;

  return (
    <>
      {/* Floating Messages */}
      {floatingMessages.map((msg) => (
        <FloatingMessage
          key={msg.id}
          message={msg}
          position={msg.position}
          onComplete={() => removeMessage(msg.id)}
        />
      ))}

      {/* Live Feed Toggle Button */}
      {userSettings.socialVisibility !== 'private' && (
        <button
          onClick={() => setShowFeed(!showFeed)}
          className="fixed bottom-24 right-4 z-30 w-14 h-14 bg-carbon-800/90 backdrop-blur-sm border border-carbon-700 rounded-full flex items-center justify-center shadow-lg hover:bg-carbon-700 transition-colors"
        >
          <Users className="text-gold-400" size={24} />
          {liveFeed.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {liveFeed.length}
            </span>
          )}
        </button>
      )}

      {/* Live Feed Panel */}
      {showFeed && userSettings.socialVisibility !== 'private' && (
        <div className="fixed bottom-40 right-4 z-30 w-72 bg-carbon-900/95 backdrop-blur-lg border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-carbon-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Live Activity</span>
            </div>
            <button onClick={() => setShowFeed(false)}>
              <X className="text-gray-400" size={18} />
            </button>
          </div>

          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {liveFeed.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">
                No live activity yet...
              </p>
            ) : (
              liveFeed.map((activity) => (
                <LiveFeedItem
                  key={activity.id}
                  activity={activity}
                  onEncourage={handleEncourageUser}
                />
              ))
            )}
          </div>

          <div className="p-3 border-t border-carbon-700 bg-carbon-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Encouragements sent</span>
              <span className="text-gold-400 font-semibold flex items-center gap-1">
                <Flame size={14} />
                {encouragementCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveEncouragement;
