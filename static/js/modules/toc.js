/* toc.js — smooth scroll + animated indicator + scroll-spy on .toc */
export default function initToc() {
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  if (!tocLinks.length) return;
  const tocBar = document.querySelector('.toc__bar');
  const targets = tocLinks.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))));

  function setActive(idx) {
    tocLinks.forEach((a, i) => a.classList.toggle('is-active', i === idx));
    if (tocBar && tocLinks[idx]) {
      tocBar.style.top = tocLinks[idx].offsetTop + 'px';
      tocBar.style.height = tocLinks[idx].offsetHeight + 'px';
      tocBar.style.opacity = '1';
    }
  }
  function spy() {
    let idx = 0;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].getBoundingClientRect().top < 130) idx = i;
    }
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) idx = targets.length - 1;
    setActive(idx);
  }
  tocLinks.forEach((a, i) => a.addEventListener('click', (e) => {
    const t = targets[i];
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
      setActive(i);
    }
  }));
  setActive(0);
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', () => { const i = tocLinks.findIndex(a => a.classList.contains('is-active')); setActive(i < 0 ? 0 : i); });
}
