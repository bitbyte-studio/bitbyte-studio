import { prefersReducedMotion } from './lifecycle';

const DURATION_MS = 780;
const HEADER_GAP = 12;

let rafId = 0;

function easeOutQuint(t: number) {
  return 1 - (1 - t) ** 5;
}

function headerOffset() {
  const header = document.querySelector<HTMLElement>('[data-navbar]');
  return (header?.offsetHeight ?? 80) + HEADER_GAP;
}

/** Smoothly scrolls to an element, accounting for the sticky header. */
export function smoothScrollTo(el: HTMLElement) {
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset());

  if (prefersReducedMotion()) {
    window.scrollTo(0, target);
    return;
  }

  const start = window.scrollY;
  const delta = target - start;
  if (Math.abs(delta) < 2) return;

  window.cancelAnimationFrame(rafId);
  const startedAt = performance.now();

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / DURATION_MS);
    window.scrollTo(0, start + delta * easeOutQuint(progress));
    if (progress < 1) rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);
}

/**
 * Intercepts same-page hash links so navigation feels smooth instead of a hard jump.
 * External links, new tabs and plain "#" are left alone.
 */
export function mountSmoothScroll(signal?: AbortSignal) {
  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target === '_blank') return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const id = decodeURIComponent(href.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      smoothScrollTo(target);

      if (history.replaceState) {
        history.replaceState(null, '', href);
      } else {
        location.hash = href;
      }
    },
    { signal },
  );
}
