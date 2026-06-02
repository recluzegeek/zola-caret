+++
title = "Why I moved my blog from Astro to Zola"
date = 2026-05-28

[taxonomies]
tags = ["zola", "webdev", "linux"]

[extra]
dek = "Trading a JS framework for one static binary — and why the framework mattered less than I expected."
+++

I'd been on Astro with the astro-paper theme for a while and liked it. But I kept reaching for a single, dependency-free binary I could drop on any box — no `node_modules`, no lockfile drift. [Zola](https://www.getzola.org/) is exactly that, so I spent a weekend migrating.

## The case for a single binary

Zola ships as one executable. Build times are in milliseconds, and I can rebuild the whole site inside a tiny KVM guest without provisioning a JS toolchain first. For a content site that's mostly Markdown, the runtime complexity of a framework wasn't paying for itself.

> The best stack is the one you can still rebuild in two years without an archaeology dig.

## Migrating the content

My posts were already Markdown with frontmatter, so most of the work was mapping fields. A short script rewrote the frontmatter keys Zola expects:

```toml
+++
title = "Notes from a slow CI weekend"
date = 2026-04-02
[taxonomies]
tags = ["ci", "python"]
+++
```

### Templating in Tera

Apollo's templates use Tera, which felt familiar coming from Jinja. Overriding a block to add reading time and a table of contents was a few lines:

```html
{% block content %}
  {{ page.reading_time }} min read
  {{ page.toc }}
{% endblock %}
```

## Performance

Cold builds dropped from a couple of seconds to well under 100ms, and deploys are now just rsync of a static folder. GoatCounter handles analytics without a cookie banner, and comments are wired up separately.

- No client JS unless I opt in per-page
- Lighthouse 100s without trying
- One binary in CI, no cache to warm

## What I'd do differently

I'd port the design system first, then content — I did it the other way and reworked styles twice. If you're on the fence: the framework matters less than committing to a look you'll actually want to maintain.
