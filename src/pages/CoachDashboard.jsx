import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Plus, AlertTriangle, BarChart3, Video, MessageSquare, Menu, ChevronLeft, Zap, TrendingUp, Activity, X, Send, Film, UserPlus, Clipboard, Target, Gauge, Sparkles, Check } from 'lucide-react';
import { getAthletes, getWorkouts, addMessage } from '../services/localStorage';
import { getAthleteReadiness, generateProgramSuggestions, generatePredictiveWorkout } from '../services/predictiveAnalysis';
import { getAIProgramSuggestions } from '../services/aiProgramService';
import { generateAlertMessages, generateSmartMessages } from '../services/smartMessaging';
import VideoManager from '../components/coach/VideoManager';

// Default clients that show if no athletes in storage
const defaultClients = [
  { id: 1, name: 'John Davidson', program: 'Strength 4x', sevenDay: 86, thirtyDay: 91, status: 'good', avatar: 'JD', goal: 'Strength', level: 'Intermediate', startDate: 'March 2024', prs: 3, gained: '12 lbs' },
  { id: 2, name: 'Emma Sullivan', program: 'Hypertrophy', sevenDay: 100, thirtyDay: 88, status: 'good', avatar: 'ES', goal: 'Muscle Gain', level: 'Advanced', startDate: 'Jan 2024', prs: 5, gained: '8 lbs' },
  { id: 3, name: 'Sarah Martinez', program: 'Fat Loss', sevenDay: 0, thirtyDay: 45, status: 'alert', avatar: 'SM', goal: 'Fat Loss', level: 'Beginner', startDate: 'Oct 2024', prs: 1, gained: '-15 lbs' },
  { id: 4, name: 'Jake Thompson', program: 'Athletic', sevenDay: 43, thirtyDay: 67, status: 'watch', avatar: 'JT', goal: 'Athletic Performance', level: 'Intermediate', startDate: 'Aug 2024', prs: 2, gained: '5 lbs' },
  { id: 5, name: 'Maria Lopez', program: 'General', sevenDay: 71, thirtyDay: 82, status: 'good', avatar: 'ML', goal: 'General Fitness', level: 'Intermediate', startDate: 'May 2024', prs: 4, gained: '3 lbs' },
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'good': return '🟢';
    case 'watch': return '🟠';
    case 'alert': return '🔴';
    default: return '⚪';
  }
};

// Athlete Readiness Component
const AthleteReadinessCard = ({ athleteId }) => {
  const readiness = getAthleteReadiness(athleteId);
  const suggestions = generateProgramSuggestions(athleteId);

  const statusColors = {
    optimal: 'bg-green-500',
    good: 'bg-blue-500',
    moderate: 'bg-yellow-500',
    fatigued: 'bg-red-500',
    rested: 'bg-purple-500',
  };

  return (
    <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="text-gold-400" size={20} />
        <h3 className="text-white font-bold">READINESS ANALYSIS</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full ${statusColors[readiness.status]} flex items-center justify-center`}>
          <span className="text-2xl font-black text-white">{readiness.score}</span>
        </div>
        <div>
          <p className="text-white font-semibold capitalize">{readiness.status}</p>
          <p className="text-gray-400 text-sm">{readiness.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-carbon-900/50 rounded-lg p-2 text-center">
          <p className="text-gold-400 font-bold">{readiness.avgRPE || 7}</p>
          <p className="text-gray-500 text-xs">Avg RPE</p>
        </div>
        <div className="bg-carbon-900/50 rounded-lg p-2 text-center">
          <p className="text-gold-400 font-bold">{readiness.workoutsThisWeek || 0}</p>
          <p className="text-gray-500 text-xs">This Week</p>
        </div>
        <div className="bg-carbon-900/50 rounded-lg p-2 text-center">
          <p className="text-gold-400 font-bold">{readiness.daysSinceLastWorkout || 0}d</p>
          <p className="text-gray-500 text-xs">Recovery</p>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Recommendations</p>
          {suggestions.map((suggestion, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                suggestion.priority === 'high'
                  ? 'bg-red-500/10 border border-red-500/30'
                  : suggestion.priority === 'medium'
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}
            >
              <span>{suggestion.icon}</span>
              <span className="text-gray-300 text-sm">{suggestion.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Program Suggestions Component - Shows auto-generated program options
const ProgramSuggestionsCard = ({ athleteId, athleteProfile, onSelectProgram }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Small delay to process data
    setTimeout(() => {
      const programSuggestions = getAIProgramSuggestions(athleteId, athleteProfile);
      setSuggestions(programSuggestions);
      setLoading(false);
    }, 500);
  }, [athleteId, athleteProfile]);

  if (loading) {
    return (
      <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-gold-400 animate-pulse" size={20} />
          <h3 className="text-white font-bold">GENERATING PROGRAM OPTIONS...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-carbon-900/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-carbon-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-carbon-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-gold-400" size={20} />
        <h3 className="text-white font-bold">SUGGESTED PROGRAMS</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selectedIndex === i
                ? 'bg-gold-500/20 border border-gold-500/30'
                : 'bg-carbon-900/50 hover:bg-carbon-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-semibold">{suggestion.name}</p>
                <p className="text-gray-400 text-sm">{suggestion.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                suggestion.confidence === 'high'
                  ? 'bg-green-500/20 text-green-400'
                  : suggestion.confidence === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {suggestion.confidence}
              </span>
            </div>
            {suggestion.program && (
              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                <span>{suggestion.program.weeks} weeks</span>
                <span>{suggestion.program.daysPerWeek}x/week</span>
                <span>{suggestion.program.days?.length || 0} training days</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedIndex !== null && suggestions[selectedIndex]?.program && (
        <div className="mt-4 p-4 bg-carbon-900/70 rounded-xl">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Preview</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {suggestions[selectedIndex].program.days?.map((day, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-carbon-700/50 last:border-0">
                <span className="text-white text-sm">{day.name}</span>
                <span className="text-gray-500 text-xs">{day.exercises?.length || 0} exercises</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onSelectProgram?.(suggestions[selectedIndex].program)}
            className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform"
          >
            Use This Program
          </button>
        </div>
      )}
    </div>
  );
};

// Smart Workout Editor Component
const SmartWorkoutCard = ({ athleteId, programDay }) => {
  const [predictedWorkout, setPredictedWorkout] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (programDay) {
      const prediction = generatePredictiveWorkout(athleteId, programDay);
      setPredictedWorkout(prediction);
    }
  }, [athleteId, programDay]);

  if (!predictedWorkout) {
    return (
      <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-gold-400" size={20} />
          <h3 className="text-white font-bold">RECOMMENDED WORKOUT</h3>
        </div>
        <p className="text-gray-400 text-sm">Select a program day to generate predictions</p>
      </div>
    );
  }

  return (
    <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-gold-400" size={20} />
          <h3 className="text-white font-bold">RECOMMENDED WORKOUT</h3>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-gold-400 text-sm font-semibold"
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4">
        {predictedWorkout.exercises?.map((exercise, i) => (
          <div key={i} className="bg-carbon-900/50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-semibold">{exercise.name}</p>
                <p className="text-gray-500 text-sm">{exercise.sets} × {exercise.reps}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  exercise.confidence === 'high'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {exercise.confidence} confidence
              </span>
            </div>

            {exercise.analysis && (
              <div className="mb-3 p-2 bg-carbon-800/50 rounded-lg">
                <p className="text-gold-400 text-sm">{exercise.analysis.progressionNote}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Best: {exercise.analysis.bestWeight} lbs</span>
                  <span>Suggested: {exercise.analysis.suggestedWeight} lbs</span>
                  <span>Trend: {exercise.analysis.volumeTrend}</span>
                </div>
              </div>
            )}

            {exercise.predictedSets && (
              <div className="space-y-2">
                {exercise.predictedSets.map((set, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500 w-12">Set {set.setNumber}</span>
                    {editMode ? (
                      <>
                        <input
                          type="number"
                          defaultValue={set.weight}
                          className="w-16 bg-carbon-700 rounded px-2 py-1 text-white text-center"
                        />
                        <span className="text-gray-500">lbs ×</span>
                        <input
                          type="number"
                          defaultValue={set.reps}
                          className="w-12 bg-carbon-700 rounded px-2 py-1 text-white text-center"
                        />
                      </>
                    ) : (
                      <span className="text-gray-300">
                        {set.weight} lbs × {set.reps} @ RPE {set.targetRPE}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          alert('Workout pushed to athlete! They will receive a notification.');
        }}
        className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform"
      >
        Push to Athlete
      </button>
    </div>
  );
};

// Client Detail View Component
const ClientDetailView = ({ client, onBack, onMessage, onShowOptions }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLocalMessage, setShowLocalMessage] = useState(false);
  const [showLocalOptions, setShowLocalOptions] = useState(false);
  const [showAssignProgram, setShowAssignProgram] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);
  const [coachingTipsExpanded, setCoachingTipsExpanded] = useState(true);

  // Generate smart, psychology-driven coaching suggestions
  const coachingTips = generateSmartMessages(client.id, client.name, {
    goal: client.goal,
    level: client.level,
    status: client.status,
  });

  // Sample program day for demo
  const sampleProgramDay = {
    name: 'Lower Body Strength',
    exercises: [
      { name: 'Back Squat', sets: 4, reps: '5-6' },
      { name: 'Romanian Deadlift', sets: 3, reps: '8-10' },
      { name: 'Leg Press', sets: 3, reps: '10-12' },
    ],
  };

  const handlePushToAthlete = () => {
    setPushSuccess(true);
    setTimeout(() => setPushSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg"
            aria-label="Go back to client list"
          >
            <ChevronLeft size={24} />
            <span>Back</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLocalMessage(true)}
              className="p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Message client"
            >
              <MessageSquare size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => setShowLocalOptions(true)}
              className="p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="More options"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Local Message Modal */}
      {showLocalMessage && (
        <QuickMessageModal
          client={client}
          onClose={() => setShowLocalMessage(false)}
          onSend={() => {}}
        />
      )}

      {/* Local Options Menu */}
      {showLocalOptions && (
        <ClientOptionsMenu
          client={client}
          onClose={() => setShowLocalOptions(false)}
          onMessage={() => {
            setShowLocalOptions(false);
            setShowLocalMessage(true);
          }}
          onAssignProgram={() => {
            setShowLocalOptions(false);
            alert('Program assignment will be available in the next update!');
          }}
          onViewProgress={() => {
            setShowLocalOptions(false);
            setActiveTab('progress');
          }}
        />
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-300 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {client.avatar}
          </div>
          <div>
            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {client.name.toUpperCase()}
            </h1>
            <p className="text-gray-400">Active since {client.startDate}</p>
            <p className="text-gray-500 text-sm">Goal: {client.goal} · {client.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {client.thirtyDay}%
            </p>
            <p className="text-gray-500 text-xs">30-Day</p>
          </div>
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>W3</p>
            <p className="text-gray-500 text-xs">Current</p>
          </div>
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gold-400" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.prs}</p>
            <p className="text-gray-500 text-xs">PRs</p>
          </div>
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>{client.gained}</p>
            <p className="text-gray-500 text-xs">Gained</p>
          </div>
        </div>

        {/* Coaching Tips - Smart AI-Generated Suggestions */}
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-500/20 rounded-2xl mb-6 overflow-hidden">
          <button
            onClick={() => setCoachingTipsExpanded(!coachingTipsExpanded)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="text-gold-400" size={18} />
              <span className="text-gold-400 font-bold text-sm tracking-wider">COACHING TIPS</span>
              <span className="text-gray-500 text-xs ml-2">Based on {client.name.split(' ')[0]}'s data</span>
            </div>
            <ChevronRight
              size={18}
              className={`text-gold-400 transition-transform ${coachingTipsExpanded ? 'rotate-90' : ''}`}
            />
          </button>

          {coachingTipsExpanded && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-gray-400 text-xs mb-3">
                What to say to help {client.name.split(' ')[0]} MAKE GAINS:
              </p>
              {coachingTips.map((tip, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border-l-2 ${
                    tip.priority === 'high'
                      ? 'border-l-red-500 bg-red-500/5'
                      : tip.priority === 'medium'
                      ? 'border-l-yellow-500 bg-yellow-500/5'
                      : 'border-l-blue-500 bg-blue-500/5'
                  }`}
                >
                  <p className="text-gray-200 text-sm leading-relaxed">{tip.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tip.priority === 'high'
                          ? 'bg-red-500'
                          : tip.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <p className="text-gray-500 text-xs">{tip.reason}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowLocalMessage(true)}
                className="w-full mt-3 bg-gold-gradient text-carbon-900 font-bold py-2 rounded-xl text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                Send Message Now
              </button>
            </div>
          )}
        </div>

                {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {['overview', 'progress', 'program'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-gold-gradient text-carbon-900'
                  : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Hidden duplicate removed - was:
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {client.gained}
            </p>
            <p className="text-gray-500 text-xs">Progress</p>
          </div>
          <div className="bg-carbon-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gold-400" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {client.prs}
            </p>
            <p className="text-gray-500 text-xs">PRs</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6" role="tablist">
          {['Overview', 'Smart Plan', 'Workouts', 'Progress', 'Messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              role="tab"
              aria-selected={activeTab === tab.toLowerCase().replace(' ', '-')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'bg-gold-gradient text-carbon-900'
                  : 'bg-carbon-800 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Smart Plan Tab - Analysis */}
        {activeTab === 'smart-plan' && (
          <>
            <AthleteReadinessCard athleteId={client.id} />
            <ProgramSuggestionsCard
              athleteId={client.id}
              athleteProfile={{ goal: client.goal, level: client.level }}
              onSelectProgram={(program) => {
                // In production, this would navigate to ProgramBuilder with pre-filled data
                alert(`Program "${program.name}" selected! This would open in Program Builder.`);
              }}
            />
            <SmartWorkoutCard athleteId={client.id} programDay={sampleProgramDay} />
          </>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
        <>
        <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
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
                <div className="flex-1 h-3 bg-carbon-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      week.current ? 'bg-gradient-to-r from-gold-500 to-gold-300' : 'bg-green-500'
                    }`}
                    style={{ width: `${week.progress}%` }}
                  />
                </div>
                <span className={`text-sm ${week.current ? 'text-gold-400' : 'text-gray-400'}`}>
                  {week.completed}/{week.total}
                  {week.current && ' ←'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-carbon-800/50 rounded-2xl p-5 mb-6">
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
                  <span className="text-gray-300">
                    {lift.from} → {lift.to}{' '}
                    <span className="text-green-400">(+{lift.change}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-carbon-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                    style={{ width: `${(lift.to / 400) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAssignProgram(true)}
          className="w-full bg-gold-gradient text-carbon-900 font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-900"
        >
          Assign New Program
        </button>
        </>
        )}
      </div>

      {/* Assign Program Modal */}
      {showAssignProgram && (
        <AssignProgramModal
          client={client}
          onClose={() => setShowAssignProgram(false)}
          onAssign={(program) => {
            // In a real app, this would update the client's program
            alert(`${program.name} assigned to ${client.name}!`);
          }}
        />
      )}
    </div>
  );
};

// Quick Message Modal Component - Now with AI-generated smart suggestions
const QuickMessageModal = ({ client, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Generate smart messages based on athlete's context
  const smartMessages = generateSmartMessages(client.id, client.name, {
    goal: client.goal,
    level: client.level,
    status: client.status,
  });

  const handleSend = () => {
    if (!message.trim()) return;
    addMessage({
      senderId: 'coach',
      recipientId: client.id,
      text: message.trim(),
      read: false,
    });
    setSent(true);
    onSend?.(message);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Priority color coding
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {client.avatar}
            </div>
            <div>
              <p className="text-white font-semibold">{client.name}</p>
              <p className="text-gray-500 text-sm">Send a message</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Message Sent!</p>
            <p className="text-gray-400 text-sm mt-1">{client.name} will be notified</p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            {/* Smart AI-Generated Suggestions */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-gold-400" />
                <p className="text-gold-400 text-sm font-semibold">Smart Suggestions</p>
              </div>
              {smartMessages.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(suggestion.message)}
                  className={`w-full text-left p-3 rounded-xl border-l-2 transition-all hover:scale-[1.01] ${getPriorityColor(suggestion.priority)} ${message === suggestion.message ? 'ring-2 ring-gold-500' : ''}`}
                >
                  <p className="text-gray-200 text-sm">{suggestion.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${getPriorityDot(suggestion.priority)}`} />
                    <p className="text-gray-500 text-xs">{suggestion.reason}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-carbon-700 pt-4 mt-4">
              <p className="text-gray-500 text-xs mb-2">Or write your own:</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Client Modal Component
const AddClientModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: 'General Fitness',
    level: 'Beginner',
  });
  const [added, setAdded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newClient = {
      id: `client_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      program: 'No Program',
      sevenDay: 0,
      thirtyDay: 0,
      status: 'good',
      goal: formData.goal,
      level: formData.level,
      startDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      prs: 0,
      gained: '0 lbs',
    };

    onAdd(newClient);
    setAdded(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="text-gold-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Add New Client</p>
              <p className="text-gray-500 text-sm">Invite an athlete to your roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {added ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Client Added!</p>
            <p className="text-gray-400 text-sm mt-1">Invitation sent to {formData.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50"
                >
                  <option>General Fitness</option>
                  <option>Strength</option>
                  <option>Muscle Gain</option>
                  <option>Fat Loss</option>
                  <option>Athletic Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500/50"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform mt-4"
            >
              Send Invitation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Assign Program Modal Component
const AssignProgramModal = ({ client, onClose, onAssign }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [assigned, setAssigned] = useState(false);

  const programs = [
    { id: 1, name: 'Beginner Strength', weeks: 4, days: 3, focus: 'Full Body' },
    { id: 2, name: 'Intermediate Hypertrophy', weeks: 6, days: 4, focus: 'Upper/Lower' },
    { id: 3, name: '4-Week Strength Block', weeks: 4, days: 4, focus: 'Compound Lifts' },
    { id: 4, name: 'Athletic Performance', weeks: 8, days: 5, focus: 'Power & Speed' },
    { id: 5, name: 'Fat Loss Circuit', weeks: 6, days: 4, focus: 'HIIT + Weights' },
  ];

  const handleAssign = () => {
    if (!selectedProgram) return;
    onAssign?.(selectedProgram);
    setAssigned(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <Clipboard className="text-gold-400" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold">Assign Program</p>
              <p className="text-gray-500 text-sm">for {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {assigned ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clipboard className="text-green-400" size={28} />
            </div>
            <p className="text-white font-semibold text-lg">Program Assigned!</p>
            <p className="text-gray-400 text-sm mt-1">{selectedProgram?.name} sent to {client.name}</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">Select a program:</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program)}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${
                    selectedProgram?.id === program.id
                      ? 'bg-gold-500/20 border border-gold-500/30'
                      : 'bg-carbon-800 hover:bg-carbon-700'
                  }`}
                >
                  <p className="text-white font-semibold">{program.name}</p>
                  <p className="text-gray-500 text-sm">
                    {program.weeks} weeks · {program.days}x/week · {program.focus}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleAssign}
              disabled={!selectedProgram}
              className="w-full mt-4 bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Assign Program
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Client Options Menu Component
const ClientOptionsMenu = ({ client, onClose, onMessage, onAssignProgram, onViewProgress }) => {
  const options = [
    { icon: MessageSquare, label: 'Send Message', action: onMessage },
    { icon: Clipboard, label: 'Assign Program', action: onAssignProgram },
    { icon: BarChart3, label: 'View Progress', action: onViewProgress },
    { icon: Video, label: 'Request Form Check', action: () => { onClose(); alert('Form check request sent!'); } },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-carbon-900 rounded-t-3xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="p-4 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {client.avatar}
            </div>
            <p className="text-white font-semibold">{client.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-carbon-800 rounded-xl">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={option.action}
              className="w-full flex items-center gap-4 p-4 bg-carbon-800 hover:bg-carbon-700 rounded-xl transition-colors"
            >
              <option.icon className="text-gold-400" size={20} />
              <span className="text-white font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full p-4 bg-carbon-800 hover:bg-carbon-700 rounded-xl text-gray-400 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Coach Dashboard
const CoachDashboard = ({ onNavigate }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(defaultClients);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  // Modal states
  const [showVideoManager, setShowVideoManager] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [messageClient, setMessageClient] = useState(null);
  const [assignProgramClient, setAssignProgramClient] = useState(null);
  const [optionsMenuClient, setOptionsMenuClient] = useState(null);
  const [showWorkoutsSummary, setShowWorkoutsSummary] = useState(false);
  const [filterNeedsAttention, setFilterNeedsAttention] = useState(false);

  // Track which quick messages have been sent (for inline confirmation)
  const [sentMessages, setSentMessages] = useState({});

  useEffect(() => {
    // Load athletes from localStorage
    const storedAthletes = getAthletes();
    if (storedAthletes.length > 0) {
      // Map stored athletes to client format
      const mappedClients = storedAthletes.map(a => ({
        id: a.id,
        name: a.name,
        program: a.currentProgram || 'No Program',
        sevenDay: a.weeklyProgress ? Math.round((a.weeklyProgress / a.weeklyTarget) * 100) : 0,
        thirtyDay: Math.floor(Math.random() * 40) + 60,
        status: a.status === 'needs_attention' ? 'alert' : a.status === 'active' ? 'good' : 'watch',
        avatar: a.avatar || a.name.split(' ').map(n => n[0]).join(''),
        goal: 'General Fitness',
        level: 'Intermediate',
        startDate: new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        prs: Math.floor(Math.random() * 5) + 1,
        gained: `${Math.floor(Math.random() * 15) - 5} lbs`,
        streak: a.streak || 0,
      }));
      setClients(mappedClients);
    }

    // Load recent workouts
    const workouts = getWorkouts();
    setRecentWorkouts(workouts.slice(-4).reverse());
  }, []);

  if (selectedClient) {
    return <ClientDetailView client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="STS" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
              <p className="text-gray-400 text-xs">COACH DASHBOARD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Notifications, 3 unread"
            >
              <Bell size={20} className="text-gray-400" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-white font-bold">
              MS
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-400 text-sm">Today's Overview</p>
          <p className="text-white text-xl font-bold">December 5, 2025</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setShowWorkoutsSummary(true)}
            className="bg-carbon-800/50 rounded-2xl p-4 text-center hover:bg-carbon-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <BarChart3 className="text-blue-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              18/24
            </p>
            <p className="text-gray-400 text-xs">Workouts Done</p>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('formchecks')}
            className="bg-carbon-800/50 rounded-2xl p-4 text-center hover:bg-carbon-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <Video className="text-purple-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              5
            </p>
            <p className="text-gray-400 text-xs">Form Checks</p>
          </button>
          <button
            onClick={() => setFilterNeedsAttention(!filterNeedsAttention)}
            className={`rounded-2xl p-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              filterNeedsAttention ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'bg-carbon-800/50 hover:bg-carbon-700/50'
            }`}
          >
            <AlertTriangle className="text-yellow-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              3
            </p>
            <p className="text-gray-400 text-xs">Need Attention</p>
          </button>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" aria-hidden="true" />
              NEEDS ATTENTION
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Sparkles size={12} className="text-gold-400" />
              Smart suggestions ready
            </div>
          </div>
          <div className="space-y-3">
            {/* Sarah - No Login Alert */}
            <div className="bg-carbon-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-red-400" aria-hidden="true">🔴</span>
                  <div>
                    <button
                      onClick={() => {
                        const sarah = clients.find(c => c.name.includes('Sarah')) || { id: 'sarah', name: 'Sarah Martinez', avatar: 'SM', goal: 'Fat Loss', level: 'Beginner', status: 'alert' };
                        setSelectedClient(sarah);
                      }}
                      className="text-white font-medium hover:text-gold-400 transition-colors text-left"
                    >
                      Sarah Martinez
                    </button>
                    <p className="text-gray-500 text-sm">No login in 7 days</p>
                  </div>
                </div>
                <button
                  onClick={() => setMessageClient({ id: 'sarah', name: 'Sarah Martinez', avatar: 'SM', goal: 'Fat Loss', level: 'Beginner', status: 'alert' })}
                  className="bg-gold-500/20 text-gold-400 px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  Message
                </button>
              </div>
              {/* Smart Message Preview with Send Button */}
              <div className="bg-carbon-800/50 rounded-lg p-3 border-l-2 border-gold-500">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gold-400 mb-1 flex items-center gap-1">
                      <Sparkles size={10} />
                      Suggested message:
                    </p>
                    <p className="text-gray-300 text-sm italic">
                      "Hey! Just checking in - hope everything's okay. No pressure, but I'm here whenever you're ready to get back at it."
                    </p>
                  </div>
                  {sentMessages.sarah ? (
                    <div className="flex-shrink-0 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Check size={12} />
                      Sent
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addMessage({
                          senderId: 'coach',
                          recipientId: 'sarah',
                          text: "Hey! Just checking in - hope everything's okay. No pressure, but I'm here whenever you're ready to get back at it.",
                          read: false,
                        });
                        setSentMessages(prev => ({ ...prev, sarah: true }));
                      }}
                      className="flex-shrink-0 bg-gold-500 hover:bg-gold-400 text-carbon-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Send size={12} />
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Jake - Compliance Drop Alert */}
            <div className="bg-carbon-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400" aria-hidden="true">🟠</span>
                  <div>
                    <button
                      onClick={() => {
                        const jake = clients.find(c => c.name.includes('Jake')) || { id: 'jake', name: 'Jake Thompson', avatar: 'JT', goal: 'Athletic Performance', level: 'Intermediate', status: 'watch' };
                        setSelectedClient(jake);
                      }}
                      className="text-white font-medium hover:text-gold-400 transition-colors text-left"
                    >
                      Jake Thompson
                    </button>
                    <p className="text-gray-500 text-sm">Compliance dropped 40%</p>
                  </div>
                </div>
                <button
                  onClick={() => setMessageClient({ id: 'jake', name: 'Jake Thompson', avatar: 'JT', goal: 'Athletic Performance', level: 'Intermediate', status: 'watch' })}
                  className="bg-gold-500/20 text-gold-400 px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  Message
                </button>
              </div>
              {/* Smart Message Preview with Send Button */}
              <div className="bg-carbon-800/50 rounded-lg p-3 border-l-2 border-yellow-500">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-yellow-400 mb-1 flex items-center gap-1">
                      <Sparkles size={10} />
                      Suggested message:
                    </p>
                    <p className="text-gray-300 text-sm italic">
                      "I noticed workouts have been tougher to fit in lately. Want to chat about adjusting your schedule? Sometimes less is more."
                    </p>
                  </div>
                  {sentMessages.jake ? (
                    <div className="flex-shrink-0 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Check size={12} />
                      Sent
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addMessage({
                          senderId: 'coach',
                          recipientId: 'jake',
                          text: "I noticed workouts have been tougher to fit in lately. Want to chat about adjusting your schedule? Sometimes less is more.",
                          read: false,
                        });
                        setSentMessages(prev => ({ ...prev, jake: true }));
                      }}
                      className="flex-shrink-0 bg-gold-500 hover:bg-gold-400 text-carbon-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Send size={12} />
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-carbon-800/30 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            {[
              {
                icon: '🏋️',
                name: 'John D.',
                clientId: 1,
                actionText: 'completed',
                actionLink: { type: 'workout', label: 'Week 3 Day 2' },
                time: '2 min ago'
              },
              {
                icon: '🎥',
                name: 'Emma S.',
                clientId: 2,
                actionText: 'uploaded form check',
                actionLink: { type: 'exercise', label: 'Squat' },
                time: '15 min ago'
              },
              {
                icon: '💬',
                name: 'Alex R.',
                clientId: null,
                actionText: null,
                actionLink: { type: 'message', label: 'sent a message', preview: 'Hey coach, quick question about my squat form...' },
                time: '1 hour ago'
              },
              {
                icon: '✅',
                name: 'Chris P.',
                clientId: null,
                actionText: 'logged new 1RM',
                actionLink: { type: 'exercise', label: 'Deadlift' },
                time: '2 hours ago'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-carbon-700/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                  <p className="text-gray-300 text-sm">
                    <button
                      onClick={() => {
                        const client = clients.find(c => c.id === item.clientId || c.name.includes(item.name.split(' ')[0]));
                        if (client) setSelectedClient(client);
                      }}
                      className="text-white font-medium hover:text-gold-400 transition-colors"
                    >
                      {item.name}
                    </button>
                    {' '}{item.actionText && <span>{item.actionText} </span>}
                    <button
                      onClick={() => {
                        // Handle action link click
                        if (item.actionLink.type === 'message') {
                          const client = clients.find(c => c.name.includes(item.name.split(' ')[0]));
                          if (client) setMessageClient(client);
                        } else if (item.actionLink.type === 'exercise') {
                          alert(`View ${item.actionLink.label} details - coming soon!`);
                        } else if (item.actionLink.type === 'workout') {
                          const client = clients.find(c => c.id === item.clientId);
                          if (client) setSelectedClient(client);
                        }
                      }}
                      className="text-gold-400 hover:text-gold-300 transition-colors hover:underline"
                    >
                      {item.actionLink.type === 'message' ? item.actionLink.label : `"${item.actionLink.label}"`}
                    </button>
                  </p>
                </div>
                <p className="text-gray-500 text-xs">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setShowVideoManager(true)}
            className="flex items-center gap-2 px-4 py-2 bg-carbon-800 hover:bg-carbon-700 rounded-xl text-gray-300 text-sm font-medium whitespace-nowrap transition-colors"
          >
            <Film size={16} className="text-gold-400" />
            Manage Videos
          </button>
          <button
            onClick={() => setShowAddClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-carbon-800 hover:bg-carbon-700 rounded-xl text-gray-300 text-sm font-medium whitespace-nowrap transition-colors"
          >
            <UserPlus size={16} className="text-gold-400" />
            Add Client
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">
              {filterNeedsAttention ? 'CLIENTS NEEDING ATTENTION' : 'ALL CLIENTS'}
              {filterNeedsAttention && (
                <button
                  onClick={() => setFilterNeedsAttention(false)}
                  className="ml-2 text-xs text-gray-400 hover:text-white"
                >
                  (show all)
                </button>
              )}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddClient(true)}
                className="p-2 bg-gradient-to-r from-gold-500 to-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Add new client"
              >
                <Plus size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {clients
              .filter(client => filterNeedsAttention ? (client.status === 'alert' || client.status === 'watch') : true)
              .map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="w-full bg-carbon-800/50 hover:bg-carbon-800 rounded-2xl p-4 flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                    {client.avatar}
                  </div>
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
                  <span aria-label={`Status: ${client.status}`}>{getStatusIcon(client.status)}</span>
                  <ChevronRight className="text-gray-500" size={20} aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <VideoManager
        isOpen={showVideoManager}
        onClose={() => setShowVideoManager(false)}
      />

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onAdd={(newClient) => {
            setClients(prev => [...prev, newClient]);
          }}
        />
      )}

      {messageClient && (
        <QuickMessageModal
          client={messageClient}
          onClose={() => setMessageClient(null)}
          onSend={() => {}}
        />
      )}

      {assignProgramClient && (
        <AssignProgramModal
          client={assignProgramClient}
          onClose={() => setAssignProgramClient(null)}
          onAssign={(program) => {
            setClients(prev =>
              prev.map(c =>
                c.id === assignProgramClient.id
                  ? { ...c, program: program.name }
                  : c
              )
            );
          }}
        />
      )}

      {optionsMenuClient && (
        <ClientOptionsMenu
          client={optionsMenuClient}
          onClose={() => setOptionsMenuClient(null)}
          onMessage={() => {
            setOptionsMenuClient(null);
            setMessageClient(optionsMenuClient);
          }}
          onAssignProgram={() => {
            setOptionsMenuClient(null);
            setAssignProgramClient(optionsMenuClient);
          }}
          onViewProgress={() => {
            setOptionsMenuClient(null);
            setSelectedClient(optionsMenuClient);
          }}
        />
      )}

      {/* Workouts Summary Modal */}
      {showWorkoutsSummary && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Today's Workouts</h3>
              <button
                onClick={() => setShowWorkoutsSummary(false)}
                className="p-2 hover:bg-carbon-700 rounded-xl"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-5xl font-black text-gold-400" style={{ fontFamily: 'Oswald, sans-serif' }}>18/24</p>
              <p className="text-gray-400 text-sm">Workouts Completed</p>
            </div>

            <div className="space-y-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Completed Today</p>
              {[
                { name: 'John D.', workout: 'Week 3 Day 2', time: '2 min ago' },
                { name: 'Emma S.', workout: 'Week 4 Day 1', time: '1 hr ago' },
                { name: 'Maria L.', workout: 'Week 2 Day 3', time: '3 hrs ago' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const client = clients.find(c => c.name.includes(item.name.split(' ')[0]));
                    if (client) {
                      setShowWorkoutsSummary(false);
                      setSelectedClient(client);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 bg-carbon-900/50 rounded-xl hover:bg-carbon-700 transition-colors text-left"
                >
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.workout}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{item.time}</span>
                    <Check className="text-green-400" size={16} />
                  </div>
                </button>
              ))}

              <p className="text-gray-400 text-xs uppercase tracking-wider mt-4 mb-2">Pending Today</p>
              {[
                { name: 'Sarah M.', workout: 'Week 1 Day 4', status: 'alert' },
                { name: 'Jake T.', workout: 'Week 3 Day 1', status: 'watch' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const client = clients.find(c => c.name.includes(item.name.split(' ')[0]));
                    if (client) {
                      setShowWorkoutsSummary(false);
                      setMessageClient(client);
                    }
                  }}
                  className="w-full flex items-center justify-between p-3 bg-carbon-900/50 rounded-xl hover:bg-carbon-700 transition-colors text-left"
                >
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.workout}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status === 'alert' ? 'Overdue' : 'Scheduled'}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWorkoutsSummary(false)}
              className="w-full mt-6 bg-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
