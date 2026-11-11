import type { PortableTextBlock } from '@portabletext/types';

// Shapes returned by the queries in src/lib/queries.ts.

export interface HomeData {
  _updatedAt: string;
  main_text: PortableTextBlock[];
  linkedin: {
    text: string;
    url: string;
  };
  email: {
    text: string;
    address: string;
  };
  // "Search & AI profile" fieldset: structured data and llms.txt only.
  jobTitle?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export type ProjectCategory = 'AI' | 'Web Development';

interface ProjectBase {
  _id: string;
  _updatedAt: string;
  clientName: string;
  technologyUsed?: string;
  url?: string;
  backgroundColor?: string;
  reverseTextColor?: boolean;
  category: ProjectCategory;
}

export interface ProjectData extends ProjectBase {
  slug?: string;
  hasBody: boolean;
}

export interface ProjectDetailData extends ProjectBase {
  slug: string;
  subtitle?: string;
  publishedAt?: string;
  body?: PortableTextBlock[];
  charCount?: number;
}

export interface ArticleListItem {
  _id: string;
  _updatedAt: string;
  title: string;
  subtitle?: string;
  slug: string;
  publishedAt: string;
  charCount?: number;
}

export interface ArticleData extends ArticleListItem {
  body: PortableTextBlock[];
  showDownloads?: boolean;
}
