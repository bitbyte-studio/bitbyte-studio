const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Must cover the longest close transition in `.modal-shell` (panel transform). */
const CLOSE_MS = 300;

export function setVisible(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.classList.toggle('hidden', !visible);
  el.hidden = !visible;
}

type ModalOptions = {
  /** Selector (inside the modal) that receives focus on open. */
  initialFocus?: string;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Accessible modal behaviour: scroll lock, focus trap, Escape, backdrop click
 * and focus restoration. The dialog panel must carry role="dialog" and tabindex="-1".
 * Open/close uses a short opacity + scale transition unless reduced motion is on.
 */
export function createModal(root: HTMLElement, signal: AbortSignal, options: ModalOptions = {}) {
  let lastFocused: HTMLElement | null = null;
  let pressedOnBackdrop = false;
  let openState = false;
  let closing = false;
  let closeTimer = 0;

  const panel = () => root.querySelector<HTMLElement>('[role="dialog"]');

  const isOpen = () => openState;

  const focusables = () =>
    Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );

  const open = () => {
    if (openState || closing) return;
    openState = true;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setVisible(root, true);
    document.body.style.overflow = 'hidden';

    const focusTarget =
      (options.initialFocus && root.querySelector<HTMLElement>(options.initialFocus)) ||
      focusables()[0] ||
      panel();

    if (prefersReducedMotion()) {
      root.classList.add('is-open');
      focusTarget?.focus({ preventScroll: true });
      return;
    }

    root.classList.remove('is-open');
    // Two frames so the browser paints the closed state before transitioning in.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!openState) return;
        root.classList.add('is-open');
        focusTarget?.focus({ preventScroll: true });
      });
    });
  };

  const finishClose = () => {
    window.clearTimeout(closeTimer);
    setVisible(root, false);
    root.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused?.isConnected) lastFocused.focus({ preventScroll: true });
    lastFocused = null;
    closing = false;
  };

  const close = () => {
    if (!openState || closing) return;
    openState = false;
    closing = true;
    root.classList.remove('is-open');

    if (prefersReducedMotion()) {
      finishClose();
      return;
    }

    closeTimer = window.setTimeout(finishClose, CLOSE_MS + 40);
  };

  root.addEventListener('mousedown', (event) => (pressedOnBackdrop = event.target === root), { signal });
  root.addEventListener(
    'click',
    (event) => {
      if (event.target === root && pressedOnBackdrop) close();
      pressedOnBackdrop = false;
    },
    { signal },
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (!openState) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    },
    { signal },
  );

  signal.addEventListener('abort', () => {
    window.clearTimeout(closeTimer);
    if (openState || closing) document.body.style.overflow = '';
  });

  return { open, close, isOpen };
}
