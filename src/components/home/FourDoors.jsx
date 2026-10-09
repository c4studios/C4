/* ─────────────────────────────────────────────────────────────────
   FOLD 3 — THE DOORS (ProductTrio reborn; the identical card grid dies)

   Four doors since 9 Oct 2026, when Logo Design became the fourth arm
   (Caleb: "we've been getting a lot of enquiries regarding logo
   design"). The codes match the Services menu. Four across from 1024px,
   two by two from 640, one column on phones: home.css has the reasons.
   Both links per door sit in the DOM at rest.

   The faces were redrawn on 9 Oct 2026 as one system (Caleb: "lens
   looks like a child drew it, website tile is good in concept, just
   needs updating, seo should focus more on ranking and needs to be more
   minimalsitic, and logo design needs to look less childish as well").
   The C4Site banners were the bar: one flat field, one strong thing,
   nothing else. Every face carries the arm's name and a note on what it
   shows at top left, and its action at the foot, in Archivo at one
   setting. Each face's art is its own:
     C1 · three live client home pages, a slice of each hero stacked edge
          to edge, each holding a whole headline and its intro, the
          headlines on the face's margin (door-faces.mjs cuts)
     C2 · one C4 Lens photograph, Sharp Bricklaying's brick corner, full
          bleed under an ink band. The sky can't carry small type either
          way (measured), so the label sits on the band, not on the photo
     C3 · an example search, the result at 1, and that result's title
          running off the face in the board's blue (seo-copy/DoorFace)
     C4 · our own 4 with its anchor points and the C's bezier handles
          (logo-design/DoorFace)
   The art layer is aria-hidden; the label, the note and the title are
   real text, so the prerendered HTML carries them.
   ───────────────────────────────────────────────────────────────── */
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from '@/components/c4/SiteLink';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/track';
import SeoDoorFace from '@/components/seo-copy/DoorFace';
import LogoDoorFace from '@/components/logo-design/DoorFace';
import { seoPackages, brandingPackages, logoTimeline } from '@/data/pricing';
import { gsap, EASE, revealHeading, useStaticMode } from './homeMotion';

// The SEO door quotes the published card, so it follows pricing.js.
const SEO_ONE_OFF_FROM = Math.min(...seoPackages.filter((p) => p.priceSuffix === 'one-off').map((p) => p.price));
const SEO_MONTHLY_FROM = Math.min(...seoPackages.filter((p) => /\/mo$/.test(p.priceLabel) && typeof p.price === 'number').map((p) => p.price));

/* So does the logo door: the lowest logo price, and the range of concepts
   the packages offer ("2 initial concepts", "Logo design (5 concepts, 4
   revisions)"). A rebuild redraws a logo you already have, so it offers no
   concepts and doesn't count. */
const LOGO_FROM = Math.min(...brandingPackages.filter((p) => typeof p.price === 'number').map((p) => p.price));

/* The two raster faces. scripts/door-faces.mjs makes every file, with its
   origin in the EXIF; the widths are the ones it writes. */
const ART = import.meta.glob('./assets/doors/*.{avif,webp}', { eager: true, query: '?url', import: 'default' });
const art = (name, w, ext) => ART[`./assets/doors/${name}-${w}.${ext}`];
const srcSet = (name, widths, ext) => widths.map((w) => `${art(name, w, ext)} ${w}w`).join(', ');

/* A face is 220 to 310px wide four across, up to about 455px two by two,
   and the art takes about half of a phone's face. */
const FACE_SIZES = '(min-width: 1024px) min(calc(25vw - 39px), 310px), (min-width: 640px) calc(50vw - 55px), calc(52vw - 25px)';

/* A slice of each home page hero, all cut 2756 wide from the 2x captures,
   each holding a whole headline and its intro, with every headline starting
   on the face's own margin (door-faces.mjs has the boxes). */
const STRIP_W = 2756;
const STRIPS = [
  { name: 'strip-aquasafe', h: 816 },
  { name: 'strip-brady', h: 876 },
  { name: 'strip-tidy', h: 668 },
];
const STRIP_SIZES = [480, 720, 960];
const LENS_SIZES = [360, 540, 720, 960];

function Picture({ name, widths, w, h, className }) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, widths, 'avif')} sizes={FACE_SIZES} />
      <img
        className={className}
        src={art(name, widths[0], 'webp')}
        srcSet={srcSet(name, widths, 'webp')}
        sizes={FACE_SIZES}
        width={w}
        height={h}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

const DOORS = [
  {
    key: 'web',
    face: 'web',
    faceTo: '/ServiceWeb',
    faceAria: 'Enter Web & Applications',
    tag: 'Web & Applications',
    note: 'Aqua-Safe, Brady, Tidy Gardens',
    word: 'Build a website',
    outcome:
      'Custom marketing sites, web apps and SaaS platforms that are fast, refined and built to convert. You own the codebase end-to-end.',
    fromPrice: 'From $500',
    timeframe: '2 to 3 weeks',
    primary: { label: 'See the web work', to: '/ServiceWeb' },
    secondary: { label: 'or start a web brief', to: '/start?service=web_design' },
  },
  {
    key: 'lens',
    face: 'lens',
    faceTo: '/Lens',
    faceAria: 'Enter C4 Lens',
    tag: 'C4 Lens',
    note: 'Shot for Sharp Bricklaying',
    word: 'Photography & video',
    outcome:
      'Photography and short-form video, a coherent visual system for Perth businesses ready to retire stock.',
    fromPrice: 'From $200',
    timeframe: 'Half / full-day shoots',
    primary: { label: 'Visit C4 Lens', to: '/Lens' },
    secondary: { label: 'or book a shoot', to: '/start?service=lens' },
  },
  {
    key: 'seo',
    face: 'seo',
    faceTo: '/seo-and-copywriting',
    faceAria: 'Enter SEO & Copywriting',
    tag: 'SEO & Copywriting',
    note: 'Example search',
    word: 'Get found on Google',
    outcome:
      'Technical fixes up front, then new articles every month, so you’re easier to find on Google. Website copy too, written plainly.',
    fromPrice: `From $${SEO_ONE_OFF_FROM}`,
    timeframe: `Or $${SEO_MONTHLY_FROM}/mo`,
    primary: { label: 'See SEO & copywriting', to: '/seo-and-copywriting' },
    secondary: { label: 'or start an SEO brief', to: '/start?service=seo' },
  },
  {
    key: 'logo',
    face: 'logo',
    faceTo: '/logo-design',
    faceAria: 'Enter Logo Design',
    tag: 'Logo Design',
    note: 'Our mark',
    word: 'Design a logo',
    outcome:
      'A logo that holds up from the sign out front to a 16-pixel browser tab, in colour and in one. Every file is yours once it’s paid.',
    fromPrice: `From $${LOGO_FROM}`,
    timeframe: logoTimeline,
    primary: { label: 'See logo design', to: '/logo-design' },
    secondary: { label: 'or start a logo brief', to: '/start?service=logo_design' },
  },
];

function DoorFaceArt({ kind }) {
  if (kind === 'web') {
    return (
      <span className="hm-strips">
        {STRIPS.map((s) => <Picture key={s.name} name={s.name} widths={STRIP_SIZES} w={STRIP_W} h={s.h} />)}
      </span>
    );
  }
  if (kind === 'lens') return <Picture name="lens-corner" widths={LENS_SIZES} w={1388} h={1536} className="hm-lens-photo" />;
  if (kind === 'logo') return <LogoDoorFace />;
  return <SeoDoorFace />;
}

export default function FourDoors() {
  const sectionRef = useRef(null);
  const h2Ref = useRef(null);
  const staticMode = useStaticMode();

  useLayoutEffect(() => {
    if (staticMode) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        revealHeading(h2Ref.current);
        const doors = gsap.utils.toArray('.hm-door', section);
        /* Opacity, not autoAlpha: autoAlpha hides the doors with
           visibility, and a hidden link can't take focus, so Tab from the
           hero skipped all four doors until a scroll had revealed them
           (found 9 Oct 2026). Focus landing in a door also finishes the
           reveal at once. */
        const tween = gsap.from(doors, {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: EASE,
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: section.querySelector('.hm-doors'),
            start: 'top 82%',
            once: true,
          },
        });
        const finish = () => { if (tween.progress() < 1) tween.progress(1); };
        section.addEventListener('focusin', finish);
        return () => {
          section.removeEventListener('focusin', finish);
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, section);

    return () => ctx.revert();
  }, [staticMode]);

  return (
    <section ref={sectionRef} aria-labelledby="home-products-heading" className="relative py-20 md:py-28" style={{ backgroundColor: 'var(--c4-bg)' }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <h2
            id="home-products-heading"
            ref={h2Ref}
            className="hm-h2 max-w-[24ch] text-[clamp(1.7rem,3.4vw,2.7rem)]"
          >
            Four services from one studio. Pick where to start.
          </h2>
          <p className="hm-sub max-w-[36ch] text-[13.5px]">
            Most clients start with one of these. Each card opens a short brief: fixed scope, transparent pricing, founder reply within a business day.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pt-10 md:px-12 md:pt-12">
        <div className="hm-doors">
          {DOORS.map((door) => (
            <article key={door.key} className="hm-door" data-proof>
              <Link
                to={door.faceTo}
                onClick={() => trackEvent('door_click', { target: door.key, detail: 'face' })}
                className={`hm-doorface hm-doorface--${door.face}`}
                aria-label={door.faceAria}
              >
                <span className="hm-art" aria-hidden="true"><DoorFaceArt kind={door.face} /></span>
                <span className="hm-door-tag">
                  <span className="hm-door-name">{door.tag}</span>
                  <span className="hm-door-note">{door.note}</span>
                </span>
                {/* The arrow is the same lucide icon the buttons use (it was a
                    text glyph until 9 Oct 2026), held to the last word by a
                    no-break space so it never wraps on its own. */}
                <h3 className="hm-door-word">
                  {door.word}{' '}<ArrowRight className="hm-door-arrow" strokeWidth={2.4} aria-hidden="true" />
                </h3>
              </Link>

              <div className="hm-doorinfo">
                <p>{door.outcome}</p>
                <div className="hm-door-meta">
                  <b>{door.fromPrice}</b>
                  <i aria-hidden="true">/</i>
                  <span>{door.timeframe}</span>
                </div>
                <div className="hm-door-ctas">
                  <Link to={door.primary.to} onClick={() => trackEvent('door_click', { target: door.key, detail: 'primary' })} className="hm-door-cta group">
                    {door.primary.label}
                    <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link to={door.secondary.to} onClick={() => trackEvent('door_click', { target: door.key, detail: 'secondary' })} className="hm-door-sec group">
                    {door.secondary.label}
                    <ArrowRight size={11} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
