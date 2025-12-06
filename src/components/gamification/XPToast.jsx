import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const XPToast = ({ xp, message, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 50);

    // Animate out and complete
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <div className="bg-gold-500 text-carbon-900 px-4 py-3 rounded-xl shadow-gold flex items-center gap-2 font-bold">
        <Zap size={18} />
        <span>+{xp} XP</span>
        {message && <span className="text-carbon-800 font-normal text-sm">• {message}</span>}
      </div>
    </div>
  );
};

// XP Toast Manager - use this to show toasts
export const XPToastManager = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <XPToast
          key={toast.id || index}
          xp={toast.xp}
          message={toast.message}
          onComplete={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for managing XP toasts
export const useXPToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (xp, message = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, xp, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default XPToast;
