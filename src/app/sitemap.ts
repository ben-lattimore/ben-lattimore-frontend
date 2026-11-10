import type { MetadataRoute } from 'next';
import { getArticles, getHome, getProjects } from '@/lib/queries';
import { absoluteUrl, articlePath, projectPath } from '@/lib/site';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, articles, projects] = await Promise.all([getHome(), getArticles(), getProjects()]);
  const projectPages = projects.filter((p) => p.hasBody && p.slug);

  // The home page lists everything, so it changes whenever anything does.
  const homeLastModified = [home, ...articles, ...projects]
    .map((doc) => doc._updatedAt)
    .sort()
    .at(-1);

  return [
    { url: absoluteUrl('/'), lastModified: homeLastModified },
    ...articles.map((a) => ({ url: absoluteUrl(articlePath(a.slug)), lastModified: a._updatedAt })),
    ...projectPages.map((p) => ({
      url: absoluteUrl(projectPath(p.slug!)),
      lastModified: p._updatedAt,
    })),
  ];
}
