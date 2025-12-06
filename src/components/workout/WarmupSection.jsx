import { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronDown, Play, Check, Timer, Pause, RotateCcw, Info, X, Video } from 'lucide-react';

// Parse prescription to get duration in seconds (e.g., "2×30s" -> 60, "2×10 each" -> 60)
const parseDuration = (prescription) => {
  // Check for "2×30s" format (sets × seconds)
  const setsSecsMatch = prescription.match(/(\d+)\s*[×x]\s*(\d+)\s*s\b/i);
  if (setsSecsMatch) {
    const sets = parseInt(setsSecsMatch[1]);
    const secs = parseInt(setsSecsMatch[2]);
    return sets * secs;
  }

  // Check for explicit seconds (e.g., "30 sec", "30s")
  const secMatch = prescription.match(/(\d+)\s*s(?:ec)?/i);
  if (secMatch) return parseInt(secMatch[1]);

  // Check for reps format (e.g., "2×10 each side" - estimate 3 sec per rep)
  const repMatch = prescription.match(/(\d+)\s*[×x]\s*(\d+)/i);
  if (repMatch) {
    const sets = parseInt(repMatch[1]);
    const reps = parseInt(repMatch[2]);
    // Check if "each side" doubles it
    const eachSide = prescription.toLowerCase().includes('each');
    return sets * reps * 3 * (eachSide ? 2 : 1);
  }

  // Check for just reps (e.g., "10 reps")
  const justReps = prescription.match(/(\d+)\s*reps?/i);
  if (justReps) return parseInt(justReps[1]) * 3;

  // Default to 30 seconds
  return 30;
};

// Warmup Timer Modal with actual countdown
const WarmupTimerModal = ({ exercise, onComplete, onSkip }) => {
  const initialTime = parseDuration(exercise.prescription);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Auto-complete when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && hasStarted) {
      // Small delay so user sees "0:00" before completing
      const completeTimer = setTimeout(onComplete, 500);
      return () => clearTimeout(completeTimer);
    }
  }, [timeLeft, hasStarted, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleDoneEarly = () => {
    onComplete();
  };

  // Format time as M:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-sm w-full text-center">
        {/* Timer Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-carbon-700"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FCD34D" />
              </linearGradient>
            </defs>
          </svg>
          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-mono font-bold ${timeLeft === 0 ? 'text-green-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>
        <p className="text-gold-400 text-lg font-mono mb-6">{exercise.prescription}</p>

        <div className="space-y-3">
          {!hasStarted ? (
            // Initial state - show Start button
            <button
              onClick={handleStart}
              className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Play size={20} fill="currentColor" />
              Start Exercise
            </button>
          ) : timeLeft > 0 ? (
            // Running state - show Pause/Resume and Done Early
            <div className="flex gap-3">
              <button
                onClick={isRunning ? handlePause : handleStart}
                className="flex-1 bg-carbon-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-carbon-600 transition-colors"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={handleDoneEarly}
                className="flex-1 bg-green-500/20 text-green-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors"
              >
                <Check size={20} />
                Done
              </button>
            </div>
          ) : (
            // Completed state
            <button
              onClick={onComplete}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Complete!
            </button>
          )}

          <div className="flex gap-3">
            {hasStarted && (
              <button
                onClick={handleReset}
                className="flex-1 bg-carbon-700 text-gray-300 font-semibold py-3 rounded-xl hover:bg-carbon-600 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            )}
            <button
              onClick={onSkip}
              className={`${hasStarted ? 'flex-1' : 'w-full'} bg-carbon-700 text-gray-300 font-semibold py-3 rounded-xl hover:bg-carbon-600 transition-colors`}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exercise Info Modal
const ExerciseInfoModal = ({ exercise, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="text-gold-400" size={20} />
            <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-carbon-700 rounded-xl transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {exercise.focus && (
          <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full mb-3">
            {exercise.focus}
          </span>
        )}

        <div className="bg-carbon-900/50 rounded-xl p-4 mb-4">
          <p className="text-gold-400 font-mono text-lg mb-1">{exercise.prescription}</p>
        </div>

        {exercise.description ? (
          <p className="text-gray-300 leading-relaxed">{exercise.description}</p>
        ) : (
          <p className="text-gray-500 italic">No description available for this exercise.</p>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// Video Modal
const VideoModal = ({ exercise, onClose }) => {
  if (!exercise.videoId) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full text-center">
          <Video className="text-gray-600 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-bold text-white mb-2">No Video Available</h3>
          <p className="text-gray-400 mb-6">A video demo hasn't been set for this exercise yet.</p>
          <button
            onClick={onClose}
            className="w-full bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-carbon-800 rounded-xl transition-colors"
          >
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
        <p className="text-gold-400 text-center mt-4 font-mono">{exercise.prescription}</p>
      </div>
    </div>
  );
};

// Main Warmup Section
const WarmupSection = ({ exercises, expanded, onToggle }) => {
  const [warmupStarted, setWarmupStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showTimer, setShowTimer] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [showVideo, setShowVideo] = useState(null);

  const handleStartWarmup = () => {
    setWarmupStarted(true);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setShowTimer(true);
  };

  const handleCompleteExercise = () => {
    setCompletedExercises(prev => [...prev, currentExerciseIndex]);
    setShowTimer(false);

    // Move to next exercise or finish (slower transition - 1.5 seconds)
    if (currentExerciseIndex < exercises.length - 1) {
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
        setShowTimer(true);
      }, 1500);
    } else {
      // Warmup complete
      setWarmupStarted(false);
    }
  };

  const handleSkipExercise = () => {
    setShowTimer(false);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeout(() => setShowTimer(true), 1000);
    } else {
      setWarmupStarted(false);
    }
  };

  const allComplete = completedExercises.length === exercises.length;

  return (
    <>
      <div className="bg-gradient-to-r from-gold-500/10 to-gold-300/10 border border-gold-500/30 rounded-2xl mb-6 overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full p-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-inset"
          aria-expanded={expanded}
          aria-controls="warmup-content"
        >
          <div className="flex items-center gap-3">
            <Flame className="text-gold-400" size={24} aria-hidden="true" />
            <span className="text-white font-bold">WARM-UP</span>
            {allComplete && (
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                Complete
              </span>
            )}
          </div>
          <ChevronDown
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {expanded && (
          <div id="warmup-content" className="px-5 pb-5 space-y-3">
            {exercises.map((ex, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 transition-colors ${
                  completedExercises.includes(i)
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-carbon-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {completedExercises.includes(i) ? (
                      <Check className="text-green-400" size={18} />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-carbon-700 flex items-center justify-center text-xs text-gray-400">
                        {i + 1}
                      </span>
                    )}
                    <div>
                      <span className={completedExercises.includes(i) ? 'text-green-400' : 'text-gray-300'}>
                        {ex.name}
                      </span>
                      {ex.focus && (
                        <span className="ml-2 text-xs text-gray-500">({ex.focus})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm ${completedExercises.includes(i) ? 'text-green-400' : 'text-gold-400'}`}>
                      {ex.prescription}
                    </span>
                    {/* Info Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(ex);
                      }}
                      className="p-1.5 rounded-lg bg-carbon-700 hover:bg-carbon-600 transition-colors"
                      aria-label={`Info for ${ex.name}`}
                    >
                      <Info size={14} className="text-gray-400" />
                    </button>
                    {/* Video Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVideo(ex);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        ex.videoId
                          ? 'bg-gold-500/20 hover:bg-gold-500/30'
                          : 'bg-carbon-700 hover:bg-carbon-600'
                      }`}
                      aria-label={`Video for ${ex.name}`}
                    >
                      <Play size={14} className={ex.videoId ? 'text-gold-400' : 'text-gray-500'} fill={ex.videoId ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!allComplete ? (
              <button
                onClick={handleStartWarmup}
                className="w-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                {warmupStarted ? 'Continue Warm-up' : 'Start Warm-up'}
              </button>
            ) : (
              <div className="w-full bg-green-500/20 text-green-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                <Check size={18} />
                Warm-up Complete!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timer Modal */}
      {showTimer && exercises[currentExerciseIndex] && (
        <WarmupTimerModal
          exercise={exercises[currentExerciseIndex]}
          onComplete={handleCompleteExercise}
          onSkip={handleSkipExercise}
        />
      )}

      {/* Info Modal */}
      {showInfo && (
        <ExerciseInfoModal
          exercise={showInfo}
          onClose={() => setShowInfo(null)}
        />
      )}

      {/* Video Modal */}
      {showVideo && (
        <VideoModal
          exercise={showVideo}
          onClose={() => setShowVideo(null)}
        />
      )}
    </>
  );
};

export default WarmupSection;
