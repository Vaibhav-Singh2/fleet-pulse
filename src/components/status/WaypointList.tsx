import { Waypoint, SimulationState } from "../../types/route";
import { CheckCircle2, Package, Truck } from "lucide-react";

interface WaypointListProps {
  waypoints: Waypoint[];
  state: SimulationState;
}

export const WaypointList: React.FC<WaypointListProps> = ({
  waypoints,
  state,
}) => {
  const origin = waypoints[0];
  const deliveryStops = waypoints.slice(1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Delivery Schedule & Manifest
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
            {state.completedCount} of {state.totalStops} Done
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">3 Waypoints</span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Origin Step */}
        <div className="flex items-start gap-3 relative">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="w-0.5 h-12 bg-emerald-400 dark:bg-emerald-800"></div>
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {origin.name} – {origin.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium">
                Departed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {origin.address}, {origin.city}
            </p>
          </div>
        </div>

        {/* Delivery Points D1, D2, D3 */}
        {deliveryStops.map((stop, idx) => {
          const isCompleted = state.completedStopIds.includes(stop.id);
          const isCurrentTarget = state.nextStop?.id === stop.id;
          const isLast = idx === deliveryStops.length - 1;

          return (
            <div key={stop.id} className="flex items-start gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : isCurrentTarget
                      ? "bg-blue-600 text-white border-blue-400 ring-4 ring-blue-100 dark:ring-blue-950 animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stop.name}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-12 transition-colors ${
                      isCompleted
                        ? "bg-emerald-400 dark:bg-emerald-800"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  ></div>
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {stop.name}: {stop.label}
                    </span>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold">
                      Delivered
                    </span>
                  ) : isCurrentTarget ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {state.isDwelling ? "Unloading..." : "In Transit"}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {stop.address}, {stop.city}
                </p>

                {/* Cargo Details */}
                {stop.cargo && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-slate-400" />
                      {stop.cargo.type}
                    </span>
                    <span>•</span>
                    <span><strong>To:</strong> {stop.cargo.recipient}</span>
                    <span>•</span>
                    <span className="font-mono font-medium">{stop.cargo.weightKg} kg</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
