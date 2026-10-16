# C4 Footer Credit — Portable Component

Animated C4 Studios footer-credit badge extracted from [c4studios.com.au](https://c4studios.com.au).

This folder is the master copy. Client and concept sites copy it, so a change here reaches them only when each site is updated and deployed.

## Files

```
c4-footer-credit/
  C4FooterCredit.jsx       ← main component (geometry, build and animation, all in one file)
  C4FooterCreditLazy.jsx   ← optional wrapper that loads the badge after the page settles
  c4WordmarkData.js        ← SVG path data for "Studios" letter morphing
  README.md                ← this file
```

## Dependencies

Install these in the target project:

```bash
npm install gsap @gsap/react
```

Peer requirements (already present in any React project):
- `react` ≥ 18.0
- `react-dom` ≥ 18.0

**No other dependencies.** No Tailwind, no router, no theme provider, no icon library.

## Setup

1. Copy the entire `c4-footer-credit/` folder into your project (e.g. `src/components/c4-footer-credit/`)
2. Install `gsap` and `@gsap/react` if not already present
3. Import and use:

```jsx
import C4FooterCredit from './components/c4-footer-credit/C4FooterCredit';
```

## Usage

### Minimal

```jsx
<footer>
  <C4FooterCredit />
</footer>
```

### With options

```jsx
<footer>
  <C4FooterCredit
    href="https://c4studios.com.au"
    label="Designed with C4 Studios"
    size={48}
    showText={true}
    openInNewTab={true}
    colorScheme="auto"
    className="my-footer-badge"
  />
</footer>
```

### In a typical footer layout

```jsx
<footer style={{ backgroundColor: '#111', padding: '40px 24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
    <div>
      <p style={{ color: '#666', fontSize: '11px' }}>© 2025 Your Company</p>
    </div>
    <C4FooterCredit size={36} label="Designed by C4 Studios" />
  </div>
</footer>
```

### Light background footer

```jsx
<footer style={{ backgroundColor: '#f8f8f8', padding: '40px 24px' }}>
  <C4FooterCredit colorScheme="light" />
</footer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | `'https://c4studios.com.au'` | Link destination |
| `label` | `string` | `'Designed by C4 Studios'` | Credit text shown below logo + used as `aria-label` |
| `size` | `number \| string` | `36` | Logo height in px, or named size: `'small'` (28), `'default'` (36), `'large'` (48), `'xl'` (72) |
| `className` | `string` | `''` | Additional CSS class(es) on the root `<a>` element |
| `openInNewTab` | `boolean` | `true` | Opens link in new tab with `rel="noopener noreferrer"` |
| `showText` | `boolean` | `true` | Show credit text below the logo |
| `colorScheme` | `string` | `'auto'` | `'dark'` \| `'light'` \| `'auto'` — controls logo colour palette. Auto mode samples the rendered parent/background colour so the "Studios" text turns light on dark/black backgrounds. Since 17 Oct 2026 it reads any CSS colour (oklch, lab, color(), as Tailwind v4 sets them); before that it read only rgb(), and an oklch footer fell back to the visitor's OS theme. Also since 17 Oct, on a light background the C is charcoal at rest and in colour, and the haze behind the mark shows on dark backgrounds only (from Brady Electrical's copy, 9 and 10 Sep 2026); before that the C was near-white on white. |

## Animation Behaviour

The component keeps the 3-stage progressive animation from the C4 Studios site:

1. **Dormant** (default) — grey C4 mark, "Studios" text hidden
2. **Hover → Mono** — mark darkens, "Studios" letters fade in with stagger
3. **Hover → Colour** — the mark draws itself in colour (build B, "Stroke", below), then the letters spring-bounce and morph from upright → italic
4. **Hover → Dormant** — the greys come up under the colour and the colour fades off them, and the word folds away

Each hover advances one stage. Three hovers complete the full cycle.

### The colour build (since 17 Oct 2026)

The C is wiped on by a straight front at the angle of its own top cut (0 to 0.48 s). The 4 is drawn as one stroke: the stem (0.08 to 0.40 s) and the diagonal (0.08 to 0.52 s) leave the apex together, the diagonal turns into the crossbar (0.43 to 0.77 s), which runs right through the cut into the green, and the T's stem drops last (0.68 to 0.96 s). Every beat runs on `cubic-bezier(0.4, 0, 0.18, 1)`. Each stroke is its piece of the 4 clipped by one straight front, so every frame has straight edges with true ends. Nothing in the build is round and nothing swings on a pivot. Each colour is drawn as one path, so no hairline shows where two strokes meet. The crossbar landing on the T knocks the first letter at 0.74 s. A hover that ends early runs the stroke backwards.

The 4 is the trued version Caleb approved on 17 Oct 2026 ("Cuts 15.81, stem lines up"): the channel under the stem is as wide as the slanted cut, the stem's right edge is vertical, and the T's stem is as wide as the upper stem and lined up under it.

### Touch behaviour

- **Quick tap** (<300ms): navigates to href
- **Long press** (≥300ms): plays animation stage, no navigation

### Reduced motion

When `prefers-reduced-motion: reduce` is active, every stage still answers a hover, with the movement taken out: the stages fade, the finished colour mark fades in over 0.2 s instead of being drawn, and the word fades where it stands. (Before 17 Oct 2026 the badge stayed in its dormant state.) The link always works.

## Accessibility

- Renders as a real `<a>` element (keyboard-navigable, screen-reader accessible)
- `aria-label` set from the `label` prop
- `target="_blank"` includes `rel="noopener noreferrer"`
- Respects `prefers-reduced-motion`
- All SVG elements use unique IDs (via `React.useId`) — safe for multiple instances

## Rolling the 17 Oct 2026 version out to a client site

It is a drop-in, one-file replacement. Only `C4FooterCredit.jsx` changed. Its props, its default export, its imports (`react`, `gsap`, `@gsap/react`, `./c4WordmarkData`) and its dependencies are the same, so `c4WordmarkData.js`, `C4FooterCreditLazy.jsx` and every place the site renders the badge stay as they are.

For each site, one deploy each:

1. Find the site's copy (usually `src/components/c4-footer-credit/C4FooterCredit.jsx`; search the repo for `C4FooterCredit`).
2. Check it has no local edits. The site's copy should match one of the earlier masters in C4-main: `02bd8ad0` or `c80a008e` (17 Oct, the new build before the two colour fixes in the `colorScheme` row above), `657fe053` (24 Jun 2026, current until 17 Oct), `a329ed27` (5 May) or `ecd06c40` (19 Mar). Get each with `git show <commit>:c4-footer-credit/C4FooterCredit.jsx` and compare ignoring line endings (`git diff --no-index --ignore-cr-at-eol old.jsx site.jsx`). If it matches one, overwrite the site's file with this one. If it matches none, the site changed something (colours, sizes, the label, the link): copy this file over and carry those edits across by hand.
   A copy from 19 Mar defaults to `colorScheme="dark"` and links to c4studios.com. This file defaults to `"auto"` and c4studios.com.au, so pass `colorScheme="dark"` where that site's footer needs the old palette.
3. Build the site, then look at it in a browser before deploying. Hover the badge twice. The second hover should draw the 4 as one stroke with straight ends and wipe the C on with a straight front; no circle opens on the C. The finished 4's T stem is as wide as the stem above it and sits right under it. The third hover fades it back to grey. With reduced motion turned on, each hover fades. The console should be clean.
4. Deploy, then check the live footer the same way. A 200 doesn't mean the new bundle is live; check the badge itself.

## Behaviour changes from the C4 site original

| Area | Original (C4Logo.jsx) | Portable (C4FooterCredit.jsx) | Reason |
|------|----------------------|-------------------------------|--------|
| Theme | Uses site-wide `ThemeContext` via `useTheme()` | Internal `colorScheme` prop with rendered-background detection | Removes dependency on host site's theme system |
| Variant | Supports `'mark'` and `'full'` variants | Always renders `'full'` variant | Mark variant is static and not useful for a footer credit |
| Context | Accepts `'header'` or `'footer'` context | Always uses footer colour palette | Component is purpose-built for footer use |
| Wrapper | Renders `<span>`, parent provides `<Link>` | Renders `<a>` with configurable `href` | Self-contained link — no router dependency |
| Credit text | None (added separately in site footer) | Built-in `showText` / `label` props | Convenience for "Designed by" attribution |
| Styling | Uses Tailwind utility classes | Inline styles only | No CSS framework dependency |
| Colour build | `markBuild.js` beside it | The same code, copied into this file | One file to copy |
| Mono ghost | The grey mark holds at a third while the colour is drawn | The grey fades out as the colour is drawn | The badge's own staging, unchanged |
| Word | Letter chain rebuilt on 9 Sep 2026 (three tweens a letter) | The earlier spring-keyframe chain | The badge's own word animation, unchanged |
| Data files | 3 separate files (source, normalized, aggregator) | Single pre-computed `c4WordmarkData.js` | Fewer files to copy |

**The mark's points, the colour build and the colour values are the same as the site's.** The word's animation and the grey staging are the badge's own.
