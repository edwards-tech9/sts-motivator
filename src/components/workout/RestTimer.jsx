import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const RestTimer = ({ duration, onComplete, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const circumference = 2 * Math.PI * 120;
  const progress = ((duration - timeLeft) / duration) * circumference;

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    if (isPaused) return;

    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (amount) => {
    setTimeLeft(t => Math.max(0, t + amount));
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-carbon-900 to-slate-950 flex flex-col items-center justify-center z-40"
      role="dialog"
      aria-label="Rest timer"
    >
      <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">REST</p>

      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90" aria-hidden="true">
          <circle cx="140" cy="140" r="120" fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="140" cy="140" r="120" fill="none"
            stroke="url(#timerGradient)" strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-7xl font-black text-white"
            style={{ fontFamily: 'Oswald, sans-serif' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-12" role="group" aria-label="Timer controls">
        <button
          onClick={() => adjustTime(-15)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Subtract 15 seconds"
        >
          -15s
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={() => adjustTime(15)}
          className="bg-carbon-800 hover:bg-carbon-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Add 15 seconds"
        >
          +15s
        </button>
      </div>

      <button
        onClick={onSkip}
        className="bg-gold-gradient text-carbon-900 font-bold py-4 px-16 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-900"
      >
        SKIP REST
      </button>
    </div>
  );
};

export default RestTimer;
