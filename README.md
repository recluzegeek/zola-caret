# Caret

A Zola theme with an **editorial-serif voice** and a **terminal-mono machine layer** - serif (Newsreader) for everything you read, mono (JetBrains Mono) as a deliberate accent for the `~/` logo, nav, dates, labels, code, and the `whoami` terminal block.

The name is the blinking terminal cursor *and* the proofreader's insertion mark - the theme's two halves.
Neutral warm-gray palette + a single configurable accent. Light/dark, built-in search,year-grouped archive, tags, projects, publications, and a resume page.

Rewritten from scratch; spiritually indebted to Zola's **Apollo** & Astro's **Pure**, and to the restraint of [thedataquarry.com](https://thedataquarry.com/).

## Quick start

```bash
zola serve
# → http://127.0.0.1:1111
```

Requires Zola ≥ 0.18.

## Where things live

```
config.toml              ← YOU (identity, nav, socials, resume data, accent, analytics)
content/
  _index.md              home (uses templates/index.html)
  writings/              blog posts - one .md per post (Markdown, your workflow)
    _index.md            archive settings (sort_by = "date")
    *.md
  projects.md            projects page  (data in config.toml → extra.projects)
  publications.md        publications   (data in config.toml → extra.publications)
  resume.md              resume         (data in config.toml → extra.experience/…)
templates/
  base.html              shell: nav, footer, search modal, search index
  index.html             home (hero + terminal + recent writings)
  page.html              single writing (TOC, prev/next, optional comments)
  section.html           writings archive (year-grouped + tag filter)
  projects.html / publications.html / resume.html
  taxonomy_list.html     /tags
  taxonomy_single.html   /tags/<tag>
  404.html
  macros/ui.html         reusable bits: icon, post_row, cv_item, project_card, pub_item
sass/style.scss          all styles + design tokens
static/js/theme.js       theme toggle · code-copy · TOC scroll-spy · search
```

The split mirrors a component system: **macros/ui.html** = reusable components,
**templates/** = pages, **config.toml** = data.

## How to…

**Add a post** - drop a Markdown file in `content/writings/`:

```toml
+++
title = "My new post"
date = 2026-06-01
[taxonomies]
tags = ["linux", "notes"]
[extra]
dek = "One-line summary shown in lists and search."
+++

Write in Markdown. `## Headings` auto-populate the table of contents.
```

The archive, tags, search index, prev/next, and home list all update automatically.

**Add a tag** - just use it in a post's `tags`. The `/tags` cloud and per-tag pages are generated.

**Add a brand-new page** - create `templates/mypage.html` (extend `base.html`, fill the
`content` block), then `content/mypage.md` with `template = "mypage.html"`, then add
`{ route = "mypage", label = "mypage" }` to `[[extra.nav]]`.

**Add an icon** - one `{% elif name == "x" %}` branch in `macros/ui.html` → `ui::icon(name="x")`.

**Change the accent / fonts** - top of `sass/style.scss` (`--accent`, `--serif`, `--mono`).

## Options (config.toml `[extra]`)

| Key | What |
|---|---|
| `identity` | `logo` / `prompt` / `name` - drives the `~/` mark, terminal prompt, greeting |
| `default_theme` | `"light"` or `"dark"` (user toggle persists in localStorage) |
| `nav`, `socials` | arrays of `{ route, label }` / `{ icon, label, href }` |
| `bio`, `eyebrow`, `terminal` | homepage hero content |
| `experience`, `education`, `publications`, `projects`, `skills`, `tools` | data for the data-driven pages |
| `goatcounter_code` | set → loads GoatCounter (no cookie banner) |
| `giscus_*` | set → GitHub-based comments under each post |

### Comments - Giscus (recommended)
Enable GitHub Discussions on a repo, install the [giscus app](https://giscus.app), copy the
generated `repo-id` / `category-id`, and fill the `giscus_*` keys in `config.toml`. Zero infra,
no database, fits a dev audience. (Prefer Waline if you need non-GitHub commenters - drop its
embed into `templates/page.html` where the giscus block is.)

### Analytics - GoatCounter
Create a GoatCounter site, set `goatcounter_code` to your subdomain. Lightweight, privacy-friendly.

### Search
Caret embeds a tiny JSON index of your writings in every page (`window.__SEARCH` in `base.html`)
and filters it client-side - no external library, no `build_search_index`. Press **⌘K** / **/**.
For very large blogs, switch to Zola's elasticlunr index instead.

### Syntax highlighting
See [Syntax Highlighting](https://www.getzola.org/documentation/content/syntax-highlighting/) @zola-docs.

## Turning this into a reusable theme

This repo is a working site. To use Caret across multiple sites, move `templates/`, `sass/`,
and `static/` into `themes/caret/`, keep `theme.toml` there, and set `theme = "caret"` in your
site's `config.toml`.

MIT licensed.
