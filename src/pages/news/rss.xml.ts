import type { APIRoute } from 'astro';
import { getNews, newsUrl } from '../../data/news';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const news = await getNews();
  const base = site ?? new URL('https://www.shotsolver.dev');
  const items = news
    .map((n) => {
      const url = new URL(newsUrl(n), base).href;
      return `    <item>
      <title>${esc(n.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${n.data.date.toUTCString()}</pubDate>
      <category>${n.data.type}</category>
      <description>${esc(n.data.summary)}</description>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SHOT news</title>
    <link>${new URL('/news/', base).href}</link>
    <description>News and releases of SHOT, the Supporting Hyperplane Optimization Toolkit</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
