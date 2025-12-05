import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/layout/BottomNav';
import AthleteHome from './pages/AthleteHome';
import Workout from './pages/Workout';
import WorkoutHistory from './pages/WorkoutHistory';
import CoachDashboard from './pages/CoachDashboard';
import ProgramBuilder from './pages/ProgramBuilder';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Loading spinner component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
        <span className="text-white text-xl font-black" style={{ fontFamily: 'Oswald, sans-serif' }}>
          STS
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// Main app content (after auth check)
const AppContent = () => {
  const { user, userData, loading, logout, isCoach } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [inWorkout, setInWorkout] = useState(false);
  const [techMode, setTechMode] = useState(false);

  // Demo mode state (for switching between roles without auth)
  const [demoMode, setDemoMode] = useState(!import.meta.env.VITE_FIREBASE_API_KEY);
  const [demoRole, setDemoRole] = useState('athlete');

  // Show loading screen while checking auth
  if (loading && !demoMode) {
    return <LoadingScreen />;
  }

  // Show login if not authenticated (and not in demo mode)
  if (!user && !demoMode) {
    return <Login />;
  }

  // Determine current role
  const userRole = demoMode ? demoRole : (isCoach ? 'coach' : 'athlete');

  const handleRoleSwitch = () => {
    if (demoMode) {
      const newRole = demoRole === 'athlete' ? 'coach' : 'athlete';
      setDemoRole(newRole);
      setActiveTab(newRole === 'coach' ? 'dashboard' : 'home');
    }
    setInWorkout(false);
  };

  const handleLogout = () => {
    if (demoMode) {
      setDemoMode(false);
    } else {
      logout();
    }
  };

  const renderContent = () => {
    // Settings page (both roles)
    if (activeTab === 'settings') {
      return <Settings userRole={userRole} onLogout={handleLogout} />;
    }

    // Progress/History page (athlete)
    if (activeTab === 'progress' && userRole === 'athlete') {
      return <WorkoutHistory />;
    }

    // Programs page (coach - Program Builder)
    if (activeTab === 'programs' && userRole === 'coach') {
      return <ProgramBuilder />;
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

    return (
      <AthleteHome
        onStartWorkout={() => setInWorkout(true)}
        userName={userData?.displayName || 'Athlete'}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Demo Mode / Role Switcher */}
      {demoMode && (
        <div className="fixed top-4 right-4 z-[100]">
          <button
            onClick={handleRoleSwitch}
            className="bg-slate-800/90 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold border border-slate-700 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label={`Switch to ${userRole === 'athlete' ? 'coach' : 'athlete'} view`}
          >
            {userRole === 'athlete' ? '👤 Coach View' : '🏋️ Athlete View'}
          </button>
        </div>
      )}

      <main id="main-content">
        {renderContent()}
      </main>

      {!inWorkout && (
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          userRole={userRole}
        />
      )}
    </div>
  );
};

// Root app with providers
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
