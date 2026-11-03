import type { Project } from '../types';

export const OPEN_QUOTE_EVENT = 'bb:open-quote';
export const OPEN_PROJECT_EVENT = 'bb:open-project';

export type OpenQuoteDetail = {
  service?: string;
};

export type OpenProjectDetail = {
  /** Only what the modal needs, so the client bundle never imports the project data (and its images). */
  project: Pick<Project, 'id' | 'title'>;
};

export function openQuote(service?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<OpenQuoteDetail>(OPEN_QUOTE_EVENT, {
      detail: { service },
    }),
  );
}

export function openProject(project: OpenProjectDetail['project']) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<OpenProjectDetail>(OPEN_PROJECT_EVENT, {
      detail: { project },
    }),
  );
}
