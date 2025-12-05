import { Home, BarChart3, MessageSquare, ClipboardList, Settings, Users, Video } from 'lucide-react';

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
    <nav
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50 pb-safe"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isActive ? 'text-orange-400' : 'text-gray-500'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
            >
              <Icon size={22} aria-hidden="true" />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
