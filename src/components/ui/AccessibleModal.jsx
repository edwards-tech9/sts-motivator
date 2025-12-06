import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * AccessibleModal - A reusable modal component with proper accessibility
 *
 * Features:
 * - Focus trapping (tab cycles within modal)
 * - Escape key to close
 * - Click outside to close (optional)
 * - Proper ARIA attributes
 * - Returns focus to trigger element on close
 * - Prevents body scroll when open
 */
const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  titleId,
  children,
  className = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }

    // Focus trapping
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, [onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Store focus and handle body scroll
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add keydown listener
      document.addEventListener('keydown', handleKeyDown);

      // Focus the first focusable element in the modal
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusableElements?.[0]?.focus();
      }, 0);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);

        // Return focus to the trigger element
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        className={`bg-carbon-800 rounded-3xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-scale-up ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-carbon-800 p-4 border-b border-carbon-700 flex items-center justify-between">
            {title && (
              <h2 id={titleId} className="text-white text-xl font-bold">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccessibleModal;
