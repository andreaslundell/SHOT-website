import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// News and releases: one Markdown file per item in src/content/news/.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // How much of the date is known: "day" shows 16 October 2026, "month" shows October 2026.
    datePrecision: z.enum(['day', 'month', 'year']).default('day'),
    type: z.enum(['release', 'paper', 'talk', 'news']),
    summary: z.string(),
    version: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

export const collections = { news };
