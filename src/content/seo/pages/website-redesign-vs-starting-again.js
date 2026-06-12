/**
 * Comparison — Website redesign vs starting again.
 * Unique details: the URL-equity redirect-map explanation and the
 * keep/rebuild checklist; DS Racing Karts as a lived redesign example.
 */
export default {
  hero: {
    label: 'Honest Comparison',
    title: ['Website redesign', 'or start again from scratch?'],
    intro: [
      'The short answer: redesign when the foundations are sound and the problem is skin-deep; start again when you’re paying to renovate something that should be demolished. The good news either way — your content, your Google equity and your brand recognition can survive both paths if the job is done properly. Here’s how we make the call, including the checklist we run before quoting either.',
    ],
  },
  sections: [
    {
      kind: 'answer',
      body: [
        'Redesign if the site’s structure, content and platform are basically sound and it just looks dated or converts poorly. Start again if the platform fights every change, the code is unmaintainable, or fixing the real problems means touching everything anyway. The deciding question isn’t sentimental — it’s which path costs less to reach the site you actually need. Past a certain damage level, the rebuild is the cheap option.',
      ],
    },
    {
      kind: 'table',
      label: 'The checklist',
      heading: 'Which signs point which way?',
      head: ['Signal', 'Points to'],
      rows: [
        ['Looks dated, but pages rank and load fine', 'Redesign — keep the bones, refresh the skin'],
        ['Good content, bad structure and navigation', 'Redesign with restructuring — content carries across'],
        ['Every small change breaks something else', 'Start again — you’re paying maintenance on quicksand'],
        ['Platform abandoned, plugins unpatched for years', 'Start again — the risk now outweighs the sunk cost'],
        ['Slow on mobile no matter what gets optimised', 'Usually start again — speed is foundational, not cosmetic'],
        ['You can’t edit your own site anymore', 'Either — but fix the ownership problem this time'],
      ],
    },
    {
      kind: 'prose',
      label: 'The part people fear',
      heading: 'Will we lose our Google rankings?',
      body: [
        'Not if the migration is done properly — and this is the single most important paragraph on this page. Your rankings live at URLs. A rebuild that changes addresses without redirects orphans every one of them, and that’s where the horror stories come from. The fix is mechanical: a redirect map, every old URL pointed permanently at its successor, content carried or improved rather than discarded, and the sitemap resubmitted. Done right, rebuilds typically hold their rankings and then climb, because the new site is faster and better structured.',
        'When we rebuilt DS Racing Karts, the job was exactly this shape — a redesign that became a proper rebuild with a 499-product store attached, carrying the business across without dropping what it had earned.',
      ],
    },
    {
      kind: 'prose',
      label: 'The verdict',
      heading: 'Which is right for you?',
      body: [
        'Redesign when you like your platform, your content does its job, and the honest complaint is “it looks old” or “it doesn’t convert”. It’s the cheaper path when the foundations cooperate — often $1,500–$2,500 of focused work.',
        'Start again when you’re fighting the site instead of improving it. The sunk-cost instinct says salvage; the maths usually says a clean $1,500–$2,500 build beats $1,000 of patches on something you’ll replace within two years anyway. We’ll audit what you have and show you both numbers — sometimes the audit alone settles it.',
      ],
    },
  ],
  faqs: [
    {
      q: 'How much does a website redesign cost?',
      a: 'Comparable to a build, because honest redesigns are rebuilds wearing a friendlier name: $1,500–$2,500 for most business sites. Light cosmetic refreshes can come in under that; redesigns that secretly need replatforming cost the same as starting again — which is the point of auditing first.',
    },
    {
      q: 'How do you decide which to recommend?',
      a: 'A short audit: platform health, code quality, what ranks, what loads slowly, what you actually want the site to do. Then both paths priced side by side. The audit kills the guesswork — and if your current site is genuinely fine with a haircut, that’s what we’ll say.',
    },
    {
      q: 'Can we keep our content and just change the design?',
      a: 'If the content works, absolutely — good copy is expensive to recreate and Google already trusts it. It carries across, gets a light edit where the new structure demands it, and the redirect map keeps every page’s history attached to its new home.',
    },
    {
      q: 'Our last redesign tanked our traffic. Why?',
      a: 'Almost certainly missing redirects — URLs changed and nobody mapped the old ones, so Google met hundreds of dead ends and re-evaluated from scratch. It’s the most common, most avoidable rebuild injury, and recovering from it is its own project we’ve handled before.',
    },
    {
      q: 'How long does either path take?',
      a: 'Similar timelines: three to five weeks for most business sites either way, since redesigns spend on care what rebuilds spend on construction. The audit beforehand takes a few days and is the only part you should ever pay for before choosing a direction.',
    },
  ],
  cta: {
    heading: 'Not sure which side you’re on?',
    text: 'Send the site as it stands. We’ll audit it and reply with both numbers — renovate and rebuild — so the decision is maths, not vibes.',
  },
};
