import { useState, useEffect } from 'react';
import { Target, Trophy, Clock, Plus, Check, Info, Play, X, ChevronDown, ChevronUp, Dumbbell, Zap } from 'lucide-react';
import { getGamificationState, recordChallengeExercise, getWeeklyChallengeLog } from '../../services/gamificationService';
import { getCurrentWeeklyChallenge, WEEKLY_CHALLENGES } from '../../data/gamification';
import { exerciseDatabase, getExercisesByCategory } from '../../data/exercises';

// Exercise categories that map to challenge types
const CHALLENGE_EXERCISES = {
  upper_body: [
    'Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Dumbbell Shoulder Press',
    'Barbell Row', 'Lat Pulldown', 'Seated Cable Row', 'Pull-ups', 'Chin-ups',
    'Dumbbell Curl', 'Hammer Curl', 'Tricep Pushdown', 'Skull Crushers',
    'Lateral Raise', 'Face Pull', 'Rear Delt Fly', 'Cable Fly'
  ],
  leg_day: [
    'Back Squat', 'Front Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl',
    'Leg Extension', 'Bulgarian Split Squat', 'Lunges', 'Hip Thrust',
    'Calf Raise', 'Seated Calf Raise', 'Goblet Squat', 'Sumo Deadlift'
  ],
  compound_king: [
    'Back Squat', 'Front Squat', 'Deadlift', 'Romanian Deadlift', 'Sumo Deadlift',
    'Bench Press', 'Incline Bench Press', 'Overhead Press', 'Barbell Row',
    'Pull-ups', 'Chin-ups', 'Hip Thrust', 'Lunges', 'Bulgarian Split Squat'
  ],
};

// Get exercises for current challenge
const getChallengeExercises = (challengeId) => {
  const exerciseNames = CHALLENGE_EXERCISES[challengeId] || [];
  return exerciseNames.map(name => {
    const dbExercise = exerciseDatabase[name];
    return dbExercise || {
      name,
      videoId: null,
      primaryMuscles: [],
      instructions: []
    };
  });
};

// Exercise Info Modal
const ExerciseInfoModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-carbon-700 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {exercise.primaryMuscles?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {exercise.primaryMuscles.map((muscle, i) => (
              <span key={i} className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full capitalize">
                {muscle}
              </span>
            ))}
          </div>
        )}

        {exercise.instructions?.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-semibold">Instructions:</p>
            <ol className="space-y-1">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-gold-400 font-semibold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Video Modal
const VideoModal = ({ exercise, onClose }) => {
  if (!exercise?.videoId) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">{exercise.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={24} />
          </button>
        </div>
        <div className="aspect-video bg-black rounded-2xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0&autoplay=1`}
            title={exercise.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

// Log Exercise Modal
const LogExerciseModal = ({ exercise, onLog, onClose }) => {
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const handleSubmit = () => {
    onLog({
      exerciseName: exercise.name,
      sets,
      reps,
      weight,
      volume: sets * reps * weight,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Log Exercise</h3>
          <button onClick={onClose} className="p-2 hover:bg-carbon-700 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <p className="text-gold-400 font-semibold mb-4">{exercise.name}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Sets</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white text-center text-xl font-bold"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Reps per set</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white text-center text-xl font-bold"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Weight (lbs)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white text-center text-xl font-bold"
              min="0"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-carbon-900/50 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Sets:</span>
            <span className="text-white font-bold">{sets}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Volume:</span>
            <span className="text-gold-400 font-bold">{(sets * reps * weight).toLocaleString()} lbs</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Log {sets} Sets
        </button>
      </div>
    </div>
  );
};

// Add Custom Exercise Modal
const AddCustomExerciseModal = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      exerciseName: name.trim(),
      sets,
      reps,
      weight,
      volume: sets * reps * weight,
      isCustom: true,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Add Custom Exercise</h3>
          <button onClick={onClose} className="p-2 hover:bg-carbon-700 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Exercise Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dumbbell Fly"
              className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-2">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-2 px-2 text-white text-center font-bold"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-2 px-2 text-white text-center font-bold"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-2">Weight</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-carbon-900 border border-carbon-700 rounded-xl py-2 px-2 text-white text-center font-bold"
                min="0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Exercise
        </button>
      </div>
    </div>
  );
};

// Main Weekly Challenge Component
const WeeklyChallenge = () => {
  const [state, setState] = useState(() => getGamificationState());
  const [challenge] = useState(() => getCurrentWeeklyChallenge());
  const [exercisesExpanded, setExercisesExpanded] = useState(false);
  const [loggedExercises, setLoggedExercises] = useState([]);
  const [showInfoExercise, setShowInfoExercise] = useState(null);
  const [showVideoExercise, setShowVideoExercise] = useState(null);
  const [showLogModal, setShowLogModal] = useState(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [xpGained, setXpGained] = useState(null);

  // Load logged exercises from localStorage
  useEffect(() => {
    const log = getWeeklyChallengeLog();
    setLoggedExercises(log);
  }, []);

  const progress = state.weeklyChallenge?.progress || 0;
  const completed = state.weeklyChallenge?.completed || false;
  const percentage = Math.min(100, Math.round((progress / challenge.target) * 100));

  // Calculate days remaining
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysRemaining = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  // Check if challenge type has exercises to log
  const hasExerciseList = ['upper_body', 'leg_day', 'compound_king'].includes(challenge.id);
  const availableExercises = hasExerciseList ? getChallengeExercises(challenge.id) : [];

  // Handle logging an exercise
  const handleLogExercise = (exerciseData) => {
    const result = recordChallengeExercise(challenge.id, exerciseData);

    // Update local state
    setLoggedExercises(prev => [...prev, exerciseData]);
    setState(getGamificationState());

    // Show XP gained animation
    if (result.xpGained) {
      setXpGained(result.xpGained);
      setTimeout(() => setXpGained(null), 2000);
    }
  };

  // Calculate logged sets today
  const loggedSetsToday = loggedExercises
    .filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + e.sets, 0);

  return (
    <>
      <div className={`rounded-2xl border overflow-hidden ${
        completed
          ? 'bg-gold-500/10 border-gold-500/30'
          : 'bg-carbon-800/50 border-carbon-700'
      }`}>
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                completed ? 'bg-gold-500' : 'bg-carbon-700'
              }`}>
                {completed ? (
                  <Trophy size={24} className="text-carbon-900" />
                ) : (
                  <Target size={24} className="text-gold-400" />
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Weekly Challenge</p>
                <h3 className="text-white font-bold text-lg">{challenge.name}</h3>
              </div>
            </div>
            {!completed && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock size={14} />
                <span>{daysRemaining}d left</span>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">
                {progress.toLocaleString()} / {challenge.target.toLocaleString()} {challenge.unit}
              </span>
              <span className={completed ? 'text-gold-400 font-semibold' : 'text-gray-400'}>
                {percentage}%
              </span>
            </div>
            <div className="h-3 bg-carbon-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completed
                    ? 'bg-gradient-to-r from-gold-500 to-gold-300'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Today's Progress */}
          {hasExerciseList && !completed && (
            <div className="flex items-center justify-between p-3 bg-carbon-900/50 rounded-xl mb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="text-gold-400" size={16} />
                <span className="text-gray-400 text-sm">Logged Today:</span>
              </div>
              <span className="text-white font-bold">{loggedSetsToday} sets</span>
            </div>
          )}

          {/* Reward */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${
            completed ? 'bg-gold-500/20' : 'bg-carbon-900/50'
          }`}>
            <span className={completed ? 'text-gold-400' : 'text-gray-400'}>
              {completed ? 'Reward Claimed!' : 'Reward:'}
            </span>
            <span className={`font-bold ${completed ? 'text-gold-400' : 'text-white'}`}>
              +{challenge.xpReward} XP
            </span>
          </div>

          {completed && (
            <p className="text-center text-gold-400 text-sm mt-3 font-semibold">
              Challenge Completed!
            </p>
          )}
        </div>

        {/* Exercise List Section - Only for applicable challenges */}
        {hasExerciseList && !completed && (
          <>
            <button
              onClick={() => setExercisesExpanded(!exercisesExpanded)}
              className="w-full flex items-center justify-between px-5 py-3 bg-carbon-900/30 border-t border-carbon-700 hover:bg-carbon-900/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="text-gold-400" size={18} />
                <span className="text-white font-semibold text-sm">Log Exercises</span>
                <span className="text-gray-500 text-xs">({availableExercises.length} available)</span>
              </div>
              {exercisesExpanded ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>

            {exercisesExpanded && (
              <div className="px-5 pb-5 pt-3 space-y-2 max-h-80 overflow-y-auto">
                {availableExercises.map((exercise, i) => {
                  const isLogged = loggedExercises.some(
                    e => e.exerciseName === exercise.name &&
                    new Date(e.timestamp).toDateString() === new Date().toDateString()
                  );

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isLogged ? 'bg-green-500/10 border border-green-500/30' : 'bg-carbon-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isLogged ? (
                          <Check className="text-green-400" size={18} />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-carbon-700 flex items-center justify-center text-xs text-gray-400">
                            {i + 1}
                          </span>
                        )}
                        <span className={isLogged ? 'text-green-400' : 'text-gray-300'}>
                          {exercise.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Info Button */}
                        <button
                          onClick={() => setShowInfoExercise(exercise)}
                          className="p-1.5 rounded-lg bg-carbon-700 hover:bg-carbon-600 transition-colors"
                        >
                          <Info size={14} className="text-gray-400" />
                        </button>

                        {/* Video Button */}
                        {exercise.videoId && (
                          <button
                            onClick={() => setShowVideoExercise(exercise)}
                            className="p-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 transition-colors"
                          >
                            <Play size={14} className="text-gold-400" fill="currentColor" />
                          </button>
                        )}

                        {/* Log Button */}
                        <button
                          onClick={() => setShowLogModal(exercise)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isLogged
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gold-500/20 hover:bg-gold-500/30 text-gold-400'
                          }`}
                        >
                          {isLogged ? 'Logged' : 'Log'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add Custom Exercise Button */}
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-carbon-700 rounded-xl text-gray-400 hover:border-gold-500/50 hover:text-gold-400 transition-colors"
                >
                  <Plus size={18} />
                  <span className="font-semibold">Add Other Exercise</span>
                </button>

                {/* Logged Exercises Today */}
                {loggedExercises.filter(e =>
                  new Date(e.timestamp).toDateString() === new Date().toDateString()
                ).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-carbon-700">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Logged Today</p>
                    <div className="space-y-2">
                      {loggedExercises
                        .filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString())
                        .map((entry, i) => (
                          <div key={i} className="flex items-center justify-between text-sm p-2 bg-carbon-900/30 rounded-lg">
                            <span className="text-gray-300">
                              {entry.exerciseName}
                              {entry.isCustom && <span className="text-gray-500 text-xs ml-1">(custom)</span>}
                            </span>
                            <span className="text-gold-400 font-semibold">
                              {entry.sets} sets × {entry.reps} reps
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* XP Gained Animation */}
      {xpGained && (
        <div className="fixed top-20 right-4 bg-gold-500 text-carbon-900 font-bold px-4 py-2 rounded-full animate-bounce flex items-center gap-2 z-50">
          <Zap size={18} />
          +{xpGained} XP
        </div>
      )}

      {/* Modals */}
      {showInfoExercise && (
        <ExerciseInfoModal
          exercise={showInfoExercise}
          onClose={() => setShowInfoExercise(null)}
        />
      )}

      {showVideoExercise && (
        <VideoModal
          exercise={showVideoExercise}
          onClose={() => setShowVideoExercise(null)}
        />
      )}

      {showLogModal && (
        <LogExerciseModal
          exercise={showLogModal}
          onLog={handleLogExercise}
          onClose={() => setShowLogModal(null)}
        />
      )}

      {showAddCustom && (
        <AddCustomExerciseModal
          onAdd={handleLogExercise}
          onClose={() => setShowAddCustom(false)}
        />
      )}
    </>
  );
};

export default WeeklyChallenge;
