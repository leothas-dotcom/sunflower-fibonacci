# Sunflower Fibonacci Pattern Generator

An interactive web-based tool for generating Fibonacci sunflower spiral patterns, designed for CAD tracing workflows.

![Pattern Preview](https://img.shields.io/badge/Status-Ready-brightgreen)

## Features

- **Fibonacci Sunflower Spirals** — Dots placed using the golden angle (137.508°) with `r = spacing × √n`
- **Interactive Sliders** — Control number of dots (1–2000), spacing factor, and dot size in real-time
- **Millimeter Paper Grid** — 1mm minor grid and 10mm major grid for precise CAD tracing
- **Editable Canvas Size** — Set width and height in millimeters
- **Center Axes** — Dashed crosshair at the canvas center for alignment
- **Scale Labels** — mm markings along the edges
- **Dot Styling** — Choose color and filled/outline mode
- **Export PNG** — Raster export for quick reference
- **Export SVG** — Vector export with mm units, ideal for importing into CAD software

## Quick Start

1. Open `index.html` in any modern browser
2. Adjust sliders to shape your sunflower pattern
3. Export as SVG for CAD import

Or use VS Code's **Live Preview** extension (installed) — right-click `index.html` → *Show Preview*.

## Project Structure

```
sunflower-fibonacci/
├── index.html          # Main page
├── css/
│   └── style.css       # UI styles
├── js/
│   └── sunflower.js    # Pattern generation logic
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## How It Works

Each dot `i` is placed at:
- **radius**: `spacing × √i` (in mm)
- **angle**: `i × 137.508°` (golden angle)

This produces the natural sunflower/phyllotaxis pattern where no two dots overlap along the same radial line.

## CAD Workflow

1. Set your desired canvas size in mm
2. Adjust dots and spacing to your design needs
3. Click **Export SVG** — the SVG uses real mm units in its viewBox
4. Import the SVG into your CAD tool (Fusion 360, FreeCAD, Inkscape, etc.)
5. Trace or directly use the dot positions

## License

MIT
