'use client'

import { useState, useEffect } from 'react';
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
    url,
    projectImages
  }`;

  const home = await client.fetch<HomeData>(homeQuery);
  const projects = await client.fetch<ProjectData[]>(projectsQuery);

  return { home, projects };
}

export default function Home() {
  const [data, setData] = useState<{ home: HomeData; projects: ProjectData[] } | null>(null);
  const [hoveredImages, setHoveredImages] = useState<any[] | null>([]);

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { home, projects } = data;

  return (
    <main className="min-h-screen flex justify-center">
      <div className="w-full xl:w-[1280px] mx-auto">
          <section className="flex flex-col sm:flex-row justify-between items-start xl:w-full p-8 pb-20 sm:p-20 ">
            <div className='xl:w-7/12'>
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
              <a href={`mailto:${home.email.address}`} className="text-brand-off-black hover:text-brand-off-black underline decoration-1 underline-offset-4 ml-2">
                {home.email.text}
              </a>
            </div>
          </section>
        
        <div className="p-8 pb-20 sm:p-20 flex flex-col sm:flex-row gap-16">
          <section className="sm:w-1/2">
            {projects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onHover={(images) => setHoveredImages(images || [])}
              />
            ))}
          </section>

          <div className="sm:w-1/2 relative fixed -top-36 h-[600px]">
            <ImageCarousel images={hoveredImages} />
          </div>          
        </div>
      </div>
    </main>
  );
}
