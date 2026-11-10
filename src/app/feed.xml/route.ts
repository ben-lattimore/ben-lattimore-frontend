import { getArticlesWithBody } from '@/lib/queries';
import { extractDescription } from '@/lib/extractDescription';
import { formatArticleTitle } from '@/lib/formatTitle';
import { AUTHOR_NAME, SITE_NAME, SITE_URL, absoluteUrl, articlePath } from '@/lib/site';

// RSS 2.0 feed of the Writing column.
export const dynamic = 'force-static';
export const revalidate = 60;

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!,
  );

export async function GET() {
  const articles = await getArticlesWithBody();
  const feedUrl = `${SITE_URL}/feed.xml`;

  const items = articles
    .map((article) => {
      const url = absoluteUrl(articlePath(article.slug));
      return `    <item>
      <title>${escapeXml(formatArticleTitle(article))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(AUTHOR_NAME)}</dc:creator>
      <description>${escapeXml(extractDescription(article.body))}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Writing`)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(`Writing by ${AUTHOR_NAME}`)}</description>
    <language>en-gb</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
