import Link from 'next/link';
import type { ArticleListItem } from '@/types';
import { formatArticleDate } from '@/lib/formatDate';
import { formatTitle } from '@/lib/formatTitle';
import { readingLabel } from '@/lib/readingTime';

// Same slide-on-hover as ProjectCard, but articles deliberately don't tint the page.
export default function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <div className="group pb-16 relative">
      <Link
        href={`/writing/${article.slug}`}
        className="inline-block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm"
      >
        <div className="transition-transform duration-300 ease-[ease-in-out] group-hover:translate-x-10">
          <h3 className="text-xl font-semibold mr-16">
            <span className="block">{formatTitle(article.title)}</span>
            {article.subtitle && (
              <span className="block text-base font-medium opacity-80 mt-1">
                {formatTitle(article.subtitle)}
              </span>
            )}
          </h3>
          <div className="text-base flex flex-wrap items-center gap-x-2 opacity-70 mt-1">
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{readingLabel(article.charCount)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
