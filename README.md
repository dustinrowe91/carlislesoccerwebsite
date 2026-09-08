# Carlisle Soccer Club Website

Static site (plain HTML/CSS/JS, no build step) for Carlisle Soccer Club, a
recreational youth soccer club in Carlisle, Iowa.

## Running locally

The header/footer and news/sponsor/gallery content load via `fetch()`, which
requires the site to be served over HTTP — opening `index.html` directly from
disk (`file://`) will not work. From the project root, run any static server, e.g.:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Structure

- `index.html`, `registration.html`, `schedules.html`, `news.html`,
  `gallery.html`, `sponsors.html`, `about.html` — pages
- `partials/header.html`, `partials/footer.html` — shared nav/footer, injected
  into every page by `js/main.js` (edit these once to change nav/footer sitewide)
- `css/styles.css` — all styling, using CSS custom properties in `:root` for
  the color theme
- `js/main.js` — loads partials, wires up mobile nav, and renders the
  JSON-driven content below
- `data/news.json` — news/announcement posts (add a new object to the array
  to publish a post)
- `data/sponsors.json` — sponsor tiers and names
- `data/gallery.json` — gallery captions (currently colored placeholders;
  see TODO below)

## Content still needed (marked `TODO` throughout the site)

- Real registration link/platform, season dates, fees, and age-group details
  (`registration.html`)
- Schedule/standings source — a league platform embed, or a manually updated
  table (`schedules.html`)
- Real sponsor names, logos, and links (`data/sponsors.json`)
- Real season photos to replace the colored gallery placeholders
  (`data/gallery.json`, `gallery.html`)
- Board/contact names, emails, and field address (`about.html`,
  `partials/footer.html`)
- Club mission statement (`about.html`)

## Possible next steps

If non-technical board members need to edit content without using git, a
git-backed CMS (e.g. Decap CMS) can be layered on top of this same file
structure without a rebuild.
