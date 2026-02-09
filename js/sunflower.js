/**
 * Sunflower Fibonacci Pattern Generator
 *
 * Draws Fibonacci sunflower spirals on a 2D canvas with
 * millimeter-paper grid for CAD tracing workflows.
 *
 * Golden angle ≈ 137.508° (360° / φ²)
 */

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────
  const GOLDEN_ANGLE_DEG = 137.50776405003785;
  const GOLDEN_ANGLE_RAD = GOLDEN_ANGLE_DEG * (Math.PI / 180);
  const PX_PER_MM = 3.7795275591; // CSS reference pixel per mm (96 dpi)

  // Spiral palette — distinct hues for up to 55 families
  const SPIRAL_PALETTE = [
    '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4',
    '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990',
    '#dcbeff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
    '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#e6beff',
    '#1abc9c', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6',
    '#f39c12', '#1abc9c', '#e67e22', '#e91e63', '#00bcd4',
    '#8bc34a', '#ff5722', '#607d8b', '#795548', '#cddc39',
    '#ff9800', '#2196f3', '#4caf50', '#9c27b0', '#00e5ff',
    '#76ff03', '#ff1744', '#651fff', '#00b0ff', '#69f0ae',
    '#ff6d00', '#d500f9', '#304ffe', '#64dd17', '#dd2c00',
    '#00bfa5', '#aa00ff', '#6200ea', '#ffd600', '#c51162'
  ];

  // Warm palette (reds/oranges/yellows) for CW spiral families
  const WARM_PALETTE = [
    '#e6194b', '#ff4444', '#f58231', '#ff6d00', '#e91e63',
    '#d32f2f', '#ff5722', '#ff9800', '#f44336', '#e65100',
    '#c62828', '#ff7043', '#ff8a65', '#ef5350', '#d84315',
    '#bf360c', '#e53935', '#ff5252', '#ff6e40', '#dd2c00',
    '#b71c1c', '#ff1744', '#ff3d00', '#ff9100', '#ffab00',
    '#e64a19', '#f4511e', '#ff8f00', '#ff6f00', '#e57373',
    '#ffab91', '#ffccbc', '#ff8a80', '#ea80fc', '#ce93d8',
    '#f48fb1', '#ef9a9a', '#ffcdd2', '#d50000', '#c51162',
    '#ff80ab', '#ff4081', '#f50057', '#ff1744', '#d81b60',
    '#ad1457', '#880e4f', '#e91e63', '#f06292', '#ec407a',
    '#ff5252', '#ff1744', '#d50000', '#c62828', '#b71c1c'
  ];

  // Cool palette (blues/greens/purples) for CCW spiral families
  const COOL_PALETTE = [
    '#4363d8', '#2196f3', '#00bcd4', '#009688', '#3f51b5',
    '#1565c0', '#0288d1', '#00acc1', '#00897b', '#303f9f',
    '#0d47a1', '#01579b', '#006064', '#004d40', '#1a237e',
    '#1976d2', '#0097a7', '#00796b', '#283593', '#0277bd',
    '#00838f', '#00695c', '#1b5e20', '#2e7d32', '#388e3c',
    '#43a047', '#4caf50', '#66bb6a', '#81c784', '#a5d6a7',
    '#00e5ff', '#00b0ff', '#2979ff', '#304ffe', '#651fff',
    '#6200ea', '#aa00ff', '#d500f9', '#536dfe', '#448aff',
    '#40c4ff', '#18ffff', '#64ffda', '#69f0ae', '#b2ff59',
    '#00bfa5', '#00b8d4', '#0091ea', '#2962ff', '#6200ea',
    '#304ffe', '#2979ff', '#448aff', '#00b0ff', '#0091ea'
  ];

  // ─── DOM Elements ─────────────────────────────────────
  const canvas = document.getElementById('sunflowerCanvas');
  const ctx = canvas.getContext('2d');

  const elCanvasWidth  = document.getElementById('canvasWidth');
  const elCanvasHeight = document.getElementById('canvasHeight');
  const elApplySize    = document.getElementById('applyCanvasSize');
  const elAutoFit      = document.getElementById('autoFit');
  const elNumDots      = document.getElementById('numDots');
  const elNumDotsValue = document.getElementById('numDotsValue');
  const elSpacing      = document.getElementById('spacing');
  const elSpacingValue = document.getElementById('spacingValue');
  const elDotSize      = document.getElementById('dotSize');
  const elDotSizeValue = document.getElementById('dotSizeValue');
  const elDotSizeMin   = document.getElementById('dotSizeMin');
  const elDotSizeMinValue = document.getElementById('dotSizeMinValue');
  const elRadialPower  = document.getElementById('radialPower');
  const elRadialPowerValue = document.getElementById('radialPowerValue');
  const elCenterPacking = document.getElementById('centerPacking');
  const elCenterPackingValue = document.getElementById('centerPackingValue');
  const elDotOpacity   = document.getElementById('dotOpacity');
  const elDotOpacityValue = document.getElementById('dotOpacityValue');
  const elStartAngle   = document.getElementById('startAngle');
  const elStartAngleValue = document.getElementById('startAngleValue');
  const elShowGrid     = document.getElementById('showGrid');
  const elShowMajorGrid = document.getElementById('showMajorGrid');
  const elShowAxes     = document.getElementById('showAxes');
  const elShowLabels   = document.getElementById('showLabels');
  const elDotColor     = document.getElementById('dotColor');
  const elFillDots     = document.getElementById('fillDots');
  const elColorSpirals = document.getElementById('colorSpirals');
  const elSpiralCountRow = document.getElementById('spiralCountRow');
  const elSizeGradient = document.getElementById('sizeGradient');
  const elShapeMargin     = document.getElementById('edgeMargin');
  const elShapeMarginValue = document.getElementById('edgeMarginValue');
  const elShapeMarginRow  = document.getElementById('edgeMarginRow');
  const elShapeFillMode   = document.getElementById('shapeFillMode');
  const elShapeFillModeRow = document.getElementById('shapeFillModeRow');
  const elHoleSizeMode    = document.getElementById('holeSizeMode');
  const elHoleSizeModeRow = document.getElementById('holeSizeModeRow');
  const elShapeSize       = document.getElementById('shapeSize');
  const elShapeSizeValue  = document.getElementById('shapeSizeValue');
  const elShapeSizeRow    = document.getElementById('shapeSizeRow');
  const elSpacingRow      = document.getElementById('spacingRow');
  const elRadialPowerRow  = document.getElementById('radialPowerRow');
  const elCenterPackingRow = document.getElementById('centerPackingRow');
  const elDotSizeRow      = document.getElementById('dotSizeRow');
  const elDotSizeMinRow   = document.getElementById('dotSizeMinRow');
  const elDotOpacityRow   = document.getElementById('dotOpacityRow');
  const elGoldenAngleRow  = document.getElementById('goldenAngleRow');
  const elStartAngleRow   = document.getElementById('startAngleRow');
  const elColorSpiralsRow = document.getElementById('colorSpiralsRow');
  const elSizeGradientRow = document.getElementById('sizeGradientRow');
  const elGoldenAngle  = document.getElementById('goldenAngle');
  const elGoldenAngleValue = document.getElementById('goldenAngleValue');
  const elSnapGoldenAngle = document.getElementById('snapGoldenAngle');
  const elPatternType  = document.getElementById('patternType');
  const elDotColor2    = document.getElementById('dotColor2');
  const elDotColor2Row = document.getElementById('dotColor2Row');
  const elSpiralBOffset = document.getElementById('spiralBOffset');
  const elSpiralBOffsetValue = document.getElementById('spiralBOffsetValue');
  const elSpiralBOffsetRow = document.getElementById('spiralBOffsetRow');
  const elFibPairRow   = document.getElementById('fibPairRow');
  const elPineconeScale = document.getElementById('pineconeScale');
  const elPineconeScaleValue = document.getElementById('pineconeScaleValue');
  const elPineconeScaleRow = document.getElementById('pineconeScaleRow');
  const elResetDefaults = document.getElementById('resetDefaults');
  const elExportPNG    = document.getElementById('exportPNG');
  const elExportSVG    = document.getElementById('exportSVG');
  const elExportDXF    = document.getElementById('exportDXF');
  const elPresetName   = document.getElementById('presetName');
  const elPresetSave   = document.getElementById('presetSave');
  const elPresetList   = document.getElementById('presetList');
  const elPresetLoad   = document.getElementById('presetLoad');
  const elPresetDelete = document.getElementById('presetDelete');
  const elInfoStats    = document.getElementById('infoStats');

  // ─── Defaults ─────────────────────────────────────────
  const DEFAULTS = {
    canvasWidth: 100,
    canvasHeight: 100,
    numDots: 50,
    spacing: 2.2,
    radialPower: 0.5,
    dotSize: 1.0,
    dotSizeMin: 0.2,
    dotOpacity: 1.0,
    startAngle: 0,
    goldenAngle: GOLDEN_ANGLE_DEG,
    showGrid: true,
    showMajorGrid: true,
    showAxes: true,
    showLabels: true,
    dotColor: '#d4a017',
    dotColor2: '#4363d8',
    patternType: 'sunflower',
    pineconeScale: 0.7,
    spiralBOffset: 180,
    centerPacking: 0,
    fillDots: true,
    colorSpirals: false,
    sizeGradient: 'none',
    edgeMargin: 2,
    shapeFillMode: 'outline',
    holeSizeMode: 'fibonacci',
    shapeSize: 90
  };

  // Snap threshold for golden angle (degrees)
  const GOLDEN_SNAP_THRESHOLD = 0.15;

  // ─── State ────────────────────────────────────────────
  let widthMM  = parseFloat(elCanvasWidth.value);
  let heightMM = parseFloat(elCanvasHeight.value);
  let spiralFamilies = 21; // default Fibonacci number for spiral coloring
  let fibCW = 21;  // clockwise spiral family count
  let fibCCW = 34; // counter-clockwise spiral family count

  // ─── Helpers ──────────────────────────────────────────

  function mmToPx(mm) {
    return mm * PX_PER_MM;
  }

  /** Zeckendorf-like decomposition: express n as sum of Fibonacci numbers */
  function fibDecompose(n) {
    const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];
    const groups = [];
    let remaining = n;
    for (let i = fibs.length - 1; i >= 0 && remaining > 0; i--) {
      if (fibs[i] <= remaining) {
        groups.push(fibs[i]);
        remaining -= fibs[i];
      }
    }
    if (remaining > 0) groups.push(remaining);
    return groups.sort((a, b) => a - b); // smallest first
  }

  /** Seeded pseudo-random for deterministic layout */
  function seededRandom(seed) {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  /** Generate dots for basic shapes (circle, rectangle, triangle) */
  function computeShapeDots() {
    const n         = parseInt(elNumDots.value, 10);
    const baseDotMM = parseFloat(elDotSize.value);
    const minDotMM  = parseFloat(elDotSizeMin.value);
    const color     = elDotColor.value;
    const pattern   = elPatternType.value;
    const margin    = parseFloat(elShapeMargin.value);
    const fillMode  = elShapeFillMode.value;
    const holeSizeMode = elHoleSizeMode.value; // 'uniform' or 'fibonacci'
    const shapeScale = parseFloat(elShapeSize.value) / 100;

    const halfW = widthMM / 2 * shapeScale;
    const halfH = heightMM / 2 * shapeScale;
    const dots = [];

    // Build size assignment
    let sizeForIndex;
    if (holeSizeMode === 'fibonacci' && n > 1) {
      const groups = fibDecompose(n);
      const numGroups = groups.length;
      const sizeMap = [];
      for (let g = 0; g < numGroups; g++) {
        const t = numGroups > 1 ? g / (numGroups - 1) : 0.5;
        const radius = (minDotMM + (baseDotMM - minDotMM) * t) / 2;
        for (let j = 0; j < groups[g]; j++) {
          sizeMap.push(radius);
        }
      }
      // Shuffle deterministically
      const rand = seededRandom(n * 7 + 13);
      for (let i = sizeMap.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [sizeMap[i], sizeMap[j]] = [sizeMap[j], sizeMap[i]];
      }
      sizeForIndex = (i) => sizeMap[i] || baseDotMM / 2;
    } else {
      sizeForIndex = () => baseDotMM / 2;
    }

    /** Compute equilateral triangle vertices centered by bounding box */
    function triVerts(R) {
      const raw = [
        [R * Math.cos(-Math.PI/2), R * Math.sin(-Math.PI/2)],
        [R * Math.cos(-Math.PI/2 + 2*Math.PI/3), R * Math.sin(-Math.PI/2 + 2*Math.PI/3)],
        [R * Math.cos(-Math.PI/2 + 4*Math.PI/3), R * Math.sin(-Math.PI/2 + 4*Math.PI/3)]
      ];
      // Bounding-box center shift so triangle is visually centered
      const ys = raw.map(v => v[1]);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const shiftY = -(minY + maxY) / 2;
      return raw.map(v => [v[0], v[1] + shiftY]);
    }

    if (fillMode === 'outline') {
      if (pattern === 'shape-circle') {
        const r = Math.min(halfW, halfH) - margin;
        for (let i = 0; i < n; i++) {
          const angle = (2 * Math.PI * i) / n;
          dots.push({
            xMM: r * Math.cos(angle), yMM: r * Math.sin(angle),
            radiusMM: sizeForIndex(i), theta: angle, color, strokeColor: null
          });
        }
      } else if (pattern === 'shape-rectangle') {
        const w = widthMM * shapeScale - 2 * margin;
        const h = heightMM * shapeScale - 2 * margin;
        const perimeter = 2 * (w + h);
        for (let i = 0; i < n; i++) {
          let d = (perimeter * i) / n;
          let x, y;
          if (d < w) {
            x = -w/2 + d; y = -h/2;
          } else if (d < w + h) {
            x = w/2; y = -h/2 + (d - w);
          } else if (d < 2*w + h) {
            x = w/2 - (d - w - h); y = h/2;
          } else {
            x = -w/2; y = h/2 - (d - 2*w - h);
          }
          const angle = Math.atan2(y, x);
          dots.push({
            xMM: x, yMM: y, radiusMM: sizeForIndex(i),
            theta: angle, color, strokeColor: null
          });
        }
      } else if (pattern === 'shape-triangle') {
        const r = Math.min(halfW, halfH) - margin;
        const verts = triVerts(r);
        const edges = [
          [verts[0], verts[1]], [verts[1], verts[2]], [verts[2], verts[0]]
        ];
        const edgeLens = edges.map(([a, b]) =>
          Math.sqrt((b[0]-a[0])**2 + (b[1]-a[1])**2)
        );
        const totalLen = edgeLens.reduce((s, l) => s + l, 0);
        for (let i = 0; i < n; i++) {
          let d = (totalLen * i) / n;
          let x, y;
          for (let e = 0; e < 3; e++) {
            if (d <= edgeLens[e] || e === 2) {
              const t = d / edgeLens[e];
              const [a, b] = edges[e];
              x = a[0] + t * (b[0] - a[0]);
              y = a[1] + t * (b[1] - a[1]);
              break;
            }
            d -= edgeLens[e];
          }
          const angle = Math.atan2(y, x);
          dots.push({
            xMM: x, yMM: y, radiusMM: sizeForIndex(i),
            theta: angle, color, strokeColor: null
          });
        }
      }
    } else {
      // Filled mode: uniform deterministic distribution
      if (pattern === 'shape-rectangle') {
        // Rectangular grid
        const w = widthMM * shapeScale - 2 * margin;
        const h = heightMM * shapeScale - 2 * margin;
        if (n === 1) {
          dots.push({ xMM: 0, yMM: 0, radiusMM: sizeForIndex(0), theta: 0, color, strokeColor: null });
        } else {
          // Find grid dims closest to N while respecting aspect ratio
          const aspect = w / h;
          let bestCols = 1, bestRows = 1, bestDiff = Infinity;
          for (let c = 1; c <= n; c++) {
            const r = Math.round(c / aspect);
            if (r < 1) continue;
            const diff = Math.abs(c * r - n);
            if (diff < bestDiff || (diff === bestDiff && Math.abs(c/r - aspect) < Math.abs(bestCols/bestRows - aspect))) {
              bestDiff = diff; bestCols = c; bestRows = r;
            }
            if (c * 1 > n) break;
          }
          const cols = bestCols, rows = bestRows;
          const total = cols * rows;
          let placed = 0;
          for (let row = 0; row < rows && placed < n; row++) {
            for (let col = 0; col < cols && placed < n; col++) {
              const x = cols > 1 ? -w/2 + col * w / (cols - 1) : 0;
              const y = rows > 1 ? -h/2 + row * h / (rows - 1) : 0;
              dots.push({
                xMM: x, yMM: y, radiusMM: sizeForIndex(placed),
                theta: Math.atan2(y, x), color, strokeColor: null
              });
              placed++;
            }
          }
        }
      } else if (pattern === 'shape-circle') {
        // Vogel/Fermat spiral (golden angle) — uniform disc packing
        const r = Math.min(halfW, halfH) - margin;
        for (let i = 0; i < n; i++) {
          const frac = n > 1 ? i / (n - 1) : 0;
          const rDot = r * Math.sqrt(frac);
          const angle = i * GOLDEN_ANGLE_RAD;
          dots.push({
            xMM: rDot * Math.cos(angle), yMM: rDot * Math.sin(angle),
            radiusMM: sizeForIndex(i), theta: angle, color, strokeColor: null
          });
        }
      } else if (pattern === 'shape-triangle') {
        // Triangular lattice rows inside the triangle
        const R = Math.min(halfW, halfH) - margin;
        const verts = triVerts(R);
        // v0=top, v1=bottom-right, v2=bottom-left (after centering)
        const [v0, v1, v2] = verts;
        const minY = Math.min(v0[1], v1[1], v2[1]);
        const maxY = Math.max(v0[1], v1[1], v2[1]);
        const triH = maxY - minY;

        if (n === 1) {
          const cx = (v0[0] + v1[0] + v2[0]) / 3;
          const cy = (v0[1] + v1[1] + v2[1]) / 3;
          dots.push({ xMM: cx, yMM: cy, radiusMM: sizeForIndex(0), theta: 0, color, strokeColor: null });
        } else {
          // Iteratively find rowCount that produces ~N dots
          let bestRows = 1, bestTotal = 1;
          for (let tryRows = 1; tryRows <= n; tryRows++) {
            let total = 0;
            for (let r = 0; r < tryRows; r++) {
              const y = minY + (tryRows > 1 ? r * triH / (tryRows - 1) : triH / 2);
              // Find left/right x at this y by intersecting triangle edges
              const xs = [];
              const allEdges = [[v0, v1], [v1, v2], [v2, v0]];
              for (const [ea, eb] of allEdges) {
                if ((ea[1] <= y && eb[1] >= y) || (eb[1] <= y && ea[1] >= y)) {
                  const t = (eb[1] === ea[1]) ? 0.5 : (y - ea[1]) / (eb[1] - ea[1]);
                  xs.push(ea[0] + t * (eb[0] - ea[0]));
                }
              }
              if (xs.length >= 2) {
                const xMin = Math.min(...xs);
                const xMax = Math.max(...xs);
                const rowW = xMax - xMin;
                const dotsInRow = rowW < 0.01 ? 1 : Math.max(1, Math.round(rowW / (triH / (tryRows - 1 || 1))));
                total += dotsInRow;
              } else {
                total += 1;
              }
            }
            if (Math.abs(total - n) < Math.abs(bestTotal - n)) {
              bestRows = tryRows; bestTotal = total;
            }
            if (total >= n * 1.5) break;
          }
          // Now place dots with bestRows
          const rowCount = bestRows;
          let placed = 0;
          // Collect all potential positions first
          const positions = [];
          for (let r = 0; r < rowCount; r++) {
            const y = minY + (rowCount > 1 ? r * triH / (rowCount - 1) : triH / 2);
            const xs = [];
            const allEdges = [[v0, v1], [v1, v2], [v2, v0]];
            for (const [ea, eb] of allEdges) {
              if ((ea[1] <= y && eb[1] >= y) || (eb[1] <= y && ea[1] >= y)) {
                const t = (eb[1] === ea[1]) ? 0.5 : (y - ea[1]) / (eb[1] - ea[1]);
                xs.push(ea[0] + t * (eb[0] - ea[0]));
              }
            }
            if (xs.length >= 2) {
              const xMin = Math.min(...xs);
              const xMax = Math.max(...xs);
              const rowW = xMax - xMin;
              const rowSpacing = rowCount > 1 ? triH / (rowCount - 1) : triH;
              const dotsInRow = rowW < 0.01 ? 1 : Math.max(1, Math.round(rowW / rowSpacing));
              for (let c = 0; c < dotsInRow; c++) {
                const x = dotsInRow > 1 ? xMin + c * rowW / (dotsInRow - 1) : (xMin + xMax) / 2;
                positions.push([x, y]);
              }
            } else if (xs.length === 1) {
              positions.push([xs[0], y]);
            }
          }
          // Pick N dots evenly from all positions
          for (let i = 0; i < n && i < positions.length; i++) {
            const idx = positions.length > n
              ? Math.round(i * (positions.length - 1) / (n - 1))
              : i;
            const [x, y] = positions[Math.min(idx, positions.length - 1)];
            dots.push({
              xMM: x, yMM: y, radiusMM: sizeForIndex(placed),
              theta: Math.atan2(y, x), color, strokeColor: null
            });
            placed++;
          }
          // If we need more dots than positions, add extras at centroid
          const cx = (v0[0] + v1[0] + v2[0]) / 3;
          const cy = (v0[1] + v1[1] + v2[1]) / 3;
          while (placed < n) {
            dots.push({
              xMM: cx, yMM: cy, radiusMM: sizeForIndex(placed),
              theta: 0, color, strokeColor: null
            });
            placed++;
          }
        }
      }
    }

    return dots;
  }

  /** Compute all dot positions, sizes, and colors for the active pattern */
  function computeDots() {
    const n         = parseInt(elNumDots.value, 10);
    const spacingMM = parseFloat(elSpacing.value);
    const power     = parseFloat(elRadialPower.value);
    const packing   = parseFloat(elCenterPacking.value);
    const baseDotMM = parseFloat(elDotSize.value);
    const minDotMM  = parseFloat(elDotSizeMin.value);
    const color     = elDotColor.value;
    const spiralCol = elColorSpirals.checked;
    const gradMode   = elSizeGradient.value;  // 'none', 'inner-outer', 'outer-inner'
    const gradSize   = gradMode !== 'none';
    const reverseGrad = gradMode === 'outer-inner';
    const pattern   = elPatternType.value;

    const angleDeg  = parseFloat(elGoldenAngle.value);
    const angleRad  = angleDeg * (Math.PI / 180);
    const offsetRad = parseFloat(elStartAngle.value) * (Math.PI / 180);
    // Max radius uses sqrt (Fermat) regardless of power, so power only controls density
    const rMax      = spacingMM * Math.sqrt(Math.max(1, n - 1));

    const dots = [];

    const addDots = (count, extraOffset, baseColor) => {
      for (let i = 0; i < count; i++) {
        // Normalized radial position:
        // t = i/(n-1) in [0,1], then packing remaps density, power shapes the curve.
        // Max radius stays constant regardless of power or packing.
        const t = count > 1 ? i / (count - 1) : 0;
        const packed = Math.pow(t, 1 + packing);  // packing=0: linear, >0: center-heavy
        const rMM   = rMax * Math.pow(packed, power);
        const theta = i * angleRad + offsetRad + extraOffset;

        // Dot radius — interpolate between min and max based on gradient
        let dotRadMM = baseDotMM / 2;
        if (gradSize) {
          const minRad = minDotMM / 2;
          const maxRad = baseDotMM / 2;
          let g = count > 1 ? i / (count - 1) : 0;  // 0=center, 1=edge
          if (reverseGrad) g = 1 - g;  // flip: big at center, small at edge
          if (pattern === 'pinecone') {
            const scale = parseFloat(elPineconeScale.value);
            g = (1 - scale) + scale * g;
          }
          dotRadMM = minRad + (maxRad - minRad) * g;
        }

        // Color
        let dotFill = baseColor;
        let dotStroke = null;  // null = no separate outline
        if (spiralCol && pattern !== 'double-spiral') {
          const family = i % spiralFamilies;
          dotFill = SPIRAL_PALETTE[family % SPIRAL_PALETTE.length];
        }

        dots.push({
          xMM: rMM * Math.cos(theta),
          yMM: rMM * Math.sin(theta),
          radiusMM: dotRadMM,
          theta: theta,
          color: dotFill,
          strokeColor: dotStroke
        });
      }
    };

    if (pattern === 'double-spiral') {
      // Two separate dot sets overlaid, both using golden angle
      // Split total count between the two spirals
      const nA = Math.ceil(n / 2);
      const nB = n - nA;
      const color2 = elDotColor2.value;
      const bOffsetRad = parseFloat(elSpiralBOffset.value) * (Math.PI / 180);
      // Spiral A
      addDots(nA, 0, color);
      // Spiral B with angular offset
      addDots(nB, bOffsetRad, color2);

      // Always color by Fibonacci family so the fib pair buttons work
      if (spiralCol) {
        // Highlight: warm palette for Spiral A families, cool palette for Spiral B
        for (let i = 0; i < nA && i < dots.length; i++) {
          dots[i].color = WARM_PALETTE[(i % fibCW) % WARM_PALETTE.length];
        }
        for (let i = 0; i < nB && (i + nA) < dots.length; i++) {
          dots[i + nA].color = COOL_PALETTE[(i % fibCCW) % COOL_PALETTE.length];
        }
      } else {
        // Default: shade the user's chosen color per family
        const shadeColor = (hex, family, totalFamilies) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const factor = 0.4 + 0.6 * (family / Math.max(1, totalFamilies - 1));
          const nr = Math.round(Math.min(255, r * factor + (1 - factor) * 40));
          const ng = Math.round(Math.min(255, g * factor + (1 - factor) * 40));
          const nb = Math.round(Math.min(255, b * factor + (1 - factor) * 40));
          return `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`;
        };
        for (let i = 0; i < nA && i < dots.length; i++) {
          dots[i].color = shadeColor(color, i % fibCW, fibCW);
        }
        for (let i = 0; i < nB && (i + nA) < dots.length; i++) {
          dots[i + nA].color = shadeColor(color2, i % fibCCW, fibCCW);
        }
      }
    } else if (pattern.startsWith('shape-')) {
      return computeShapeDots();
    } else {
      addDots(n, 0, color);
    }

    return dots;
  }

  /** Calculate optimal spacing so pattern fills ~85% of the smaller canvas dimension */
  function calcAutoFitSpacing() {
    const n = parseInt(elNumDots.value, 10);
    const margin = parseFloat(elShapeMargin.value);
    const halfMin = Math.min(widthMM, heightMM) / 2;
    const targetRadius = (halfMin - margin) * 0.85;
    // rMax = spacing * sqrt(n-1)  →  spacing = targetRadius / sqrt(n-1)
    return targetRadius / Math.sqrt(Math.max(1, n - 1));
  }

  function autoFit() {
    const spacing = calcAutoFitSpacing();
    // Round to 1 decimal, clamp to slider range
    const clamped = Math.max(0.1, Math.min(15, Math.round(spacing * 10) / 10));
    elSpacing.value = clamped;
    updateSliderDisplays();
    draw();
  }

  function applyCanvasSize() {
    widthMM  = parseFloat(elCanvasWidth.value) || 200;
    heightMM = parseFloat(elCanvasHeight.value) || 200;
    canvas.width  = Math.round(mmToPx(widthMM));
    canvas.height = Math.round(mmToPx(heightMM));
    draw();
  }

  // ─── Drawing: Grid ────────────────────────────────────

  function drawGrid() {
    const w = canvas.width;
    const h = canvas.height;
    const minorStep = mmToPx(1);
    const majorStep = mmToPx(10);

    // Minor grid (1 mm)
    if (elShowGrid.checked) {
      ctx.strokeStyle = '#c8daf0';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += minorStep) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = 0; y <= h; y += minorStep) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();
    }

    // Major grid (10 mm)
    if (elShowMajorGrid.checked) {
      ctx.strokeStyle = '#90b0d8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += majorStep) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = 0; y <= h; y += majorStep) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();
    }

    // Center axes
    if (elShowAxes.checked) {
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeStyle = '#e05050';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Scale labels
    if (elShowLabels.checked) {
      ctx.fillStyle = '#6080a0';
      ctx.font = `${Math.max(9, mmToPx(2.2))}px 'Consolas', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let mm = 0; mm <= widthMM; mm += 10) {
        ctx.fillText(`${mm}`, mmToPx(mm), 2);
      }

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let mm = 10; mm <= heightMM; mm += 10) {
        ctx.fillText(`${mm}`, 2, mmToPx(mm));
      }
    }
  }

  // ─── Drawing: Sunflower Pattern ───────────────────────

  function drawSunflower() {
    const opacity = parseFloat(elDotOpacity.value);
    const fill    = elFillDots.checked;
    const pattern = elPatternType.value;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dots = computeDots();

    ctx.globalAlpha = opacity;

    for (const dot of dots) {
      const x = cx + mmToPx(dot.xMM);
      const y = cy + mmToPx(dot.yMM);
      const sizePx = mmToPx(dot.radiusMM);

      if (pattern === 'pinecone') {
        // Diamond oriented radially — long axis 2×, short axis 1×
        const angle = dot.theta;
        const longR  = sizePx * 2;
        const shortR = sizePx * 0.9;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(longR, 0);          // tip along radial
        ctx.lineTo(0, shortR);          // right
        ctx.lineTo(-longR, 0);          // inner tip
        ctx.lineTo(0, -shortR);         // left
        ctx.closePath();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, sizePx, 0, 2 * Math.PI);
      }

      if (fill) {
        ctx.fillStyle = dot.color;
        ctx.fill();
        if (dot.strokeColor) {
          // Dual color: fill shows CW family, outline shows CCW family
          ctx.strokeStyle = dot.strokeColor;
          ctx.lineWidth = Math.max(1, mmToPx(0.3));
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = dot.color;
        ctx.lineWidth = Math.max(0.5, mmToPx(0.15));
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1.0;
  }

  // ─── Main Draw ────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawSunflower();
    updateInfoStats();
  }

  // ─── Info Stats ───────────────────────────────────────

  function updateInfoStats() {
    const n = parseInt(elNumDots.value, 10);
    const s = parseFloat(elSpacing.value);
    const p = parseFloat(elRadialPower.value);
    const pattern = elPatternType.value;
    const rMax = (s * Math.sqrt(Math.max(1, n - 1))).toFixed(1);
    if (pattern === 'double-spiral') {
      elInfoStats.textContent = `${fibCW} CW \u00d7 ${fibCCW} CCW spirals | Radius: ${rMax} mm | Dots: ${n} \u00d7 2 = ${n * 2}`;
    } else {
      elInfoStats.textContent = `Pattern: ${pattern} | Radius: ${rMax} mm | Dots: ${n} | Power: ${p.toFixed(2)}`;
    }
  }

  // ─── Export: PNG ──────────────────────────────────────

  function exportPNG() {
    const pattern = elPatternType.value;
    const link = document.createElement('a');
    link.download = `${pattern}_${widthMM}x${heightMM}mm.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ─── Export: SVG ──────────────────────────────────────

  function exportSVG() {
    const opacity = parseFloat(elDotOpacity.value);
    const fill = elFillDots.checked;
    const dots = computeDots();

    // Circular SVG: diameter = canvas dimension (use the smaller axis)
    const svgRadius = Math.min(widthMM, heightMM) / 2;
    const svgDiam   = svgRadius * 2;
    const cx = svgRadius;
    const cy = svgRadius;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgDiam.toFixed(2)}mm" height="${svgDiam.toFixed(2)}mm" viewBox="0 0 ${svgDiam.toFixed(2)} ${svgDiam.toFixed(2)}">\n`;
    svg += `  <defs>\n`;
    svg += `    <clipPath id="circleClip">\n`;
    svg += `      <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${svgRadius.toFixed(2)}"/>\n`;
    svg += `    </clipPath>\n`;
    svg += `  </defs>\n`;
    svg += `  <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${svgRadius.toFixed(2)}" fill="white"/>\n`;
    svg += `  <g clip-path="url(#circleClip)">\n`;

    // Dots (no grid in export — grid is canvas-only for preview)
    const pattern = elPatternType.value;
    for (const dot of dots) {
      const dx = (cx + dot.xMM).toFixed(3);
      const dy = (cy + dot.yMM).toFixed(3);

      if (pattern === 'pinecone') {
        const longR  = dot.radiusMM * 2;
        const shortR = dot.radiusMM * 0.9;
        const points = [
          [longR, 0], [0, shortR], [-longR, 0], [0, -shortR]
        ].map(([px, py]) => {
          const cos = Math.cos(dot.theta);
          const sin = Math.sin(dot.theta);
          return `${(cx + dot.xMM + px * cos - py * sin).toFixed(3)},${(cy + dot.yMM + px * sin + py * cos).toFixed(3)}`;
        }).join(' ');

        if (fill) {
          svg += `    <polygon points="${points}" fill="${dot.color}" opacity="${opacity}"/>\n`;
        } else {
          svg += `    <polygon points="${points}" fill="none" stroke="${dot.color}" stroke-width="0.15" opacity="${opacity}"/>\n`;
        }
      } else {
        if (fill) {
          svg += `    <circle cx="${dx}" cy="${dy}" r="${dot.radiusMM.toFixed(3)}" fill="${dot.color}" opacity="${opacity}"/>\n`;
        } else {
          svg += `    <circle cx="${dx}" cy="${dy}" r="${dot.radiusMM.toFixed(3)}" fill="none" stroke="${dot.color}" stroke-width="0.15" opacity="${opacity}"/>\n`;
        }
      }
    }

    svg += `  </g>\n`;
    // Center crosshair (2mm arms) for CAD alignment
    const arm = 2;
    svg += `  <line x1="${(cx - arm).toFixed(2)}" y1="${cy.toFixed(2)}" x2="${(cx + arm).toFixed(2)}" y2="${cy.toFixed(2)}" stroke="#333" stroke-width="0.15"/>\n`;
    svg += `  <line x1="${cx.toFixed(2)}" y1="${(cy - arm).toFixed(2)}" x2="${cx.toFixed(2)}" y2="${(cy + arm).toFixed(2)}" stroke="#333" stroke-width="0.15"/>\n`;
    // Outer circle border
    svg += `  <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${svgRadius.toFixed(2)}" fill="none" stroke="#333" stroke-width="0.25"/>\n`;
    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    const diamLabel = (svgDiam).toFixed(0);
    link.download = `${pattern}_circle_${diamLabel}mm.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // ─── Export: DXF ──────────────────────────────────────

  function exportDXF() {
    const dots = computeDots();
    const pattern = elPatternType.value;

    // Compute circular boundary: diameter = canvas dimension (smaller axis)
    const outerR = Math.min(widthMM, heightMM) / 2;

    // DXF helper: emit a CIRCLE entity
    function dxfCircle(x, y, r, layer) {
      return `0\nCIRCLE\n8\n${layer}\n10\n${x.toFixed(4)}\n20\n${y.toFixed(4)}\n30\n0.0\n40\n${r.toFixed(4)}\n`;
    }

    // DXF helper: emit a closed LWPOLYLINE (4 vertices for diamond)
    function dxfDiamond(cx, cy, theta, longR, shortR, layer) {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const pts = [
        [longR, 0], [0, shortR], [-longR, 0], [0, -shortR]
      ].map(([px, py]) => [
        cx + px * cos - py * sin,
        cy + px * sin + py * cos
      ]);
      let s = `0\nLWPOLYLINE\n8\n${layer}\n90\n4\n70\n1\n`; // 70=1 → closed
      for (const [x, y] of pts) {
        s += `10\n${x.toFixed(4)}\n20\n${y.toFixed(4)}\n`;
      }
      return s;
    }

    // DXF helper: emit a LINE entity
    function dxfLine(x1, y1, x2, y2, layer) {
      return `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(4)}\n20\n${y1.toFixed(4)}\n30\n0.0\n11\n${x2.toFixed(4)}\n21\n${y2.toFixed(4)}\n31\n0.0\n`;
    }

    // Build DXF content
    let dxf = '';

    // HEADER section (minimal — set units to mm)
    dxf += '0\nSECTION\n2\nHEADER\n';
    dxf += '9\n$INSUNITS\n70\n4\n';       // 4 = millimeters
    dxf += '9\n$MEASUREMENT\n70\n1\n';    // 1 = metric
    dxf += '0\nENDSEC\n';

    // TABLES section (define layers)
    dxf += '0\nSECTION\n2\nTABLES\n';
    dxf += '0\nTABLE\n2\nLAYER\n70\n3\n';
    // Dots layer
    dxf += '0\nLAYER\n2\nDOTS\n70\n0\n62\n7\n6\nCONTINUOUS\n';
    // Border layer
    dxf += '0\nLAYER\n2\nBORDER\n70\n0\n62\n5\n6\nCONTINUOUS\n';
    // Center layer
    dxf += '0\nLAYER\n2\nCENTER\n70\n0\n62\n1\n6\nCENTER\n';
    dxf += '0\nENDTAB\n';
    dxf += '0\nENDSEC\n';

    // ENTITIES section
    dxf += '0\nSECTION\n2\nENTITIES\n';

    // Dots
    for (const dot of dots) {
      if (pattern === 'pinecone') {
        const longR  = dot.radiusMM * 2;
        const shortR = dot.radiusMM * 0.9;
        dxf += dxfDiamond(dot.xMM, dot.yMM, dot.theta, longR, shortR, 'DOTS');
      } else {
        dxf += dxfCircle(dot.xMM, dot.yMM, dot.radiusMM, 'DOTS');
      }
    }

    // Outer circle border
    dxf += dxfCircle(0, 0, outerR, 'BORDER');

    // Center crosshair (2mm arms)
    const arm = 2;
    dxf += dxfLine(-arm, 0, arm, 0, 'CENTER');
    dxf += dxfLine(0, -arm, 0, arm, 'CENTER');

    dxf += '0\nENDSEC\n';
    dxf += '0\nEOF\n';

    const blob = new Blob([dxf], { type: 'application/dxf' });
    const link = document.createElement('a');
    const diamLabel = (outerR * 2).toFixed(0);
    link.download = `${pattern}_circle_${diamLabel}mm.dxf`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // ─── Presets (localStorage) ─────────────────────────

  const PRESETS_KEY = 'sunflower-presets';

  function getPresets() {
    try {
      return JSON.parse(localStorage.getItem(PRESETS_KEY)) || {};
    } catch { return {}; }
  }

  function setPresets(presets) {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }

  function refreshPresetList() {
    const presets = getPresets();
    const names = Object.keys(presets).sort();
    elPresetList.innerHTML = '<option value="">— Select preset —</option>';
    for (const name of names) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      elPresetList.appendChild(opt);
    }
  }

  function savePreset(name) {
    if (!name) return;
    const config = {
      canvasWidth:   parseFloat(elCanvasWidth.value),
      canvasHeight:  parseFloat(elCanvasHeight.value),
      numDots:       parseInt(elNumDots.value, 10),
      spacing:       parseFloat(elSpacing.value),
      radialPower:   parseFloat(elRadialPower.value),
      dotSize:       parseFloat(elDotSize.value),
      dotSizeMin:    parseFloat(elDotSizeMin.value),
      dotOpacity:    parseFloat(elDotOpacity.value),
      startAngle:    parseInt(elStartAngle.value, 10),
      goldenAngle:   parseFloat(elGoldenAngle.value),
      showGrid:      elShowGrid.checked,
      showMajorGrid: elShowMajorGrid.checked,
      showAxes:      elShowAxes.checked,
      showLabels:    elShowLabels.checked,
      dotColor:      elDotColor.value,
      dotColor2:     elDotColor2.value,
      patternType:   elPatternType.value,
      pineconeScale: parseFloat(elPineconeScale.value),
      spiralBOffset: parseInt(elSpiralBOffset.value, 10),
      centerPacking: parseFloat(elCenterPacking.value),
      fillDots:      elFillDots.checked,
      colorSpirals:  elColorSpirals.checked,
      sizeGradient:  elSizeGradient.value,
      edgeMargin:    parseFloat(elShapeMargin.value),
      shapeFillMode: elShapeFillMode.value,
      holeSizeMode:  elHoleSizeMode.value,
      shapeSize:     parseInt(elShapeSize.value, 10),
      spiralFamilies: spiralFamilies,
      fibCW:         fibCW,
      fibCCW:        fibCCW
    };
    const presets = getPresets();
    presets[name] = config;
    setPresets(presets);
    refreshPresetList();
    elPresetList.value = name;
  }

  function loadPreset(name) {
    if (!name) return;
    const presets = getPresets();
    const c = presets[name];
    if (!c) return;

    elCanvasWidth.value  = c.canvasWidth;
    elCanvasHeight.value = c.canvasHeight;
    elNumDots.value      = c.numDots;
    elSpacing.value      = c.spacing;
    elRadialPower.value  = c.radialPower;
    elDotSize.value      = c.dotSize;
    elDotSizeMin.value   = c.dotSizeMin ?? DEFAULTS.dotSizeMin;
    elDotOpacity.value   = c.dotOpacity;
    elStartAngle.value   = c.startAngle;
    elGoldenAngle.value  = c.goldenAngle;
    elShowGrid.checked   = c.showGrid;
    elShowMajorGrid.checked = c.showMajorGrid;
    elShowAxes.checked   = c.showAxes;
    elShowLabels.checked = c.showLabels;
    elDotColor.value     = c.dotColor;
    elDotColor2.value    = c.dotColor2;
    elPatternType.value  = c.patternType;
    elPineconeScale.value = c.pineconeScale;
    elSpiralBOffset.value = c.spiralBOffset;
    elCenterPacking.value = c.centerPacking;
    elFillDots.checked   = c.fillDots;
    elColorSpirals.checked = c.colorSpirals;
    elSizeGradient.value = c.sizeGradient ?? DEFAULTS.sizeGradient;
    elShapeMargin.value   = c.edgeMargin ?? c.shapeMargin ?? DEFAULTS.edgeMargin;
    elShapeFillMode.value = c.shapeFillMode ?? DEFAULTS.shapeFillMode;
    elHoleSizeMode.value  = c.holeSizeMode ?? (c.shapeFibSizes === false ? 'uniform' : DEFAULTS.holeSizeMode);
    elShapeSize.value     = c.shapeSize ?? DEFAULTS.shapeSize;
    spiralFamilies = c.spiralFamilies ?? 21;
    fibCW  = c.fibCW ?? 21;
    fibCCW = c.fibCCW ?? 34;

    // Update UI visibility for the loaded pattern type
    updateControlVisibility(c.patternType, c.colorSpirals);

    // Highlight active spiral/fib buttons
    document.querySelectorAll('.spiral-preset').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.val, 10) === spiralFamilies);
    });
    document.querySelectorAll('.fib-pair').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.cw, 10) === fibCW);
    });

    updateSliderDisplays();
    applyCanvasSize();
    draw();
  }

  function deletePreset(name) {
    if (!name) return;
    const presets = getPresets();
    delete presets[name];
    setPresets(presets);
    refreshPresetList();
  }

  // ─── Slider Value Display Updater ─────────────────────

  function updateSliderDisplays() {
    elNumDotsValue.value = elNumDots.value;
    elSpacingValue.value = parseFloat(elSpacing.value).toFixed(1);
    elDotSizeValue.value = parseFloat(elDotSize.value).toFixed(1);
    elRadialPowerValue.value = parseFloat(elRadialPower.value).toFixed(2);
    elDotOpacityValue.value = parseFloat(elDotOpacity.value).toFixed(2);
    elStartAngleValue.value = elStartAngle.value;
    elGoldenAngleValue.value = parseFloat(elGoldenAngle.value).toFixed(3);
    elPineconeScaleValue.value = parseFloat(elPineconeScale.value).toFixed(2);
    elSpiralBOffsetValue.value = elSpiralBOffset.value;
    elCenterPackingValue.value = parseFloat(elCenterPacking.value).toFixed(1);
    elDotSizeMinValue.value = parseFloat(elDotSizeMin.value).toFixed(1);
    elShapeMarginValue.value = parseFloat(elShapeMargin.value).toFixed(1);
    elShapeSizeValue.value = elShapeSize.value;
  }

  // ─── Event Wiring ────────────────────────────────────

  // Sliders drive live redraws
  [elNumDots, elSpacing, elDotSize, elDotSizeMin, elRadialPower, elDotOpacity, elStartAngle, elPineconeScale, elSpiralBOffset, elCenterPacking, elShapeMargin, elShapeSize].forEach(slider => {
    slider.addEventListener('input', () => {
      updateSliderDisplays();
      draw();
    });
  });

  // Display toggles
  [elShowGrid, elShowMajorGrid, elShowAxes, elShowLabels, elFillDots].forEach(cb => {
    cb.addEventListener('change', draw);
  });
  elSizeGradient.addEventListener('change', draw);
  elShapeFillMode.addEventListener('change', draw);
  elHoleSizeMode.addEventListener('change', () => {
    const isShape = elPatternType.value.startsWith('shape-');
    if (isShape) {
      elDotSizeMinRow.style.display = elHoleSizeMode.value === 'fibonacci' ? 'block' : 'none';
    }
    draw();
  });

  // Number input fields sync back to sliders
  const sliderInputPairs = [
    [elNumDots, elNumDotsValue],
    [elSpacing, elSpacingValue],
    [elDotSize, elDotSizeValue],
    [elRadialPower, elRadialPowerValue],
    [elDotOpacity, elDotOpacityValue],
    [elStartAngle, elStartAngleValue],
    [elPineconeScale, elPineconeScaleValue],
    [elSpiralBOffset, elSpiralBOffsetValue],
    [elCenterPacking, elCenterPackingValue],
    [elDotSizeMin, elDotSizeMinValue],
    [elShapeMargin, elShapeMarginValue],
    [elShapeSize, elShapeSizeValue]
  ];
  sliderInputPairs.forEach(([slider, numInput]) => {
    numInput.addEventListener('input', () => {
      slider.value = numInput.value;
      draw();
    });
  });
  // Golden angle number input (no snap when typing directly)
  elGoldenAngleValue.addEventListener('input', () => {
    elGoldenAngle.value = elGoldenAngleValue.value;
    draw();
  });

  // Pattern type selector — toggle control visibility
  function updateControlVisibility(pattern, colorSpirals) {
    const isDouble = pattern === 'double-spiral';
    const isShape  = pattern.startsWith('shape-');
    const isSpiral = !isShape; // sunflower, pinecone, double-spiral

    // Spiral-only controls
    elSpacingRow.style.display       = isSpiral ? 'block' : 'none';
    elRadialPowerRow.style.display   = isSpiral ? 'block' : 'none';
    elCenterPackingRow.style.display = isSpiral ? 'block' : 'none';
    elGoldenAngleRow.style.display   = isSpiral ? 'block' : 'none';
    elStartAngleRow.style.display    = isSpiral ? 'block' : 'none';
    elSizeGradientRow.style.display  = isSpiral ? 'block' : 'none';
    elDotOpacityRow.style.display    = 'block'; // always visible
    elDotSizeRow.style.display       = 'block'; // always visible

    // Dot min size: spirals always show it; shapes only when fibonacci mode
    if (isShape) {
      elDotSizeMinRow.style.display = elHoleSizeMode.value === 'fibonacci' ? 'block' : 'none';
    } else {
      elDotSizeMinRow.style.display = 'block';
    }

    // Double-spiral specific
    document.querySelector('label[for="dotColor"]').textContent = isDouble ? 'Spiral A Color' : 'Dot Color';
    elDotColor2Row.style.display       = isDouble ? 'flex' : 'none';
    elSpiralBOffsetRow.style.display   = isDouble ? 'block' : 'none';
    elFibPairRow.style.display         = isDouble ? 'block' : 'none';

    // Pinecone specific
    elPineconeScaleRow.style.display   = pattern === 'pinecone' ? 'block' : 'none';

    // Shape-specific controls
    elShapeSizeRow.style.display       = isShape ? 'block' : 'none';
    elShapeFillModeRow.style.display   = isShape ? 'block' : 'none';
    elHoleSizeModeRow.style.display    = isShape ? 'block' : 'none';

    // Color spirals & family presets — only for non-double spiral modes
    elColorSpiralsRow.style.display    = (isSpiral && !isDouble) ? 'flex' : 'none';
    if (isDouble || isShape) {
      elSpiralCountRow.style.display = 'none';
    } else {
      elSpiralCountRow.style.display = colorSpirals ? 'block' : 'none';
    }
  }

  elPatternType.addEventListener('change', () => {
    updateControlVisibility(elPatternType.value, elColorSpirals.checked);
    draw();
  });

  elDotColor2.addEventListener('input', draw);

  // Fibonacci pair preset buttons (double spiral)
  document.querySelectorAll('.fib-pair').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fib-pair').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fibCW = parseInt(btn.dataset.cw, 10);
      fibCCW = parseInt(btn.dataset.ccw, 10);
      draw();
    });
  });

  elColorSpirals.addEventListener('change', () => {
    updateControlVisibility(elPatternType.value, elColorSpirals.checked);
    draw();
  });

  // Spiral family preset buttons
  document.querySelectorAll('.spiral-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.spiral-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      spiralFamilies = parseInt(btn.dataset.val, 10);
      draw();
    });
  });

  elDotColor.addEventListener('input', draw);
  elApplySize.addEventListener('click', applyCanvasSize);
  elAutoFit.addEventListener('click', autoFit);
  elExportPNG.addEventListener('click', exportPNG);
  elExportSVG.addEventListener('click', exportSVG);
  elExportDXF.addEventListener('click', exportDXF);

  // Preset buttons
  elPresetSave.addEventListener('click', () => {
    const name = elPresetName.value.trim();
    if (!name) { elPresetName.focus(); return; }
    savePreset(name);
    elPresetName.value = '';
  });
  elPresetLoad.addEventListener('click', () => loadPreset(elPresetList.value));
  elPresetDelete.addEventListener('click', () => {
    const name = elPresetList.value;
    if (name && confirm(`Delete preset "${name}"?`)) deletePreset(name);
  });

  // Snap golden angle slider near the true golden angle
  elGoldenAngle.addEventListener('input', () => {
    const val = parseFloat(elGoldenAngle.value);
    if (Math.abs(val - GOLDEN_ANGLE_DEG) < GOLDEN_SNAP_THRESHOLD) {
      elGoldenAngle.value = GOLDEN_ANGLE_DEG;
    }
    updateSliderDisplays();
    draw();
  });

  // Snap button
  elSnapGoldenAngle.addEventListener('click', () => {
    elGoldenAngle.value = GOLDEN_ANGLE_DEG;
    updateSliderDisplays();
    draw();
  });

  // Reset all defaults
  elResetDefaults.addEventListener('click', () => {
    elCanvasWidth.value  = DEFAULTS.canvasWidth;
    elCanvasHeight.value = DEFAULTS.canvasHeight;
    elNumDots.value      = DEFAULTS.numDots;
    elSpacing.value      = DEFAULTS.spacing;
    elRadialPower.value  = DEFAULTS.radialPower;
    elDotSize.value      = DEFAULTS.dotSize;
    elDotOpacity.value   = DEFAULTS.dotOpacity;
    elStartAngle.value   = DEFAULTS.startAngle;
    elGoldenAngle.value  = DEFAULTS.goldenAngle;
    elShowGrid.checked   = DEFAULTS.showGrid;
    elShowMajorGrid.checked = DEFAULTS.showMajorGrid;
    elShowAxes.checked   = DEFAULTS.showAxes;
    elShowLabels.checked = DEFAULTS.showLabels;
    elDotColor.value     = DEFAULTS.dotColor;
    elDotColor2.value    = DEFAULTS.dotColor2;
    elPatternType.value  = DEFAULTS.patternType;
    elPineconeScale.value = DEFAULTS.pineconeScale;
    elSpiralBOffset.value  = DEFAULTS.spiralBOffset;
    elCenterPacking.value  = DEFAULTS.centerPacking;
    elFillDots.checked   = DEFAULTS.fillDots;
    elColorSpirals.checked = DEFAULTS.colorSpirals;
    elDotSizeMin.value      = DEFAULTS.dotSizeMin;
    elSizeGradient.value   = DEFAULTS.sizeGradient;
    elShapeMargin.value    = DEFAULTS.edgeMargin;
    elShapeFillMode.value  = DEFAULTS.shapeFillMode;
    elHoleSizeMode.value   = DEFAULTS.holeSizeMode;
    elShapeSize.value      = DEFAULTS.shapeSize;
    // Reset visibility — defaults to sunflower, spirals not highlighted
    document.querySelector('label[for=\"dotColor\"]').textContent = 'Dot Color';
    updateControlVisibility(DEFAULTS.patternType, DEFAULTS.colorSpirals);
    elSpiralCountRow.style.display   = 'none';
    elDotColor2Row.style.display     = 'none';
    elSpiralBOffsetRow.style.display = 'none';
    elFibPairRow.style.display       = 'none';
    elPineconeScaleRow.style.display = 'none';
    spiralFamilies = 21;
    fibCW = 21;
    fibCCW = 34;
    document.querySelectorAll('.spiral-preset').forEach(b => b.classList.remove('active'));
    document.querySelector('.spiral-preset[data-val="21"]').classList.add('active');
    document.querySelectorAll('.fib-pair').forEach(b => b.classList.remove('active'));
    document.querySelector('.fib-pair[data-cw="21"]').classList.add('active');
    updateSliderDisplays();
    applyCanvasSize();
    autoFit();
  });

  // Allow Enter key to apply canvas size
  [elCanvasWidth, elCanvasHeight].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyCanvasSize();
    });
  });

  // ─── Initialise ──────────────────────────────────────

  refreshPresetList();
  updateControlVisibility(elPatternType.value, elColorSpirals.checked);
  applyCanvasSize();
  // Auto-fit on first load so pattern fills the canvas
  autoFit();

})();
