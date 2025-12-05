import { ChevronLeft, Bell } from 'lucide-react';

const Header = ({
  title,
  subtitle,
  onBack,
  rightContent,
  showNotifications = false,
  notificationCount = 0,
  userAvatar,
  variant = 'default'
}) => {
  return (
    <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
      <div className="flex items-center justify-between p-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-lg"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Exit</span>
          </button>
        ) : (
          <div>
            {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
            <p className="text-gold-400 font-bold text-sm tracking-wider">{title || 'STS M0TIV8R'}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          {showNotifications && (
            <button
              className="relative p-2 bg-carbon-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
            >
              <Bell size={20} className="text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          )}

          {userAvatar && (
            <div
              className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-white font-bold"
              aria-label="User avatar"
            >
              {userAvatar}
            </div>
          )}

          {rightContent}
        </div>
      </div>
    </header>
  );
};

export default Header;
