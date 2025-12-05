import { Flame, ChevronDown } from 'lucide-react';

const WarmupSection = ({ exercises, expanded, onToggle }) => (
  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl mb-6 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset"
      aria-expanded={expanded}
      aria-controls="warmup-content"
    >
      <div className="flex items-center gap-3">
        <Flame className="text-orange-400" size={24} aria-hidden="true" />
        <span className="text-white font-bold">WARM-UP</span>
      </div>
      <ChevronDown
        className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>
    {expanded && (
      <div id="warmup-content" className="px-5 pb-5 space-y-3">
        {exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-xl p-3">
            <span className="text-gray-300">{ex.name}</span>
            <span className="text-orange-400 font-mono">{ex.prescription}</span>
          </div>
        ))}
        <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
          Start Warm-up ▶
        </button>
      </div>
    )}
  </div>
);

export default WarmupSection;
