# C4 Studios — Portfolio Entry: Evidence Advisory

Drop-in copy + assets for a c4studios.com.au portfolio/work entry.
Map the **Structured fields** to whatever your portfolio schema uses
(MDX frontmatter, a data array, or a CMS), then use the **Body** for
the case-study text. Tell Caleb's assistant your exact format and it'll
hand back a ready-to-paste file.

---

## Structured fields

| Field | Value |
|-------|-------|
| **Title** | Evidence Advisory |
| **Slug** | `evidence-advisory` |
| **Client** | Evidence Advisory — Digital Forensic Experts (Perth, WA) |
| **Year** | 2026 |
| **Role / Services** | Brand-led web design · Full-stack development · 3D / WebGL · Motion design · SEO |
| **Stack** | Next.js (App Router) · React · TypeScript · React Three Fiber / Three.js · GSAP + ScrollTrigger · Lenis · Tailwind CSS |
| **Live URL** | https://evidenceadvisory.com.au |
| **Tags** | Web Design, Web Development, 3D / WebGL, Branding, SEO |
| **Featured?** | Yes (recommended — this is a showcase piece) |

### JSON (in case your portfolio is data-driven)

```json
{
  "title": "Evidence Advisory",
  "slug": "evidence-advisory",
  "client": "Evidence Advisory — Digital Forensic Experts",
  "location": "Perth, Western Australia",
  "year": 2026,
  "role": ["Web Design", "Development", "3D / WebGL", "Motion", "SEO"],
  "stack": ["Next.js", "React", "TypeScript", "React Three Fiber", "GSAP", "Tailwind CSS"],
  "url": "https://evidenceadvisory.com.au",
  "tags": ["Web Design", "Web Development", "3D / WebGL", "Branding", "SEO"],
  "cover": "evidence-advisory-cover.png",
  "featured": true
}
```

---

## One-liner (for cards / grid)

> A brand-defining site for one of WA's leading digital-forensics firms — anchored by an interactive 3D "crime-scene reconstruction" the visitor solves by scrolling.

## Summary (intro paragraph)

Evidence Advisory are court-trusted digital forensic investigators — they
deal in admissible evidence, not assumptions. We designed and built their
new website around a single, unforgettable idea: a shattered phone,
suspended like crime-scene evidence, that the visitor reassembles as they
scroll. It's wrapped in a fast, SEO-ready multi-page platform that
positions them as WA's most trusted forensic experts.

## Body / case study

**The brief.** Evidence Advisory's reputation is built on rigour. Their
previous site didn't carry that authority, and their audience — discerning
law-firm partners — needed something modern and memorable without tipping
into gimmick.

**The idea.** We led with a concept that turns their craft into an
interaction. A damaged smartphone hangs in zero gravity, its screen
shattered into glass shards tagged with yellow forensic evidence markers.
As you scroll, the shards fly back into place, the cracks knit shut, and
the screen powers on — a literal reconstruction of evidence that mirrors
exactly what the firm does. It's built in WebGL with a hand-tuned,
scroll-scrubbed animation, real-time lighting and a bespoke studio
environment, and it's fully grabbable in 3D.

**Beyond the hero.** The site is a complete, conversion-focused platform:
founder profiles, four service lines with dedicated landing pages, an
anonymised casework portfolio, an insights/articles engine, and an
animated FAQ. Every page is a statically-rendered, individually-indexable
URL with structured data, per-page metadata, a sitemap and a working
contact form — a genuine SEO foundation, not a brochure.

**The engineering.** Built on Next.js (App Router) and shipped as a static
export for fast, resilient hosting. The 3D scene is performance-budgeted
(a single instanced mesh for the shards, no transmissive materials, capped
device-pixel-ratio) and degrades gracefully — if a device can't run WebGL,
the hero falls back cleanly with zero impact on the rest of the page.

**The result.** A site that makes a forensics firm feel as precise and
modern as the work it does — distinctive enough to be remembered,
disciplined enough to be trusted.

---

## Imagery

- **`evidence-advisory-cover.png`** — included. Branded 1200×630 cover
  card (good for the grid thumbnail / social share).
- **`ea-logo.png`** — included. Client logo (transparent PNG) for a
  logo/credit row if your layout uses one.
- **Live screenshots to capture** (grab at full/retina res straight from
  https://evidenceadvisory.com.au — they'll look sharper than anything
  exported here):
  1. **The hero** — top of the homepage, the shattered phone with the
     yellow evidence markers (the signature shot).
  2. **A reconstructed state** — scroll the hero ~halfway so the phone is
     partly reassembled (shows the interaction).
  3. **Experts / founders** section — the two principals.
  4. **A service detail page** — e.g. `/services/digital-forensics/`.
  5. *(optional)* **Insights** index — shows the content/SEO depth.

## Notes

- Confirm with the client (Phillip/Darren) before publishing the entry —
  they may prefer how the firm is described, and you'll want their OK to
  feature the work publicly.
- Cover/screenshots are landscape; the logo is on transparent so it sits
  on any background.
