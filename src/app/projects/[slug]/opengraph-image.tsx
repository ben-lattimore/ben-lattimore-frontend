import { getProject } from '@/lib/queries';
import { ogContentType, ogSize, renderOgCard } from '@/lib/ogImage';
import { AUTHOR_NAME } from '@/lib/site';

export const alt = `Project by ${AUTHOR_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

// Projects use their own hover colour, so the card matches the home page tint.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  return renderOgCard({
    eyebrow: project?.category === 'AI' ? 'AI project' : 'Web development project',
    title: project?.clientName ?? 'Project',
    subtitle: project?.subtitle,
    footer: [AUTHOR_NAME, project?.technologyUsed].filter(Boolean).join(' · '),
    background: project?.backgroundColor,
    reverseText: project?.reverseTextColor,
  });
}
