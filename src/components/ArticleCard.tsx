'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArticleListItem } from '@/types';
import { formatArticleDate } from '@/lib/formatDate';
import { formatTitle } from '@/lib/formatTitle';

export default function ArticleCard({ article }: { article: ArticleListItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="pb-16 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/writing/${article.slug.current}`}
        className="inline-block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm"
      >
        <div
          style={{
            transform: isHovered ? 'translateX(40px)' : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <h3 className="text-xl font-semibold mr-16">
            <span className="block">{formatTitle(article.title)}</span>
            {article.subtitle && (
              <span className="block text-base font-medium opacity-80 mt-1">
                {formatTitle(article.subtitle)}
              </span>
            )}
          </h3>
          <time dateTime={article.publishedAt} className="text-base block opacity-70 mt-1">
            {formatArticleDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    </div>
  );
}
