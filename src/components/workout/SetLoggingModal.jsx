import { useState } from 'react';
import { Minus, Plus, Camera, Info, Play, X } from 'lucide-react';
import useEscapeKey from '../../hooks/useEscapeKey';
import { getExercise } from '../../data/exercises';

const SetLoggingModal = ({ exercise, setNumber, totalSets, onLog, onCancel, techMode }) => {
  const [weight, setWeight] = useState(exercise.lastWeight);
  const [reps, setReps] = useState(exercise.lastReps[setNumber - 1] || 10);
  const [rpe, setRpe] = useState(7);
  const [showVideo, setShowVideo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const exerciseData = getExercise(exercise.name);

  // Allow escape key to cancel
  useEscapeKey(onCancel);

  return (
    <div
      className="fixed inset-0 bg-black/95 flex flex-col z-50 overflow-auto"
      role="dialog"
      aria-labelledby="set-logging-title"
    >
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h2
            id="set-logging-title"
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            {exercise.name.toUpperCase()}
          </h2>
          <p className="text-gray-400 mb-3">Set {setNumber} of {totalSets}</p>

          {/* Info and Video Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-2 px-4 py-2 bg-carbon-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-carbon-600 transition-colors"
            >
              <Info size={16} />
              <span className="text-sm">Info</span>
            </button>
            <button
              onClick={() => exerciseData?.videoId && setShowVideo(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                exerciseData?.videoId
                  ? 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                  : 'bg-carbon-700/50 text-gray-500'
              }`}
            >
              <Play size={16} fill={exerciseData?.videoId ? 'currentColor' : 'none'} />
              <span className="text-sm">Demo</span>
            </button>
          </div>
        </div>

        <div className="bg-carbon-800/50 rounded-2xl p-4 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Target</p>
          <p className="text-white text-lg">{exercise.reps} reps @ {exercise.lastWeight} lbs</p>
          {techMode && <p className="text-gray-500 text-sm mt-1">Tempo: {exercise.tempo} · Rest: {exercise.rest}s</p>}
        </div>

        <div className="bg-carbon-800/30 rounded-2xl p-4 mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Last Time</p>
          <p className="text-gray-300">Set {setNumber}: {exercise.lastReps[setNumber - 1] || '-'} reps @ {exercise.lastWeight} lbs</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label id="weight-label" className="block text-gray-400 text-sm uppercase tracking-wide mb-3">Weight</label>
            <div className="bg-carbon-800 rounded-2xl p-4" role="group" aria-labelledby="weight-label">
              <div className="text-center">
                <span className="text-5xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{weight}</span>
                <span className="text-gray-400 ml-2">lbs</span>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setWeight(w => Math.max(0, w - 5))}
                  className="bg-carbon-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="Decrease weight by 5 lbs"
                >
                  <Minus size={20} />
                </button>
                <button
                  onClick={() => setWeight(w => w + 5)}
                  className="bg-carbon-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="Increase weight by 5 lbs"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label id="reps-label" className="block text-gray-400 text-sm uppercase tracking-wide mb-3">Reps</label>
            <div className="bg-carbon-800 rounded-2xl p-4" role="group" aria-labelledby="reps-label">
              <div className="text-center">
                <span className="text-5xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{reps}</span>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setReps(r => Math.max(0, r - 1))}
                  className="bg-carbon-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="Decrease reps by 1"
                >
                  <Minus size={20} />
                </button>
                <button
                  onClick={() => setReps(r => r + 1)}
                  className="bg-carbon-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
                  aria-label="Increase reps by 1"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {techMode && (
          <div className="mb-8">
            <label id="rpe-label" className="block text-gray-400 text-sm uppercase tracking-wide mb-3">RPE</label>
            <div className="flex justify-between bg-carbon-800 rounded-2xl p-3" role="radiogroup" aria-labelledby="rpe-label">
              {[6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRpe(value)}
                  role="radio"
                  aria-checked={rpe === value}
                  className={`w-12 h-12 rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    rpe === value
                      ? 'bg-gold-gradient text-carbon-900 scale-110'
                      : 'bg-carbon-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          disabled
          className="w-full bg-carbon-800 text-gray-500 py-4 rounded-2xl flex items-center justify-center gap-3 mb-4 cursor-not-allowed opacity-60"
          aria-label="Record form check video (coming soon)"
          title="Form check recording coming soon"
        >
          <Camera size={20} aria-hidden="true" />
          Record Form Check
          <span className="text-xs bg-carbon-700 px-2 py-0.5 rounded-full">Soon</span>
        </button>
      </div>

      <div className="p-6 bg-carbon-900/80 backdrop-blur-lg border-t border-slate-800">
        <button
          onClick={() => onLog({ weight, reps, rpe })}
          className="w-full bg-gold-gradient text-carbon-900 font-bold py-5 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-gold-500/30 mb-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-900"
        >
          ✓ LOG SET
        </button>
        <button
          onClick={onCancel}
          className="w-full text-gray-400 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-xl"
        >
          Cancel
        </button>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
          <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
              <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-carbon-700 rounded-xl">
                <X className="text-gray-400" size={20} />
              </button>
            </div>

            {exerciseData?.primaryMuscles?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {exerciseData.primaryMuscles.map((muscle, i) => (
                  <span key={i} className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full capitalize">
                    {muscle}
                  </span>
                ))}
              </div>
            )}

            {exerciseData?.instructions?.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-gray-400 text-sm font-semibold">Instructions:</p>
                <ol className="space-y-1">
                  {exerciseData.instructions.map((step, i) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-gold-400 font-semibold">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {exerciseData?.tips?.length > 0 && (
              <div className="bg-gold-500/10 rounded-xl p-3 mb-4">
                <p className="text-gold-400 text-sm font-semibold mb-1">Tips:</p>
                <ul className="space-y-1">
                  {exerciseData.tips.map((tip, i) => (
                    <li key={i} className="text-gray-300 text-sm">• {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && exerciseData?.videoId && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-end mb-4">
              <button onClick={() => setShowVideo(false)} className="p-2 hover:bg-carbon-800 rounded-xl">
                <X className="text-gray-400" size={24} />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${exerciseData.videoId}?rel=0&autoplay=1`}
                title={exercise.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetLoggingModal;
