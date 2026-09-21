---
name: C4 Studios
description: The bench. Evidence laid out on warm paper, proof on proof stock, one red that means start.
colors:
  bench: "#F7F5F2"
  bench-alt: "#F0EDE8"
  sheet: "#FFFFFF"
  ink: "#1A1A1A"
  ink-muted: "#6B6A64"
  ink-subtle: "#908E88"
  ink-faint: "#B0ADA8"
  rule: "#DDDBD7"
  rule-light: "#ECEAE6"
  start: "#C23030"
  start-hover: "#A82828"
  proof-ground: "#F4ECE3"
  proof-sheet: "#FFF8F2"
  proof-rule: "#E7D7C9"
  proof-ink: "#241B18"
  proof-muted: "#6F5F57"
  proof-accent: "#B33A3A"
  selection: "#E9DACB"
  dark-bench: "#0F1115"
  dark-bench-alt: "#161A21"
  dark-ink: "#ECE7DE"
  dark-ink-muted: "#A7ABB4"
  dark-start: "#B33A3A"
  dark-caret: "#E06A5F"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "clamp(2.5rem, 1.9rem + 2.9vw, 3.75rem)"
    fontWeight: 660
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 97"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.7vw, 2.1875rem)"
    fontWeight: 680
    lineHeight: 1.18
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 94"
  body:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "-0.006em"
  instrument:
    fontFamily: "'B612 Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.04em"
    fontFeature: "'tnum', 'zero'"
rounded:
  edge: "2px"
  sheet: "3px"
  door: "4px"
  pill: "999px"
spacing:
  rhythm: "1.9rem"
  gutter: "1.5rem"
  gutter-wide: "3rem"
  container: "1400px"
  measure: "34rem"
  measure-wide: "42rem"
components:
  button-start:
    backgroundColor: "{colors.start}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "16px 38px"
    height: "56px"
  button-start-hover:
    backgroundColor: "{colors.start-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bench}"
  stamp:
    backgroundColor: "{colors.proof-sheet}"
    textColor: "{colors.proof-muted}"
    typography: "{typography.instrument}"
    rounded: "{rounded.edge}"
    padding: "0.3rem 0.6rem"
  stamp-pressed:
    backgroundColor: "{colors.proof-ink}"
    textColor: "{colors.bench}"
  proof-sheet:
    backgroundColor: "{colors.proof-sheet}"
    textColor: "{colors.proof-ink}"
    rounded: "{rounded.edge}"
    padding: "clamp(1.6rem, 3.4vw, 2.4rem) clamp(1.4rem, 3vw, 2.2rem)"
---

> **DRAFT, 8 September 2026.** Written from what the code already does, not from what anyone wished it did. Nothing here is committed. Where this file and a component disagree, the component is the incumbent and the disagreement is listed under *Do's and Don'ts* as a drift to close. Values are the ones in `globals.css`; where `ThemeContext.jsx` overrides them inline at runtime with different numbers, that is recorded as a fault, not a second truth.

## Overview

**The direction, said out loud: the bench.** A studio bench with the job's evidence laid out on it for inspection. Warm paper is the ground. Ink is the voice. One red exists and it means *start*. Anything that is evidence (a client's words, a source, a verified figure, a published price) sits on a warmer stock with its own edge, so a reader can tell a proof from a remark at arm's length. The four arms are material samples set down on that bench: a circuit board, a chalkboard, a lens barrel, a white gallery wall. They may be as loud as their material is. They may not repaint the bench.

The reference is the print room's proof table, not the courtroom and not the boardroom: the place a proof sheet is checked against the brief before the run. It fits a studio whose whole position is showing its working, because the bench is where working is shown.

**The scene that decides the rest.** A partner in a Perth accounting firm, on a laptop, in daylight, sent the link by someone they trust. They are reading to decide whether this studio will embarrass them. Every choice below is tested against that reader: they do not need to be impressed, they need to be able to check.

**Reflexes refused.** First reflex for "web studio": dark hero, gradient, oversized grotesque, case-study cards. Second reflex for "web studio, honest": brutalist monospace and raw borders. Third, for "studio selling to accountants": board paper and a luxury serif. All three are saturated and none are this. The site's own log records that a drawing-set register was tried on a conversion page and rejected as rigid; that verdict stands. Committed material worlds win on conversion pages, and the bench stays quiet underneath them.

**Modes.** `/`, the arm pages, `/c4i` and `/private-ai` persuade. `/insights` and every article are read. `/Portfolio`, a case study and `/Lens` are experienced. `/start`, `/Support` and `/Contact` are operated. The mode sets how much of the bench shows through: nearly all of it on a reading surface, almost none of it inside a Lens spread.

## Colors

Strategy: **restrained**. Neutrals carry the surface; red is identity and the start action only; proof stock is evidence only. The arms take *committed* or *drenched* strategies inside their own bounds.

| Role | Light | Dark | Meaning |
|---|---|---|---|
| Bench | `#F7F5F2` | `#0F1115` | Page ground. Warm, never white; charcoal, never black. |
| Bench, alt | `#F0EDE8` | `#161A21` | A recessed band. Lintels, rails, the software register. |
| Sheet | `#FFFFFF` | `#161A21` | A card that is actually an object (a frame, a plate, a field). |
| Ink | `#1A1A1A` | `#ECE7DE` | Headings, body on the bench. 14.9:1 / 14.6:1. |
| Ink, muted | `#6B6A64` | `#A7ABB4` | Secondary prose. 4.99:1 / 8.4:1. The floor, not a target: long reading uses `--prose` (`#3D3C38`, 10.15:1). |
| Ink, subtle | `#72706A` | `#7D8290` | Lifted 9 Sep from `#908E88` (3.01:1) to 4.55:1. The step below muted is size and weight, not a lighter grey. Still not for running prose. |
| Rule | `#DDDBD7` | `rgba(236,231,222,.12)` | Hairlines. |
| Start | `#C23030` | `#B33A3A` | The one red. Start-a-project, the caret, the back ribbon, the ledger numeral. White on it: 5.6:1 / 5.9:1. |
| Proof ground | `#F4ECE3` | `#101319` | A recessed *section* on proof stock (testimonials). |
| Proof sheet | `#FFF8F2` | `#171C23` | A raised *panel* on proof stock (a quote, the ledger, the stamp). Lifts in both themes; the ground does not. |
| Proof ink / muted / accent | `#241B18` / `#6F5F57` / `#B33A3A` | `#ECE7DE` / `#AAB0BA` / `#C7665F` | Text on proof stock. |
| Selection | `#E9DACB` | `rgba(236,231,222,.18)` | Picking up text is picking up evidence: it lifts onto proof stock. |

**Rules that follow from the meanings.**

- Red appears on a page for one reason: this is where you start. A red numeral in a ledger is the exception that proves it (it points to where a figure starts). Red never marks error on this site; errors use plain ink and the words.
- Proof stock is reserved. A block on proof stock is a claim someone can check: a quote from a document, a source, a verification date, a testimonial reproduced in full, a published price. Nothing decorative goes on it.
- A token named `bg` is a ground; a token named `surface` is a panel. In dark they differ by 1.02:1 and are not interchangeable. This was measured the hard way on the article ledger.
- Both themes are first-class. Dark is the same bench under studio lamps, not an inversion: warm off-white ink on charcoal, the red one step softer, the proof stock a raised tint rather than a warmer paper.
- **One source of truth.** The palette is defined in `globals.css` (light on `:root`, dark on `:root.dark-mode` and the OS-preference block). It is also re-declared inline by `ThemeContext.jsx`, and the two have drifted in twelve values, including `--c4-text-muted` (`#6B6A64` in CSS, 4.99:1; `#76756F` inline and therefore live, about 4.25:1). The inline tables went on 9 September 2026; the class is the mechanism.
- Arms may pin the chrome dark or light while their world is open. They do it today by re-declaring twenty-one bench tokens with `!important` in three files. The intended mechanism is one `data-chrome` attribute on `<html>` with one block in `globals.css`.

## Typography

Two faces carry the bench. The arms may bring their own material faces and use them only inside their own bounds and on their door on the home page.

**Archivo** (self-hosted, variable weight 100–900 and width 62–125%) is the voice. It replaced Inter on 2 September 2026 and stays. Hierarchy comes from its axes, not from a second family: display at weight 660 and width 97, headings at 680 and 94, body at 400. Tracking tightens with size and never goes below -0.04em. Display never exceeds 6rem.

**B612 Mono** (self-hosted, 400 and 700) is the instrument face. It was drawn for cockpit displays, to be read at a glance under load, which is the right story for a face whose only job here is figures: prices, dates, counts, captions, source numbers, the byline, the stamp. It is always tabular. It is never used as a costume for "technical", and never as a tracked capital eyebrow above a heading.

**What the arms bring, and where it stops.**

| Face | Belongs to | May appear |
|---|---|---|
| Bebas Neue | C4 Lens | `/Lens`, and the Lens door on `/` |
| Caveat | C4 Lens (grease pencil), C4Site (the margin hand) | Those two worlds only. Never a heading, never body. |
| Bricolage Grotesque | C4Site (renamed from C4Sight on 14 Sep 2026; the route stays `/Foresight`) | `/Foresight`, the training pages, and the Site door on `/` |
| Geist, Geist Mono, Instrument Serif | C4 Lens as shipped | Left as they are: Lens is a sealed world and its owner has said so. |

**Retire from the bench, with the evidence.** `Geist` is the body face of `/` and `/Contact` while Archivo is their display face: two grotesques with the same job on one page, the pairing the article stylesheet already calls indecision. `Geist Mono` runs captions and consoles on `/`, `/Contact`, `/c4i`, `/private-ai` and `/ServiceWeb` while B612 Mono runs the same job on `/`, `/ServiceAI`, `/c4i` and every article; the home page loads both monos for one caption grammar. `Instrument Sans` is the body of `/private-ai` for no reason Archivo cannot serve. `Instrument Serif` is declared in four `@font-face` rules and used by no rule at all. The bench set after the change is Archivo and B612 Mono; families loaded on `/` fall from five to four, on `/Contact` and `/private-ai` from three to two.

**Scale for reading** (articles, and any page that asks to be read): 13 / 15 / 18 / 20–22 / 28–35 / 40–60 px, ratio about 1.25, body 18px at 1.7, measure 34rem (about 63 characters), rhythm 1.9rem. Sizes in rem so the reader's browser preference scales them.

## Layout

Container 1400px with 1.5rem gutters, 3rem from 768px. Reading column 34rem centred; quotes, tables and the ledger may take 42rem. Section rhythm is asymmetric: more space above a heading than below it, a heading belongs to what follows.

Structure rules the bench keeps regardless of page:

- No eyebrow above a heading. The heading carries itself. (This is a ban with no exception; `PageHero`'s `label` prop is the site's remaining source of them.)
- No 01 / 02 / 03 unless the numbers are the content, as in a numbered process or a source ledger.
- No identical card grid as the page's structure. Options are ruled rows or material doors. Cards are objects (a frame, a plate, a field), never containers for text, and never nested.
- The order hero, three cards, testimonials, pricing, call-to-action is predicted, not designed. If a page drifts into it, one section must own each screen instead.
- Every tappable thing clears 44px. Every image has alt text. Every page has one `h1`.

## Elevation & Depth

The bench is flat. Depth belongs to objects that could be lifted off it: an evidence frame (`0 18px 44px -24px` at 35% black), a plate on hover (`0 26px 60px -30px` at 40%), the red button's cast on hover (`0 18px 38px -16px` of the red at 55%). Every shadow has an offset and a soft blur; a zero-offset halo is decoration and is not used. Proof stock lifts by its edge (a 1px `--c4-proof-border`), never by a contrast step, which is why it survives dark mode. Glass appears once, on the support rail, and should not spread.

## Shapes

Four radii and nothing else: 2px for edges on proof stock and fields, 3px for sheets and frames, 4px for doors and the skip link, a pill for the start button, chips and the door CTAs. The scale has held since the revamp and must not grow.

## Components

**Start button.** Solid red, white text, pill, 56px, uppercase 12.5px at 0.14em tracking. Hover lifts 2px with the red cast. It is the only large red object on a page. **Ghost button.** Pill, 1px ink rule, ink text; hover inverts to ink on bench.

**The stamp.** A proof-sheet chip in the instrument face carrying what was checked and when (`Figures verified 29 August 2026`). It renders only where the registry carries a `verified` date, so it can never appear on a page nobody re-checked. In the draft it is also the "show working" control: pressed, it inks (proof ink ground, bench-coloured text) and lifts the sources ledger beside the prose. An article with a ledger but no verified date gets the same control in its plain form (`4 sources, read at the document`), because the working exists whether or not the re-check has been logged. As of 8 September no live article carries `verified`; the ten that do are drafts.

**The ledger.** Sources as a first-class, numbered list on proof sheet, each with title, publisher, year and the link to the document. Numerals in the start red.

**Proof sheet.** Any verbatim primary source, set on proof sheet with the evidence label ("Primary source, verbatim") marked by a short 2rem red rule above it, never a coloured stripe down its side.

**Doors.** The four arms on `/` as material samples at doorway scale: a weave of real captures, a solder-mask board with copper traces, black behind a hairline aperture, chalk on board green. Each door is a sample of its arm's shipped identity, so the parent page never has to imitate four worlds.

**The articles index** (`/insights`). A wall of claims: each piece's dek is its one checkable statement and the index sets it large, the newest at display size under the short red evidence rule, the rest as a two-column ledger on hairlines. The title is the link; the ledger line carries date, length and the stamp where a verified date exists. It took the software section's place in the primary navigation on 9 September 2026 (nav label "Articles"), when the C4 Originals product line was cleared from the site.

**Back ribbon.** A red grosgrain tab fixed top-left on every page below the root, a real link to the hierarchical parent. Its label tells the truth about where it leads.

**The parts nobody draws** (`styles/marks.css`): selection on proof stock; the caret in the start red; focus as a 2px ink outline offset 3px, the same on every page; a 10px scrollbar with a 2px reveal of bench around the thumb; underlines offset 0.16em and drawn from the font; tabular figures in `time`, tables and anything marked as a figure; native controls in the accent; `color-scheme` set so the browser's own chrome follows the theme.

## Motion

**One authored moment per surface**, from an already-visible default, on the site's ease `cubic-bezier(0.22, 1, 0.36, 1)`. Reveals enhance; they never gate: under the prerender UA or `prefers-reduced-motion` the DOM default is the finished state, resolved synchronously (`useStaticMode`), never in an effect. This contract has caught three shipped faults and is not optional.

**What "one moment" means on the surfaces that have one.** `/`: none yet. The typed phrase is the candidate, but the "Evidence on Call" wall that `home.css` (lines 96 to 470: `.hm-frame`, `.hm-wall`, `.hm-ship`, `.hm-rail`, `.hm-tally`, `.hm-visit`, `.hm-startchip`) was written for is not rendered by any component; the shipped hero is a canvas texture plus the Quotr panel, and that stylesheet is dead until the hero is rebuilt. `/ServiceWeb`: the dive through the tablet into the shipped record. `/ServiceAI`: the board coming up under power as you scroll, and the integration board in the tools section (`src/components/ui/integration-card.jsx`, adapted on 10 Sep from a 21st.dev card into a module on the solder mask: ten tool nodes on two rails, orthogonal copper traces into the C4i core, a pulse on each net; category marks from lucide, never vendor logos; still under staticMode). It replaced the tools ticker and its pause control. `/Foresight`: a camera journey across a board of chalk letters, from HINDSIGHT through three places on the board to the name (round nine, below). `/Lens`: the focus pull, then the iris (the ring turns and the eye behind the glass sharpens over the first 40% of the hero's travel, the blades close over it in the next 50%, the shutter fires at the end; under reduced motion the eye rests sharp). The lens itself is three procedural rasters under `public/lens-tex/` (barrel, glass, iris), drawn as SVG in `scripts/lens-textures.mjs` and rendered once to WebP (run it to regenerate), so the page pays for texture at load, never per frame; only the focus ring, the f-stops, the blades and the pupil are live SVG. `/Lens` has two more moments. "We exist to capture the [word]" is high-vis paint put down fast with a brush (`src/components/lens/paintWord.js`, SVG): each letter arrives as one quick sweep of its body behind a bristled leading edge (a per-letter mask), the next starting before the last has finished, so a word lands in a little over a second; the body is the calligraphy face laid on thick (two shadow sides, a lit fill, bristle streaks, grain and a wet highlight), each letter a little off true; a few flecks leave the brush only while it moves and nothing lands after the last sweep, though the thickest letters run a drip. The original page's crayon shapes draw themselves around the word as it lands. Two earlier versions were turned down on 10 Sep (thick thrown paint with splatter after the fact; then a slow outline-then-fill draw: "too thick", "doesn't look like they're being naturally drawn"). The visitor's cursor, or finger, is a palette knife: through the word it pushes the paint forward, raises a lip, scrapes a groove to the black and throws flecks; off the word it lays down what it picked up (round eight, below). Prerender and reduced motion get the static SVG word instead. The ending is a Glyph Portal (`src/components/ui/glyph-portal.jsx`, Christian Katzmann's MIT component transcribed to JSX): the word LENS in Bebas Neue, and a scroll-driven camera that dives through one letter (the visitor can pick which) into the amber field where the call to action sits. It mounts only after Bebas has loaded; the prerenderer and reduced motion get the plain call to action. The four figures that sat under the paint stage (50+, 200+, <7, 100%) were removed on 10 Sep at Caleb's request; none had a source. An article: the stamp lifting the ledger. The boot in `index.html` is the one moment before any page: a red blob turning and changing shape until the bundle and the fonts are in, then settling into the C4 mark and lifting. Everything else on a page is state feedback (hover, focus, open, closed) or nothing.

**Reduced motion is a policy, not a kill.** Movement is removed; feedback stays. Colour, opacity, shadow and outline transitions keep 120ms so hover and focus remain legible; transforms and positional changes snap; continuous animations (the reel, the flag, the bricks, the typed cursor) stop. The previous global `0.01ms` rule destroyed the feedback along with the movement.

**Cost is measured, not assumed.** Continuous work at rest (a canvas redrawing, a ring spinning, a heading retyping) is a budget line and each one must earn it against the moment above.

## Do's and Don'ts

Do:

- Put every checkable thing on proof stock and give it its stamp, its number or its date.
- Set every figure in the instrument face, tabular.
- Let each arm be as loud as its material, inside its bounds.
- Test both themes and three widths before calling anything done. Composite alpha over the real ground before believing a contrast number.

Don't:

- Use a second grotesque next to Archivo, or a second mono next to B612, on the bench.
- Put an eyebrow above a heading, a number in front of a section, or a coloured stripe down a card.
- Use gradient text. The home page does not; `/ServiceWeb`'s display line does, by its owner's choice, and it is on the studio's own ban list. That is a decision for the owner, recorded here so it is not mistaken for a house style.
- Let `--c4-text-subtle` carry words, in either theme.
- Ship a figure without a source, or a testimonial that is not verbatim.

Closed later on 9 September 2026, also in the working tree: on `/Lens`, the § 01–06 section numbers, the rotating Caveat poem in the hero, the tracked service-list eyebrows, the five quoted card taglines and their fake spec strips, the FR-01 frame counters, the PKG — 01 ids, the histogram and EV meter (random numbers dressed as instruments), the 2.3:1 `--ink-3` (now 4.9:1), and the "limited clients each quarter / 48 hours" claims; the barrel gradient that had been painting over the glass, so the iris the page was built around is now actually visible. On `/Foresight`, the hero pill and the tracked worksheet brand strip. On `/ServiceWeb`, the concepts drum now sizes its stage from its cards (it used to rise into the heading and drop onto the note). Still open on `/Lens`, for its owner: the "Caleb Walker" credit (the brain has no Walker), the four unsourced figures in the capture strip, and the Caveat quote attributed to Caleb.

Closed on 9 September 2026, in the working tree: the inline token tables; the Geist body on `/` and `/Contact`; the Geist Mono captions; Instrument Sans on `/private-ai`; the dead Instrument Serif declarations and files; the `label` eyebrows; the home kicker; the faint ink carrying words; the footer inks. Still open: the three `!important` chrome pins (the theme switch now reports the page's real state and disables itself on those pages instead of lying); the five stock `--chart-*` and eight `--sidebar-*` tokens; the dead evidence-wall CSS in `home.css`, kept until the hero is rebuilt.


## 14 September 2026, round seven

**The bar is ink.** The nav bar is dark in both themes (`--c4-nav-idle` / `--c4-nav-scrolled` in `globals.css`), and every token inside `header[data-c4-chrome="header"]` is re-pointed to the dark set, so the links, the services sheet, the switch and the mobile sheet read on ink without their own styles changing; the logo uses its dark palette in the bar as it does in the footer. Caleb's ask: the pale logo on a pale bar looked wrong, and a darker, cleaner bar was his suggestion.

**Quotr is ours now.** `src/components/home/Quotr.jsx` is the studio's own estimator, on the home page after the four doors and inside the welcome sheet's "lock in a price" view (the quotr.us iframe and its theme handshake are gone). Eight lanes (the arms plus SEO, social and the care plans), a log-scale price rail with the packages as stops, the chosen package in full, the web add-ons as a tray, a till whose digits roll, the monthly-plan alternative from `subscriptionInfo`, and the estimate on proof stock with a copy button and a start button that carries the service and package keys into `/start`. Every figure comes from `pricing.js`; nothing is typed in. Quotr the product keeps one place on the site: a Software entry on `/Portfolio` (restored, with its bucket).

**/About is the marked manuscript.** The barrister's-brief page is gone (it was a rigid document metaphor and Caleb called it generic). The founder's words are set as one draft a hand has been over: a highlighter (three real inks: lime, yellow, pink, allowed only on this page) sweeps the phrases that matter as you reach them; the red pen runs the margin and loops once where each part begins, drawn with the scroll; headings and the years are stacked cut-outs (ink layers down to a red base); the undertakings are folded boxes you open; the opening plane is raked away and straightens over the first screen. Copy unchanged, except a duplicated four-step list and three unsourced figures were dropped. Everything ships finished under the prerender UA and reduced motion.

**Also:** the four figures under the Lens paint stage are gone; the mobile menu's overflow lock swallowed the scroll-to-top on route change (fixed in `PageTransition`); the concepts drum's side fade is an overlay now, not a mask, because WebKit flattened the 3D context and drew the faces through each other on iPad; the boot mark's C is darker on the light ground.

## 14 September 2026, round eight

**The paint stage, added to rather than replaced.** Caleb's note on the /Lens words: bigger, more flamboyant, more texture, the knife should behave like paint, and the shapes from the original page should come back. `paintWord.js` is at its fifth version. The stage is sized from the glyphs' ink (canvas `measureText`), not the advance cell, so a lowercase word fills the stage instead of half of it; the stage is taller (24vw; 38vw on a phone, where the SVG runs 6% into the side padding). Each letter sits up to 4° off true and a few units off the line. The body has two shadow sides, a fill mixed a little differently per letter, bristle streaks in two directions, grain and the wet light; the glow is wider. Two in five letters run a drip once landed. The crayon shapes are back, ported unchanged from the old page into `scribbles.js` and drawn around the ink as the letters land. The knife carries a load: through the paint it pushes flat copies of the word forward inside the blade's band (a clip-path), raises a dark lip clipped to the ink, scrapes a groove and throws flecks, some back over the shoulder; off the paint it lays what it carries down in a thinning streak that breaks up as the blade runs dry, and the pile riding ahead of the blade stays where the blade lifts.

**Why the groove is black paint, not a mask.** The fourth version cut the word through an SVG mask and pushed copies of the fully textured letters. Every stroke invalidated the mask and re-rendered nine letters of patterned text, and a drag measured 300 ms frames in headless Chromium. The groove is now the backdrop's own black drawn over the top (the section is #000), the pushed copies are a two-layer flat word kept in defs, and nothing the knife does touches the letters. Measured on the same machine in new-headless Chrome with GPU rasterisation: drag frames median 8 ms and p90 8 ms; painting frames p90 17 ms. The software renderer, where the fourth version hit 300 ms, holds 16.7 ms throughout. `scratchpad/paint-probe.mjs` is the probe; it drives the knife from inside the page, one pointer event per frame.
## 19 September 2026, round nine

**The C4Site hero is a word search solved in reverse.** Caleb's brief: the page opens on the word *foresight* and its definition, and the words transform, in a camera journey through a mosaic or labyrinth where different zooms and pans make out different words. Not a scroll journey. The piece (`src/components/sight-arm/mosaicEngine.js`, mounted by `SiteMosaic.jsx`) is one canvas over the arm's own board: a seeded grid of chalk letters, some of them words from the training (VERIFY, SOURCE, PROMPT, AHEAD) for a close camera to catch. The camera drifts, finds FORESIGHT lying in the grid, and the phrase closes up into a word with its dictionary entry beneath. Then it is rebuilt letter by letter: letters leave the board and travel the gutters between the rows to their places, letters no longer needed walk back into the board, and every journey leaves a thin chalk trail, so by the end the trails have drawn the labyrinth.

The chain keeps SEE alive so the C has somewhere to come from: FORESIGHT, SEE FORWARD, SEE FOR YOU, SEE FOR YOUR SIGHT (the I, G, H and T that left in the second beat come back), SEE FOR YOUR SITE (the G and H fall out), SEE 4 YOUR SITE (F, O and R fold into the 4), C 4 YOUR SITE (S, E and E fold into the C), C4SITE (YOUR leaves; the C and the 4 lock into the logo's own geometry). The name is three homophones, see for C, for for 4, sight for site, and the piece spells that out rather than explaining it. The camera pulls back over the board, the labyrinth brightens, and it pushes in on the name and a closing entry, *c4·site, noun: hands-on AI training, run where your team works.*

Craft notes that were decided by looking. Phrase letters set at their real advance widths in Bricolage (a fixed grid pitch read as tracked-out caps); board letters stay on the grid at a smaller size, so a letter visibly grows as it joins a word. Letters fill with a chalk-grain pattern, not flat colour. The 4 is red chalk with a marker-yellow arm, the arm's two colours. On a narrow stage a long phrase is read by panning along it rather than shrinking it, and the entries wrap. It waits for the site's boot overlay to lift, plays once when on screen, pauses off screen, and offers to play again. Reduced motion draws the finished frame; the prerenderer gets the empty board, and the page's H1 stays the DOM heading below the stage. It replaced the eraser walk-in, keeping the page to one authored moment. Measured: 4 ms median frames on desktop, and 8 of 600 frames over 33 ms on a phone at a quarter CPU speed. The same engine renders the video: `?mosaic=record` exposes a seekable engine and a script pipes frames to ffmpeg (1920x1080 at 60 fps and 1080x1920 at 30 fps, both 28.8 s).

**Second cut, the same day.** Caleb on the first cut: the concept and colour are right, but everything appears from the same spot, the word chain is not yet clever enough, and the video stutters before FORESIGHT. The stutter was measured, not guessed: frame-to-frame difference on the exported video fell to 0.00 for six frames at 1.1 s, because a second camera tween (`power3.inOut`, zero starting speed) started on top of the first and took over the same x and y. The camera is now a spline through poses (x, y, log zoom, roll; chordal Catmull-Rom, so speed is continuous through every pose), and `camTo` cannot start a move before the last has ended. A scratch check samples the pose at every 60 fps frame and reports halts and jumps; the second cut has none, and the same frame-difference test on the new video finds no dead frames.

The phrase now lives in three places on a bigger board (124 by 76) and the camera travels between them. It opens tight on LOOK, passes AHEAD, and finds HINDSIGHT; HIND walks off behind and FORE arrives from ahead, which earns FORESIGHT and its entry. SEE FORWARD is written down a column with its letters on their side, so it only reads once the camera has rolled a quarter turn. The letters the next phrase keeps are carried to it as a caravan through the gutters (they leave from alternate sides so they fan out instead of queueing), and the camera passes INSIGHT and HANDS ON on the way, lighting each. At the third place the chain is SEE FOR YOURSELF (a real idiom, and the hands-on promise), then SELF becomes SITE (the L and F fall out, I and T arrive), then the folds into the 4 and the C, then the lock. The pull-back shows the puzzle solved: every found word lit, the trails drawing the route. The closing entry reads *Insight, on site. Hands-on AI training where your team works.* A `safe()` guard pushes any wide pose in until its rolled view sits inside the board, so no format sees past the edge. Both videos are 34.6 s; the first cut is kept in `Downloads/C4Site-hero/v1`.

Wordplay considered and left out, in case a later page wants it: FORESEE said aloud is "4 C", the name backwards; SITE, CITE and SIGHT (the verification habit); SIGHT UNSEEN to SITE SEEN; BEFORE to B4.

## 19 September 2026, round ten

**The C4Site page under the hero.** Looked at full size before touching it: the page was already in the hero's language (chalk rings, the tally, margin arithmetic derived from data), so it was not rebuilt. Four things changed.

The hero film (third cut, shipped as 8b89e54) gained a board surface (a world-space smear texture, the clearings wiped harder), a key light, vignette and film grain, a hand-drawn chalk ring round each found word and round the final name, HIND struck through before it leaves, and chalk dust where letters land. The video adds real motion blur (each frame is several renders across a 180 degree shutter) and a sound track synthesised from the engine's own event list; `scripts/hero-video/` holds all three scripts. Film grain makes the raw encode about 400 MB, so share a crf 25 re-encode.

The join under the stage: the H1 and the action now sit side by side from 980px, so the right half of the board is used, and a line says whose arm this is ("C4Site is the training arm of C4 Studios, Perth").

Each format in "Two ways to run it" now lists its own blocks in order with minutes, from `c4sight-workshop-curriculum.md`, as a plain ordered list with a dot per row (afternoon rows in marker yellow). A to-scale track with the half day and full day bracketed over it was built first; Caleb found it too confusing, and a run sheet is a list. The worksheet's steel-ball magnet became a round board magnet in the pen's red, sitting fully on the sheet, lit from upper left with a cast shadow down and to the right.

"Indicative pricing" became "What it costs". Caleb's decision the same day: workplace prices come off the site and are quoted per team; the one published training price is the 90-minute school incursion at $650. The three identical price cards went. In their place the teacher's working, large, in the hand ("people in the room + half day or full + where you are = one fixed price", built from `C4SITE_QUOTE_FACTORS`), then two answers under it: "Quoted per team" and "$650 for a 90-minute incursion". The GST line now matches the invoices (not registered, nothing to add); the old note said "excluding GST", which was wrong. The Training lane left the home page's Quotr, the C4Site door says "Quoted per team", and one guide that quoted the old prices was corrected.

The schools sector page gained the incursion as a priced offer (`data.offer` in `SectorPage.jsx`, additive), with format facts checked against the incursion run sheet: one class or year group up to 60, the school's own teacher stays in the room, no student devices, no student data, a projector and clear floor. The line about two presenters now attaches the registered teacher to the longer formats only, which is what the $650 tier's own rule requires.

**The school packs, same round (21 Sep 2026).** The five free packs are now built by `c4sight-schools/scripts/build-packs.mjs` and published into `public/downloads/c4sight/` with `--publish`. The old `build-previews.mjs` no longer touches the site. Design and content decisions are recorded in that script's header and in the brain (work_log, 21 Sep 2026).
