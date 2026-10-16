// Full-page background: contour lines of a nonconvex function (a sum of Gaussian bumps). The bumps
// drift slowly and one follows the mouse, warping the level sets around the cursor. Drawn with
// marching squares at low opacity, in the brand colours of the current theme. With reduced motion,
// a single still frame is drawn.

export function mountBackground(cv: HTMLCanvasElement) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CELL = 26; // grid resolution in px
  let W = 0, H = 0, cols = 0, rows = 0;
  let field = new Float32Array(0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
    field = new Float32Array(cols * rows);
  }

  // Bumps: centre as fractions of the viewport, amplitude, width relative to the viewport height,
  // and the amplitude, speed and phase of their drift. Mixed amplitudes make the level sets nonconvex.
  const bumps = [
    { x: 0.16, y: 0.22, a: 1.0, s: 0.34, dx: 0.05, dy: 0.04, wx: 0.00023, wy: 0.00031, px: 0.0, py: 1.3 },
    { x: 0.78, y: 0.16, a: 0.85, s: 0.3, dx: 0.06, dy: 0.05, wx: 0.00019, wy: 0.00027, px: 2.1, py: 0.4 },
    { x: 0.55, y: 0.72, a: 0.95, s: 0.36, dx: 0.05, dy: 0.06, wx: 0.00026, wy: 0.00021, px: 4.0, py: 2.6 },
    { x: 0.1, y: 0.85, a: 0.75, s: 0.28, dx: 0.06, dy: 0.04, wx: 0.00021, wy: 0.00029, px: 1.0, py: 5.1 },
    { x: 0.92, y: 0.62, a: 0.8, s: 0.3, dx: 0.04, dy: 0.06, wx: 0.00028, wy: 0.00018, px: 3.2, py: 0.9 },
    { x: 0.42, y: 0.05, a: -0.55, s: 0.26, dx: 0.05, dy: 0.05, wx: 0.00024, wy: 0.00025, px: 5.0, py: 3.7 },
  ];

  // The mouse bump eases towards the cursor, so the contours trail it.
  const mouse = { x: 0.5, y: 0.35, tx: 0.5, ty: 0.35, active: false };
  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.tx = e.clientX / W;
      mouse.ty = e.clientY / H;
      mouse.active = true;
    },
    { passive: true },
  );

  // Level colours: ink for the outer levels, SHOT red for the inner ones, read from the theme tokens.
  let levels: { v: number; color: string }[] = [];
  function readColors() {
    const css = getComputedStyle(document.documentElement);
    const rgb = (name: string, fallback: string) => {
      const hex = (css.getPropertyValue(name).trim() || fallback).replace('#', '');
      const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
      return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    };
    const dark = (css.getPropertyValue('--surface').trim() || '#F4F2ED').toUpperCase() === '#18181B';
    const ink = rgb('--ink', '#18181B');
    const red = rgb(dark ? '--shot-red-light' : '--shot-red', '#E21F25');
    // Overall strength of the lines; thin light lines on the dark ground need a little more opacity.
    const k = (dark ? 1.3 : 1) * 0.6;
    levels = [
      { v: 0.32, color: `rgba(${ink}, ${0.1 * k})` },
      { v: 0.48, color: `rgba(${ink}, ${0.085 * k})` },
      { v: 0.64, color: `rgba(${red}, ${0.1 * k})` },
      { v: 0.8, color: `rgba(${red}, ${0.13 * k})` },
      { v: 0.96, color: `rgba(${red}, ${0.16 * k})` },
    ];
  }

  function computeField(t: number) {
    const centers = bumps.map((b) => ({
      x: (b.x + b.dx * Math.sin(t * b.wx + b.px)) * W,
      y: (b.y + b.dy * Math.sin(t * b.wy + b.py)) * H,
      a: b.a,
      inv: 1 / (2 * (b.s * H) ** 2),
    }));
    if (mouse.active) centers.push({ x: mouse.x * W, y: mouse.y * H, a: 0.9, inv: 1 / (2 * (0.17 * H) ** 2) });
    for (let j = 0; j < rows; j++) {
      const y = j * CELL;
      for (let i = 0; i < cols; i++) {
        const x = i * CELL;
        let v = 0;
        for (const c of centers) {
          const ddx = x - c.x, ddy = y - c.y;
          v += c.a * Math.exp(-(ddx * ddx + ddy * ddy) * c.inv);
        }
        field[j * cols + i] = v;
      }
    }
  }

  // Marching squares: edges 0 = top, 1 = right, 2 = bottom, 3 = left; corner bits 8 = TL, 4 = TR, 2 = BR, 1 = BL.
  const SEGS: ([number, number][] | null)[] = [
    null, [[3, 2]], [[2, 1]], [[3, 1]],
    [[0, 1]], [[0, 1], [3, 2]], [[0, 2]], [[3, 0]],
    [[3, 0]], [[0, 2]], [[3, 0], [2, 1]], [[0, 1]],
    [[3, 1]], [[2, 1]], [[3, 2]], null,
  ];

  function edgePoint(edge: number, i: number, j: number, tl: number, tr: number, br: number, bl: number, lvl: number): [number, number] {
    const x = i * CELL, y = j * CELL;
    switch (edge) {
      case 0: return [x + ((lvl - tl) / (tr - tl)) * CELL, y];
      case 1: return [x + CELL, y + ((lvl - tr) / (br - tr)) * CELL];
      case 2: return [x + ((lvl - bl) / (br - bl)) * CELL, y + CELL];
      default: return [x, y + ((lvl - tl) / (bl - tl)) * CELL];
    }
  }

  function render(t: number) {
    computeField(t);
    ctx!.clearRect(0, 0, W, H);
    ctx!.lineWidth = 1.1;
    for (const level of levels) {
      const lvl = level.v;
      ctx!.strokeStyle = level.color;
      ctx!.beginPath();
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const tl = field[j * cols + i], tr = field[j * cols + i + 1];
          const br = field[(j + 1) * cols + i + 1], bl = field[(j + 1) * cols + i];
          const segs = SEGS[(tl > lvl ? 8 : 0) | (tr > lvl ? 4 : 0) | (br > lvl ? 2 : 0) | (bl > lvl ? 1 : 0)];
          if (!segs) continue;
          for (const [e0, e1] of segs) {
            const p = edgePoint(e0, i, j, tl, tr, br, bl, lvl), q = edgePoint(e1, i, j, tl, tr, br, bl, lvl);
            ctx!.moveTo(p[0], p[1]);
            ctx!.lineTo(q[0], q[1]);
          }
        }
      }
      ctx!.stroke();
    }
  }

  resize();
  readColors();

  // Redraw in the new colours when the theme changes.
  const recolor = () => {
    readColors();
    if (reduceMotion) render(0);
  };
  new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolor);
  window.addEventListener('resize', () => {
    resize();
    if (reduceMotion) render(0);
  });

  if (reduceMotion) {
    render(0);
    return;
  }

  // About 30 frames per second is smooth enough for slow contours, at half the cost.
  let last = 0;
  function loop(now: number) {
    requestAnimationFrame(loop);
    if (now - last < 32) return;
    last = now;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    render(now);
  }
  requestAnimationFrame(loop);
}
