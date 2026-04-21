'use client';

import { useEffect, useState } from 'react';

export default function ArticleDownloads({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [canonicalUrl, setCanonicalUrl] = useState(`/writing/${slug}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanonicalUrl(`${window.location.origin}/writing/${slug}`);
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / denied clipboard — no-op; user can still copy from URL bar.
    }
  };

  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedText = encodeURIComponent(title);
  const xIntent = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const linkedInIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const linkClasses =
    'text-base opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm underline underline-offset-4 decoration-1 hover:decoration-2';

  return (
    <aside
      aria-labelledby="article-downloads-heading"
      className="mt-16 pt-8 border-t border-current/20 print:hidden"
    >
      <h2
        id="article-downloads-heading"
        className="text-sm uppercase tracking-wider opacity-60 mb-4"
      >
        Download &amp; share
      </h2>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <a
          href={`/api/writing/${slug}/markdown`}
          className={linkClasses}
          download
        >
          Markdown (.md)
        </a>
        <button type="button" onClick={() => window.print()} className={linkClasses}>
          PDF (print)
        </button>
        <button type="button" onClick={copyLink} className={linkClasses}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <a
          href={xIntent}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          Share on X
        </a>
        <a
          href={linkedInIntent}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          Share on LinkedIn
        </a>
      </div>
    </aside>
  );
}
