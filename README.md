# Sunflower Fibonacci Pattern Generator

An interactive web-based tool for generating Fibonacci sunflower spiral patterns, designed for CAD tracing workflows.

**[Live Demo](https://leothas-dotcom.github.io/sunflower-fibonacci/)**

## Features

### Pattern Generation
- **Fibonacci Sunflower Spirals** — Dots placed using the golden angle (137.508°)
- **Formula**: `r = spacing × n^power`, `θ = n × goldenAngle + offset`
- **Auto-Fit** — Automatically calculates spacing to fill 85% of the canvas
- **Spiral Arm Highlighting** — Color-codes dots by Fibonacci family (8, 13, 21, 34, or 55 arms)
- **Size Gradient** — Optional dot size scaling from center to edge

### Interactive Controls (7 Sliders)
| Control | Range | Default | Description |
|---------|-------|---------|-------------|
| Number of Dots | 1–5,000 | 1,500 | Total seeds in the pattern |
| Spacing Factor | 0.1–15 mm | Auto-fit | Distance scaling between dots |
| Radial Power | 0.1–1.5 | 0.50 | Exponent in r = s × n^x (0.5 = classic Fermat spiral) |
| Dot Size | 0.2–5 mm | 1.0 | Radius of each dot |
| Dot Opacity | 0.05–1.0 | 1.0 | Transparency of dots |
| Golden Angle | 100–180° | 137.508° | Divergence angle (snaps to true golden angle) |
| Start Angle Offset | 0–360° | 0° | Rotates the entire pattern |

### Canvas & Grid
- **Editable Canvas Size** — Set width and height in millimeters
- **Millimeter Paper Grid** — 1 mm minor grid + 10 mm major grid
- **Center Axes** — Dashed crosshair at canvas center
- **Scale Labels** — mm markings along edges

### Dot Styling
- Color picker, filled/outline toggle
- Spiral arm color highlighting with Fibonacci presets (8/13/21/34/55)
- Size gradient option

### Export
- **PNG** — Raster export for quick reference
- **SVG** — Vector export with real mm units, ideal for CAD import

## Quick Start

1. Open `index.html` in any modern browser (or visit the [Live Demo](https://leothas-dotcom.github.io/sunflower-fibonacci/))
2. Click **Auto-Fit** to fill the canvas
3. Adjust sliders to shape your sunflower pattern
4. Export as SVG for CAD import

## Project Structure

```
sunflower-fibonacci/
├── index.html            # Main page with controls and canvas
├── css/
│   └── style.css         # Dark-themed UI styles
├── js/
│   └── sunflower.js      # Pattern generation, drawing & export logic
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## How It Works

Each dot `i` is placed at:
- **radius**: `spacing × i ^ power` (in mm, power = 0.5 for classic √n Fermat spiral)
- **angle**: `i × goldenAngle + offset`

The **golden angle** (≈ 137.508°) is derived from the golden ratio φ: `360° / φ² = 360° × (2 − φ) ≈ 137.508°`. This ensures no two dots align along the same radial line, producing the natural sunflower phyllotaxis pattern.

**Spiral arm highlighting** reveals the underlying Fibonacci structure — when you color dots by `i mod N` (where N is a Fibonacci number like 21), the N spiral arms become visible.

## CAD Workflow

1. Set your desired canvas size in mm
2. Click **Auto-Fit** or manually adjust spacing and dot count
3. Click **Export SVG** — the SVG uses real mm units in its viewBox
4. Import the SVG into your CAD tool (Fusion 360, FreeCAD, Inkscape, etc.)
5. Trace or directly use the dot positions

## License

Apache 2.0
