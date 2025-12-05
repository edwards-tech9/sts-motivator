import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Dumbbell, Clock, Trophy } from 'lucide-react';

// Mock data - will be replaced with Firestore
const mockWorkoutHistory = [
  {
    id: 1,
    date: '2025-12-05',
    name: 'Lower Body - Strength',
    duration: 52,
    exercises: 5,
    totalSets: 17,
    completedSets: 17,
    volume: 45200,
    prs: 1,
  },
  {
    id: 2,
    date: '2025-12-03',
    name: 'Upper Body - Push',
    duration: 48,
    exercises: 6,
    totalSets: 18,
    completedSets: 18,
    volume: 32100,
    prs: 0,
  },
  {
    id: 3,
    date: '2025-12-01',
    name: 'Lower Body - Hypertrophy',
    duration: 55,
    exercises: 6,
    totalSets: 20,
    completedSets: 18,
    volume: 48500,
    prs: 2,
  },
  {
    id: 4,
    date: '2025-11-29',
    name: 'Upper Body - Pull',
    duration: 45,
    exercises: 5,
    totalSets: 16,
    completedSets: 16,
    volume: 28900,
    prs: 0,
  },
];

const WorkoutHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [workouts] = useState(mockWorkoutHistory);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(selectedMonth);

  const getWorkoutForDay = (day) => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workouts.find((w) => w.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate stats
  const thisMonthWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    return workoutDate.getMonth() === selectedMonth.getMonth() && workoutDate.getFullYear() === selectedMonth.getFullYear();
  });

  const totalVolume = thisMonthWorkouts.reduce((acc, w) => acc + w.volume, 0);
  const totalPRs = thisMonthWorkouts.reduce((acc, w) => acc + w.prs, 0);
  const avgDuration = thisMonthWorkouts.length > 0 ? Math.round(thisMonthWorkouts.reduce((acc, w) => acc + w.duration, 0) / thisMonthWorkouts.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="p-4">
          <p className="text-orange-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
          <h1 className="text-white text-xl font-bold">Workout History</h1>
        </div>
      </header>

      <div className="p-6">
        {/* Monthly Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Dumbbell className="text-orange-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {thisMonthWorkouts.length}
            </p>
            <p className="text-gray-400 text-xs">Workouts</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <TrendingUp className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {(totalVolume / 1000).toFixed(1)}k
            </p>
            <p className="text-gray-400 text-xs">Total lbs</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <Trophy className="text-yellow-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {totalPRs}
            </p>
            <p className="text-gray-400 text-xs">PRs</p>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-slate-800/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <h2 className="text-white font-bold text-lg">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-gray-500 text-xs py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDay }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const workout = getWorkoutForDay(day);
              const isToday =
                day === new Date().getDate() &&
                selectedMonth.getMonth() === new Date().getMonth() &&
                selectedMonth.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => workout && setSelectedWorkout(workout)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                    workout
                      ? 'bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/50 hover:scale-105 cursor-pointer'
                      : isToday
                      ? 'bg-slate-700 border border-slate-600'
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <span className={workout ? 'text-white font-semibold' : 'text-gray-400'}>{day}</span>
                  {workout && workout.prs > 0 && (
                    <span className="text-yellow-400 text-[10px]">🏆</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Workouts List */}
        <h3 className="text-white font-bold mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          {workouts.map((workout) => (
            <button
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              className="w-full bg-slate-800/50 rounded-2xl p-4 text-left hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">{workout.name}</h4>
                {workout.prs > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                    {workout.prs} PR{workout.prs > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {workout.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell size={14} />
                  {workout.completedSets}/{workout.totalSets} sets
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: `${(workout.completedSets / workout.totalSets) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center"
          onClick={() => setSelectedWorkout(null)}
        >
          <div
            className="bg-slate-900 rounded-t-3xl w-full max-w-lg p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />

            <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {selectedWorkout.name.toUpperCase()}
            </h2>
            <p className="text-gray-400 mb-6">
              {new Date(selectedWorkout.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-2xl font-bold text-white">{selectedWorkout.duration} min</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Volume</p>
                <p className="text-2xl font-bold text-white">{selectedWorkout.volume.toLocaleString()} lbs</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Exercises</p>
                <p className="text-2xl font-bold text-white">{selectedWorkout.exercises}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Sets Completed</p>
                <p className="text-2xl font-bold text-white">
                  {selectedWorkout.completedSets}/{selectedWorkout.totalSets}
                </p>
              </div>
            </div>

            {selectedWorkout.prs > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 font-semibold flex items-center gap-2">
                  <Trophy size={20} />
                  {selectedWorkout.prs} Personal Record{selectedWorkout.prs > 1 ? 's' : ''} Set!
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedWorkout(null)}
              className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
