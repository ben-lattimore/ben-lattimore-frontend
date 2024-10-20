'use client'

import { useState, useEffect } from 'react';
import { client } from "@/lib/sanity";
import { HomeData, ProjectData, ImageAsset } from "@/types";
import { PortableText } from '@portabletext/react';
import ProjectCard from '@/components/ProjectCard';
import ImageCarousel from '@/components/ImageCarousel';
import { getTextColorClass } from '@/utils/colorUtils';

// Add this line after the import
console.log('getTextColorClass:', getTextColorClass);

async function getData() {
  const homeQuery = `*[_type == "home"][0]`;
  const projectsQuery = `*[_type == "project"] | order(order asc) {
    _id,
    clientName,
    description,
    technologyUsed,
    url,
    projectImages,
    backgroundColor,
    reverseTextColor
  }`;

  const home = await client.fetch<HomeData>(homeQuery);
  const projects = await client.fetch<ProjectData[]>(projectsQuery);

  return { home, projects };
}

export default function Home() {
  const [data, setData] = useState<{ home: HomeData; projects: ProjectData[] } | null>(null);
  const [hoveredImages, setHoveredImages] = useState<ImageAsset[] | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [reverseTextColor, setReverseTextColor] = useState<boolean>(false);

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { home, projects } = data;

  return (
    <main className="min-h-screen flex justify-center transition-all duration-300" style={{ backgroundColor: backgroundColor || 'initial' }}>
      <div className={`w-full xl:w-[1280px] mx-auto transition-all duration-300 ${getTextColorClass(reverseTextColor)}`}>
        <section className="flex flex-col sm:flex-row justify-between items-start xl:w-full p-8 pb-20 sm:p-20 ">
          <div className='xl:w-7/12'>
            <PortableText
              value={home.main_text}
              components={{
                block: ({ children }) => <p className="text-xl mb-4">{children}</p>,
              }}
            />
          </div>
          <div className="flex flex-row justify-end gap-x-2 mt-4 sm:mt-0">
            <a href={home.linkedin.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-1 underline-offset-4">
              {home.linkedin.text}
            </a>
            <a href={`mailto:${home.email.address}`} className="hover:underline decoration-1 underline-offset-4 ml-2">
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
                onHover={(images, bgColor, reverse) => {
                  setHoveredImages(images);
                  setBackgroundColor(bgColor);
                  setReverseTextColor(reverse);
                }}
              />
            ))}
          </section>

          <div className="hidden sm:block sm:w-1/2 relative fixed -top-36 h-[600px]">
            <ImageCarousel images={hoveredImages} />
          </div>          
        </div>
      </div>
    </main>
  );
}
