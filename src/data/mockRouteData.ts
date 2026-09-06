import { Waypoint, RouteSegment } from "../types/route";

/**
 * 4 key waypoints: Origin, D1, D2, D3
 * Featuring realistic geo coordinates and normalized SVG layout coordinates
 * matching the assessment specification diagram.
 */
export const WAYPOINTS: Waypoint[] = [
  {
    id: "origin",
    name: "Origin",
    type: "origin",
    label: "Main Logistics Hub",
    city: "Metro Terminal Dock 4",
    address: "400 Harbor Blvd",
    lat: 37.7749,
    lng: -122.4194,
    svgX: 210,
    svgY: 380,
    color: "#10b981", // Green
  },
  {
    id: "d1",
    name: "D1",
    type: "delivery",
    label: "Commercial Center",
    city: "Downtown Hub",
    address: "742 Market St",
    lat: 37.7892,
    lng: -122.4014,
    svgX: 380,
    svgY: 160,
    color: "#ef4444", // Red
    cargo: {
      trackingNumber: "TRK-9841-A",
      recipient: "Apex Global Tech",
      weightKg: 420,
      itemCount: 18,
      type: "Server Hardware",
    },
  },
  {
    id: "d2",
    name: "D2",
    type: "delivery",
    label: "Medical District Center",
    city: "Mission Bay Hub",
    address: "1650 Owens St",
    lat: 37.7685,
    lng: -122.3912,
    svgX: 535,
    svgY: 200,
    color: "#f59e0b", // Amber/Yellow
    cargo: {
      trackingNumber: "TRK-9841-B",
      recipient: "Bay Area Health Clinic",
      weightKg: 185,
      itemCount: 8,
      type: "Medical Supplies (Cold Chain)",
    },
  },
  {
    id: "d3",
    name: "D3",
    type: "delivery",
    label: "Port Terminal Gateway",
    city: "North Wharves",
    address: "2200 Embarcadero Way",
    lat: 37.8015,
    lng: -122.4055,
    svgX: 740,
    svgY: 145,
    color: "#64748b", // Slate Grey
    cargo: {
      trackingNumber: "TRK-9841-C",
      recipient: "Northern Pacific Logistics",
      weightKg: 760,
      itemCount: 34,
      type: "Industrial Spares",
    },
  },
];

/**
 * High-resolution road waypoints and bezier curves matching assessment layout
 */
export const ROUTE_SEGMENTS: RouteSegment[] = [
  // Segment 0: Origin -> D1 (~4.2 km)
  {
    fromId: "origin",
    toId: "d1",
    distanceKm: 4.2,
    estimatedMinutes: 8,
    // Straight diagonal up-right
    bezierPoints: [265, 305, 325, 235, 380, 160],
    pathCoordinates: [
      [37.7749, -122.4194],
      [37.7772, -122.4158],
      [37.7801, -122.4121],
      [37.7834, -122.4082],
      [37.7865, -122.4045],
      [37.7892, -122.4014],
    ],
  },
  // Segment 1: D1 -> D2 (~3.8 km) - Curves UP over D1 and swoops down to D2
  {
    fromId: "d1",
    toId: "d2",
    distanceKm: 3.8,
    estimatedMinutes: 7,
    bezierPoints: [425, 115, 485, 125, 535, 200],
    pathCoordinates: [
      [37.7892, -122.4014],
      [37.7850, -122.3980],
      [37.7805, -122.3955],
      [37.7740, -122.3930],
      [37.7685, -122.3912],
    ],
  },
  // Segment 2: D2 -> D3 (~5.1 km) - Dips DEEPLY down and curves up to D3
  {
    fromId: "d2",
    toId: "d3",
    distanceKm: 5.1,
    estimatedMinutes: 10,
    bezierPoints: [585, 280, 680, 275, 740, 145],
    pathCoordinates: [
      [37.7685, -122.3912],
      [37.7735, -122.3880],
      [37.7820, -122.3910],
      [37.7915, -122.3965],
      [37.7980, -122.4010],
      [37.8015, -122.4055],
    ],
  },
];

export const TOTAL_ROUTE_DISTANCE_KM = ROUTE_SEGMENTS.reduce(
  (sum, seg) => sum + seg.distanceKm,
  0
);
