import { useState, useEffect } from 'react';
import { X, Search, Play, Check, RefreshCw, ExternalLink, Video, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { exerciseDatabase, getAllExercises, searchExercises } from '../../data/exercises';
import { getExerciseVideos, saveExerciseVideo, getExerciseVideo } from '../../services/localStorage';

// Exercise type/category definitions
const EXERCISE_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'warmup', label: 'Warmup' },
  { id: 'compound', label: 'Compound' },
  { id: 'isolation', label: 'Isolation' },
  { id: 'accessory', label: 'Accessory' },
  { id: 'finisher', label: 'Finisher' },
];

const VideoManager = ({ isOpen, onClose }) => {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [customVideoId, setCustomVideoId] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [savedOverrides, setSavedOverrides] = useState({});
  const [previewVideo, setPreviewVideo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setExercises(getAllExercises());
      setSavedOverrides(getExerciseVideos());
    }
  }, [isOpen]);

  useEffect(() => {
    let filtered = getAllExercises();

    // Apply search filter
    if (searchQuery) {
      filtered = searchExercises(searchQuery);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(ex =>
        ex.category?.toLowerCase() === typeFilter.toLowerCase() ||
        ex.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setExercises(filtered);
  }, [searchQuery, typeFilter]);

  const handleSelectVideo = (exerciseName, videoId, source = 'library') => {
    saveExerciseVideo(exerciseName, {
      videoId,
      source,
      originalVideoId: exerciseDatabase[exerciseName]?.videoId,
    });
    setSavedOverrides(getExerciseVideos());
    setSuccessMessage(`Video updated for ${exerciseName}`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleAddCustomVideo = (exerciseName) => {
    if (!customVideoId.trim()) return;

    // Extract video ID from various YouTube URL formats
    let videoId = customVideoId.trim();

    // Handle full YouTube URLs
    if (videoId.includes('youtube.com/watch')) {
      const url = new URL(videoId);
      videoId = url.searchParams.get('v') || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }

    handleSelectVideo(exerciseName, videoId, 'custom');
    setCustomVideoId('');
  };

  const handleResetToDefault = (exerciseName) => {
    const originalVideoId = exerciseDatabase[exerciseName]?.videoId;
    if (originalVideoId) {
      saveExerciseVideo(exerciseName, {
        videoId: originalVideoId,
        source: 'default',
        originalVideoId,
      });
      setSavedOverrides(getExerciseVideos());
      setSuccessMessage(`${exerciseName} reset to default video`);
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const getCurrentVideoId = (exerciseName) => {
    const override = savedOverrides[exerciseName];
    return override?.videoId || exerciseDatabase[exerciseName]?.videoId;
  };

  const hasCustomVideo = (exerciseName) => {
    const override = savedOverrides[exerciseName];
    return override && override.source !== 'default';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-carbon-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-carbon-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                <Video className="text-gold-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Exercise Videos</h2>
                <p className="text-gray-400 text-sm">Customize video demos for your athletes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-carbon-800 rounded-xl transition-colors"
            >
              <X className="text-gray-400" size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-carbon-800 border border-carbon-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setTypeFilter(type.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  typeFilter === type.id
                    ? 'bg-gold-gradient text-carbon-900'
                    : 'bg-carbon-800 text-gray-400 hover:bg-carbon-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-2">
            <Check className="text-green-400" size={18} />
            <span className="text-green-400 text-sm">{successMessage}</span>
          </div>
        )}

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-carbon-800 rounded-2xl overflow-hidden">
              {/* Exercise Header */}
              <button
                onClick={() => setExpandedExercise(expandedExercise === exercise.name ? null : exercise.name)}
                className="w-full p-4 flex items-center justify-between hover:bg-carbon-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-carbon-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${getCurrentVideoId(exercise.name)}/mqdefault.jpg`}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    {hasCustomVideo(exercise.name) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-carbon-900" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">{exercise.name}</p>
                    <p className="text-gray-500 text-sm capitalize">
                      {exercise.primaryMuscles.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasCustomVideo(exercise.name) && (
                    <span className="px-2 py-1 bg-gold-500/20 text-gold-400 text-xs rounded-full">
                      Custom
                    </span>
                  )}
                  {expandedExercise === exercise.name ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedExercise === exercise.name && (
                <div className="p-4 pt-0 space-y-4">
                  {/* Current Video Preview */}
                  <div className="bg-carbon-900 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Current Video</p>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${getCurrentVideoId(exercise.name)}?rel=0`}
                        title={exercise.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Alternative Videos */}
                  {exercise.alternativeVideos?.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Alternative Videos</p>
                      <div className="grid grid-cols-1 gap-2">
                        {exercise.alternativeVideos.map((video) => (
                          <button
                            key={video.id}
                            onClick={() => handleSelectVideo(exercise.name, video.id, 'library')}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                              getCurrentVideoId(exercise.name) === video.id
                                ? 'bg-gold-500/20 border border-gold-500/30'
                                : 'bg-carbon-700 hover:bg-carbon-600'
                            }`}
                          >
                            <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-white text-sm truncate">{video.title}</p>
                              <p className="text-gray-500 text-xs">{video.channel}</p>
                            </div>
                            {getCurrentVideoId(exercise.name) === video.id ? (
                              <Check className="text-gold-400 flex-shrink-0" size={18} />
                            ) : (
                              <Play className="text-gray-500 flex-shrink-0" size={18} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Video Input */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Add Custom Video</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="YouTube video ID or URL"
                        value={customVideoId}
                        onChange={(e) => setCustomVideoId(e.target.value)}
                        className="flex-1 bg-carbon-700 border border-carbon-600 rounded-xl py-2 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 text-sm"
                      />
                      <button
                        onClick={() => handleAddCustomVideo(exercise.name)}
                        disabled={!customVideoId.trim()}
                        className="px-4 py-2 bg-gold-500 text-carbon-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      Paste a YouTube URL or video ID (e.g., dQw4w9WgXcQ)
                    </p>
                  </div>

                  {/* Reset to Default */}
                  {hasCustomVideo(exercise.name) && (
                    <button
                      onClick={() => handleResetToDefault(exercise.name)}
                      className="w-full flex items-center justify-center gap-2 p-3 border border-carbon-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                    >
                      <RefreshCw size={16} />
                      <span>Reset to Default Video</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-center py-12">
              <Video className="text-gray-600 mx-auto mb-3" size={48} />
              <p className="text-gray-500">No exercises found</p>
              <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-carbon-700 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {exercises.length} exercises • {Object.keys(savedOverrides).length} customized
            </span>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <span>Find more on YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoManager;
