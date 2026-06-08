/* ============================================================
   Caret - client behavior (barrel)
   Each concern lives in its own module under js/modules/ (SRP);
   this file just wires them up. Loaded as <script type="module">.
   ============================================================ */
import initThemeToggle from "./modules/theme-toggle.js";
import initCodeCopy from "./modules/code-copy.js";
import initToc from "./modules/toc.js";
import initMobileMenu from "./modules/mobile-menu.js";
import initSearch from "./modules/search.js";
import initPublications from "./modules/publications.js";
import initTerminal from "./modules/terminal.js";

initThemeToggle();
initCodeCopy();
initToc();
initMobileMenu();
initSearch();
initPublications();
initTerminal();
