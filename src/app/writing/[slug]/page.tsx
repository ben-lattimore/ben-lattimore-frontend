import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { client } from '@/lib/sanity';
import { ArticleData, HomeData } from '@/types';
import { articleComponents } from '@/components/articlePortableText';
import SiteHeader from '@/components/SiteHeader';
import { formatArticleDate } from '@/lib/formatDate';
import { formatTitle } from '@/lib/formatTitle';

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  subtitle,
  "slug": slug,
  publishedAt,
  body
}`;

const allSlugsQuery = `*[_type == "article" && defined(slug.current)]{ "slug": slug.current }`;

const homeQuery = `*[_type == "home"][0]`;

async function getArticle(slug: string): Promise<ArticleData | null> {
  return client.fetch<ArticleData | null>(articleBySlugQuery, { slug });
}

async function getHome(): Promise<HomeData> {
  return client.fetch<HomeData>(homeQuery);
}

function extractDescription(body: PortableTextBlock[] | undefined): string {
  if (!body) return '';
  for (const block of body) {
    if (block._type !== 'block') continue;
    const children = (block as PortableTextBlock & { children?: Array<{ text?: string }> }).children;
    if (!children) continue;
    const text = children.map((c) => c.text ?? '').join('').trim();
    if (text) {
      return text.length > 160 ? `${text.slice(0, 157)}…` : text;
    }
  }
  return '';
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Not found' };
  const description = extractDescription(article.body);
  const displayTitle = formatTitle(article.title);
  const displaySubtitle = article.subtitle ? formatTitle(article.subtitle) : '';
  const fullTitle = displaySubtitle
    ? `${displayTitle}: ${displaySubtitle}`
    : displayTitle;
  return {
    title: `${fullTitle} — Ben Lattimore`,
    description: description || undefined,
    openGraph: {
      title: fullTitle,
      description: description || undefined,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const [article, home] = await Promise.all([
    getArticle(params.slug),
    getHome(),
  ]);
  if (!article) notFound();

  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full xl:w-[1600px]">
        <SiteHeader home={home} variant="article" />

        <div className="max-w-[68ch] mx-auto px-6 sm:px-8">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex items-center text-base opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm"
          >
            <span aria-hidden="true" className="mr-2">←</span>back
          </Link>

          <article className="pt-4 pb-24 sm:pt-6 sm:pb-32">
            <header className="mb-12 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-4 text-balance">
                <span className="block">{formatTitle(article.title)}</span>
                {article.subtitle && (
                  <span className="block text-2xl sm:text-3xl font-medium opacity-80 mt-3">
                    {formatTitle(article.subtitle)}
                  </span>
                )}
              </h1>
              <time
                dateTime={article.publishedAt}
                className="text-base opacity-70 block"
              >
                {formatArticleDate(article.publishedAt)}
              </time>
            </header>

            <div>
              <PortableText value={article.body} components={articleComponents} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
