import { useState } from 'react';
import { Play, Calendar, ChevronRight, Dumbbell, Target, Clock, CheckCircle2, Lock } from 'lucide-react';
import { PageTransition, SlideIn, StaggerContainer } from '../components/ui/AnimatedComponents';
import { getPrograms } from '../services/localStorage';

// Current program for demo
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
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: 5 },
        { dayNum: 2, name: 'Upper A', status: 'completed', exercises: 5 },
        { dayNum: 3, name: 'Lower B', status: 'completed', exercises: 5 },
        { dayNum: 4, name: 'Upper B', status: 'completed', exercises: 5 },
      ],
    },
    {
      weekNum: 2,
      status: 'completed',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: 5 },
        { dayNum: 2, name: 'Upper A', status: 'completed', exercises: 5 },
        { dayNum: 3, name: 'Lower B', status: 'completed', exercises: 5 },
        { dayNum: 4, name: 'Upper B', status: 'completed', exercises: 5 },
      ],
    },
    {
      weekNum: 3,
      status: 'in_progress',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'completed', exercises: 5 },
        { dayNum: 2, name: 'Upper A', status: 'current', exercises: 5 },
        { dayNum: 3, name: 'Lower B', status: 'upcoming', exercises: 5 },
        { dayNum: 4, name: 'Upper B', status: 'upcoming', exercises: 5 },
      ],
    },
    {
      weekNum: 4,
      status: 'locked',
      days: [
        { dayNum: 1, name: 'Lower A', status: 'locked', exercises: 5 },
        { dayNum: 2, name: 'Upper A', status: 'locked', exercises: 5 },
        { dayNum: 3, name: 'Lower B', status: 'locked', exercises: 5 },
        { dayNum: 4, name: 'Upper B', status: 'locked', exercises: 5 },
      ],
    },
  ],
};

const AthleteProgram = ({ onStartWorkout }) => {
  const [expandedWeek, setExpandedWeek] = useState(currentProgram.currentWeek);

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
                        <button
                          key={day.dayNum}
                          onClick={() => day.status === 'current' && onStartWorkout?.()}
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
                              <p className="text-gray-500 text-xs">{day.exercises} exercises</p>
                            </div>
                          </div>
                          {day.status === 'current' && (
                            <span className="bg-gold-gradient text-carbon-900 px-3 py-1 rounded-full text-sm font-bold">
                              Start
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </SlideIn>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default AthleteProgram;
