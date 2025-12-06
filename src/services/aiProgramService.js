// AI Program Service - Coach-only intelligent program generation
// This service analyzes athlete data and generates personalized program suggestions
// All AI features are strictly coach-facing - athletes never see AI involvement

import { getWorkouts, getPRs, getPrograms } from './localStorage';
import { getAthleteReadiness, generateProgramSuggestions } from './predictiveAnalysis';

// Exercise categories and their progressions
const EXERCISE_PROGRESSIONS = {
  squat: ['Goblet Squat', 'Back Squat', 'Front Squat', 'Bulgarian Split Squat'],
  hinge: ['Romanian Deadlift', 'Conventional Deadlift', 'Sumo Deadlift', 'Trap Bar Deadlift'],
  push: ['Push-Up', 'Dumbbell Press', 'Bench Press', 'Incline Bench Press'],
  pull: ['Lat Pulldown', 'Cable Row', 'Barbell Row', 'Pull-Up', 'Weighted Pull-Up'],
  carry: ['Farmer Walk', 'Suitcase Carry', 'Overhead Carry'],
  core: ['Plank', 'Dead Bug', 'Pallof Press', 'Ab Wheel Rollout'],
};

// Goal-specific templates
const GOAL_TEMPLATES = {
  strength: {
    repRanges: ['3-5', '4-6', '5-6'],
    restPeriods: [180, 240, 300],
    setsPerExercise: [4, 5, 6],
    tempo: '3010',
    primaryFocus: ['squat', 'hinge', 'push', 'pull'],
  },
  hypertrophy: {
    repRanges: ['8-10', '10-12', '12-15'],
    restPeriods: [60, 90, 120],
    setsPerExercise: [3, 4],
    tempo: '3011',
    primaryFocus: ['push', 'pull', 'squat', 'hinge'],
  },
  fatLoss: {
    repRanges: ['12-15', '15-20'],
    restPeriods: [30, 45, 60],
    setsPerExercise: [3, 4],
    tempo: '2010',
    primaryFocus: ['squat', 'push', 'pull', 'carry', 'core'],
  },
  athletic: {
    repRanges: ['3-5', '6-8', '8-10'],
    restPeriods: [90, 120, 180],
    setsPerExercise: [3, 4, 5],
    tempo: '10X1',
    primaryFocus: ['squat', 'hinge', 'push', 'pull', 'carry'],
  },
  general: {
    repRanges: ['8-12', '10-15'],
    restPeriods: [60, 90],
    setsPerExercise: [3],
    tempo: '2011',
    primaryFocus: ['squat', 'push', 'pull', 'core'],
  },
};

// Level-based progressions
const LEVEL_MODIFIERS = {
  beginner: { volumeMultiplier: 0.7, exerciseComplexity: 0, weeklyFrequency: 3 },
  intermediate: { volumeMultiplier: 1.0, exerciseComplexity: 1, weeklyFrequency: 4 },
  advanced: { volumeMultiplier: 1.3, exerciseComplexity: 2, weeklyFrequency: 5 },
};

// Analyze athlete's training history to identify patterns
const analyzeTrainingHistory = (athleteId) => {
  const workouts = getWorkouts(athleteId);
  const prs = getPRs(athleteId);

  if (workouts.length === 0) {
    return {
      hasHistory: false,
      preferredExercises: [],
      weakPoints: [],
      strongPoints: [],
      volumeTolerance: 'unknown',
      avgWorkoutsPerWeek: 0,
    };
  }

  // Calculate average workouts per week
  const sortedWorkouts = workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstWorkout = new Date(sortedWorkouts[0].date);
  const lastWorkout = new Date(sortedWorkouts[sortedWorkouts.length - 1].date);
  const weeksDiff = Math.max(1, (lastWorkout - firstWorkout) / (7 * 24 * 60 * 60 * 1000));
  const avgWorkoutsPerWeek = Math.round(workouts.length / weeksDiff * 10) / 10;

  // Track exercise frequency and performance
  const exerciseStats = {};
  workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      if (!exerciseStats[ex.name]) {
        exerciseStats[ex.name] = { count: 0, totalVolume: 0, avgRPE: 0, rpeCount: 0 };
      }
      exerciseStats[ex.name].count++;
      ex.sets?.forEach(set => {
        exerciseStats[ex.name].totalVolume += (set.weight || 0) * (set.reps || 0);
        if (set.rpe) {
          exerciseStats[ex.name].avgRPE += set.rpe;
          exerciseStats[ex.name].rpeCount++;
        }
      });
    });
  });

  // Normalize RPE averages
  Object.keys(exerciseStats).forEach(name => {
    if (exerciseStats[name].rpeCount > 0) {
      exerciseStats[name].avgRPE /= exerciseStats[name].rpeCount;
    }
  });

  // Identify preferred exercises (most frequently performed)
  const preferredExercises = Object.entries(exerciseStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name]) => name);

  // Identify strong points (exercises with PRs or high volume)
  const strongPoints = Object.keys(prs);

  // Estimate volume tolerance based on avg RPE
  const avgOverallRPE = Object.values(exerciseStats)
    .filter(s => s.rpeCount > 0)
    .reduce((sum, s) => sum + s.avgRPE, 0) /
    Object.values(exerciseStats).filter(s => s.rpeCount > 0).length || 7;

  const volumeTolerance = avgOverallRPE < 7 ? 'high' : avgOverallRPE > 8 ? 'low' : 'moderate';

  return {
    hasHistory: true,
    preferredExercises,
    weakPoints: [], // Would need more data to determine
    strongPoints,
    volumeTolerance,
    avgWorkoutsPerWeek,
    exerciseStats,
  };
};

// Generate a complete program tailored to the athlete
export const generateAIProgram = (athleteId, athleteProfile, options = {}) => {
  const {
    goal = 'general',
    level = 'intermediate',
    daysPerWeek = 4,
    weeks = 4,
    useCoachTemplates = true,
  } = options;

  // Get athlete history analysis
  const history = analyzeTrainingHistory(athleteId);
  const readiness = getAthleteReadiness(athleteId);
  const suggestions = generateProgramSuggestions(athleteId);

  // Get goal template
  const template = GOAL_TEMPLATES[goal.toLowerCase()] || GOAL_TEMPLATES.general;
  const levelMod = LEVEL_MODIFIERS[level.toLowerCase()] || LEVEL_MODIFIERS.intermediate;

  // Check for coach's saved programs to use as templates
  const coachPrograms = getPrograms();
  let templateProgram = null;
  if (useCoachTemplates && coachPrograms.length > 0) {
    // Find a program matching the goal
    templateProgram = coachPrograms.find(p =>
      p.name.toLowerCase().includes(goal.toLowerCase())
    ) || coachPrograms[0];
  }

  // Generate days
  const days = [];
  const splits = generateSplit(daysPerWeek, goal);

  splits.forEach((split, dayIndex) => {
    const exercises = generateDayExercises(
      split,
      template,
      levelMod,
      history,
      templateProgram,
      dayIndex
    );

    days.push({
      id: Date.now() + dayIndex,
      name: `Day ${dayIndex + 1} - ${split.name}`,
      exercises,
    });
  });

  // Adjust based on readiness if needed
  let adjustmentNote = null;
  if (readiness.status === 'fatigued') {
    adjustmentNote = 'Volume reduced due to detected fatigue. Consider deload week.';
    days.forEach(day => {
      day.exercises = day.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
      }));
    });
  }

  // Check for deload suggestion
  const needsDeload = suggestions.some(s => s.type === 'deload');

  return {
    name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Program - ${weeks} Weeks`,
    goal,
    level,
    weeks,
    daysPerWeek,
    days,
    athleteId,
    generatedAt: new Date().toISOString(),
    basedOnHistory: history.hasHistory,
    adjustmentNote,
    needsDeload,
    readinessScore: readiness.score,
    coachRecommendations: suggestions,
    // Confidence score based on history depth
    confidence: history.hasHistory && history.avgWorkoutsPerWeek > 2 ? 'high' :
                history.hasHistory ? 'medium' : 'low',
  };
};

// Generate training split based on days per week
const generateSplit = (daysPerWeek, goal) => {
  const splits = {
    2: [
      { name: 'Full Body A', focus: ['squat', 'push', 'pull', 'core'] },
      { name: 'Full Body B', focus: ['hinge', 'push', 'pull', 'carry'] },
    ],
    3: [
      { name: 'Full Body A', focus: ['squat', 'push', 'pull'] },
      { name: 'Full Body B', focus: ['hinge', 'push', 'pull'] },
      { name: 'Full Body C', focus: ['squat', 'hinge', 'core'] },
    ],
    4: [
      { name: 'Upper Body', focus: ['push', 'pull'] },
      { name: 'Lower Body', focus: ['squat', 'hinge'] },
      { name: 'Push Focus', focus: ['push', 'core'] },
      { name: 'Pull Focus', focus: ['pull', 'carry'] },
    ],
    5: [
      { name: 'Lower Strength', focus: ['squat', 'hinge'] },
      { name: 'Upper Push', focus: ['push'] },
      { name: 'Upper Pull', focus: ['pull'] },
      { name: 'Lower Hypertrophy', focus: ['squat', 'hinge', 'carry'] },
      { name: 'Full Body', focus: ['push', 'pull', 'core'] },
    ],
    6: [
      { name: 'Push', focus: ['push'] },
      { name: 'Pull', focus: ['pull'] },
      { name: 'Legs', focus: ['squat', 'hinge'] },
      { name: 'Push', focus: ['push', 'core'] },
      { name: 'Pull', focus: ['pull', 'carry'] },
      { name: 'Legs', focus: ['squat', 'hinge', 'core'] },
    ],
  };

  return splits[daysPerWeek] || splits[4];
};

// Generate exercises for a day
const generateDayExercises = (split, template, levelMod, history, templateProgram, dayIndex) => {
  const exercises = [];
  const usedExercises = new Set();

  split.focus.forEach((category, i) => {
    const categoryExercises = EXERCISE_PROGRESSIONS[category];
    if (!categoryExercises) return;

    // Select exercise based on level (higher complexity for advanced)
    const exerciseIndex = Math.min(
      levelMod.exerciseComplexity + (i === 0 ? 1 : 0), // First exercise is usually compound
      categoryExercises.length - 1
    );

    let selectedExercise = categoryExercises[exerciseIndex];

    // If we have history, prefer exercises athlete has done well with
    if (history.hasHistory && history.preferredExercises.length > 0) {
      const preferred = history.preferredExercises.find(
        ex => categoryExercises.includes(ex) && !usedExercises.has(ex)
      );
      if (preferred) selectedExercise = preferred;
    }

    // Use template program exercise if available
    if (templateProgram?.days?.[dayIndex]?.exercises?.[i]) {
      const templateEx = templateProgram.days[dayIndex].exercises[i];
      if (templateEx.name) {
        selectedExercise = templateEx.name;
      }
    }

    usedExercises.add(selectedExercise);

    // Select parameters from template
    const sets = template.setsPerExercise[Math.min(i, template.setsPerExercise.length - 1)];
    const reps = template.repRanges[Math.min(i, template.repRanges.length - 1)];
    const rest = template.restPeriods[Math.min(i, template.restPeriods.length - 1)];

    exercises.push({
      id: Date.now() + i,
      name: selectedExercise,
      sets: Math.round(sets * levelMod.volumeMultiplier),
      reps,
      tempo: template.tempo,
      rest,
      category,
    });
  });

  return exercises;
};

// Generate program suggestions for a specific athlete
export const getAIProgramSuggestions = (athleteId, athleteProfile) => {
  const history = analyzeTrainingHistory(athleteId);
  const readiness = getAthleteReadiness(athleteId);

  const suggestions = [];

  // Suggest based on goal
  const goal = athleteProfile?.goal?.toLowerCase() || 'general';
  const level = athleteProfile?.level?.toLowerCase() || 'intermediate';

  // Always provide a tailored program suggestion
  suggestions.push({
    type: 'tailored',
    name: `Personalized ${goal.charAt(0).toUpperCase() + goal.slice(1)} Program`,
    description: history.hasHistory
      ? `Based on ${Math.round(history.avgWorkoutsPerWeek * 4)} workouts analyzed`
      : 'Recommended starting program',
    confidence: history.hasHistory ? 'high' : 'medium',
    program: generateAIProgram(athleteId, athleteProfile, { goal, level }),
  });

  // Suggest deload if needed
  if (readiness.score < 50) {
    suggestions.push({
      type: 'deload',
      name: 'Recovery Week',
      description: 'Reduced volume to optimize recovery',
      confidence: 'high',
      program: generateAIProgram(athleteId, athleteProfile, {
        goal,
        level: 'beginner', // Lower volume
        weeks: 1,
      }),
    });
  }

  // Suggest progression if doing well
  if (readiness.score > 80 && history.volumeTolerance === 'high') {
    suggestions.push({
      type: 'progression',
      name: 'Progressive Overload Block',
      description: 'Increased volume for continued gains',
      confidence: 'medium',
      program: generateAIProgram(athleteId, athleteProfile, {
        goal,
        level: level === 'advanced' ? 'advanced' : 'intermediate',
        daysPerWeek: Math.min(5, (athleteProfile?.daysPerWeek || 4) + 1),
      }),
    });
  }

  return suggestions;
};

// Analyze and suggest modifications to existing program
export const analyzeAndModifyProgram = (program, athleteId) => {
  const history = analyzeTrainingHistory(athleteId);
  const readiness = getAthleteReadiness(athleteId);

  const modifications = {
    applied: [],
    suggested: [],
    originalProgram: program,
    modifiedProgram: JSON.parse(JSON.stringify(program)),
  };

  // Apply automatic modifications based on readiness
  if (readiness.status === 'fatigued') {
    modifications.modifiedProgram.days.forEach(day => {
      day.exercises.forEach(ex => {
        ex.sets = Math.max(2, Math.round(ex.sets * 0.7));
      });
    });
    modifications.applied.push({
      type: 'volume_reduction',
      reason: 'High fatigue detected',
      change: 'Sets reduced by 30%',
    });
  }

  // Suggest exercise swaps based on history
  if (history.hasHistory) {
    modifications.modifiedProgram.days.forEach(day => {
      day.exercises.forEach((ex, i) => {
        const preferred = history.preferredExercises.find(
          p => p !== ex.name &&
          Object.values(EXERCISE_PROGRESSIONS).some(
            cat => cat.includes(p) && cat.includes(ex.name)
          )
        );
        if (preferred && history.exerciseStats[ex.name]?.avgRPE > 8.5) {
          modifications.suggested.push({
            type: 'exercise_swap',
            day: day.name,
            original: ex.name,
            suggested: preferred,
            reason: 'High RPE on current exercise, athlete responds well to alternative',
          });
        }
      });
    });
  }

  return modifications;
};

export default {
  generateAIProgram,
  getAIProgramSuggestions,
  analyzeAndModifyProgram,
  analyzeTrainingHistory,
};
