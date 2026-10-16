// People behind SHOT. GitHub contributors are also fetched at build time (see src/data/github.ts).

export interface Person {
  name: string;
  role: string;
  affiliation: string;
  url?: string;
  github?: string;
}

export const developers: Person[] = [
  {
    name: 'Andreas Lundell',
    role: 'Project manager and main developer',
    affiliation: 'Åbo Akademi University, Finland',
    url: 'https://www.researchgate.net/profile/Andreas_Lundell',
    github: 'andreaslundell',
  },
  {
    name: 'Jan Kronqvist',
    role: 'Main developer, co-author of the ESH algorithm',
    affiliation: 'KTH Royal Institute of Technology, Sweden',
    url: 'https://www.researchgate.net/profile/Jan_Kronqvist',
  },
];

export const contributors: Person[] = [
  {
    name: 'Stefan Vigerske',
    role: 'GAMS integration',
    affiliation: 'GAMS Software GmbH',
    url: 'https://www.gams.com/~stefan/',
    github: 'svigerske',
  },
  {
    name: 'Tapio Westerlund',
    role: 'Originator of the ECP and ESH methods',
    affiliation: 'Åbo Akademi University, Finland',
    url: 'https://www.researchgate.net/profile/Tapio_Westerlund',
  },
];

export interface Link {
  name: string;
  url: string;
  note?: string;
}

export const openSource: { group: string; items: Link[] }[] = [
  {
    group: 'Subsolvers',
    items: [
      { name: 'Cbc', url: 'https://github.com/coin-or/Cbc', note: 'MIP' },
      { name: 'HiGHS', url: 'https://highs.dev', note: 'MIP' },
      { name: 'Ipopt', url: 'https://github.com/coin-or/Ipopt', note: 'NLP' },
      { name: 'Uno', url: 'https://github.com/cvanaret/Uno', note: 'NLP, optional' },
    ],
  },
  {
    group: 'Modeling interfaces',
    items: [
      { name: 'AMPL MP (ASL)', url: 'https://github.com/ampl/mp' },
      { name: 'Pyomo', url: 'https://www.pyomo.org' },
      { name: 'JuMP', url: 'https://jump.dev' },
      { name: 'pybind11', url: 'https://github.com/pybind/pybind11' },
    ],
  },
  {
    group: 'Mathematical routines',
    items: [
      { name: 'CppAD', url: 'https://github.com/coin-or/CppAD' },
      { name: 'Eigen', url: 'https://eigen.tuxfamily.org' },
      { name: 'MC++', url: 'https://github.com/coin-or/MCpp' },
    ],
  },
  {
    group: 'Utilities',
    items: [
      { name: 'Boost', url: 'https://www.boost.org' },
      { name: 'spdlog', url: 'https://github.com/gabime/spdlog' },
      { name: 'TinyXML-2', url: 'https://github.com/leethomason/tinyxml2' },
      { name: 'argh!', url: 'https://github.com/adishavit/argh' },
      { name: 'JSON for Modern C++', url: 'https://github.com/nlohmann/json' },
    ],
  },
];

export const commercial: Link[] = [
  { name: 'IBM CPLEX', url: 'https://www.ibm.com/products/ilog-cplex-optimization-studio', note: 'MIP' },
  { name: 'Gurobi', url: 'https://www.gurobi.com', note: 'MIP' },
  { name: 'GAMS', url: 'https://www.gams.com', note: 'Modeling system and NLP solvers' },
];

export const supporters = 'We greatly appreciate the support from COIN-OR, GAMS and HiGHS during the development of SHOT.';

export const funders: string[] = [
  'Högskolestiftelsen i Österbotten',
  'The Magnus Ehrnrooth Foundation',
  'Svensk-Österbottniska samfundet',
  'The Swedish Cultural Foundation in Finland',
  'A Newton International Fellowship by the Royal Society (NIF\\R1\\182194)',
  'The Centre of Excellence in Optimization and Systems Engineering at Åbo Akademi University',
];
