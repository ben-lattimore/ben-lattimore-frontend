'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/types';

export default function ProjectCard({
  project,
  onHover
}: {
  project: ProjectData;
  onHover: (backgroundColor: string | null, reverseTextColor: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(project.backgroundColor, project.reverseTextColor || false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null, false);
  };

  const internalHref = project.hasBody && project.slug ? `/projects/${project.slug}` : null;
  const externalHref = !internalHref && project.url ? project.url : null;
  const href = internalHref ?? externalHref ?? '#';
  const isInternal = Boolean(internalHref);

  return (
    <div
      className="pb-16 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        className="inline-block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 rounded-sm"
      >
        <div
          style={{
            transform: isHovered ? 'translateX(40px)' : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <h3 className="text-xl font-semibold inline-block mr-16">
            {project.clientName}
          </h3>
          <span className="text-base block">
            {Array.isArray(project.technologyUsed) ? project.technologyUsed.join(", ") : project.technologyUsed}
          </span>
        </div>
      </Link>
    </div>
  );
}
