import { Play, Trophy, BarChart3, MessageSquare, Dumbbell, Target, TrendingUp } from 'lucide-react';
import StreakDisplay from '../components/dashboard/StreakDisplay';
import { PageTransition, SlideIn, ScaleIn, AnimatedButton, StaggerContainer } from '../components/ui/AnimatedComponents';

const AthleteHome = ({ onStartWorkout, userName = 'John' }) => (
  <PageTransition>
    <div className="min-h-screen bg-gradient-to-b from-carbon-900 via-carbon-950 to-black pb-24">
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

        <SlideIn delay={100}>
          <StreakDisplay streak={8} weeklyTarget={4} weeklyCompleted={2} />
        </SlideIn>

        <ScaleIn delay={200}>
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
      </header>
    </div>
  </PageTransition>
);

export default AthleteHome;
