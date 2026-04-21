'use client'

import { useState, useEffect } from 'react';
import { client } from "@/lib/sanity";
import { HomeData, ProjectData, ArticleListItem } from "@/types";
import ProjectCard from '@/components/ProjectCard';
import ArticleCard from '@/components/ArticleCard';
import SiteHeader from '@/components/SiteHeader';
import { getTextColorClass } from '@/utils/colorUtils';

type MobileCategory = 'AI' | 'Web Development' | 'Writing';

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
  const articlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug,
    publishedAt,
    "charCount": length(pt::text(body))
  }`;

  const [home, projects, articles] = await Promise.all([
    client.fetch<HomeData>(homeQuery),
    client.fetch<ProjectData[]>(projectsQuery),
    client.fetch<ArticleListItem[]>(articlesQuery),
  ]);

  return { home, projects, articles };
}

export default function Home() {
  const [data, setData] = useState<{ home: HomeData; projects: ProjectData[]; articles: ArticleListItem[] } | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [reverseTextColor, setReverseTextColor] = useState<boolean>(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<MobileCategory>('AI');

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { home, projects, articles } = data;

  // Filter projects by category
  const aiProjects = projects.filter(project => project.category === 'AI');
  const webProjects = projects.filter(project => project.category === 'Web Development');

  return (
    <main className="min-h-screen flex justify-center transition-all duration-300" style={{ backgroundColor: backgroundColor || 'initial' }}>
      <div className={`w-full xl:w-[1600px] mx-auto transition-all duration-300 ${getTextColorClass(reverseTextColor)}`}>
        <SiteHeader home={home} />

        <div className="p-8 pb-20 sm:p-20">
          {/* Mobile Tab Interface */}
          <div className="block md:hidden mb-8">
            <div className="flex border-b border-gray-300" role="tablist" aria-label="Work categories">
              {(['AI', 'Web Development', 'Writing'] as const).map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeMobileCategory === cat}
                  onClick={() => setActiveMobileCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeMobileCategory === cat
                      ? 'border-b-2 border-current'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {cat === 'AI' ? 'AI Projects' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Display */}
          <section className="block md:hidden">
            {activeMobileCategory === 'Writing'
              ? articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              : (activeMobileCategory === 'AI' ? aiProjects : webProjects).map((project) => (
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

          {/* Desktop Three-Column Layout */}
          <div className="hidden md:flex md:gap-x-12">
            {/* AI Projects Column */}
            <div className="w-1/3">
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
            <div className="w-1/3">
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

            {/* Writing Column */}
            <div className="w-1/3">
              <h2 className="text-2xl font-semibold mb-8">Writing</h2>
              <section>
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
