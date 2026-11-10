import { getArticlesWithBody, getHome, getProjects } from '@/lib/queries';
import { extractDescription, paragraphText } from '@/lib/extractDescription';
import { formatArticleTitle } from '@/lib/formatTitle';
import { formatArticleDate } from '@/lib/formatDate';
import {
  AUTHOR_NAME,
  SITE_NAME,
  absoluteUrl,
  articleMarkdownPath,
  articlePath,
  projectPath,
} from '@/lib/site';
import type { ProjectData } from '@/types';

// llms.txt (https://llmstxt.org): a plain-Markdown guide to the site for AI
// tools, linking to Markdown copies of articles where downloads are enabled.
export const dynamic = 'force-static';
export const revalidate = 60;

const projectLine = (project: ProjectData) => {
  const href =
    project.hasBody && project.slug ? absoluteUrl(projectPath(project.slug)) : project.url;
  const label = href ? `[${project.clientName}](${href})` : project.clientName;
  return `- ${label}${project.technologyUsed ? `: ${project.technologyUsed}` : ''}`;
};

export async function GET() {
  const [home, articles, projects] = await Promise.all([
    getHome(),
    getArticlesWithBody(),
    getProjects(),
  ]);

  const articleLines = articles.map((article) => {
    const pageUrl = absoluteUrl(articlePath(article.slug));
    const link = article.showDownloads
      ? `[${formatArticleTitle(article)}](${absoluteUrl(articleMarkdownPath(article.slug))})`
      : `[${formatArticleTitle(article)}](${pageUrl})`;
    const page = article.showDownloads ? ` Web page: ${pageUrl}` : '';
    return `- ${link}: ${formatArticleDate(article.publishedAt)}. ${extractDescription(article.body)}${page}`;
  });

  const section = (title: string, lines: string[]) =>
    lines.length ? `## ${title}\n\n${lines.join('\n')}\n` : '';

  const profile = [
    home.jobTitle && `Role: ${home.jobTitle}`,
    home.knowsAbout?.length && `Expertise: ${home.knowsAbout.join(', ')}`,
  ].filter(Boolean);

  const text = [
    `# ${AUTHOR_NAME} — ${SITE_NAME}\n`,
    `> ${paragraphText(home.main_text)}\n`,
    profile.length ? `${profile.join('\n')}\n` : '',
    `Portfolio of AI and web development projects, plus long-form writing. LinkedIn: ${home.linkedin.url}\n`,
    section('Writing', articleLines),
    section('AI projects', projects.filter((p) => p.category === 'AI').map(projectLine)),
    section(
      'Web development projects',
      projects.filter((p) => p.category === 'Web Development').map(projectLine),
    ),
    section('Optional', [
      `- [RSS feed](${absoluteUrl('/feed.xml')}): new writing`,
      `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    ]),
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
