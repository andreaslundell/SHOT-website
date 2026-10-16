// People behind SHOT. GitHub contributors are also fetched at build time (see src/data/github.ts).

export interface Affiliation {
  name: string;
  url?: string;
}

export interface Person {
  name: string;
  position?: string;
  affiliations: Affiliation[];
  role?: string; // contribution to SHOT
  url?: string; // research or home page
  photo?: string; // falls back to the GitHub avatar
  githubAvatar?: boolean; // false when the GitHub avatar is not a photo
  photoFit?: 'cover' | 'contain'; // contain shows the whole photo inside the circle
  github?: string;
  scholar?: string;
  researchgate?: string;
  linkedin?: string;
}

export const abo: Affiliation = { name: 'Åbo Akademi University', url: 'https://www.abo.fi' };

const kth: Affiliation = { name: 'KTH Royal Institute of Technology', url: 'https://www.kth.se' };

export const developers: Person[] = [
  {
    name: 'Andreas Lundell',
    position: 'Associate Professor in Information Technology',
    affiliations: [abo],
    role: 'Project manager and main developer',
    url: 'https://research.abo.fi/en/persons/andreas-lundell/',
    photo: '/images/team/lundell.jpg',
    github: 'andreaslundell',
    scholar: 'https://scholar.google.com/citations?user=UB3JBrkAAAAJ',
    researchgate: 'https://www.researchgate.net/profile/Andreas_Lundell',
    linkedin: 'https://www.linkedin.com/in/andreaslundell',
  },
  {
    name: 'Jan Kronqvist',
    position: 'Associate Professor in Optimization and Systems Theory',
    affiliations: [kth],
    role: 'Algorithm development',
    url: 'https://www.kth.se/profile/jankr',
    photo: '/images/team/kronqvist.jpg',
    scholar: 'https://scholar.google.com/citations?user=hEdm6bAAAAAJ',
    researchgate: 'https://www.researchgate.net/profile/Jan-Kronqvist',
    linkedin: 'https://se.linkedin.com/in/jan-kronqvist',
  },
];

export const contributors: Person[] = [
  {
    name: 'Joakim Blomqvist',
    position: 'PhD student',
    affiliations: [abo],
    role: 'Algorithm development',
    url: 'https://research.abo.fi/en/persons/joakim-blomqvist/',
    photo: '/images/team/blomqvist.jpg',
    github: 'JoaBlo',
  },
  {
    name: 'Alireza Olama',
    affiliations: [abo, { name: 'QuTwo', url: 'https://www.qutwo.com/' }],
    role: 'Parallel heuristics',
    url: 'https://alirezalm.github.io/',
    photo: '/images/team/olama.jpg',
    github: 'Alirezalm',
    scholar: 'https://scholar.google.com/citations?user=km4oc50AAAAJ',
    linkedin: 'https://www.linkedin.com/in/alireza-olama-213a6a107/',
  },
  {
    name: 'Stefan Vigerske',
    affiliations: [{ name: 'GAMS Software GmbH', url: 'https://www.gams.com' }],
    role: 'GAMS integration',
    url: 'https://www.gams.com/~svigerske/',
    github: 'svigerske',
  },
  {
    name: 'Oscar Dowson',
    position: 'JuMP core contributor',
    affiliations: [{ name: 'JuMP', url: 'https://jump.dev' }],
    role: 'Julia integration and the build system for SHOT',
    github: 'odow',
    scholar: 'https://scholar.google.com/citations?user=COLMCQcAAAAJ',
    linkedin: 'https://www.linkedin.com/in/oscar-dowson-544704272/',
  },
  {
    name: 'Tapio Westerlund',
    position: 'Professor emeritus',
    affiliations: [abo],
    role: 'Originator of the ECP and ESH methods',
    url: 'https://users.abo.fi/twesterl/',
    photo: '/images/team/westerlund.jpg',
    photoFit: 'contain',
    scholar: 'https://scholar.google.com/citations?user=4sK1tUQAAAAJ',
    researchgate: 'https://www.researchgate.net/profile/Tapio-Westerlund',
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
      { name: 'Uno', url: 'https://github.com/cvanaret/Uno', note: 'NLP' },
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

export const supporters = 'We greatly appreciate the support from COIN-OR, GAMS and HiGHS during the development of SHOT.';

export const funders: string[] = [
  'Högskolestiftelsen i Österbotten',
  'The Magnus Ehrnrooth Foundation',
  'Svensk-Österbottniska samfundet',
  'The Swedish Cultural Foundation in Finland',
  'A Newton International Fellowship by the Royal Society (NIF\\R1\\182194)',
  'The Centre of Excellence in Optimization and Systems Engineering at Åbo Akademi University',
];
