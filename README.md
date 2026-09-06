# Logistics Truck Route Visualizer | FleetPulse

A high-performance, responsive React frontend application that simulates a logistics delivery truck navigating through multi-stop routes (**Origin → D1 → D2 → D3**) with live telemetry, dynamic stop status, and interactive controls.

This solution directly fulfills the frontend developer assessment specification outlined in [`Truck_Route_Visualizer.md`](./Truck_Route_Visualizer.md).

---

## 🚀 Live Demo & Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or later (tested on Node v24)
- **npm**, **pnpm**, or **yarn**

### Installation & Execution
```bash
# 1. Clone or navigate to the project root
cd fleet-pulse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open your browser at `http://localhost:5173` (or the port indicated in your console).

### Production Build & Test
```bash
# Run unit test suite for mathematical engine
npm test

# Typecheck and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📋 Features & Technical Architecture

### 1. Route Map Visualization ([`src/components/map/StylizedMapView.tsx`](./src/components/map/StylizedMapView.tsx))
Faithfully reproduces the layout, typography, pin hierarchy, and styling from the assessment wireframe specification:
- **Checkpoints**:
  - **Origin**: Central logistics hub marked with a green pulse beacon and an `"Origin"` label below.
  - **Delivery Points (`D1`, `D2`, `D3`)**: Distinct custom SVG map pins with color-coded badges (`D1` red, `D2` amber/yellow, `D3` slate) and bold stop headers above.
  - **Stable Hover Target**: Each checkpoint includes a transparent event hit target with `transformBox: "fill-box"` and centered transform origin, preventing hover edge jitter or shaking.
- **Route Paths**:
  - **Traveled Path (Completed)**: Rendered in solid emerald green up to the truck's exact position.
  - **Upcoming Path (Remaining)**: Rendered in blue dashed lines from the front of the truck through remaining destinations.
  - **Smooth Cubic Bezier Splines**: Multi-point curves match the wireframe shape: an upward arc over `D1`, swooping down to `D2`, dipping into a lower curve, and sweeping up to `D3`.
- **Animated Truck Marker**:
  - Continuous 60fps movement along the spline.
  - Heading angle computed via the curve's mathematical tangent derivative `(dy, dx)` so the truck naturally rotates along turns.
  - Signal pulse effect radiating from the vehicle to indicate live GPS telemetry.

---

### 2. Live Truck Status Panel ([`src/components/status/TruckStatusCard.tsx`](./src/components/status/TruckStatusCard.tsx))
A floating status card placed at the bottom-right corner of the map matching the wireframe:
- **`Current`**: Displays the active leg in transit (`Between Origin → D1`, `Between D1 → D2`, `Between D2 → D3`) or the arrival dock (`Delivering at D1`).
- **`Distance covered`**: Live distance accumulator counting up to the total trip distance (e.g. `4.2 km / 13.1 km`).
- **`Next stop`**: Identifies the destination waypoint currently being approached.
- **`Completed`**: Progress counter (`0/3` → `1/3` → `2/3` → `3/3`) indicating delivered parcels.
- **Unloading Dwell Indicator**: When the truck pulls into a delivery dock, the card activates an unloading progress bar with countdown timer.
- **Overall Trip Progress**: Gradient progress bar showing percentage of total itinerary completed.

---

### 3. Simulation & Telematics Engine ([`src/hooks/useRouteSimulation.ts`](./src/hooks/useRouteSimulation.ts))
Built with a decoupled, high-performance architecture:
- **`requestAnimationFrame` Loop with Mutable Refs**:
  - State variables (`progress`, `isDwelling`, `segmentIndex`, `heading`) are computed using a mutable reference (`simRef`).
  - Completely eliminates React state closure lag, race conditions, and accidental double-incrementing of stops.
- **Delta-Time Normalization**:
  - Frame progression calculates delta-time (`deltaSec`), ensuring identical speed across 60Hz, 120Hz, or 144Hz monitors.
  - Clamps `deltaSec` to `100ms` max so switching or backgrounding browser tabs never causes the truck to glitch or jump forward.
- **Stop Dwell & Unloading**:
  - Automatically pauses at each destination (`D1`, `D2`, `D3`) for ~2.5 seconds to simulate package unloading.
  - The truck retains its arrival heading while parked rather than resetting or snapping.

---

### 4. Interactive Simulation Controls ([`src/components/controls/SimulationControls.tsx`](./src/components/controls/SimulationControls.tsx))
- **Pause / Resume**:
  - Toggle tracking on the fly using the UI button or by pressing the **Spacebar**.
- **Replay / Reset**:
  - Instantly rewind to the Origin hub with fresh cargo metrics.
- **Speed Multipliers (`0.5x`, `1x`, `2x`, `5x`)**:
  - Fast-forward the simulation to test complete delivery cycles in seconds.
- **Quick Leg Navigation (`Leg 1`, `Leg 2`, `Leg 3`)**:
  - Direct shortcut buttons to jump immediately to any segment on the route.

---

### 5. Dynamic ETA & Vehicle Telemetry ([`src/components/status/MetricsGrid.tsx`](./src/components/status/MetricsGrid.tsx))
Four real-time telematics KPI summary cards:
1. **Total Distance**: Cumulative mileage accrued vs. full route length.
2. **Dynamic ETA**: Calculated from remaining track distance divided by effective vehicle speed (`distance / (speed * multiplier)`).
3. **Telemetry Speedometer**: Simulated cruising velocity with realistic road speed fluctuations, throttled to prevent unnecessary React re-renders.
4. **EV Powertrain Health**: Battery level tracking and powertrain temperature monitoring.

---

### 6. Delivery Manifest & Cargo Timeline ([`src/components/status/WaypointList.tsx`](./src/components/status/WaypointList.tsx))
- Real-time status chips for each stop: `Departed`, `In Transit`, `Unloading...`, and `Delivered`.
- Cargo breakdown showing tracking codes, recipient names, parcel item counts, and weights.
- Clicking any checkpoint pin on the map opens a modal card with full delivery manifest details.

---

### 7. Dark Mode & Theme Persistence ([`src/hooks/useTheme.ts`](./src/hooks/useTheme.ts))
- Built with Tailwind CSS v4 class-based variant (`@custom-variant dark`).
- Seamless toggling between light slate and high-contrast dark themes via the header Sun/Moon button.
- User preference persists in `localStorage` and falls back to system preference (`prefers-color-scheme`).

---

## 🧮 Mathematical Utilities ([`src/services/geoUtils.ts`](./src/services/geoUtils.ts))

- **Haversine Distance**:
  Computes great-circle distance between coordinates in kilometers:
  $$\Delta\sigma = 2 \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
- **Compass Bearing**:
  Computes azimuth heading degrees ($0^\circ$ to $360^\circ$) from origin to destination coordinates.
- **Cubic Bezier Spline Evaluation**:
  Evaluates 2D canvas coordinates $(x, y)$ and tangent orientation angle $\theta = \operatorname{atan2}(dy, dx)$ along parameterized cubic curves with 4 control points.

---

## 🧪 Testing Suite (`scripts/verify-engine.mjs`)

Execute unit tests directly using Node's native test runner:
```bash
npm test
```
**Test Coverage**:
- Haversine great-circle calculation accuracy.
- Compass bearing boundary conditions ($0^\circ$ to $360^\circ$).
- Cubic Bezier curve boundary evaluation at $t=0$ and $t=1$.

---

## 📁 Directory Structure

```
fleet-pulse/
├── README.md                      # Comprehensive project documentation
├── Truck_Route_Visualizer.md      # Assessment requirements & specifications
├── index.html                     # Entry HTML document
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # Strict TypeScript compiler options
├── vite.config.ts                 # Vite + Tailwind v4 configuration
├── scripts/
│   └── verify-engine.mjs          # Mathematics and telemetry unit tests
└── src/
    ├── main.tsx                   # React root entry
    ├── App.tsx                    # Master dashboard layout
    ├── index.css                  # Tailwind styles and custom animations
    ├── types/
    │   └── route.ts               # Interfaces for Waypoints, Segments, SimulationState
    ├── data/
    │   └── mockRouteData.ts       # Coordinate definitions and cargo manifests
    ├── services/
    │   ├── geoUtils.ts            # Haversine, Bearing, and Bezier math engine
    │   └── mockApi.ts             # Simulated dispatch API endpoint
    ├── hooks/
    │   ├── useRouteSimulation.ts  # 60fps simulation state machine hook
    │   └── useTheme.ts            # Dark/light theme manager
    └── components/
        ├── common/
        │   └── Header.tsx         # Navbar with theme toggle & live dispatch beacon
        ├── map/
        │   ├── StylizedMapView.tsx# SVG map canvas matching wireframe layout
        │   └── MapLegend.tsx      # Origin, Delivery point, and Live Truck legend
        ├── status/
        │   ├── TruckStatusCard.tsx# Floating "TRUCK STATUS" HUD card
        │   ├── MetricsGrid.tsx    # KPI cards (ETA, Distance, Speed, Battery)
        │   └── WaypointList.tsx   # Delivery schedule & cargo manifest timeline
        └── controls/
            └── SimulationControls.tsx # Play/Pause, Reset, Speed, and Jump controls
```
