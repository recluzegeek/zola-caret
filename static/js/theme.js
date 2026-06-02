/* ============================================================
   Caret — client behavior (no dependencies)
   theme toggle · code copy · TOC scroll-spy · search
   ============================================================ */
(function () {
  const site = document.querySelector('.site');

  /* ---- theme: persist + toggle ---- */
  const saved = localStorage.getItem('caret.theme');
  if (saved) site.setAttribute('data-theme', saved);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-toggle-theme]')) return;
    const next = site.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    site.setAttribute('data-theme', next);
    localStorage.setItem('caret.theme', next);
  });

  /* ---- code blocks: wrap each <pre> with a bar + copy button ---- */
  const COPY = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';
  document.querySelectorAll('.prose pre').forEach((pre) => {
    if (pre.closest('.codeblock')) return;
    const codeEl = pre.querySelector('code');
    const lang = ((pre.className || '') + ' ' + (codeEl ? codeEl.className : '')).match(/language-([\w-]+)/);
    const label = (lang && lang[1]) || 'code';
    const wrap = document.createElement('div');
    wrap.className = 'codeblock';
    pre.parentNode.insertBefore(wrap, pre);
    const bar = document.createElement('div');
    bar.className = 'codeblock__bar';
    bar.innerHTML = '<span>' + label + '</span><button class="copybtn" type="button">' + COPY + ' copy</button>';
    wrap.appendChild(bar);
    wrap.appendChild(pre);
    bar.querySelector('.copybtn').addEventListener('click', function () {
      const code = pre.innerText;
      navigator.clipboard && navigator.clipboard.writeText(code);
      this.classList.add('copied');
      const orig = this.innerHTML;
      this.innerHTML = COPY + ' copied';
      setTimeout(() => { this.classList.remove('copied'); this.innerHTML = orig; }, 1400);
    });
  });

  /* ---- TOC: smooth scroll + scroll-spy ---- */
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
    const targets = tocLinks.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
    tocLinks.forEach((a) => a.addEventListener('click', (e) => {
      const t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); }
    }));
    window.addEventListener('scroll', () => {
      let idx = 0;
      targets.forEach((t, i) => { if (t.getBoundingClientRect().top < 120) idx = i; });
      tocLinks.forEach((a, i) => a.classList.toggle('is-active', i === idx));
    }, { passive: true });
  }

  /* ---- search ---- */
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const DATA = window.__SEARCH || [];
  function fmt(iso) { try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return iso; } }
  function render(q) {
    q = (q || '').trim().toLowerCase();
    const hits = DATA.filter(p => !q || (p.title + ' ' + (p.tags || []).join(' ') + ' ' + (p.dek || '')).toLowerCase().includes(q));
    results.innerHTML = hits.length
      ? hits.map((p, i) => '<a class="search-hit' + (i === 0 ? ' sel' : '') + '" href="' + p.url + '"><span class="search-hit__title">' + p.title + '</span><span class="search-hit__meta">' + fmt(p.date) + (p.tags && p.tags.length ? ' · ' + p.tags.map(t => '#' + t).join(' ') : '') + '</span></a>').join('')
      : '<div class="search-empty">No writings match \u201c' + q + '\u201d.</div>';
  }
  function open() { overlay.classList.add('open'); render(''); setTimeout(() => input.focus(), 30); }
  function close() { overlay.classList.remove('open'); input.value = ''; }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-search]')) open();
    else if (e.target === overlay) close();
    else if (e.target.closest('.search-hit')) close();
  });
  if (input) input.addEventListener('input', () => render(input.value));
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' && overlay.classList.contains('open')) { const sel = results.querySelector('.search-hit'); if (sel) location.href = sel.getAttribute('href'); }
  });
})();
