/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes compass bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Linear interpolation between two coordinates
 */
export function interpolateGeo(
  c1: [number, number],
  c2: [number, number],
  t: number
): [number, number] {
  return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t];
}

/**
 * Evaluates Cubic Bezier curve position at t (0 <= t <= 1)
 * p0: start point [x, y]
 * p1: control point 1 [x, y]
 * p2: control point 2 [x, y]
 * p3: end point [x, y]
 */
export function evaluateCubicBezier(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number
): { x: number; y: number; angleDegrees: number } {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  // Position
  const x =
    uuu * p0[0] +
    3 * uu * t * p1[0] +
    3 * u * tt * p2[0] +
    ttt * p3[0];
  const y =
    uuu * p0[1] +
    3 * uu * t * p1[1] +
    3 * u * tt * p2[1] +
    ttt * p3[1];

  // Derivative for tangent heading
  const dx =
    3 * uu * (p1[0] - p0[0]) +
    6 * u * t * (p2[0] - p1[0]) +
    3 * tt * (p3[0] - p2[0]);
  const dy =
    3 * uu * (p1[1] - p0[1]) +
    6 * u * t * (p2[1] - p1[1]) +
    3 * tt * (p3[1] - p2[1]);

  const angleRad = Math.atan2(dy, dx);
  const angleDegrees = (angleRad * 180) / Math.PI;

  return { x, y, angleDegrees };
}

/**
 * Format distance in km or meters
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format remaining seconds into MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0 min";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins < 60) {
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins}m`;
}
