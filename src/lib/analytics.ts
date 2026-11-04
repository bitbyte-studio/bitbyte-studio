/**
 * Every event goes through `track()`. It reaches Umami (loaded only in production, see BaseLayout) and is also
 * re-emitted as a `bb:track` browser event. If the Umami script is missing (dev, ad blocker) nothing happens.
 */

export type AnalyticsEvent =
  | 'whatsapp_click'
  | 'quote_open'
  | 'contact_submit'
  | 'project_open'
  | 'project_demo_click'
  | 'project_quote_similar';

export type AnalyticsProps = {
  /** Where the event came from, e.g. "nav", "flotante" or "servicio:catalogo". */
  source?: string;
  service?: string;
  project?: string;
};

type UmamiWindow = Window & {
  umami?: { track?: (event: string, data?: Record<string, string>) => void };
};

export const TRACK_EVENT = 'bb:track';

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TRACK_EVENT, { detail: { event, props } }));
  if (import.meta.env.DEV) console.debug('[analytics]', event, props);

  // Umami only accepts defined values.
  const data = Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Record<
    string,
    string
  >;
  try {
    (window as UmamiWindow).umami?.track?.(event, data);
  } catch {
    // Analytics must never break the page.
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
