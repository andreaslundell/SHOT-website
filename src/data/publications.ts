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

export interface Thesis {
  id: string;
  author: string;
  title: string;
  year: number;
  url: string;
  contribution: string;
}

// Master's theses at Åbo Akademi University (Doria repository).
export const theses: Thesis[] = [
  {
    id: 'ekman2025python',
    author: 'Johan Ekman',
    title: 'Developing a Python interface utilizing pybind11 for SHOT',
    year: 2025,
    url: 'https://www.doria.fi/handle/10024/192709',
    contribution: 'The initial Python interface',
  },
  {
    id: 'blomqvist2025nonconvex',
    author: 'Joakim Blomqvist',
    title: 'Enhancements for nonconvex MINLP in SHOT',
    year: 2025,
    url: 'https://www.doria.fi/handle/10024/192538',
    contribution: 'Nonconvex MINLP',
  },
  {
    id: 'gronblom2024release',
    author: 'Maxemilian Grönblom',
    title: 'Automated release management and testing for SHOT',
    year: 2024,
    url: 'https://www.doria.fi/handle/10024/189669',
    contribution: 'Release management and testing with GitHub',
  },
  {
    id: 'westersund2024benchmark',
    author: 'Filip Westersund',
    title: 'Implementation of a distributed benchmarking system for optimization solvers',
    year: 2024,
    url: 'https://www.doria.fi/handle/10024/188957',
    contribution: 'The benchmark system',
  },
  {
    id: 'hartull2023viva',
    author: 'Oscar Härtull',
    title: 'Implementation of an application for analyzing and visualizing benchmark results for optimization solvers',
    year: 2023,
    url: 'https://www.doria.fi/handle/10024/188333',
    contribution: 'VIVA, for analyzing and visualizing benchmark results',
  },
];

export interface PublicationGroup {
  id: string;
  label: string;
  title: string;
  intro?: string;
  items: Publication[];
}

const scholar = (id: string) =>
  `https://scholar.google.com/citations?view_op=view_citation&hl=en&user=UB3JBrkAAAAJ&citation_for_view=UB3JBrkAAAAJ:${id}`;

const AL = 'A. Lundell', JK = 'J. Kronqvist', TW = 'T. Westerlund';
const CACE = 'Computer Aided Chemical Engineering';
const CET = 'Chemical Engineering Transactions';

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
    title: 'SHOT and its algorithms',
    items: [
      { id: 'kronqvist2016esh', authors: [JK, AL, TW], title: 'The extended supporting hyperplane algorithm for convex mixed-integer nonlinear programming', venue: 'Journal of Global Optimization', details: '64(2), 249–272', year: 2016, doi: '10.1007/s10898-015-0322-3' },
      { id: 'kronqvist2018separability', authors: [JK, AL, TW], title: 'Reformulations for utilizing separability when solving convex MINLP problems', venue: 'Journal of Global Optimization', details: '71(3), 571–592', year: 2018, doi: '10.1007/s10898-018-0616-3' },
      { id: 'kronqvist2019centercut', authors: [JK, 'D. E. Bernal', AL, TW], title: 'A center-cut algorithm for quickly obtaining feasible solutions and solving convex MINLP problems', venue: 'Computers & Chemical Engineering', details: '122, 105–113', year: 2019, doi: '10.1016/j.compchemeng.2018.06.019' },
      { id: 'lundell2019callbacks', authors: [AL, JK], title: 'Integration of polyhedral outer approximation algorithms with MIP solvers through callbacks and lazy constraints', venue: 'AIP Conference Proceedings', details: '2070, 020012', year: 2019, doi: '10.1063/1.5089979' },
      { id: 'lundell2019nonconvex', authors: [AL, JK], title: 'On solving nonconvex MINLP problems with SHOT', venue: 'Optimization of Complex Systems: Theory, Models, Algorithms and Applications (WCGO 2019), Advances in Intelligent Systems and Computing', details: '991, 448–457', year: 2019, doi: '10.1007/978-3-030-21803-4_45' },
      { id: 'kronqvist2019tool', authors: [JK, AL], title: 'Convex MINLP – an efficient tool for design and optimization tasks?', venue: CACE, details: '47, 245–250', year: 2019, doi: '10.1016/b978-0-12-818597-1.50039-4' },
      { id: 'lundell2017mathematica', authors: [AL, JK, TW], title: 'SHOT – a global solver for convex MINLP in Wolfram Mathematica', venue: CACE, details: '40, 2137–2142', year: 2017, doi: '10.1016/b978-0-444-63965-3.50358-5' },
      { id: 'kronqvist2017centercut', authors: [JK, AL, TW], title: 'A center-cut algorithm for solving convex mixed-integer nonlinear programming problems', venue: CACE, details: '40, 2131–2136', year: 2017, doi: '10.1016/b978-0-444-63965-3.50357-3' },
    ],
  },
  {
    id: 'workshops',
    label: 'Workshops',
    title: 'Workshop papers',
    intro: 'Short papers from the Global Optimization Workshop series (GOW, HUGO and STOGO).',
    items: [
      { id: 'lundell2025upcoming', authors: [AL, 'A. Olama', 'J. Blomqvist', 'J. Ekman', JK], title: 'Upcoming features in SHOT 2.0', venue: 'Stockholm Global Optimization Workshop (STOGO 2025)', details: '129–132', year: 2025, url: scholar('tKAzc9rXhukC') },
      { id: 'blomqvist2025bounding', authors: ['J. Blomqvist', AL], title: 'Improved bounding techniques for nonconvex MINLP in SHOT', venue: 'Stockholm Global Optimization Workshop (STOGO 2025)', details: '133–136', year: 2025, url: scholar('ZfRJV9d4-WMC') },
      { id: 'olama2025parallel', authors: ['A. Olama', AL], title: 'A parallel framework for primal heuristics in SHOT', venue: 'Stockholm Global Optimization Workshop (STOGO 2025)', details: '137–140', year: 2025, url: scholar('_Re3VWB3Y0AC') },
      { id: 'eggen2025separating', authors: ['C. Eggen', JK, AL, 'S. Volkwein'], title: 'Separating hyperplanes for mixed-integer polynomial optimization problems', venue: 'Stockholm Global Optimization Workshop (STOGO 2025)', details: '199–202', year: 2025, url: scholar('fEOibwPWpKIC') },
      { id: 'kronqvist2022eigen', authors: [JK, AL], title: 'Eigendecomposition-based reformulations for convex MINLP in the SHOT solver', venue: 'Hungarian Global Optimization Workshop (HUGO 2022)', details: '107–110', year: 2022, url: scholar('uLbwQdceFCQC') },
      { id: 'lundell2022signomials', authors: [AL, JK], title: 'On solving MINLP problems with nonconvex signomials in SHOT', venue: 'Hungarian Global Optimization Workshop (HUGO 2022)', details: '129–132', year: 2022, url: scholar('JQOojiI6XY0C') },
      { id: 'lundell2016gow', authors: [AL, JK, TW], title: 'Improvements to the supporting hyperplane optimization toolkit solver for convex MINLP', venue: 'XIII Global Optimization Workshop (GOW’16)', details: '101–104', year: 2016 },
      { id: 'kronqvist2016lifted', authors: [JK, AL, TW], title: 'Lifted polyhedral approximations in convex mixed integer nonlinear programming', venue: 'XIII Global Optimization Workshop (GOW’16)', details: '117–120', year: 2016, url: scholar('wbdj-CoPYUoC') },
      { id: 'lundell2014esh', authors: [AL, JK, TW], title: 'An extended supporting hyperplane algorithm for convex MINLP problems', venue: 'XII Global Optimization Workshop (GOW’14)', details: '21–24', year: 2014, url: scholar('hqOjcs7Dif8C') },
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
    id: 'global',
    label: 'Global optimization',
    title: 'Reformulations and global optimization',
    intro: 'Earlier research by the team on global optimization of nonconvex MINLP problems, in particular signomial transformations and reformulations, which also underlies SHOT’s reformulation engine.',
    items: [
      { id: 'lundell2018signomial', authors: [AL, TW], title: 'Solving global optimization problems using reformulations and signomial transformations', venue: 'Computers & Chemical Engineering', details: '116, 122–134', year: 2018, doi: '10.1016/j.compchemeng.2017.10.035' },
      { id: 'lundell2016portfolio', authors: [AL, 'K.-M. Björk'], title: 'Global optimisation of a portfolio adjustment problem under credibility measures', venue: 'International Journal of Operational Research', details: '25(4), 464–474', year: 2016, doi: '10.1504/ijor.2016.075292' },
      { id: 'lundell2015bilinear', authors: [AL, TW], title: 'Representation of the convex envelope of bilinear terms in a reformulation framework for global optimization', venue: CACE, details: '37, 833–838', year: 2015, doi: '10.1016/b978-0-444-63578-5.50134-1' },
      { id: 'lundell2013framework', authors: [AL, 'A. Skjäl', TW], title: 'A reformulation framework for global optimization', venue: 'Journal of Global Optimization', details: '57(1), 115–141', year: 2013, doi: '10.1007/s10898-012-9877-4' },
      { id: 'lundell2013refinement', authors: [AL, TW], title: 'Refinement strategies for piecewise linear functions utilized by reformulation-based techniques for global optimization', venue: CACE, details: '32, 529–534', year: 2013, doi: '10.1016/b978-0-444-63234-0.50089-0' },
      { id: 'lundell2013ago', authors: [AL, TW], title: 'The reformulation-based αGO algorithm for solving nonconvex MINLP problems – some improvements', venue: CET, details: '32, 1321–1326', year: 2013, url: scholar('roLk4NBRz8UC') },
      { id: 'nyberg2013qap', authors: ['A. Nyberg', TW, AL], title: 'Improved discrete reformulations for the quadratic assignment problem', venue: 'Lecture Notes in Computer Science', details: '7874, 193–203', year: 2013, url: scholar('WF5omc3nYNoC') },
      { id: 'lundell2012transformations', authors: [AL, TW], title: 'Finding an optimized set of transformations for convexifying nonconvex MINLP problems', venue: CACE, details: '31, 1497–1501', year: 2012, doi: '10.1016/b978-0-444-59506-5.50130-9' },
      { id: 'lundell2011ima', authors: [AL, TW], title: 'Global optimization of mixed-integer signomial programming problems', venue: 'Mixed Integer Nonlinear Programming, The IMA Volumes in Mathematics and its Applications', details: '154, 349–369', year: 2011, doi: '10.1007/978-1-4614-1927-3_12' },
      { id: 'westerlund2011notes', authors: [TW, AL, 'J. Westerlund'], title: 'Some notes on convex relaxations', venue: 'AIDIC Conference Series', details: '10, 383–392', year: 2011, url: scholar('ufrVoPGSRksC') },
      { id: 'skjal2011c2', authors: ['A. Skjäl', AL, TW], title: 'Global optimization with C2 constraints by convex reformulations', venue: CET, details: '24, 373–378', year: 2011, url: scholar('Tyk-4Ss8FVUC') },
      { id: 'westerlund2011relaxations', authors: [TW, AL, 'J. Westerlund'], title: 'On convex relaxations in nonconvex optimization', venue: CET, details: '24, 331–336', year: 2011, url: scholar('IjCSPb-OGe4C') },
      { id: 'westerlund2010signomial', authors: [TW, AL], title: 'Global optimization of signomial programming problems', venue: 'Workshop on Mixed Integer Nonlinear Programming', year: 2010, url: scholar('UeHWp8X0CEIC') },
      { id: 'lundell2009underestimation', authors: [AL, TW], title: 'Convex underestimation strategies for signomial functions', venue: 'Optimization Methods & Software', details: '24(4–5), 505–522', year: 2009, doi: '10.1080/10556780802702278' },
      { id: 'lundell2009techniques', authors: [AL, 'J. Westerlund', TW], title: 'Some transformation techniques with applications in global optimization', venue: 'Journal of Global Optimization', details: '43(2–3), 391–405', year: 2009, doi: '10.1007/s10898-007-9223-4' },
      { id: 'lundell2009implementation', authors: [AL, TW], title: 'Implementation of a convexification technique for signomial functions', venue: CACE, details: '26, 579–583', year: 2009, doi: '10.1016/s1570-7946(09)70097-5' },
      { id: 'lundell2009optimization', authors: [AL, TW], title: 'Optimization of transformations for convex relaxations of MINLP problems containing signomial functions', venue: CACE, details: '27, 231–236', year: 2009, doi: '10.1016/s1570-7946(09)70259-7' },
      { id: 'lundell2009relationship', authors: [AL, TW], title: 'On the relationship between power and exponential transformations for positive signomial functions', venue: CET, details: '17, 1287–1292', year: 2009, url: scholar('2osOgNQ5qMEC') },
      { id: 'lundell2009aidic', authors: [AL, TW], title: 'On the relationship between some transformations for positive signomial terms', venue: 'AIDIC Conference Series', details: '9, 187–196', year: 2009, url: scholar('Y0pCki6q_DkC') },
      { id: 'lundell2009phd', authors: [AL], title: 'Transformation techniques for signomial functions in global optimization', venue: 'PhD thesis, Åbo Akademi University', year: 2009, url: scholar('9yKSN-GCB0IC') },
      { id: 'lundell2008iasted', authors: [AL, TW], title: 'Exponential and power transformations for convexifying signomial terms in MINLP problems', venue: 'Proceedings of the 27th IASTED International Conference on Modelling, Identification and Control', details: '154–159', year: 2008, url: scholar('d1gkVwhDpl0C') },
      { id: 'lundell2007power', authors: [AL, TW], title: 'Optimization of power transformations in global optimization', venue: CET, details: '11, 95–100', year: 2007, url: scholar('qjMakFHDy7sC') },
    ],
  },
  {
    id: 'benchmarks',
    label: 'Benchmarks',
    title: 'Solver comparisons',
    intro: 'A comparison of SHOT with other convex MINLP solvers on the convex instances in MINLPLib. Note that the paper is from 2019 and used an older version of SHOT (0.9.2); SHOT has changed considerably since.',
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
  {
    id: 'theses',
    label: 'Theses',
    title: 'Theses on SHOT',
    intro: 'Master’s theses at Åbo Akademi University that have contributed to SHOT.',
    items: theses.map((t) => ({
      id: t.id,
      authors: [t.author],
      title: t.title,
      venue: 'Master’s thesis, Åbo Akademi University',
      year: t.year,
      url: t.url,
      note: t.contribution,
    })),
  },
];

export const benchmarkFiles = 'https://andreaslundell.github.io/minlpbenchmarks/';

export function pubHref(p: Publication): string | undefined {
  return p.doi ? `https://doi.org/${p.doi}` : p.url;
}
