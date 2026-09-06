import { Truck, Moon, Sun, Radio } from "lucide-react";
import { SimulationState } from "../../types/route";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  state: SimulationState;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  state,
}) => {
  const { isPlaying, isCompleted, isDwelling } = state;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                Logistics Truck Route Visualizer
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                FleetPulse
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulating dynamic cargo delivery along route: Origin → D1 → D2 → D3
            </p>
          </div>
        </div>

        {/* Right side controls: Live Status & Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* Dispatch Status Beacon */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <Radio
              className={`w-3.5 h-3.5 ${
                isPlaying && !isCompleted
                  ? "text-emerald-500 animate-pulse"
                  : isCompleted
                  ? "text-blue-500"
                  : "text-amber-500"
              }`}
            />
            <span className="text-slate-700 dark:text-slate-300">
              {isCompleted
                ? "MISSION COMPLETE"
                : isDwelling
                ? "UNLOADING AT DOCK"
                : isPlaying
                ? "TELEMETRY ACTIVE"
                : "TRACKING PAUSED"}
            </span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
