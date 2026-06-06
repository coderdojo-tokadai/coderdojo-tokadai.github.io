# Tokadai Code Club — Project Guide for Claude

## Project Overview

Static HTML website for **Tokadai Code Club** (桃花台), a free programming club for elementary through high school children (小学生〜高校生) in the Tokadai area (eastern Komaki, Kasugai, Kozoji). The kickoff "preparatory meeting" (第0回 準備会) is set for 2026-08-30.

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
i18n.js         Multilingual runtime (language switch & apply; no text lives here)
i18n/           ★ Per-language UI text — *.json for ja, en, pt, vi, es, zh, id
favicon*/logo*  Page-specific favicons & logo (SVG / PNG)
運用方法.md    Operations guide (Japanese)
scripts/
  check-i18n.py       i18n consistency checker
  hook-check-i18n.sh  Post-edit (PostToolUse) hook that runs check-i18n.py automatically
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

Held on a Sunday.

## Key Rules

### Always update events.js for schedule changes
`events.js` is the single source of truth for the next session. All pages pull from it via `data-ev` attributes — never hard-code a date/venue/status string in HTML or i18n. To confirm a session, set `tbd: false` and fill in `date`, `startTime`/`endTime`, `venue`, `connpassUrl`. Day-of-week, season emoji, and the "○月" label are auto-derived from `date`. Optional fields (`label`, `kind`, `audience`, `capacity`, `fee`, `deadline`/`deadlineTime`, `summary`) render automatically where present and are omitted when blank.

### i18n/*.json is the single source of truth for UI text
All translatable text lives in `i18n/<lang>.json` — one file per language: `ja`, `en`, `pt`, `vi`, `es`, `zh`, `id`. Whenever you add a `data-i18n` or `data-i18n-html` attribute to HTML, add the corresponding key to **all seven** language files. The HTML element's text content must match `i18n/ja.json` exactly (verified by the post-edit hook).

### Running the i18n check manually
```bash
python3 scripts/check-i18n.py
```
Expected output: `i18n check: OK — all keys present and ja defaults match`

### venue.html and news.html have hard-coded content
- `venue.html` — map iframe src (the address is i18n-managed via the `venue-dd-address` key)
- `news.html` — individual article bodies (new articles are not i18n-ized; edit directly)

Edit these directly. Exception: the venue address lives in all seven `i18n/*.json` (`venue-dd-address`), not in `venue.html`.

### Event facts are data-ev driven (no hard-coded dates)
The "next session" boxes on `index.html`, `contact.html`, `venue.html`, and `news.html` render date/time/venue/status from `events.js` via `data-ev` (e.g. `status-line`, `date-short`, `date-text`, `deadline`, `audience`). The HTML text is only a no-JS fallback. Change the event in `events.js`, not the page text.

## Supported Languages

| Code | Language   |
|------|------------|
| ja   | Japanese (default) |
| en   | English    |
| pt   | Portuguese |
| vi   | Vietnamese |
| es   | Spanish    |
| zh   | Chinese (Simplified) |
| id   | Indonesian |

## Common Tasks

### Update the next session date
1. Open `events.js`
2. Set `tbd: false`, fill in `date` (`YYYY-MM-DD`), `startTime`/`endTime`, `venue`, `connpassUrl` (day-of-week & season auto-derived; add optional `label`/`audience`/`deadline`/etc. as needed)

### Add a news article
Open `news.html`, add an `<article class="news-card ...">` block at the top of `#newsList`. See `運用方法.md` §2 for the template.

### Change UI text
Edit the relevant key in each `i18n/<lang>.json` (all seven languages). Run `python3 scripts/check-i18n.py` to confirm.

### Update venue details
- Address: edit `venue-dd-address` in all seven `i18n/*.json`, then run the i18n check.
- Map: edit the `<iframe src="...">` in `venue.html` directly.
