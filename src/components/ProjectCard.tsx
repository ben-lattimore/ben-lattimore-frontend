'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProjectData } from '@/types';

export default function ProjectCard({ 
  project, 
  onHover 
}: { 
  project: ProjectData; 
  onHover: (images: any[] | null) => void;
}) {
  return (
    <motion.div 
      className="mb-16 relative"
      onMouseEnter={() => onHover(project.projectImages)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ x: 40 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block"
      >
        <h3 className="text-2xl font-semibold inline-block mr-16">
          {project.clientName}
        </h3>
        <span className="text-lg block">
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
