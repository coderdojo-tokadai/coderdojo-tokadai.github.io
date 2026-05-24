# CoderDojo Tokadai — Project Guide for Claude

## Project Overview

Static HTML website for **CoderDojo Tokadai** (桃花台), a free programming club for children aged 7–17 in the Tokadai area (eastern Komaki, Kasugai, Kozoji). Activities are planned to launch summer 2026.

## File Structure

```
index.html      Top page (hero, about, features, curriculum, next event, stats, volunteer CTA)
news.html       News & announcements list
venue.html      Venue information and access map
contact.html    Contact / registration form
mentor.html     Mentor recruitment page
style.css       Shared stylesheet (rarely needs editing)
script.js       Runtime JS: animations, season effects, form handling
events.js       ★ Event schedule data — update this for every new session
i18n.js         ★ Multilingual text — update when adding/changing UI text
favicon*.svg    Page-specific favicons
運用方法.txt    Operations guide (Japanese)
scripts/
  check-i18n.py       i18n consistency checker
  hook-check-i18n.sh  Pre-edit hook that runs check-i18n.py automatically
.claude/
  settings.json       Hook configuration
```

## Session Schedule

**Time: 13:30 – 15:30 (2 hours)**
- 13:15 — Mentor gathering & prep
- 13:30 — Start / Ninja check-in
- 13:45–15:10 — Coding time
- 15:10–15:25 — Showcase & share
- 15:30 — End / Mentor reflection

Frequency: once a month, on a Sunday.

## Key Rules

### Always update events.js for schedule changes
`events.js` is the single source of truth for the next session. All pages pull from it via `data-ev` attributes. Set `tbd: false` and fill in `date`, `dayOfWeek`, `connpassUrl` when the session is confirmed.

### i18n.js is the single source of truth for UI text
All translatable text lives in `i18n.js` under keys `ja`, `en`, `pt`, `vi`, `es`, `zh`. Whenever you add a `data-i18n` or `data-i18n-html` attribute to HTML, add the corresponding key to **all six** language sections. The HTML element's text content must match `i18n.js[ja]` exactly (verified by the pre-edit hook).

### Running the i18n check manually
```bash
python3 scripts/check-i18n.py
```
Expected output: `i18n check: OK — all keys present and ja defaults match`

### venue.html and news.html have hard-coded content
- `venue.html` — address, map iframe src
- `news.html` — individual article bodies (not i18n-ized)

Edit these files directly without touching i18n.js.

### contact.html has a hard-coded time string
The "next session" reminder box inside `contact.html` contains a plain-text time string (not `data-ev` or `data-i18n`). Update it manually when the session time changes.

## Supported Languages

| Code | Language   |
|------|------------|
| ja   | Japanese (default) |
| en   | English    |
| pt   | Portuguese |
| vi   | Vietnamese |
| es   | Spanish    |
| zh   | Chinese (Simplified) |

## Common Tasks

### Update the next session date
1. Open `events.js`
2. Set `tbd: false`, fill in `date` (`YYYY-MM-DD`), `dayOfWeek`, `connpassUrl`

### Add a news article
Open `news.html`, add an `<article class="news-card ...">` block at the top of `#newsList`. See `運用方法.txt` §2 for the template.

### Change UI text
Edit the relevant key in `i18n.js` across all six language sections. Run `python3 scripts/check-i18n.py` to confirm.

### Update venue details
Edit `venue.html` directly (address `<dd>`, map `<iframe src="...">`).
