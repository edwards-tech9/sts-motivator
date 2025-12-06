import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { BADGES, RARITY_COLORS } from '../../data/gamification';
import { getGamificationState } from '../../services/gamificationService';

const BadgeGrid = ({ showAll = false }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const state = getGamificationState();
  const earnedBadges = state.earnedBadges || [];

  const badges = showAll
    ? Object.values(BADGES)
    : Object.values(BADGES).filter(b => earnedBadges.includes(b.id));

  const getRarityStyle = (rarity) => RARITY_COLORS[rarity] || RARITY_COLORS.common;

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {badges.map(badge => {
          const isEarned = earnedBadges.includes(badge.id);
          const rarityStyle = getRarityStyle(badge.rarity);

          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all ${
                isEarned
                  ? `${rarityStyle.bg} ${rarityStyle.border} border-2 hover:scale-105`
                  : 'bg-carbon-800 border border-carbon-700 opacity-40'
              }`}
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              {!isEarned && (
                <Lock size={12} className="absolute top-1 right-1 text-gray-500" />
              )}
              {badge.rarity === 'legendary' && isEarned && (
                <div className="absolute inset-0 rounded-xl bg-gold-500/10 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Show locked count if not showing all */}
        {!showAll && earnedBadges.length < Object.keys(BADGES).length && (
          <div className="aspect-square rounded-xl bg-carbon-800 border border-carbon-700 flex flex-col items-center justify-center opacity-60">
            <Lock size={20} className="text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">
              +{Object.keys(BADGES).length - earnedBadges.length}
            </span>
          </div>
        )}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-carbon-800 rounded-3xl p-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div
                className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  getRarityStyle(selectedBadge.rarity).bg
                } ${getRarityStyle(selectedBadge.rarity).border} border-2`}
              >
                <span className="text-5xl">{selectedBadge.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{selectedBadge.name}</h3>
              <p className={`text-sm ${getRarityStyle(selectedBadge.rarity).text} capitalize mb-3`}>
                {selectedBadge.rarity}
              </p>
              <p className="text-gray-400 mb-4">{selectedBadge.description}</p>

              {earnedBadges.includes(selectedBadge.id) ? (
                <div className="bg-green-500/20 text-green-400 py-2 px-4 rounded-xl inline-flex items-center gap-2">
                  <span>Earned!</span>
                  <span className="text-gold-400">+{selectedBadge.xpBonus} XP</span>
                </div>
              ) : (
                <div className="bg-carbon-700 text-gray-400 py-2 px-4 rounded-xl">
                  <Lock size={14} className="inline mr-2" />
                  Locked
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BadgeGrid;
