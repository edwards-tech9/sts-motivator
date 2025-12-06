import { useState, useEffect } from 'react';
import { Users, Eye, EyeOff, Flame, Bell, Trophy, MessageSquare, Shield, ChevronRight, Check } from 'lucide-react';

// Default social settings
const DEFAULT_SETTINGS = {
  socialVisibility: 'public', // 'public', 'friends', 'private'
  receiveEncouragement: true,
  showOnLeaderboard: true,
  shareWorkouts: true,
  shareProgress: true,
  allowMessages: true,
  showLiveActivity: true,
  encouragementIntensity: 'medium', // 'low', 'medium', 'high'
  notifyPRs: true,
  notifyBadges: true,
  notifyStreaks: true,
};

// Get settings from localStorage
export const getSocialSettings = () => {
  try {
    const saved = localStorage.getItem('sts_social_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // Return defaults if localStorage fails
  }
  return DEFAULT_SETTINGS;
};

// Save settings to localStorage
export const saveSocialSettings = (settings) => {
  try {
    localStorage.setItem('sts_social_settings', JSON.stringify(settings));
    return true;
  } catch {
    // Silently fail if localStorage unavailable
    return false;
  }
};

const ToggleSwitch = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1 pr-4">
      <p className="text-white font-medium">{label}</p>
      {description && <p className="text-gray-500 text-sm">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-7 rounded-full transition-colors relative ${
        enabled ? 'bg-gold-500' : 'bg-carbon-700'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const VisibilityOption = ({ value, currentValue, onChange, icon: Icon, title, description }) => (
  <button
    onClick={() => onChange(value)}
    className={`w-full p-4 rounded-xl text-left transition-colors ${
      currentValue === value
        ? 'bg-gold-500/20 border border-gold-500/30'
        : 'bg-carbon-800 hover:bg-carbon-700'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        currentValue === value ? 'bg-gold-500/20' : 'bg-carbon-700'
      }`}>
        <Icon className={currentValue === value ? 'text-gold-400' : 'text-gray-400'} size={20} />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${currentValue === value ? 'text-gold-400' : 'text-white'}`}>
          {title}
        </p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      {currentValue === value && (
        <Check className="text-gold-400" size={20} />
      )}
    </div>
  </button>
);

const IntensityOption = ({ value, currentValue, onChange, emoji, title }) => (
  <button
    onClick={() => onChange(value)}
    className={`flex-1 p-3 rounded-xl text-center transition-colors ${
      currentValue === value
        ? 'bg-gold-500/20 border border-gold-500/30'
        : 'bg-carbon-800 hover:bg-carbon-700'
    }`}
  >
    <span className="text-2xl block mb-1">{emoji}</span>
    <span className={`text-sm font-semibold ${
      currentValue === value ? 'text-gold-400' : 'text-gray-400'
    }`}>
      {title}
    </span>
  </button>
);

const SocialSettings = ({ onClose }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSocialSettings());
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSocialSettings(newSettings);
  };

  const handleSave = () => {
    saveSocialSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose?.();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility Section */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Eye className="text-gold-400" size={20} />
          Profile Visibility
        </h3>
        <div className="space-y-2">
          <VisibilityOption
            value="public"
            currentValue={settings.socialVisibility}
            onChange={(v) => updateSetting('socialVisibility', v)}
            icon={Users}
            title="Public"
            description="Anyone in your gym community can see your activity"
          />
          <VisibilityOption
            value="friends"
            currentValue={settings.socialVisibility}
            onChange={(v) => updateSetting('socialVisibility', v)}
            icon={Eye}
            title="Coach Only"
            description="Only your coach can see your workout activity"
          />
          <VisibilityOption
            value="private"
            currentValue={settings.socialVisibility}
            onChange={(v) => updateSetting('socialVisibility', v)}
            icon={EyeOff}
            title="Private"
            description="No one can see your live activity or stats"
          />
        </div>
      </div>

      {/* Encouragement Settings */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Flame className="text-gold-400" size={20} />
          Live Encouragement
        </h3>

        <ToggleSwitch
          enabled={settings.receiveEncouragement}
          onChange={(v) => updateSetting('receiveEncouragement', v)}
          label="Receive Encouragement"
          description="Get motivational messages during your workout"
        />

        {settings.receiveEncouragement && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-3">Encouragement Intensity</p>
            <div className="flex gap-2">
              <IntensityOption
                value="low"
                currentValue={settings.encouragementIntensity}
                onChange={(v) => updateSetting('encouragementIntensity', v)}
                emoji="🙂"
                title="Chill"
              />
              <IntensityOption
                value="medium"
                currentValue={settings.encouragementIntensity}
                onChange={(v) => updateSetting('encouragementIntensity', v)}
                emoji="🔥"
                title="Hype"
              />
              <IntensityOption
                value="high"
                currentValue={settings.encouragementIntensity}
                onChange={(v) => updateSetting('encouragementIntensity', v)}
                emoji="🤯"
                title="Beast Mode"
              />
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-carbon-700 pt-4">
          <ToggleSwitch
            enabled={settings.showLiveActivity}
            onChange={(v) => updateSetting('showLiveActivity', v)}
            label="Show Live Activity Feed"
            description="See when others are working out in real-time"
          />
        </div>
      </div>

      {/* Leaderboard Settings */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-gold-400" size={20} />
          Competition & Leaderboard
        </h3>

        <ToggleSwitch
          enabled={settings.showOnLeaderboard}
          onChange={(v) => updateSetting('showOnLeaderboard', v)}
          label="Appear on Leaderboard"
          description="Compete with others in weekly rankings"
        />

        <ToggleSwitch
          enabled={settings.shareProgress}
          onChange={(v) => updateSetting('shareProgress', v)}
          label="Share Progress"
          description="Let others see your XP, level, and badges"
        />

        <ToggleSwitch
          enabled={settings.shareWorkouts}
          onChange={(v) => updateSetting('shareWorkouts', v)}
          label="Share Workout Summaries"
          description="Post workout completions to the live feed"
        />
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Bell className="text-gold-400" size={20} />
          Achievement Notifications
        </h3>

        <ToggleSwitch
          enabled={settings.notifyPRs}
          onChange={(v) => updateSetting('notifyPRs', v)}
          label="Personal Record Alerts"
          description="Get notified when you hit a new PR"
        />

        <ToggleSwitch
          enabled={settings.notifyBadges}
          onChange={(v) => updateSetting('notifyBadges', v)}
          label="Badge Unlock Alerts"
          description="Celebrate when you earn new badges"
        />

        <ToggleSwitch
          enabled={settings.notifyStreaks}
          onChange={(v) => updateSetting('notifyStreaks', v)}
          label="Streak Milestones"
          description="Mark your streak achievements"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-gold-gradient text-carbon-900 hover:scale-[1.02]'
        }`}
      >
        {saved ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={20} />
            Saved!
          </span>
        ) : (
          'Save Settings'
        )}
      </button>
    </div>
  );
};

export default SocialSettings;
