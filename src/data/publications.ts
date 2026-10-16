// Publications about SHOT and the methods it implements. Details checked against Crossref and
// Optimization Online. Add new items to the right group; the page sorts each group by year.

export interface Publication {
  id: string;
  authors: string[];
  title: string;
  venue: string;
  details?: string; // volume, issue, pages
  year: number;
  doi?: string;
  url?: string;
  openAccess?: boolean;
  note?: string;
  bibtex?: string;
}

export interface PublicationGroup {
  id: string;
  label: string;
  title: string;
  intro?: string;
  items: Publication[];
}

export const mainPaper: Publication = {
  id: 'lundell2022shot',
  authors: ['A. Lundell', 'J. Kronqvist', 'T. Westerlund'],
  title: 'The supporting hyperplane optimization toolkit for convex MINLP',
  venue: 'Journal of Global Optimization',
  details: '84(1), 1–41',
  year: 2022,
  doi: '10.1007/s10898-022-01128-0',
  openAccess: true,
  bibtex: `@article{Lundell2022SHOT,
  author  = {Lundell, Andreas and Kronqvist, Jan and Westerlund, Tapio},
  title   = {The supporting hyperplane optimization toolkit for convex {MINLP}},
  journal = {Journal of Global Optimization},
  volume  = {84},
  number  = {1},
  pages   = {1--41},
  year    = {2022},
  doi     = {10.1007/s10898-022-01128-0}
}`,
};

export const nonconvexPaper: Publication = {
  id: 'lundell2022nonconvex',
  authors: ['A. Lundell', 'J. Kronqvist'],
  title: 'Polyhedral approximation strategies for nonconvex mixed-integer nonlinear programming in SHOT',
  venue: 'Journal of Global Optimization',
  details: '82(4), 863–896',
  year: 2022,
  doi: '10.1007/s10898-021-01006-1',
  openAccess: true,
  bibtex: `@article{Lundell2022Nonconvex,
  author  = {Lundell, Andreas and Kronqvist, Jan},
  title   = {Polyhedral approximation strategies for nonconvex mixed-integer
             nonlinear programming in {SHOT}},
  journal = {Journal of Global Optimization},
  volume  = {82},
  number  = {4},
  pages   = {863--896},
  year    = {2022},
  doi     = {10.1007/s10898-021-01006-1}
}`,
};

export const groups: PublicationGroup[] = [
  {
    id: 'cite',
    label: 'Cite SHOT',
    title: 'The SHOT papers',
    intro: 'Please cite these papers if you use SHOT in your research. The first describes the solver; the second describes its features for nonconvex problems.',
    items: [mainPaper, nonconvexPaper],
  },
  {
    id: 'methods',
    label: 'Methods',
    title: 'Algorithms and reformulations',
    items: [
      {
        id: 'kronqvist2016esh',
        authors: ['J. Kronqvist', 'A. Lundell', 'T. Westerlund'],
        title: 'The extended supporting hyperplane algorithm for convex mixed-integer nonlinear programming',
        venue: 'Journal of Global Optimization',
        details: '64(2), 249–272',
        year: 2016,
        doi: '10.1007/s10898-015-0322-3',
      },
      {
        id: 'lundell2019nonconvex',
        authors: ['A. Lundell', 'J. Kronqvist'],
        title: 'On solving nonconvex MINLP problems with SHOT',
        venue: 'Optimization of Complex Systems: Theory, Models, Algorithms and Applications (WCGO 2019), Advances in Intelligent Systems and Computing',
        details: '991, 448–457',
        year: 2019,
        doi: '10.1007/978-3-030-21803-4_45',
      },
      {
        id: 'lundell2016gow',
        authors: ['A. Lundell', 'J. Kronqvist', 'T. Westerlund'],
        title: 'Improvements to the supporting hyperplane optimization toolkit solver for convex MINLP',
        venue: 'Proceedings of the XIII Global Optimization Workshop (GOW’16)',
        year: 2016,
        url: 'http://apolo.dps.uminho.pt/gow16/Proceedings_GOW16.pdf#page=112',
      },
    ],
  },
  {
    id: 'preprints',
    label: 'Preprints',
    title: 'Recent preprints',
    intro: 'Work that is part of, or builds on, SHOT 2.0.',
    items: [
      {
        id: 'blomqvist2026quadratic',
        authors: ['J. Blomqvist', 'E. Tamm', 'J. Kronqvist', 'A. Lundell'],
        title: 'Decomposition-based reformulation of nonseparable quadratic expressions in convex MINLP',
        venue: 'Optimization Online',
        year: 2026,
        url: 'https://optimization-online.org/?p=34367',
      },
      {
        id: 'eggen2026separating',
        authors: ['C. Eggen', 'J. Kronqvist', 'A. Lundell', 'S. Volkwein'],
        title: 'Separating hyperplanes for mixed-integer polynomial optimization problems',
        venue: 'Optimization Online',
        year: 2026,
        url: 'https://optimization-online.org/?p=33712',
      },
    ],
  },
  {
    id: 'benchmarks',
    label: 'Benchmarks',
    title: 'Solver comparisons',
    intro: 'SHOT has been compared with other MINLP solvers on the convex and nonconvex instances in MINLPLib. The benchmark files and results are linked below.',
    items: [
      {
        id: 'kronqvist2019review',
        authors: ['J. Kronqvist', 'D. E. Bernal', 'A. Lundell', 'I. E. Grossmann'],
        title: 'A review and comparison of solvers for convex MINLP',
        venue: 'Optimization and Engineering',
        details: '20(2), 397–455',
        year: 2019,
        doi: '10.1007/s11081-018-9411-8',
        openAccess: true,
      },
    ],
  },
];

export const benchmarkFiles = 'https://andreaslundell.github.io/minlpbenchmarks/';

export function pubHref(p: Publication): string | undefined {
  return p.doi ? `https://doi.org/${p.doi}` : p.url;
}
