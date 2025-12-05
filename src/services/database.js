import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ===== WORKOUTS =====

// Log a completed workout
export const logWorkout = async (athleteId, workoutData) => {
  try {
    const workoutRef = await addDoc(collection(db, 'workouts'), {
      athleteId,
      ...workoutData,
      completedAt: serverTimestamp(),
    });
    return { id: workoutRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Get workout history for an athlete
export const getWorkoutHistory = async (athleteId, limitCount = 30) => {
  try {
    const q = query(
      collection(db, 'workouts'),
      where('athleteId', '==', athleteId),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const workouts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { workouts, error: null };
  } catch (error) {
    return { workouts: [], error: error.message };
  }
};

// Subscribe to workout updates (real-time)
export const subscribeToWorkouts = (athleteId, callback) => {
  const q = query(
    collection(db, 'workouts'),
    where('athleteId', '==', athleteId),
    orderBy('completedAt', 'desc'),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    const workouts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(workouts);
  });
};

// ===== EXERCISES & SETS =====

// Log a set for an exercise
export const logSet = async (workoutId, exerciseId, setData) => {
  try {
    const setRef = await addDoc(
      collection(db, 'workouts', workoutId, 'sets'),
      {
        exerciseId,
        ...setData,
        loggedAt: serverTimestamp(),
      }
    );
    return { id: setRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Get exercise history (for tracking progress)
export const getExerciseHistory = async (athleteId, exerciseName, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'exerciseLogs'),
      where('athleteId', '==', athleteId),
      where('exerciseName', '==', exerciseName),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { history, error: null };
  } catch (error) {
    return { history: [], error: error.message };
  }
};

// ===== PROGRAMS =====

// Create a new program (coach)
export const createProgram = async (coachId, programData) => {
  try {
    const programRef = await addDoc(collection(db, 'programs'), {
      coachId,
      ...programData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: programRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Get all programs for a coach
export const getCoachPrograms = async (coachId) => {
  try {
    const q = query(
      collection(db, 'programs'),
      where('coachId', '==', coachId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const programs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { programs, error: null };
  } catch (error) {
    return { programs: [], error: error.message };
  }
};

// Get a specific program
export const getProgram = async (programId) => {
  try {
    const programDoc = await getDoc(doc(db, 'programs', programId));
    if (programDoc.exists()) {
      return { program: { id: programDoc.id, ...programDoc.data() }, error: null };
    }
    return { program: null, error: 'Program not found' };
  } catch (error) {
    return { program: null, error: error.message };
  }
};

// Update a program
export const updateProgram = async (programId, updates) => {
  try {
    await updateDoc(doc(db, 'programs', programId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Assign program to athlete
export const assignProgram = async (athleteId, programId, startDate) => {
  try {
    await updateDoc(doc(db, 'athletes', athleteId), {
      currentProgram: programId,
      programStartDate: startDate,
      currentWeek: 1,
      currentDay: 1,
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ===== CLIENTS (Coach) =====

// Get all clients for a coach
export const getCoachClients = async (coachId) => {
  try {
    const q = query(
      collection(db, 'athletes'),
      where('coachId', '==', coachId)
    );
    const snapshot = await getDocs(q);
    const clients = await Promise.all(
      snapshot.docs.map(async (athleteDoc) => {
        const athleteData = athleteDoc.data();
        const userDoc = await getDoc(doc(db, 'users', athleteDoc.id));
        return {
          id: athleteDoc.id,
          ...athleteData,
          ...(userDoc.exists() ? userDoc.data() : {}),
        };
      })
    );
    return { clients, error: null };
  } catch (error) {
    return { clients: [], error: error.message };
  }
};

// Subscribe to client updates (real-time)
export const subscribeToClients = (coachId, callback) => {
  const q = query(
    collection(db, 'athletes'),
    where('coachId', '==', coachId)
  );

  return onSnapshot(q, async (snapshot) => {
    const clients = await Promise.all(
      snapshot.docs.map(async (athleteDoc) => {
        const athleteData = athleteDoc.data();
        const userDoc = await getDoc(doc(db, 'users', athleteDoc.id));
        return {
          id: athleteDoc.id,
          ...athleteData,
          ...(userDoc.exists() ? userDoc.data() : {}),
        };
      })
    );
    callback(clients);
  });
};

// ===== PRs (Personal Records) =====

// Log a new PR
export const logPR = async (athleteId, exerciseName, weight, reps, date) => {
  try {
    await addDoc(collection(db, 'prs'), {
      athleteId,
      exerciseName,
      weight,
      reps,
      estimated1RM: Math.round(weight * (1 + reps / 30)),
      date: date || serverTimestamp(),
    });

    // Update athlete's PR map
    const athleteRef = doc(db, 'athletes', athleteId);
    const athleteDoc = await getDoc(athleteRef);
    if (athleteDoc.exists()) {
      const currentPRs = athleteDoc.data().prs || {};
      const currentBest = currentPRs[exerciseName]?.weight || 0;
      if (weight > currentBest) {
        await updateDoc(athleteRef, {
          [`prs.${exerciseName}`]: { weight, reps, date: new Date() },
        });
      }
    }

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get PRs for an athlete
export const getAthletePs = async (athleteId) => {
  try {
    const q = query(
      collection(db, 'prs'),
      where('athleteId', '==', athleteId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    const prs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { prs, error: null };
  } catch (error) {
    return { prs: [], error: error.message };
  }
};

// ===== USER SETTINGS =====

// Update user settings
export const updateUserSettings = async (userId, settings) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      settings: settings,
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ===== ATHLETE STATS =====

// Update athlete streak
export const updateStreak = async (athleteId, streak) => {
  try {
    await updateDoc(doc(db, 'athletes', athleteId), {
      streak,
      lastWorkoutDate: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get athlete stats
export const getAthleteStats = async (athleteId) => {
  try {
    const athleteDoc = await getDoc(doc(db, 'athletes', athleteId));
    if (athleteDoc.exists()) {
      return { stats: athleteDoc.data(), error: null };
    }
    return { stats: null, error: 'Athlete not found' };
  } catch (error) {
    return { stats: null, error: error.message };
  }
};
