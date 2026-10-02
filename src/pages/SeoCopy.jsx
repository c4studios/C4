/*
 * /seo-and-copywriting: SEO and copywriting as a service (Caleb, 2 Oct 2026:
 * "now that i'm moving c4 site off the website once it's ready to go, i think
 * we need to start advertising seo and copywriting as a service").
 *
 * In the Services menu now. When C4Site moves off, this takes its door on
 * the home page too.
 *
 * Three openings are built for Caleb to choose between (?layout=room |
 * answer | edit; see components/seo-copy/openings.jsx). Everything below the
 * opening is shared.
 *
 * Built from nothing but published facts: prices from pricing.js, quotes
 * from the site's own articles, and an invented example labelled as one.
 */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDocumentHead from '@/hooks/useDocumentHead';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { seoPackages, webDesignAddOns } from '@/data/pricing';
import { Shelf, AnswerDesk, TheEdit } from '@/components/seo-copy/openings';
import { Found, Read, ProofList, Close } from '@/components/seo-copy/sections';
import '@/components/seo-copy/seo-copy.css';

const LAYOUTS = ['room', 'answer', 'edit'];
const DEFAULT_LAYOUT = 'room';
const PATH = '/seo-and-copywriting';

export default function SeoCopy() {
  const [params] = useSearchParams();
  const asked = params.get('layout');
  const layout = LAYOUTS.includes(asked) ? asked : DEFAULT_LAYOUT;

  const jsonLd = useMemo(() => {
    const copy = webDesignAddOns.find((a) => a.name === 'Copywriting package');
    return [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'SEO & Copywriting', path: PATH },
      ]),
      serviceSchema({
        name: 'SEO',
        description: 'Technical SEO, on-page optimisation and monthly growth plans with articles, for Perth businesses.',
        url: PATH,
        serviceType: 'Search engine optimisation',
        offers: seoPackages.map((p) => ({ name: `SEO ${p.name} (${p.priceLabel}${p.priceSuffix ? `, ${p.priceSuffix}` : ''})`, price: p.price })),
      }),
      serviceSchema({
        name: 'Copywriting',
        description: 'Website copy and articles for Perth businesses, written plainly with every figure sourced.',
        url: PATH,
        serviceType: 'Copywriting',
        offers: copy ? [{ name: 'Copywriting package, with a website build', price: copy.price }] : [],
      }),
    ];
  }, []);

  useDocumentHead({
    title: 'SEO & Copywriting in Perth — C4 Studios',
    description:
      'SEO and copywriting for Perth businesses at published prices: one-off SEO from $400, monthly plans from $500, website copy $500 with a build.',
    path: PATH,
    jsonLd,
  });

  return (
    <div className="sc-page" data-layout={layout}>
      {layout === 'room' && <Shelf />}
      {layout === 'answer' && <AnswerDesk />}
      {layout === 'edit' && <TheEdit />}
      <Found />
      <Read />
      {layout !== 'room' && <ProofList />}
      <Close />
    </div>
  );
}
