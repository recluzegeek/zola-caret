/* mobile-menu.js — logo stays in the nav; burger ⇄ close; panel fills below.
   State lives as .is-menu-open on .site (CSS drives the burger icon swap). */
export default function initMobileMenu() {
  const site = document.querySelector('.site');
  if (!site) return;
  const burger = document.querySelector('[data-menu-toggle]');

  const setOpen = (on) => {
    site.classList.toggle('is-menu-open', on);
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', on ? 'true' : 'false');
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-menu-toggle]')) {
      setOpen(!site.classList.contains('is-menu-open'));
    } else if (e.target.closest('[data-menu-close]')) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && site.classList.contains('is-menu-open')) setOpen(false);
  });
}
