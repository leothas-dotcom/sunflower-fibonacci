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
  const elRadialPower  = document.getElementById('radialPower');
  const elRadialPowerValue = document.getElementById('radialPowerValue');
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
  const elGradientSize = document.getElementById('gradientSize');
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
  const elInfoStats    = document.getElementById('infoStats');

  // ─── Defaults ─────────────────────────────────────────
  const DEFAULTS = {
    canvasWidth: 200,
    canvasHeight: 200,
    numDots: 1500,
    spacing: 2.2,
    radialPower: 0.5,
    dotSize: 1.0,
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
    spiralBOffset: 0,
    fillDots: true,
    colorSpirals: false,
    gradientSize: false
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

  /** Compute all dot positions, sizes, and colors for the active pattern */
  function computeDots() {
    const n         = parseInt(elNumDots.value, 10);
    const spacingMM = parseFloat(elSpacing.value);
    const power     = parseFloat(elRadialPower.value);
    const baseDotMM = parseFloat(elDotSize.value);
    const color     = elDotColor.value;
    const spiralCol = elColorSpirals.checked;
    const gradSize  = elGradientSize.checked;
    const pattern   = elPatternType.value;

    const angleDeg  = parseFloat(elGoldenAngle.value);
    const angleRad  = angleDeg * (Math.PI / 180);
    const offsetRad = parseFloat(elStartAngle.value) * (Math.PI / 180);
    const rMax      = spacingMM * Math.pow(Math.max(1, n - 1), power);

    const dots = [];

    const addDots = (count, extraOffset, baseColor, reverseAngle) => {
      const sign = reverseAngle ? -1 : 1;
      // For double spiral, color by the appropriate Fibonacci family count
      const armCount = (pattern === 'double-spiral')
        ? (reverseAngle ? fibCCW : fibCW)
        : spiralFamilies;
      for (let i = 0; i < count; i++) {
        const rMM   = spacingMM * Math.pow(i, power);
        const theta = i * angleRad * sign + offsetRad + extraOffset;

        // Dot radius
        let dotRadMM = baseDotMM / 2;
        if (pattern === 'pinecone' && gradSize) {
          // Pinecone + gradient: smallest at center, largest at edge
          const t = count > 1 ? i / (count - 1) : 0;
          const scale = parseFloat(elPineconeScale.value);
          dotRadMM *= (1 - scale) + scale * t;
        } else if (gradSize && rMax > 0) {
          const t = rMM / rMax;
          dotRadMM *= (0.3 + 0.7 * t);
        }

        // Color
        let dotColor = baseColor;
        if (spiralCol) {
          const family = i % armCount;
          dotColor = SPIRAL_PALETTE[family % SPIRAL_PALETTE.length];
        }

        dots.push({
          xMM: rMM * Math.cos(theta),
          yMM: rMM * Math.sin(theta),
          radiusMM: dotRadMM,
          theta: theta,
          color: dotColor
        });
      }
    };

    if (pattern === 'double-spiral') {
      // Two separate spirals: CW (positive angle) and CCW (negative angle)
      const color2 = elDotColor2.value;
      const bOffsetRad = parseFloat(elSpiralBOffset.value) * (Math.PI / 180);
      // Spiral A: fibCW arms, clockwise
      addDots(n, 0, color, false);
      // Spiral B: fibCCW arms, counter-clockwise, with independent offset
      addDots(n, bOffsetRad, color2, true);
    } else {
      addDots(n, 0, color, false);
    }

    return dots;
  }

  /** Calculate optimal spacing so pattern fills ~85% of the smaller canvas dimension */
  function calcAutoFitSpacing() {
    const n = parseInt(elNumDots.value, 10);
    const power = parseFloat(elRadialPower.value);
    const halfMin = Math.min(widthMM, heightMM) / 2;
    const targetRadius = halfMin * 0.85;
    // r_max = spacing * (n-1)^power  →  spacing = targetRadius / (n-1)^power
    return targetRadius / Math.pow(Math.max(1, n - 1), power);
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
    const rMax = (s * Math.pow(Math.max(1, n - 1), p)).toFixed(1);
    if (pattern === 'double-spiral') {
      elInfoStats.textContent = `${fibCW} CW \u00d7 ${fibCCW} CCW spirals | Radius: ${rMax} mm | Dots: ${n * 2}`;
    } else {
      elInfoStats.textContent = `Pattern: ${pattern} | Radius: ${rMax} mm | Dots: ${n} | r = ${s} \u00d7 n^${p.toFixed(2)}`;
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
    const cxMM = widthMM / 2;
    const cyMM = heightMM / 2;
    const dots = computeDots();

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${widthMM}mm" height="${heightMM}mm" viewBox="0 0 ${widthMM} ${heightMM}">\n`;
    svg += `  <rect width="${widthMM}" height="${heightMM}" fill="white"/>\n`;

    // Grid lines
    if (elShowGrid.checked) {
      svg += `  <g stroke="#c8daf0" stroke-width="0.1">\n`;
      for (let x = 0; x <= widthMM; x += 1) {
        svg += `    <line x1="${x}" y1="0" x2="${x}" y2="${heightMM}"/>\n`;
      }
      for (let y = 0; y <= heightMM; y += 1) {
        svg += `    <line x1="0" y1="${y}" x2="${widthMM}" y2="${y}"/>\n`;
      }
      svg += `  </g>\n`;
    }
    if (elShowMajorGrid.checked) {
      svg += `  <g stroke="#90b0d8" stroke-width="0.25">\n`;
      for (let x = 0; x <= widthMM; x += 10) {
        svg += `    <line x1="${x}" y1="0" x2="${x}" y2="${heightMM}"/>\n`;
      }
      for (let y = 0; y <= heightMM; y += 10) {
        svg += `    <line x1="0" y1="${y}" x2="${widthMM}" y2="${y}"/>\n`;
      }
      svg += `  </g>\n`;
    }

    // Dots
    const pattern = elPatternType.value;
    for (const dot of dots) {
      const cx = (cxMM + dot.xMM).toFixed(3);
      const cy = (cyMM + dot.yMM).toFixed(3);

      if (pattern === 'pinecone') {
        // Diamond shape oriented along radial direction
        const longR  = dot.radiusMM * 2;
        const shortR = dot.radiusMM * 0.9;
        const angleDegSVG = (dot.theta * 180 / Math.PI).toFixed(2);
        // Diamond points relative to center, then rotated
        const points = [
          [longR, 0], [0, shortR], [-longR, 0], [0, -shortR]
        ].map(([px, py]) => {
          const cos = Math.cos(dot.theta);
          const sin = Math.sin(dot.theta);
          return `${(cxMM + dot.xMM + px * cos - py * sin).toFixed(3)},${(cyMM + dot.yMM + px * sin + py * cos).toFixed(3)}`;
        }).join(' ');

        if (fill) {
          svg += `    <polygon points="${points}" fill="${dot.color}" opacity="${opacity}"/>\n`;
        } else {
          svg += `    <polygon points="${points}" fill="none" stroke="${dot.color}" stroke-width="0.15" opacity="${opacity}"/>\n`;
        }
      } else {
        if (fill) {
          svg += `    <circle cx="${cx}" cy="${cy}" r="${dot.radiusMM.toFixed(3)}" fill="${dot.color}" opacity="${opacity}"/>\n`;
        } else {
          svg += `    <circle cx="${cx}" cy="${cy}" r="${dot.radiusMM.toFixed(3)}" fill="none" stroke="${dot.color}" stroke-width="0.15" opacity="${opacity}"/>\n`;
        }
      }
    }

    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${pattern}_${widthMM}x${heightMM}mm.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // ─── Slider Value Display Updater ─────────────────────

  function updateSliderDisplays() {
    elNumDotsValue.textContent = elNumDots.value;
    elSpacingValue.textContent = parseFloat(elSpacing.value).toFixed(1);
    elDotSizeValue.textContent = parseFloat(elDotSize.value).toFixed(1);
    elRadialPowerValue.textContent = parseFloat(elRadialPower.value).toFixed(2);
    elDotOpacityValue.textContent = parseFloat(elDotOpacity.value).toFixed(2);
    elStartAngleValue.textContent = elStartAngle.value;
    elGoldenAngleValue.textContent = parseFloat(elGoldenAngle.value).toFixed(3);
    elPineconeScaleValue.textContent = parseFloat(elPineconeScale.value).toFixed(2);
    elSpiralBOffsetValue.textContent = elSpiralBOffset.value;
  }

  // ─── Event Wiring ────────────────────────────────────

  // Sliders drive live redraws
  [elNumDots, elSpacing, elDotSize, elRadialPower, elDotOpacity, elStartAngle, elPineconeScale, elSpiralBOffset].forEach(slider => {
    slider.addEventListener('input', () => {
      updateSliderDisplays();
      draw();
    });
  });

  // Display toggles
  [elShowGrid, elShowMajorGrid, elShowAxes, elShowLabels, elFillDots, elGradientSize].forEach(cb => {
    cb.addEventListener('change', draw);
  });

  // Pattern type selector
  elPatternType.addEventListener('change', () => {
    const pattern = elPatternType.value;
    const isDouble = pattern === 'double-spiral';
    elDotColor2Row.style.display = isDouble ? 'flex' : 'none';
    elSpiralBOffsetRow.style.display = isDouble ? 'block' : 'none';
    elFibPairRow.style.display = isDouble ? 'block' : 'none';
    elPineconeScaleRow.style.display = pattern === 'pinecone' ? 'block' : 'none';
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

  // Spiral highlighting toggle
  elColorSpirals.addEventListener('change', () => {
    elSpiralCountRow.style.display = elColorSpirals.checked ? 'block' : 'none';
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
    elFillDots.checked   = DEFAULTS.fillDots;
    elColorSpirals.checked = DEFAULTS.colorSpirals;
    elGradientSize.checked = DEFAULTS.gradientSize;
    elSpiralCountRow.style.display = 'none';
    elDotColor2Row.style.display   = 'none';
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

  applyCanvasSize();
  // Auto-fit on first load so pattern fills the canvas
  autoFit();

})();
