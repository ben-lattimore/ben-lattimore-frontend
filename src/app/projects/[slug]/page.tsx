import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portableTextComponents';
import JsonLd from '@/components/JsonLd';
import ReadingLayout from '@/components/ReadingLayout';
import { getHome, getProject, getProjectSlugs } from '@/lib/queries';
import { readingLabel } from '@/lib/readingTime';
import { formatArticleDate } from '@/lib/formatDate';
import { extractDescription } from '@/lib/extractDescription';
import { formatProjectTitle } from '@/lib/formatTitle';
import { projectJsonLd } from '@/lib/structuredData';
import { AUTHOR_NAME, alternatesFor, openGraphDefaults, projectPath } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

// Pre-rendered at build, then refreshed at most every 60s so Sanity edits appear.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Not found' };
  const description = extractDescription(project.body) || undefined;
  const fullTitle = formatProjectTitle(project);
  const path = projectPath(slug);
  return {
    title: fullTitle,
    description,
    alternates: alternatesFor(path),
    openGraph: {
      ...openGraphDefaults,
      type: 'article',
      url: path,
      title: fullTitle,
      description,
      publishedTime: project.publishedAt,
      modifiedTime: project._updatedAt,
      authors: [AUTHOR_NAME],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, home] = await Promise.all([getProject(slug), getHome()]);
  // Projects without a write-up have no detail page.
  if (!project?.body?.length) notFound();

  // Date · technology · reading time, skipping whichever are empty.
  const meta = [
    project.publishedAt && (
      <time key="date" dateTime={project.publishedAt}>
        {formatArticleDate(project.publishedAt)}
      </time>
    ),
    project.technologyUsed && <span key="tech">{project.technologyUsed}</span>,
    project.charCount ? <span key="time">{readingLabel(project.charCount)}</span> : null,
  ].filter(Boolean);

  return (
    <ReadingLayout home={home}>
      <JsonLd data={projectJsonLd(project, extractDescription(project.body))} />
      <header className="mb-12 sm:mb-16">
        <p className="text-sm uppercase tracking-wider opacity-70 mb-3">{project.category}</p>
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-balance">
          <span className="block leading-[1.1]">{project.clientName}</span>
          {project.subtitle && (
            <span className="block text-2xl sm:text-3xl font-medium leading-tight opacity-80 mt-3">
              {project.subtitle}
            </span>
          )}
        </h1>
        <div className="text-base opacity-70 flex flex-wrap items-center gap-x-2">
          {meta.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <span aria-hidden="true">·</span>}
              {item}
            </Fragment>
          ))}
        </div>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-6 underline underline-offset-4 decoration-1 hover:decoration-2"
          >
            Visit live site →
          </a>
        )}
      </header>

      <div>
        <PortableText value={project.body} components={portableTextComponents} />
      </div>
    </ReadingLayout>
  );
}
