import { SimulationState } from "../../types/route";
import { formatDistance, formatDuration } from "../../services/geoUtils";
import { Gauge, Clock, Milestone, BatteryCharging } from "lucide-react";

interface MetricsGridProps {
  state: SimulationState;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ state }) => {
  const {
    distanceCoveredKm,
    totalDistanceKm,
    etaSeconds,
    isCompleted,
    telemetry,
  } = state;

  const percentComplete = Math.round((distanceCoveredKm / totalDistanceKm) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Distance Metric */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <Milestone className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Distance
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 leading-tight">
            {formatDistance(distanceCoveredKm)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            of {formatDistance(totalDistanceKm)} ({percentComplete}%)
          </span>
        </div>
      </div>

      {/* 2. Dynamic ETA Metric */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Arrival
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 leading-tight">
            {isCompleted ? "Delivered" : formatDuration(etaSeconds)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {isCompleted ? "All 3 Stops Complete" : `Remaining to final destination`}
          </span>
        </div>
      </div>

      {/* 3. Live Speedometer Metric */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Gauge className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Telemetry Speed
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 leading-tight">
            {telemetry.speedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {state.isDwelling ? "Stationary (Unloading)" : "Cruising Velocity"}
          </span>
        </div>
      </div>

      {/* 4. Fleet EV Battery / Fuel Metric */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <BatteryCharging className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Vehicle Health
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 leading-tight">
            {telemetry.fuelLevelPercent}% <span className="text-xs font-normal text-emerald-500">EV</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Battery State: {telemetry.batteryStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
