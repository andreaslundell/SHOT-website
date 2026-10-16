---
title: Preprint on decomposing nonseparable quadratic expressions
date: 2026-04-11
type: paper
summary: A new preprint describes the eigenvalue and LDLᵀ decomposition-based reformulations of convex quadratic expressions in SHOT 2.0.
link: https://optimization-online.org/?p=34367
---

A new preprint on Optimization Online describes how SHOT 2.0 reformulates convex MINLP problems with nonseparable quadratic terms. For each convex non-diagonal matrix that defines quadratic expressions, an eigenvalue or LDLᵀ decomposition transforms the expressions into convex, additively separable constraints, a form that suits polyhedral outer approximation.

The computational experiments on MINLPLib instances and generated test problems show better performance on problems with dense quadratic structure when SHOT uses MIP subsolvers without quadratic support, such as Cbc and HiGHS.

Blomqvist, J., Tamm, E., Kronqvist, J. and Lundell, A. *Decomposition-based reformulation of nonseparable quadratic expressions in convex MINLP*. Optimization Online (2026). [optimization-online.org/?p=34367](https://optimization-online.org/?p=34367)
