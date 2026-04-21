import { PortableTextBlock } from '@portabletext/types'

export interface HomeData {
  name: string;
  main_text: PortableTextBlock[]; // Use PortableTextBlock instead of any
  linkedin: {
    text: string;
    url: string;
  };
  email: {
    text: string;
    address: string;
  };
}

export interface ProjectData {
  _id: string;
  clientName: string;
  description: string;
  technologyUsed: string[];
  url?: string;
  backgroundColor: string;
  reverseTextColor?: boolean;
  category: 'AI' | 'Web Development';
}

export interface ArticleListItem {
  _id: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  publishedAt: string;
  charCount?: number;
}

export interface ArticleData extends ArticleListItem {
  body: PortableTextBlock[];
  showDownloads?: boolean;
}
