import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portableTextComponents';
import ArticleDownloads from '@/components/ArticleDownloads';
import ReadingLayout from '@/components/ReadingLayout';
import { getArticle, getArticleSlugs, getHome } from '@/lib/queries';
import { formatArticleDate } from '@/lib/formatDate';
import { formatTitle } from '@/lib/formatTitle';
import { readingLabel } from '@/lib/readingTime';
import { extractDescription } from '@/lib/extractDescription';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Not found' };
  const description = extractDescription(article.body) || undefined;
  const displayTitle = formatTitle(article.title);
  const fullTitle = article.subtitle
    ? `${displayTitle}: ${formatTitle(article.subtitle)}`
    : displayTitle;
  return {
    title: `${fullTitle} — Ben Lattimore`,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, home] = await Promise.all([getArticle(slug), getHome()]);
  if (!article) notFound();

  return (
    <ReadingLayout home={home}>
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
        <ArticleDownloads
          slug={article.slug}
          title={formatTitle(
            article.subtitle ? `${article.title}: ${article.subtitle}` : article.title,
          )}
        />
      )}
    </ReadingLayout>
  );
}
