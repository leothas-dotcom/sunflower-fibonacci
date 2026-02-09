# Sunflower Fibonacci Pattern Generator

An interactive web-based tool for generating Fibonacci sunflower spiral patterns, designed for CAD tracing workflows. Supports sunflower, pinecone (diamond shapes), and double-spiral modes with full SVG/DXF export.

**[Live Demo](https://leothas-dotcom.github.io/sunflower-fibonacci/)**

## Screenshots

| Sunflower | Pinecone | Double Spiral |
|-----------|----------|---------------|
| ![Sunflower Pattern](docs/screenshot-sunflower.png) | ![Pinecone Pattern](docs/screenshot-pinecone.png) | ![Double Spiral Pattern](docs/screenshot-double-spiral.png) |

> **Note:** Add screenshots to the `docs/` folder to make them visible here.

## Features

### Pattern Modes
- **Sunflower** — Classic Fibonacci phyllotaxis using the golden angle (137.508°)
- **Pinecone** — Diamond/rhombus shapes oriented radially, with scale gradient
- **Double Spiral** — Two overlaid dot sets with configurable Fibonacci family pairs (8/13, 13/21, 21/34, 34/55)

### Interactive Controls
| Control | Range | Default | Description |
|---------|-------|---------|-------------|
| Number of Dots | 1–5,000 | 500 | Total seeds in the pattern |
| Spacing Factor | 0.1–15 mm | Auto-fit | Distance scaling between dots |
| Radial Power | 0.1–1.5 | 0.50 | Density distribution (0.5 = classic Fermat √n) |
| Center Packing | 0–3 | 0 | Higher = denser center |
| Dot Max Size | 0.2–5 mm | 1.0 | Maximum dot radius |
| Dot Min Size | 0–5 mm | 0.2 | Minimum dot radius (for size gradient) |
| Dot Opacity | 0.05–1.0 | 1.0 | Transparency |
| Golden Angle | 100–180° | 137.508° | Divergence angle (snaps to true golden angle) |
| Start Angle Offset | 0–360° | 0° | Rotates the entire pattern |
| Pinecone Scale | 0–1 | 0.70 | Diamond size scaling from center to edge |
| Spiral B Offset | 0–360° | 0° | Angular offset for second spiral set |
| Center Packing | 0–3 | 0 | Packs more dots toward the center |

### Size Gradient
- **None** — All dots are the same size (max size)
- **Inner → Outer** — Small at center, large at edge
- **Outer → Inner** — Large at center, small at edge

### Canvas & Grid
- **Editable Canvas Size** — Width and height in millimeters (default 100×100 mm)
- **Millimeter Paper Grid** — 1 mm minor grid + 10 mm major grid
- **Center Axes** — Dashed crosshair at canvas center
- **Scale Labels** — mm markings along edges

### Dot Styling
- Color picker for dots (and separate Spiral B color in double-spiral mode)
- Filled/outline toggle
- Spiral arm color highlighting with warm/cool palettes
- Fibonacci family presets (8, 13, 21, 34, 55)

### Export (CAD-ready)
- **PNG** — Raster export of the canvas view
- **SVG** — Circular vector export with real mm units, center crosshair, no grid — ideal for CAD import
- **DXF** — Native CAD format with CIRCLE/LWPOLYLINE entities, layers (DOTS, BORDER, CENTER), mm units

### Presets
- **Save** unlimited named presets to browser localStorage
- **Load** any saved preset to restore all settings
- **Delete** presets you no longer need

### Responsive Layout
- Adapts to mobile and tablet screens — controls stack above the canvas
- Works on any modern browser

## Quick Start

1. Open `index.html` in any modern browser (or visit the [Live Demo](https://leothas-dotcom.github.io/sunflower-fibonacci/))
2. Click **Auto-Fit** to fill the canvas
3. Adjust sliders to shape your pattern
4. Export as **SVG** or **DXF** for CAD import

## Project Structure

```
sunflower-fibonacci/
├── index.html            # Main page with controls and canvas
├── css/
│   └── style.css         # Dark-themed responsive UI styles
├── js/
│   └── sunflower.js      # Pattern generation, drawing & export logic
├── docs/                 # Screenshots (add your own)
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## How It Works

Each dot `i` is placed at:
- **radius**: `rMax × packed^power` where `rMax = spacing × √(n-1)` and `packed = t^(1+packing)`
- **angle**: `i × goldenAngle + offset`

The **golden angle** (≈ 137.508°) is derived from the golden ratio φ: `360° / φ² ≈ 137.508°`. This ensures no two dots align along the same radial line, producing the natural sunflower phyllotaxis pattern.

**Spiral arm highlighting** reveals the underlying Fibonacci structure — when you color dots by `i mod N` (where N is a Fibonacci number like 21), the N spiral arms become visible.

**Double spiral mode** overlays two separate dot sets (Spiral A and Spiral B), each with its own color. The CW/CCW spiral appearance comes from using different Fibonacci family counts.

## CAD Workflow

1. Set your desired canvas size in mm
2. Click **Auto-Fit** or manually adjust spacing and dot count
3. Click **Export SVG** or **Export DXF**
   - SVG: Circular format with real mm units, center crosshair, no grid
   - DXF: Layered (DOTS, BORDER, CENTER), circles or diamond polylines, mm units
4. Import into your CAD tool (Fusion 360, FreeCAD, Inkscape, LibreCAD, etc.)
5. Dots are on the DOTS layer — easy to select and manipulate separately from the border

## License

Apache 2.0
