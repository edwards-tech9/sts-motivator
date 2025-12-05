// Local Storage service for demo mode persistence
// This provides a complete data layer that works without Firebase

const STORAGE_KEYS = {
  USER: 'sts_user',
  WORKOUTS: 'sts_workouts',
  PROGRAMS: 'sts_programs',
  ATHLETES: 'sts_athletes',
  SETTINGS: 'sts_settings',
  PRS: 'sts_prs',
};

// Helper to get/set JSON from localStorage
const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// User Management
export const getLocalUser = () => getItem(STORAGE_KEYS.USER);

export const setLocalUser = (user) => setItem(STORAGE_KEYS.USER, user);

export const clearLocalUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Demo user creation
export const createDemoUser = (role = 'athlete', name = 'Demo User') => {
  const user = {
    uid: `demo_${Date.now()}`,
    email: `${role}@demo.sts-motivator.app`,
    displayName: name,
    role,
    createdAt: new Date().toISOString(),
    settings: {
      theme: 'dark',
      notifications: true,
      techMode: false,
    },
  };
  setLocalUser(user);
  return user;
};

// Workouts
export const getWorkouts = (userId) => {
  const workouts = getItem(STORAGE_KEYS.WORKOUTS, []);
  return workouts.filter(w => w.userId === userId || !userId);
};

export const saveWorkout = (workout) => {
  const workouts = getItem(STORAGE_KEYS.WORKOUTS, []);
  const existingIndex = workouts.findIndex(w => w.id === workout.id);

  if (existingIndex >= 0) {
    workouts[existingIndex] = { ...workouts[existingIndex], ...workout };
  } else {
    workout.id = workout.id || `workout_${Date.now()}`;
    workout.createdAt = workout.createdAt || new Date().toISOString();
    workouts.push(workout);
  }

  setItem(STORAGE_KEYS.WORKOUTS, workouts);
  return workout;
};

export const deleteWorkout = (workoutId) => {
  const workouts = getItem(STORAGE_KEYS.WORKOUTS, []);
  const filtered = workouts.filter(w => w.id !== workoutId);
  setItem(STORAGE_KEYS.WORKOUTS, filtered);
};

// Programs
export const getPrograms = (coachId) => {
  const programs = getItem(STORAGE_KEYS.PROGRAMS, []);
  return programs.filter(p => p.coachId === coachId || !coachId);
};

export const saveProgram = (program) => {
  const programs = getItem(STORAGE_KEYS.PROGRAMS, []);
  const existingIndex = programs.findIndex(p => p.id === program.id);

  if (existingIndex >= 0) {
    programs[existingIndex] = { ...programs[existingIndex], ...program };
  } else {
    program.id = program.id || `program_${Date.now()}`;
    program.createdAt = program.createdAt || new Date().toISOString();
    programs.push(program);
  }

  setItem(STORAGE_KEYS.PROGRAMS, programs);
  return program;
};

export const deleteProgram = (programId) => {
  const programs = getItem(STORAGE_KEYS.PROGRAMS, []);
  const filtered = programs.filter(p => p.id !== programId);
  setItem(STORAGE_KEYS.PROGRAMS, filtered);
};

// PRs (Personal Records)
export const getPRs = (userId) => {
  const prs = getItem(STORAGE_KEYS.PRS, {});
  return prs[userId] || {};
};

export const savePR = (userId, exercise, weight, reps = 1) => {
  const prs = getItem(STORAGE_KEYS.PRS, {});
  if (!prs[userId]) prs[userId] = {};

  const currentPR = prs[userId][exercise];
  const newWeight = parseFloat(weight);

  // Only update if it's a new PR
  if (!currentPR || newWeight > currentPR.weight) {
    prs[userId][exercise] = {
      weight: newWeight,
      reps,
      date: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.PRS, prs);
    return true; // New PR!
  }
  return false;
};

// Athletes (for coach view)
export const getAthletes = () => getItem(STORAGE_KEYS.ATHLETES, []);

export const saveAthlete = (athlete) => {
  const athletes = getItem(STORAGE_KEYS.ATHLETES, []);
  const existingIndex = athletes.findIndex(a => a.id === athlete.id);

  if (existingIndex >= 0) {
    athletes[existingIndex] = { ...athletes[existingIndex], ...athlete };
  } else {
    athlete.id = athlete.id || `athlete_${Date.now()}`;
    athletes.push(athlete);
  }

  setItem(STORAGE_KEYS.ATHLETES, athletes);
  return athlete;
};

// Settings
export const getSettings = () => getItem(STORAGE_KEYS.SETTINGS, {
  theme: 'dark',
  notifications: true,
  techMode: false,
});

export const saveSettings = (settings) => setItem(STORAGE_KEYS.SETTINGS, settings);

// Initialize demo data if needed
export const initializeDemoData = () => {
  // Check if we already have demo data
  if (getWorkouts().length > 0 && getPrograms().length > 0) {
    return;
  }

  // Create sample workouts
  const sampleWorkouts = [
    {
      id: 'demo_workout_1',
      userId: 'demo',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      name: 'Lower Body Strength',
      duration: 55,
      exercises: [
        { name: 'Back Squat', sets: [
          { weight: 275, reps: 5, rpe: 7 },
          { weight: 295, reps: 5, rpe: 8 },
          { weight: 315, reps: 3, rpe: 9 },
        ]},
        { name: 'Romanian Deadlift', sets: [
          { weight: 225, reps: 8, rpe: 7 },
          { weight: 225, reps: 8, rpe: 8 },
          { weight: 225, reps: 8, rpe: 8 },
        ]},
        { name: 'Leg Press', sets: [
          { weight: 450, reps: 12, rpe: 7 },
          { weight: 500, reps: 10, rpe: 8 },
          { weight: 500, reps: 10, rpe: 9 },
        ]},
      ],
      notes: 'Felt strong today. PR on squat!',
      completed: true,
    },
    {
      id: 'demo_workout_2',
      userId: 'demo',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      name: 'Upper Body Push',
      duration: 50,
      exercises: [
        { name: 'Bench Press', sets: [
          { weight: 185, reps: 8, rpe: 7 },
          { weight: 205, reps: 6, rpe: 8 },
          { weight: 225, reps: 4, rpe: 9 },
        ]},
        { name: 'Overhead Press', sets: [
          { weight: 115, reps: 8, rpe: 7 },
          { weight: 125, reps: 6, rpe: 8 },
          { weight: 125, reps: 6, rpe: 8 },
        ]},
      ],
      completed: true,
    },
  ];

  sampleWorkouts.forEach(saveWorkout);

  // Create sample programs
  const samplePrograms = [
    {
      id: 'demo_program_1',
      coachId: 'demo_coach',
      name: 'Beginner Strength',
      weeks: 4,
      days: [
        {
          name: 'Day A - Lower',
          exercises: [
            { name: 'Back Squat', sets: 4, reps: '6-8', rest: 180, tempo: '3010' },
            { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest: 120, tempo: '3010' },
            { name: 'Leg Press', sets: 3, reps: '10-12', rest: 90, tempo: '2010' },
            { name: 'Leg Curl', sets: 3, reps: '10-12', rest: 60, tempo: '2010' },
          ],
        },
        {
          name: 'Day B - Upper',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '6-8', rest: 180, tempo: '3010' },
            { name: 'Barbell Row', sets: 4, reps: '6-8', rest: 120, tempo: '2011' },
            { name: 'Overhead Press', sets: 3, reps: '8-10', rest: 90, tempo: '2010' },
            { name: 'Pull-ups', sets: 3, reps: '6-10', rest: 90, tempo: '2011' },
          ],
        },
      ],
    },
  ];

  samplePrograms.forEach(saveProgram);

  // Set some PRs
  savePR('demo', 'Back Squat', 315, 3);
  savePR('demo', 'Bench Press', 225, 4);
  savePR('demo', 'Deadlift', 395, 1);

  // Create sample athletes for coach view
  const sampleAthletes = [
    {
      id: 'athlete_1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'SJ',
      status: 'active',
      currentProgram: 'Beginner Strength',
      lastWorkout: new Date(Date.now() - 86400000).toISOString(),
      weeklyProgress: 3,
      weeklyTarget: 4,
      streak: 12,
    },
    {
      id: 'athlete_2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: 'MC',
      status: 'active',
      currentProgram: 'Intermediate Hypertrophy',
      lastWorkout: new Date().toISOString(),
      weeklyProgress: 4,
      weeklyTarget: 4,
      streak: 28,
    },
    {
      id: 'athlete_3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'ED',
      status: 'needs_attention',
      currentProgram: 'Beginner Strength',
      lastWorkout: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      weeklyProgress: 1,
      weeklyTarget: 3,
      streak: 0,
    },
  ];

  sampleAthletes.forEach(saveAthlete);
};

// Call initialize on import
initializeDemoData();
