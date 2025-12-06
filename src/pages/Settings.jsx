import { useState, useEffect } from 'react';
import { Bell, Lock, User, HelpCircle, LogOut, ChevronRight, Download, Wifi, WifiOff, X, Mail, Shield, Eye, EyeOff, ExternalLink, MessageCircle, Users, Flame, Watch, Scale, Smartphone, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { PageTransition, SlideIn, AnimatedButton } from '../components/ui/AnimatedComponents';
import { getProfile, saveProfile } from '../services/localStorage';
import SocialSettings from '../components/settings/SocialSettings';

// Profile Modal Component
const ProfileModal = ({ onClose }) => {
  const [profile, setProfile] = useState(getProfile());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 text-3xl font-bold">
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-carbon-900">
                <User size={16} />
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full bg-carbon-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-carbon-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Height</label>
              <input
                type="text"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                placeholder="5'10&quot;"
                className="w-full bg-carbon-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Weight</label>
              <input
                type="text"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                placeholder="180 lbs"
                className="w-full bg-carbon-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Experience Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setProfile({ ...profile, experience: level })}
                  className={`py-3 rounded-xl text-sm font-semibold capitalize transition-colors ${
                    profile.experience === level
                      ? 'bg-gold-gradient text-carbon-900'
                      : 'bg-carbon-900 text-gray-400 hover:bg-carbon-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-bold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gold-gradient text-carbon-900 hover:scale-[1.02]'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Privacy & Security Modal
const PrivacyModal = ({ onClose, onDeleteAccount }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'coach-only',
    shareProgress: true,
    dataExport: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportStatus, setExportStatus] = useState(null);

  const handleExportData = () => {
    try {
      // Collect all localStorage data
      const exportData = {
        exportedAt: new Date().toISOString(),
        profile: localStorage.getItem('sts_profile'),
        workouts: localStorage.getItem('sts_workouts'),
        programs: localStorage.getItem('sts_programs'),
        prs: localStorage.getItem('sts_prs'),
        settings: localStorage.getItem('sts_settings'),
        messages: localStorage.getItem('sts_messages'),
      };

      // Parse JSON strings to objects for cleaner export
      Object.keys(exportData).forEach(key => {
        if (exportData[key] && key !== 'exportedAt') {
          try {
            exportData[key] = JSON.parse(exportData[key]);
          } catch {
            // Keep as string if not valid JSON
          }
        }
      });

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sts-motivator-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus(null), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      // Clear all localStorage data
      const keysToDelete = [
        'sts_user', 'sts_workouts', 'sts_programs', 'sts_athletes',
        'sts_settings', 'sts_prs', 'sts_messages', 'sts_exercise_videos', 'sts_profile'
      ];
      keysToDelete.forEach(key => localStorage.removeItem(key));

      // Call the logout function passed from parent
      if (onDeleteAccount) {
        onDeleteAccount();
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Privacy & Security</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Visibility */}
          <div>
            <h3 className="text-white font-semibold mb-3">Profile Visibility</h3>
            <div className="space-y-2">
              {[
                { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                { value: 'coach-only', label: 'Coach Only', desc: 'Only your coach can see your data' },
                { value: 'private', label: 'Private', desc: 'Your profile is completely private' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSettings({ ...settings, profileVisibility: option.value })}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    settings.profileVisibility === option.value
                      ? 'bg-gold-500/20 border border-gold-500/30'
                      : 'bg-carbon-900 hover:bg-carbon-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{option.label}</p>
                      <p className="text-gray-500 text-sm">{option.desc}</p>
                    </div>
                    {settings.profileVisibility === option.value && (
                      <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                        <span className="text-carbon-900 text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Share Progress with Coach</p>
                <p className="text-gray-500 text-sm">Allow coach to see your workout data</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, shareProgress: !settings.shareProgress })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.shareProgress ? 'bg-gold-500' : 'bg-carbon-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.shareProgress ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          </div>

          {/* Data Export */}
          <div className="pt-4 border-t border-carbon-700">
            <h3 className="text-white font-semibold mb-3">Your Data</h3>
            <button
              onClick={handleExportData}
              className="w-full bg-carbon-900 text-white p-4 rounded-xl flex items-center justify-between hover:bg-carbon-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-gray-400" />
                <span>Export All Data</span>
              </div>
              {exportStatus === 'success' ? (
                <span className="text-green-400 text-sm">✓ Downloaded!</span>
              ) : exportStatus === 'error' ? (
                <span className="text-red-400 text-sm">Export failed</span>
              ) : (
                <ChevronRight className="text-gray-500" size={20} />
              )}
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-500/10 text-red-400 p-4 rounded-xl flex items-center justify-between mt-2 hover:bg-red-500/20 transition-colors"
              >
                <span>Delete Account</span>
                <ChevronRight className="text-red-400" size={20} />
              </button>
            ) : (
              <div className="mt-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm mb-3">
                  This will permanently delete all your data. Type "delete" to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                  className="w-full bg-carbon-900 text-white px-4 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="flex-1 py-2 bg-carbon-700 text-white rounded-lg hover:bg-carbon-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Center Modal
const HelpModal = ({ onClose }) => {
  const faqs = [
    {
      q: 'How do I log a workout?',
      a: 'Tap "Start Workout" on the home screen, then tap each set button to log your weight and reps.',
    },
    {
      q: 'What does RPE mean?',
      a: 'RPE (Rate of Perceived Exertion) is a 1-10 scale measuring how hard a set felt. 10 = max effort, 7-8 = moderate.',
    },
    {
      q: 'How do I contact my coach?',
      a: 'Use the Chat tab at the bottom of the screen to send messages to your coach.',
    },
    {
      q: 'How are XP and levels calculated?',
      a: 'You earn XP for completing sets, workouts, hitting PRs, and maintaining streaks. XP unlocks new levels and badges.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Help Center</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* FAQs */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-carbon-900 rounded-xl p-4">
                  <p className="text-white font-medium mb-2">{faq.q}</p>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="pt-4 border-t border-carbon-700">
            <h3 className="text-gold-400 font-semibold mb-4">Need More Help?</h3>
            <div className="space-y-2">
              <a
                href="mailto:support@scullintrainingsystems.com"
                className="w-full bg-carbon-900 text-white p-4 rounded-xl flex items-center justify-between hover:bg-carbon-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <span>Email Support</span>
                </div>
                <ExternalLink className="text-gray-500" size={18} />
              </a>
              <div className="w-full bg-carbon-900 text-white p-4 rounded-xl flex items-center justify-between opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-gray-400" />
                  <span>Live Chat</span>
                </div>
                <span className="text-gray-500 text-sm">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-carbon-700 text-center space-y-1">
            <p className="text-gray-500 text-sm">STS M0TIV8R v1.4.0</p>
            <p className="text-gray-600 text-xs">© 2025 Scullin Training Systems</p>
            <p className="text-gray-700 text-[10px] uppercase tracking-widest">Powered by Donkey Butter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Social Settings Modal
const SocialSettingsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
              <Users className="text-gold-400" size={20} />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Social & Live</h2>
              <p className="text-gray-500 text-sm">Manage your social features</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <SocialSettings onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

// Connected Devices Modal
const ConnectedDevicesModal = ({ onClose }) => {
  const [devices, setDevices] = useState(() => {
    try {
      const stored = localStorage.getItem('sts_connected_devices');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [connecting, setConnecting] = useState(null);
  const [syncing, setSyncing] = useState(null);

  const availableDevices = [
    {
      id: 'renpho',
      name: 'Renpho Scale',
      icon: Scale,
      description: 'Body weight, body fat, muscle mass',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      id: 'apple_health',
      name: 'Apple Health',
      icon: Watch,
      description: 'Workouts, heart rate, sleep',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    {
      id: 'apple_watch',
      name: 'Apple Watch',
      icon: Watch,
      description: 'Activity rings, workouts, heart rate',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Smartphone,
      description: 'Steps, sleep, heart rate',
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20',
    },
  ];

  const isConnected = (deviceId) => devices.some(d => d.id === deviceId);

  const handleConnect = (device) => {
    setConnecting(device.id);
    // Simulate connection process
    setTimeout(() => {
      const newDevice = {
        id: device.id,
        name: device.name,
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
      };
      const updated = [...devices, newDevice];
      setDevices(updated);
      localStorage.setItem('sts_connected_devices', JSON.stringify(updated));
      setConnecting(null);
    }, 1500);
  };

  const handleDisconnect = (deviceId) => {
    const updated = devices.filter(d => d.id !== deviceId);
    setDevices(updated);
    localStorage.setItem('sts_connected_devices', JSON.stringify(updated));
  };

  const handleSync = (deviceId) => {
    setSyncing(deviceId);
    setTimeout(() => {
      const updated = devices.map(d =>
        d.id === deviceId ? { ...d, lastSync: new Date().toISOString() } : d
      );
      setDevices(updated);
      localStorage.setItem('sts_connected_devices', JSON.stringify(updated));
      setSyncing(null);
    }, 2000);
  };

  const getLastSyncText = (device) => {
    const connectedDevice = devices.find(d => d.id === device.id);
    if (!connectedDevice?.lastSync) return null;
    const lastSync = new Date(connectedDevice.lastSync);
    const now = new Date();
    const diffMins = Math.floor((now - lastSync) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return lastSync.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Watch className="text-purple-400" size={20} />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Connected Devices</h2>
              <p className="text-gray-500 text-sm">Sync your fitness data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Connected count */}
          {devices.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-green-400 text-sm">
                {devices.length} device{devices.length > 1 ? 's' : ''} connected
              </span>
            </div>
          )}

          {/* Device list */}
          <div className="space-y-3">
            {availableDevices.map((device) => {
              const Icon = device.icon;
              const connected = isConnected(device.id);
              const isConnecting = connecting === device.id;
              const isSyncing = syncing === device.id;

              return (
                <div
                  key={device.id}
                  className={`rounded-xl p-4 transition-colors ${
                    connected ? 'bg-carbon-700/50 border border-carbon-600' : 'bg-carbon-900/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${device.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={device.color} size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{device.name}</p>
                        {connected && (
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">{device.description}</p>
                      {connected && (
                        <p className="text-gray-600 text-xs mt-1">
                          Last synced: {getLastSyncText(device)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {connected ? (
                      <>
                        <button
                          onClick={() => handleSync(device.id)}
                          disabled={isSyncing}
                          className="flex-1 flex items-center justify-center gap-2 bg-carbon-800 hover:bg-carbon-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                          {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                        <button
                          onClick={() => handleDisconnect(device.id)}
                          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(device)}
                        disabled={isConnecting}
                        className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-carbon-900 font-semibold py-2 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Connect'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info note */}
          <div className="bg-carbon-900/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-gray-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-gray-400 text-sm">
                Connected devices will automatically sync your health data to track progress and personalize your workouts.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Powered by Terra API for secure data integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400'
    : type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400'
    : 'bg-gold-500/20 border-gold-500/30 text-gold-400';

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl border backdrop-blur-lg ${bgColor} animate-slide-up`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

const Settings = ({ userRole, onLogout }) => {
  const { isInstalled, isInstallable, isOnline, installApp, requestNotificationPermission } = usePWA();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleInstall = async () => {
    await installApp();
  };

  const handleNotifications = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      showToast('Notifications enabled!', 'success');
    } else if (permission === 'denied') {
      showToast('Notification permission denied. Enable in browser settings.', 'error');
    }
  };

  const settingGroups = [
    {
      title: 'App',
      items: [
        ...(isInstallable && !isInstalled ? [{
          icon: Download,
          label: 'Install App',
          value: 'Add to Home Screen',
          action: handleInstall,
          type: 'link',
        }] : []),
        {
          icon: isOnline ? Wifi : WifiOff,
          label: 'Connection',
          value: isOnline ? 'Online' : 'Offline',
          type: 'status',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          value: typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'Enabled' : 'Disabled',
          action: handleNotifications,
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
          action: () => setShowProfileModal(true),
          type: 'link',
        },
        {
          icon: Lock,
          label: 'Privacy & Security',
          action: () => setShowPrivacyModal(true),
          type: 'link',
        },
      ],
    },
    {
      title: 'Social',
      items: [
        {
          icon: Users,
          label: 'Social & Live Features',
          value: 'Encouragement, Leaderboard',
          action: () => setShowSocialModal(true),
          type: 'link',
        },
      ],
    },
    {
      title: 'Devices',
      items: [
        {
          icon: Watch,
          label: 'Connected Devices',
          value: 'Renpho, Apple Watch',
          action: () => setShowDevicesModal(true),
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
          action: () => setShowHelpModal(true),
          type: 'link',
        },
      ],
    },
  ].filter(group => group.items.length > 0);

  return (
    <PageTransition>
      <div className="min-h-screen pb-24">
        <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <img src="/logo.png" alt="STS" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
              <h1 className="text-white text-xl font-bold">Settings</h1>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {settingGroups.map((group, groupIndex) => (
            <SlideIn key={group.title} delay={groupIndex * 50}>
              <div>
                <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-3">{group.title}</h2>
                <div className="bg-carbon-800/50 rounded-2xl overflow-hidden">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-carbon-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-inset ${
                      index < group.items.length - 1 ? 'border-b border-carbon-700/50' : ''
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
                      <ChevronRight size={20} className="text-gray-500" aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
                </div>
              </div>
            </SlideIn>
          ))}

          <SlideIn delay={settingGroups.length * 50 + 50}>
            <AnimatedButton
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-semibold hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <LogOut size={20} aria-hidden="true" />
              Sign Out
            </AnimatedButton>
          </SlideIn>

          <div className="text-center space-y-1">
            <p className="text-gray-500 text-sm">STS M0TIV8R v1.4.0</p>
            <p className="text-gray-600 text-xs uppercase tracking-widest">Powered by Donkey Butter</p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {showPrivacyModal && (
        <PrivacyModal
          onClose={() => setShowPrivacyModal(false)}
          onDeleteAccount={onLogout}
        />
      )}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      {showSocialModal && <SocialSettingsModal onClose={() => setShowSocialModal(false)} />}
      {showDevicesModal && <ConnectedDevicesModal onClose={() => setShowDevicesModal(false)} />}
    </PageTransition>
  );
};

export default Settings;
