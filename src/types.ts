import type { ImageMetadata } from 'astro';
import type { ProjectServiceId } from './config/pricing';

export interface ProjectImages {
  /** Portfolio card image (3:2). */
  card: ImageMetadata;
  /** Wide image shown in the project modal. */
  modal: ImageMetadata;
}

export interface Project {
  id: string;
  /** Related project service from config/pricing.ts (never maintenance). */
  serviceId: ProjectServiceId;
  title: string;
  /** Free-text label shown on the card, e.g. "Restaurante". */
  category: string;
  description: string;
  features: readonly string[];
  image: ProjectImages;
  /** Public demo of the project. */
  liveUrl: string;
  /** These are Bit & Byte demos, not client work. */
  badge: 'Demo';
}
