/* publications.js — cite copy · abstract toggle · image tap-to-zoom lightbox.
   Handlers scope lookups with closest() so each entry is self-contained. */
export default function initPublications() {
  document.addEventListener('click', (e) => {
    const cite = e.target.closest('[data-cite]');
    if (cite) {
      const body = cite.closest('.pubA__body');
      const src = body && body.querySelector('[data-citesrc]');
      if (src && navigator.clipboard) navigator.clipboard.writeText(src.value);
      const orig = cite.textContent;
      cite.classList.add('is-copied'); cite.textContent = 'copied \u2713';
      setTimeout(() => { cite.classList.remove('is-copied'); cite.textContent = orig; }, 1400);
      return;
    }
  });

  let lb = null;
  function box() {
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<img alt="">';
    (document.querySelector('.site') || document.body).appendChild(lb);
    lb.addEventListener('click', () => lb.classList.remove('open'));
    return lb;
  }
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.pubA__thumb img[data-zoom], .prose figure img');
    if (!img) return;
    const b = box();
    b.querySelector('img').src = img.currentSrc || img.src;
    b.classList.add('open');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb) lb.classList.remove('open'); });
}
