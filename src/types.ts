import type { ProjectServiceId } from './config/pricing';

export interface Project {
  id: string;
  /** Quotable service from config/pricing.ts that "Cotizar Proyecto Similar" preselects (never maintenance). */
  serviceId: ProjectServiceId;
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
