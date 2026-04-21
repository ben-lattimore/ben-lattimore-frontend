import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { ArticleData } from '@/types';
import { buildMarkdownDocument } from '@/lib/portableTextToMarkdown';

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  subtitle,
  "slug": slug,
  publishedAt,
  showDownloads,
  body
}`;

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await client.fetch<ArticleData | null>(articleBySlugQuery, {
    slug: params.slug,
  });

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!article.showDownloads) {
    return NextResponse.json({ error: 'Downloads not enabled' }, { status: 403 });
  }

  const origin = new URL(request.url).origin;
  const canonicalUrl = `${origin}/writing/${params.slug}`;

  const markdown = buildMarkdownDocument({
    title: article.title,
    subtitle: article.subtitle,
    publishedAt: article.publishedAt,
    body: article.body,
    canonicalUrl,
  });

  const filename = `${params.slug}.md`;

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=60',
    },
  });
}
