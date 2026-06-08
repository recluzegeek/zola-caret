# Caret — Development & customization

Everything beyond the five-minute quick start in the [README](README.md). Caret is configured almost entirely from `config.toml`; templates read from it, so you rarely touch HTML.

## Where things live

```
config.toml              ← all your data and settings (start here)
content/
  _index.md              home page (uses templates/index.html)
  writings/
    _index.md            archive settings (sort_by = "date")
    *.md                 one file per post
  publications.md        publications   (data in config.toml § 10)
  resume.md              resume         (data in config.toml § 8)
sass/
  style.scss             imports only — edit the partials, not this file
  partials/
    tokens.scss          @font-face + all CSS custom properties  ← retheme here
    base.scss            reset, .wrap, .btn
    nav.scss             navigation, footer, theme toggle, search button
    hero.scss            hero, terminal block, social links, post rows
    article.scss         reading view, TOC, prose, code blocks
    resume.scss          CV layout, skill groups
    pages.scss           archive, search modal, tags, publications, 404
templates/
  base.html              shell: nav, footer, search modal
  index.html             home
  page.html              single post (TOC, prev/next, comments)
  section.html           writings archive (year-grouped + tag filter)
  publications.html / resume.html
  taxonomy_list.html     /tags cloud
  taxonomy_single.html   /tags/<tag>
  404.html
  macros/
    icons.html           SVG icon registry           ← add icons here
    post.html            post row component
    cv.html              resume entry component
    publications.html    publication entry component
    ui.html              compatibility shim (re-exports all macros)
  shortcodes/
    figure.html          captioned image, soft shadow, optional wide=true
    video.html           self-hosted <video> player with the same shadow
static/
  fonts/                 self-hosted woff2 files
  js/theme.js            barrel; behavior split into js/modules/*.js (SRP)
```

## How to…

### Add a post

Drop a `.md` in `content/writings/`:

```toml
+++
title = "Post title"
date  = 2026-06-01
[taxonomies]
tags = ["tag1", "tag2"]
[extra]
dek = "One-line deck shown in lists and search."
+++
```

### Add an image or video to a post

```markdown
{{/* figure(src="/writings/diagram.png", caption="What this shows.") */}}
{{/* figure(src="/writings/wide.png", caption="A big diagram.", wide=true) */}}
{{/* video(src="/writings/demo.mp4", poster="/writings/demo.jpg", caption="A short clip.") */}}
```

Both float on a soft shadow with a serif-italic caption. Drop media in
`static/writings/` (or point `src` at any URL). Plain `![alt](src)` is styled
the same way. **Images tap-to-zoom** into a lightbox automatically.

### Add a tag

Just use it in `tags = [...]`. Zola generates `/tags` and `/tags/<tag>`.

### Add a brand-new page

1. Create `templates/mypage.html` — extend `base.html`, fill the `content` block.
2. Create `content/mypage.md` with `template = "mypage.html"`.
3. Add `{ route = "mypage", label = "mypage" }` to `[[extra.nav]]`.

### Add an icon

Icons live in `templates/macros/icons.html`:

1. Grab an SVG from [Lucide](https://lucide.dev/) / [Heroicons](https://heroicons.com/).
2. Copy only the inner elements (`<path>`, `<circle>`…), not the `<svg>` tag.
3. Add a branch to the `{% macro icon(name) %}` if/elif chain.
4. If filled (not stroked), add the name to the `filled` set.
5. Use with `{{ icons::icon(name="x") | safe }}`.

### Change the accent colour

Edit `--accent` in `sass/partials/tokens.scss`; everything derives from it.

```scss
--accent: #137a63; /* ← change this */
--accent-soft: color-mix(in oklab, var(--accent) 13%, transparent);
--accent-line: color-mix(in oklab, var(--accent) 34%, transparent);
```

### Change fonts

Edit `--serif` / `--mono` at the bottom of `tokens.scss` and update the
`@font-face` blocks (or the Google Fonts `<link>` in `base.html`) to match.
Caret ships self-hosted woff2 by default — pick one source, don't load both.

### Enable analytics / comments

```toml
goatcounter_code   = "yourcode"          # privacy-friendly, no cookie banner
giscus_repo        = "yourname/blog-comments"
giscus_repo_id     = "R_xxx"
giscus_category    = "General"
giscus_category_id = "DIC_xxx"
```

Steps for Giscus: enable Discussions → install the [giscus app](https://giscus.app/) → copy the IDs.

### Drafts & deploy

Future-dated posts are hidden in production. Preview with `zola serve --drafts`.
Netlify `netlify.toml`:

```toml
[build]
command     = "zola build"
publish     = "public"
environment = { ZOLA_VERSION = "0.19.2" }
```

## Publications page fields

The publications page renders from `[[extra.publications]]` via
`macros/publications.html`. Each entry supports:

| Field      | Type              | What it does                                                                                  |
| ---------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `title`    | string            | Paper / talk title (**required**)                                                             |
| `venue`    | string            | `"IEEE · 2025"` — shown on the rail (**required**)                                            |
| `status`   | string            | `published` / `peer-reviewed` → filled badge; else outline                                    |
| `badge`    | string            | Optional label override for the published badge                                               |
| `authors`  | HTML              | Byline; wrap your name in `<span class="me">…</span>` to bold + tint it                       |
| `tldr`     | string            | **One-line summary — bake your headline metric straight in**                                  |
| `note`     | string            | Fallback one-liner if you don't set `tldr`                                                    |
| `metric`   | `{label, value}`  | Optional rail chip. Use this **or** a baked-in `tldr` number, not both                        |
| `talk`     | bool              | `true` adds an italic “Presented as a conference talk.” note (keep paper + talk as ONE entry) |
| `abstract` | string            | Adds a collapsible `[abstract ▾]` panel (off by default)                                      |
| `cite`     | string            | BibTeX/APA — adds a `[cite]` copy-to-clipboard button                                         |
| `image`    | path/URL          | Right-column thumbnail (auto dimmed + tap-to-zoom)                                            |
| `links`    | `[{label, href}]` | Pill links — **MUST come last** in the TOML entry                                             |

**Design rationale (decided in the feedback round):**

- **TL;DR over abstract.** Nobody reads a 250-word abstract on a portfolio;
  one punchy line with the metric baked in is all most visitors need. The
  collapsible `abstract` exists but is opt-in per entry.
- **Metric: inline by default.** Bake the number into `tldr`
  ("…achieving 99.22% AUC…"). The separate `metric` chip is an alternative,
  not an addition — don't show both.
- **One entry per paper.** A conference talk for a paper you authored is not a
  separate publication; surface it with `talk = true`, never a second entry.
- **Cite is high-utility, low-noise.** A quiet `[cite]` pill that copies BibTeX
  measurably increases citations; styled identically to `doi`/`pdf`.
- **Dimmed thumbnails.** Diagrams with bright white backgrounds are auto-given
  a subtle border + slight opacity so they blend into the dark theme.

## Using macros

```html
{# whole shim (existing templates) #} {% import "macros/ui.html" as ui %} {{
ui::post_row(page=page, dek=true) | safe }} {# or import only what you need #}
{% import "macros/publications.html" as pub %} {{ pub::item(p=p) }}
```

| Macro file          | Macro                                          | Parameters                           |
| ------------------- | ---------------------------------------------- | ------------------------------------ |
| `icons.html`        | `icon(name)`                                   | registered icon name                 |
| `post.html`         | `row(page, dek)`                               | `page` · `dek` bool                  |
| `cv.html`           | `item(role, org, date, bullets, note, status)` | all optional except `role`           |
| `publications.html` | `item(p)`                                      | `p` — publication object from config |

## Client behavior (`static/js/theme.js`)

`theme.js` is a **barrel** loaded as `<script type="module">`. Each concern
is its own ES module under `static/js/modules/` (SRP):

| Module            | Responsibility                                        |
| ----------------- | ----------------------------------------------------- |
| `theme-toggle.js` | light/dark persist + toggle                           |
| `code-copy.js`    | wrap `<pre>` blocks with a copy button                |
| `toc.js`          | animated TOC indicator + scroll-spy                   |
| `mobile-menu.js`  | burger ↔ close, `.is-menu-open` on `.site`            |
| `search.js`       | client-side filter over `window.__SEARCH`             |
| `publications.js` | cite copy, abstract toggle, image lightbox            |
| `terminal.js`     | types the homepage terminal out (reduced-motion safe) |

Add a behavior = add a module + one import line in `theme.js`.

## Converting into a reusable theme

1. Move `templates/`, `sass/`, `static/` into `themes/caret/`.
2. Keep `theme.toml` there.
3. Set `theme = "caret"` in each site's `config.toml`.
4. `content/` and the per-site `config.toml` stay in each site's root.

See the [Zola theme docs](https://www.getzola.org/documentation/themes/overview/).

## Pagination & homepage

- **Homepage** post list is config-driven: `[extra.homepage]` with `mode`
  (`featured` → posts flagged `featured = true` first, then latest; or
  `latest`) and `count`. Flag a post by adding `featured = true` under its
  `[extra]`.
- **Writings archive** paginates via `paginate_by` in
  `content/writings/_index.md` (defaults to **7**). `section.html` renders
  `paginator.pages` with newer/older controls.

## Roadmap

**Done** (shipped): README/DEVELOPMENT split · publications page
(TL;DR, cite, talk-as-note, dimmed thumbs) · site-wide clickable tags
· homepage + archive pagination · logo-stays mobile nav · modular `theme.js`
· image tap-to-zoom (plain pointer cursor) · animated typing terminal ·
tags-page footer alignment fix.

**Near-term**

- Open Graph tags (`og:*`) in `base.html`
- `prefers-color-scheme` default before localStorage
- Expose homepage `count` / archive `paginate_by` together in one config block

**Short-term**

- Reading-progress bar on `page.html`
- Print stylesheet for the resume
- Series / multi-part posts

**Medium-term**

- Accent presets + density toggle exposed as config keys
- i18n UI strings in config

**Long-term**

- Comments system → enables sort-by (latest / liked / most-commented)
- Submit to the Zola themes gallery; ship a starter-content kit
