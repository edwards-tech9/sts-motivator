import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import ExerciseCard from '../components/workout/ExerciseCard';
import WarmupSection from '../components/workout/WarmupSection';
import SetLoggingModal from '../components/workout/SetLoggingModal';
import RestTimer from '../components/workout/RestTimer';
import PRCelebration from '../components/workout/PRCelebration';
import { saveWorkout, savePR, getPRs } from '../services/localStorage';

// Sample workout data (this would come from the assigned program)
const mockExercises = [
  { id: 1, name: 'DB Good Morning', sets: 4, reps: '8-10', tempo: '2112', rest: 90, lastWeight: 25, lastReps: [10, 10, 10, 10], muscleGroups: ['Hamstrings', 'Lower Back'] },
  { id: 2, name: 'Split Stance DB RDL', sets: 3, reps: '6-10', tempo: '3111', rest: 90, lastWeight: 25, lastReps: [10, 10, 10], muscleGroups: ['Hamstrings', 'Glutes'] },
  { id: 3, name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', tempo: '11x1', rest: 60, lastWeight: 30, lastReps: [12, 11, 10], muscleGroups: ['Quads', 'Glutes'] },
  { id: 4, name: 'Leg Press', sets: 4, reps: '12-15', tempo: '2010', rest: 90, lastWeight: 180, lastReps: [15, 14, 13, 12], muscleGroups: ['Quads', 'Glutes'] },
  { id: 5, name: 'Seated Calf Raise', sets: 3, reps: '15-20', tempo: '2111', rest: 45, lastWeight: 90, lastReps: [20, 18, 15], muscleGroups: ['Calves'] },
];

const warmupExercises = [
  { name: 'Ankle Stretch w/ KB', prescription: '2×30s' },
  { name: '90/90 Breathing', prescription: '2×10' },
  { name: 'T-Spine Rotation', prescription: '2×10' },
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

  const handleStartSet = (exercise, setNum) => {
    setActiveExercise(exercise);
    setActiveSetNumber(setNum);
  };

  const handleLogSet = (data) => {
    const exerciseId = activeExercise.id;
    const setIndex = activeSetNumber - 1;

    // Track completed sets
    setCompletedSets((prev) => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), setIndex],
    }));

    // Track logged data
    setLoggedSets((prev) => ({
      ...prev,
      [exerciseId]: [
        ...(prev[exerciseId] || []),
        { setNum: activeSetNumber, ...data },
      ],
    }));

    // Check for PR
    const currentPRs = getPRs('demo');
    const exercisePR = currentPRs[activeExercise.name]?.weight || activeExercise.lastWeight;

    if (data.weight > exercisePR) {
      // Save new PR
      savePR('demo', activeExercise.name, data.weight, data.reps);
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

  // Save workout when complete
  const handleFinishWorkout = () => {
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
      completed: true,
    };

    saveWorkout(workout);
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
    <div className="min-h-screen bg-gradient-to-b from-carbon-900 via-carbon-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onExit}
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

        {mockExercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={i + 1}
            completedSets={completedSets[exercise.id] || []}
            onStartSet={handleStartSet}
            techMode={techMode}
            isActive={activeExercise?.id === exercise.id}
          />
        ))}

        <div className="bg-carbon-800/30 rounded-2xl p-5 border border-carbon-700/50">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Finisher / Accessory</h3>
          <p className="text-gray-300">Assisted hip airplanes 2×10, rolling plank 2×20</p>
        </div>

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
    </div>
  );
};

export default Workout;
