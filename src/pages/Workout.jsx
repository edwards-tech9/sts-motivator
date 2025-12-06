import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import ExerciseCard from '../components/workout/ExerciseCard';
import WarmupSection from '../components/workout/WarmupSection';
import FinisherSection from '../components/workout/FinisherSection';
import SetLoggingModal from '../components/workout/SetLoggingModal';
import RestTimer from '../components/workout/RestTimer';
import PRCelebration from '../components/workout/PRCelebration';
import LiveEncouragement from '../components/workout/LiveEncouragement';
import { saveWorkout, savePR, getPRs } from '../services/localStorage';
import { logWorkout as logWorkoutFirestore, logPR as logPRFirestore } from '../services/database';
import { isFirebaseConfigured } from '../services/firebase';
import { getSocialSettings } from '../components/settings/SocialSettings';

// Sample workout data (this would come from the assigned program)
const mockExercises = [
  { id: 1, name: 'DB Good Morning', sets: 4, reps: '8-10', tempo: '2112', rest: 90, lastWeight: 25, lastReps: [10, 10, 10, 10], muscleGroups: ['Hamstrings', 'Lower Back'] },
  { id: 2, name: 'Split Stance DB RDL', sets: 3, reps: '6-10', tempo: '3111', rest: 90, lastWeight: 25, lastReps: [10, 10, 10], muscleGroups: ['Hamstrings', 'Glutes'] },
  { id: 3, name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', tempo: '11x1', rest: 60, lastWeight: 30, lastReps: [12, 11, 10], muscleGroups: ['Quads', 'Glutes'] },
  { id: 4, name: 'Leg Press', sets: 4, reps: '12-15', tempo: '2010', rest: 90, lastWeight: 180, lastReps: [15, 14, 13, 12], muscleGroups: ['Quads', 'Glutes'] },
  { id: 5, name: 'Seated Calf Raise', sets: 3, reps: '15-20', tempo: '2111', rest: 45, lastWeight: 90, lastReps: [20, 18, 15], muscleGroups: ['Calves'] },
];

const warmupExercises = [
  {
    name: 'Ankle Stretch w/ KB',
    prescription: '2×30s',
    description: 'Hold a kettlebell in front of you, step one foot forward into a deep lunge position. Drive your knee forward over your toes while keeping your heel down. This improves ankle dorsiflexion essential for squats.',
    videoId: 'IikP_teeLkI',
    type: 'warmup',
    focus: 'Mobility'
  },
  {
    name: '90/90 Breathing',
    prescription: '2×10',
    description: 'Lie on your back with hips and knees at 90 degrees, feet on a wall or box. Exhale fully, tuck your pelvis, and inhale deeply through your nose. Focus on rib cage expansion and core activation.',
    videoId: 'uA2IxmMqE0M',
    type: 'warmup',
    focus: 'Activation'
  },
  {
    name: 'T-Spine Rotation',
    prescription: '2×10',
    description: 'Start on all fours, place one hand behind your head. Rotate your elbow toward the opposite arm, then rotate up toward the ceiling. Keep hips square and move from mid-back only.',
    videoId: 'gHTE5SaKQkY',
    type: 'warmup',
    focus: 'Mobility'
  },
];

const finisherExercises = [
  {
    id: 'f1',
    name: 'Assisted Hip Airplanes',
    prescription: '2×10 each side',
    description: 'Single-leg hip stability exercise. Stand on one leg holding a wall, hinge forward and rotate your hips open and closed. Builds glute strength and hip mobility essential for squats and deadlifts.',
    videoId: 'FyJMSP2n53Q',
    type: 'finisher',
    focus: 'Hip Stability'
  },
  {
    id: 'f2',
    name: 'Rolling Plank',
    prescription: '2×20 (10 each direction)',
    description: 'Core stability exercise combining front and side plank. From forearm plank, rotate to side plank, return to center, rotate to other side. Targets obliques and anti-rotation strength.',
    videoId: 'Oyw9O7K_1tQ',
    type: 'finisher',
    focus: 'Core'
  },
  {
    id: 'f3',
    name: 'Dead Bug',
    prescription: '2×10 each side',
    description: 'Anti-extension core exercise. Lying on your back, extend opposite arm and leg while keeping your low back pressed into the floor. Builds core stability and motor control.',
    videoId: 'g_BYB0R-4Ws',
    type: 'finisher',
    focus: 'Core'
  },
];

const Workout = ({ techMode, onToggleTechMode, onExit }) => {
  const [completedSets, setCompletedSets] = useState({});
  const [loggedSets, setLoggedSets] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeSetNumber, setActiveSetNumber] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [prData, setPrData] = useState({ exercise: '', newPR: 0, previousPR: 0 });
  const [warmupExpanded, setWarmupExpanded] = useState(true);
  const [currentRestDuration, setCurrentRestDuration] = useState(90);
  const [workoutStartTime] = useState(Date.now());
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [setCompleteTrigger, setSetCompleteTrigger] = useState(0);

  // Memoize social settings to avoid re-computation on every render
  const socialSettings = useMemo(() => getSocialSettings(), []);
  // Track exercise completion order (array of exercise IDs in order completed)
  const [exerciseCompletionOrder, setExerciseCompletionOrder] = useState([]);

  // Check if an exercise is fully completed (all sets done)
  const isExerciseComplete = (exerciseId, exercise) => {
    const completed = completedSets[exerciseId] || [];
    return completed.length >= exercise.sets;
  };

  // Separate exercises into in-progress and completed
  const inProgressExercises = mockExercises.filter(
    ex => !isExerciseComplete(ex.id, ex)
  );
  const completedExercises = exerciseCompletionOrder
    .map(id => mockExercises.find(ex => ex.id === id))
    .filter(Boolean);

  const handleStartSet = (exercise, setNum) => {
    setActiveExercise(exercise);
    setActiveSetNumber(setNum);
  };

  const handleLogSet = (data) => {
    const exerciseId = activeExercise.id;
    const setIndex = activeSetNumber - 1;
    const exercise = activeExercise;

    // Track completed sets
    const newCompletedSets = [...(completedSets[exerciseId] || []), setIndex];
    setCompletedSets((prev) => ({
      ...prev,
      [exerciseId]: newCompletedSets,
    }));

    // Check if this completes the exercise (add to completion order)
    if (newCompletedSets.length >= exercise.sets && !exerciseCompletionOrder.includes(exerciseId)) {
      setExerciseCompletionOrder(prev => [...prev, exerciseId]);
    }

    // Track logged data with timestamp for order tracking
    setLoggedSets((prev) => ({
      ...prev,
      [exerciseId]: [
        ...(prev[exerciseId] || []),
        { setNum: activeSetNumber, ...data, completedAt: new Date().toISOString() },
      ],
    }));

    // Trigger XP and encouragement animation
    setSetCompleteTrigger(prev => prev + 1);

    // Check for PR
    const currentPRs = getPRs('demo');
    const exercisePR = currentPRs[activeExercise.name]?.weight || activeExercise.lastWeight;

    if (data.weight > exercisePR) {
      // Save new PR to localStorage (immediate)
      savePR('demo', activeExercise.name, data.weight, data.reps);

      // Also save to Firestore if configured (async)
      if (isFirebaseConfigured) {
        logPRFirestore('demo', activeExercise.name, data.weight, data.reps).catch(() => {
          // Silently fail - localStorage backup ensures no data loss
        });
      }

      setPrData({
        exercise: activeExercise.name,
        newPR: data.weight,
        previousPR: exercisePR,
      });
      setShowPRCelebration(true);
    } else {
      setCurrentRestDuration(activeExercise.rest);
      setShowRestTimer(true);
    }

    setActiveExercise(null);
    setActiveSetNumber(null);
  };

  // Save workout (can be called on complete or exit)
  const saveCurrentWorkout = useCallback(async (completed = false) => {
    // Only save if there are logged sets
    const hasLoggedSets = Object.values(loggedSets).some(sets => sets.length > 0);
    if (!hasLoggedSets) return null;

    const duration = Math.round((Date.now() - workoutStartTime) / 60000);

    const workout = {
      userId: 'demo',
      date: new Date().toISOString(),
      name: 'Lower Body - Strength',
      duration,
      exercises: mockExercises.map((ex) => ({
        name: ex.name,
        sets: loggedSets[ex.id] || [],
      })),
      // Store completion order for coach analytics
      exerciseCompletionOrder: exerciseCompletionOrder.map(id => {
        const exercise = mockExercises.find(ex => ex.id === id);
        return exercise ? exercise.name : null;
      }).filter(Boolean),
      completed,
    };

    // Save to localStorage (immediate, works offline)
    saveWorkout(workout);

    // Also save to Firestore if configured (async, for coach access)
    if (isFirebaseConfigured) {
      try {
        await logWorkoutFirestore('demo', workout);
      } catch (err) {
        // Silently fail - localStorage backup ensures no data loss
      }
    }

    return workout;
  }, [loggedSets, workoutStartTime, exerciseCompletionOrder]);

  // Handle exit - save progress before leaving
  const handleExit = () => {
    saveCurrentWorkout(false); // Save as incomplete
    onExit();
  };

  // Save workout when complete
  const handleFinishWorkout = () => {
    saveCurrentWorkout(true);
    setWorkoutComplete(true);

    // Exit after showing completion
    setTimeout(() => {
      onExit();
    }, 2000);
  };

  const totalSets = mockExercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedTotal = Object.values(completedSets).flat().length;
  const progress = (completedTotal / totalSets) * 100;

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg"
            aria-label="Exit workout"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Exit</span>
          </button>
          <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
          <button
            onClick={onToggleTechMode}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
              techMode ? 'bg-gold-500 text-white' : 'bg-carbon-700 text-gray-400'
            }`}
            aria-pressed={techMode}
            aria-label={techMode ? 'Switch to simple mode' : 'Switch to tech mode'}
          >
            {techMode ? '🔬 TECH' : 'SIMPLE'}
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-gray-400 text-sm">Week 3 · Day 1</span>
        </div>
        <h1
          className="text-3xl font-black text-white mb-4 tracking-tight"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          LOWER BODY - STRENGTH
        </h1>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">
              {completedTotal} of {totalSets} sets complete
            </span>
            <span className="text-gold-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2 bg-carbon-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Workout progress"
          >
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <WarmupSection
          exercises={warmupExercises}
          expanded={warmupExpanded}
          onToggle={() => setWarmupExpanded(!warmupExpanded)}
        />

        {/* In Progress Exercises */}
        {inProgressExercises.length > 0 && (
          <>
            {completedExercises.length > 0 && (
              <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
                In Progress
              </h2>
            )}
            {inProgressExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={mockExercises.indexOf(exercise) + 1}
                completedSets={completedSets[exercise.id] || []}
                onStartSet={handleStartSet}
                techMode={techMode}
                isActive={activeExercise?.id === exercise.id}
              />
            ))}
          </>
        )}

        {/* Completed Exercises */}
        {completedExercises.length > 0 && (
          <>
            <h2 className="text-green-400 text-sm uppercase tracking-wide mb-3 mt-6 flex items-center gap-2">
              <CheckCircle size={14} />
              Completed ({completedExercises.length})
            </h2>
            {completedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={mockExercises.indexOf(exercise) + 1}
                completedSets={completedSets[exercise.id] || []}
                onStartSet={handleStartSet}
                techMode={techMode}
                isActive={false}
              />
            ))}
          </>
        )}

        <FinisherSection exercises={finisherExercises} />

        {/* Finish Workout Button */}
        {progress >= 50 && !workoutComplete && (
          <button
            onClick={handleFinishWorkout}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <CheckCircle size={24} />
            FINISH WORKOUT
          </button>
        )}

        {/* Workout Complete Message */}
        {workoutComplete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
              <p className="text-gray-400">Great work. Your progress has been saved.</p>
            </div>
          </div>
        )}
      </div>

      {activeExercise && (
        <SetLoggingModal
          exercise={activeExercise}
          setNumber={activeSetNumber}
          totalSets={activeExercise.sets}
          onLog={handleLogSet}
          onCancel={() => {
            setActiveExercise(null);
            setActiveSetNumber(null);
          }}
          techMode={techMode}
        />
      )}

      {showRestTimer && (
        <RestTimer
          duration={currentRestDuration}
          onComplete={() => setShowRestTimer(false)}
          onSkip={() => setShowRestTimer(false)}
        />
      )}

      <PRCelebration
        show={showPRCelebration}
        exercise={prData.exercise}
        newPR={prData.newPR}
        previousPR={prData.previousPR}
        onClose={() => {
          setShowPRCelebration(false);
          setCurrentRestDuration(90);
          setShowRestTimer(true);
        }}
      />

      {/* Live Encouragement System - hidden during rest timer and modals */}
      <LiveEncouragement
        isActive={!workoutComplete && !showRestTimer && !activeExercise && !showPRCelebration}
        onSetComplete={setCompleteTrigger}
        currentExercise={activeExercise}
        userSettings={socialSettings}
      />
    </div>
  );
};

export default Workout;
