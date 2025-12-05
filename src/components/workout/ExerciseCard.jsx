import { Check, Info, Play } from 'lucide-react';

const ExerciseCard = ({ exercise, index, completedSets, onStartSet, techMode, isActive }) => {
  const allSetsComplete = completedSets.length >= exercise.sets;

  return (
    <div
      className={`bg-carbon-800/50 rounded-2xl p-5 mb-4 border-2 transition-all ${
        isActive
          ? 'border-gold-500 shadow-lg shadow-gold-500/20'
          : allSetsComplete
          ? 'border-green-500/50 opacity-75'
          : 'border-transparent'
      }`}
      role="article"
      aria-label={`Exercise ${index}: ${exercise.name}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 bg-carbon-700 rounded-lg flex items-center justify-center text-gray-400 font-bold text-sm"
            aria-hidden="true"
          >
            {index}
          </span>
          <div>
            <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
            <p className="text-gray-400 text-sm">
              {exercise.sets} × {exercise.reps}
              {techMode && ` @ Tempo ${exercise.tempo}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 bg-carbon-700/50 rounded-lg text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
            aria-label={`Exercise info for ${exercise.name}`}
          >
            <Info size={18} />
          </button>
          <button
            className="p-2 bg-carbon-700/50 rounded-lg text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
            aria-label={`Watch demo video for ${exercise.name}`}
          >
            <Play size={18} />
          </button>
        </div>
      </div>

      <div className="bg-carbon-900/50 rounded-xl p-3 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Last Session</p>
        <p className="text-gray-300 text-sm">
          {exercise.lastWeight} lbs × {exercise.lastReps.join(', ')}
        </p>
      </div>

      {techMode && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-carbon-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Volume</p>
            <p className="text-white font-semibold">
              {exercise.lastWeight * exercise.sets * exercise.lastReps[0]} lbs
            </p>
          </div>
          <div className="bg-carbon-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Est. 1RM</p>
            <p className="text-white font-semibold">
              {Math.round(exercise.lastWeight * (1 + exercise.lastReps[0] / 30))} lbs
            </p>
          </div>
          <div className="bg-carbon-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Suggested</p>
            <p className="text-green-400 font-semibold">+5 lbs</p>
          </div>
        </div>
      )}

      <div className="flex gap-2" role="group" aria-label="Sets">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <button
            key={i}
            onClick={() => !completedSets.includes(i) && onStartSet(exercise, i + 1)}
            disabled={completedSets.includes(i)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
              completedSets.includes(i)
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-carbon-700 text-white hover:bg-slate-600 active:scale-95'
            }`}
            aria-label={completedSets.includes(i) ? `Set ${i + 1} completed` : `Start set ${i + 1}`}
          >
            {completedSets.includes(i) ? <Check size={18} className="mx-auto" aria-hidden="true" /> : `Set ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;
