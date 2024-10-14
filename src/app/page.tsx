'use client'

import { useState } from 'react';
import Link from "next/link";
import { client } from "@/lib/sanity";
import { HomeData, ProjectData } from "@/types";
import { PortableText } from '@portabletext/react';
import ProjectCard from '@/components/ProjectCard';
import ImageCarousel from '@/components/ImageCarousel';

async function getData() {
  const homeQuery = `*[_type == "home"][0]`;
  const projectsQuery = `*[_type == "project"] | order(order asc) {
    _id,
    clientName,
    description,
    technologyUsed,
    projectUrl,
    projectImages
  }`;

  const home = await client.fetch<HomeData>(homeQuery);
  const projects = await client.fetch<ProjectData[]>(projectsQuery);

  return { home, projects };
}

export default function Home() {
  const [data, setData] = useState<{ home: HomeData; projects: ProjectData[] } | null>(null);
  const [hoveredImages, setHoveredImages] = useState<any[] | null>(null);

  useState(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { home, projects } = data;

  return (
    <main className="min-h-screen p-8 pb-20 sm:p-20 flex flex-col gap-16">
      <section className="flex flex-col sm:flex-row justify-between items-start">
        <div className="max-w-2xl">
          <PortableText
            value={home.main_text}
            components={{
              block: ({ children }) => <p className="text-lg mb-4">{children}</p>,
            }}
          />
        </div>
        <div className="flex flex-row justify-end gap-x-2 mt-4 sm:mt-0">
          <a href={home.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-brand-off-black hover:text-brand-off-black underline decoration-1 underline-offset-4">
            {home.linkedin.text}
          </a>
          <span className="mx-1"></span>
          <a href={`mailto:${home.email.address}`} className="text-brand-off-black hover:text-brand-off-black underline decoration-1 underline-offset-4">
            {home.email.text}
          </a>
        </div>
      </section>

      <section className="mt-16">
        {projects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            onHover={(images) => setHoveredImages(images)}
          />
        ))}
      </section>

      <ImageCarousel images={hoveredImages} />
    </main>
  );
}
