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
  projectUrl?: string;
  projectImages?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  }[];
}
