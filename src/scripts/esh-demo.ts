// Interactive ESH figure: draws the state of src/scripts/esh.ts as SVG and steps it on request.
import { Esh, G, LB, UB, poaPolygon, column, interiorPoint, MAX_ITER, type Vec, type Iteration, type Cut } from './esh';

const NS = 'http://www.w3.org/2000/svg';
const SIZE = 600, PAD = 30, SCALE = (SIZE - 2 * PAD) / (UB - LB);
const px = (x: number) => PAD + (x - LB) * SCALE;
const py = (y: number) => SIZE - PAD - (y - LB) * SCALE;
const pts = (poly: Vec[]) => poly.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(' ');

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  parent?.appendChild(e);
  return e;
}

// The feasible set's boundary, traced by root searches along rays from the interior point.
function boundary(ip: Vec): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < 360; i++) {
    const t = (i / 360) * 2 * Math.PI, d: Vec = [Math.cos(t), Math.sin(t)];
    let lo = 0, hi = 20;
    for (let k = 0; k < 50; k++) {
      const m = (lo + hi) / 2;
      if (G([ip[0] + m * d[0], ip[1] + m * d[1]]) > 0) hi = m;
      else lo = m;
    }
    out.push([ip[0] + lo * d[0], ip[1] + lo * d[1]]);
  }
  return out;
}

// A line a·x = b clipped to the box.
function lineInBox({ a, b }: Cut): [Vec, Vec] | null {
  const P: Vec[] = [];
  const add = (p: Vec) => {
    if (p[0] >= LB - 1e-9 && p[0] <= UB + 1e-9 && p[1] >= LB - 1e-9 && p[1] <= UB + 1e-9) P.push(p);
  };
  if (Math.abs(a[1]) > 1e-12) { add([LB, (b - a[0] * LB) / a[1]]); add([UB, (b - a[0] * UB) / a[1]]); }
  if (Math.abs(a[0]) > 1e-12) { add([(b - a[1] * LB) / a[0], LB]); add([(b - a[1] * UB) / a[0], UB]); }
  if (P.length < 2) return null;
  let best: [Vec, Vec] = [P[0], P[1]], dmax = -1;
  for (const p of P) for (const q of P) {
    const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    if (d > dmax) { dmax = d; best = [p, q]; }
  }
  return best;
}

const fmt = (v: number) => (Number.isFinite(v) ? v.toFixed(4).replace('-', '−') : '∞');
const fmtGap = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(3)} %` : '–');
const coef = (v: number, name: string, first: boolean) => {
  const s = v < 0 ? '−' : first ? '' : '+';
  return `${first ? s : ` ${s} `}${Math.abs(v).toFixed(2)}${name}`;
};

export function mountEshDemo(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>('[data-esh-svg]')!;
  const caption = root.querySelector<HTMLElement>('[data-esh-caption]')!;
  const log = root.querySelector<HTMLElement>('[data-esh-log]')!;
  const objective = root.querySelector<HTMLElement>('[data-esh-objective]')!;
  const out = (k: string) => root.querySelector<HTMLElement>(`[data-esh-${k}]`)!;
  const btnStep = root.querySelector<HTMLButtonElement>('[data-esh-step]')!;
  const btnPlay = root.querySelector<HTMLButtonElement>('[data-esh-play]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-esh-reset]')!;
  const btnNew = root.querySelector<HTMLButtonElement>('[data-esh-new]')!;

  const ip = interiorPoint();
  const setOutline = boundary(ip);
  let angle = (160 * Math.PI) / 180;
  let esh: Esh;
  let timer: number | undefined;

  const makeC = (): Vec => [Math.round(Math.cos(angle) * 100) / 100, Math.round(Math.sin(angle) * 100) / 100];

  function draw(last: Iteration | null) {
    svg.replaceChildren();
    const c = esh.c;
    // Ground = region cut away; the current approximation is drawn on top in the surface colour.
    el('rect', { x: px(LB), y: py(UB), width: SCALE * (UB - LB), height: SCALE * (UB - LB), class: 'esh-ground' }, svg);
    const poly = poaPolygon(esh.cuts);
    if (poly.length) el('polygon', { points: pts(poly), class: 'esh-poa' }, svg);

    // Objective contours, darker towards the minimum.
    const contours = el('g', { class: 'esh-contours' }, svg);
    const corners: Vec[] = [[LB, LB], [UB, LB], [UB, UB], [LB, UB]];
    const vals = corners.map((p) => c[0] * p[0] + c[1] * p[1]);
    const fmin = Math.min(...vals), fmax = Math.max(...vals), n = 11;
    for (let i = 1; i < n; i++) {
      const level = fmax - ((fmax - fmin) * i) / n;
      const seg = lineInBox({ a: c, b: level, iteration: 0 });
      if (seg) el('line', { x1: px(seg[0][0]), y1: py(seg[0][1]), x2: px(seg[1][0]), y2: py(seg[1][1]), 'stroke-opacity': (0.18 + (0.55 * i) / n).toFixed(2) }, contours);
    }

    // Feasible set.
    el('polygon', { points: pts(setOutline), class: 'esh-set' }, svg);

    // Integer columns x1 = k inside the approximation: the feasible region of the MILP.
    const cols = el('g', { class: 'esh-cols' }, svg);
    for (let k = LB; k <= UB; k++) {
      el('line', { x1: px(k), y1: py(LB), x2: px(k), y2: py(UB), class: 'esh-col' }, cols);
      const iv = poly.length ? column(poly, k) : null;
      if (iv) el('line', { x1: px(k), y1: py(iv[0]), x2: px(k), y2: py(iv[1]), class: 'esh-col-in' }, cols);
    }

    // Hyperplanes: earlier ones muted, the newest in red.
    const planes = el('g', {}, svg);
    for (const cut of esh.cuts) {
      const seg = lineInBox(cut);
      if (!seg) continue;
      const isNew = last?.cut && cut.iteration === last.n;
      el('line', { x1: px(seg[0][0]), y1: py(seg[0][1]), x2: px(seg[1][0]), y2: py(seg[1][1]), class: isNew ? 'esh-cut esh-cut--new' : 'esh-cut' }, planes);
    }

    // Box outline.
    el('rect', { x: px(LB), y: py(UB), width: SCALE * (UB - LB), height: SCALE * (UB - LB), class: 'esh-box' }, svg);

    // Descent arrow for the objective, in the corner it points to.
    const len = Math.hypot(c[0], c[1]) || 1, d: Vec = [-c[0] / len, -c[1] / len];
    const a0: Vec = [5 + d[0] * 3.6, 5 + d[1] * 3.6], a1: Vec = [5 + d[0] * 4.6, 5 + d[1] * 4.6];
    const ag = el('g', { class: 'esh-arrow' }, svg);
    el('line', { x1: px(a0[0]), y1: py(a0[1]), x2: px(a1[0]), y2: py(a1[1]) }, ag);
    const ang = Math.atan2(-(a1[1] - a0[1]), a1[0] - a0[0]);
    const head = (s: number) => `${(px(a1[0]) - 10 * Math.cos(ang + s)).toFixed(1)},${(py(a1[1]) - 10 * Math.sin(ang + s)).toFixed(1)}`;
    el('polyline', { points: `${head(0.45)} ${px(a1[0]).toFixed(1)},${py(a1[1]).toFixed(1)} ${head(-0.45)}` }, ag);

    // Root search segment, points.
    if (last?.boundary) el('line', { x1: px(ip[0]), y1: py(ip[1]), x2: px(last.mip[0]), y2: py(last.mip[1]), class: 'esh-search' }, svg);
    el('circle', { cx: px(ip[0]), cy: py(ip[1]), r: 6, class: 'esh-interior' }, svg);
    if (esh.primalPoint) el('circle', { cx: px(esh.primalPoint[0]), cy: py(esh.primalPoint[1]), r: 11, class: 'esh-primal' }, svg);
    if (last) el('circle', { cx: px(last.mip[0]), cy: py(last.mip[1]), r: 6.5, class: 'esh-mip' }, svg);
    if (last?.boundary) el('circle', { cx: px(last.boundary[0]), cy: py(last.boundary[1]), r: 6, class: 'esh-boundary' }, svg);
  }

  function describe(it: Iteration | null): string {
    if (!it) return 'The feasible set (shaded) and the variable bounds. SHOT first finds an interior point (filled dot); the outer approximation starts as the box of variable bounds.';
    if (it.done) {
      const why = it.reason === 'iteration limit' ? `the iteration limit of ${MAX_ITER} was reached` : `the ${it.reason} is within tolerance`;
      return `Iteration ${it.n}: the dual and primal bounds meet; SHOT terminates because ${why}. As the problem is convex, the primal solution (ring) is globally optimal.`;
    }
    let s = `Iteration ${it.n}: the MILP over the outer approximation gives a solution (open dot) with dual bound ${fmt(it.dual)}.`;
    if (it.primalSource) s += ` The ${it.primalSource} gives a new primal solution (ring).`;
    if (it.boundary) s += ' A root search towards the interior point finds a boundary point (red), where a supporting hyperplane is added.';
    return s;
  }

  function logLine(it: Iteration) {
    const type = 'MILP-O'.padEnd(9);
    const cuts = it.cut ? `+1 = ${esh.cuts.filter((c) => c.iteration <= it.n).length}` : '';
    const line = `${String(it.n).padStart(3)}: ${type} ${cuts.padEnd(9)} ${fmt(it.dual).padStart(9)} ${fmt(it.primal).padStart(9)} ${fmtGap(it.relGap).padStart(10)}`;
    const div = document.createElement('div');
    div.textContent = line;
    if (it.primalSource === 'MIP solution pool') div.className = 'is-new';
    log.appendChild(div);
    if (it.primalSource === 'integer-fixed NLP') {
      const nlp = document.createElement('div');
      nlp.textContent = `     NLPSOLPT-O ${''.padEnd(9)} ${''.padStart(9)} ${fmt(it.primal).padStart(9)}`;
      nlp.className = 'is-new';
      log.appendChild(nlp);
    }
    if (it.done) {
      const end = document.createElement('div');
      end.textContent = `Terminated: ${it.reason}`;
      end.className = 'is-end';
      log.appendChild(end);
    }
    log.scrollTop = log.scrollHeight;
  }

  function update(it: Iteration | null) {
    draw(it);
    caption.textContent = describe(it);
    out('iter').textContent = String(esh.history.length);
    out('dual').textContent = it ? fmt(it.dual) : '−∞';
    out('primal').textContent = fmt(esh.primal);
    out('gap').textContent = it ? fmtGap(it.relGap) : '–';
    btnStep.disabled = esh.done;
    btnPlay.disabled = esh.done;
    if (esh.done) stop();
  }

  function reset() {
    stop();
    esh = new Esh(makeC(), ip);
    const [c1, c2] = esh.c;
    objective.textContent = `${coef(c1, 'x₁', true)}${coef(c2, 'x₂', false)}`;
    log.replaceChildren();
    const head = document.createElement('div');
    head.className = 'is-head';
    head.textContent = '  It  Type      Cuts          Dual    Primal   Rel. gap';
    log.appendChild(head);
    const ipl = document.createElement('div');
    ipl.textContent = `Interior point (${ip[0].toFixed(2)}, ${ip[1].toFixed(2)})`;
    log.appendChild(ipl);
    update(null);
  }

  function step() {
    const it = esh.step();
    if (it) logLine(it);
    update(it ?? esh.history.at(-1) ?? null);
  }

  function stop() {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    btnPlay.setAttribute('aria-pressed', 'false');
    btnPlay.querySelector('[data-play-label]')!.textContent = 'Play';
    root.querySelector('[data-icon-play]')?.removeAttribute('hidden');
    root.querySelector('[data-icon-pause]')?.setAttribute('hidden', '');
  }

  function play() {
    if (timer !== undefined) return stop();
    btnPlay.setAttribute('aria-pressed', 'true');
    btnPlay.querySelector('[data-play-label]')!.textContent = 'Pause';
    root.querySelector('[data-icon-play]')?.setAttribute('hidden', '');
    root.querySelector('[data-icon-pause]')?.removeAttribute('hidden');
    step();
    timer = window.setInterval(step, 1100);
  }

  btnStep.addEventListener('click', () => { stop(); step(); });
  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
  btnNew.addEventListener('click', () => {
    // A new descent direction at least 40° away from the current one.
    angle = (angle + ((40 + Math.random() * 280) * Math.PI) / 180) % (2 * Math.PI);
    reset();
  });

  reset();
  root.dataset.ready = 'true';
}
