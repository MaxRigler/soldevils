# The Sol Devils — website

A refreshed single-page website for **The Sol Devils**, an independent Arizona State University athletics booster club (est. 1999). It polishes the "Version 2" prototype the club approved: same structure, palette and tone, with more refined execution.

> **Status: preview for club review, not launched.** The page is marked `noindex` and `robots.txt` blocks crawlers, so it won't compete with the current site at thesoldevils.org.

## Structure

```
index.html            All page content
assets/css/styles.css Styles (design tokens at the top)
assets/js/main.js     Mobile menu, sticky header, active-section nav, fade-in
assets/img/favicon.svg
vercel.json           Hosting config (clean URLs, security headers, noindex header)
robots.txt
```

There's no build step and no dependencies. To preview locally:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing

- **Text:** edit `index.html`. Each section is a clearly labeled `<section>` with an `id` that matches the nav (`about`, `impact`, `membership`, `tailgate`, `sponsorship`, `photos`).
- **Colors and fonts:** change the CSS variables in `:root` at the top of `assets/css/styles.css`.
- **Photos:** swap the `src` on the relevant `<img>`. Keep the `alt` text descriptive. If an image fails to load, the page shows a maroon or neutral panel in its place, never a broken-image icon.

## Before launch (from the handoff)

**Photos and rights**
- [ ] Hero stadium photo: hotlinked from sundevils.com for design reference only. Get permission or an approved file from Sun Devil Athletics, then host it locally in `assets/img/` (WebP/AVIF plus a JPG fallback).
- [ ] Pat Tillman statue photo: hotlinked from ASU News (credit Charlie Leight/ASU News). Get permission. It is shown as ASU heritage only, not a club-funded project.
- [ ] Tailgate and gallery photos: low-res stills from the old Squarespace site. Request original high-res club photos.
- [ ] Official Sol Devils logo (SVG). The pitchfork mark in the header is a placeholder concept.

**Content to confirm with the board**
- [ ] Impact figures: $1M field (2019), $25,000 graphics (2016), $250,000 in 48 hours toward $400,000 trams (2013).
- [ ] Tailgate details: southwest entrance, three hours before kickoff, 600–1,000 guests.
- [ ] Membership criteria and the 90-member cap.
- [ ] Sponsorship: the linked page on the old site still shows **2023** pricing. Replace it with a current packet or an inquiry contact.

**Launch steps**
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from `index.html`, the `X-Robots-Tag` header in `vercel.json`, and the `Disallow` in `robots.txt`.
- [ ] Remove or shorten the "redesign preview" notice in the footer.
- [ ] Point thesoldevils.org at the new host, with domain/DNS access from the club. Keep the Wild Apricot member login (`thesoldevils.wildapricot.org`) as is.
- [ ] Optional: build out the "Read more" destinations as pages on this site so visitors no longer jump to the old design.
