// @ts-check
import { defineConfig } from 'astro/config';
import shotCodeTheme from './src/data/shot-code-theme.mjs';

export default defineConfig({
  site: 'https://www.shotsolver.dev',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  compressHTML: false,
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { theme: shotCodeTheme, wrap: false },
  },
  // The previous GitBook site lived under /shot/. These URLs are linked from the SHOT
  // repository, PyPI and the solver's own output, so keep them working.
  redirects: {
    '/shot': '/',
    '/shot/about-shot': '/',
    '/shot/about-shot/algorithm': '/#method',
    '/shot/about-shot/releases': '/news/?type=release',
    '/shot/about-shot/compiling': '/getting-started/#source',
    '/shot/about-shot/contributors': '/team/',
    '/shot/about-shot/publications': '/publications/',
    '/shot/about-shot/benchmarks': '/publications/#benchmarks',
    '/shot/news': '/news/',
    '/shot/using-shot/getting-started': '/getting-started/',
    '/shot/using-shot/solver-options': '/getting-started/#options',
  },
});
