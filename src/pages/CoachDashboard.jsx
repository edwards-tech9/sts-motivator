import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Plus, AlertTriangle, BarChart3, Video, MessageSquare, Menu, ChevronLeft } from 'lucide-react';
import { getAthletes, getWorkouts } from '../services/localStorage';

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

// Client Detail View Component
const ClientDetailView = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-carbon-900 via-carbon-950 to-black pb-24">
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
              className="p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Message client"
            >
              <MessageSquare size={20} className="text-gray-400" />
            </button>
            <button
              className="p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="More options"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

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
          {['Overview', 'Workouts', 'Progress', 'Messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              role="tab"
              aria-selected={activeTab === tab.toLowerCase()}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                activeTab === tab.toLowerCase()
                  ? 'bg-gold-gradient text-carbon-900'
                  : 'bg-carbon-800 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

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

        <button className="w-full bg-gold-gradient text-carbon-900 font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-carbon-900">
          Assign New Program
        </button>
      </div>
    </div>
  );
};

// Main Coach Dashboard
const CoachDashboard = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(defaultClients);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

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
    <div className="min-h-screen bg-gradient-to-b from-carbon-900 via-carbon-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
            <p className="text-gray-400 text-xs">COACH DASHBOARD</p>
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
          <div className="bg-carbon-800/50 rounded-2xl p-4 text-center">
            <BarChart3 className="text-blue-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              18/24
            </p>
            <p className="text-gray-400 text-xs">Workouts Done</p>
          </div>
          <div className="bg-carbon-800/50 rounded-2xl p-4 text-center">
            <Video className="text-purple-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              5
            </p>
            <p className="text-gray-400 text-xs">Form Checks</p>
          </div>
          <div className="bg-carbon-800/50 rounded-2xl p-4 text-center">
            <AlertTriangle className="text-yellow-400 mx-auto mb-2" size={28} aria-hidden="true" />
            <p className="text-3xl font-black text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              3
            </p>
            <p className="text-gray-400 text-xs">Need Attention</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" aria-hidden="true" />
              NEEDS ATTENTION
            </h2>
            <ChevronRight className="text-gray-500" size={20} aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-carbon-900/50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-red-400" aria-hidden="true">🔴</span>
                <div>
                  <p className="text-white font-medium">Sarah M.</p>
                  <p className="text-gray-500 text-sm">No login in 7 days</p>
                </div>
              </div>
              <button className="bg-gold-500/20 text-gold-400 px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400">
                Message
              </button>
            </div>
            <div className="flex items-center justify-between bg-carbon-900/50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400" aria-hidden="true">🟠</span>
                <div>
                  <p className="text-white font-medium">Jake T.</p>
                  <p className="text-gray-500 text-sm">Compliance dropped 40%</p>
                </div>
              </div>
              <button className="bg-carbon-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400">
                View
              </button>
            </div>
          </div>
        </div>

        <div className="bg-carbon-800/30 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            {[
              { icon: '🏋️', text: 'John D. completed "Week 3 Day 2"', time: '2 min ago' },
              { icon: '🎥', text: 'Emma S. uploaded form check (Squat)', time: '15 min ago' },
              { icon: '💬', text: 'Alex R. sent a message', time: '1 hour ago' },
              { icon: '✅', text: 'Chris P. logged new 1RM (Deadlift)', time: '2 hours ago' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-carbon-700/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
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
              <button
                className="p-2 bg-gradient-to-r from-gold-500 to-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Add new client"
              >
                <Plus size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {clients.map((client) => (
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
    </div>
  );
};

export default CoachDashboard;
