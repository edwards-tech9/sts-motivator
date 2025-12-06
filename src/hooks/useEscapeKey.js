import { useEffect } from 'react';

/**
 * useEscapeKey - Custom hook to handle escape key press
 * @param {function} onEscape - Callback to run when escape is pressed
 * @param {boolean} isActive - Whether the hook should be active (default true)
 */
const useEscapeKey = (onEscape, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, isActive]);
};

export default useEscapeKey;
