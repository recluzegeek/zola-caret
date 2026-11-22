/* theme-toggle.js — light / dark / system, applied before paint in base.html */
const KEY = 'caret.theme';
const ORDER = ['light', 'dark', 'system'];

function stored() {
  try {
    const value = localStorage.getItem(KEY);
    return ORDER.includes(value) ? value : 'system';
  } catch (e) {
    return 'system';
  }
}

function resolve(state) {
  if (state !== 'system') return state;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncGiscus(theme) {
  const frame = document.querySelector('iframe.giscus-frame');
  if (!frame || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
}

export default function initThemeToggle() {
  const button = document.querySelector('[data-toggle-theme]');
  if (!button) return;

  function apply(state) {
    const theme = resolve(state);
    document.documentElement.setAttribute('data-theme', theme);
    button.setAttribute('aria-label', 'Theme: ' + state);
    button.setAttribute('title', 'Theme: ' + state);
    button.dataset.themeState = state;
    syncGiscus(theme);
  }

  button.addEventListener('click', () => {
    const next = ORDER[(ORDER.indexOf(stored()) + 1) % ORDER.length];
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  });

  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (media && media.addEventListener) {
    media.addEventListener('change', () => { if (stored() === 'system') apply('system'); });
  }

  function watchGiscus() {
    const attach = (frame) => frame.addEventListener('load', () => syncGiscus(resolve(stored())));
    document.querySelectorAll('iframe.giscus-frame').forEach(attach);
    if (!document.body || !window.MutationObserver) return;
    const observer = new MutationObserver(() => {
      const frame = document.querySelector('iframe.giscus-frame');
      if (!frame) return;
      attach(frame);
      observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  apply(stored());
  watchGiscus();
}
