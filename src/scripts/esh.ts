// A two-variable version of the extended supporting hyperplane (ESH) method as used in SHOT's
// dual strategy, with its primal heuristics. Used by the interactive figure on the home page.
//
//   minimize    c1 x1 + c2 x2
//   subject to  g1(x) <= 0, g2(x) <= 0   (convex)
//               0 <= x1, x2 <= 10,  x1 integer
//
// Each iteration solves the MILP over the polyhedral outer approximation (POA), runs the primal
// heuristics (checking the MILP solution and solving the integer-fixed NLP), and then adds a
// supporting hyperplane at the point where the line from the interior point to the MILP
// solution crosses the boundary of the feasible set.

export type Vec = [number, number];
export interface Cut { a: Vec; b: number; iteration: number } // a·x <= b
export interface Constraint { g: (x: Vec) => number; grad: (x: Vec) => Vec }

export const LB = 0;
export const UB = 10;
export const EPS_ABS = 1e-4;
export const EPS_REL = 1e-4;
export const MAX_ITER = 40;

// The feasible set: a rotated ellipse intersected with the epigraph of a parabola.
const cx = 5.0, cy = 5.4, ax = 4.3, ay = 2.6, th = (28 * Math.PI) / 180;
const ct = Math.cos(th), st = Math.sin(th);
export const constraints: Constraint[] = [
  {
    g: ([x, y]) => {
      const u = ct * (x - cx) + st * (y - cy), v = -st * (x - cx) + ct * (y - cy);
      return (u / ax) ** 2 + (v / ay) ** 2 - 1;
    },
    grad: ([x, y]) => {
      const u = ct * (x - cx) + st * (y - cy), v = -st * (x - cx) + ct * (y - cy);
      const du = (2 * u) / ax ** 2, dv = (2 * v) / ay ** 2;
      return [du * ct - dv * st, du * st + dv * ct];
    },
  },
  {
    g: ([x, y]) => 0.14 * (x - 4.2) ** 2 + 2.1 - y,
    grad: ([x]) => [0.28 * (x - 4.2), -1],
  },
];

export const G = (x: Vec) => Math.max(...constraints.map((c) => c.g(x)));
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const lerp = (a: Vec, b: Vec, t: number): Vec => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];

// Interior point: minimize max_i g_i(x) (SHOT solves a minimax LP sequence; a pattern search suffices here).
export function interiorPoint(): Vec {
  let best: Vec = [5, 5], fb = G(best);
  for (let x = LB; x <= UB; x += 0.25)
    for (let y = LB; y <= UB; y += 0.25) {
      const f = G([x, y]);
      if (f < fb) { fb = f; best = [x, y]; }
    }
  for (let h = 0.25; h > 1e-6; h /= 2) {
    let moved = true;
    while (moved) {
      moved = false;
      for (const d of [[h, 0], [-h, 0], [0, h], [0, -h], [h, h], [-h, -h], [h, -h], [-h, h]] as Vec[]) {
        const p: Vec = [best[0] + d[0], best[1] + d[1]], f = G(p);
        if (f < fb) { fb = f; best = p; moved = true; }
      }
    }
  }
  return best;
}

// Root search on the segment [inner, outer] for the boundary G = 0.
export function rootSearch(inner: Vec, outer: Vec): Vec {
  let lo = 0, hi = 1;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (G(lerp(inner, outer, m)) > 0) hi = m;
    else lo = m;
  }
  return lerp(inner, outer, hi);
}

// The POA polygon: the box clipped by every cut (Sutherland–Hodgman).
export function poaPolygon(cuts: Cut[]): Vec[] {
  let poly: Vec[] = [[LB, LB], [UB, LB], [UB, UB], [LB, UB]];
  for (const { a, b } of cuts) {
    const out: Vec[] = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const fp = dot(a, p) - b, fq = dot(a, q) - b;
      if (fp <= 0) out.push(p);
      if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) out.push(lerp(p, q, fp / (fp - fq)));
    }
    poly = out;
    if (!poly.length) break;
  }
  return poly;
}

// The points of a convex polygon on the vertical line x1 = k, as an interval [lo, hi] in x2.
export function column(poly: Vec[], k: number): [number, number] | null {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    if (Math.abs(p[0] - k) < 1e-12) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }
    if ((p[0] - k) * (q[0] - k) < 0) {
      const y = p[1] + ((k - p[0]) / (q[0] - p[0])) * (q[1] - p[1]);
      lo = Math.min(lo, y); hi = Math.max(hi, y);
    }
  }
  return lo <= hi ? [lo, hi] : null;
}

export interface MipResult { x: Vec; obj: number; pool: Vec[] }

// The MILP over the POA with x1 integer: the best end of every integer column.
export function solveMip(c: Vec, cuts: Cut[]): MipResult | null {
  const poly = poaPolygon(cuts);
  const pool: { x: Vec; f: number }[] = [];
  for (let k = LB; k <= UB; k++) {
    const iv = column(poly, k);
    if (!iv) continue;
    const y = c[1] > 0 ? iv[0] : c[1] < 0 ? iv[1] : iv[0];
    pool.push({ x: [k, y], f: dot(c, [k, y]) });
  }
  if (!pool.length) return null;
  pool.sort((p, q) => p.f - q.f);
  return { x: pool[0].x, obj: pool[0].f, pool: pool.slice(0, 5).map((p) => p.x) };
}

// Integer-fixed NLP: with x1 = k fixed, minimize c2 x2 subject to G(k, x2) <= 0.
export function fixedNlp(c: Vec, k: number): Vec | null {
  // G(k, ·) is convex: find its minimizer by golden-section search, then the ends of {G <= 0}.
  let a = LB, b = UB;
  const r = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 80; i++) {
    const m1 = b - r * (b - a), m2 = a + r * (b - a);
    if (G([k, m1]) < G([k, m2])) b = m2;
    else a = m1;
  }
  const ym = (a + b) / 2;
  if (G([k, ym]) > 0) return null;
  const end = (target: number) => {
    if (G([k, target]) <= 0) return target;
    return rootSearch([k, ym], [k, target])[1] - Math.sign(target - ym) * 1e-9;
  };
  const y = c[1] > 0 ? end(LB) : c[1] < 0 ? end(UB) : ym;
  return [k, y];
}

export interface Iteration {
  n: number;
  mip: Vec;
  pool: Vec[];
  dual: number;
  primal: number;
  primalPoint: Vec | null;
  primalSource: string | null; // which heuristic improved the primal bound in this iteration
  boundary: Vec | null;
  cut: Cut | null;
  absGap: number;
  relGap: number;
  done: boolean;
  reason: string | null;
}

export class Esh {
  readonly c: Vec;
  readonly interior: Vec;
  cuts: Cut[] = [];
  history: Iteration[] = [];
  primal = Infinity;
  primalPoint: Vec | null = null;
  done = false;

  constructor(c: Vec, interior = interiorPoint()) {
    this.c = c;
    this.interior = interior;
  }

  step(): Iteration | null {
    if (this.done) return null;
    const n = this.history.length + 1;
    const mip = solveMip(this.c, this.cuts);
    if (!mip) {
      this.done = true;
      return null;
    }
    let source: string | null = null;
    const tryPrimal = (x: Vec | null, name: string) => {
      if (!x || G(x) > 1e-7) return;
      const f = dot(this.c, x);
      if (f < this.primal - 1e-12) {
        this.primal = f;
        this.primalPoint = x;
        source = name;
      }
    };
    for (const x of mip.pool) tryPrimal(x, 'MIP solution pool');
    tryPrimal(fixedNlp(this.c, mip.x[0]), 'integer-fixed NLP');

    const dual = Math.min(mip.obj, this.primal);
    const absGap = this.primal - dual;
    const relGap = absGap / (1e-10 + Math.abs(this.primal));
    let done = false, reason: string | null = null;
    if (absGap <= EPS_ABS) { done = true; reason = 'absolute objective gap'; }
    else if (relGap <= EPS_REL) { done = true; reason = 'relative objective gap'; }
    else if (n >= MAX_ITER) { done = true; reason = 'iteration limit'; }

    let boundary: Vec | null = null, cut: Cut | null = null;
    if (!done && G(mip.x) > 0) {
      boundary = rootSearch(this.interior, mip.x);
      // A supporting hyperplane for every constraint active at the boundary point.
      for (const con of constraints) {
        const gv = con.g(boundary);
        if (gv < -1e-6) continue;
        const a = con.grad(boundary);
        const cc: Cut = { a, b: dot(a, boundary) - gv, iteration: n };
        this.cuts.push(cc);
        cut ??= cc;
      }
    }
    this.done = done;
    const it: Iteration = {
      n, mip: mip.x, pool: mip.pool, dual, primal: this.primal, primalPoint: this.primalPoint,
      primalSource: source, boundary, cut, absGap, relGap, done, reason,
    };
    this.history.push(it);
    return it;
  }
}
