import { useState, useEffect, useRef, useCallback } from "react";
import { WAYPOINTS, ROUTE_SEGMENTS, TOTAL_ROUTE_DISTANCE_KM } from "../data/mockRouteData";
import { SimulationState } from "../types/route";
import {
  calculateBearing,
  evaluateCubicBezier,
  interpolateGeo,
} from "../services/geoUtils";

const BASE_SEGMENT_SECONDS = 12; // Time in seconds to traverse one segment at 1x speed
const STOP_DWELL_SECONDS = 2.5; // Dwell time parked at delivery stop

export function useRouteSimulation() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Synced rendering state
  const [segmentIndex, setSegmentIndex] = useState<number>(0);
  const [segmentProgress, setSegmentProgress] = useState<number>(0);
  const [isDwelling, setIsDwelling] = useState<boolean>(false);
  const [dwellRemainingSec, setDwellRemainingSec] = useState<number>(0);
  const [dwellProgress, setDwellProgress] = useState<number>(0);
  const [completedStopIds, setCompletedStopIds] = useState<string[]>([]);
  const [headingDegrees, setHeadingDegrees] = useState<number>(-45);
  const [speedKmh, setSpeedKmh] = useState<number>(54);

  // Mutable refs for robust, jitter-free animation loop without state closure lag
  const simRef = useRef({
    isPlaying: true,
    isCompleted: false,
    speedMultiplier: 1,
    segmentIndex: 0,
    segmentProgress: 0,
    isDwelling: false,
    dwellTimer: 0,
    completedStopIds: [] as string[],
    lastHeading: -45,
    lastTime: null as number | null,
    lastSpeedUpdate: 0,
  });

  // Keep control refs in sync
  useEffect(() => {
    simRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    simRef.current.speedMultiplier = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    simRef.current.isCompleted = isCompleted;
  }, [isCompleted]);

  // Main 60fps Animation Loop
  useEffect(() => {
    let animFrameId: number;

    const loop = (timestamp: number) => {
      const sim = simRef.current;

      if (sim.lastTime === null) {
        sim.lastTime = timestamp;
      }

      // Cap deltaSec to 100ms to avoid skipping on tab switch
      const deltaSec = Math.min((timestamp - sim.lastTime) / 1000, 0.1);
      sim.lastTime = timestamp;

      if (sim.isPlaying && !sim.isCompleted) {
        const seg = ROUTE_SEGMENTS[sim.segmentIndex];
        const fromWp = WAYPOINTS.find((w) => w.id === seg.fromId) || WAYPOINTS[0];
        const toWp = WAYPOINTS.find((w) => w.id === seg.toId) || WAYPOINTS[1];

        if (sim.isDwelling) {
          // Parked at stop unloading cargo
          sim.dwellTimer += deltaSec * sim.speedMultiplier;
          const currentDwellProgress = Math.min(sim.dwellTimer / STOP_DWELL_SECONDS, 1);
          const remSec = Math.max(0, STOP_DWELL_SECONDS - sim.dwellTimer);

          setDwellProgress(currentDwellProgress);
          setDwellRemainingSec(remSec);

          if (sim.dwellTimer >= STOP_DWELL_SECONDS) {
            // Dwell complete!
            sim.isDwelling = false;
            sim.dwellTimer = 0;
            setIsDwelling(false);
            setDwellProgress(0);
            setDwellRemainingSec(0);

            if (sim.segmentIndex < ROUTE_SEGMENTS.length - 1) {
              // Proceed to next segment
              sim.segmentIndex += 1;
              sim.segmentProgress = 0;
              setSegmentIndex(sim.segmentIndex);
              setSegmentProgress(0);
            } else {
              // Reached final stop D3
              sim.isCompleted = true;
              sim.isPlaying = false;
              setIsCompleted(true);
              setIsPlaying(false);
            }
          }
        } else {
          // Advancing on route
          const duration = BASE_SEGMENT_SECONDS / sim.speedMultiplier;
          sim.segmentProgress += deltaSec / duration;

          if (sim.segmentProgress >= 1) {
            // Destination stop reached!
            sim.segmentProgress = 1;
            sim.isDwelling = true;
            sim.dwellTimer = 0;

            if (!sim.completedStopIds.includes(toWp.id)) {
              sim.completedStopIds = [...sim.completedStopIds, toWp.id];
              setCompletedStopIds(sim.completedStopIds);
            }

            setIsDwelling(true);
            setDwellRemainingSec(STOP_DWELL_SECONDS);
            setDwellProgress(0);
            setSegmentProgress(1);
          } else {
            setSegmentProgress(sim.segmentProgress);

            // Compute tangent heading along curve
            const [cp1x, cp1y, cp2x, cp2y, endx, endy] = seg.bezierPoints;
            const evalPt = evaluateCubicBezier(
              [fromWp.svgX, fromWp.svgY],
              [cp1x, cp1y],
              [cp2x, cp2y],
              [endx, endy],
              sim.segmentProgress
            );
            sim.lastHeading = evalPt.angleDegrees;
            setHeadingDegrees(evalPt.angleDegrees);
          }

          // Subtle speedometer update (throttled every 300ms)
          if (timestamp - sim.lastSpeedUpdate > 300) {
            sim.lastSpeedUpdate = timestamp;
            const noise = (Math.random() - 0.5) * 6;
            setSpeedKmh(Math.min(75, Math.max(42, Math.round(56 + noise))));
          }
        }
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Controls
  const reset = useCallback(() => {
    const sim = simRef.current;
    sim.isPlaying = true;
    sim.isCompleted = false;
    sim.segmentIndex = 0;
    sim.segmentProgress = 0;
    sim.isDwelling = false;
    sim.dwellTimer = 0;
    sim.completedStopIds = [];
    sim.lastHeading = -45;
    sim.lastTime = null;

    setIsPlaying(true);
    setIsCompleted(false);
    setSegmentIndex(0);
    setSegmentProgress(0);
    setIsDwelling(false);
    setDwellRemainingSec(0);
    setDwellProgress(0);
    setCompletedStopIds([]);
    setHeadingDegrees(-45);
  }, []);

  const togglePlay = useCallback(() => {
    if (isCompleted) {
      reset();
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isCompleted, reset]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (isCompleted) {
      reset();
    }
    setIsPlaying(true);
  }, [isCompleted, reset]);

  const jumpToSegment = useCallback((idx: number) => {
    if (idx >= 0 && idx < ROUTE_SEGMENTS.length) {
      const sim = simRef.current;
      sim.segmentIndex = idx;
      sim.segmentProgress = 0;
      sim.isDwelling = false;
      sim.dwellTimer = 0;
      sim.isCompleted = false;
      sim.completedStopIds = ROUTE_SEGMENTS.slice(0, idx).map((s) => s.toId);

      setSegmentIndex(idx);
      setSegmentProgress(0);
      setIsDwelling(false);
      setDwellRemainingSec(0);
      setDwellProgress(0);
      setIsCompleted(false);
      setCompletedStopIds(sim.completedStopIds);
    }
  }, []);

  // Derived calculations for rendering
  const origin = WAYPOINTS[0];
  const deliveryStops = WAYPOINTS.slice(1);
  const totalStops = deliveryStops.length;

  const currentSegment = ROUTE_SEGMENTS[segmentIndex] || ROUTE_SEGMENTS[0];
  const fromWaypoint = WAYPOINTS.find((w) => w.id === currentSegment.fromId) || origin;
  const toWaypoint = WAYPOINTS.find((w) => w.id === currentSegment.toId) || deliveryStops[0];

  // Bezier position for SVG view
  const [cp1x, cp1y, cp2x, cp2y, endx, endy] = currentSegment.bezierPoints;
  const bezierResult = evaluateCubicBezier(
    [fromWaypoint.svgX, fromWaypoint.svgY],
    [cp1x, cp1y],
    [cp2x, cp2y],
    [endx, endy],
    segmentProgress
  );

  // Geo position for Leaflet view
  const pathCoords = currentSegment.pathCoordinates;
  const numSubSegments = pathCoords.length - 1;
  const scaledProgress = segmentProgress * numSubSegments;
  const subIdx = Math.min(Math.floor(scaledProgress), numSubSegments - 1);
  const subT = scaledProgress - subIdx;
  const p1 = pathCoords[subIdx];
  const p2 = pathCoords[subIdx + 1] || p1;
  const currentGeo = interpolateGeo(p1, p2, subT);
  const geoBearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

  // Distance computation
  let priorCompletedDist = 0;
  for (let i = 0; i < segmentIndex; i++) {
    priorCompletedDist += ROUTE_SEGMENTS[i].distanceKm;
  }
  const currentSegDist = currentSegment.distanceKm * segmentProgress;
  const distanceCoveredKm = Math.min(
    isCompleted ? TOTAL_ROUTE_DISTANCE_KM : priorCompletedDist + currentSegDist,
    TOTAL_ROUTE_DISTANCE_KM
  );
  const remainingDistanceKm = Math.max(0, TOTAL_ROUTE_DISTANCE_KM - distanceCoveredKm);

  // Dynamic ETA
  const speedEstimate = isDwelling ? 40 : Math.max(speedKmh, 20);
  const etaSeconds =
    (remainingDistanceKm / (speedEstimate * speedMultiplier)) * 3600;

  // Status Summary Text matching requirements exactly
  let statusSummary = "";
  if (isCompleted) {
    statusSummary = `Route Completed at ${deliveryStops[deliveryStops.length - 1].name}`;
  } else if (isDwelling) {
    statusSummary = `Delivering at ${toWaypoint.name} (${toWaypoint.city})`;
  } else {
    statusSummary = `Between ${fromWaypoint.name} → ${toWaypoint.name}`;
  }

  const state: SimulationState = {
    isPlaying,
    isCompleted,
    speedMultiplier,
    currentSegmentIndex: segmentIndex,
    segmentProgress,
    isDwelling,
    dwellProgress,
    dwellRemainingSec,
    currentCoords: { lat: currentGeo[0], lng: currentGeo[1] },
    currentSvgPos: { x: bezierResult.x, y: bezierResult.y },
    headingDegrees: isDwelling ? simRef.current.lastHeading : headingDegrees,
    geoHeadingDegrees: isDwelling ? 0 : geoBearing,
    distanceCoveredKm,
    totalDistanceKm: TOTAL_ROUTE_DISTANCE_KM,
    currentStop: isDwelling ? toWaypoint : null,
    nextStop: isCompleted ? null : toWaypoint,
    completedStopIds,
    completedCount: completedStopIds.length,
    totalStops,
    statusSummary,
    etaSeconds,
    telemetry: {
      speedKmh: isDwelling ? 0 : Math.round(speedKmh * speedMultiplier),
      fuelLevelPercent: Math.max(
        40,
        Math.round(92 - (distanceCoveredKm / TOTAL_ROUTE_DISTANCE_KM) * 18)
      ),
      engineTempC: 88 + Math.round(speedMultiplier * 2),
      batteryStatus: "Optimal (98%)",
      tirePressurePsi: 105,
    },
  };

  return {
    state,
    waypoints: WAYPOINTS,
    segments: ROUTE_SEGMENTS,
    actions: {
      play,
      pause,
      togglePlay,
      reset,
      setSpeedMultiplier,
      jumpToSegment,
    },
  };
}
