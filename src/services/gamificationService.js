// Gamification service - persists XP, badges, streaks, challenges to localStorage
import { BADGES, calculateXP, getLevelFromXP, getXPProgress, getCurrentWeeklyChallenge, rollDailyBonus } from '../data/gamification';

const STORAGE_KEY = 'sts_gamification';
const CHALLENGE_LOG_KEY = 'sts_challenge_log';

// Get gamification state from localStorage
const getState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Return default state if localStorage fails
  }

  // Default state
  return {
    xp: 0,
    totalXP: 0,
    earnedBadges: [],
    badgeProgress: {},
    streakDays: 0,
    lastWorkoutDate: null,
    weeklyChallenge: {
      id: null,
      progress: 0,
      completed: false,
      weekStart: null,
    },
    stats: {
      totalWorkouts: 0,
      totalSets: 0,
      totalVolume: 0,
      totalPRs: 0,
      sharesCount: 0,
      exerciseSets: {}, // { "Back Squat": 15, "Bench Press": 20 }
    },
    dailyBonus: null,
    lastBonusCheck: null,
  };
};

// Save state to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage unavailable
  }
};

// Add XP with multiplier support
export const addXP = (action, multiplier = 1) => {
  const state = getState();
  const baseXP = calculateXP(action);
  const earnedXP = Math.round(baseXP * multiplier);

  state.xp += earnedXP;
  state.totalXP += earnedXP;
  saveState(state);

  return {
    earnedXP,
    totalXP: state.xp,
    level: getLevelFromXP(state.xp),
    progress: getXPProgress(state.xp),
  };
};

// Check and award badges based on current stats
export const checkBadges = () => {
  const state = getState();
  const newBadges = [];

  // Streak badges
  if (state.streakDays >= 3 && !state.earnedBadges.includes('streak_3')) {
    newBadges.push(BADGES.streak_3);
    state.earnedBadges.push('streak_3');
  }
  if (state.streakDays >= 7 && !state.earnedBadges.includes('streak_7')) {
    newBadges.push(BADGES.streak_7);
    state.earnedBadges.push('streak_7');
  }
  if (state.streakDays >= 14 && !state.earnedBadges.includes('streak_14')) {
    newBadges.push(BADGES.streak_14);
    state.earnedBadges.push('streak_14');
  }
  if (state.streakDays >= 30 && !state.earnedBadges.includes('streak_30')) {
    newBadges.push(BADGES.streak_30);
    state.earnedBadges.push('streak_30');
  }
  if (state.streakDays >= 100 && !state.earnedBadges.includes('streak_100')) {
    newBadges.push(BADGES.streak_100);
    state.earnedBadges.push('streak_100');
  }

  // Workout count badges
  if (state.stats.totalWorkouts >= 1 && !state.earnedBadges.includes('workouts_1')) {
    newBadges.push(BADGES.workouts_1);
    state.earnedBadges.push('workouts_1');
  }
  if (state.stats.totalWorkouts >= 10 && !state.earnedBadges.includes('workouts_10')) {
    newBadges.push(BADGES.workouts_10);
    state.earnedBadges.push('workouts_10');
  }
  if (state.stats.totalWorkouts >= 50 && !state.earnedBadges.includes('workouts_50')) {
    newBadges.push(BADGES.workouts_50);
    state.earnedBadges.push('workouts_50');
  }
  if (state.stats.totalWorkouts >= 100 && !state.earnedBadges.includes('workouts_100')) {
    newBadges.push(BADGES.workouts_100);
    state.earnedBadges.push('workouts_100');
  }

  // PR badges
  if (state.stats.totalPRs >= 1 && !state.earnedBadges.includes('first_pr')) {
    newBadges.push(BADGES.first_pr);
    state.earnedBadges.push('first_pr');
  }
  if (state.stats.totalPRs >= 5 && !state.earnedBadges.includes('pr_5')) {
    newBadges.push(BADGES.pr_5);
    state.earnedBadges.push('pr_5');
  }
  if (state.stats.totalPRs >= 20 && !state.earnedBadges.includes('pr_20')) {
    newBadges.push(BADGES.pr_20);
    state.earnedBadges.push('pr_20');
  }

  // Social badges
  if (state.stats.sharesCount >= 1 && !state.earnedBadges.includes('first_share')) {
    newBadges.push(BADGES.first_share);
    state.earnedBadges.push('first_share');
  }
  if (state.stats.sharesCount >= 25 && !state.earnedBadges.includes('influencer')) {
    newBadges.push(BADGES.influencer);
    state.earnedBadges.push('influencer');
  }

  // Exercise mastery badges
  const exerciseSets = state.stats.exerciseSets || {};
  if ((exerciseSets['Back Squat'] || 0) >= 100 && !state.earnedBadges.includes('squat_master')) {
    newBadges.push(BADGES.squat_master);
    state.earnedBadges.push('squat_master');
  }
  if ((exerciseSets['Bench Press'] || 0) >= 100 && !state.earnedBadges.includes('bench_master')) {
    newBadges.push(BADGES.bench_master);
    state.earnedBadges.push('bench_master');
  }
  if ((exerciseSets['Deadlift'] || 0) >= 100 && !state.earnedBadges.includes('deadlift_master')) {
    newBadges.push(BADGES.deadlift_master);
    state.earnedBadges.push('deadlift_master');
  }

  // Award XP for each new badge
  newBadges.forEach(badge => {
    state.xp += badge.xpBonus;
    state.totalXP += badge.xpBonus;
  });

  saveState(state);
  return newBadges;
};

// Update streak on workout completion
export const updateStreak = () => {
  const state = getState();
  const today = new Date().toDateString();
  const lastDate = state.lastWorkoutDate ? new Date(state.lastWorkoutDate).toDateString() : null;

  if (lastDate === today) {
    // Already worked out today
    return state.streakDays;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastDate === yesterday.toDateString()) {
    // Continuing streak
    state.streakDays += 1;
  } else if (lastDate !== today) {
    // Streak broken (unless first workout)
    state.streakDays = state.streakDays === 0 ? 1 : 1;
  }

  state.lastWorkoutDate = new Date().toISOString();
  saveState(state);

  // Add streak bonus XP
  const streakBonus = addXP('streakBonus');

  return {
    streakDays: state.streakDays,
    streakBonus: streakBonus.earnedXP,
  };
};

// Record a completed set
export const recordSet = (exerciseName, weight, reps) => {
  const state = getState();
  state.stats.totalSets += 1;
  state.stats.totalVolume += weight * reps;

  // Track exercise-specific sets for mastery badges
  if (!state.stats.exerciseSets) state.stats.exerciseSets = {};
  state.stats.exerciseSets[exerciseName] = (state.stats.exerciseSets[exerciseName] || 0) + 1;

  saveState(state);

  // Award XP for the set
  const xpResult = addXP('completeSet', state.dailyBonus?.multiplier || 1);

  return {
    ...xpResult,
    totalSets: state.stats.totalSets,
    totalVolume: state.stats.totalVolume,
  };
};

// Record a completed workout
export const recordWorkout = (workoutData) => {
  const state = getState();
  state.stats.totalWorkouts += 1;

  // Update weekly challenge progress
  const currentChallenge = getCurrentWeeklyChallenge();
  const weekStart = getWeekStart();

  if (state.weeklyChallenge.weekStart !== weekStart) {
    // New week, reset challenge
    state.weeklyChallenge = {
      id: currentChallenge.id,
      progress: 0,
      completed: false,
      weekStart,
    };
  }

  // Update challenge progress based on type
  if (currentChallenge.id === 'consistency') {
    state.weeklyChallenge.progress += 1;
  } else if (currentChallenge.id === 'volume_boost') {
    state.weeklyChallenge.progress += workoutData.totalVolume || 0;
  } else if (currentChallenge.id === 'set_crusher') {
    state.weeklyChallenge.progress += workoutData.totalSets || 0;
  }

  // Check if challenge completed
  if (state.weeklyChallenge.progress >= currentChallenge.target && !state.weeklyChallenge.completed) {
    state.weeklyChallenge.completed = true;
    state.xp += currentChallenge.xpReward;
    state.totalXP += currentChallenge.xpReward;
  }

  saveState(state);

  // Update streak
  const streakResult = updateStreak();

  // Award workout completion XP
  const xpResult = addXP('completeWorkout', state.dailyBonus?.multiplier || 1);

  // Check for new badges
  const newBadges = checkBadges();

  return {
    ...xpResult,
    streakDays: streakResult.streakDays,
    newBadges,
    challengeProgress: state.weeklyChallenge,
    challengeCompleted: state.weeklyChallenge.completed,
  };
};

// Record a new PR
export const recordPR = () => {
  const state = getState();
  state.stats.totalPRs += 1;
  saveState(state);

  const xpResult = addXP('newPR', state.dailyBonus?.multiplier || 1);
  const newBadges = checkBadges();

  return {
    ...xpResult,
    totalPRs: state.stats.totalPRs,
    newBadges,
  };
};

// Record a share
export const recordShare = () => {
  const state = getState();
  state.stats.sharesCount += 1;
  saveState(state);

  const xpResult = addXP('shareWorkout');
  const newBadges = checkBadges();

  return {
    ...xpResult,
    newBadges,
  };
};

// Record watching a tutorial video
export const recordTutorialWatched = () => {
  return addXP('watchTutorial');
};

// Check for daily bonus on app open
export const checkDailyBonus = () => {
  const state = getState();
  const today = new Date().toDateString();

  if (state.lastBonusCheck === today) {
    return state.dailyBonus;
  }

  // Roll for bonus
  const bonus = rollDailyBonus();
  state.dailyBonus = bonus;
  state.lastBonusCheck = today;
  saveState(state);

  return bonus;
};

// Get full gamification state for UI
export const getGamificationState = () => {
  const state = getState();
  const level = getLevelFromXP(state.xp);
  const progress = getXPProgress(state.xp);
  const currentChallenge = getCurrentWeeklyChallenge();

  return {
    ...state,
    level,
    progress,
    currentChallenge,
    allBadges: BADGES,
  };
};

// Get week start date string for challenge tracking
const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toDateString();
};

// Initialize demo gamification data
export const initializeDemoGamification = () => {
  const state = getState();

  // Only initialize if new user
  if (state.stats.totalWorkouts > 0) return;

  // Set some progress for demo
  state.xp = 450;
  state.totalXP = 450;
  state.streakDays = 8;
  state.lastWorkoutDate = new Date(Date.now() - 86400000).toISOString(); // Yesterday
  state.stats = {
    totalWorkouts: 12,
    totalSets: 156,
    totalVolume: 245000,
    totalPRs: 3,
    sharesCount: 0,
    exerciseSets: {
      'Back Squat': 24,
      'Bench Press': 18,
      'Deadlift': 12,
      'Overhead Press': 15,
      'Barbell Row': 12,
    },
  };
  state.earnedBadges = ['workouts_1', 'workouts_10', 'streak_3', 'streak_7', 'first_pr'];

  saveState(state);
};

// Call initialize on import
initializeDemoGamification();

// Get week start date for challenge log filtering
const getChallengeWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
};

// Get challenge log from localStorage
const getChallengeLog = () => {
  try {
    const stored = localStorage.getItem(CHALLENGE_LOG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Return empty array if localStorage fails
  }
  return [];
};

// Save challenge log to localStorage
const saveChallengeLog = (log) => {
  try {
    localStorage.setItem(CHALLENGE_LOG_KEY, JSON.stringify(log));
  } catch {
    // Silently fail if localStorage unavailable
  }
};

// Record a challenge exercise and award XP
export const recordChallengeExercise = (challengeId, exerciseData) => {
  const state = getState();
  const log = getChallengeLog();

  // Add exercise to log
  const logEntry = {
    ...exerciseData,
    challengeId,
    weekStart: getChallengeWeekStart(),
  };
  log.push(logEntry);
  saveChallengeLog(log);

  // Update challenge progress (add sets to progress)
  const currentChallenge = getCurrentWeeklyChallenge();
  const weekStart = getWeekStart();

  if (state.weeklyChallenge.weekStart !== weekStart) {
    // New week, reset challenge
    state.weeklyChallenge = {
      id: currentChallenge.id,
      progress: 0,
      completed: false,
      weekStart,
    };
  }

  // Add sets to progress for applicable challenge types
  const setsToAdd = exerciseData.sets || 0;
  const volumeToAdd = exerciseData.volume || 0;

  if (['upper_body', 'leg_day', 'compound_king', 'set_crusher'].includes(challengeId)) {
    state.weeklyChallenge.progress += setsToAdd;
  } else if (challengeId === 'volume_boost') {
    state.weeklyChallenge.progress += volumeToAdd;
  }

  // Track exercise sets for mastery badges
  if (!state.stats.exerciseSets) state.stats.exerciseSets = {};
  state.stats.exerciseSets[exerciseData.exerciseName] =
    (state.stats.exerciseSets[exerciseData.exerciseName] || 0) + setsToAdd;

  // Update total sets and volume
  state.stats.totalSets += setsToAdd;
  state.stats.totalVolume += volumeToAdd;

  // Award XP for logging exercise (5 XP per set)
  const xpPerSet = 5;
  const baseXP = setsToAdd * xpPerSet;
  const multiplier = state.dailyBonus?.multiplier || 1;
  const xpGained = Math.round(baseXP * multiplier);

  state.xp += xpGained;
  state.totalXP += xpGained;

  // Check if challenge completed
  let challengeCompleted = false;
  if (state.weeklyChallenge.progress >= currentChallenge.target && !state.weeklyChallenge.completed) {
    state.weeklyChallenge.completed = true;
    state.xp += currentChallenge.xpReward;
    state.totalXP += currentChallenge.xpReward;
    challengeCompleted = true;
  }

  saveState(state);

  // Check for new badges
  const newBadges = checkBadges();

  return {
    xpGained: challengeCompleted ? xpGained + currentChallenge.xpReward : xpGained,
    totalXP: state.xp,
    level: getLevelFromXP(state.xp),
    newProgress: state.weeklyChallenge.progress,
    challengeCompleted,
    newBadges,
  };
};

// Get logged exercises for current week's challenge
export const getWeeklyChallengeLog = () => {
  const log = getChallengeLog();
  const weekStart = getChallengeWeekStart();

  // Filter to current week's entries
  return log.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const weekStartDate = new Date(weekStart);
    return entryDate >= weekStartDate;
  });
};

export default {
  addXP,
  checkBadges,
  updateStreak,
  recordSet,
  recordWorkout,
  recordPR,
  recordShare,
  recordTutorialWatched,
  checkDailyBonus,
  getGamificationState,
  recordChallengeExercise,
  getWeeklyChallengeLog,
};
