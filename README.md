# The Sol Devils — website

A refreshed single-page website for **The Sol Devils**, an independent Arizona State University athletics booster club (est. 1999). It follows the club-approved prototype and the decisions in Handoff V2: the real club logo, the 2026 schedule near the top, the Frasher's Smokehouse catering credit, concise impact summaries, few outbound links, and membership near the end. On top of that it adds a more refined design layer and a cleaner build.

> **Status: preview for club review, not launched.** The page is marked `noindex` (meta tag plus a `vercel.json` header) and `robots.txt` blocks crawlers, so it won't compete with the current site at thesoldevils.org.

## Structure

```
index.html            All page content (sections in scroll order)
assets/css/styles.css Styles (design tokens at the top)
assets/js/main.js     Mobile menu, sticky header, active nav, schedule auto-archive, fade-in
assets/img/favicon.svg
vercel.json           Hosting config (clean URLs, security headers, noindex header)
robots.txt
```

There's no build step and no dependencies. To preview locally:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing

- **Text:** edit `index.html`. Sections in order: hero, mission, `about`, `schedule`, `tailgate`, `impact`, `photos`, `sponsorship`, `membership`, footer.
- **Football schedule:** each game is an `<li class="game" data-date="YYYY-MM-DD">` in the `schedule` section. Once a game date has passed, the page moves it automatically into the "Earlier this season" line and marks the next game. For a new season, replace the rows and update the year in the nav, the heading and the hero button.
- **Colors and fonts:** change the CSS variables in `:root` at the top of `assets/css/styles.css`.
- **Photos and logos:** swap the `src` on the relevant `<img>`. If a remote image fails to load, logos fall back to text and photos fall back to a solid panel, never a broken-image icon.

## Before launch

**Assets and rights.** All of these are currently hotlinked design references:
- [ ] **Sol Devils logo** (Squarespace PNG from the current site). Get an SVG or high-res master and host it locally.
- [ ] **Hero stadium photo** (sundevils.com) needs permission or an approved file from Sun Devil Athletics.
- [ ] **Pat Tillman statue photo** (ASU News, Charlie Leight). Get permission. It is shown as ASU heritage only, not a club-funded project.
- [ ] **Camp Tontozona field photo** (Olsson). Request a licensed full-res image. Olsson designed the field; the Sol Devils led the fundraising.
- [ ] **Frasher's Smokehouse logo** needs an approved partner-logo file. This is a catering credit, not a sponsorship tier.
- [ ] **Tailgate and gallery photos** are low-res stills from the old site. Request originals. One gallery image duplicates the tailgate photo.
- [ ] Favicon is a simple placeholder "SD" monogram. Replace it with one derived from the official logo.

**Content to confirm with the board**
- [ ] Which 2026 home games actually have club tailgates. Adjust the "Upcoming home games & tailgates" heading or rows to match. Reconfirm the kickoff times and themes.
- [ ] Football weight-room project: name, scope, date and amount. The current copy says "Additional project details forthcoming."
- [ ] Sun Angel Collective wording and the nature of the club's support (NIL/compliance).
- [ ] Tailgate details and admission policy, plus membership criteria and the 90-member cap.
- [ ] Sponsorship: the linked page on the old site still shows **2023** pricing. Replace it with a current packet or an inquiry contact.

**Launch steps**
- [ ] Remove the `noindex` meta tag in `index.html`, the `X-Robots-Tag` header in `vercel.json` and the `Disallow` in `robots.txt`. Add a canonical URL.
- [ ] Point thesoldevils.org at the new host, with domain/DNS access from the club. Keep the Wild Apricot member login (`thesoldevils.wildapricot.org`) as is.
- [ ] Optional: rebuild the Photos and Sponsorship destinations on this site so visitors no longer jump to the old design.
