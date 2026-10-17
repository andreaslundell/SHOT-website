# shotsolver.dev

The website of [SHOT](https://github.com/coin-or/SHOT), the Supporting Hyperplane Optimization Toolkit: an open-source MINLP solver. It is built with [Astro](https://astro.build) as a static site and deployed to GitHub Pages at <https://www.shotsolver.dev>.

The design follows the [SHOT branding](https://github.com/andreaslundell/SHOT-branding) system.

## Local development

Requires Node 22 or later.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

## Where things are

| Path | Contents |
| --- | --- |
| `src/content/news/` | News and releases, one Markdown file per item (see below) |
| `src/data/publications.ts` | Publications, grouped, with BibTeX for the two papers to cite |
| `src/data/team.ts` | Developers, contributors, open-source connections, funders |
| `src/data/github.ts` | Code contributors, fetched from the GitHub API at build time with a fallback snapshot |
| `src/pages/` | One file per page: home, get started, news, publications, team |
| `src/scripts/esh.ts` | The two-variable ESH method behind the interactive figure on the home page |
| `src/styles/tokens.css`, `src/styles/shot.css` | Copied unchanged from SHOT-branding; update them from there |
| `src/styles/site.css` | Site layout on top of the brand styles |
| `public/images/` | Logos, motifs and figures from SHOT-branding |

## Adding a news item or release

Create `src/content/news/YYYY-MM-short-name.md`:

```markdown
---
title: SHOT 2.0 released
date: 2026-11-01
type: release          # release, paper, talk or news
version: "2.0"         # optional, shown next to the title
summary: One or two sentences for the news list and the home page.
link: https://github.com/coin-or/SHOT/releases   # optional
---

The full text in Markdown.
```

Use `datePrecision: month` when only the month is known. The newest three items appear on the home page, and the newest release is linked from the hero.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `main`, and weekly to refresh the contributor list. In the repository settings, under Pages, set the source to GitHub Actions and the custom domain to `www.shotsolver.dev`; `public/CNAME` holds the same domain.

The old GitBook URLs under `/shot/` (linked from the SHOT repository, PyPI and the solver's output) redirect to the new pages; see `redirects` in `astro.config.mjs`.

## Documentation

The `/docs/` page links to Sphinx documentation built from `coin-or/SHOT` under
`/docs/dev/`. The deployment workflow builds SHOTpy from the same checkout used for
the guides and API references. Merge the documentation tooling into SHOT before
publishing this workflow. Development builds use HiGHS and Ipopt; backend-dependent
defaults can differ from other installations.

For a local combined preview, build Astro first, then run the SHOT checkout's
`docs/build.py --output /absolute/path/to/SHOT-website/dist/docs/dev` using its
matching SHOTpy environment. Serve `dist/` with a static HTTP server.

Release documentation must use a fixed tag and be included in each deployment;
GitHub Pages replaces the whole site. Add released versions to `src/pages/docs/index.astro`.
