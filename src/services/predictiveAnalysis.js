// Predictive Analysis Service for Coach Workout Planning
// Analyzes athlete history to suggest personalized workout progressions

import { getWorkouts, getPRs } from './localStorage';

// Calculate average RPE for an exercise from history
const calculateAverageRPE = (workouts, exerciseName) => {
  const exerciseSets = [];
  workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        ex.sets?.forEach(set => {
          if (set.rpe) exerciseSets.push(set.rpe);
        });
      }
    });
  });
  if (exerciseSets.length === 0) return 7; // Default
  return Math.round((exerciseSets.reduce((a, b) => a + b, 0) / exerciseSets.length) * 10) / 10;
};

// Calculate volume trend (increasing, stable, decreasing)
const calculateVolumeTrend = (workouts, exerciseName) => {
  const volumesByDate = [];
  workouts.forEach(workout => {
    let exerciseVolume = 0;
    workout.exercises?.forEach(ex => {
      if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        ex.sets?.forEach(set => {
          exerciseVolume += (set.weight || 0) * (set.reps || 0);
        });
      }
    });
    if (exerciseVolume > 0) {
      volumesByDate.push({ date: new Date(workout.date), volume: exerciseVolume });
    }
  });

  if (volumesByDate.length < 2) return 'stable';

  volumesByDate.sort((a, b) => a.date - b.date);
  const recentHalf = volumesByDate.slice(-Math.ceil(volumesByDate.length / 2));
  const earlierHalf = volumesByDate.slice(0, Math.ceil(volumesByDate.length / 2));

  const recentAvg = recentHalf.reduce((a, b) => a + b.volume, 0) / recentHalf.length;
  const earlierAvg = earlierHalf.reduce((a, b) => a + b.volume, 0) / earlierHalf.length;

  const percentChange = ((recentAvg - earlierAvg) / earlierAvg) * 100;

  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
};

// Get best weight for given reps from history
const getBestWeight = (workouts, exerciseName, targetReps) => {
  let bestWeight = 0;
  workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        ex.sets?.forEach(set => {
          if (set.reps >= targetReps && set.weight > bestWeight) {
            bestWeight = set.weight;
          }
        });
      }
    });
  });
  return bestWeight;
};

// Calculate estimated 1RM using Brzycki formula
const calculate1RM = (weight, reps) => {
  if (reps >= 12) return Math.round(weight * 1.3); // Estimate for high reps
  return Math.round(weight * (36 / (37 - reps)));
};

// Generate predictive workout for an athlete
export const generatePredictiveWorkout = (athleteId, programDay) => {
  const workouts = getWorkouts(athleteId);
  const prs = getPRs(athleteId);

  if (!programDay?.exercises) return null;

  const predictedExercises = programDay.exercises.map(exercise => {
    const exerciseName = exercise.name;
    const targetSets = exercise.sets || 3;
    const targetRepsRange = exercise.reps || '8-10';
    const [minReps, maxReps] = targetRepsRange.split('-').map(Number);
    const targetReps = Math.round((minReps + (maxReps || minReps)) / 2);

    // Get historical data
    const avgRPE = calculateAverageRPE(workouts, exerciseName);
    const volumeTrend = calculateVolumeTrend(workouts, exerciseName);
    const bestWeight = getBestWeight(workouts, exerciseName, targetReps);
    const exercisePR = prs[exerciseName]?.weight || 0;
    const estimated1RM = bestWeight ? calculate1RM(bestWeight, targetReps) : 0;

    // Calculate suggested weight based on trend and RPE
    let suggestedWeight = bestWeight;
    let progressionNote = '';

    if (volumeTrend === 'increasing' && avgRPE < 8) {
      // Athlete is progressing and not maxed out - suggest increase
      suggestedWeight = Math.round(bestWeight * 1.025 / 5) * 5; // Round to nearest 5
      progressionNote = '📈 Progressing well - increase weight';
    } else if (volumeTrend === 'decreasing' || avgRPE > 8.5) {
      // Might be overreaching - suggest deload
      suggestedWeight = Math.round(bestWeight * 0.9 / 5) * 5;
      progressionNote = '⚡ High fatigue detected - deload week suggested';
    } else if (avgRPE >= 7 && avgRPE <= 8) {
      // Good zone - maintain or slight increase
      suggestedWeight = Math.round(bestWeight * 1.01 / 5) * 5;
      progressionNote = '✅ Good progress - maintain intensity';
    }

    // Generate set-by-set predictions
    const predictedSets = Array.from({ length: targetSets }, (_, i) => {
      // Slight progression through sets for compound movements
      const setWeight = i === targetSets - 1
        ? suggestedWeight
        : Math.round((suggestedWeight * (0.9 + i * 0.05)) / 5) * 5;

      return {
        setNumber: i + 1,
        weight: setWeight,
        reps: targetReps,
        targetRPE: Math.min(9, 7 + i * 0.5), // Progressive RPE
      };
    });

    return {
      ...exercise,
      analysis: {
        avgRPE,
        volumeTrend,
        bestWeight,
        exercisePR,
        estimated1RM,
        suggestedWeight,
        progressionNote,
      },
      predictedSets,
      confidence: bestWeight > 0 ? 'high' : 'low',
      lastPerformed: getLastPerformedDate(workouts, exerciseName),
    };
  });

  return {
    ...programDay,
    exercises: predictedExercises,
    generatedAt: new Date().toISOString(),
    athleteId,
  };
};

// Get last performed date for an exercise
const getLastPerformedDate = (workouts, exerciseName) => {
  let lastDate = null;
  workouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        const workoutDate = new Date(workout.date);
        if (!lastDate || workoutDate > lastDate) {
          lastDate = workoutDate;
        }
      }
    });
  });
  return lastDate?.toISOString() || null;
};

// Get athlete readiness score based on recent history
export const getAthleteReadiness = (athleteId) => {
  const workouts = getWorkouts(athleteId);
  const recentWorkouts = workouts
    .filter(w => new Date(w.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (recentWorkouts.length === 0) {
    return { score: 100, status: 'rested', message: 'No recent workouts - fully recovered' };
  }

  // Calculate average RPE from recent workouts
  let totalRPE = 0;
  let rpeCount = 0;
  recentWorkouts.forEach(workout => {
    workout.exercises?.forEach(ex => {
      ex.sets?.forEach(set => {
        if (set.rpe) {
          totalRPE += set.rpe;
          rpeCount++;
        }
      });
    });
  });

  const avgRPE = rpeCount > 0 ? totalRPE / rpeCount : 7;
  const workoutFrequency = recentWorkouts.length;
  const daysSinceLastWorkout = Math.floor(
    (Date.now() - new Date(recentWorkouts[0].date).getTime()) / (24 * 60 * 60 * 1000)
  );

  // Calculate readiness score (0-100)
  let score = 100;
  score -= (avgRPE - 7) * 10; // Penalize high RPE
  score -= Math.max(0, workoutFrequency - 4) * 5; // Penalize over-training
  score += Math.min(daysSinceLastWorkout * 10, 30); // Bonus for rest days

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status, message;
  if (score >= 80) {
    status = 'optimal';
    message = 'Ready for high intensity training';
  } else if (score >= 60) {
    status = 'good';
    message = 'Good to train - moderate intensity recommended';
  } else if (score >= 40) {
    status = 'moderate';
    message = 'Consider lighter session or active recovery';
  } else {
    status = 'fatigued';
    message = 'Rest recommended - risk of overtraining';
  }

  return {
    score,
    status,
    message,
    avgRPE: Math.round(avgRPE * 10) / 10,
    workoutsThisWeek: workoutFrequency,
    daysSinceLastWorkout,
  };
};

// Generate weekly program adjustment suggestions
export const generateProgramSuggestions = (athleteId, currentProgram) => {
  const readiness = getAthleteReadiness(athleteId);
  const workouts = getWorkouts(athleteId);
  const suggestions = [];

  if (readiness.status === 'fatigued') {
    suggestions.push({
      type: 'deload',
      priority: 'high',
      message: 'Consider a deload week - reduce volume by 40%',
      icon: '⚠️',
    });
  }

  if (readiness.workoutsThisWeek < 2 && readiness.daysSinceLastWorkout > 3) {
    suggestions.push({
      type: 'consistency',
      priority: 'medium',
      message: 'Athlete engagement dropping - consider check-in',
      icon: '📉',
    });
  }

  // Check for plateau (no PR in 4+ weeks)
  const fourWeeksAgo = Date.now() - 28 * 24 * 60 * 60 * 1000;
  const recentPRs = workouts.filter(
    w => new Date(w.date) > new Date(fourWeeksAgo) && w.notes?.includes('PR')
  );
  if (recentPRs.length === 0 && workouts.length > 10) {
    suggestions.push({
      type: 'plateau',
      priority: 'medium',
      message: 'No PRs in 4 weeks - consider program variation',
      icon: '🔄',
    });
  }

  // Volume recommendation
  const volumeTrend = calculateVolumeTrend(workouts, 'Back Squat'); // Use main lift as indicator
  if (volumeTrend === 'decreasing' && readiness.status === 'optimal') {
    suggestions.push({
      type: 'volume',
      priority: 'low',
      message: 'Volume decreasing despite good recovery - consider increasing',
      icon: '📊',
    });
  }

  return suggestions;
};

export default {
  generatePredictiveWorkout,
  getAthleteReadiness,
  generateProgramSuggestions,
};
