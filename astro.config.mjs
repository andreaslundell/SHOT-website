// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import shotCodeTheme from './src/data/shot-code-theme.mjs';

// The site is written for the root of www.shotsolver.dev. Until the custom domain is set up, GitHub
// Pages serves it under /SHOT-website/; the deploy workflow then passes that path as BASE_PATH (and
// the origin as SITE_URL), and prefixLinks() adds it to the root-relative links in the built files.
const site = process.env.SITE_URL || 'https://www.shotsolver.dev';
const base = (process.env.BASE_PATH || '').replace(/\/+$/, '');

function prefixLinks() {
  return {
    name: 'prefix-root-links',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!base) return;
        const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // href="/x", src="/x", url=/x (redirect pages) and CSS url(/x), but not //host or links that already have the base.
        const attr = new RegExp(`((?:href|src)=["']|url=|url\\(["']?)/(?!/|${esc.slice(1)}/)`, 'g');
        const walk = async (d) => {
          for (const e of await readdir(d, { withFileTypes: true })) {
            const f = join(d, e.name);
            if (e.isDirectory()) await walk(f);
            else if (/\.(html|css)$/.test(e.name)) {
              const t = await readFile(f, 'utf8');
              const n = t.replace(attr, `$1${base}/`);
              if (n !== t) await writeFile(f, n);
            }
          }
        };
        await walk(fileURLToPath(dir));
      },
    },
  };
}

export default defineConfig({
  site,
  base: base || '/',
  integrations: [prefixLinks()],
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
