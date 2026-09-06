import { WAYPOINTS, ROUTE_SEGMENTS, TOTAL_ROUTE_DISTANCE_KM } from "../data/mockRouteData";
import { Waypoint, RouteSegment } from "../types/route";

export interface RouteApiResponse {
  routeId: string;
  vehicleId: string;
  driverName: string;
  origin: Waypoint;
  stops: Waypoint[];
  segments: RouteSegment[];
  totalDistanceKm: number;
}

/**
 * Simulates asynchronous API fetch with realistic network latency
 */
export async function fetchRouteData(): Promise<RouteApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const origin = WAYPOINTS[0];
  const stops = WAYPOINTS.slice(1);

  return {
    routeId: "RT-7082-BAY",
    vehicleId: "FL-902 (Volvo FH Electric)",
    driverName: "Marcus Vance",
    origin,
    stops,
    segments: ROUTE_SEGMENTS,
    totalDistanceKm: TOTAL_ROUTE_DISTANCE_KM,
  };
}
