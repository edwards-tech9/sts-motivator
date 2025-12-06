// Gamification system - XP, Levels, Badges, Achievements, Challenges
// Based on behavioral psychology research for maximum engagement

// XP thresholds for each level (exponential curve)
export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Rookie', color: 'gray' },
  { level: 2, xpRequired: 100, title: 'Beginner', color: 'gray' },
  { level: 3, xpRequired: 250, title: 'Novice', color: 'green' },
  { level: 4, xpRequired: 500, title: 'Apprentice', color: 'green' },
  { level: 5, xpRequired: 850, title: 'Intermediate', color: 'blue' },
  { level: 6, xpRequired: 1300, title: 'Skilled', color: 'blue' },
  { level: 7, xpRequired: 1900, title: 'Advanced', color: 'purple' },
  { level: 8, xpRequired: 2700, title: 'Expert', color: 'purple' },
  { level: 9, xpRequired: 3800, title: 'Master', color: 'gold' },
  { level: 10, xpRequired: 5200, title: 'Elite', color: 'gold' },
  { level: 11, xpRequired: 7000, title: 'Champion', color: 'gold' },
  { level: 12, xpRequired: 9200, title: 'Legend', color: 'gold' },
];

// XP rewards for actions (variable reward system - adds randomness)
export const XP_REWARDS = {
  completeSet: { base: 10, variance: 5 }, // 5-15 XP per set
  completeWorkout: { base: 50, variance: 25 }, // 25-75 XP
  newPR: { base: 100, variance: 50 }, // 50-150 XP
  perfectForm: { base: 25, variance: 10 }, // 15-35 XP (self-reported)
  streakBonus: { base: 10, variance: 5 }, // per day of streak
  dailyLogin: { base: 15, variance: 10 }, // 5-25 XP
  weeklyChallenge: { base: 200, variance: 100 }, // 100-300 XP
  shareWorkout: { base: 20, variance: 10 }, // 10-30 XP
  watchTutorial: { base: 10, variance: 5 }, // 5-15 XP
};

// Calculate XP with variance (variable reward for dopamine engagement)
export const calculateXP = (action) => {
  const reward = XP_REWARDS[action];
  if (!reward) return 0;
  const variance = Math.floor(Math.random() * reward.variance * 2) - reward.variance;
  return Math.max(1, reward.base + variance);
};

// Badges - unlocked by achievements
export const BADGES = {
  // Streak badges
  streak_3: { id: 'streak_3', name: 'Getting Started', description: '3-day workout streak', icon: '🔥', rarity: 'common', xpBonus: 25 },
  streak_7: { id: 'streak_7', name: 'Week Warrior', description: '7-day workout streak', icon: '🔥', rarity: 'uncommon', xpBonus: 75 },
  streak_14: { id: 'streak_14', name: 'Two Week Terror', description: '14-day workout streak', icon: '🔥', rarity: 'rare', xpBonus: 150 },
  streak_30: { id: 'streak_30', name: 'Monthly Monster', description: '30-day workout streak', icon: '🔥', rarity: 'epic', xpBonus: 300 },
  streak_100: { id: 'streak_100', name: 'Century Strong', description: '100-day workout streak', icon: '👑', rarity: 'legendary', xpBonus: 1000 },

  // Workout count badges
  workouts_1: { id: 'workouts_1', name: 'First Rep', description: 'Complete your first workout', icon: '💪', rarity: 'common', xpBonus: 25 },
  workouts_10: { id: 'workouts_10', name: 'Double Digits', description: 'Complete 10 workouts', icon: '💪', rarity: 'common', xpBonus: 50 },
  workouts_50: { id: 'workouts_50', name: 'Fifty Strong', description: 'Complete 50 workouts', icon: '💪', rarity: 'uncommon', xpBonus: 150 },
  workouts_100: { id: 'workouts_100', name: 'Century Club', description: 'Complete 100 workouts', icon: '💪', rarity: 'rare', xpBonus: 300 },
  workouts_500: { id: 'workouts_500', name: 'Iron Veteran', description: 'Complete 500 workouts', icon: '🏆', rarity: 'legendary', xpBonus: 1000 },

  // PR badges
  first_pr: { id: 'first_pr', name: 'Personal Best', description: 'Hit your first PR', icon: '🏆', rarity: 'common', xpBonus: 50 },
  pr_5: { id: 'pr_5', name: 'Record Breaker', description: 'Hit 5 PRs', icon: '🏆', rarity: 'uncommon', xpBonus: 100 },
  pr_20: { id: 'pr_20', name: 'PR Machine', description: 'Hit 20 PRs', icon: '🏆', rarity: 'rare', xpBonus: 250 },
  pr_50: { id: 'pr_50', name: 'Limitless', description: 'Hit 50 PRs', icon: '👑', rarity: 'epic', xpBonus: 500 },

  // Volume badges
  volume_10k: { id: 'volume_10k', name: '10K Club', description: 'Lift 10,000 lbs in one workout', icon: '🏋️', rarity: 'common', xpBonus: 25 },
  volume_50k: { id: 'volume_50k', name: 'Heavy Hitter', description: 'Lift 50,000 lbs in one workout', icon: '🏋️', rarity: 'uncommon', xpBonus: 100 },
  volume_100k: { id: 'volume_100k', name: 'Tonnage King', description: 'Lift 100,000 lbs in one workout', icon: '🏋️', rarity: 'rare', xpBonus: 250 },
  total_1m: { id: 'total_1m', name: 'Million Pounder', description: 'Lift 1,000,000 lbs total', icon: '👑', rarity: 'legendary', xpBonus: 1000 },

  // Time-based badges
  early_bird: { id: 'early_bird', name: 'Early Bird', description: 'Complete a workout before 7am', icon: '🌅', rarity: 'uncommon', xpBonus: 50 },
  night_owl: { id: 'night_owl', name: 'Night Owl', description: 'Complete a workout after 9pm', icon: '🌙', rarity: 'uncommon', xpBonus: 50 },
  weekend_warrior: { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Work out on both Saturday and Sunday', icon: '📅', rarity: 'common', xpBonus: 40 },

  // Exercise mastery badges
  squat_master: { id: 'squat_master', name: 'Squat Master', description: 'Complete 100 sets of squats', icon: '🦵', rarity: 'rare', xpBonus: 200 },
  bench_master: { id: 'bench_master', name: 'Bench Boss', description: 'Complete 100 sets of bench press', icon: '🛋️', rarity: 'rare', xpBonus: 200 },
  deadlift_master: { id: 'deadlift_master', name: 'Deadlift Demon', description: 'Complete 100 sets of deadlifts', icon: '💀', rarity: 'rare', xpBonus: 200 },

  // Social badges
  first_share: { id: 'first_share', name: 'Social Butterfly', description: 'Share your first workout', icon: '📱', rarity: 'common', xpBonus: 30 },
  influencer: { id: 'influencer', name: 'Fitness Influencer', description: 'Share 25 workouts', icon: '📱', rarity: 'rare', xpBonus: 200 },

  // Perfect week badges
  perfect_week: { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all scheduled workouts in a week', icon: '⭐', rarity: 'uncommon', xpBonus: 100 },
  perfect_month: { id: 'perfect_month', name: 'Perfect Month', description: 'Complete all scheduled workouts in a month', icon: '⭐', rarity: 'epic', xpBonus: 500 },
};

// Weekly challenges - rotate each week (variable reward system)
export const WEEKLY_CHALLENGES = [
  { id: 'volume_boost', name: 'Volume King', description: 'Log 100,000 lbs of total volume this week', target: 100000, unit: 'lbs', xpReward: 250 },
  { id: 'set_crusher', name: 'Set Crusher', description: 'Complete 75 sets this week', target: 75, unit: 'sets', xpReward: 200 },
  { id: 'consistency', name: 'Consistency Champion', description: 'Work out 5 days this week', target: 5, unit: 'days', xpReward: 200 },
  { id: 'early_riser', name: 'Dawn Patrol', description: 'Complete 3 morning workouts (before 9am)', target: 3, unit: 'workouts', xpReward: 175 },
  { id: 'pr_hunter', name: 'PR Hunter', description: 'Hit 2 PRs this week', target: 2, unit: 'PRs', xpReward: 300 },
  { id: 'leg_day', name: 'Leg Day Legend', description: 'Complete 50 sets of leg exercises', target: 50, unit: 'sets', xpReward: 225 },
  { id: 'upper_body', name: 'Upper Body Blitz', description: 'Complete 50 sets of upper body exercises', target: 50, unit: 'sets', xpReward: 225 },
  { id: 'compound_king', name: 'Compound King', description: 'Complete 40 sets of compound movements', target: 40, unit: 'sets', xpReward: 250 },
];

// Daily bonus XP multipliers (variable reward - surprise bonuses)
export const DAILY_BONUSES = {
  doubleXP: { chance: 0.1, multiplier: 2, name: 'Double XP Day!', icon: '⚡' },
  tripleXP: { chance: 0.02, multiplier: 3, name: 'TRIPLE XP!', icon: '🌟' },
  bonusBadgeProgress: { chance: 0.15, bonus: 2, name: 'Badge Boost', icon: '🎯' },
};

// Check if user should get a surprise bonus (called on workout start)
export const rollDailyBonus = () => {
  const roll = Math.random();
  if (roll < DAILY_BONUSES.tripleXP.chance) {
    return { type: 'tripleXP', ...DAILY_BONUSES.tripleXP };
  }
  if (roll < DAILY_BONUSES.doubleXP.chance) {
    return { type: 'doubleXP', ...DAILY_BONUSES.doubleXP };
  }
  if (roll < DAILY_BONUSES.bonusBadgeProgress.chance) {
    return { type: 'bonusBadgeProgress', ...DAILY_BONUSES.bonusBadgeProgress };
  }
  return null;
};

// Get user's current level from XP
export const getLevelFromXP = (xp) => {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

// Get XP progress to next level
export const getXPProgress = (xp) => {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: xp, required: xp, percentage: 100, nextLevel: null };
  }

  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const percentage = Math.round((xpIntoLevel / xpNeededForNext) * 100);

  return {
    current: xpIntoLevel,
    required: xpNeededForNext,
    percentage,
    nextLevel
  };
};

// Get current week's challenge (rotates weekly based on date)
export const getCurrentWeeklyChallenge = () => {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
};

// Rarity colors
export const RARITY_COLORS = {
  common: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' },
  uncommon: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  rare: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  legendary: { bg: 'bg-gold-500/20', border: 'border-gold-500/30', text: 'text-gold-400' },
};

export default {
  LEVELS,
  BADGES,
  XP_REWARDS,
  WEEKLY_CHALLENGES,
  DAILY_BONUSES,
  calculateXP,
  getLevelFromXP,
  getXPProgress,
  getCurrentWeeklyChallenge,
  rollDailyBonus,
  RARITY_COLORS,
};
