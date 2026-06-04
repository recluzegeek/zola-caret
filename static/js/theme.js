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

  /* ---- TOC: smooth scroll + animated indicator + scroll-spy ---- */
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
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
      // short content / near page bottom → activate the last heading
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

  /* ---- mobile full-screen menu (open/close + scroll lock) ---- */
  (function () {
    const mfull = document.getElementById('mfull');
    if (!mfull) return;
    const lock = (on) => {
      document.documentElement.style.overflow = on ? 'hidden' : '';
      document.body.style.overflow = on ? 'hidden' : '';
    };
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-menu-open]')) { mfull.classList.add('open'); lock(true); }
      else if (e.target.closest('[data-menu-close]')) { mfull.classList.remove('open'); lock(false); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { mfull.classList.remove('open'); lock(false); } });
  })();

  /* ---- search (filter + up/down navigation) ---- */
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
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
      const searchTarget = `${p.title} ${(p.tags || []).join(' ')} ${p.dek || ''} ${p.body || ''}`.toLowerCase();
      return searchTarget.includes(q);
    });
  
    results.innerHTML = hits.length
      ? hits.map((p) => {
          const tagList = p.tags && p.tags.length ? ' · ' + p.tags.map(t => '#' + t).join(' ') : '';
          const metaText = fmt(p.date) + tagList;
          return `<a class="search-hit" href="${p.url}"><span class="search-hit__title">${p.title}</span><span class="search-hit__meta">${metaText}</span></a>`;
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
  
  if (input) input.addEventListener('input', () => render(input.value));
  
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (!overlay || !overlay.classList.contains('open')) return;
    
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { 
      e.preventDefault(); 
      if (hitEls.length) { selIdx = (selIdx + 1) % hitEls.length; paintSel(); } 
    }
    else if (e.key === 'ArrowUp') { 
      e.preventDefault(); 
      if (hitEls.length) { selIdx = (selIdx - 1 + hitEls.length) % hitEls.length; paintSel(); } 
    }
    else if (e.key === 'Enter') { 
      e.preventDefault(); 
      if (hitEls.length > 0) {
        const el = hitEls[selIdx]; 
        if (el) location.href = el.getAttribute('href'); 
      }
    }
  });
})();
