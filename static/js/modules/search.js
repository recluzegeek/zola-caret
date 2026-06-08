/* search.js — client-side filter over window.__SEARCH (built in base.html) */
export default function initSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!overlay || !input || !results) return;
  const DATA = window.__SEARCH || [];
  let hitEls = [];
  let selIdx = 0;

  function fmt(iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch (e) { return iso; }
  }
  function paintSel() {
    if (!hitEls.length) return;
    hitEls.forEach((el, i) => el.classList.toggle('sel', i === selIdx));
    const el = hitEls[selIdx];
    if (!el) return;
    const top = el.offsetTop, bot = top + el.offsetHeight;
    if (top < results.scrollTop) results.scrollTop = top;
    else if (bot > results.scrollTop + results.clientHeight) results.scrollTop = bot - results.clientHeight;
  }
  function render(q) {
    q = (q || '').trim().toLowerCase();
    const hits = DATA.filter(p => {
      if (!q) return true;
      return `${p.title} ${(p.tags || []).join(' ')} ${p.dek || ''} ${p.body || ''}`.toLowerCase().includes(q);
    });
    results.innerHTML = hits.length
      ? hits.map((p) => {
          const tagList = p.tags && p.tags.length ? ' · ' + p.tags.map(t => '#' + t).join(' ') : '';
          return `<a class="search-hit" href="${p.url}"><span class="search-hit__title">${p.title}</span><span class="search-hit__meta">${fmt(p.date) + tagList}</span></a>`;
        }).join('')
      : `<div class="search-empty">No writings match \u201c${q}\u201d.</div>`;
    hitEls = Array.from(results.querySelectorAll('.search-hit'));
    selIdx = 0;
    paintSel();
  }
  function open() { overlay.classList.add('open'); render(''); setTimeout(() => input.focus(), 30); }
  function close() { overlay.classList.remove('open'); input.value = ''; }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search]')) open();
    else if (e.target === overlay) close();
    else if (e.target.closest('.search-hit')) close();
  });
  input.addEventListener('input', () => render(input.value));
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hitEls.length) { selIdx = (selIdx + 1) % hitEls.length; paintSel(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hitEls.length) { selIdx = (selIdx - 1 + hitEls.length) % hitEls.length; paintSel(); } }
    else if (e.key === 'Enter') { e.preventDefault(); const el = hitEls[selIdx]; if (el) location.href = el.getAttribute('href'); }
  });
}
