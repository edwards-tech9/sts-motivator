import { useState } from 'react';
import { X, Play, Info, AlertTriangle, CheckCircle, Target, Clock, Dumbbell } from 'lucide-react';
import { getExercise, muscleGroups } from '../../data/exercises';

const ExerciseInfoModal = ({ exerciseName, onClose, onWatchVideo }) => {
  const [activeTab, setActiveTab] = useState('how-to');
  const exercise = getExercise(exerciseName);

  if (!exercise) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full">
          <p className="text-white text-center">Exercise information not available</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gold-500 text-carbon-900 py-3 rounded-xl font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'how-to', label: 'How To', icon: Info },
    { id: 'tips', label: 'Tips', icon: CheckCircle },
    { id: 'mistakes', label: 'Avoid', icon: AlertTriangle },
  ];

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="exercise-modal-title"
    >
      <div className="bg-carbon-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-carbon-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-carbon-700 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="pr-10">
            <h2
              id="exercise-modal-title"
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {exercise.name}
            </h2>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
              <span className="px-3 py-1 bg-carbon-700 rounded-full text-xs text-gray-400">
                {exercise.category}
              </span>
              <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-semibold border border-gold-500/30">
                +{exercise.xpValue} XP
              </span>
            </div>
          </div>

          {/* Video Button */}
          <button
            onClick={() => onWatchVideo(exercise.videoId)}
            className="w-full bg-gold-gradient text-carbon-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-gold"
          >
            <Play size={20} fill="currentColor" />
            Watch Demo Video
          </button>
        </div>

        {/* Muscle Groups */}
        <div className="px-6 py-4 border-b border-carbon-700">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-gold-400" />
            <span className="text-sm text-gray-400 font-semibold">Target Muscles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exercise.primaryMuscles.map(muscle => (
              <span
                key={muscle}
                className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-semibold border border-gold-500/30"
              >
                {muscleGroups[muscle]?.icon} {muscleGroups[muscle]?.name || muscle}
              </span>
            ))}
            {exercise.secondaryMuscles.map(muscle => (
              <span
                key={muscle}
                className="px-3 py-1 bg-carbon-700 text-gray-400 rounded-full text-xs"
              >
                {muscleGroups[muscle]?.name || muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="px-6 py-3 border-b border-carbon-700">
          <div className="flex items-center gap-2">
            <Dumbbell size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">
              Equipment: <span className="text-white">{exercise.equipment.join(', ')}</span>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-carbon-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-gold-400 border-b-2 border-gold-400 bg-gold-500/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'how-to' && (
            <ol className="space-y-3">
              {exercise.instructions.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-6 h-6 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-300 text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          )}

          {activeTab === 'tips' && (
            <ul className="space-y-3">
              {exercise.tips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'mistakes' && (
            <ul className="space-y-3">
              {exercise.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex gap-3">
                  <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-carbon-700">
          <button
            onClick={onClose}
            className="w-full bg-carbon-700 text-white py-3 rounded-xl font-semibold hover:bg-carbon-600 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInfoModal;
