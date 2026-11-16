# Fiverr Gig Stats Tracker

A single-page web app that tracks Fiverr gig performance — daily impressions
and clicks per gig, the best day, a gig comparison, and the 30-day totals —
so a new seller can see which gig is actually being seen.

Built by **Tasleem Bibi** (final-year BSCS, Sukkur, Sindh, Pakistan) as a
unique, practical project for her own Fiverr account @taslem_services: three
active gigs, 69 impressions in the last 30 days, 1 click, 0 orders yet — and
no clear picture of which gig was getting the views.

## How to run

No build step and no server needed:

1. Open `index.html` in any modern browser (double-click it, or serve the folder).
2. The tracker comes pre-filled with the demo example: **three sample days**
   (6 Nov: 6 impressions, 7 Nov: 9, 8 Nov: 5 — real account totals from
   Fiverr analytics).
3. Log each day's numbers with the form — per gig, or one account total.
4. The best day, the 7-day chart and the gig comparison update instantly.
5. Your log is saved in your browser (localStorage), so it is still there
   when you come back.

## Features

- **30-day account totals** — impressions, clicks, orders, earnings.
- **Gig cards** — Responsive Website ($80 / $120 / $180), Landing Page
  ($80 / $110 / $150), Bug Fix & Maintenance ($15 / $20 / $35), each with
  its logged impressions and a "Best so far" badge.
- **Best day** highlight and a 7-day impressions bar chart.
- Daily log with add / remove, saved in the browser.
- **Gig health checklist** — profile strength, intro video, buyer-contact
  switch, and the road to the first order.
- Clean, professional design in dark navy and teal (TB branding),
  mobile-responsive. No personal photo, no fake logos.

## Demo result (pre-filled values)

On 16 November 2026 the demo log shows:

- **6 Nov 2026** — 6 impressions
- **7 Nov 2026** — 9 impressions (best day)
- **8 Nov 2026** — 5 impressions
- **30-day totals** — 69 impressions, 1 click, 0 orders, PKR 0

## Files

- `index.html` — page structure and the log form
- `style.css` — dark navy / teal styling, mobile-responsive
- `script.js` — log, totals, best day, chart and localStorage saving
- `README.md` — this file

## Note

This is a demo tracker. The sample numbers are real account totals, not a
promise of orders — never share your Fiverr password, bank detail or payout
information in a tracker or a public post. Always check Fiverr itself for
the final numbers.
