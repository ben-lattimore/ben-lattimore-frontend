import type { Metadata } from 'next';
import HomeView from '@/components/HomeView';
import JsonLd from '@/components/JsonLd';
import { getArticles, getHome, getProjects } from '@/lib/queries';
import { extractDescription } from '@/lib/extractDescription';
import { homeJsonLd } from '@/lib/structuredData';
import { AUTHOR_NAME, SITE_NAME, alternatesFor, openGraphDefaults } from '@/lib/site';

// Server-rendered so crawlers (including AI crawlers that don't run JavaScript)
// get the full page. Regenerated at most every 60s so Sanity edits still appear
// without a redeploy.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  const description = extractDescription(home.main_text) || undefined;
  return {
    description,
    alternates: alternatesFor('/'),
    openGraph: {
      ...openGraphDefaults,
      type: 'website',
      url: '/',
      title: `${SITE_NAME} — ${AUTHOR_NAME}`,
      description,
    },
  };
}

export default async function Home() {
  const [home, projects, articles] = await Promise.all([getHome(), getProjects(), getArticles()]);

  return (
    <>
      <JsonLd data={homeJsonLd(home)} />
      <HomeView home={home} projects={projects} articles={articles} />
    </>
  );
}
