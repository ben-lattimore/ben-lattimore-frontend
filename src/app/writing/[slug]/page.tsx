import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portableTextComponents';
import ArticleDownloads from '@/components/ArticleDownloads';
import JsonLd from '@/components/JsonLd';
import ReadingLayout from '@/components/ReadingLayout';
import { getArticle, getArticleSlugs, getHome } from '@/lib/queries';
import { formatArticleDate } from '@/lib/formatDate';
import { formatArticleTitle, formatTitle } from '@/lib/formatTitle';
import { readingLabel } from '@/lib/readingTime';
import { extractDescription } from '@/lib/extractDescription';
import { articleJsonLd } from '@/lib/structuredData';
import {
  AUTHOR_NAME,
  alternatesFor,
  articleMarkdownPath,
  articlePath,
  openGraphDefaults,
} from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

// Pre-rendered at build, then refreshed at most every 60s so Sanity edits appear.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Not found' };
  const description = extractDescription(article.body) || undefined;
  const fullTitle = formatArticleTitle(article);
  const path = articlePath(slug);
  return {
    title: fullTitle,
    description,
    // A Markdown copy for readers and AI tools, when downloads are enabled.
    alternates: alternatesFor(
      path,
      article.showDownloads ? { 'text/markdown': articleMarkdownPath(slug) } : {},
    ),
    openGraph: {
      ...openGraphDefaults,
      type: 'article',
      url: path,
      title: fullTitle,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      authors: [AUTHOR_NAME],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, home] = await Promise.all([getArticle(slug), getHome()]);
  if (!article) notFound();

  return (
    <ReadingLayout home={home}>
      <JsonLd data={articleJsonLd(article, extractDescription(article.body))} />
      <header className="mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-balance">
          <span className="block leading-[1.1]">{formatTitle(article.title)}</span>
          {article.subtitle && (
            <span className="block text-2xl sm:text-3xl font-medium leading-tight opacity-80 mt-3">
              {formatTitle(article.subtitle)}
            </span>
          )}
        </h1>
        <div className="text-base opacity-70 flex flex-wrap items-center gap-x-2">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingLabel(article.charCount)}</span>
        </div>
      </header>

      <div>
        <PortableText value={article.body} components={portableTextComponents} />
      </div>

      {article.showDownloads && (
        <ArticleDownloads slug={article.slug} title={formatArticleTitle(article)} />
      )}
    </ReadingLayout>
  );
}
