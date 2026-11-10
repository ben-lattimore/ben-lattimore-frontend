import { getArticle } from '@/lib/queries';
import { ogContentType, ogSize, renderOgCard } from '@/lib/ogImage';
import { formatArticleDate } from '@/lib/formatDate';
import { formatTitle } from '@/lib/formatTitle';
import { readingLabel } from '@/lib/readingTime';
import { AUTHOR_NAME } from '@/lib/site';

export const alt = `Article by ${AUTHOR_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

// Articles keep the quiet brand grey, matching the reading view.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return renderOgCard({
    eyebrow: 'Writing',
    title: article ? formatTitle(article.title) : 'Writing',
    subtitle: article?.subtitle ? formatTitle(article.subtitle) : undefined,
    footer: article
      ? `${AUTHOR_NAME} · ${formatArticleDate(article.publishedAt)} · ${readingLabel(article.charCount)}`
      : AUTHOR_NAME,
  });
}
