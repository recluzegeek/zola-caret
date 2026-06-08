/* code-copy.js — wrap each .prose <pre> with a bar + copy button */
const COPY = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';

export default function initCodeCopy() {
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
      navigator.clipboard && navigator.clipboard.writeText(pre.innerText);
      this.classList.add('copied');
      const orig = this.innerHTML;
      this.innerHTML = COPY + ' copied';
      setTimeout(() => { this.classList.remove('copied'); this.innerHTML = orig; }, 1400);
    });
  });
}
