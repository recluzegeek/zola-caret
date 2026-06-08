# Caret

A Zola theme with an **editorial-serif voice** and a **terminal-mono machine layer.**
Newsreader for everything you read; JetBrains Mono as a deliberate accent for the `~/` logo, nav, dates, labels, code, and the `whoami` terminal block.

The name is the blinking terminal cursor _and_ the proofreader's insertion mark — the theme's two halves.

> **Features:** warm-gray palette + one configurable accent · light/dark toggle · client-side search (titles, tags **and** content) · year-grouped archive · tags · publications page (TL;DR, clickable tags, copy-citation, image tap-to-zoom) · resume page · `figure` & `video` shortcodes · full-screen mobile menu · animated TOC indicator · RSS · GoatCounter · Giscus.

## Install

Requires **Zola ≥ 0.18** — [install guide](https://www.getzola.org/documentation/getting-started/installation/).

```bash
git clone https://github.com/recluzegeek/zola-caret.git my-site
cd my-site
zola serve            # live reload → http://127.0.0.1:1111
```

Then make it yours — **everything lives in `config.toml`**:

1. **Identity** (§2): `logo`, `prompt`, `name`.
2. **Bio & role** (§3, §7): `eyebrow`, `bio`, `role`.
3. **Nav & socials** (§5, §6): add/remove `[[extra.nav]]` and `[[extra.socials]]`.
4. **Write a post**: drop a `.md` in `content/writings/` (frontmatter below).
5. **Data pages**: fill `[[extra.experience]]`, `[[extra.education]]`, `[[extra.skills]]`, `[[extra.publications]]`.

```toml
+++
title = "My first post"
date  = 2026-06-01
[taxonomies]
tags = ["linux", "notes"]
[extra]
dek = "One-line summary shown in lists and search."
+++
```

`zola serve` picks it up immediately — archive, tags, search index, and homepage list all update automatically.

## Build & deploy

```bash
zola build                       # → public/
rsync -avz public/ user@host:/var/www/site/
# or drop public/ into Netlify / Cloudflare Pages
```

## Where things live

```
config.toml        ← all your data and settings (start here)
content/           ← posts (writings/*.md) + page data stubs
sass/partials/     ← tokens.scss (retheme here) + per-area styles
templates/         ← base, page, section, data pages, macros/, shortcodes/
static/            ← self-hosted fonts + js/theme.js
```

## Docs

Full guides — adding icons, fonts, shortcodes, the publications fields,
analytics, comments, macros, packaging as a reusable theme, and the
roadmap — live in **[DEVELOPMENT.md](DEVELOPMENT.md)**.

MIT licensed. Spiritually indebted to Zola's [Apollo](https://www.getzola.org/themes/apollo/), Astro's [Pure](https://github.com/xiaohanyu/astro-paper), and the restraint of [thedataquarry.com](https://thedataquarry.com/).
