# Sharp Bricklaying — Portfolio Data Extraction Prompt

> **Purpose:** Paste this prompt into the Sharp Bricklaying repo's AI assistant to extract every detail needed for a C4 Studios portfolio case study entry. This project is notable for its high-end trades positioning, extensive drone and on-site photography, and a gallery-driven architecture designed to grow with the business. The output must follow the exact schema below — no fields skipped, no guessing.
>
> **IMPORTANT — OUTPUT LENGTH:** This prompt will produce a long response. If your output gets cut off mid-sentence, I will say "continue from where you left off" and you should resume from the exact cut-off point. Do NOT restart or summarise — just continue.
>
> **DUAL OUTPUT REQUIRED:** This project needs two distinct portfolio entries:
> 1. A **web design case study** for the C4 Studios portfolio (main portfolio page)
> 2. A **C4 Lens photography/drone entry** for the C4 Lens page (separate, visual-first)
>
> Produce both sets of data in your response.

---

## PROMPT

I need you to perform a comprehensive audit of this entire codebase and produce a structured portfolio case study dataset for the C4 Studios portfolio. This site was designed and built by C4 Studios for the client (Sharp Bricklaying). Be **exhaustive** — extract every detail you can find.

---

## PART 1 — WEB DESIGN CASE STUDY

### 1. PROJECT METADATA

Extract or confirm the following:

| Field | What I need |
|---|---|
| **Project name** | "Sharp Bricklaying" |
| **Client name** | Luke Sharp |
| **Location** | Perth, Western Australia |
| **Live URL** | https://www.sharpbricklaying.com.au/ |
| **Year** | Year the site was built/launched (check git history / copyright) |
| **Timeline** | How long the project took from kickoff to launch (check git history — first commit to production deploy) |
| **Budget range** | Estimate based on scope. Use ranges: `"$500 – $1k"`, `"$1k – $2.5k"`, `"$2.5k – $5k"`, `"$5k – $10k"`, `"$10k+"` |
| **Role** | C4's role — confirm from codebase/docs (e.g. "Solo (design, development, deployment, photography, drone)") |
| **Category** | Use `web_design` |
| **Tags** | 4–6 service tags — must include: `['Website', 'Trades', 'Construction', 'Local Business', 'Perth']` — add others if applicable |
| **Featured** | `true` — this is a high-quality build with strong visual assets |
| **Brand colour** | Primary brand hex colour from the design system / tailwind config / CSS variables. Check the site's dominant colour — likely a dark charcoal or warm brick tone. |

### 2. COPY & CONTENT

| Field | What I need |
|---|---|
| **One-liner** | A single compelling sentence summarising the project for a portfolio card (max ~120 chars). Write from C4's perspective as the builder. Convey: premium trades positioning, drone photography, gallery-driven architecture. |
| **Overview** | A 4–6 sentence paragraph describing what was built, why, and the outcome. Cover: Luke Sharp's situation (established Perth bricklayer, 15+ years experience, needed a digital presence matching his premium standard), C4's approach (full design + development + deployment + on-site photography + drone work), what was delivered (the full site, job gallery system, drone footage integration, before/after transformations, enquiry form), and the result. |

### 3. PAGES & STRUCTURE

List **every** page/route in the application. I know there are at minimum:
- `/` — Homepage (hero with drone/aerial images, services section, about section, work/portfolio section with job galleries, before/after transformations, contact/enquiry section)
- Likely individual job gallery pages or modal-driven gallery system
- Contact / quote request page or section
- Privacy policy page

For each page/route, extract:
- Route path
- Page title / purpose
- Key sections on the page (hero, services grid, gallery, contact form, etc.)
- Notable UI patterns (carousels, before/after sliders, drone video embeds, sticky elements, scroll animations, etc.)

### 4. DELIVERABLES

List **everything** delivered as part of this project. Be specific. I know this likely includes:
- Complete website (design + development + deployment)
- On-site photography (site work, bricklayers in action, finished products)
- Aerial drone photography / drone footage (multiple aerial shots of builds under construction and completed)
- GoPro POV site footage
- Job gallery system (individual job folders with photos — Rhonda Ave Willeton, Huon St Willeton, Branksome Gardens City Beach, Waller St Lathlain, Avonmore Terrace Cottesloe, plus others)
- Before/After transformation galleries (Branksome Gardens City Beach, Broome St Cottesloe, others)
- Contact/enquiry form with backend processing
- Responsive mobile design
- SEO setup (meta tags, OG tags, sitemap, structured data if any)
- Privacy policy page
- Social media integration (Instagram, Facebook)

Confirm what was actually delivered and add anything not listed above.

### 5. FEATURES

List every notable feature implemented. Be specific and technical but readable. I expect to find at minimum:
- Hero section with multi-image drone/aerial photo carousel or slideshow
- Services section (Residential New Builds, Renovations & Extensions, potentially others)
- About section / Luke's Story (15+ years experience, founding story since 2016, crew development)
- Job galleries — individual project folders with multiple site photos, drone video, and GoPro POV footage
- Before/After image comparison slider or toggle
- Enquiry/contact form with project type selector and backend form processing
- Instagram and Facebook social links
- Responsive mobile-first layout
- "Built to a Higher Standard" brand headline system
- Footer navigation with sections (Navigate, Connect, legal)

Add any features I haven't listed. Be exhaustive.

### 6. TECH STACK

List every technology, framework, library, and tool used. Check `package.json` (if it exists), import statements, config files, and deployment config. Format as an array of strings. Be specific with versions where available.

Key things to look for:
- Is this a static HTML/CSS/JS site, or a framework-based SPA?
- Build tool (Vite, Webpack, Parcel, none)?
- CSS approach (Tailwind, custom CSS, SCSS)?
- Animation library if any (GSAP, Framer Motion, AOS, CSS animations)?
- Hosting platform (Vercel, Netlify, Cloudflare Pages, other)?
- Any CMS (Sanity, Contentful, custom, none)?
- Image hosting / CDN
- Form backend (serverless function, Formspree, Netlify Forms, other)?

### 7. INTEGRATIONS

List all third-party services, APIs, and external integrations:
- Email/form backend
- Analytics (Google Analytics, Plausible, etc.)
- Maps
- Social media links/embeds
- CDN / image hosting
- Video hosting/embedding (Vimeo, YouTube, self-hosted)?
- Any booking or scheduling system?

### 8. PERFORMANCE & ACCESSIBILITY

Describe notable performance and accessibility decisions:
- Image optimisation approach (WebP, lazy loading, responsive images)
- How is drone/aerial video handled (autoplay, lazy, self-hosted)?
- Accessibility features (skip links, ARIA, focus styles, alt text, reduced motion)
- Security headers if present
- Page load speed considerations

### 9. CHALLENGES

List the most interesting or difficult technical/creative challenges encountered. Think about:
- Managing large volumes of high-resolution construction photography
- Drone video integration and performance
- Building a job gallery system that's easy for a non-technical client to understand
- Before/after image comparison implementation
- Representing a premium trades business online without feeling generic
- Mobile performance with heavy media assets

### 10. IMPROVEMENTS (future roadmap)

What was scoped for the future or would make natural next phases? Think about:
- CMS for the client to self-manage job gallery photos
- Online quoting tool or project enquiry form with file upload
- Google Reviews integration
- Instagram feed embed
- Expanded video capabilities

### 11. SCREENSHOTS — CAPTURE LIST

Produce a complete list of every screenshot/capture I should take to document this project properly. Format as:
```
{ url: '/captures/sharpbricklaying-com-au/desktop/01-hero.png', caption: '...' }
```

Include:
- Desktop screenshots (full-page, or section by section if long)
- Mobile screenshots (at least 4–6 key views)
- Any interactive states (gallery open, form, before/after toggle)

Use the naming pattern: `/captures/sharpbricklaying-com-au/desktop/01-hero.png`, `/captures/sharpbricklaying-com-au/mobile/01-hero.png`

### 12. COVER & THUMBNAIL

Identify the single best image to use as:
1. **Cover** — the logo mark used in the portfolio card (transparent PNG, dark version preferred). This will be the file at `/covers/sharp-bricklaying.png`
2. **Thumbnail** — the best hero screenshot to use as the card thumbnail (before screenshots are taken). Most likely the main aerial drone hero image.

Describe or provide the exact file path/URL for each.

---

## PART 2 — C4 LENS PORTFOLIO ENTRY

This project involved professional photography and licensed drone work. It needs a separate entry for the C4 Lens portfolio page.

### L1. LENS METADATA

| Field | What I need |
|---|---|
| **Entry name** | "Sharp Bricklaying" |
| **Card label** | Short category descriptor for the Lens portfolio card (e.g. "PHOTOGRAPHY / DRONE WORK") |
| **Card slot** | This will be slot `03 · SHARP` in the Lens horizontal scroll portfolio |
| **Card shape** | Recommend `wide`, `tall`, or `sq` based on the best available media |
| **Media source** | What is the best video or image to use for this card? (file name, URL, or description — ideally an aerial drone video showing a construction site in progress) |

### L2. SHOOT DETAILS

Describe the full scope of the photography/drone work done for this project:

**Photography:**
- How many shoots were conducted?
- What was photographed? (site work, crew, finished brickwork, staged/lifestyle, before/after)
- What locations were covered?
- How many final photos were delivered to the client?
- Were photos delivered via an online gallery? If so, what platform?

**Drone Work:**
- What drone was used?
- Was the operator licensed (RePL / Part 101)?
- What shots were captured? (wide aerial overviews, low tracking shots, construction-in-progress, completed builds)
- Were drone videos processed/colour-graded as part of the deliverable?
- Were drone stills delivered separately from video?
- Notable job sites captured via drone (Rhonda Ave Willeton, others)?

**GoPro / POV:**
- Was GoPro footage captured on site?
- What was the purpose / final format?

### L3. POST-PRODUCTION

Describe any editing, grading, or post-production work:
- Colour grading approach
- Image retouching/culling
- Video editing and export formats
- Any motion graphics or text overlays added?

### L4. DELIVERABLES (Lens-specific)

Complete list of all photography and video deliverables, separate from the web design deliverables.

---

## OUTPUT FORMAT

For PART 1, produce the data as a JavaScript object matching this exact schema (copy-paste ready for `caseStudyData.jsx`):

```js
'sharp-bricklaying': {
  slug: 'sharp-bricklaying',
  name: '...',
  oneLiner: '...',
  client: '...',
  location: '...',
  timeline: '...',
  budget: '...',
  role: '...',
  liveUrl: 'https://www.sharpbricklaying.com.au/',
  year: '...',
  category: 'web_design',
  tags: [...],
  featured: true,
  budgetOrder: ...,

  cover: '/covers/sharp-bricklaying.png',
  brandColor: '...',
  coverMode: 'contain',
  coverSizes: {
    preview: '...',
    featured: '...',
    grid: '...',
    hero: '...',
  },
  backdropStyle: {
    backgroundColor: '...',
    backgroundImage: '...',
  },
  thumbnail: '/captures/sharpbricklaying-com-au/desktop/01-hero.png',

  overview: '...',

  screenshots: [...],
  desktopScreenshots: [...],
  mobileScreenshots: [...],

  delivered: [...],
  features: [...],
  stack: [...],
  integrations: [...],
  performance: [...],
  challenges: [...],
  improvements: [...],
},
```

For PART 2, produce a structured summary in plain markdown describing:
- The media file(s) to use for the Lens portfolio card (file name, source URL or path)
- Card dimensions (`wide` / `tall` / `sq`)
- Full shoot summary (what was captured, delivered, and how)
