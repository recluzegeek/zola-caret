# Caret

A Zola theme with an **editorial-serif voice** and a **terminal-mono machine layer.**
Newsreader for everything you read; JetBrains Mono as a deliberate accent for the `~/` logo, nav, dates, labels, code, and the `whoami` terminal block.

The name is the blinking terminal cursor *and* the proofreader's insertion mark — the theme's two halves.

**Features:** neutral warm-gray palette + one configurable accent · light/dark toggle · client-side search · year-grouped archive · tags · publications · resume page · GoatCounter analytics · Giscus comments.

## Quick start

```bash
# Requires Zola ≥ 0.18 — https://www.getzola.org/documentation/getting-started/installation/
zola serve                # live reload at http://127.0.0.1:1111
zola serve --drafts       # include draft posts (date in the future)
zola build                # production build → public/
```

## Step-by-step setup

Follow these steps in order. Takes about five minutes.

**Step 1 — Edit your identity** (`config.toml`, Section 2)

```toml
[extra.identity]
logo   = "you"      # shows after ~/  in the nav
prompt = "you"      # terminal prompt left side
name   = "Your Name"
```

**Step 2 — Set your bio and role** (`config.toml`, Sections 3 & 7)

```toml
eyebrow = "software engineer"   # one-line label above the heading
bio     = "I build …"           # paragraph below the heading, HTML ok
```

**Step 3 — Add your nav links and socials** (Sections 5 & 6)

The default nav (writings, publications, resume) matches the included pages. Remove any `[[extra.nav]]` entry for a page you don't want.

**Step 4 — Write your first post**

Drop a Markdown file in `content/writings/`:

```toml
+++
title = "My first post"
date  = 2026-06-01

[taxonomies]
tags = ["linux", "notes"]

[extra]
dek = "One-line summary — shown in post lists and search results."
+++

Write in Markdown here. `## Headings` populate the table of contents automatically.
```

`zola serve` picks it up immediately. The archive, tags cloud, search index, and homepage list all update automatically.

**Step 5 — Fill in your data pages**

- **Resume** — edit `[[extra.experience]]`, `[[extra.education]]`, `[[extra.skills]]`, and `tools` in `config.toml` Section 8.
- **Publications** — edit `[[extra.publications]]` in Section 10.

**Step 6 — Choose a font strategy** (optional)

Caret ships self-hosted fonts in `static/fonts/`. By default it uses those. If you'd rather load from Google Fonts CDN, restore the `<link rel="preconnect">` lines in `templates/base.html` and remove the `@use 'partials/tokens'` `@font-face` blocks (or set `src:` to point to an empty file). Pick one — loading both wastes bandwidth.

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
    tokens.scss         @font-face + all CSS custom properties  ← retheme here
    base.scss           reset, .wrap, .btn
    nav.scss            navigation, footer, theme toggle, search button
    hero.scss           hero, terminal block, social links, post rows
    article.scss        reading view, TOC, prose, code blocks
    resume.scss         CV layout, skill groups
    pages.scss          archive, search modal, tags, publications, 404
templates/
  base.html              shell: nav, footer, search modal
  index.html             home
  page.html              single post (TOC, prev/next, comments)
  section.html           writings archive (year-grouped + tag filter)
  publications.html
  resume.html
  taxonomy_list.html     /tags cloud
  taxonomy_single.html   /tags/<tag>
  404.html
  macros/
    icons.html           SVG icon registry           ← add icons here
    post.html            post row component
    cv.html              resume entry component
    publications.html             publication entry component
    ui.html              compatibility shim (re-exports all macros)
static/
  fonts/                 self-hosted woff2 files
  js/theme.js            theme toggle · code copy · TOC scroll-spy · search
```

## How to…

### Add a post

Drop a `.md` file in `content/writings/`. Minimal frontmatter:

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

### Add a tag

Just use it in `tags = [...]`. Zola generates `/tags` and `/tags/<tag>` automatically.

### Add a brand-new page

1. Create `templates/mypage.html` — extend `base.html`, fill the `content` block.
2. Create `content/mypage.md` with `template = "mypage.html"` in frontmatter.
3. Add `{ route = "mypage", label = "mypage" }` to `[[extra.nav]]` in `config.toml`.

### Add an icon

Icons live in `templates/macros/icons.html`. To add one:

1. Find the SVG from [Lucide](https://lucide.dev/), [Heroicons](https://heroicons.com/), or similar.
2. Copy only the inner elements (the `<path>`, `<circle>`, etc.) — not the outer `<svg>` tag.
3. Add a branch to the `{% macro icon(name) %}` if/elif chain:

```html
{%- elif name == "x" -%}
  <path d="M18 6 6 18M6 6l12 12"/>
```

4. If it's a filled icon (not stroked), add `"x"` to the `filled` set at the top of the macro.
5. Use it anywhere with `{{ icons::icon(name="x") | safe }}` (after importing the macro).

### Change the accent colour

Edit `--accent` in `sass/partials/_tokens.scss`. Everything derives from it:

```scss
--accent:      #137a63;   /* ← change this */
--accent-soft: color-mix(in oklab, var(--accent) 13%, transparent);
--accent-line: color-mix(in oklab, var(--accent) 34%, transparent);
```

### Change fonts

Edit `--serif` and `--mono` at the bottom of `sass/partials/_tokens.scss`, and update the `@font-face` blocks (or Google Fonts `<link>` in `base.html`) to match.

### Enable syntax highlighting

In `config.toml`:
```toml
[markdown]
highlight_code  = true
highlight_theme = "css"
```

Run `zola build`. Zola outputs `syntax-theme.css` — reference it from `base.html`. See [Zola syntax highlighting docs](https://www.getzola.org/documentation/content/syntax-highlighting/).

### Enable GoatCounter analytics

```toml
# config.toml
goatcounter_code = "yourcode"   # your GoatCounter subdomain
```

[Create a GoatCounter account](https://www.goatcounter.com/). No cookie banner needed.

### Enable Giscus comments

```toml
# config.toml
giscus_repo         = "yourname/blog-comments"
giscus_repo_id      = "R_xxx"
giscus_category     = "General"
giscus_category_id  = "DIC_xxx"
```

Steps: enable Discussions on a GitHub repo → install [the giscus app](https://giscus.app/) → copy the IDs it generates.

### Use drafts

Posts with a future date are hidden from production builds. To preview them locally:

```bash
zola serve --drafts
```

### Deploy

```bash
zola build          # outputs to public/
rsync -avz public/ user@host:/var/www/site/    # rsync to a VPS
# or: drag public/ into Netlify / Cloudflare Pages drop zone
# or: push to GitHub + set up Netlify/Vercel build command: zola build
```

Netlify `netlify.toml`:
```toml
[build]
command     = "zola build"
publish     = "public"
environment = { ZOLA_VERSION = "0.19.2" }
```

## Using macros

All macros are importable individually or via the backward-compatible `ui.html` shim.

```html
{# Option A — import the whole shim (existing templates use this) #}
{% import "macros/ui.html" as ui %}
{{ ui::post_row(page=page, dek=true) | safe }}

{# Option B — import only what you need (preferred for new templates) #}
{% import "macros/post.html"    as post    %}
{% import "macros/icons.html"   as icons   %}
{% import "macros/cv.html"      as cv      %}
{% import "macros/pub.html"     as pub     %}

{{ post::row(page=page, dek=true) | safe }}
{{ icons::icon(name="github") | safe }}
```

| Macro file | Macro | Parameters |
|---|---|---|
| `icons.html` | `icon(name)` | `name` — registered icon name |
| `post.html` | `row(page, dek)` | `page` — Zola page · `dek` bool |
| `cv.html` | `item(role, org, date, bullets, note, status)` | all optional except `role` |
| `publications.html` | `item(p)` | `p` — publication object from config |

## Converting this into a reusable theme

This repo is a working site. To publish Caret as a standalone theme usable by others:

1. Move `templates/`, `sass/`, and `static/` into `themes/caret/`.
2. Keep `theme.toml` there.
3. Set `theme = "caret"` in each site's `config.toml`.
4. The `content/` directory and per-site `config.toml` stay in each site's root.

See [Zola theme documentation](https://www.getzola.org/documentation/themes/overview/).

## Options reference (`config.toml [extra]`)

| Key | Type | What it does |
|---|---|---|
| `identity.logo` | string | Text after `~/` in nav |
| `identity.prompt` | string | Terminal prompt left side |
| `identity.name` | string | Name in hero heading |
| `default_theme` | `"light"` \| `"dark"` | Initial theme (user override persists) |
| `eyebrow` | string | Small label above hero heading |
| `role` | string | Shown in hero and resume page |
| `bio` | string | Hero paragraph (HTML allowed) |
| `theme_repo` | URL | Link in footer |
| `resume_pdf` | path | Shows PDF download on resume (optional) |
| `goatcounter_code` | string | GoatCounter subdomain (optional) |
| `giscus_*` | strings | Giscus comment config (optional) |
| `[[extra.nav]]` | array | Nav bar links: `route`, `label` |
| `[[extra.socials]]` | array | Social links: `icon`, `label`, `href` |
| `[[extra.terminal]]` | array | Terminal lines: `cmd`, `out` |
| `[[extra.experience]]` | array | Resume jobs: `role`, `org`, `date`, `bullets` |
| `[[extra.education]]` | array | Resume education: `role`, `org`, `date`, `note` |
| `[[extra.skills]]` | array | Resume skills: `label`, `items` |
| `tools` | array of strings | Daily drivers line on resume |
| `[[extra.publications]]` | array | Publications: `title`, `venue`, `status`, `note`, `links` |

## Roadmap

These are planned improvements in rough priority order. PRs welcome.

### Near-term (quality)

- **Open Graph tags** — `og:title`, `og:description`, `og:image` in `base.html` for better link previews
- **RSS link in footer** — the feed is already generated; just needs a visible link
- **`prefers-color-scheme` default** — respect the OS preference before localStorage is set
- **Archive pagination** — currently all posts render at once; Zola's `paginate_by` makes this straightforward

### Short-term (features)

- **Reading progress bar** — thin fixed bar on `page.html` that fills as you scroll
- **Estimated read time in search results** — already available as `page.reading_time`
- **Series / multi-part posts** — ordered sub-sections under `content/writings/series-name/`
- **Print stylesheet** — `@media print` rules for the resume page so it renders cleanly to PDF
- **Breadcrumbs** — for nested sections (`writings/series/post`)

### Medium-term (config-driven)

- **Accent presets** — define named palette options in `config.toml`; user picks one
- **Layout density toggle** — expose `--space` multiplier as a config key (`space = 0.85`)
- **i18n UI strings** — move nav/footer/search labels into config so non-English sites don't need to touch templates

### Long-term (ecosystem)

- **Zola themes gallery submission** — once the theme is extractable, submit to [zola themes](https://www.getzola.org/themes/)
- **Starter kit** — a companion repo with 10 sample posts, filled config, and sample images so new users have something real to look at immediately
- **Giscus as a macro** — move the comment embed out of `page.html` into `macros/comments.html` so it's overridable without touching core templates
- **Alternative homepage layouts** — a `homepage_layout` config key that switches between the current terminal-hero layout and a simpler grid layout for non-technical blogs

## Acknowledgements

Spiritually indebted to Zola's [Apollo](https://www.getzola.org/themes/apollo/) theme, Astro's [Pure](https://github.com/xiaohanyu/astro-paper) theme, and the restraint of [thedataquarry.com](https://thedataquarry.com/).

MIT licensed.
