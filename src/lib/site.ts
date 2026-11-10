import type { Metadata } from 'next';

// Canonical site identity, used for metadata, structured data, feeds and share links.
// Always the production origin, so previews and localhost never become canonical.
export const SITE_URL = 'https://www.benlattimore.com';
export const SITE_NAME = 'Things Ben Built';
export const AUTHOR_NAME = 'Ben Lattimore';

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;

export const articlePath = (slug: string) => `/writing/${slug}`;
export const projectPath = (slug: string) => `/projects/${slug}`;
export const articleMarkdownPath = (slug: string) => `/api/writing/${slug}/markdown`;

export const openGraphDefaults = {
  siteName: SITE_NAME,
  locale: 'en_GB',
};

const RSS_FEED = [{ url: '/feed.xml', title: `${SITE_NAME} — Writing` }];

// Pages that set `alternates` replace the layout's entirely, so every page
// builds them here to keep the RSS link alongside its canonical URL.
export function alternatesFor(
  path: string,
  types: Record<string, string> = {},
): Metadata['alternates'] {
  return {
    canonical: path,
    types: { 'application/rss+xml': RSS_FEED, ...types },
  };
}
