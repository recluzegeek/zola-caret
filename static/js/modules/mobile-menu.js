/* mobile-menu.js — logo stays in the nav; burger ⇄ close; panel fills below.
   State lives as .is-menu-open on .site (CSS drives the burger icon swap). */
export default function initMobileMenu() {
  const site = document.querySelector('.site');
  if (!site) return;
  const lock = (on) => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-toggle]')) {
      lock(site.classList.toggle('is-menu-open'));
    } else if (e.target.closest('[data-menu-close]')) {
      site.classList.remove('is-menu-open'); lock(false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { site.classList.remove('is-menu-open'); lock(false); }
  });
}
