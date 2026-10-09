# The Sol Devils — website

A single-page website for **The Sol Devils**, an independent Arizona State University athletics booster club (est. 1999). It follows the club-approved prototype and the decisions in Handoff V2: the real club logo, the 2026 schedule near the top, the Frasher's Smokehouse catering credit, concise impact summaries, few outbound links, and membership near the end.

The design direction is **"Private Club Heritage"**: ivory paper, deep maroon and sparing gold, with a fine engraved sun ("Sol") as the signature. The page opens on a **sunrise** (the stadium photograph rises as an arch from a maroon horizon) and closes on a **sunset** (the club's name, set across the full width, stands on the footer's horizon like a skyline while a half-sun sets behind "Sol"). In between: an engraved fixture card for the schedule, a candle-lit night section for the tailgate, the club's photographs as a contact sheet of mounted prints, and an invitation card with the club seal for membership.

> **Status: preview for club review, not launched.** The page is marked `noindex` (meta tag plus a `vercel.json` header) and `robots.txt` blocks crawlers, so it won't compete with the current site at thesoldevils.org.

## Structure

```
index.html                All page content (sections in scroll order)
assets/css/styles.css     Styles: design tokens at the top, then one numbered block per section
assets/js/main.js         Mobile menu, condensed header, active nav link, schedule auto-archive, fade-in
assets/fonts/*.woff2      Self-hosted web fonts (see Fonts); assets/fonts/OFL.txt is their licence
assets/img/favicon.svg    Placeholder favicon (sun on the horizon)
vercel.json               Hosting config (clean URLs, security headers, noindex header)
robots.txt
```

There's no build step and no dependencies. To preview locally:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Editing

- **Text:** edit `index.html`. Sections in order: hero (`#top`), mission line, `about`, `schedule`, `tailgate`, `impact`, `photos`, `sponsorship`, `membership`, footer.
- **Colours, sizes and fonts:** change the CSS variables in `:root` near the top of `assets/css/styles.css`. Gold (`--gold`) is for rules and ornaments only; for gold-coloured text on light paper use `--bronze`, which passes WCAG AA.
- **Layout grid:** every two-column section sits on one 12-column grid (`--container` 1240px, `--col-gap` 32px). Left-hand headings and copy use columns 1–7; everything on the right (standfirsts, the Tillman print, the tailgate copy, the featured-project card, the project notes, the sponsorship note, the footer links) starts on column 8, so they all share one line. Keep new right-hand content on `grid-column: 8 / -1`. The schedule is the one centred object: the fixture card and the catering strip beneath it sit on columns 2–11 (the full measure below 1180px).
- **Section openers:** About, Tailgate, Photos and Membership open centred or stacked; Schedule, Impact and Sponsorship open asymmetrically (heading left, standfirst on the split line). In those, both columns hang from the top and the standfirst drops by the kicker's height (`--kicker-drop` on `.intro-split`), so its first line sits level with the heading's first line.
- **Photos and logos:** swap the `src` on the relevant `<img>`. If an image fails to load, the club logo falls back to a serif "The Sol Devils" nameplate, the caterer's logo to set type, and every photograph to a dusk panel with a low gold sun — never a broken-image icon. A failed photograph's credit (`<span class="credit">`, e.g. "Photo: Olsson") is hidden with it, so a placeholder is never credited to a photographer.
- **Photo crops:** photographs fill fixed shapes (`object-fit: cover`), so check each crop with the final files. The tailgate photograph runs the full height of the copy and fact file on wide screens, and the height of the copy on laptops (901–1179px, where the fact file sets as a four-up row under both columns); set `--tailgate-focus` (in the Tailgate block, e.g. `50% 30%`) to keep the band or crowd in view. The hero arch uses `object-position` on `.arch img`.
- **Hero arch:** the maroon horizon is calculated from the arch's width (`--arch-w` and `--arch-ratio` in the Hero block), so the semicircle always sits exactly on it. Change those two values rather than setting heights by hand.
- **Masthead:** from 1280px the crest sits centred between the two link groups. Every link sits toward the crest at one shared gap (`--nav-gap`), the two halves mirroring each other, and Member Login is pinned to the right margin. The crest hangs through the masthead's double rule on a round paper medallion (`--logo-h`, `--crest-hang`), sized from the logo's larger side. Check it with the final logo file; if the approved logo is a wide wordmark rather than a round crest, set `--crest-hang: 0px` and remove the `.logo::before` medallion.
- **Club Memories:** from 1180px the first print is the lead (the heading sits beside it, the other three prints along the foot); from 600 to 1179px the prints form a two-by-two sheet; on phones they become a sideways swipe strip with the next print peeking in (keyboard users can focus the strip and scroll it with the arrow keys). Keep the first `<div class="gallery-item">` for the strongest, highest-resolution photograph.
- **Hyphenated words** such as game-day and student-athletes are wrapped in `<span class="nowrap">` so a line never breaks at the hyphen; do the same for new ones.

### The football schedule and a new season

Each game is one row in the `schedule` section:

```html
<li class="game" data-date="2026-10-10">
  <p class="game-date"><span class="game-month">Oct</span> <span class="game-day">10</span></p>
  <div class="game-info"><h3>Hawai‘i</h3><p>Hall of Fame Game · Wear gold</p></div>
  <p class="game-time">7:30 PM</p>
</li>
```

- `data-date` (YYYY-MM-DD) drives everything automatically: once a game date has passed, the row is hidden and listed under "Earlier this season", and the first remaining game is lit as **Next home game**. The marker stays on a game through its whole game day and moves on the next morning (if the board would like "Today" wording on game days, that is a copy decision to make first). One or two played games show as a single line; from three onwards they show as a small results list (read down two columns, in date order). On a narrow phone, if any result's opponent would drop under its date, every row sets that way, so the list keeps one shape. Screen readers hear each upcoming game's full date with its opponent ("Hawai‘i, October 10, next home game"), built from `data-date`.
- If a row is mistyped (a bad `data-date`, a missing `<h3>`), the script leaves that row as written, logs the error to the browser console and carries on; the rest of the page still works and stays visible.
- **Fixture rows:** each kickoff time sits on its opponent's baseline at the end of the dotted leader, set flush right on the line where the row rules end. The next home game's wash and gold edge bar keep to the same measure as the rules. The cards share their spacing tokens on `.schedule-grid` (`--card-pad-x`, `--card-pad-top`, `--card-pad-bottom`, `--card-head-pb`), so the catering strip's copy starts on the same line as the fixture rows; change those tokens rather than the cards' own padding.
- **Kickoff:** for upcoming games write the time (`7:30 PM`) or `Time TBA`; unconfirmed times are set quietly in italics so confirmed kickoffs stand out. `Final` (as on the two 2026 games already played) is fine for past games, which are archived automatically and never show their time; if an upcoming row ever says "Final", the page shows "Time TBA" instead.
- **Subtitles** such as `Hall of Fame Game · Wear gold`: separate phrases with ` · `. On a narrow screen, if the phrases can't share a line, they are stacked rather than leaving a dangling dot.
- **After the last home game (off-season):** the card shows the whole season's results, the heading's words marked `data-season-over` switch from "Upcoming home games" to "2026 home games", and the standfirst's second sentence ("Below are the remaining home dates…", wrapped in `<span class="in-season">`) is hidden. Both changes only remove or reorder words already on the page. Ask the board whether they'd like different off-season wording; it lives in `index.html`, not in the script.
- **New season checklist** (every year, not only when something changes):
  - replace the game rows (dates, opponents, subtitles, kickoffs);
  - the nav link ("2026 Schedule"), the hero button ("View the 2026 Schedule");
  - the schedule kicker ("Football Season 2026"), the standfirst ("…ASU’s 2026 schedule"), the off-season heading (`data-season-over="2026 home games"`);
  - the fixture-card heading ("Home Games · 2026") and the list's screen-reader label (`aria-label="ASU 2026 home football games"`);
  - the catering kicker ("Our 2026 Catering Partner") and the catering note ("…throughout the 2026 season"), and the partner itself if it changes.
- Members can print the page: the print stylesheet keeps all of the text (the hero dateline, the club's values, the fixture list as one unbroken card, the catering note, the tailgate details, the impact projects, the Club Memories heading, the sponsorship note, the membership criteria and the Stay Connected links) and prints the web address after each outside link (Member Login, Instagram, the official ASU schedule, the photo gallery, sponsorship). It drops navigation, the photographs (the Club Memories prints among them) and the decorative seal and sunset, and fits on five Letter pages.

## Fonts

All fonts are self-hosted in `assets/fonts/` (no requests to Google), under the SIL Open Font License 1.1; the licence and copyright notices are in `assets/fonts/OFL.txt` and must stay with the files. To keep the download small (about 190 KB in total), each family was cut down to only the styles the design uses and to Latin characters:

| File | Family name in CSS | Used for |
| --- | --- | --- |
| `newsreader-text-400/600/400-italic` | `Newsreader Text` | Body copy, captions, notes |
| `newsreader-sub-430` (+ italic) | `Newsreader Sub` | 18–40px headings, opponents, list items |
| `newsreader-display-360` (+ italic) | `Newsreader Display` | Large headings, drop cap, footer nameplate |
| `instrument-sans-500/600` | `Instrument Sans` | Small tracked labels, navigation, buttons |
| `sol-devils-engraved` | `Sol Devils Engraved` | Engraved capitals: the hero dateline, the fixture card, catering card and seal (a subset of Marcellus) |

The five files needed for the first screen (Newsreader Display regular and italic, Newsreader Text regular, Instrument Sans 600 and Sol Devils Engraved, which sets the hero's dateline) are preloaded in `index.html`. Newsreader is used at three optical sizes so small text stays sturdy and large text stays refined. The files were generated from the Google Fonts originals with `fontTools` (pin each variable font to one optical size and weight, subset to Latin). If accented characters outside Latin-1 are ever needed, regenerate from the originals rather than switching fonts, and repeat the two adjustments below:

- **Marcellus** declares "Marcellus" as a Reserved Font Name, which the OFL says a modified copy may not use, so the subset is renamed **Sol Devils Engraved** (inside the file and in the CSS).
- **Newsreader Display** has its cap-height metric (`OS/2 sCapHeight`) set to 1488, the height of its "T", so the About section's drop cap (`initial-letter: 3`) meets line 1's cap line and line 3's baseline exactly.

## Accessibility & behaviour notes

- Reading sizes come in three steps on desktop: 19px body text, 18px in notes and cards, and 20px standfirsts (the hero lead and section intros); body text is 17.5px on phones. Small labels are never below 12.5px; kickoff times are 16px or larger. Colours meet WCAG AA, and the focus ring switches from maroon (on paper) to gold (on maroon and night grounds).
- The full navigation shows down to 1024px (crest centred between the two groups from 1280px, crest on the left from 1024 to 1279px). Below that, a **Menu** button (its word "Menu"/"Close" is always visible) opens a full-width sheet over a dimmed page: Escape or a tap outside closes it where you were (the page never jumps), focus returns to the button, Tab stays inside the open menu and the rest of the page is made `inert`. Choosing a link in the header (a menu link, the crest's "back to top") closes the sheet and goes where it points; Member Login opens in a new tab, so the sheet closes with this page left where it was and focus back on the Menu button. On phones held sideways the sheet sets its links in two columns so everything fits on screen.
- "Skip to content" lands the hero just below the condensed header. In Windows High Contrast mode the drawn icons (menu bars, arrows) are redrawn in system colours.
- Member Login is the filled maroon button with a lock: in the desktop masthead, in the header bar beside Menu on tablets and phones ("Login" on narrow phones; its full name is still announced), and as a full-width button in the menu sheet.
- The footer's large "The Sol Devils" over the setting sun is the club's wordmark (WCAG exempts logotypes from contrast minimums; a soft dark halo keeps the letters crisp where they cross the sun), and the name also appears as plain text in the fine print.
- If `main.js` fails to load, the whole page is still visible and, on phones, the links show as a plain row under the crest instead of a Menu button that would do nothing. The fallback appears as soon as the page is parsed, without waiting for photographs from slow hosts. If the script loads but one part of it fails (a mistyped schedule row, say), that part is skipped and logged, and the rest still runs: sections are only ever hidden for the fade-in once the code that reveals them is in place, so a script error can never leave the page blank.
- Motion is limited to a gentle fade as sections arrive and one slow "exposure" of the hero photograph as the sun rises (from a dusk grade to neutral), and is switched off entirely for visitors who prefer reduced motion.

## Before launch

**Assets and rights.** All of these are currently hotlinked design references:
- [ ] **Sol Devils logo** (Squarespace PNG from the current site). Get an SVG or high-res master and host it locally.
- [ ] **Hero stadium photo** (sundevils.com) needs permission or an approved file from Sun Devil Athletics. The arch crop favours the centre of a wide landscape image; check the crop with the final file.
- [ ] **Pat Tillman statue photo** (ASU News, Charlie Leight). Get permission. It is shown as ASU heritage only, not a club-funded project.
- [ ] **Camp Tontozona field photo** (Olsson). Request a licensed full-res image. Olsson designed the field; the Sol Devils led the fundraising.
- [ ] **Frasher's Smokehouse logo** needs an approved partner-logo file (it sits on a dark plate, so a light/reversed version works best). This is a catering credit, not a sponsorship tier.
- [ ] **Tailgate and gallery photos** are low-res stills from the old site. Request originals. One gallery image duplicates the tailgate photo.
- [ ] Favicon is a simple placeholder (a sun on the horizon). Replace it with one derived from the official logo.
- [ ] With the final files in place, check the masthead medallion around the real logo (see Masthead under Editing) and each photograph's crop (`--tailgate-focus`, `.arch img`).

**Content to confirm with the board**
- [ ] Which 2026 home games actually have club tailgates. Adjust the "Upcoming home games & tailgates" heading or rows to match. Reconfirm the kickoff times and themes.
- [ ] Football weight-room project: name, scope, date and amount. The current copy says "Additional project details forthcoming."
- [ ] Sun Angel Collective wording and the nature of the club's support (NIL/compliance).
- [ ] Tailgate details and admission policy, plus membership criteria and the 90-member cap.
- [ ] Sponsorship: the linked page on the old site still shows **2023** pricing. Replace it with a current packet or an inquiry contact.

**Launch steps**
- [ ] Remove the `noindex` meta tag in `index.html`, the `X-Robots-Tag` header in `vercel.json` and the `Disallow` in `robots.txt`. Add a canonical URL.
- [ ] Point thesoldevils.org at the new host, with domain/DNS access from the club. Keep the Wild Apricot member login (`thesoldevils.wildapricot.org`) as is.
- [ ] Remove the "DESIGN PREVIEW NOTES" comment at the bottom of `index.html`.
- [ ] Optional: rebuild the Photos and Sponsorship destinations on this site so visitors no longer jump to the old design.
