import type { Project } from '../types';

export const OPEN_PROJECT_EVENT = 'bb:open-project';

export type OpenProjectDetail = {
  /** Only what the modal needs, so the client bundle never imports the project data (and its images). */
  project: Pick<Project, 'id' | 'title'>;
};

export function openProject(project: OpenProjectDetail['project']) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<OpenProjectDetail>(OPEN_PROJECT_EVENT, {
      detail: { project },
    }),
  );
}

/** Prefill the contact form after "Quiero algo parecido" from a project modal. */
export const PREFILL_CONTACT_EVENT = 'bb:prefill-contact';

export type PrefillContactDetail = {
  /** Matches a `data-value` in the contact service select (service display name). */
  service?: string;
  message: string;
  project?: string;
};

export function prefillContact(detail: PrefillContactDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<PrefillContactDetail>(PREFILL_CONTACT_EVENT, {
      detail,
    }),
  );
}
