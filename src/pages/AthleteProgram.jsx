import { useState } from 'react';
import { Play, Calendar, ChevronRight, Dumbbell, Target, Clock, CheckCircle2, Lock, X, ChevronDown, Info } from 'lucide-react';
import { PageTransition, SlideIn, StaggerContainer } from '../components/ui/AnimatedComponents';
import { getPrograms } from '../services/localStorage';
import { getExercise } from '../data/exercises';

// Exercise Info Modal for Program View
const ProgramExerciseInfoModal = ({ exercise, onClose, onShowVideo }) => {
  const exerciseData = getExercise(exercise.name);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-carbon-700 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Target muscles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.muscleGroups?.map((muscle, i) => (
            <span key={i} className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full">
              {muscle}
            </span>
          ))}
        </div>

        {/* Prescription */}
        <div className="bg-carbon-900/50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-gray-400 text-xs">Sets</p>
              <p className="text-white font-bold">{exercise.sets}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Reps</p>
              <p className="text-white font-bold">{exercise.reps}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Tempo</p>
              <p className="text-white font-bold">{exercise.tempo}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Rest</p>
              <p className="text-white font-bold">{exercise.rest}s</p>
            </div>
          </div>
        </div>

        {/* Instructions from database */}
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

        {/* Tips */}
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

        <div className="flex gap-3">
          {exerciseData?.videoId && (
            <button
              onClick={() => onShowVideo(exerciseData.videoId)}
              className="flex-1 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Watch Demo
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Video Modal for Program View
const ProgramVideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-end mb-4">
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={24} />
          </button>
        </div>
        <div className="aspect-video bg-black rounded-2xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            title="Exercise Demo"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

// Exercise templates for each day type
const EXERCISE_TEMPLATES = {
  'Lower A': [
    { id: 1, name: 'Back Squat', sets: 4, reps: '6-8', tempo: '3010', rest: 180, targetWeight: 185, muscleGroups: ['Quads', 'Glutes'] },
    { id: 2, name: 'Romanian Deadlift', sets: 4, reps: '8-10', tempo: '3011', rest: 120, targetWeight: 135, muscleGroups: ['Hamstrings', 'Glutes'] },
    { id: 3, name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', tempo: '2010', rest: 90, targetWeight: 40, muscleGroups: ['Quads', 'Glutes'] },
    { id: 4, name: 'Leg Curl', sets: 3, reps: '12-15', tempo: '2011', rest: 60, targetWeight: 90, muscleGroups: ['Hamstrings'] },
    { id: 5, name: 'Standing Calf Raise', sets: 3, reps: '15-20', tempo: '2111', rest: 45, targetWeight: 135, muscleGroups: ['Calves'] },
  ],
  'Upper A': [
    { id: 1, name: 'Bench Press', sets: 4, reps: '6-8', tempo: '3010', rest: 180, targetWeight: 165, muscleGroups: ['Chest', 'Triceps'] },
    { id: 2, name: 'Barbell Row', sets: 4, reps: '8-10', tempo: '2011', rest: 120, targetWeight: 135, muscleGroups: ['Back', 'Biceps'] },
    { id: 3, name: 'Overhead Press', sets: 3, reps: '8-10', tempo: '2010', rest: 90, targetWeight: 95, muscleGroups: ['Shoulders'] },
    { id: 4, name: 'Lat Pulldown', sets: 3, reps: '10-12', tempo: '2011', rest: 60, targetWeight: 120, muscleGroups: ['Lats', 'Biceps'] },
    { id: 5, name: 'Face Pull', sets: 3, reps: '15-20', tempo: '2011', rest: 45, targetWeight: 40, muscleGroups: ['Rear Delts'] },
  ],
  'Lower B': [
    { id: 1, name: 'Trap Bar Deadlift', sets: 4, reps: '5-6', tempo: '2010', rest: 180, targetWeight: 225, muscleGroups: ['Hamstrings', 'Glutes', 'Quads'] },
    { id: 2, name: 'Front Squat', sets: 3, reps: '8-10', tempo: '3010', rest: 120, targetWeight: 135, muscleGroups: ['Quads', 'Core'] },
    { id: 3, name: 'Walking Lunges', sets: 3, reps: '12 each', tempo: '2010', rest: 90, targetWeight: 50, muscleGroups: ['Quads', 'Glutes'] },
    { id: 4, name: 'Leg Press', sets: 4, reps: '12-15', tempo: '2010', rest: 90, targetWeight: 270, muscleGroups: ['Quads', 'Glutes'] },
    { id: 5, name: 'Seated Calf Raise', sets: 3, reps: '15-20', tempo: '2111', rest: 45, targetWeight: 90, muscleGroups: ['Calves'] },
  ],
  'Upper B': [
    { id: 1, name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', tempo: '3010', rest: 120, targetWeight: 65, muscleGroups: ['Upper Chest', 'Shoulders'] },
    { id: 2, name: 'Pull-Ups', sets: 4, reps: '6-10', tempo: '2011', rest: 120, targetWeight: 0, muscleGroups: ['Lats', 'Biceps'] },
    { id: 3, name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', tempo: '2010', rest: 90, targetWeight: 45, muscleGroups: ['Shoulders'] },
    { id: 4, name: 'Cable Row', sets: 3, reps: '10-12', tempo: '2011', rest: 60, targetWeight: 100, muscleGroups: ['Back'] },
    { id: 5, name: 'Tricep Pushdown', sets: 3, reps: '12-15', tempo: '2011', rest: 45, targetWeight: 50, muscleGroups: ['Triceps'] },
  ],
};

// Current program for demo with actual exercise data
const currentProgram = {
  id: 'prog_1',
  name: '4-Week Strength Block',
  description: 'Progressive overload program focusing on compound movements',
  currentWeek: 3,
  totalWeeks: 4,
  currentDay: 1,
  daysPerWeek: 4,
  weeks: [
    {
      weekNum: 1,
      status: 'completed',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: EXERCISE_TEMPLATES['Lower A'] },
        { dayNum: 2, name: 'Upper A', status: 'completed', exercises: EXERCISE_TEMPLATES['Upper A'] },
        { dayNum: 3, name: 'Lower B', status: 'completed', exercises: EXERCISE_TEMPLATES['Lower B'] },
        { dayNum: 4, name: 'Upper B', status: 'completed', exercises: EXERCISE_TEMPLATES['Upper B'] },
      ],
    },
    {
      weekNum: 2,
      status: 'completed',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: EXERCISE_TEMPLATES['Lower A'] },
        { dayNum: 2, name: 'Upper A', status: 'completed', exercises: EXERCISE_TEMPLATES['Upper A'] },
        { dayNum: 3, name: 'Lower B', status: 'completed', exercises: EXERCISE_TEMPLATES['Lower B'] },
        { dayNum: 4, name: 'Upper B', status: 'completed', exercises: EXERCISE_TEMPLATES['Upper B'] },
      ],
    },
    {
      weekNum: 3,
      status: 'in_progress',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: EXERCISE_TEMPLATES['Lower A'] },
        { dayNum: 2, name: 'Upper A', status: 'current', exercises: EXERCISE_TEMPLATES['Upper A'] },
        { dayNum: 3, name: 'Lower B', status: 'upcoming', exercises: EXERCISE_TEMPLATES['Lower B'] },
        { dayNum: 4, name: 'Upper B', status: 'upcoming', exercises: EXERCISE_TEMPLATES['Upper B'] },
      ],
    },
    {
      weekNum: 4,
      status: 'locked',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'locked', exercises: EXERCISE_TEMPLATES['Lower A'] },
        { dayNum: 2, name: 'Upper A', status: 'locked', exercises: EXERCISE_TEMPLATES['Upper A'] },
        { dayNum: 3, name: 'Lower B', status: 'locked', exercises: EXERCISE_TEMPLATES['Lower B'] },
        { dayNum: 4, name: 'Upper B', status: 'locked', exercises: EXERCISE_TEMPLATES['Upper B'] },
      ],
    },
  ],
};

const AthleteProgram = ({ onStartWorkout }) => {
  const [expandedWeek, setExpandedWeek] = useState(currentProgram.currentWeek);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(null);
  const [showVideoId, setShowVideoId] = useState(null);

  const handleShowVideo = (videoId) => {
    setShowInfoModal(null);
    setShowVideoId(videoId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-gold-500';
      case 'in_progress': return 'bg-gold-500/50';
      case 'upcoming': return 'bg-carbon-600';
      case 'locked': return 'bg-carbon-800';
      default: return 'bg-carbon-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} className="text-green-400" />;
      case 'current': return <Play size={18} className="text-gold-400" />;
      case 'locked': return <Lock size={14} className="text-gray-600" />;
      default: return null;
    }
  };

  const completedDays = currentProgram.weeks.reduce((acc, week) =>
    acc + week.days.filter(d => d.status === 'completed').length, 0
  );
  const totalDays = currentProgram.weeks.reduce((acc, week) => acc + week.days.length, 0);
  const progressPercent = Math.round((completedDays / totalDays) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <img src="/logo.png" alt="STS" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
              <h1 className="text-white text-xl font-bold">My Program</h1>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Program Header Card */}
          <SlideIn>
            <div className="bg-gradient-to-br from-carbon-800 to-carbon-900 rounded-3xl p-6 border border-gold-500/20 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {currentProgram.name.toUpperCase()}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{currentProgram.description}</p>
                </div>
                <div className="bg-gold-500/20 px-3 py-1 rounded-full">
                  <span className="text-gold-400 text-sm font-semibold">
                    Week {currentProgram.currentWeek}/{currentProgram.totalWeeks}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gold-400 font-semibold">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-carbon-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                  <Calendar className="text-gray-400 mx-auto mb-1" size={20} />
                  <p className="text-white font-bold">{completedDays}/{totalDays}</p>
                  <p className="text-gray-500 text-xs">Days Done</p>
                </div>
                <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                  <Dumbbell className="text-gray-400 mx-auto mb-1" size={20} />
                  <p className="text-white font-bold">{currentProgram.daysPerWeek}x</p>
                  <p className="text-gray-500 text-xs">Per Week</p>
                </div>
                <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                  <Target className="text-gray-400 mx-auto mb-1" size={20} />
                  <p className="text-white font-bold">Strength</p>
                  <p className="text-gray-500 text-xs">Focus</p>
                </div>
              </div>
            </div>
          </SlideIn>

          {/* Week Accordions */}
          <StaggerContainer staggerDelay={100}>
            {currentProgram.weeks.map((week) => (
              <SlideIn key={week.weekNum}>
                <div className="mb-4">
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === week.weekNum ? null : week.weekNum)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      week.status === 'locked'
                        ? 'bg-carbon-800/30 cursor-not-allowed'
                        : 'bg-carbon-800/50 hover:bg-carbon-800'
                    }`}
                    disabled={week.status === 'locked'}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        week.status === 'completed' ? 'bg-green-500/20' :
                        week.status === 'in_progress' ? 'bg-gold-500/20' :
                        'bg-carbon-700'
                      }`}>
                        {week.status === 'completed' ? (
                          <CheckCircle2 className="text-green-400" size={20} />
                        ) : week.status === 'locked' ? (
                          <Lock className="text-gray-600" size={18} />
                        ) : (
                          <span className="text-gold-400 font-bold">{week.weekNum}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${week.status === 'locked' ? 'text-gray-600' : 'text-white'}`}>
                          Week {week.weekNum}
                        </p>
                        <p className="text-gray-500 text-sm capitalize">{week.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {week.status !== 'locked' && (
                      <ChevronRight
                        className={`text-gray-500 transition-transform ${
                          expandedWeek === week.weekNum ? 'rotate-90' : ''
                        }`}
                        size={20}
                      />
                    )}
                  </button>

                  {/* Expanded Day List */}
                  {expandedWeek === week.weekNum && week.status !== 'locked' && (
                    <div className="mt-2 space-y-2 pl-4">
                      {week.days.map((day) => (
                        <div key={day.dayNum}>
                          <button
                            onClick={() => {
                              if (day.status === 'current') {
                                onStartWorkout?.();
                              } else {
                                setSelectedDay(selectedDay?.dayNum === day.dayNum && selectedDay?.weekNum === week.weekNum ? null : { ...day, weekNum: week.weekNum });
                              }
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                              day.status === 'current'
                                ? 'bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20'
                                : day.status === 'completed'
                                ? 'bg-carbon-800/30'
                                : 'bg-carbon-800/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(day.status)}`}>
                                {getStatusIcon(day.status) || (
                                  <span className="text-white text-sm font-bold">{day.dayNum}</span>
                                )}
                              </div>
                              <div className="text-left">
                                <p className={`font-semibold ${
                                  day.status === 'completed' ? 'text-gray-400' :
                                  day.status === 'current' ? 'text-gold-400' :
                                  'text-gray-300'
                                }`}>
                                  Day {day.dayNum}: {day.name}
                                </p>
                                <p className="text-gray-500 text-xs">{day.exercises.length} exercises</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {day.status === 'current' ? (
                                <span className="bg-gold-gradient text-carbon-900 px-3 py-1 rounded-full text-sm font-bold">
                                  Start
                                </span>
                              ) : (
                                <ChevronDown
                                  size={18}
                                  className={`text-gray-500 transition-transform ${
                                    selectedDay?.dayNum === day.dayNum && selectedDay?.weekNum === week.weekNum ? 'rotate-180' : ''
                                  }`}
                                />
                              )}
                            </div>
                          </button>

                          {/* Expanded Exercise List */}
                          {selectedDay?.dayNum === day.dayNum && selectedDay?.weekNum === week.weekNum && (
                            <div className="mt-2 ml-4 space-y-2 animate-fade-in">
                              {day.exercises.map((exercise, exIndex) => {
                                const exerciseData = getExercise(exercise.name);
                                return (
                                  <div
                                    key={exercise.id}
                                    className="bg-carbon-900/60 rounded-xl p-4 border border-carbon-700/30"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-gold-400 font-bold text-sm">{exIndex + 1}</span>
                                        <h4 className="text-white font-semibold">{exercise.name}</h4>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {/* Info Button */}
                                        <button
                                          onClick={() => setShowInfoModal(exercise)}
                                          className="p-1.5 bg-carbon-700 rounded-lg text-gray-400 hover:text-white hover:bg-carbon-600 transition-colors"
                                          aria-label={`Info for ${exercise.name}`}
                                        >
                                          <Info size={14} />
                                        </button>
                                        {/* Video Button */}
                                        <button
                                          onClick={() => exerciseData?.videoId && setShowVideoId(exerciseData.videoId)}
                                          className={`p-1.5 rounded-lg transition-colors ${
                                            exerciseData?.videoId
                                              ? 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                                              : 'bg-carbon-700 text-gray-500'
                                          }`}
                                          aria-label={`Watch demo for ${exercise.name}`}
                                        >
                                          <Play size={14} fill={exerciseData?.videoId ? 'currentColor' : 'none'} />
                                        </button>
                                        {exercise.targetWeight > 0 && (
                                          <span className="text-gold-400 text-sm font-semibold ml-1">
                                            {exercise.targetWeight} lbs
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                      <div className="bg-carbon-800 rounded-lg p-2">
                                        <p className="text-gray-400 text-[10px] uppercase">Sets</p>
                                        <p className="text-white font-bold">{exercise.sets}</p>
                                      </div>
                                      <div className="bg-carbon-800 rounded-lg p-2">
                                        <p className="text-gray-400 text-[10px] uppercase">Reps</p>
                                        <p className="text-white font-bold">{exercise.reps}</p>
                                      </div>
                                      <div className="bg-carbon-800 rounded-lg p-2">
                                        <p className="text-gray-400 text-[10px] uppercase">Tempo</p>
                                        <p className="text-white font-bold">{exercise.tempo}</p>
                                      </div>
                                      <div className="bg-carbon-800 rounded-lg p-2">
                                        <p className="text-gray-400 text-[10px] uppercase">Rest</p>
                                        <p className="text-white font-bold">{exercise.rest}s</p>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {exercise.muscleGroups.map((muscle) => (
                                        <span
                                          key={muscle}
                                          className="text-[10px] px-2 py-0.5 bg-gold-500/10 text-gold-400 rounded-full"
                                        >
                                          {muscle}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SlideIn>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Modals */}
      {showInfoModal && (
        <ProgramExerciseInfoModal
          exercise={showInfoModal}
          onClose={() => setShowInfoModal(null)}
          onShowVideo={handleShowVideo}
        />
      )}

      {showVideoId && (
        <ProgramVideoModal
          videoId={showVideoId}
          onClose={() => setShowVideoId(null)}
        />
      )}
    </PageTransition>
  );
};

export default AthleteProgram;
