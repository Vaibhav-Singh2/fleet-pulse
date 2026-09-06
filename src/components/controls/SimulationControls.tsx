import { useEffect } from "react";
import { SimulationState } from "../../types/route";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
} from "lucide-react";

interface SimulationControlsProps {
  state: SimulationState;
  actions: {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    reset: () => void;
    setSpeedMultiplier: (mult: number) => void;
    jumpToSegment: (idx: number) => void;
  };
}

const SPEED_OPTIONS = [0.5, 1, 2, 5];

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  state,
  actions,
}) => {
  const { isPlaying, isCompleted, speedMultiplier, currentSegmentIndex } = state;

  // Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        actions.togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={actions.togglePlay}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 ${
            isCompleted
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
              : isPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
          }`}
          title="Toggle Play / Pause (Spacebar)"
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Replay Simulation</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Tracking</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Tracking</span>
            </>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={actions.reset}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors border border-slate-200 dark:border-slate-700 active:scale-95"
          title="Reset to Origin"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Speed Multipliers (Bonus Feature) */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <FastForward className="w-3.5 h-3.5" />
          Speed:
        </span>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              onClick={() => actions.setSpeedMultiplier(speed)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                speedMultiplier === speed
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Quick Jump to Waypoint */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
          Jump:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => actions.jumpToSegment(0)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
              currentSegmentIndex === 0
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Leg 1 (→ D1)
          </button>
          <button
            onClick={() => actions.jumpToSegment(1)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
              currentSegmentIndex === 1
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Leg 2 (→ D2)
          </button>
          <button
            onClick={() => actions.jumpToSegment(2)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
              currentSegmentIndex === 2
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Leg 3 (→ D3)
          </button>
        </div>
      </div>
    </div>
  );
};
