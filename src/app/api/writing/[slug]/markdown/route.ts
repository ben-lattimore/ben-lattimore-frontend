import { NextResponse } from 'next/server';
import { getArticle } from '@/lib/queries';
import { buildMarkdownDocument } from '@/lib/portableTextToMarkdown';
import { absoluteUrl, articlePath } from '@/lib/site';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!article.showDownloads) {
    return NextResponse.json({ error: 'Downloads not enabled' }, { status: 403 });
  }

  const markdown = buildMarkdownDocument({
    title: article.title,
    subtitle: article.subtitle,
    publishedAt: article.publishedAt,
    body: article.body,
    canonicalUrl: absoluteUrl(articlePath(slug)),
  });

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.md"`,
      'Cache-Control': 'public, max-age=0, s-maxage=60',
    },
  });
}
