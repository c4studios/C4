# Brief for the site design agent

Written 1 September 2026, from measured findings on c4studios.com.au and on
aiadvancements.com.au, the nearest local competitor. Everything below was read
off the live sites in a browser, not inferred.

---

## 1. Three defects on our own site, measured

**We were declaring Inter and loading nothing.** `globals.css` set
`font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI`, but Inter was
never self-hosted and there were no Google Fonts tags. So the site rendered in
the OS default: Segoe UI on Windows, SF Pro on Mac. Both Inter and system-ui are
on our own banned list, so we were failing our own rule twice over while the CSS
claimed otherwise.

**Fixed 2 Sep.** Swapped to **Archivo**, which was already self-hosted in
`public/fonts` and already imported globally via `main.jsx`. Archivo is variable
100-900, which covers every weight the app uses (300 through 900). Instrument
Sans would have been the other candidate but only ships 400-700 and would break
`font-light` and `font-black`. Geist is self-hosted too but is becoming the
default face of AI and developer tooling, which is the opposite of the point.

**The homepage h1 is weak, not missing.** Corrected 2 Sep: production serves
exactly one `<h1>`, and `TypedHeading.jsx` already resolves prerender mode
synchronously so the static HTML carries one clean phrase. That architecture is
right and there is a written explanation of the bug it fixes. The remaining
issue is copy: the indexed heading is **"Welcome to C4"**, the first entry in
`PHRASES`, which tells a crawler nothing. The other five phrases are better but
oblique, and one carries an unsourced "14h a week" figure. Someone needs to
write a descriptive first phrase.

**C4-main has no DESIGN.md.** `tailwind.config.js` is the stock shadcn/ui
scaffold: `--background`, `--foreground`, `--card`, `--primary`, `--muted`,
`--chart-1` through `--chart-5`. Those are defaults nobody chose.

Meanwhile `c4-exec/DESIGN.md` is a genuinely considered system — OKLCH neutrals
tinted to the brand hue, a documented type scale, a stated reason for every
decision, an explicit anti-reference list. **The good design system exists and
the main site does not use it.**

What is already right: border radii are restrained (3px, 4px, and full pills for
two elements). Do not let that drift.

---

## 2. What the competitor actually looks like, measured

aiadvancements.com.au. WordPress on a bespoke theme by Dilate Digital, Tailwind
with custom breakpoints, GSAP from a public CDN, jQuery plus jQuery Migrate,
Splide, MixItUp.

**Their type:** DM Sans, one family, everything. Also on our banned list.

**Their palette:** navy `#131924`, a near-lime yellow `#FCFF6A`, warm off-white
`#EFEBE8`, an orange `#F6A24D` for a decorative circle, plus Tailwind's default
`gray-200` used 773 times.

**What they do well, and we should not pretend otherwise:**

- Contrast is excellent. White on their navy is 17.6:1, dark on yellow 16.5:1.
- Skip-to-content link present.
- 59 of 63 images lazy loaded.
- Their services section is the strongest thing on the page: four ruled rows,
  68px headings, a small pill link. No cards. It has real presence.
- Commercially they are ahead of us. Published rate card, named case studies
  with numbers, a Learning Hub, a logo wall.

**Where they are weak:**

- The eyebrow is the H1. "Perth AI Agency Built for Real-World Delivery" at 10px
  is the `<h1>`; the actual 80px headline is an `<h2>`.
- Heading hierarchy is visually inverted. H3s at 68px above H2s at 55px, one H2
  at 12px.
- Six border-radius values in use: 35, 20, 9999, 6, 16, 24px. No system.
- 01 / 02 / 03 in yellow circles on a row of identical rounded cards.
- A tiny uppercase tracked eyebrow above the headline, 10px at 15% tracking.
- `transition: all` in the CSS.
- 14 of 63 images have no alt text.
- 38 of 60 tap targets are under 44px on mobile.
- One `prefers-reduced-motion` rule on a site running GSAP throughout.
- Stock photography sitting directly beside real client photography. A genuine
  Fortescue haul truck next to a stock shot of a man holding a gold credit card.
- 8,868px tall with several viewport-heights of empty space between sections.

---

## 3. The opportunity, stated plainly

Their site is competent and entirely predictable. Every choice is the expected
one. Cover the logo and you could not pick it from fifty other AI agency sites.

So the opening is not to out-polish them. It is to not look like an AI agency at
all. We sell honesty about what the technology cannot do, to partners and
directors at professional and financial services firms. The visual world should
say "the person who reads the contract", not "the agency with the yellow
accent".

`c4-exec/DESIGN.md` already describes that world. Board paper. Ruled lines. Wide
margins. One family of type. Figures set quietly in the margin. Ornament limited
to a single deep-red hairline behaving like a document rule. No cards, options
as ruled rows. Hierarchy from size, colour and space rather than a weight ladder.

**That is a real position and nobody local occupies it.**

---

## 4. What I would ask the agent to decide

Not instructions, because the direction is theirs to set. These are the
questions that matter.

1. **Does the board-paper world extend to the main site, or is it only right for
   the diagnostic tool?** It was designed for a managing partner reading on a
   phone in a taxi. The main site also sells web design, photography and
   automation to trades and small business, which is a different reader. If the
   answer is that one world cannot serve both, say so and propose the split.

2. **Does Archivo stay?** It was swapped in on 2 Sep as the correct available
   fix, not as a considered brand decision. It is defensible: variable 100-900,
   already self-hosted, grotesque with signage and document heritage. But the
   agent should confirm or replace it deliberately. Constraint from CLAUDE.md:
   no Inter, Roboto, Arial, Open Sans, Space Grotesk, DM Sans, Plus Jakarta,
   Outfit, Poppins, Montserrat or system-ui as the brand face, and no serif
   italic to signal warmth. Note `c4-exec` deliberately chose Arial with a
   written justification, so the two worlds need a stated relationship rather
   than an accident.

3. **Is the intro overlay earning its place?** An overlay was covering the
   homepage when I captured it. On a site whose pitch is plain-speaking, an
   entrance animation is the first thing a sceptical reader has to sit through.

4. **Where does the evidence go?** The strongest asset we have is not visual. It
   is `VERIFIED-CLAIMS.md` and the articles built from it, where every figure is
   traced to a primary source and fifteen widely-repeated claims are documented
   as false. The competitor has a Learning Hub. We have better material and
   nowhere prominent to put it. That is an information architecture problem
   before it is a visual one.

---

## 5. Non-negotiables

- Write a descriptive first phrase for the homepage `PHRASES` array. It is the
  indexed h1 and it currently reads "Welcome to C4".
- Remove or source the "14h a week" figure in that same array. Unsourced numbers
  breach our own rule.
- Keep the restrained radius scale. Do not let it grow past three values.
- Contrast floor 4.5:1 for body text, and the competitor manages 17:1, so there
  is no excuse.
- Tap targets at 44px minimum. The competitor fails this on 38 of 60 elements
  and we should not.
- Alt text on every content image.
- A real `prefers-reduced-motion` path, not one rule.
- No card grid as the page structure, no 01/02/03 scaffolding, no tiny uppercase
  tracked eyebrow above a heading, no gradient text, no purple.
- Australian spelling throughout.

## 6. Where to start

Write `C4-main/DESIGN.md` before touching a component. The site currently has no
documented visual authority, so every change is a fresh opinion. One document
fixes that, and the format in `c4-exec/DESIGN.md` is the model — it states the
scene the decision serves, not just the value.
