// Build-time data from the GitHub API. Every call falls back to a snapshot, so the site still
// builds offline or when the API rate limit is hit. Set GITHUB_TOKEN to raise the limit.

export const repo = 'coin-or/SHOT';
export const repoUrl = `https://github.com/${repo}`;

export interface Contributor {
  login: string;
  avatar: string;
  url: string;
  contributions: number;
}

// Snapshot taken October 2026.
const contributorSnapshot: Contributor[] = [
  ['andreaslundell', 2027],
  ['svigerske', 234],
  ['maxemiliang', 116],
  ['johanekman12', 23],
  ['torressa', 3],
  ['odow', 2],
  ['mapgccv', 1],
  ['giordano', 1],
].map(([login, contributions]) => ({
  login: login as string,
  contributions: contributions as number,
  avatar: `https://github.com/${login}.png?size=96`,
  url: `https://github.com/${login}`,
}));

async function api<T>(path: string): Promise<T | undefined> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'shotsolver.dev' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/${path}`, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}

let cached: Contributor[] | undefined;

export async function getContributors(): Promise<Contributor[]> {
  if (cached) return cached;
  const data = await api<{ login: string; avatar_url: string; html_url: string; contributions: number; type: string }[]>(
    `repos/${repo}/contributors?per_page=100`,
  );
  cached =
    data && data.length
      ? data
          .filter((c) => c.type === 'User')
          .map((c) => ({ login: c.login, avatar: `${c.avatar_url}&s=96`, url: c.html_url, contributions: c.contributions }))
      : contributorSnapshot;
  return cached;
}
