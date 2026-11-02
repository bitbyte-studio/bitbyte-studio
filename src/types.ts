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

export interface ServiceItem {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  longDescription: string;
  deliverables: string[];
  technologies: string[];
  useCase: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface TechItem {
  name: string;
  category: string;
  description: string;
}
