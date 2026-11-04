/**
 * Event hook with no provider: nothing leaves the browser until `setAnalyticsProvider` is called.
 * To enable analytics, pick a provider, call `setAnalyticsProvider` once on load and update /privacidad.
 */

export type AnalyticsEvent = 'whatsapp_click' | 'quote_open' | 'contact_submit';

export type AnalyticsProps = {
  /** Where the event came from, e.g. "nav", "flotante" or "servicio:catalogo". */
  source?: string;
  service?: string;
};

export type AnalyticsProvider = (event: AnalyticsEvent, props: AnalyticsProps) => void;

export const TRACK_EVENT = 'bb:track';

let provider: AnalyticsProvider | undefined;

export function setAnalyticsProvider(next: AnalyticsProvider | undefined) {
  provider = next;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TRACK_EVENT, { detail: { event, props } }));
  if (import.meta.env.DEV) console.debug('[analytics]', event, props);
  try {
    provider?.(event, props);
  } catch {
    // A broken provider must never break the page.
  }
}

/** Delegated listener for `[data-track="whatsapp"]` links. `quote_open` is tracked where the quote opens. */
export function mountTracking(signal?: AbortSignal) {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest<HTMLElement>('[data-track="whatsapp"]');
      if (link) track('whatsapp_click', { source: link.dataset.trackSource });
    },
    { signal },
  );
}
