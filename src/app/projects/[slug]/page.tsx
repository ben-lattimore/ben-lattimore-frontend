import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/components/portableTextComponents';
import ReadingLayout from '@/components/ReadingLayout';
import { getHome, getProject, getProjectSlugs } from '@/lib/queries';
import { readingLabel } from '@/lib/readingTime';
import { extractDescription } from '@/lib/extractDescription';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Not found' };
  const description = extractDescription(project.body) || undefined;
  const fullTitle = project.subtitle
    ? `${project.clientName}: ${project.subtitle}`
    : project.clientName;
  return {
    title: `${fullTitle} — Ben Lattimore`,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, home] = await Promise.all([getProject(slug), getHome()]);
  // Projects without a write-up have no detail page.
  if (!project?.body?.length) notFound();

  const tech = project.technologyUsed;

  return (
    <ReadingLayout home={home}>
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
          {tech && <span>{tech}</span>}
          {tech && project.charCount ? <span aria-hidden="true">·</span> : null}
          {project.charCount ? <span>{readingLabel(project.charCount)}</span> : null}
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
