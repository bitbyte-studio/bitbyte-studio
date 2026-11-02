/**
 * Runs `init` for every element matching `selector` and re-runs it on
 * `astro:page-load`. Everything registered with the provided signal (event
 * listeners, `signal.addEventListener('abort', cleanup)`) is torn down before
 * the next run, so listeners never pile up.
 */
export function mountAll(
  selector: string,
  init: (element: HTMLElement, signal: AbortSignal) => void,
) {
  let controller: AbortController | undefined;

  const boot = () => {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => init(element, signal));
  };

  boot();
  document.addEventListener('astro:page-load', boot);
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
