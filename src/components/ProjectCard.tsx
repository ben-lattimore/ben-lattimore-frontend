'use client'

import Link from 'next/link';
import type { ProjectData } from '@/types';
import { projectPath } from '@/lib/site';

export default function ProjectCard({
  project,
  onHover,
}: {
  project: ProjectData;
  onHover: (project: ProjectData | null) => void;
}) {
  // Projects with a write-up link to their detail page; otherwise to the live
  // site. A project with neither renders as plain text rather than a dead link.
  const internalHref = project.hasBody && project.slug ? projectPath(project.slug) : null;
  const href = internalHref ?? project.url;

  const content = (
    <div className="transition-transform duration-300 ease-[ease-in-out] group-hover:translate-x-10">
      <h3 className="text-xl font-semibold inline-block mr-16">{project.clientName}</h3>
      <span className="text-base block">{project.technologyUsed}</span>
    </div>
  );

  return (
    <div
      className="group pb-16 relative"
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
    >
      {href ? (
        <Link
          href={href}
          {...(internalHref ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          className="inline-block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm"
        >
          {content}
        </Link>
      ) : (
        <div className="inline-block w-full overflow-hidden">{content}</div>
      )}
    </div>
  );
}
