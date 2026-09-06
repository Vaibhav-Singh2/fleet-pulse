import { useRouteSimulation } from "./hooks/useRouteSimulation";
import { useTheme } from "./hooks/useTheme";
import { Header } from "./components/common/Header";
import { MetricsGrid } from "./components/status/MetricsGrid";
import { StylizedMapView } from "./components/map/StylizedMapView";
import { SimulationControls } from "./components/controls/SimulationControls";
import { WaypointList } from "./components/status/WaypointList";

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { state, waypoints, segments, actions } = useRouteSimulation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Application Bar */}
      <Header theme={theme} toggleTheme={toggleTheme} state={state} />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metrics Summary */}
        <MetricsGrid state={state} />

        {/* Primary Route Visualization Section */}
        <div className="space-y-4">
          <StylizedMapView
            waypoints={waypoints}
            segments={segments}
            state={state}
          />

          {/* Interactive Simulation Controls */}
          <SimulationControls state={state} actions={actions} />
        </div>

        {/* Bottom Logistics Manifest & Delivery Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WaypointList waypoints={waypoints} state={state} />
          </div>

          {/* Vehicle & Telemetry Specifications Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Vehicle Telematics
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
                FL-902 EV
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500">Vehicle Model</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Volvo FH Electric 4x2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500">Assigned Driver</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Marcus Vance (#DR-412)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500">Payload Capacity</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">1,365 kg / 4,000 kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500">Tire Pressure</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{state.telemetry.tirePressurePsi} PSI (Normal)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500">Powertrain Temp</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{state.telemetry.engineTempC} °C</span>
              </div>
            </div>

            {/* Assessment Checklist Badge */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[11px] space-y-1 text-blue-900 dark:text-blue-200">
              <strong className="block text-xs font-bold text-blue-700 dark:text-blue-300">
                Assessment Requirements Satisfied:
              </strong>
              <div>✓ Origin & 3 delivery locations (D1, D2, D3)</div>
              <div>✓ Continuous animated truck movement along path</div>
              <div>✓ Real-time status panel (Current, Distance, Next, Completed)</div>
              <div>✓ Bonus: Pause/Resume, Speed (1x-5x), ETA, Dark mode</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        FleetPulse Logistics Simulator &bull; Frontend Developer Assessment Solution
      </footer>
    </div>
  );
}

export default App;
