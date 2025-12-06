import { useEffect } from 'react';
import { RARITY_COLORS } from '../../data/gamification';
import Confetti from '../ui/Confetti';

const BadgeUnlocked = ({ badge, onClose }) => {
  // Auto-close after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityStyle = RARITY_COLORS[badge.rarity] || RARITY_COLORS.common;

  const rarityNames = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Confetti active={true} />

      <div className="text-center p-8 animate-scale-in">
        {/* Badge Icon */}
        <div
          className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${rarityStyle.bg} ${rarityStyle.border} border-4 animate-bounce`}
          style={{ animationDuration: '1s' }}
        >
          <span className="text-7xl">{badge.icon}</span>
        </div>

        {/* Title */}
        <p className="text-gold-400 text-lg font-semibold mb-2 uppercase tracking-wider">
          Badge Unlocked!
        </p>

        <h2
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          {badge.name}
        </h2>

        <p className={`text-sm ${rarityStyle.text} capitalize mb-4`}>
          {rarityNames[badge.rarity]}
        </p>

        <p className="text-gray-400 text-lg mb-6 max-w-xs mx-auto">
          {badge.description}
        </p>

        {/* XP Bonus */}
        <div className="bg-gold-500/20 border border-gold-500/30 rounded-2xl py-3 px-6 inline-block mb-8">
          <span className="text-gold-400 text-xl font-bold">+{badge.xpBonus} XP</span>
        </div>

        <button
          onClick={onClose}
          className="block w-full max-w-xs mx-auto bg-gold-gradient text-carbon-900 font-bold py-4 px-8 rounded-xl hover:scale-105 transition-transform"
        >
          Awesome!
        </button>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BadgeUnlocked;
