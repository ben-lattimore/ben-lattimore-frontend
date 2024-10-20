'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/types';
import { ImageAsset } from '@/types';

export default function ProjectCard({ 
  project, 
  onHover 
}: { 
  project: ProjectData; 
  onHover: (images: ImageAsset[] | null, backgroundColor: string | null, reverseTextColor: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(project.projectImages ?? null, project.backgroundColor, project.reverseTextColor || false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null, null, false);
  };

  return (
    <div 
      className="pb-16 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        href={project.url ?? '#'} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block w-full overflow-hidden"
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
      {project.url && (
        <Link 
          href={project.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 z-10 cursor-pointer"
        >
          <span className="sr-only">View Project</span>
        </Link>
      )}
    </div>
  );
}
