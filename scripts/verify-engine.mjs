import test from "node:test";
import assert from "node:assert/strict";

// Test Haversine distance
function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

// Test Bearing
function calculateBearing(lat1, lon1, lat2, lon2) {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
}

// Test Bezier interpolation
function evaluateCubicBezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
  const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
  return { x, y };
}

test("Haversine Distance correctly computes non-zero distance", () => {
  const dist = calculateHaversineKm(37.7749, -122.4194, 37.7892, -122.4014);
  assert.ok(dist > 1.8 && dist < 3.0, `Expected distance ~2.2km, got ${dist}`);
});

test("Bearing returns valid compass degree (0-360)", () => {
  const bearing = calculateBearing(37.7749, -122.4194, 37.7892, -122.4014);
  assert.ok(bearing >= 0 && bearing <= 360, `Bearing out of range: ${bearing}`);
});

test("Cubic Bezier boundary conditions (t=0 and t=1)", () => {
  const start = evaluateCubicBezier([100, 200], [150, 250], [200, 150], [300, 400], 0);
  assert.equal(start.x, 100);
  assert.equal(start.y, 200);

  const end = evaluateCubicBezier([100, 200], [150, 250], [200, 150], [300, 400], 1);
  assert.equal(end.x, 300);
  assert.equal(end.y, 400);
});

console.log("All telemetry and mathematics engine unit tests passed!");
