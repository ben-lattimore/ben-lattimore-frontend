export interface HomeData {
  name: string;
  main_text: any[]; // Assuming 'array' of 'block' type from Sanity translates to any[] in TypeScript
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
    images?: any[]; // You might want to define a more specific type for images
  }