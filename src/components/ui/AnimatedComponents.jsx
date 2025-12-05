import { useState, useEffect, useRef } from 'react';

// CSS-based animations (works without framer-motion)
// When framer-motion is installed, these can be upgraded to use it

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for the entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Fade in animation
export const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Slide in from direction
export const SlideIn = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';

    switch (direction) {
      case 'up': return 'translate-y-8';
      case 'down': return '-translate-y-8';
      case 'left': return 'translate-x-8';
      case 'right': return '-translate-x-8';
      default: return 'translate-y-8';
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

// Scale in animation
export const ScaleIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger children animation
export const StaggerContainer = ({ children, staggerDelay = 100, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ease-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
};

// Animated counter
export const AnimatedNumber = ({ value, duration = 1000, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(
        startValue.current + (value - startValue.current) * eased
      );

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
};

// Pulse animation wrapper
export const Pulse = ({ children, className = '', active = true }) => {
  return (
    <div className={`${active ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Bounce animation
export const Bounce = ({ children, className = '' }) => {
  return (
    <div className={`animate-bounce ${className}`}>
      {children}
    </div>
  );
};

// Button with press feedback
export const AnimatedButton = ({
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`transition-all duration-150 active:scale-95 ${
        isPressed ? 'scale-95' : 'scale-100'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Modal animation wrapper
export const ModalAnimation = ({ isOpen, children, className = '' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isOpen
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Skeleton loader for loading states
export const Skeleton = ({ width, height, className = '', rounded = 'md' }) => {
  return (
    <div
      className={`animate-pulse bg-carbon-700/50 rounded-${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

// Card skeleton
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-carbon-800/50 rounded-xl p-4 space-y-3 ${className}`}>
      <Skeleton height="1.5rem" width="60%" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="1rem" width="40%" />
    </div>
  );
};

// List item animation wrapper
export const ListItem = ({ children, index = 0, className = '' }) => {
  return (
    <SlideIn delay={index * 50} className={className}>
      {children}
    </SlideIn>
  );
};

// Progress bar with animation
export const AnimatedProgress = ({ value, max = 100, className = '' }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((value / max) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, max]);

  return (
    <div className={`h-2 bg-carbon-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

// Intersection observer for scroll animations
export const FadeInOnScroll = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};
