/**
 * scrollToSection
 *
 * Smoothly scrolls to a hash-identified section, retrying up to `maxAttempts`
 * times at 100 ms intervals to handle lazy-loaded sections that may not yet be
 * in the DOM when the user clicks. Updates the browser URL bar on success.
 *
 * @param href  Hash string, e.g. "#contact"
 */
export function scrollToSection(href: string): void {
  const MAX_ATTEMPTS = 15;
  const INTERVAL_MS  = 100;

  const tryScroll = (): boolean => {
    const el = document.querySelector(href);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
    return true;
  };

  if (tryScroll()) return;

  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (tryScroll() || attempts >= MAX_ATTEMPTS) {
      clearInterval(timer);
    }
  }, INTERVAL_MS);
}

