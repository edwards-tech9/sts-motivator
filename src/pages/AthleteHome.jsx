import { useState } from 'react';
import { Play, Trophy, BarChart3, MessageSquare, Dumbbell, Target, TrendingUp, Award, Flame, Gift, Users } from 'lucide-react';
import StreakDisplay from '../components/dashboard/StreakDisplay';
import { PageTransition, SlideIn, ScaleIn, AnimatedButton, StaggerContainer } from '../components/ui/AnimatedComponents';
import XPDisplay from '../components/gamification/XPDisplay';
import WeeklyChallenge from '../components/gamification/WeeklyChallenge';
import BadgeGrid from '../components/gamification/BadgeGrid';
import DailyQuests from '../components/gamification/DailyQuests';
import Leaderboard from '../components/gamification/Leaderboard';
import BodyMetricsTracker from '../components/tracking/BodyMetricsTracker';
import { getGamificationState, getStreakStatus } from '../services/gamificationService';

const AthleteHome = ({ onStartWorkout, userName = 'Dadward' }) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const gamificationState = getGamificationState();
  const streakStatus = getStreakStatus();

  return (
  <PageTransition>
    <div className="min-h-screen pb-32">
      <header className="p-6">
        <SlideIn direction="down" delay={0}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Scullin Training Systems" className="w-14 h-14 object-contain" />
              <div>
                <p className="text-gray-400 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-bold text-white">{userName}</h1>
              </div>
            </div>
            <div
              className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center text-carbon-900 font-bold"
              aria-label="User avatar"
            >
              {userName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </SlideIn>

        {/* XP Display */}
        <SlideIn delay={50}>
          <div className="mt-4">
            <XPDisplay compact />
          </div>
        </SlideIn>

        {/* Daily/Weekly Goal Progress */}
        <SlideIn delay={75}>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Daily Goal */}
            <div className="bg-carbon-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Target size={14} className="text-green-400" />
                  <span className="text-xs text-gray-400">Daily</span>
                </div>
                <span className={`text-xs font-semibold ${
                  (gamificationState.dailyXP?.earned || 0) >= (gamificationState.dailyXP?.goal || 200)
                    ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {gamificationState.dailyXP?.earned || 0}/{gamificationState.dailyXP?.goal || 200}
                </span>
              </div>
              <div className="h-1.5 bg-carbon-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (gamificationState.dailyXP?.earned || 0) >= (gamificationState.dailyXP?.goal || 200)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}
                  style={{ width: `${Math.min(100, ((gamificationState.dailyXP?.earned || 0) / (gamificationState.dailyXP?.goal || 200)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-carbon-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-purple-400" />
                  <span className="text-xs text-gray-400">Weekly</span>
                </div>
                <span className={`text-xs font-semibold ${
                  (gamificationState.weeklyXP?.earned || 0) >= (gamificationState.weeklyXP?.goal || 1000)
                    ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {gamificationState.weeklyXP?.earned || 0}/{gamificationState.weeklyXP?.goal || 1000}
                </span>
              </div>
              <div className="h-1.5 bg-carbon-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (gamificationState.weeklyXP?.earned || 0) >= (gamificationState.weeklyXP?.goal || 1000)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-purple-500 to-purple-400'
                  }`}
                  style={{ width: `${Math.min(100, ((gamificationState.weeklyXP?.earned || 0) / (gamificationState.weeklyXP?.goal || 1000)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </SlideIn>

        {/* Streak Warning or Milestone */}
        {streakStatus.atRisk && (
          <SlideIn delay={85}>
            <div className="mt-3 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-center gap-3">
              <Flame className="text-orange-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-orange-400 font-semibold text-sm">Streak at risk!</p>
                <p className="text-gray-400 text-xs">Complete a workout today to keep your {streakStatus.currentStreak}-day streak alive</p>
              </div>
            </div>
          </SlideIn>
        )}

        {streakStatus.nextMilestone && !streakStatus.atRisk && streakStatus.daysToNextMilestone <= 3 && (
          <SlideIn delay={85}>
            <div className="mt-3 bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 flex items-center gap-3">
              <Trophy className="text-gold-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-gold-400 font-semibold text-sm">{streakStatus.daysToNextMilestone} days to {streakStatus.nextMilestone.name}!</p>
                <p className="text-gray-400 text-xs">Keep going for +{streakStatus.nextMilestone.xp} XP bonus</p>
              </div>
            </div>
          </SlideIn>
        )}

        <SlideIn delay={100}>
          <div className="mt-4">
            <StreakDisplay streak={gamificationState.streakDays || 8} weeklyTarget={4} weeklyCompleted={gamificationState.stats?.workoutsThisWeek || 2} />
          </div>
        </SlideIn>

        <ScaleIn delay={200}>
          <div className="mt-6">
          <div className="bg-gradient-to-br from-carbon-800 to-carbon-900 rounded-3xl p-6 border border-gold-500/20 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gold-400 font-semibold text-sm">TODAY'S WORKOUT</p>
                <h2
                  className="text-2xl font-black text-white mt-1"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  LOWER BODY
                </h2>
                <p className="text-gray-400 text-sm">Week 3 · Day 1 · Strength</p>
              </div>
              <div className="bg-gold-500/20 px-3 py-1 rounded-full">
                <span className="text-gold-400 text-sm font-semibold">~55 min</span>
              </div>
            </div>

            <StaggerContainer staggerDelay={75} className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <Dumbbell className="text-gray-400 mx-auto mb-1" size={20} aria-hidden="true" />
                <p className="text-white font-bold">5</p>
                <p className="text-gray-500 text-xs">Exercises</p>
              </div>
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <Target className="text-gray-400 mx-auto mb-1" size={20} aria-hidden="true" />
                <p className="text-white font-bold">17</p>
                <p className="text-gray-500 text-xs">Total Sets</p>
              </div>
              <div className="bg-carbon-900/50 rounded-xl p-3 text-center">
                <TrendingUp className="text-gray-400 mx-auto mb-1" size={20} aria-hidden="true" />
                <p className="text-white font-bold">+5%</p>
                <p className="text-gray-500 text-xs">Vol. Target</p>
              </div>
            </StaggerContainer>

            <AnimatedButton
              onClick={onStartWorkout}
              className="w-full bg-gold-gradient text-carbon-900 font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-gold flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-800"
            >
              <Play size={24} fill="currentColor" aria-hidden="true" />
              START WORKOUT
            </AnimatedButton>
          </div>
          </div>
        </ScaleIn>

        <StaggerContainer staggerDelay={100} className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-carbon-800/50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="text-yellow-400" size={24} aria-hidden="true" />
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
          <div className="bg-carbon-800/50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="text-blue-400" size={24} aria-hidden="true" />
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
        </StaggerContainer>

        <SlideIn delay={400}>
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="text-blue-400" size={20} aria-hidden="true" />
              <p className="text-white font-bold">Coach Notes</p>
            </div>
            <p className="text-gray-300 text-sm">
              "Great progress on your squat depth last week! Focus on controlled eccentrics today. If anything
              feels off, drop weight 10% and prioritize form."
            </p>
            <p className="text-gray-500 text-xs mt-2">— Coach Mike, 2 days ago</p>
          </div>
        </SlideIn>

        {/* Body Metrics Tracking */}
        <SlideIn delay={410}>
          <div className="mt-6">
            <BodyMetricsTracker userId="demo" />
          </div>
        </SlideIn>

        {/* Daily Quests */}
        <SlideIn delay={425}>
          <div className="mt-6">
            <button
              onClick={() => setShowQuests(!showQuests)}
              className="w-full flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 hover:from-purple-500/20 hover:to-blue-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <div className="flex items-center gap-3">
                <Gift className="text-purple-400" size={24} />
                <div className="text-left">
                  <p className="text-white font-bold">Daily Quests</p>
                  <p className="text-gray-400 text-sm">Complete for bonus XP</p>
                </div>
              </div>
              <span className="text-gray-400">{showQuests ? '▲' : '▼'}</span>
            </button>
            {showQuests && (
              <div className="mt-3 bg-carbon-800/30 rounded-2xl p-4">
                <DailyQuests />
              </div>
            )}
          </div>
        </SlideIn>

        {/* Weekly Challenge */}
        <SlideIn delay={450}>
          <div className="mt-6">
            <WeeklyChallenge />
          </div>
        </SlideIn>

        {/* Leaderboard */}
        <SlideIn delay={475}>
          <div className="mt-6">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="w-full flex items-center justify-between bg-carbon-800/50 rounded-2xl p-4 hover:bg-carbon-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <div className="flex items-center gap-3">
                <Users className="text-orange-400" size={24} />
                <div className="text-left">
                  <p className="text-white font-bold">Leaderboard</p>
                  <p className="text-gray-500 text-sm">See how you rank</p>
                </div>
              </div>
              <span className="text-gray-400">{showLeaderboard ? '▲' : '▼'}</span>
            </button>
            {showLeaderboard && (
              <div className="mt-3 bg-carbon-800/30 rounded-2xl p-4">
                <Leaderboard />
              </div>
            )}
          </div>
        </SlideIn>

        {/* Badges Section */}
        <SlideIn delay={500}>
          <div className="mt-6">
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="w-full flex items-center justify-between bg-carbon-800/50 rounded-2xl p-4 hover:bg-carbon-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <div className="flex items-center gap-3">
                <Award className="text-gold-400" size={24} />
                <div className="text-left">
                  <p className="text-white font-bold">Achievements</p>
                  <p className="text-gray-500 text-sm">{gamificationState.badges?.length || 0} badges earned</p>
                </div>
              </div>
              <span className="text-gray-400">{showBadges ? '▲' : '▼'}</span>
            </button>
            {showBadges && (
              <div className="mt-3 bg-carbon-800/30 rounded-2xl p-4">
                <BadgeGrid />
              </div>
            )}
          </div>
        </SlideIn>
      </header>
    </div>
  </PageTransition>
  );
};

export default AthleteHome;
