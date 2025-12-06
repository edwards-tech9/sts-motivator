import { useState } from 'react';
import { Share2, Twitter, MessageCircle, Copy, Check, X } from 'lucide-react';
import { recordShare } from '../../services/gamificationService';

const ShareWorkout = ({ workoutData, onClose, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [xpEarned, setXpEarned] = useState(null);

  const generateShareText = () => {
    const { name, duration, exercises, totalVolume, prHit } = workoutData;
    const exerciseCount = exercises?.length || 0;
    const totalSets = exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0) || 0;

    let text = `Just crushed my ${name || 'workout'}!`;
    text += `\n${duration} mins | ${exerciseCount} exercises | ${totalSets} sets`;
    if (totalVolume) {
      text += `\n${totalVolume.toLocaleString()} lbs total volume`;
    }
    if (prHit) {
      text += `\n🏆 NEW PR!`;
    }
    text += `\n\n#M0TIV8R #GainsMode #Fitness`;
    return text;
  };

  const shareText = generateShareText();
  const shareUrl = 'https://sts-motivator.vercel.app';

  const handleShare = async (platform) => {
    // Record share for XP
    const result = recordShare();
    setXpEarned(result.earnedXP);
    onShare?.(result);

    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url;
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Workout',
              text: shareText,
              url: shareUrl,
            });
            return;
          } catch (err) {
            // User cancelled or error
            return;
          }
        }
        return;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setCopyError(false);

      // Record share for XP
      const result = recordShare();
      setXpEarned(result.earnedXP);
      onShare?.(result);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Show error state to user instead of console.error
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-carbon-800 rounded-3xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 size={20} className="text-gold-400" />
            Share Workout
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* XP Earned Notification */}
        {xpEarned && (
          <div className="mb-4 p-3 bg-gold-500/20 border border-gold-500/30 rounded-xl text-center">
            <p className="text-gold-400 font-bold">+{xpEarned} XP Earned!</p>
          </div>
        )}

        {/* Preview */}
        <div className="bg-carbon-900 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm whitespace-pre-line">{shareText}</p>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Twitter size={20} />
            Twitter
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={20} />
            WhatsApp
          </button>
        </div>

        {/* Native Share (mobile) */}
        {navigator.share && (
          <button
            onClick={() => handleShare('native')}
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-carbon-900 py-3 rounded-xl font-bold mb-3 hover:scale-[1.02] transition-transform"
          >
            <Share2 size={20} />
            More Options
          </button>
        )}

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
            copyError ? 'bg-red-500/20 text-red-400' : 'bg-carbon-700 text-white hover:bg-carbon-600'
          }`}
        >
          {copied ? (
            <>
              <Check size={20} className="text-green-400" />
              Copied!
            </>
          ) : copyError ? (
            <>
              <X size={20} />
              Copy failed - try again
            </>
          ) : (
            <>
              <Copy size={20} />
              Copy to Clipboard
            </>
          )}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          Earn XP every time you share your progress!
        </p>
      </div>
    </div>
  );
};

export default ShareWorkout;
