import { getCollection, type CollectionEntry } from 'astro:content';

export type NewsEntry = CollectionEntry<'news'>;

export const newsTypes = {
  release: { label: 'Release', plural: 'Releases', icon: 'release' },
  paper: { label: 'Paper', plural: 'Papers', icon: 'paper' },
  talk: { label: 'Talk', plural: 'Talks', icon: 'talk' },
  news: { label: 'News', plural: 'News', icon: 'news' },
} as const;

export async function getNews(): Promise<NewsEntry[]> {
  const all = await getCollection('news');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(entry: NewsEntry): string {
  const { date, datePrecision } = entry.data;
  const opts: Intl.DateTimeFormatOptions =
    datePrecision === 'year' ? { year: 'numeric' } : datePrecision === 'month' ? { year: 'numeric', month: 'long' } : { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}

export const newsUrl = (entry: NewsEntry) => `/news/${entry.id}/`;
