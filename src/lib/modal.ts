const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function setVisible(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.classList.toggle('hidden', !visible);
  el.hidden = !visible;
}

type ModalOptions = {
  /** Selector (inside the modal) that receives focus on open. */
  initialFocus?: string;
};

/**
 * Accessible modal behaviour: scroll lock, focus trap, Escape, backdrop click
 * and focus restoration. The dialog panel must carry role="dialog" and tabindex="-1".
 */
export function createModal(root: HTMLElement, signal: AbortSignal, options: ModalOptions = {}) {
  let lastFocused: HTMLElement | null = null;
  let pressedOnBackdrop = false;

  const isOpen = () => !root.hidden;

  const focusables = () =>
    Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );

  const open = () => {
    if (isOpen()) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setVisible(root, true);
    document.body.style.overflow = 'hidden';

    const panel = root.querySelector<HTMLElement>('[role="dialog"]');
    const target =
      (options.initialFocus && root.querySelector<HTMLElement>(options.initialFocus)) ||
      focusables()[0] ||
      panel;
    target?.focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen()) return;
    setVisible(root, false);
    document.body.style.overflow = '';
    if (lastFocused?.isConnected) lastFocused.focus({ preventScroll: true });
    lastFocused = null;
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
      if (!isOpen()) return;

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
    if (isOpen()) document.body.style.overflow = '';
  });

  return { open, close, isOpen };
}
