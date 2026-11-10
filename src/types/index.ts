import type { PortableTextBlock } from '@portabletext/types';

// Shapes returned by the queries in src/lib/queries.ts.

export interface HomeData {
  main_text: PortableTextBlock[];
  linkedin: {
    text: string;
    url: string;
  };
  email: {
    text: string;
    address: string;
  };
}

export type ProjectCategory = 'AI' | 'Web Development';

interface ProjectBase {
  _id: string;
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
  body?: PortableTextBlock[];
  charCount?: number;
}

export interface ArticleListItem {
  _id: string;
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
