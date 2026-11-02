export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  image: string;
  category: 'web' | 'ecommerce' | 'interactive' | 'automation';
  metrics?: {
    label: string;
    value: string;
  }[];
  client?: string;
  liveUrl?: string;
  year?: string;
}

export interface TechItem {
  name: string;
  category: string;
  description: string;
}
