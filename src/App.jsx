import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronRight, ChevronLeft, Plus, Minus, Check, Home, BarChart3, MessageSquare, ClipboardList, Settings, Users, Video, AlertTriangle, Trophy, Flame, Dumbbell, Target, TrendingUp, Bell, Menu, ChevronDown, Info, Camera } from 'lucide-react';

// ===== MOCK DATA =====
const mockExercises = [
  { id: 1, name: 'DB Good Morning', sets: 4, reps: '8-10', tempo: '2112', rest: 90, lastWeight: 25, lastReps: [10, 10, 10, 10], muscleGroups: ['Hamstrings', 'Lower Back'] },
  { id: 2, name: 'Split Stance DB RDL', sets: 3, reps: '6-10', tempo: '3111', rest: 90, lastWeight: 25, lastReps: [10, 10, 10], muscleGroups: ['Hamstrings', 'Glutes'] },
  { id: 3, name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', tempo: '11x1', rest: 60, lastWeight: 30, lastReps: [12, 11, 10], muscleGroups: ['Quads', 'Glutes'] },
  { id: 4, name: 'Leg Press', sets: 4, reps: '12-15', tempo: '2010', rest: 90, lastWeight: 180, lastReps: [15, 14, 13, 12], muscleGroups: ['Quads', 'Glutes'] },
  { id: 5, name: 'Seated Calf Raise', sets: 3, reps: '15-20', tempo: '2111', rest: 45, lastWeight: 90, lastReps: [20, 18, 15], muscleGroups: ['Calves'] },
];

const mockClients = [
  { id: 1, name: 'John Davidson', program: 'Strength 4x', sevenDay: 86, thirtyDay: 91, status: 'good', avatar: 'JD', goal: 'Strength', level: 'Intermediate', startDate: 'March 2024', prs: 3, gained: '12 lbs' },
  { id: 2, name: 'Emma Sullivan', program: 'Hypertrophy', sevenDay: 100, thirtyDay: 88, status: 'good', avatar: 'ES', goal: 'Muscle Gain', level: 'Advanced', startDate: 'Jan 2024', prs: 5, gained: '8 lbs' },
  { id: 3, name: 'Sarah Martinez', program: 'Fat Loss', sevenDay: 0, thirtyDay: 45, status: 'alert', avatar: 'SM', goal: 'Fat Loss', level: 'Beginner', startDate: 'Oct 2024', prs: 1, gained: '-15 lbs' },
  { id: 4, name: 'Jake Thompson', program: 'Athletic', sevenDay: 43, thirtyDay: 67, status: 'watch', avatar: 'JT', goal: 'Athletic Performance', level: 'Intermediate', startDate: 'Aug 2024', prs: 2, gained: '5 lbs' },
  { id: 5, name: 'Maria Lopez', program: 'General', sevenDay: 71, thirtyDay: 82, status: 'good', avatar: 'ML', goal: 'General Fitness', level: 'Intermediate', startDate: 'May 2024', prs: 4, gained: '3 lbs' },
];

const warmupExercises = [
  { name: 'Ankle Stretch w/ KB', prescription: '2×30s' },
  { name: '90/90 Breathing', prescription: '2×10' },
  { name: 'T-Spine Rotation', prescription: '2×10' },
];

// ===== CONFETTI COMPONENT =====
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2,
        color: ['#FFD700', '#FF6B35', '#00D4AA', '#FF3366', '#7C4DFF'][Math.floor(Math.random() * 5)],
        size: 6 + Math.random() * 8,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 3000);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// ===== PR CELEBRATION MODAL =====
const PRCelebration = ({ show, exercise, newPR, previousPR, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Confetti active={show} />
      <div className="text-center p-8">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h2 className="text-5xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>
          NEW PR!
        </h2>
        <p className="text-2xl text-orange-400 font-semibold mb-6">{exercise}</p>
        <p className="text-7xl font-black text-white mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {newPR} <span className="text-3xl text-gray-400">lbs</span>
        </p>
        <p className="text-gray-400 text-lg mb-8">
          Previous: {previousPR} lbs <span className="text-green-400">(+{newPR - previousPR} lbs)</span>
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-12 rounded-full text-lg hover:scale-105 transition-transform"
        >
          KEEP CRUSHING IT
        </button>
      </div>
    </div>
  );
};

// ===== REST TIMER COMPONENT =====
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
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center z-40">
      <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">REST</p>
      
      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
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
          <span className="text-7xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-12">
        <button onClick={() => adjustTime(-15)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">-15s</button>
        <button onClick={() => setIsPaused(!isPaused)} className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-colors">
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button onClick={() => adjustTime(15)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">+15s</button>
      </div>

      <button onClick={onSkip} className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-16 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-orange-500/30">
        SKIP REST
      </button>
    </div>
  );
};

// ===== SET LOGGING MODAL =====
const SetLoggingModal = ({ exercise, setNumber, totalSets, onLog, onCancel, techMode }) => {
  const [weight, setWeight] = useState(exercise.lastWeight);
  const [reps, setReps] = useState(exercise.lastReps[setNumber - 1] || 10);
  const [rpe, setRpe] = useState(7);

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col z-40 overflow-auto">
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>{exercise.name.toUpperCase()}</h2>
          <p className="text-gray-400">Set {setNumber} of {totalSets}</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-4 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Target</p>
          <p className="text-white text-lg">{exercise.reps} reps @ {exercise.lastWeight} lbs</p>
          {techMode && <p className="text-gray-500 text-sm mt-1">Tempo: {exercise.tempo} · Rest: {exercise.rest}s</p>}
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-4 mb-8">
          <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Last Time</p>
          <p className="text-gray-300">Set {setNumber}: {exercise.lastReps[setNumber - 1] || '-'} reps @ {exercise.lastWeight} lbs</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-400 text-sm uppercase tracking-wide mb-3">Weight</label>
            <div className="bg-slate-800 rounded-2xl p-4">
              <div className="text-center">
                <span className="text-5xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{weight}</span>
                <span className="text-gray-400 ml-2">lbs</span>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={() => setWeight(w => Math.max(0, w - 5))} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"><Minus size={20} /></button>
                <button onClick={() => setWeight(w => w + 5)} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"><Plus size={20} /></button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm uppercase tracking-wide mb-3">Reps</label>
            <div className="bg-slate-800 rounded-2xl p-4">
              <div className="text-center">
                <span className="text-5xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{reps}</span>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button onClick={() => setReps(r => Math.max(0, r - 1))} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"><Minus size={20} /></button>
                <button onClick={() => setReps(r => r + 1)} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors"><Plus size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        {techMode && (
          <div className="mb-8">
            <label className="block text-gray-400 text-sm uppercase tracking-wide mb-3">RPE</label>
            <div className="flex justify-between bg-slate-800 rounded-2xl p-3">
              {[6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRpe(value)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all ${rpe === value ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 py-4 rounded-2xl flex items-center justify-center gap-3 mb-4 transition-colors">
          <Camera size={20} />
          Record Form Check
        </button>
      </div>

      <div className="p-6 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800">
        <button onClick={() => onLog({ weight, reps, rpe })} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-5 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/30 mb-3">
          ✓ LOG SET
        </button>
        <button onClick={onCancel} className="w-full text-gray-400 py-3">Cancel</button>
      </div>
    </div>
  );
};

// ===== EXERCISE CARD =====
const ExerciseCard = ({ exercise, index, completedSets, onStartSet, techMode, isActive }) => {
  const allSetsComplete = completedSets.length >= exercise.sets;
  
  return (
    <div className={`bg-slate-800/50 rounded-2xl p-5 mb-4 border-2 transition-all ${isActive ? 'border-orange-500 shadow-lg shadow-orange-500/20' : allSetsComplete ? 'border-green-500/50 opacity-75' : 'border-transparent'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 font-bold text-sm">{index}</span>
          <div>
            <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
            <p className="text-gray-400 text-sm">{exercise.sets} × {exercise.reps}{techMode && ` @ Tempo ${exercise.tempo}`}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"><Info size={18} /></button>
          <button className="p-2 bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"><Play size={18} /></button>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-3 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Last Session</p>
        <p className="text-gray-300 text-sm">{exercise.lastWeight} lbs × {exercise.lastReps.join(', ')}</p>
      </div>

      {techMode && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Volume</p>
            <p className="text-white font-semibold">{exercise.lastWeight * exercise.sets * exercise.lastReps[0]} lbs</p>
          </div>
          <div className="bg-slate-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Est. 1RM</p>
            <p className="text-white font-semibold">{Math.round(exercise.lastWeight * (1 + exercise.lastReps[0] / 30))} lbs</p>
          </div>
          <div className="bg-slate-900/30 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs">Suggested</p>
            <p className="text-green-400 font-semibold">+5 lbs</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <button
            key={i}
            onClick={() => !completedSets.includes(i) && onStartSet(exercise, i + 1)}
            disabled={completedSets.includes(i)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${completedSets.includes(i) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'}`}
          >
            {completedSets.includes(i) ? <Check size={18} className="mx-auto" /> : `Set ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
};

// ===== WARMUP SECTION =====
const WarmupSection = ({ expanded, onToggle }) => (
  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl mb-6 overflow-hidden">
    <button onClick={onToggle} className="w-full p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flame className="text-orange-400" size={24} />
        <span className="text-white font-bold">WARM-UP</span>
      </div>
      <ChevronDown className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
    </button>
    {expanded && (
      <div className="px-5 pb-5 space-y-3">
        {warmupExercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
            <span className="text-gray-300">{ex.name}</span>
            <span className="text-orange-400 font-mono">{ex.prescription}</span>
          </div>
        ))}
        <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold py-3 rounded-xl transition-colors">Start Warm-up ▶</button>
      </div>
    )}
  </div>
);

// ===== ATHLETE WORKOUT VIEW =====
const AthleteWorkoutView = ({ techMode, onToggleTechMode, onExit }) => {
  const [completedSets, setCompletedSets] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeSetNumber, setActiveSetNumber] = useState(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [prData, setPrData] = useState({ exercise: '', newPR: 0, previousPR: 0 });
  const [warmupExpanded, setWarmupExpanded] = useState(true);
  const [currentRestDuration, setCurrentRestDuration] = useState(90);

  const handleStartSet = (exercise, setNum) => {
    setActiveExercise(exercise);
    setActiveSetNumber(setNum);
  };

  const handleLogSet = (data) => {
    const exerciseId = activeExercise.id;
    const setIndex = activeSetNumber - 1;
    
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] || []), setIndex]
    }));

    if (data.weight > activeExercise.lastWeight) {
      setPrData({ exercise: activeExercise.name, newPR: data.weight, previousPR: activeExercise.lastWeight });
      setShowPRCelebration(true);
    } else {
      setCurrentRestDuration(activeExercise.rest);
      setShowRestTimer(true);
    }
    
    setActiveExercise(null);
    setActiveSetNumber(null);
  };

  const totalSets = mockExercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedTotal = Object.values(completedSets).flat().length;
  const progress = (completedTotal / totalSets) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button onClick={onExit} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ChevronLeft size={20} />
            <span className="text-sm">Exit</span>
          </button>
          <p className="text-orange-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
          <button
            onClick={onToggleTechMode}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${techMode ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-400'}`}
          >
            {techMode ? '🔬 TECH' : 'SIMPLE'}
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-2"><span className="text-gray-400 text-sm">Week 3 · Day 1</span></div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>LOWER BODY - STRENGTH</h1>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{completedTotal} of {totalSets} sets complete</span>
            <span className="text-orange-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <WarmupSection expanded={warmupExpanded} onToggle={() => setWarmupExpanded(!warmupExpanded)} />

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

        <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/50">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Finisher / Accessory</h3>
          <p className="text-gray-300">Assisted hip airplanes 2×10, rolling plank 2×20</p>
        </div>
      </div>

      {activeExercise && (
        <SetLoggingModal
          exercise={activeExercise}
          setNumber={activeSetNumber}
          totalSets={activeExercise.sets}
          onLog={handleLogSet}
          onCancel={() => { setActiveExercise(null); setActiveSetNumber(null); }}
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

// ===== COACH DASHBOARD =====
const CoachDashboard = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return '🟢';
      case 'watch': return '🟠';
      case 'alert': return '🔴';
      default: return '⚪';
    }
  };

  if (selectedClient) {
    return <ClientDetailView client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-orange-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
            <p className="text-gray-400 text-xs">COACH DASHBOARD</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-slate-800 rounded-lg">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">MS</div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-400 text-sm">Today's Overview</p>
          <p className="text-white text-xl font-bold">December 5, 2025</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <BarChart3 className="text-blue-400 mx-auto mb-2" size={28} />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>18/24</p>
            <p className="text-gray-400 text-xs">Workouts Done</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Video className="text-purple-400 mx-auto mb-2" size={28} />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>5</p>
            <p className="text-gray-400 text-xs">Form Checks</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <AlertTriangle className="text-yellow-400 mx-auto mb-2" size={28} />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>3</p>
            <p className="text-gray-400 text-xs">Need Attention</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              NEEDS ATTENTION
            </h2>
            <ChevronRight className="text-gray-500" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-red-400">🔴</span>
                <div>
                  <p className="text-white font-medium">Sarah M.</p>
                  <p className="text-gray-500 text-sm">No login in 7 days</p>
                </div>
              </div>
              <button className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg text-sm font-semibold">Message</button>
            </div>
            <div className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400">🟠</span>
                <div>
                  <p className="text-white font-medium">Jake T.</p>
                  <p className="text-gray-500 text-sm">Compliance dropped 40%</p>
                </div>
              </div>
              <button className="bg-slate-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold">View</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            {[
              { icon: '🏋️', text: 'John D. completed "Week 3 Day 2"', time: '2 min ago' },
              { icon: '🎥', text: 'Emma S. uploaded form check (Squat)', time: '15 min ago' },
              { icon: '💬', text: 'Alex R. sent a message', time: '1 hour ago' },
              { icon: '✅', text: 'Chris P. logged new 1RM (Deadlift)', time: '2 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
                <p className="text-gray-500 text-xs">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">ALL CLIENTS</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"><Plus size={18} className="text-white" /></button>
            </div>
          </div>

          <div className="space-y-3">
            {mockClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="w-full bg-slate-800/50 hover:bg-slate-800 rounded-2xl p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-bold">{client.avatar}</div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{client.name}</p>
                    <p className="text-gray-500 text-sm">{client.program}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-semibold">{client.sevenDay}%</p>
                    <p className="text-gray-500 text-xs">7-Day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{client.thirtyDay}%</p>
                    <p className="text-gray-500 text-xs">30-Day</p>
                  </div>
                  <span>{getStatusIcon(client.status)}</span>
                  <ChevronRight className="text-gray-500" size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== CLIENT DETAIL VIEW =====
const ClientDetailView = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400">
            <ChevronLeft size={24} /><span>Back</span>
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-800 rounded-lg"><MessageSquare size={20} className="text-gray-400" /></button>
            <button className="p-2 bg-slate-800 rounded-lg"><Menu size={20} className="text-gray-400" /></button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">{client.avatar}</div>
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.name.toUpperCase()}</h1>
            <p className="text-gray-400">Active since {client.startDate}</p>
            <p className="text-gray-500 text-sm">Goal: {client.goal} · {client.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.thirtyDay}%</p>
            <p className="text-gray-500 text-xs">30-Day</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>W3</p>
            <p className="text-gray-500 text-xs">Current</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-400" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.gained}</p>
            <p className="text-gray-500 text-xs">Progress</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-orange-400" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.prs}</p>
            <p className="text-gray-500 text-xs">PRs</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6">
          {['Overview', 'Workouts', 'Progress', 'Messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.toLowerCase() ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-slate-800 text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4">CURRENT PROGRAM: 4-Week Strength Block</h3>
          <div className="space-y-3">
            {[
              { week: 1, progress: 100, completed: 4, total: 4 },
              { week: 2, progress: 100, completed: 4, total: 4 },
              { week: 3, progress: 50, completed: 2, total: 4, current: true },
              { week: 4, progress: 0, completed: 0, total: 4 },
            ].map((week) => (
              <div key={week.week} className="flex items-center gap-4">
                <span className="text-gray-400 w-16">Week {week.week}</span>
                <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${week.current ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-green-500'}`} style={{ width: `${week.progress}%` }} />
                </div>
                <span className={`text-sm ${week.current ? 'text-orange-400' : 'text-gray-400'}`}>{week.completed}/{week.total}{week.current && ' ←'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4">STRENGTH PROGRESS (Est. 1RM)</h3>
          <div className="space-y-4">
            {[
              { name: 'Squat', from: 285, to: 315, change: 11 },
              { name: 'Bench', from: 185, to: 205, change: 11 },
              { name: 'Deadlift', from: 365, to: 395, change: 8 },
            ].map((lift) => (
              <div key={lift.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{lift.name}</span>
                  <span className="text-gray-300">{lift.from} → {lift.to} <span className="text-green-400">(+{lift.change}%)</span></span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${(lift.to / 400) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/30">
          Assign New Program
        </button>
      </div>
    </div>
  );
};

// ===== BOTTOM NAVIGATION =====
const BottomNav = ({ activeTab, onChangeTab, userRole }) => {
  const athleteTabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'program', icon: ClipboardList, label: 'Program' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const coachTabs = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'programs', icon: ClipboardList, label: 'Programs' },
    { id: 'formchecks', icon: Video, label: 'Form Checks' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const tabs = userRole === 'coach' ? coachTabs : athleteTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50 pb-safe">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onChangeTab(tab.id)} className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive ? 'text-orange-400' : 'text-gray-500'}`}>
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// ===== STREAK DISPLAY =====
const StreakDisplay = ({ streak, weeklyTarget, weeklyCompleted }) => (
  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-5 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <Flame className="text-white" size={28} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Weekly Streak</p>
          <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{streak} <span className="text-lg text-gray-400">weeks</span></p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-400 text-sm">This Week</p>
        <p className="text-xl font-bold text-white">{weeklyCompleted}/{weeklyTarget}</p>
        <div className="flex gap-1 mt-1">
          {Array.from({ length: weeklyTarget }, (_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < weeklyCompleted ? 'bg-orange-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ===== ATHLETE HOME =====
const AthleteHome = ({ onStartWorkout }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
    <header className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white">John 💪</h1>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">JD</div>
      </div>

      <StreakDisplay streak={8} weeklyTarget={4} weeklyCompleted={2} />

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-orange-400 font-semibold text-sm">TODAY'S WORKOUT</p>
            <h2 className="text-2xl font-black text-white mt-1" style={{ fontFamily: 'Oswald, sans-serif' }}>LOWER BODY</h2>
            <p className="text-gray-400 text-sm">Week 3 · Day 1 · Strength</p>
          </div>
          <div className="bg-orange-500/20 px-3 py-1 rounded-full">
            <span className="text-orange-400 text-sm font-semibold">~55 min</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-900/50 rounded-xl p-3 text-center">
            <Dumbbell className="text-gray-400 mx-auto mb-1" size={20} />
            <p className="text-white font-bold">5</p>
            <p className="text-gray-500 text-xs">Exercises</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 text-center">
            <Target className="text-gray-400 mx-auto mb-1" size={20} />
            <p className="text-white font-bold">17</p>
            <p className="text-gray-500 text-xs">Total Sets</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 text-center">
            <TrendingUp className="text-gray-400 mx-auto mb-1" size={20} />
            <p className="text-white font-bold">+5%</p>
            <p className="text-gray-500 text-xs">Vol. Target</p>
          </div>
        </div>

        <button onClick={onStartWorkout} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
          <Play size={24} fill="white" />
          START WORKOUT
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="text-yellow-400" size={24} />
            <p className="text-white font-bold">Recent PRs</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Squat</span>
              <span className="text-green-400 font-semibold">315 lbs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Deadlift</span>
              <span className="text-green-400 font-semibold">395 lbs</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-blue-400" size={24} />
            <p className="text-white font-bold">This Week</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Volume</span>
              <span className="text-white font-semibold">42,500 lbs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sessions</span>
              <span className="text-white font-semibold">2 / 4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="text-blue-400" size={20} />
          <p className="text-white font-bold">Coach Notes</p>
        </div>
        <p className="text-gray-300 text-sm">"Great progress on your squat depth last week! Focus on controlled eccentrics today. If anything feels off, drop weight 10% and prioritize form."</p>
        <p className="text-gray-500 text-xs mt-2">— Coach Mike, 2 days ago</p>
      </div>
    </header>
  </div>
);

// ===== MAIN APP =====
export default function App() {
  const [userRole, setUserRole] = useState('athlete');
  const [activeTab, setActiveTab] = useState('home');
  const [inWorkout, setInWorkout] = useState(false);
  const [techMode, setTechMode] = useState(false);

  const handleRoleSwitch = () => {
    const newRole = userRole === 'athlete' ? 'coach' : 'athlete';
    setUserRole(newRole);
    setActiveTab(newRole === 'coach' ? 'dashboard' : 'home');
    setInWorkout(false);
  };

  const renderContent = () => {
    if (userRole === 'coach') {
      return <CoachDashboard />;
    }

    if (inWorkout) {
      return (
        <AthleteWorkoutView 
          techMode={techMode} 
          onToggleTechMode={() => setTechMode(!techMode)}
          onExit={() => setInWorkout(false)}
        />
      );
    }

    return <AthleteHome onStartWorkout={() => setInWorkout(true)} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Role Switcher */}
      <div className="fixed top-4 right-4 z-[100]">
        <button onClick={handleRoleSwitch} className="bg-slate-800/90 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold border border-slate-700 hover:bg-slate-700 transition-colors">
          {userRole === 'athlete' ? '👤 Coach View' : '🏋️ Athlete View'}
        </button>
      </div>

      {renderContent()}

      {!inWorkout && (
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} userRole={userRole} />
      )}
    </div>
  );
}
