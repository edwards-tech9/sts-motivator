import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/layout/BottomNav';
import AthleteHome from './pages/AthleteHome';
import Workout from './pages/Workout';
import CoachDashboard from './pages/CoachDashboard';
import Settings from './pages/Settings';

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

  const handleLogout = () => {
    // Will be implemented with Firebase auth
    console.log('Logout clicked');
  };

  const renderContent = () => {
    // Settings page (both roles)
    if (activeTab === 'settings') {
      return <Settings userRole={userRole} onLogout={handleLogout} />;
    }

    // Coach views
    if (userRole === 'coach') {
      return <CoachDashboard />;
    }

    // Athlete views
    if (inWorkout) {
      return (
        <Workout
          techMode={techMode}
          onToggleTechMode={() => setTechMode(!techMode)}
          onExit={() => setInWorkout(false)}
        />
      );
    }

    return <AthleteHome onStartWorkout={() => setInWorkout(true)} />;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Role Switcher - Demo only, remove in production */}
        <div className="fixed top-4 right-4 z-[100]">
          <button
            onClick={handleRoleSwitch}
            className="bg-slate-800/90 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold border border-slate-700 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label={`Switch to ${userRole === 'athlete' ? 'coach' : 'athlete'} view`}
          >
            {userRole === 'athlete' ? '👤 Coach View' : '🏋️ Athlete View'}
          </button>
        </div>

        {renderContent()}

        {!inWorkout && (
          <BottomNav
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            userRole={userRole}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
