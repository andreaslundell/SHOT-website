---
title: SHOT 2.0 release candidate
date: 2026-10-16
type: release
version: 2.0.0rc0
summary: The first release candidate of SHOT 2.0 is on PyPI. Install it with pip install SHOTpy and try the new Python interface, HiGHS support and extended callbacks.
link: https://pypi.org/project/SHOTpy/
---

The first release candidate of SHOT 2.0 is available on [PyPI](https://pypi.org/project/SHOTpy/) as SHOTpy 2.0.0rc0:

```bash
pip install SHOTpy
```

The wheels are for Python 3.11 and later on Linux (x86-64) and macOS (Apple silicon, macOS 14 and later), and include the open-source subsolvers Cbc, Ipopt and HiGHS. On other platforms, pip builds SHOT from source; see the [compilation instructions](/getting-started/#source). Windows is no longer supported directly; use the Windows Subsystem for Linux.

Most of SHOT 2.0 has been available in the main branch on GitHub for some time. Please try the release candidate and [report any problems](https://github.com/coin-or/SHOT/issues) before the final release.

## New in SHOT 2.0

- **SHOTpy, a Python interface.** Control SHOT directly from Python without Pyomo or GAMSPy: read problems from `.nl`, `.gms` and OSiL files, or build them with the API. See the [SHOTpy tutorial](https://github.com/coin-or/SHOT/blob/master/docs/SHOTpy_Tutorial.ipynb).
- **HiGHS as MIP subsolver.** HiGHS is supported in the dual strategy with the multi-tree strategy. Convex MIQP, MIQCQP and MINLP problems are solved to global optimality with HiGHS, as with the other MIP subsolvers.
- **Extended callbacks.** In C++ and Python, callbacks can now reject primal candidates, inject primal solutions, add hyperplanes to the outer approximation, supply dual bounds and provide interior points for the ESH root search. They make warm starts, custom primal heuristics and lazy nonlinear constraints possible. See the [callback documentation](https://github.com/coin-or/SHOT/blob/master/docs/Callbacks.md).
- **Decomposition of nonseparable convex quadratic expressions.** A lifting reformulation based on eigenvalue and LDLᵀ decompositions; see the [preprint](https://optimization-online.org/?p=34367).
- **Better handling of nonconvex problems.** A convex bounding strategy improves the dual bound, and infeasible dual subproblems are repaired more reliably.
- **Parallel primal heuristics.** Primal heuristics, such as the integer-fixed NLP problems, can run in parallel.
- **Uno as an optional NLP solver**, alongside Ipopt and GAMS, and solver option prioritization.

## HiGHS on convex MINLP

<figure class="shot-figure">
  <div class="shot-figure__frame"><img src="/images/figures/benchmark-highs.png" alt="Solution profiles on 377 convex MINLP instances from MINLPLib: the number of instances solved to an objective gap of at most 0.1 % against solution time, for SHOT with Gurobi, Cbc, Cbc with one thread and HiGHS, and for SCIP." width="2000" height="943" loading="lazy" /></div>
  <figcaption class="small muted">Convex MINLP: the 377 convex instances in MINLPLib. Solved means objective gap ≤ 0.1 %.</figcaption>
</figure>

## After 2.0

The roadmap after version 2.0 includes a JuMP interface, SCIP as a MIP (MILP and MIQCQP) subsolver, presolve, and more reformulation strategies for nonconvex quadratic, signomial and other terms.
