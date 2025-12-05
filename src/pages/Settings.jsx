import { Sun, Moon, Bell, Lock, User, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ userRole, onLogout }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const settingGroups = [
    {
      title: 'Appearance',
      items: [
        {
          icon: isDark ? Moon : Sun,
          label: 'Theme',
          value: isDark ? 'Dark' : 'Light',
          action: toggleTheme,
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          value: 'Enabled',
          type: 'link',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          type: 'link',
        },
        {
          icon: Lock,
          label: 'Privacy & Security',
          type: 'link',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          type: 'link',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black dark:from-slate-900 dark:via-slate-950 dark:to-black light:from-gray-50 light:via-gray-100 light:to-gray-200 pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="p-4">
          <p className="text-orange-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
          <h1 className="text-white text-xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3">{group.title}</h2>
            <div className="bg-slate-800/50 rounded-2xl overflow-hidden">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset ${
                      index < group.items.length - 1 ? 'border-b border-slate-700/50' : ''
                    }`}
                    aria-label={item.type === 'toggle' ? `Toggle ${item.label}` : item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-gray-400" aria-hidden="true" />
                      <span className="text-white">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-gray-400 text-sm">{item.value}</span>
                      )}
                      {item.type === 'toggle' ? (
                        <div
                          className={`w-12 h-7 rounded-full p-1 transition-colors ${
                            isDark ? 'bg-orange-500' : 'bg-slate-600'
                          }`}
                          role="switch"
                          aria-checked={isDark}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              isDark ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-semibold hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <LogOut size={20} aria-hidden="true" />
          Sign Out
        </button>

        <p className="text-center text-gray-500 text-sm">
          STS M0TIV8R v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
