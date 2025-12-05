import Confetti from '../ui/Confetti';

const PRCelebration = ({ show, exercise, newPR, previousPR, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="pr-title"
      aria-describedby="pr-description"
    >
      <Confetti active={show} />
      <div className="text-center p-8">
        <div className="text-8xl mb-6 animate-bounce" aria-hidden="true">🏆</div>
        <h2
          id="pr-title"
          className="text-5xl font-black text-white mb-3 tracking-tight"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          NEW PR!
        </h2>
        <p id="pr-description" className="text-2xl text-gold-400 font-semibold mb-6">{exercise}</p>
        <p className="text-7xl font-black text-white mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {newPR} <span className="text-3xl text-gray-400">lbs</span>
        </p>
        <p className="text-gray-400 text-lg mb-8">
          Previous: {previousPR} lbs <span className="text-green-400">(+{newPR - previousPR} lbs)</span>
        </p>
        <button
          onClick={onClose}
          className="bg-gold-gradient text-carbon-900 font-bold py-4 px-12 rounded-full text-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-black"
          autoFocus
        >
          KEEP CRUSHING IT
        </button>
      </div>
    </div>
  );
};

export default PRCelebration;
