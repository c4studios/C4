# Avenue A frame sequence — /welcome scrub

Drop the rendered frames for the `/welcome` scroll-scrub here. Until they
exist, the page automatically shows the interactive C4 logo instead, so the
site ships and lights up the moment these land.

## Naming
- `avenue-001.webp` through `avenue-NNN.webp`
- Sequential, zero-padded to **3 digits**, **WebP**.

## Specs (handoff §5 — the bits that bite at events)
- **60–90 frames.** Not 120+.
- **≤ 1920px on the longest edge** (display size × 2 cap). **Not 4K.**
- WebP per frame, dark/neutral composition reads fine on the greige page.
- Keep each frame lean — total sequence should stay well under a few MB so it
  preloads fast on 4G.

## Turn it on
Once the frames are in this folder, set the count in
`src/pages/Welcome.jsx`:

```js
const AVENUE_FRAME_COUNT = 90; // your actual frame count
```

That's the only change. `AvenueScrub` then:
- preloads **and decodes every frame** behind a loading bar,
- draws to a single `<canvas>`, advancing the frame index on scroll
  (GSAP ScrollTrigger), and
- caps DPR + uses a coarser scrub threshold on phones to hold 60fps.

The proof section also grows to `260vh` automatically so there's scroll
distance to scrub through. `prefers-reduced-motion` users keep the static
poster.

## Test before the event
Throttle to **Fast 3G** in DevTools and confirm the loading bar completes and
the scrub never stalls. Non-negotiable.
