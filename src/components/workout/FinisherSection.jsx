import { useState } from 'react';
import { Check, Info, Play, Star, ChevronDown, ChevronUp } from 'lucide-react';
import VideoModal from './VideoModal';

const FinisherExercise = ({ exercise, index, isComplete, onToggleComplete, onShowVideo }) => {
  return (
    <div
      className={`bg-carbon-800/30 rounded-xl p-4 border transition-all ${
        isComplete
          ? 'border-gold-500/30 bg-gold-500/5'
          : 'border-carbon-700/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span
            className="w-7 h-7 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-lg flex items-center justify-center text-gold-400 font-bold text-xs border border-gold-500/30"
            aria-hidden="true"
          >
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm">{exercise.name}</h4>
            <p className="text-gold-400/80 text-xs">{exercise.prescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {exercise.videoId && (
            <button
              onClick={() => onShowVideo(exercise.videoId)}
              className="p-2 bg-carbon-700/50 rounded-lg text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label={`Watch demo for ${exercise.name}`}
            >
              <Play size={16} />
            </button>
          )}
          <button
            onClick={() => onToggleComplete(exercise.id)}
            className={`w-10 h-10 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center justify-center ${
              isComplete
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'bg-carbon-700 text-gray-400 hover:bg-carbon-600 active:scale-95'
            }`}
            aria-label={isComplete ? `${exercise.name} completed` : `Mark ${exercise.name} as complete`}
          >
            {isComplete ? <Check size={18} /> : <Check size={18} className="opacity-30" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const FinisherSection = ({ exercises, onComplete }) => {
  const [completedExercises, setCompletedExercises] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const handleToggleComplete = (exerciseId) => {
    setCompletedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      }
      const newCompleted = [...prev, exerciseId];
      // Check if all exercises are complete
      if (newCompleted.length === exercises.length && onComplete) {
        onComplete();
      }
      return newCompleted;
    });
  };

  const handleShowVideo = (vid) => {
    if (vid) {
      setVideoId(vid);
      setShowVideoModal(true);
    }
  };

  const allComplete = completedExercises.length === exercises.length;
  const progress = exercises.length > 0 ? (completedExercises.length / exercises.length) * 100 : 0;

  return (
    <>
      <div className="bg-gradient-to-br from-gold-500/10 to-carbon-800/50 rounded-2xl border border-gold-500/20 overflow-hidden mb-4">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gold-500/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-inset"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-gold-600/30 rounded-xl flex items-center justify-center border border-gold-500/30">
              <Star className="text-gold-400" size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-gold-400 font-bold text-sm uppercase tracking-wide">Finisher / Accessory</h3>
              <p className="text-gray-400 text-xs">
                {completedExercises.length} of {exercises.length} complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {allComplete && (
              <span className="bg-gold-500/20 text-gold-400 text-xs px-2 py-1 rounded-full font-semibold">
                Done
              </span>
            )}
            {expanded ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </div>
        </button>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div
            className="h-1 bg-carbon-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Exercise list */}
        {expanded && (
          <div className="p-4 pt-2 space-y-3">
            {exercises.map((exercise, i) => (
              <FinisherExercise
                key={exercise.id}
                exercise={exercise}
                index={i + 1}
                isComplete={completedExercises.includes(exercise.id)}
                onToggleComplete={handleToggleComplete}
                onShowVideo={handleShowVideo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && videoId && (
        <VideoModal
          videoId={videoId}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </>
  );
};

export default FinisherSection;
