import { useState } from "react";
import { Waypoint, RouteSegment, SimulationState } from "../../types/route";
import { MapLegend } from "./MapLegend";
import { TruckStatusCard } from "../status/TruckStatusCard";
import { evaluateCubicBezier } from "../../services/geoUtils";
import { Package, MapPin } from "lucide-react";

interface StylizedMapViewProps {
  waypoints: Waypoint[];
  segments: RouteSegment[];
  state: SimulationState;
}

export const StylizedMapView: React.FC<StylizedMapViewProps> = ({
  waypoints,
  segments,
  state,
}) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

  const origin = waypoints[0];
  const deliveryStops = waypoints.slice(1);
  const { currentSegmentIndex, segmentProgress, currentSvgPos, headingDegrees, isDwelling } = state;

  // Generate SVG path for a cubic bezier segment
  const getSegmentPathD = (seg: RouteSegment) => {
    const fromWp = waypoints.find((w) => w.id === seg.fromId);
    if (!fromWp) return "";
    const [cp1x, cp1y, cp2x, cp2y, endx, endy] = seg.bezierPoints;
    return `M ${fromWp.svgX} ${fromWp.svgY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endx} ${endy}`;
  };

  // Generate path for traveled portion of current segment (from 0 to progress)
  const getCurrentSegmentTraveledD = () => {
    const seg = segments[currentSegmentIndex];
    if (!seg) return "";
    const fromWp = waypoints.find((w) => w.id === seg.fromId);
    if (!fromWp) return "";
    
    const steps = 24;
    const points: string[] = [];
    const [cp1x, cp1y, cp2x, cp2y, endx, endy] = seg.bezierPoints;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * segmentProgress;
      const pt = evaluateCubicBezier(
        [fromWp.svgX, fromWp.svgY],
        [cp1x, cp1y],
        [cp2x, cp2y],
        [endx, endy],
        t
      );
      points.push(`${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
    }
    return points.join(" ");
  };

  // Generate path for upcoming portion of current segment (from progress to 1)
  const getCurrentSegmentUpcomingD = () => {
    const seg = segments[currentSegmentIndex];
    if (!seg) return "";
    const fromWp = waypoints.find((w) => w.id === seg.fromId);
    if (!fromWp) return "";
    
    const steps = 24;
    const points: string[] = [];
    const [cp1x, cp1y, cp2x, cp2y, endx, endy] = seg.bezierPoints;

    for (let i = 0; i <= steps; i++) {
      const t = segmentProgress + (i / steps) * (1 - segmentProgress);
      const pt = evaluateCubicBezier(
        [fromWp.svgX, fromWp.svgY],
        [cp1x, cp1y],
        [cp2x, cp2y],
        [endx, endy],
        t
      );
      points.push(`${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
    }
    return points.join(" ");
  };

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#eef4f9] dark:bg-[#0d1522] shadow-inner select-none">
      {/* Background Grid Pattern matching wireframe */}
      <div 
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Legend matching assessment wireframe */}
      <div className="absolute top-4 left-4 z-10">
        <MapLegend />
      </div>

      {/* Main SVG Visualization Canvas */}
      <svg
        viewBox="0 0 920 520"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full relative z-0"
      >
        <defs>
          <filter id="marker-shadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.25" />
          </filter>
          <filter id="truck-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.4" />
          </filter>

          <radialGradient id="truckPulseGrad">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.6)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </radialGradient>
        </defs>

        {/* 1. Completed Segments (Prior to current) - Green Solid/Dashed */}
        {segments.map((seg, idx) => {
          if (idx < currentSegmentIndex) {
            return (
              <path
                key={`completed-${seg.fromId}-${seg.toId}`}
                d={getSegmentPathD(seg)}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-90"
              />
            );
          }
          return null;
        })}

        {/* 2. Traveled portion of current segment - Green */}
        {segmentProgress > 0 && (
          <path
            d={getCurrentSegmentTraveledD()}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-90"
          />
        )}

        {/* 3. Upcoming portion of current segment - Blue Dashed */}
        {segmentProgress < 1 && (
          <path
            d={getCurrentSegmentUpcomingD()}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            className="opacity-80 dark:opacity-90"
          />
        )}

        {/* 4. Future Segments - Blue Dashed */}
        {segments.map((seg, idx) => {
          if (idx > currentSegmentIndex) {
            return (
              <path
                key={`future-${seg.fromId}-${seg.toId}`}
                d={getSegmentPathD(seg)}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="opacity-80 dark:opacity-90"
              />
            );
          }
          return null;
        })}

        {/* 5. Origin Marker (Green circle with label below) */}
        <g
          className="cursor-pointer group"
          onClick={() => setSelectedWaypoint(origin)}
        >
          {/* Invisible hit area to prevent edge flickering */}
          <circle cx={origin.svgX} cy={origin.svgY + 10} r="35" fill="transparent" />

          {/* Scalable content centered on origin dot */}
          <g
            className="transition-transform duration-200 group-hover:scale-110 origin-center"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            {/* Subtle outer pulse */}
            <circle
              cx={origin.svgX}
              cy={origin.svgY}
              r="16"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="12;20;12"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.1;0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Origin central dot */}
            <circle
              cx={origin.svgX}
              cy={origin.svgY}
              r="9"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#marker-shadow)"
            />
            {/* Origin Label underneath */}
            <text
              x={origin.svgX}
              y={origin.svgY + 28}
              textAnchor="middle"
              className="font-bold text-sm fill-slate-800 dark:fill-slate-100 select-none"
              style={{ fontWeight: 700 }}
            >
              Origin
            </text>
          </g>
        </g>

        {/* 6. Delivery Points D1, D2, D3 */}
        {deliveryStops.map((stop) => {
          const isCompletedStop = state.completedStopIds.includes(stop.id);
          const isCurrentTarget = state.nextStop?.id === stop.id;

          return (
            <g
              key={stop.id}
              className="cursor-pointer group"
              onClick={() => setSelectedWaypoint(stop)}
            >
              {/* Invisible large hit area so pointer never rapidly enters and leaves bounding box */}
              <circle cx={stop.svgX} cy={stop.svgY - 20} r="45" fill="transparent" />

              {/* Scalable Pin Group centered around pin bottom */}
              <g
                className="transition-transform duration-200 group-hover:scale-110"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "bottom center",
                }}
              >
                {/* Active beacon circle */}
                {isCurrentTarget && (
                  <circle
                    cx={stop.svgX}
                    cy={stop.svgY - 14}
                    r="26"
                    fill="none"
                    stroke={stop.color}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{
                      transformOrigin: `${stop.svgX}px ${stop.svgY - 14}px`,
                      animationDuration: "10s",
                    }}
                  />
                )}

                {/* Pin Shadow on ground */}
                <ellipse
                  cx={stop.svgX}
                  cy={stop.svgY}
                  rx="6"
                  ry="2.5"
                  fill="rgba(0,0,0,0.2)"
                />

                {/* Location Pin */}
                <g transform={`translate(${stop.svgX - 16}, ${stop.svgY - 36})`} filter="url(#marker-shadow)">
                  <path
                    d="M16 0 C7.16 0 0 7.16 0 16 C0 26 16 36 16 36 C16 36 32 26 32 16 C32 7.16 24.84 0 16 0 Z"
                    fill={stop.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="16" cy="15" r="7" fill="#ffffff" />
                </g>

                {/* Top Label above pin (D1, D2, D3) matching PDF wireframe */}
                <text
                  x={stop.svgX}
                  y={stop.svgY - 44}
                  textAnchor="middle"
                  className="font-bold text-sm fill-slate-800 dark:fill-slate-100 select-none"
                  style={{ fontWeight: 800 }}
                >
                  {stop.name}
                </text>

                {/* Checkmark when completed */}
                {isCompletedStop && (
                  <g transform={`translate(${stop.svgX + 8}, ${stop.svgY - 34})`}>
                    <circle cx="6" cy="6" r="6" fill="#10b981" />
                    <path
                      d="M3.5 6 L5.2 7.7 L8.5 4.3"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* 7. Live Animated Truck Marker */}
        <g
          transform={`translate(${currentSvgPos.x}, ${currentSvgPos.y})`}
          filter="url(#truck-shadow)"
        >
          {/* Signal wave around live truck */}
          <circle
            cx="0"
            cy="0"
            r="20"
            fill="url(#truckPulseGrad)"
            className="animate-ping opacity-60"
          />

          {/* Rotated Truck Body */}
          <g transform={`rotate(${headingDegrees})`}>
            {/* Cargo Box (Dark Body) */}
            <rect
              x="-20"
              y="-9"
              width="22"
              height="18"
              rx="2.5"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.2"
              className="dark:fill-slate-800"
            />
            {/* Cabin */}
            <path
              d="M2 -8 L11 -8 C13.5 -8 15.5 -5.5 15.5 -2.5 L15.5 2.5 C15.5 5.5 13.5 8 11 8 L2 8 Z"
              fill="#2563eb"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            {/* Windshield */}
            <path
              d="M5 -6 L10 -6 C11.5 -6 12.5 -4.5 12.5 -2 L12.5 2 C12.5 4.5 11.5 6 10 6 L5 6 Z"
              fill="#93c5fd"
              opacity="0.9"
            />
            {/* Wheels */}
            <rect x="-17" y="-11" width="5" height="2.5" rx="1" fill="#334155" />
            <rect x="-17" y="8.5" width="5" height="2.5" rx="1" fill="#334155" />
            <rect x="-6" y="-11" width="5" height="2.5" rx="1" fill="#334155" />
            <rect x="-6" y="8.5" width="5" height="2.5" rx="1" fill="#334155" />
            <rect x="6" y="-11" width="5" height="2.5" rx="1" fill="#334155" />
            <rect x="6" y="8.5" width="5" height="2.5" rx="1" fill="#334155" />

            {/* Headlights beam */}
            <path
              d="M15.5 -4 L28 -9 L28 9 L15.5 4 Z"
              fill="rgba(253, 224, 71, 0.22)"
            />
          </g>

          {/* Dwell notification badge above truck */}
          {isDwelling && (
            <g transform="translate(0, -28)">
              <rect
                x="-36"
                y="-11"
                width="72"
                height="20"
                rx="10"
                fill="#f59e0b"
                filter="url(#marker-shadow)"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                📦 Unloading
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Floating Status Card matching PDF mock */}
      <div className="absolute bottom-4 right-4 z-10">
        <TruckStatusCard state={state} />
      </div>

      {/* Waypoint Details popup */}
      {selectedWaypoint && (
        <div className="absolute inset-x-4 bottom-4 md:inset-x-auto md:left-4 md:bottom-4 md:w-84 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-20 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedWaypoint.color }}
              />
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {selectedWaypoint.name} – {selectedWaypoint.label}
              </h4>
            </div>
            <button
              onClick={() => setSelectedWaypoint(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedWaypoint.address}, {selectedWaypoint.city}</span>
            </div>

            {selectedWaypoint.cargo && (
              <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  <span>Cargo Manifest</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div><strong className="text-slate-500">Track:</strong> {selectedWaypoint.cargo.trackingNumber}</div>
                  <div><strong className="text-slate-500">Weight:</strong> {selectedWaypoint.cargo.weightKg} kg</div>
                  <div className="col-span-2"><strong className="text-slate-500">Recipient:</strong> {selectedWaypoint.cargo.recipient}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
