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

export interface ImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface ProjectData {
  _id: string;
  clientName: string;
  description: string;
  technologyUsed: string[];
  url?: string;
  backgroundColor: string;
  projectImages?: ImageAsset[]; // Updated to use ImageAsset
  reverseTextColor?: boolean;
}