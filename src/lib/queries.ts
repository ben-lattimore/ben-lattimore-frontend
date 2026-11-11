import { client } from '@/lib/sanity';
import type {
  ArticleData,
  ArticleListItem,
  HomeData,
  ProjectData,
  ProjectDetailData,
} from '@/types';

// Every GROQ query the site runs lives here. When a schema in
// sanity/schemaTypes changes, update the projections below and the matching
// types in src/types. Slugs are always projected to plain strings.

const charCount = `"charCount": length(pt::text(body))`;

const homeQuery = `*[_type == "home"][0]`;

const projectListQuery = `*[_type == "project"] | order(category asc, clientName asc) {
  _id,
  _updatedAt,
  clientName,
  technologyUsed,
  url,
  backgroundColor,
  reverseTextColor,
  category,
  "slug": slug.current,
  "hasBody": defined(body) && length(body) > 0
}`;

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  clientName,
  subtitle,
  publishedAt,
  technologyUsed,
  url,
  backgroundColor,
  reverseTextColor,
  category,
  "slug": slug.current,
  body,
  ${charCount}
}`;

// Only projects with a body get a detail page.
const projectSlugsQuery = `*[_type == "project" && defined(slug.current) && defined(body) && length(body) > 0].slug.current`;

const articleFields = `
  _id,
  _updatedAt,
  title,
  subtitle,
  "slug": slug.current,
  publishedAt,
  ${charCount}`;

const articleListQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {${articleFields}
}`;

// Full articles, newest first: for the RSS feed and llms.txt.
const articlesWithBodyQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {${articleFields},
  showDownloads,
  body
}`;

const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{${articleFields},
  showDownloads,
  body
}`;

const articleSlugsQuery = `*[_type == "article" && defined(slug.current)].slug.current`;

export const getHome = () => client.fetch<HomeData>(homeQuery);

export const getProjects = () => client.fetch<ProjectData[]>(projectListQuery);
export const getProject = (slug: string) =>
  client.fetch<ProjectDetailData | null>(projectBySlugQuery, { slug });
export const getProjectSlugs = () => client.fetch<string[]>(projectSlugsQuery);

export const getArticles = () => client.fetch<ArticleListItem[]>(articleListQuery);
export const getArticlesWithBody = () => client.fetch<ArticleData[]>(articlesWithBodyQuery);
export const getArticle = (slug: string) =>
  client.fetch<ArticleData | null>(articleBySlugQuery, { slug });
export const getArticleSlugs = () => client.fetch<string[]>(articleSlugsQuery);
