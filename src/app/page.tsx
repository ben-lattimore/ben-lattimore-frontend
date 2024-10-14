import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { HomeData, ProjectData } from "@/types";
import { PortableText } from '@portabletext/react';

async function getData() {
  const homeQuery = `*[_type == "home"][0]`;
  const projectsQuery = `*[_type == "project"] | order(order asc)`;

  const home = await client.fetch<HomeData>(homeQuery);
  const projects = await client.fetch<ProjectData[]>(projectsQuery);

  return { home, projects };
}

export default async function Home() {
  const { home, projects } = await getData();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <section className="flex flex-col sm:flex-row justify-between items-start">
          <div className="max-w-2xl">
            <PortableText
              value={home.main_text}
              components={{
                block: ({ children }) => <p className="text-lg mb-4">{children}</p>,
              }}
            />
          </div>
          <div className="flex flex-col gap-2 mt-4 sm:mt-0">
            <a href={home.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {home.linkedin.text}
            </a>
            <a href={`mailto:${home.email.address}`} className="text-blue-600 hover:underline">
              {home.email.text}
            </a>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          {projects.map((project, index) => (
            <div key={project._id} className="mb-16 flex flex-col lg:flex-row">
              <div className="lg:w-1/2 pr-8">
                <h3 className="text-2xl font-semibold mb-2">{project.clientName}</h3>
                <p className="mb-4">{project.description}</p>
                <div className="mb-4">
                  <strong>Technologies:</strong> {Array.isArray(project.technologyUsed) ? project.technologyUsed.join(", ") : project.technologyUsed}
                </div>
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Project
                  </a>
                )}
              </div>
              <div className="lg:w-1/2 mt-4 lg:mt-0 hidden lg:block">
                {project.images && project.images.length > 0 && (
                  <Image
                    src={urlFor(project.images[0]).url()}
                    alt={`${project.clientName} project`}
                    width={500}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
