# Brief for drafting C4 Studios insight articles

Paste this whole file at the top of a session before drafting any article for
c4studios.com.au. Written 29 August 2026.

---

## 1. Who this is for

Caleb Scott, founder of C4 Studios, Perth WA. Sole operator. Builds AI systems,
automation and websites for Australian businesses, and advises their leadership
on AI. Also sells a private/on-premise line (internally C4i) where the AI runs
entirely on the client's own hardware.

**Readers** are owners, partners and directors of Australian professional and
financial services firms, mostly 5 to 50 people. Insolvency accountants,
private lenders, corporate advisers, law firms, allied health. Many hold an
AFSL. Most are on Microsoft 365. They are being sold AI constantly and they
cannot tell who to believe.

**The one credential claim permitted:** partway through a law degree. Never
present as a lawyer, never as a compliance or regulatory expert. Articles may
report what a regulator has published. They may never advise whether anyone
complies. Every piece touching law carries a line saying it is not legal advice.

**The commercial position** is being the person honest about what AI cannot do,
including when the honest answer is "this is not worth your money". An article
that oversells damages the whole practice. Where the evidence is thin, say so.

---

## 2. Evidence rules — the part that matters most

These are not style preferences. Getting one of these wrong in front of an AFSL
holder costs more than the article earns.

1. **Every factual claim traces to a primary source that has been read.** Not a
   summary of it, not a blog describing it, not a search-result snippet. Open
   the actual regulator page, licence text, paper or vendor documentation.
2. **No figure appears unless it was read at its origin.** If a number cannot be
   traced, cut the sentence. Do not soften it, do not hedge it into the piece.
3. **No publication venue, conference or journal is ever stated** unless it
   appears verbatim on the page actually read. This has been the single most
   common error in research handed over: real paper, real numbers, invented
   venue. If the venue is not on the page, do not mention a venue.
4. **No author affiliations** unless printed on the source page.
5. **Vendor benchmarks and ROI figures are evidence of marketing, not fact.**
   Attribute them ("Anthropic reports", "the vendor claims") or leave them out.
6. **Never fabricate a testimonial, review or client quote,** not even as
   placeholder. Use an obvious `[PLACEHOLDER]` marker.
7. **Mark inferences as inferences.** "Appears to", "on its own terms", "the
   agreement does not describe a mechanism".
8. **Every article file opens with a verification header** (see §4). It records
   what was verified, on what date, from which URL, plus an explicit
   `Do NOT add` list of claims that were checked and failed, or that circulate
   widely and are wrong. That header is why the piece can be defended later.

**Known traps, all encountered and corrected already:**

- The Llama 4 licence does **not** restrict EU-domiciled users. A comparable
  clause applied to earlier multimodal Llama releases. Do not carry it forward.
- APRA does **not** regulate a private lender holding an AFSL that is not an
  ADI. ASIC does. Check which regulator actually covers the entity type before
  naming one.
- Microsoft 365 Copilot data **residency** in Australia and in-country
  **inferencing** are different things. Residency is live. Local inferencing is
  a Microsoft target for end of 2026 and the timeline was revised on
  3 April 2026. Never write that Copilot processing stays in Australia.
- Do not repeat that OpenAI stopped reporting its SWE-bench Verified score.
  Widely said, not verified.

---

## 3. Voice

Australian English and spelling throughout.

- Short sentences. Plain words. Lead with what happens; the reasoning comes
  after and shorter.
- **No triads.** Three parallel phrases in a row is the strongest tell of
  machine writing. A factual list of three items is fine; a rhetorical trio is
  not.
- **No "X, not Y" constructions.** No "It's not just X, it's Y."
- No paragraph ending on a dramatic one-liner. No aphorisms.
- Watch em-dash density. Prefer full stops and commas. More than about one per
  paragraph reads as machine-written.
- No "Let me be straight with you", no "Thank you for reading this far".
- Contractions are fine.
- If a sentence sounds like a slide, rewrite it as something you would say
  across a desk.
- Never "revolutionary", "transform", "unlock", "seamless", "game-changing", or
  a productivity multiplier.

**Structure to avoid:** the statistical-average article shape is intro, three
numbered tips, conclusion, call to action. Vary it. Let one idea own the piece.

---

## 4. File format

Articles are ES modules at `src/content/seo/pages/<slug>.js`, rendered by
`ArticleTemplate.jsx`. Read `one-page-ai-policy.js` first as the reference
implementation. Do not invent new section kinds.

```js
/**
 * Article — one-line description.
 *
 * VERIFIED — [source name], [URL], read [date]:
 *   - [claim] verbatim where quoted
 *
 * Do NOT add:
 *   - [claim that failed verification, and why]
 *
 * Not legal advice. Keep that line.   // only if the piece touches law
 */
export default {
  hero: {
    label: 'Insights',
    title: ['First line', 'second line'],   // two short lines
    intro: ['One paragraph. The dek.'],
  },
  sections: [ /* see kinds below */ ],
  faqs: [{ q: '...', a: '...' }],           // 4 to 6, real questions
  cta: { heading: '...', text: '...' },
};
```

**Section kinds, and nothing else:**

| kind | fields | use for |
|---|---|---|
| `answer` | `body: []` | The direct answer, first section, always. One paragraph. |
| `prose` | `heading`, `body: []` | Ordinary argument. The workhorse. |
| `list` | `label`, `heading`, `intro`, `items: [{title, text}]` | Enumerated points |
| `process` | `heading`, `steps: [{title, text}]` | Sequenced actions |
| `quote` | `quote` | One pull-quote per article at most |
| `image` | `src`, `width`, `height`, `alt`, `caption` | Only if the asset exists |
| `sources` | `heading`, `items: [{title, publisher, year, url}]` | Always last section |

Body text supports markdown links: `[private AI](/private-ai)`.

**Internal links to use where they fit naturally:** `/ai-training-for-business`,
`/private-ai`, `/how-we-use-ai`, `/ai-automation-perth`.

**Never reference an image that does not exist on disk** in
`public/insights/`. Omit the `image` section instead.

---

## 5. Registry entry

Add to the `ARTICLES` array in `src/content/seo/registry.js`:

```js
{
  slug: 'kebab-case-slug', type: 'article', status: 'draft', phase: 7,
  name: 'Short Breadcrumb Label',
  title: 'Under 60 Characters | C4 Studios',
  description: 'Under 155 characters. What the piece establishes.',
  dek: 'One line. The most interesting single fact in the article.',
  published: 'YYYY-MM-DD', updated: 'YYYY-MM-DD', readMinutes: 7,
  priority: 0.65, changefreq: 'yearly',
  links: { pillars: ['ai-automation-perth'] },
},
```

Ship as `status: 'draft'`. Caleb flips it to `live`. Add the `image` field only
once `public/insights/<slug>-og.jpg` actually exists.

---

## 6. Already published — do not duplicate

| Slug | Covers |
|---|---|
| `ai-detectors-dont-work` | AI detection tools |
| `one-page-ai-policy` | The one-page AI policy, Privacy Act 10 Dec 2026 |
| `why-web-designers-hide-their-prices` | Pricing transparency |
| `private-ai-vs-chatgpt-subscriptions` | Per-seat cost comparison |
| `ai-indemnity-you-already-have` | Microsoft Customer Copyright Commitment |
| `what-ai-benchmark-scores-dont-tell-you` | Benchmark saturation, contamination, construct validity |
| `open-weight-is-not-open-source` | Model licences, Gemma restriction clause, NIST DeepSeek finding |

---

## 7. Checklist before handing an article back

1. Every number traced to a source that was actually opened.
2. No venue, journal or conference stated that was not on the page read.
3. Verification header written, including the `Do NOT add` list.
4. Sources section lists every source, with working URLs.
5. Read it aloud. Any triad, any "X, not Y", any sentence that sounds like a
   slide gets rewritten.
6. Australian spelling throughout.
7. If it touches law or regulation, the not-legal-advice line is present.
8. Nothing claims a team, a credential or prior work that is not real.
9. `title` under 60 characters, `description` under 155.
10. No image referenced unless the file exists.
