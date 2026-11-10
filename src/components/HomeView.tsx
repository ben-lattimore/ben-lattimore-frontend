'use client'

import { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ArticleCard from '@/components/ArticleCard';
import SiteHeader from '@/components/SiteHeader';
import { AUTHOR_NAME, SITE_NAME } from '@/lib/site';
import type { ArticleListItem, HomeData, ProjectData } from '@/types';

type Column = 'AI' | 'Web Development' | 'Writing';

const COLUMNS: { key: Column; title: string }[] = [
  { key: 'AI', title: 'AI Projects' },
  { key: 'Web Development', title: 'Web Development' },
  { key: 'Writing', title: 'Writing' },
];

// The interactive part of the home page. Content arrives as props from the
// server-rendered page; the only browser state is the hovered project (which
// tints the page) and the active mobile tab.
export default function HomeView({
  home,
  projects,
  articles,
}: {
  home: HomeData;
  projects: ProjectData[];
  articles: ArticleListItem[];
}) {
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [activeMobileColumn, setActiveMobileColumn] = useState<Column>('AI');

  const renderColumn = (column: Column) =>
    column === 'Writing'
      ? articles.map((article) => <ArticleCard key={article._id} article={article} />)
      : projects
          .filter((project) => project.category === column)
          .map((project) => (
            <ProjectCard key={project._id} project={project} onHover={setHoveredProject} />
          ));

  const textColorClass = hoveredProject?.reverseTextColor
    ? 'text-brand-pale-grey'
    : 'text-brand-off-black';

  return (
    <main
      className="min-h-screen flex justify-center transition-all duration-300"
      style={{ backgroundColor: hoveredProject?.backgroundColor || 'initial' }}
    >
      <div className={`w-full xl:w-[1600px] mx-auto transition-all duration-300 ${textColorClass}`}>
        <h1 className="sr-only">{`${AUTHOR_NAME} — ${SITE_NAME}`}</h1>
        <SiteHeader home={home} />

        <div className="p-8 pb-20 sm:p-20">
          {/* Mobile: tabs */}
          <div className="block md:hidden mb-8">
            <div className="flex border-b border-gray-300" role="tablist" aria-label="Work categories">
              {COLUMNS.map(({ key, title }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeMobileColumn === key}
                  onClick={() => setActiveMobileColumn(key)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeMobileColumn === key
                      ? 'border-b-2 border-current'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          <section className="block md:hidden">{renderColumn(activeMobileColumn)}</section>

          {/* Desktop: three columns */}
          <div className="hidden md:flex md:gap-x-12">
            {COLUMNS.map(({ key, title }) => (
              <div key={key} className="w-1/3">
                <h2 className="text-2xl font-semibold mb-8">{title}</h2>
                <section>{renderColumn(key)}</section>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
