'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProjectData } from '@/types';

export default function ProjectCard({ 
  project, 
  onHover 
}: { 
  project: ProjectData; 
  onHover: (images: any[] | null, backgroundColor: string | null, reverseTextColor: boolean) => void;
}) {
  return (
    <motion.div 
      className="pb-16 relative"
      onMouseEnter={() => onHover(project.projectImages, project.backgroundColor, project.reverseTextColor || false)}
      onMouseLeave={() => onHover(null, null, false)}
      whileHover={{ x: 40 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block"
      >
        <h3 className="text-xl font-semibold inline-block mr-16">
          {project.clientName}
        </h3>
        <span className="text-base block">
          {Array.isArray(project.technologyUsed) ? project.technologyUsed.join(", ") : project.technologyUsed}
        </span>
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
    </motion.div>
  );
}
