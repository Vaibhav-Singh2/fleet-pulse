# Logistics Truck Route Visualizer
*React / Angular*

## Problem Statement
Build a frontend application that simulates a truck moving through delivery locations.

## Route Map Specification
- **Mock Route**: `Origin → D1 → D2 → D3` with live truck position and status panel.
- **Visuals**:
  - Origin location (Distribution Center)
  - 3 delivery points (`D1`, `D2`, `D3`)
  - Route path connecting points (with traveled vs remaining path styling)
  - Animated truck marker moving along the route
- **Status Panel ("TRUCK STATUS")**:
  - `Current`: Between Origin → D1 (or dynamic segment / arrival status)
  - `Distance covered`: 4.2 km (live updating)
  - `Next stop`: D1
  - `Completed`: 0/3 (0/3 → 1/3 → 2/3 → 3/3)

## Requirements
- Show a map with:
  - Origin location
  - 3 delivery points (D1, D2, D3)
  - Route path
- Animate a truck marker moving: `Origin → D1 → D2 → D3`
- Show current truck status:
  - Current location
  - Distance covered
  - Next stop
  - Completed stops

## Expected Skills
- Component design
- State management
- API handling
- Map integration
- UI/UX thinking

## Bonus Features
- Pause / resume tracking
- ETA calculation
- Dark mode
- Playback speed multiplier (0.5x, 1x, 2x, 5x)
- Waypoint dwell & delivery progress

---

## Running the Solution
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
