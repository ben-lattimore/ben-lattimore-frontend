import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '@/lib/sanity';
import { ProjectDetailData, HomeData } from '@/types';
import { articleComponents } from '@/components/articlePortableText';
import SiteHeader from '@/components/SiteHeader';
import { readingLabel } from '@/lib/readingTime';
import { extractDescription } from '@/lib/extractDescription';

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  clientName,
  subtitle,
  technologyUsed,
  url,
  backgroundColor,
  reverseTextColor,
  category,
  "slug": slug,
  body,
  "charCount": length(pt::text(body))
}`;

const allProjectSlugsQuery = `*[_type == "project" && defined(slug.current) && defined(body) && length(body) > 0]{ "slug": slug.current }`;

const homeQuery = `*[_type == "home"][0]`;

async function getProject(slug: string): Promise<ProjectDetailData | null> {
  return client.fetch<ProjectDetailData | null>(projectBySlugQuery, { slug });
}

async function getHome(): Promise<HomeData> {
  return client.fetch<HomeData>(homeQuery);
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(allProjectSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const project = await getProject(params.slug);
  if (!project) return { title: 'Not found' };
  const description = extractDescription(project.body);
  const fullTitle = project.subtitle
    ? `${project.clientName}: ${project.subtitle}`
    : project.clientName;
  return {
    title: `${fullTitle} — Ben Lattimore`,
    description: description || undefined,
    openGraph: {
      title: fullTitle,
      description: description || undefined,
      type: 'article',
    },
  };
}

export default async function ProjectPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const [project, home] = await Promise.all([
    getProject(params.slug),
    getHome(),
  ]);
  if (!project || !project.body || project.body.length === 0) notFound();

  const techDisplay = Array.isArray(project.technologyUsed)
    ? project.technologyUsed.join(', ')
    : project.technologyUsed;

  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full xl:w-[1600px]">
        <div className="print:hidden">
          <SiteHeader home={home} variant="article" />
        </div>

        <div className="max-w-[68ch] mx-auto px-6 sm:px-8">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex items-center text-base opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm print:hidden"
          >
            <span aria-hidden="true" className="mr-2">←</span>back
          </Link>

          <article className="pt-4 pb-24 sm:pt-6 sm:pb-32">
            <header className="mb-12 sm:mb-16">
              <p className="text-sm uppercase tracking-wider opacity-70 mb-3">
                {project.category}
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-balance">
                <span className="block leading-[1.1]">{project.clientName}</span>
                {project.subtitle && (
                  <span className="block text-2xl sm:text-3xl font-medium leading-tight opacity-80 mt-3">
                    {project.subtitle}
                  </span>
                )}
              </h1>
              <div className="text-base opacity-70 flex flex-wrap items-center gap-x-2">
                {techDisplay && <span>{techDisplay}</span>}
                {techDisplay && project.charCount ? (
                  <span aria-hidden="true">·</span>
                ) : null}
                {project.charCount ? (
                  <span>{readingLabel(project.charCount)}</span>
                ) : null}
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
              <PortableText value={project.body} components={articleComponents} />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
