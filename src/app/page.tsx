import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { HomeData, ProjectData } from "@/types";
import { PortableText } from '@portabletext/react';

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

export default async function Home() {
  const { home, projects } = await getData();

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
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        {projects.map((project) => (
          <div key={project._id} className="mb-16 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 pr-8">
              <h3 className="text-2xl font-semibold mb-2">{project.clientName}</h3>
              <p className="mb-4">{project.description}</p>
              <div className="mb-4">
                <strong>Technologies:</strong> {Array.isArray(project.technologyUsed) ? project.technologyUsed.join(", ") : project.technologyUsed}
              </div>
              {project.projectUrl && (
                <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-brand-off-black hover:underline">
                  View Project
                </Link>
              )}
            </div>
            <div className="lg:w-1/2 mt-4 lg:mt-0">
              {project.projectImages && project.projectImages.length > 0 && (
                <div className="flex overflow-x-auto gap-4">
                  {project.projectImages.map((image, imageIndex) => (
                    <Image
                      key={imageIndex}
                      src={urlFor(image).width(500).height(300).url()}
                      alt={`${project.clientName} project image ${imageIndex + 1}`}
                      width={500}
                      height={300}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
