import type { ArticleData, HomeData, ProjectDetailData } from '@/types';
import { paragraphText } from '@/lib/extractDescription';
import { formatArticleTitle, formatProjectTitle } from '@/lib/formatTitle';
import { AUTHOR_NAME, SITE_NAME, SITE_URL, absoluteUrl, articlePath, projectPath } from '@/lib/site';

// schema.org JSON-LD. The Person is defined once on the home page and referenced
// by @id everywhere else, so search and AI engines resolve "Ben Lattimore",
// benlattimore.com and his LinkedIn profile to the same entity.

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const authorRef = { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR_NAME, url: SITE_URL };

// Person details come from the Home document's "Search & AI profile" fields in
// Sanity. Empty fields are omitted rather than defaulted.
export function homeJsonLd(home: HomeData) {
  const profiles = [...new Set([home.linkedin?.url, ...(home.sameAs ?? [])].filter(Boolean))];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: AUTHOR_NAME,
        url: SITE_URL,
        jobTitle: home.jobTitle || undefined,
        knowsAbout: home.knowsAbout?.length ? home.knowsAbout : undefined,
        description: paragraphText(home.main_text) || undefined,
        sameAs: profiles.length ? profiles : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: 'en-GB',
        author: { '@id': PERSON_ID },
      },
    ],
  };
}

export function articleJsonLd(article: ArticleData, description: string) {
  const url = absoluteUrl(articlePath(article.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: formatArticleTitle(article),
    description: description || undefined,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    inLanguage: 'en-GB',
    author: authorRef,
    publisher: authorRef,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function projectJsonLd(project: ProjectDetailData, description: string) {
  const url = absoluteUrl(projectPath(project.slug));
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: formatProjectTitle(project),
    description: description || undefined,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    dateModified: project._updatedAt,
    genre: project.category,
    keywords: project.technologyUsed,
    sameAs: project.url,
    inLanguage: 'en-GB',
    creator: authorRef,
    isPartOf: { '@id': WEBSITE_ID },
  };
}
