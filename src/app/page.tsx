'use client'

import { useState, useEffect } from 'react';
import { client } from "@/lib/sanity";
import { HomeData, ProjectData } from "@/types";
import { PortableText } from '@portabletext/react';
import ProjectCard from '@/components/ProjectCard';
import { getTextColorClass } from '@/utils/colorUtils';

// Add this line after the import
console.log('getTextColorClass:', getTextColorClass);

async function getData() {
  const homeQuery = `*[_type == "home"][0]`;
  const projectsQuery = `*[_type == "project"] | order(category asc, order asc) {
    _id,
    clientName,
    description,
    technologyUsed,
    url,
    backgroundColor,
    reverseTextColor,
    category
  }`;

  const home = await client.fetch<HomeData>(homeQuery);
  const projects = await client.fetch<ProjectData[]>(projectsQuery);

  return { home, projects };
}

export default function Home() {
  const [data, setData] = useState<{ home: HomeData; projects: ProjectData[] } | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [reverseTextColor, setReverseTextColor] = useState<boolean>(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<'AI' | 'Web Development'>('AI');

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { home, projects } = data;

  // Filter projects by category
  const aiProjects = projects.filter(project => project.category === 'AI');
  const webProjects = projects.filter(project => project.category === 'Web Development');

  // Get projects to display on mobile based on active tab
  const mobileProjects = activeMobileCategory === 'AI' ? aiProjects : webProjects;

  return (
    <main className="min-h-screen flex justify-center transition-all duration-300" style={{ backgroundColor: backgroundColor || 'initial' }}>
      <div className={`w-full xl:w-[1600px] mx-auto transition-all duration-300 ${getTextColorClass(reverseTextColor)}`}>
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
        
        <div className="p-8 pb-20 sm:p-20">
          {/* Mobile Tab Interface */}
          <div className="block md:hidden mb-8">
            <div className="flex border-b border-gray-300">
              <button
                onClick={() => setActiveMobileCategory('AI')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeMobileCategory === 'AI'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Projects
              </button>
              <button
                onClick={() => setActiveMobileCategory('Web Development')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeMobileCategory === 'Web Development'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Web Development
              </button>
            </div>
          </div>

          {/* Mobile Projects Display */}
          <section className="block md:hidden">
            {mobileProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onHover={(bgColor, reverse) => {
                  setBackgroundColor(bgColor);
                  setReverseTextColor(reverse);
                }}
              />
            ))}
          </section>

          {/* Desktop Two-Column Layout */}
          <div className="hidden md:flex md:gap-x-12">
            {/* AI Projects Column */}
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold mb-8">AI Projects</h2>
              <section>
                {aiProjects.map((project) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    onHover={(bgColor, reverse) => {
                      setBackgroundColor(bgColor);
                      setReverseTextColor(reverse);
                    }}
                  />
                ))}
              </section>
            </div>

            {/* Web Development Projects Column */}
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold mb-8">Web Development</h2>
              <section>
                {webProjects.map((project) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    onHover={(bgColor, reverse) => {
                      setBackgroundColor(bgColor);
                      setReverseTextColor(reverse);
                    }}
                  />
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
