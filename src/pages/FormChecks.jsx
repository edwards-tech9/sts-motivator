import { useState, useRef } from 'react';
import { Video, Play, Pause, MessageSquare, Check, X, Clock, ChevronRight, Filter, Search, RotateCcw, Maximize, Volume2, VolumeX } from 'lucide-react';
import { PageTransition, SlideIn, StaggerContainer } from '../components/ui/AnimatedComponents';

// Sample video URLs (using free stock fitness videos)
const SAMPLE_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

// Video Player Component
const FormCheckVideoPlayer = ({ videoUrl, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full max-h-[40vh] object-contain bg-black"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Play overlay when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <div className="w-20 h-20 bg-gold-500/90 rounded-full flex items-center justify-center">
            <Play className="text-white ml-1" size={40} fill="white" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        {/* Progress bar */}
        <div
          className="h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gold-500 rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold-400 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RotateCcw size={18} className="text-white" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
            </button>
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeedChange}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm font-medium transition-colors"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>
      </div>

      {/* Mute the video if muted */}
      {isMuted && videoRef.current && (videoRef.current.muted = true)}
      {!isMuted && videoRef.current && (videoRef.current.muted = false)}
    </div>
  );
};

// Mock form check submissions
const mockFormChecks = [
  {
    id: 1,
    athleteId: 'athlete-1',
    athleteName: 'John Davidson',
    athleteAvatar: 'JD',
    exercise: 'Back Squat',
    weight: '275 lbs',
    reps: 5,
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending',
    videoUrl: SAMPLE_VIDEOS[0],
    thumbnailUrl: '/exercises/squat.jpg',
    notes: 'Feeling unsure about my depth on these heavier sets',
  },
  {
    id: 2,
    athleteId: 'athlete-2',
    athleteName: 'Emma Sullivan',
    athleteAvatar: 'ES',
    exercise: 'Deadlift',
    weight: '315 lbs',
    reps: 3,
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'pending',
    videoUrl: SAMPLE_VIDEOS[1],
    thumbnailUrl: '/exercises/deadlift.jpg',
    notes: 'Back felt a bit rounded at the top',
  },
  {
    id: 3,
    athleteId: 'athlete-1',
    athleteName: 'John Davidson',
    athleteAvatar: 'JD',
    exercise: 'Bench Press',
    weight: '185 lbs',
    reps: 8,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'reviewed',
    videoUrl: SAMPLE_VIDEOS[2],
    thumbnailUrl: '/exercises/bench.jpg',
    notes: 'Working on bar path',
    feedback: 'Great improvement! Bar path is much better. Focus on keeping your shoulder blades pinched throughout.',
    rating: 'good',
  },
  {
    id: 4,
    athleteId: 'athlete-3',
    athleteName: 'Sarah Martinez',
    athleteAvatar: 'SM',
    exercise: 'Romanian Deadlift',
    weight: '135 lbs',
    reps: 10,
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'reviewed',
    videoUrl: SAMPLE_VIDEOS[3],
    thumbnailUrl: '/exercises/rdl.jpg',
    notes: 'First time trying RDLs',
    feedback: 'Good start! Keep the bar closer to your legs and push hips back more.',
    rating: 'needs-work',
  },
];

const FormChecks = () => {
  const [formChecks, setFormChecks] = useState(mockFormChecks);
  const [filter, setFilter] = useState('all');
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState('');

  const filteredChecks = formChecks.filter(check => {
    if (filter === 'all') return true;
    return check.status === filter;
  });

  const pendingCount = formChecks.filter(c => c.status === 'pending').length;

  const handleSubmitFeedback = () => {
    if (!selectedCheck || !feedbackText.trim() || !rating) return;

    setFormChecks(prev =>
      prev.map(check =>
        check.id === selectedCheck.id
          ? { ...check, status: 'reviewed', feedback: feedbackText, rating }
          : check
      )
    );
    setSelectedCheck(null);
    setFeedbackText('');
    setRating('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-carbon-900/90 backdrop-blur-lg border-b border-slate-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="STS" className="w-10 h-10 object-contain" />
                <div>
                  <p className="text-gold-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
                  <h1 className="text-white text-xl font-bold">Form Checks</h1>
                </div>
              </div>
              {pendingCount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {pendingCount} pending
                </div>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
              {['all', 'pending', 'reviewed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                    filter === f
                      ? 'bg-gold-gradient text-carbon-900'
                      : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {filteredChecks.length === 0 ? (
            <div className="text-center py-12">
              <Video className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No form checks to review</p>
            </div>
          ) : (
            <StaggerContainer staggerDelay={100}>
              {filteredChecks.map((check) => (
                <SlideIn key={check.id}>
                  <button
                    onClick={() => setSelectedCheck(check)}
                    className="w-full bg-carbon-800/50 rounded-2xl p-4 hover:bg-carbon-800 transition-colors text-left"
                  >
                    <div className="flex gap-4">
                      {/* Video thumbnail */}
                      <div className="relative w-24 h-24 bg-carbon-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Play className="text-white" size={32} />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                          0:15
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 text-xs font-bold">
                            {check.athleteAvatar}
                          </div>
                          <span className="text-white font-semibold truncate">{check.athleteName}</span>
                          <span className="text-gray-500 text-sm">{formatTime(check.submittedAt)}</span>
                        </div>

                        <p className="text-gold-400 font-bold">{check.exercise}</p>
                        <p className="text-gray-400 text-sm">{check.weight} × {check.reps} reps</p>

                        {check.notes && (
                          <p className="text-gray-500 text-sm mt-1 truncate">"{check.notes}"</p>
                        )}

                        {/* Status badge */}
                        <div className="mt-2">
                          {check.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                              <Clock size={12} /> Needs Review
                            </span>
                          ) : check.rating === 'good' ? (
                            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              <Check size={12} /> Good Form
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">
                              <MessageSquare size={12} /> Feedback Given
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="text-gray-500 flex-shrink-0" size={20} />
                    </div>
                  </button>
                </SlideIn>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* Review Modal */}
        {selectedCheck && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <button
                onClick={() => setSelectedCheck(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-white font-bold">Review Form Check</h2>
              <div className="w-6" />
            </div>

            {/* Video Player */}
            <div className="bg-carbon-950">
              <FormCheckVideoPlayer videoUrl={selectedCheck.videoUrl} />
            </div>

            {/* Info & Feedback */}
            <div className="p-4 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-300 rounded-full flex items-center justify-center text-carbon-900 font-bold">
                  {selectedCheck.athleteAvatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedCheck.athleteName}</p>
                  <p className="text-gray-400 text-sm">{formatTime(selectedCheck.submittedAt)}</p>
                </div>
              </div>

              <div className="bg-carbon-800/50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gold-400 font-bold">{selectedCheck.exercise}</p>
                    <p className="text-gray-500 text-xs">Exercise</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{selectedCheck.weight}</p>
                    <p className="text-gray-500 text-xs">Weight</p>
                  </div>
                  <div>
                    <p className="text-white font-bold">{selectedCheck.reps}</p>
                    <p className="text-gray-500 text-xs">Reps</p>
                  </div>
                </div>
              </div>

              {selectedCheck.notes && (
                <div className="bg-carbon-800/30 rounded-xl p-4 mb-4">
                  <p className="text-gray-400 text-sm">Athlete's notes:</p>
                  <p className="text-white">"{selectedCheck.notes}"</p>
                </div>
              )}

              {selectedCheck.status === 'reviewed' ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 font-semibold mb-2">Your feedback:</p>
                  <p className="text-gray-300">{selectedCheck.feedback}</p>
                </div>
              ) : (
                <>
                  {/* Rating buttons */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Rating:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRating('good')}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                          rating === 'good'
                            ? 'bg-green-500 text-white'
                            : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                        }`}
                      >
                        ✓ Good Form
                      </button>
                      <button
                        onClick={() => setRating('needs-work')}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                          rating === 'needs-work'
                            ? 'bg-orange-500 text-white'
                            : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                        }`}
                      >
                        ⚠ Needs Work
                      </button>
                    </div>
                  </div>

                  {/* Feedback textarea */}
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your feedback for the athlete..."
                    className="w-full bg-carbon-800 text-white p-4 rounded-xl mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gray-500"
                  />

                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim() || !rating}
                    className="w-full bg-gold-gradient text-carbon-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Submit Feedback
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default FormChecks;
