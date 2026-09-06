export type StopType = "origin" | "delivery";

export interface CargoItem {
  trackingNumber: string;
  recipient: string;
  weightKg: number;
  itemCount: number;
  type: string;
}

export interface Waypoint {
  id: string;
  name: string; // e.g. "Origin", "D1", "D2", "D3"
  type: StopType;
  label: string; // e.g. "Central Logistics Hub"
  city: string;
  address: string;
  lat: number;
  lng: number;
  // Normalized 2D canvas coordinates (0-1000 range) for wireframe mode
  svgX: number;
  svgY: number;
  color: string; // Hex or tailwind color
  cargo?: CargoItem;
}

export interface RouteSegment {
  fromId: string;
  toId: string;
  distanceKm: number;
  estimatedMinutes: number;
  // Waypoints along road network
  pathCoordinates: [number, number][];
  // Bezier curve control points for SVG wireframe view [cp1x, cp1y, cp2x, cp2y, endx, endy]
  bezierPoints: [number, number, number, number, number, number];
}

export interface TelemetryData {
  speedKmh: number;
  fuelLevelPercent: number;
  engineTempC: number;
  batteryStatus: string;
  tirePressurePsi: number;
}

export interface SimulationState {
  isPlaying: boolean;
  isCompleted: boolean;
  speedMultiplier: number;
  currentSegmentIndex: number;
  segmentProgress: number; // 0.0 - 1.0
  isDwelling: boolean;
  dwellProgress: number; // 0.0 - 1.0
  dwellRemainingSec: number;
  
  currentCoords: { lat: number; lng: number };
  currentSvgPos: { x: number; y: number };
  headingDegrees: number;
  geoHeadingDegrees: number;
  
  distanceCoveredKm: number;
  totalDistanceKm: number;
  currentStop: Waypoint | null;
  nextStop: Waypoint | null;
  completedStopIds: string[];
  completedCount: number;
  totalStops: number;
  
  statusSummary: string; // "Between Origin → D1", "Arrived at D1", "Route Completed"
  etaSeconds: number; // Remaining time to destination
  telemetry: TelemetryData;
}
