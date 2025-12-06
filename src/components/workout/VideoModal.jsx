import { X } from 'lucide-react';
import { useEffect } from 'react';

const VideoModal = ({ videoId, onClose, onWatched }) => {
  // Track that user watched the video for XP
  useEffect(() => {
    const timer = setTimeout(() => {
      onWatched?.();
    }, 10000); // Award XP after 10 seconds of viewing

    return () => clearTimeout(timer);
  }, [onWatched]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Exercise demo video"
    >
      <div
        className="relative w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-carbon-700 rounded-full text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close video"
        >
          <X size={24} />
        </button>

        <div className="w-full h-full bg-carbon-900 rounded-2xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Exercise Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Tap anywhere outside the video to close
        </p>
      </div>
    </div>
  );
};

export default VideoModal;
