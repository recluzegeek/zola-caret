/* theme-toggle.js — persist + toggle light/dark on .site[data-theme] */
export default function initThemeToggle() {
  const site = document.querySelector('.site');
  if (!site) return;
  const saved = localStorage.getItem('caret.theme');
  if (saved) site.setAttribute('data-theme', saved);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-toggle-theme]')) return;
    const next = site.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    site.setAttribute('data-theme', next);
    localStorage.setItem('caret.theme', next);
  });
}
