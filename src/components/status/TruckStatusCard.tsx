import { SimulationState } from "../../types/route";
import { formatDistance, formatDuration } from "../../services/geoUtils";
import { Navigation, Clock, PackageCheck } from "lucide-react";

interface TruckStatusCardProps {
  state: SimulationState;
  compact?: boolean;
}

export const TruckStatusCard: React.FC<TruckStatusCardProps> = ({ state }) => {
  const {
    distanceCoveredKm,
    totalDistanceKm,
    nextStop,
    completedCount,
    totalStops,
    statusSummary,
    isDwelling,
    dwellRemainingSec,
    dwellProgress,
    isCompleted,
    isPlaying,
    etaSeconds,
  } = state;

  const progressPercent = Math.round((distanceCoveredKm / totalDistanceKm) * 100);

  return (
    <div className="w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-5 text-slate-900 dark:text-slate-100 transition-all duration-200">
      {/* Card Header matching PDF */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isPlaying && !isCompleted ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </>
            ) : isCompleted ? (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            )}
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            TRUCK STATUS
          </h3>
        </div>

        {isDwelling ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse">
            <PackageCheck className="w-3.5 h-3.5" />
            Unloading ({Math.ceil(dwellRemainingSec)}s)
          </span>
        ) : isCompleted ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ✓ Finished
          </span>
        ) : !isPlaying ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Paused
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <Navigation className="w-3 h-3 animate-spin" style={{ animationDuration: "6s" }} />
            In Transit
          </span>
        )}
      </div>

      {/* Main Status Metrics */}
      <div className="mt-3.5 space-y-2.5 text-sm">
        {/* Current status line */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-medium tracking-wide">
            Current:
          </span>
          <span className="font-semibold text-right text-slate-900 dark:text-slate-100 text-sm">
            {statusSummary}
          </span>
        </div>

        {/* Distance covered line */}
        <div className="flex items-baseline justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-medium tracking-wide">
            Distance covered:
          </span>
          <div className="text-right">
            <span className="font-bold text-slate-900 dark:text-slate-50 text-base font-mono">
              {formatDistance(distanceCoveredKm)}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              / {formatDistance(totalDistanceKm)}
            </span>
          </div>
        </div>

        {/* Next stop & Completed line */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
              Next stop:
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {nextStop ? nextStop.name : "All Completed"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
              Completed:
            </span>
            <span className="font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-blue-600 dark:text-blue-400">
              {completedCount}/{totalStops}
            </span>
          </div>
        </div>
      </div>

      {/* Dwell bar if unloading */}
      {isDwelling && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-amber-600 dark:text-amber-400 font-medium mb-1">
            <span>Delivering packages at {nextStop?.name}...</span>
            <span>{Math.round(dwellProgress * 100)}%</span>
          </div>
          <div className="w-full bg-amber-100 dark:bg-amber-950/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-100"
              style={{ width: `${dwellProgress * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Progress Bar & ETA */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            ETA: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{isCompleted ? "Arrived" : formatDuration(etaSeconds)}</strong>
          </span>
          <span className="font-medium text-slate-600 dark:text-slate-300">{progressPercent}% overall</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
