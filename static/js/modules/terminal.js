/* terminal.js — type the homepage terminal out like a real session.
   Progressive enhancement: without JS the full content is already in the DOM;
   this clears it and types it back. Skipped under prefers-reduced-motion. */
export default function initTerminal() {
  const term = document.querySelector('[data-term]');
  if (!term) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cmds = Array.from(term.querySelectorAll('.term__cmd'));
  const outs = Array.from(term.querySelectorAll('.term__out'));
  const prompt = term.querySelector('.term__prompt');
  if (!cmds.length) return;

  const texts = cmds.map(c => c.textContent.trim());
  cmds.forEach(c => { c.textContent = ''; });
  outs.forEach(o => { o.style.opacity = '0'; o.style.transition = 'opacity .28s ease'; });
  if (prompt) prompt.style.opacity = '0';

  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  function typeCmd(idx) {
    if (idx >= cmds.length) { if (cursor.parentNode) cursor.remove(); if (prompt) prompt.style.opacity = ''; return; }
    const span = cmds[idx];
    span.parentNode.appendChild(cursor);
    const text = texts[idx];
    let j = 0;
    (function ch() {
      span.textContent = text.slice(0, j);
      if (j < text.length) { j++; setTimeout(ch, 34 + Math.random() * 55); }
      else {
        setTimeout(() => {
          const out = outs[idx]; if (out) out.style.opacity = '1';
          setTimeout(() => typeCmd(idx + 1), 380);
        }, 170);
      }
    })();
  }
  setTimeout(() => typeCmd(0), 260);
}
