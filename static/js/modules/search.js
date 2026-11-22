/* search.js — lazy, ranked client search over the cached /search.json index */
export default function initSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!overlay || !input || !results) return;

  const indexUrl = overlay.dataset.searchIndex || '/search.json';
  let dataPromise = null;
  let DATA = [];
  let hitEls = [];
  let selIdx = 0;
  let opener = null;

  function ensureData() {
    if (!dataPromise) {
      dataPromise = fetch(indexUrl, { credentials: 'same-origin' })
        .then((res) => (res.ok ? res.json() : []))
        .then((rows) => { DATA = Array.isArray(rows) ? rows : []; })
        .catch(() => { DATA = []; });
    }
    return dataPromise;
  }

  function fmt(iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch (e) { return iso; }
  }

  function byDate(a, b) {
    return (b.date || '').localeCompare(a.date || '');
  }

  /* Title matches outrank tags, then dek, then body. Every term must match. */
  function score(p, terms) {
    const title = (p.title || '').toLowerCase();
    const tags = (p.tags || []).join(' ').toLowerCase();
    const dek = (p.dek || '').toLowerCase();
    const body = (p.body || '').toLowerCase();
    let total = 0;
    for (const term of terms) {
      if (title.includes(term)) total += 4;
      else if (tags.includes(term)) total += 3;
      else if (dek.includes(term)) total += 2;
      else if (body.includes(term)) total += 1;
      else return 0;
    }
    return total;
  }

  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return DATA.slice().sort(byDate);
    return DATA
      .map((p) => ({ p, s: score(p, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || byDate(a.p, b.p))
      .map((x) => x.p);
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

  function message(text) {
    const el = document.createElement('div');
    el.className = 'search-empty';
    el.textContent = text;
    results.replaceChildren(el);
    hitEls = [];
  }

  function render(query) {
    const q = (query || '').trim();
    const hits = search(q);

    results.replaceChildren();
    if (!hits.length) {
      message(q ? `No writings match \u201c${q}\u201d.` : 'No writings yet.');
    } else {
      hits.forEach((p) => {
        const hit = document.createElement('a');
        hit.className = 'search-hit';
        hit.href = p.url;

        const title = document.createElement('span');
        title.className = 'search-hit__title';
        title.textContent = p.title;

        const meta = document.createElement('span');
        meta.className = 'search-hit__meta';
        const tagList = p.tags && p.tags.length ? ' · ' + p.tags.map(t => '#' + t).join(' ') : '';
        meta.textContent = fmt(p.date) + tagList;

        hit.append(title, meta);
        results.appendChild(hit);
      });
    }
    hitEls = Array.from(results.querySelectorAll('.search-hit'));
    selIdx = 0;
    paintSel();
  }

  function refresh() {
    const q = input.value;
    if (!DATA.length && !dataPromise) message('Loading search…');
    ensureData().then(() => render(q));
  }

  function open() {
    opener = document.activeElement;
    overlay.classList.add('open');
    refresh();
    setTimeout(() => input.focus(), 30);
  }
  function close() {
    overlay.classList.remove('open');
    input.value = '';
    results.replaceChildren();
    hitEls = [];
    if (opener && opener.focus) opener.focus();
  }

  function trapTab(e) {
    const items = [input, ...hitEls].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!overlay.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search]')) open();
    else if (e.target === overlay) close();
    else if (e.target.closest('.search-hit')) close();
  });
  input.addEventListener('input', refresh);
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Tab') { trapTab(e); return; }
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hitEls.length) { selIdx = (selIdx + 1) % hitEls.length; paintSel(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hitEls.length) { selIdx = (selIdx - 1 + hitEls.length) % hitEls.length; paintSel(); } }
    else if (e.key === 'Enter') { e.preventDefault(); const el = hitEls[selIdx]; if (el) location.href = el.getAttribute('href'); }
  });

  /* Show the shortcut users actually have */
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '') || /Mac OS X/.test(navigator.userAgent || '');
  if (!isMac) {
    document.querySelectorAll('.searchbtn kbd').forEach((kbd) => { kbd.textContent = 'Ctrl+K'; });
  }
}
